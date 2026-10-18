/* ==========================================================================
   Sakura Sushi — account page logic
   ========================================================================== */

/* ------------------------------------------------------------------
   Auth guard: redirect if not logged in
   ------------------------------------------------------------------ */
(function () {
  if (typeof authGetCurrentUser === 'function' && !authGetCurrentUser()) {
    const next = encodeURIComponent(window.location.pathname.split('/').pop() || 'account.html');
    window.location.replace('login.html?next=' + next);
  }
})();

/* ------------------------------------------------------------------
   Tab switching
   ------------------------------------------------------------------ */
const ACC_TABS = [
  { btn: 'acc-tab-profile',      panel: 'acc-panel-profile' },
  { btn: 'acc-tab-orders',       panel: 'acc-panel-orders' },
  { btn: 'acc-tab-favorites',    panel: 'acc-panel-favorites' },
  { btn: 'acc-tab-reservations', panel: 'acc-panel-reservations' },
];

function selectAccountTab(targetBtnId) {
  ACC_TABS.forEach(({ btn, panel }) => {
    const b = document.getElementById(btn);
    const p = document.getElementById(panel);
    const active = btn === targetBtnId;
    if (b) b.setAttribute('aria-selected', String(active));
    if (p) p.hidden = !active;
  });
}

function initAccountTabs() {
  ACC_TABS.forEach(({ btn }) => {
    const el = document.getElementById(btn);
    if (el) el.addEventListener('click', () => selectAccountTab(btn));
  });

  // Support ?tab=orders etc from URL
  const params = new URLSearchParams(window.location.search);
  const tabParam = params.get('tab');
  if (tabParam) {
    const match = ACC_TABS.find(t => t.panel.includes(tabParam));
    if (match) selectAccountTab(match.btn);
  }
}

/* ------------------------------------------------------------------
   Helper: format an ISO date string to a short readable date
   ------------------------------------------------------------------ */
function formatOrderDate(iso, lang) {
  try {
    const d = new Date(iso);
    const months = {
      en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      mk: ['јан','фев','мар','апр','мај','јун','јул','авг','сеп','окт','ное','дек'],
    };
    return `${d.getDate()} ${months[lang][d.getMonth()]} ${d.getFullYear()}`;
  } catch (e) {
    return iso || '';
  }
}

/* ------------------------------------------------------------------
   Profile form
   ------------------------------------------------------------------ */
function initProfileForm(user) {
  const form = document.getElementById('profile-form');
  if (!form) return;

  // Pre-fill
  const fields = { 'profile-name': 'name', 'profile-phone': 'phone', 'profile-address': 'defaultAddress', 'profile-city': 'defaultCity' };
  Object.entries(fields).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.value = user[key] || '';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const lang = getLang();
    const nameEl = document.getElementById('profile-name');
    const errEl  = document.getElementById('profile-name-error');
    if (!nameEl.value.trim()) {
      nameEl.classList.add('invalid');
      if (errEl) errEl.textContent = t('account.fieldRequired', lang);
      return;
    }
    nameEl.classList.remove('invalid');
    if (errEl) errEl.textContent = '';

    authUpdateProfile(user.id, {
      name:           nameEl.value.trim(),
      phone:          (document.getElementById('profile-phone')   || {}).value || '',
      defaultAddress: (document.getElementById('profile-address') || {}).value || '',
      defaultCity:    (document.getElementById('profile-city')    || {}).value || '',
    });

    // Refresh greeting
    const newUser = authGetCurrentUser();
    const greeting = document.getElementById('account-greeting');
    if (greeting && newUser) greeting.textContent = escapeHtml(newUser.name.split(' ')[0]);

    showToast(t('account.profileSaved', lang));
  });
}

/* ------------------------------------------------------------------
   Change password form
   ------------------------------------------------------------------ */
function initChangePasswordForm(user) {
  const form = document.getElementById('change-password-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = getLang();
    const current = document.getElementById('pw-current').value;
    const newPw   = document.getElementById('pw-new').value;
    const confirm = document.getElementById('pw-confirm').value;

    const clearErrors = () => {
      ['pw-current-error','pw-new-error','pw-confirm-error'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
      });
      ['pw-current','pw-new','pw-confirm'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('invalid');
      });
    };
    clearErrors();

    let valid = true;
    if (!current) { setError('pw-current','pw-current-error',t('account.fieldRequired',lang)); valid=false; }
    if (!newPw)   { setError('pw-new','pw-new-error',t('account.fieldRequired',lang)); valid=false; }
    else if (newPw.length < 8) { setError('pw-new','pw-new-error',t('account.passwordTooShort',lang)); valid=false; }
    if (newPw !== confirm) { setError('pw-confirm','pw-confirm-error',t('auth.passwordsMismatch',lang)); valid=false; }
    if (!valid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const result = await authChangePassword(user.id, current, newPw);
    submitBtn.disabled = false;

    if (!result.ok) {
      setError('pw-current','pw-current-error', t(result.error || 'account.wrongCurrentPassword', lang));
      return;
    }
    form.reset();
    showToast(t('account.passwordChanged', lang));
  });
}

function setError(inputId, errorId, msg) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  if (inp) inp.classList.add('invalid');
  if (err) err.textContent = msg;
}

/* ------------------------------------------------------------------
   Delete account form
   ------------------------------------------------------------------ */
function initDeleteAccountForm(user) {
  const form = document.getElementById('delete-account-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const lang    = getLang();
    const input   = document.getElementById('delete-confirm-input');
    const errEl   = document.getElementById('delete-confirm-error');

    if (!input || input.value !== 'DELETE') {
      if (input) input.classList.add('invalid');
      if (errEl) errEl.textContent = t('account.deleteConfirmMismatch', lang);
      return;
    }
    if (input) input.classList.remove('invalid');
    if (errEl) errEl.textContent = '';

    authDeleteAccount(user.id);
    showToast(t('account.accountDeleted', lang));
    window.location.href = 'index.html';
  });
}

/* ------------------------------------------------------------------
   Order history
   ------------------------------------------------------------------ */
function renderOrderHistory(user) {
  const container = document.getElementById('order-history');
  if (!container) return;
  const lang   = getLang();
  const orders = authGetOrders(user.id);

  if (orders.length === 0) {
    container.innerHTML = `<p class="text-sm" style="color:var(--ink-soft)">${escapeHtml(t('account.emptyOrders', lang))}</p>`;
    return;
  }

  container.innerHTML = orders.map(order => {
    const lines = (order.lines || [])
      .map(l => `<div class="flex justify-between text-sm py-0.5"><span>${escapeHtml(l.qty + '\u00d7 ' + l.name)}</span><span>${formatPrice(l.price * l.qty)}</span></div>`)
      .join('');
    return `
    <div class="order-card">
      <div class="order-card-header">
        <div>
          <span class="order-card-id">${escapeHtml(order.id)}</span>
          <span class="order-card-date ml-3">${escapeHtml(formatOrderDate(order.date, lang))}</span>
        </div>
        <span class="order-card-total">${formatPrice(order.total)}</span>
      </div>
      <div class="mb-2">${lines}</div>
      <button type="button" class="btn btn-outline btn-sm" data-reorder='${JSON.stringify(order.lines || [])}'
        data-i18n="account.reorder">${t('account.reorder', lang)}</button>
    </div>`;
  }).join('');
}

/* ------------------------------------------------------------------
   Favourites list
   ------------------------------------------------------------------ */
function renderFavoritesList(user) {
  const container = document.getElementById('favorites-list');
  if (!container) return;
  const lang  = getLang();
  const favs  = authGetFavorites(user.id);
  const items = favs.map(id => (typeof findMenuItem === 'function' ? findMenuItem(id) : null)).filter(Boolean);

  if (items.length === 0) {
    container.innerHTML = `<p class="text-sm" style="color:var(--ink-soft)">${escapeHtml(t('account.emptyFavorites', lang))}</p>`;
    return;
  }

  container.innerHTML = `<div class="grid sm:grid-cols-2 gap-4">` + items.map(item => `
    <div class="order-card flex gap-4 items-center">
      <img src="${escapeHtml(item.icon)}" alt="${escapeHtml(item[lang].name)}" width="48" height="48" style="flex-shrink:0">
      <div class="flex-1">
        <p class="font-semibold" style="color:var(--ink)">${escapeHtml(item[lang].name)}</p>
        <p class="text-sm" style="color:var(--sakura)">${formatPrice(item.price)}</p>
      </div>
      <button type="button" class="btn btn-outline btn-sm" data-fav-add="${escapeHtml(item.id)}"
        data-i18n="account.addToCart">${t('account.addToCart', lang)}</button>
    </div>`).join('') + `</div>`;
}

/* ------------------------------------------------------------------
   Reservations list
   ------------------------------------------------------------------ */
function renderAccountReservations(user) {
  const container = document.getElementById('account-reservations-list');
  if (!container) return;
  const lang = getLang();
  const list = authGetReservations(user.id);

  if (list.length === 0) {
    container.innerHTML = `<p class="text-sm" style="color:var(--ink-soft)">${escapeHtml(t('account.emptyReservations', lang))}</p>`;
    return;
  }

  container.innerHTML = list.map(r => {
    const isCancelled = r.status === 'cancelled';
    return `
    <div class="order-card" style="${isCancelled ? 'opacity:0.55' : ''}">
      <div class="order-card-header">
        <div>
          <span class="order-card-id">${escapeHtml(r.id)}</span>
          <span class="order-card-date ml-3">${escapeHtml(r.date)} ${escapeHtml(r.time)}</span>
        </div>
        <span class="text-sm">${escapeHtml(r.guests)} ${t('account.guests', lang)}</span>
      </div>
      <p class="text-sm" style="color:var(--ink-soft)">${escapeHtml(r.name)}</p>
      ${isCancelled
        ? `<span class="text-xs" style="color:var(--danger)">Cancelled</span>`
        : `<button type="button" class="btn btn-outline btn-sm mt-2" data-cancel-res="${escapeHtml(r.id)}"
            data-i18n="account.cancelReservation">${t('account.cancelReservation', lang)}</button>`}
    </div>`;
  }).join('');
}

/* ------------------------------------------------------------------
   Event delegation for Reorder, Fav-add, Cancel-reservation
   ------------------------------------------------------------------ */
function initAccountActions(user) {
  document.addEventListener('click', (e) => {
    const lang = getLang();

    // Reorder
    const reorderBtn = e.target.closest('[data-reorder]');
    if (reorderBtn) {
      try {
        const lines = JSON.parse(reorderBtn.getAttribute('data-reorder'));
        lines.forEach(l => {
          if (l.name && typeof addToCart === 'function') {
            // find item id by matching name in current language against menuData
            const found = (typeof menuData !== 'undefined' ? menuData : [])
              .find(m => m.en.name === l.name || m.mk.name === l.name);
            if (found) addToCart(found.id, l.qty || 1);
          }
        });
        if (typeof openPanel === 'function') openPanel('cart-drawer');
        showToast(t('account.reorderToast', lang));
      } catch (err) { /* ignore */ }
      return;
    }

    // Add favourite to cart
    const favAddBtn = e.target.closest('[data-fav-add]');
    if (favAddBtn) {
      const id = favAddBtn.getAttribute('data-fav-add');
      if (typeof addToCart === 'function') addToCart(id, 1);
      if (typeof openPanel === 'function') openPanel('cart-drawer');
      const item = typeof findMenuItem === 'function' ? findMenuItem(id) : null;
      if (item) showToast(`${t('menuPage.added', lang)}: ${item[lang].name}`);
      return;
    }

    // Cancel reservation
    const cancelBtn = e.target.closest('[data-cancel-res]');
    if (cancelBtn) {
      const resId = cancelBtn.getAttribute('data-cancel-res');
      authCancelReservation(user.id, resId);
      showToast(t('account.reservationCancelled', lang));
      renderAccountReservations(user);
    }
  });
}

/* ------------------------------------------------------------------
   Re-render on language change
   ------------------------------------------------------------------ */
function rerenderAccount() {
  const user = authGetCurrentUser();
  if (!user) return;
  renderOrderHistory(user);
  renderFavoritesList(user);
  renderAccountReservations(user);
}

/* ------------------------------------------------------------------
   Init
   ------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  const user = authGetCurrentUser();
  if (!user) return; // guard already redirected, but be safe

  initAccountTabs();
  initProfileForm(user);
  initChangePasswordForm(user);
  initDeleteAccountForm(user);
  renderOrderHistory(user);
  renderFavoritesList(user);
  renderAccountReservations(user);
  initAccountActions(user);
});

document.addEventListener('sakura:langchange', rerenderAccount);
