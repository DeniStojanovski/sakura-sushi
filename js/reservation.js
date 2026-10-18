/* ==========================================================================
   Sakura Sushi — reservation page logic
   ========================================================================== */

const TOTAL_SEATS = 8;

/* ------------------------------------------------------------------
   Populate the time select with 30-min slots 12:00 – 22:30
   ------------------------------------------------------------------ */
function populateTimeSelect() {
  const sel = document.getElementById('reservation-time');
  if (!sel) return;
  sel.innerHTML = '';
  for (let h = 12; h <= 22; h++) {
    ['00', '30'].forEach(m => {
      if (h === 22 && m === '30') { /* last seating 22:30 — include it */ }
      const val = `${String(h).padStart(2,'0')}:${m}`;
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val;
      sel.appendChild(opt);
    });
  }
  // Add 22:30 last if not already added (loop covers up to 22:30 already)
}

/* ------------------------------------------------------------------
   Simulated availability
   Deterministic by hashing date+time so it's consistent across page loads.
   Returns seats already taken (0-7) for a given date+time slot.
   ------------------------------------------------------------------ */
function simulatedSeatsTaken(date, time) {
  const str = date + '|' + time;
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
    h = h >>> 0;
  }
  // Map to 0–6 taken seats (leaving at least 2 free most of the time)
  return h % 7; // 0..6
}

function getAvailableSeats(date, time) {
  return TOTAL_SEATS - simulatedSeatsTaken(date, time);
}

/* ------------------------------------------------------------------
   Show availability indicator
   ------------------------------------------------------------------ */
function updateAvailability() {
  const dateEl  = document.getElementById('reservation-date');
  const timeEl  = document.getElementById('reservation-time');
  const display = document.getElementById('availability-display');
  if (!dateEl || !timeEl || !display) return;

  const date = dateEl.value;
  const time = timeEl.value;
  if (!date || !time) { display.innerHTML = ''; return; }

  const lang      = getLang();
  const available = getAvailableSeats(date, time);

  if (available <= 0) {
    display.innerHTML = `<span style="color:var(--danger);font-weight:600;font-size:0.85rem">✗ ${escapeHtml(t('reservation.slotsFull', lang))}</span>`;
  } else {
    display.innerHTML = `<span style="color:var(--matcha);font-weight:600;font-size:0.85rem">✓ ${available} ${escapeHtml(t('reservation.slotsAvailable', lang))}</span>`;
  }
}

/* ------------------------------------------------------------------
   Generate a reservation ID
   ------------------------------------------------------------------ */
function generateResId() {
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SKR-RES-${rand}`;
}

/* ------------------------------------------------------------------
   Generate an .ics calendar file and trigger download
   ------------------------------------------------------------------ */
function downloadIcs(res) {
  // RFC 5545 basic VEVENT
  const startDate = res.date.replace(/-/g, '');
  const [h, m]    = res.time.split(':');
  const endH      = String((parseInt(h) + 2) % 24).padStart(2, '0'); // 2h booking
  const dtstart   = `${startDate}T${h}${m}00`;
  const dtend     = `${startDate}T${endH}${m}00`;
  const now       = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sakura Sushi//Reservation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${res.id}@sakurasushi.mk`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:Sakura Sushi — Reservation ${res.id}`,
    `DESCRIPTION:${res.guests} guest(s) at the counter. Ref: ${res.id}`,
    'LOCATION:12 Makedonija St\\, 1000 Skopje',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `sakura-reservation-${res.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------
   Show confirmation after successful submit
   ------------------------------------------------------------------ */
let lastReservation = null;

function showReservationConfirmation(res) {
  lastReservation = res;
  const form    = document.getElementById('reservation-form-wrap');
  const confirm = document.getElementById('reservation-confirmation');
  if (form)    form.hidden    = true;
  if (confirm) confirm.hidden = false;

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('res-confirm-id',     res.id);
  setEl('res-confirm-date',   res.date);
  setEl('res-confirm-time',   res.time);
  setEl('res-confirm-guests', res.guests);

  // Stamp animation
  const stamp = document.getElementById('res-stamp');
  if (stamp) {
    stamp.classList.remove('stamped');
    void stamp.offsetWidth;
    stamp.classList.add('stamped');
  }

  // Login prompt: hide if user is logged in
  const prompt = document.getElementById('res-login-prompt');
  if (prompt && typeof authGetCurrentUser === 'function' && authGetCurrentUser()) {
    prompt.hidden = true;
  }
}

/* ------------------------------------------------------------------
   Form validation & submit
   ------------------------------------------------------------------ */
function setResError(inputId, errorId, msg) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  if (inp) inp.classList.toggle('invalid', !!msg);
  if (err) err.textContent = msg || '';
}

function initReservationForm() {
  const form = document.getElementById('reservation-form');
  if (!form) return;

  // Min date = today
  const dateInput = document.getElementById('reservation-date');
  if (dateInput) {
    const today = new Date().toISOString().slice(0, 10);
    dateInput.setAttribute('min', today);
  }

  // Prefill from profile if logged in
  if (typeof authGetCurrentUser === 'function') {
    const user = authGetCurrentUser();
    if (user) {
      const nameEl  = document.getElementById('reservation-name');
      const emailEl = document.getElementById('reservation-email');
      const phoneEl = document.getElementById('reservation-phone');
      if (nameEl  && !nameEl.value)  nameEl.value  = user.name  || '';
      if (emailEl && !emailEl.value) emailEl.value = user.email || '';
      if (phoneEl && !phoneEl.value) phoneEl.value = user.phone || '';
    }
  }

  // Update availability when date or time changes
  const timeEl = document.getElementById('reservation-time');
  if (dateInput) dateInput.addEventListener('change', updateAvailability);
  if (timeEl)    timeEl.addEventListener('change', updateAvailability);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const lang = getLang();

    const date   = (document.getElementById('reservation-date')   || {}).value || '';
    const time   = (document.getElementById('reservation-time')   || {}).value || '';
    const guests = (document.getElementById('reservation-guests') || {}).value || '';
    const name   = ((document.getElementById('reservation-name')  || {}).value || '').trim();
    const email  = ((document.getElementById('reservation-email') || {}).value || '').trim();

    // Clear errors
    ['reservation-date','reservation-time','reservation-guests','reservation-name','reservation-email'].forEach(id => {
      setResError(id, id + '-error', '');
    });
    const genErrEl = document.getElementById('reservation-general-error');
    if (genErrEl) genErrEl.textContent = '';

    let valid = true;

    // Date validation
    if (!date) {
      setResError('reservation-date','reservation-date-error', t('reservation.fieldRequired', lang)); valid = false;
    } else {
      const d = new Date(date + 'T00:00:00');
      const today = new Date(); today.setHours(0,0,0,0);
      if (d < today) {
        setResError('reservation-date','reservation-date-error', t('reservation.pastDate', lang)); valid = false;
      } else if (d.getDay() === 1) { // Monday = 1
        setResError('reservation-date','reservation-date-error', t('reservation.mondayClosed', lang)); valid = false;
      }
    }

    // Time validation
    if (!time) {
      setResError('reservation-time','reservation-time-error', t('reservation.fieldRequired', lang)); valid = false;
    }

    // Guests
    const guestsNum = parseInt(guests, 10);
    if (!guests || isNaN(guestsNum) || guestsNum < 1 || guestsNum > 8) {
      setResError('reservation-guests','reservation-guests-error', t('reservation.guestsRange', lang)); valid = false;
    }

    // Name
    if (!name) { setResError('reservation-name','reservation-name-error', t('reservation.fieldRequired', lang)); valid = false; }

    // Email
    if (!email) {
      setResError('reservation-email','reservation-email-error', t('reservation.fieldRequired', lang)); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setResError('reservation-email','reservation-email-error', t('reservation.emailInvalid', lang)); valid = false;
    }

    if (!valid) return;

    // Check availability
    const available = getAvailableSeats(date, time);
    if (available < guestsNum) {
      if (genErrEl) genErrEl.textContent = t('reservation.noSeats', lang);
      return;
    }

    const notes = ((document.getElementById('reservation-notes') || {}).value || '').trim();
    const phone = ((document.getElementById('reservation-phone') || {}).value || '').trim();

    const res = {
      id:     generateResId(),
      date,
      time,
      guests: guestsNum,
      name,
      email,
      phone,
      notes,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Save to user account if logged in
    if (typeof authGetCurrentUser === 'function' && typeof authSaveReservation === 'function') {
      const user = authGetCurrentUser();
      if (user) authSaveReservation(user.id, res);
    }

    showReservationConfirmation(res);
  });
}

/* ------------------------------------------------------------------
   .ics and new-reservation buttons
   ------------------------------------------------------------------ */
function initConfirmationButtons() {
  document.getElementById('res-ics-btn')?.addEventListener('click', () => {
    if (lastReservation) downloadIcs(lastReservation);
  });

  document.getElementById('res-new-btn')?.addEventListener('click', () => {
    const form    = document.getElementById('reservation-form-wrap');
    const confirm = document.getElementById('reservation-confirmation');
    const f       = document.getElementById('reservation-form');
    if (form)    form.hidden    = false;
    if (confirm) confirm.hidden = true;
    if (f)       f.reset();
    lastReservation = null;
    const avail = document.getElementById('availability-display');
    if (avail) avail.innerHTML = '';
    document.getElementById('reservation-date')?.focus();
  });
}

/* ------------------------------------------------------------------
   Init
   ------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  populateTimeSelect();
  initReservationForm();
  initConfirmationButtons();
});
