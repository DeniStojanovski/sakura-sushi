/* ==========================================================================
   Sakura Sushi — "Izakaya After Dark" UI effects
   Safety rules:
   • The noren overlay is pointer-events:none by default (CSS).
     It is NEVER responsible for showing/hiding page content.
   • Every effect is wrapped in try/catch so one crash cannot stop others.
   • pageshow (bfcache) handler resets all transient state.
   • A 2-second failsafe unconditionally removes the noren and reveals all.
   ========================================================================== */

'use strict';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch  = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ── safe sessionStorage wrapper ──────────────────────────────────────────── */
const session = {
  get: (k)    => { try { return sessionStorage.getItem(k); } catch(e) { return null; } },
  set: (k, v) => { try { sessionStorage.setItem(k, v); } catch(e) {} }
};

/* ── unconditional noren cleanup ─────────────────────────────────────────── */
/**
 * Remove the noren curtain from the interaction stack entirely.
 * Called by the failsafe timer, by initNoren, and by pageshow.
 * Must be safe to call multiple times.
 */
function collapseNoren() {
  try {
    const el = document.getElementById('noren-curtain');
    if (!el) return;
    el.classList.remove('noren-active');
    el.style.pointerEvents = 'none';
    el.style.visibility    = 'hidden';
    el.style.opacity       = '0';
  } catch(e) {}
}

/* ── failsafe: max 2 s after DOMContentLoaded page MUST be usable ─────────── */
(function installFailsafe() {
  const run = () => { try { collapseNoren(); } catch(e) {} };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(run, 2000), { once: true });
  } else {
    setTimeout(run, 2000);
  }
})();

/* ── bfcache / pageshow ────────────────────────────────────────────────────── */
window.addEventListener('pageshow', (e) => {
  if (!e.persisted) return; // only run for bfcache restores
  try { collapseNoren(); } catch(ex) {}
  try {
    // Re-reveal any still-hidden [data-reveal] elements
    document.querySelectorAll('[data-reveal]:not(.visible)').forEach(el => {
      el.classList.add('visible');
    });
  } catch(ex) {}
}, { passive: true });

/* ── NOREN CURTAIN INTRO ───────────────────────────────────────────────────── */
const NOREN_PLAY = 'always'; // 'always' = every full page load; 'once' = first visit only
(function initNoren() {
  try {
    const curtain = document.getElementById('noren-curtain');
    if (!curtain) return;

    // Only play on the home page
    const isHome = document.body.dataset.page === 'home';
    if (!isHome || reduced) {
      collapseNoren();
      return;
    }

    // NOREN_PLAY='always' — skip sessionStorage check; play on every full load
    if (NOREN_PLAY === 'once') {
      const alreadySeen = session.get('sakura_noren_done') === '1';
      if (alreadySeen) { collapseNoren(); return; }
    }

    // Play the animation — pointer-events stay none (purely decorative)
    curtain.style.visibility = 'visible';
    curtain.style.opacity = '1';
    curtain.classList.add('noren-active');

    function dismissNoren() {
      curtain.classList.add('noren-leaving', 'open');
      session.set('sakura_noren_done', '1');

      // Listen for panel transition end, then fully hide
      const panel = curtain.querySelector('.noren-panel');
      if (panel) {
        panel.addEventListener('transitionend', () => { collapseNoren(); }, { once: true });
      }
      // Fallback: force hide after 0.9s even if transitionend doesn't fire
      setTimeout(() => { collapseNoren(); }, 900);
    }

    // Logo fades out (0.2s) just before the panels slide apart (0.7s):
    // ~1.35s total
    const tLogo = setTimeout(() => curtain.classList.add('noren-leaving'), 500);
    const t = setTimeout(dismissNoren, 650);
    const skip = () => { clearTimeout(tLogo); clearTimeout(t); dismissNoren(); };
    // Skip on click or any key
    curtain.addEventListener('click', skip, { once: true });
    document.addEventListener('keydown', skip, { once: true });
  } catch(e) {
    collapseNoren(); // if anything goes wrong, make sure it's gone
  }
})();

/* ── HEADER SHRINK ON SCROLL ─────────────────────────────────────────────── */
(function initHeaderShrink() {
  try {
    const header = document.getElementById('site-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  } catch(e) {}
})();

/* ── SCROLL REVEAL ────────────────────────────────────────────────────────── */
let _revealIO = null;
(function initReveal() {
  try {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    if (reduced || !window.IntersectionObserver) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }

    _revealIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          _revealIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    els.forEach(el => _revealIO.observe(el));
  } catch(e) {
    // Fallback: show everything
    try { document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible')); } catch(_) {}
  }
})();

// Re-observe elements added dynamically after initReveal ran
window.sakuraObserveReveal = function(container) {
  try {
    if (!_revealIO) return;
    (container || document).querySelectorAll('[data-reveal]:not(.visible)').forEach(el => {
      _revealIO.observe(el);
    });
  } catch(e) {}
};

/* ── COUNT-UP ANIMATION — removed, handled by home.js initStatCounters() ── */

/* ── 3D TILT on dish cards (delegated for dynamic content) ──────────────── */
(function initTilt() {
  try {
    if (reduced || isTouch) return;
    document.addEventListener('mousemove', e => {
      const card = e.target.closest('.dish-card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateZ(8px)`;
    });
    document.addEventListener('mouseleave', e => {
      const card = e.target.closest('.dish-card');
      if (card) card.style.transform = '';
    }, true);
  } catch(e) {}
})();

/* ── EMBER PARTICLE CANVAS ───────────────────────────────────────────────── */
(function initEmbers() {
  try {
    if (reduced) return;
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // canvas broken — silently skip
    const MAX = isTouch ? 16 : 40;
    let W, H, particles = [], paused = false;

    function resize() {
      const parent = canvas.parentElement || canvas;
      W = canvas.width  = parent.offsetWidth  || canvas.offsetWidth;
      H = canvas.height = parent.offsetHeight || canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      paused = document.hidden;
      if (!paused) requestAnimationFrame(loop);
    });

    function spawn() {
      return {
        x: Math.random() * W,
        y: H + 10,
        r: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 1.2 + 0.5),
        life: 1,
        decay: Math.random() * 0.004 + 0.002,
        hue: Math.random() < 0.6 ? 355 : 35
      };
    }
    for (let i = 0; i < MAX; i++) { const p = spawn(); p.y = Math.random() * H; particles.push(p); }

    function loop() {
      if (paused) return;
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.x  += p.vx + Math.sin(Date.now() * 0.001 + i) * 0.15;
        p.y  += p.vy;
        p.life -= p.decay;
        if (p.life <= 0 || p.y < -10) { particles[i] = spawn(); return; }
        ctx.save();
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        ctx.globalAlpha = p.life * (isDark ? 0.7 : 0.5);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        if (isDark) {
          ctx.fillStyle = p.hue === 35 ? 'hsla(35,90%,65%,1)' : 'hsla(345,100%,70%,1)';
          ctx.shadowBlur  = 8;
          ctx.shadowColor = p.hue === 35 ? '#e8a030' : '#ff4d8f';
        } else {
          ctx.fillStyle = p.hue === 35 ? 'hsla(28,80%,45%,1)' : 'hsla(340,55%,48%,1)';
          ctx.shadowBlur  = 4;
          ctx.shadowColor = p.hue === 35 ? '#a05c08' : '#c1547a';
        }
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  } catch(e) {}
})();

/* ── CUSTOM CURSOR ───────────────────────────────────────────────────────── */
(function initCursor() {
  try {
    if (reduced || isTouch) return;
    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function tick() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.left  = mx + 'px';  dot.style.top  = my + 'px';
      ring.style.left = rx + 'px';  ring.style.top = ry + 'px';
      requestAnimationFrame(tick);
    })();
  } catch(e) {}
})();

/* ── MAGNETIC BUTTONS (delegated for dynamic content) ───────────────────── */
(function initMagnetic() {
  try {
    if (reduced || isTouch) return;
    document.addEventListener('mousemove', e => {
      const btn = e.target.closest('.btn-primary');
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.3;
      const y = (e.clientY - r.top  - r.height / 2) * 0.3;
      btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
    });
    document.addEventListener('mouseleave', e => {
      const btn = e.target.closest('.btn-primary');
      if (btn) btn.style.transform = '';
    }, true);
  } catch(e) {}
})();

/* ── PARALLAX HERO ───────────────────────────────────────────────────────── */
(function initParallax() {
  try {
    if (reduced || isTouch) return;
    const heroArt = document.querySelector('.hero-art');
    if (!heroArt) return;
    window.addEventListener('scroll', () => {
      heroArt.style.transform = `translateY(calc(-50% + ${window.scrollY * 0.2}px))`;
    }, { passive: true });
  } catch(e) {}
})();

/* ── CHEF CARD FLIP (delegated for dynamic content) ─────────────────────── */
(function initChefFlip() {
  try {
    document.addEventListener('click', e => {
      const card = e.target.closest('.chef-card');
      if (card) card.classList.toggle('flipped');
    });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.chef-card');
      if (card) { e.preventDefault(); card.classList.toggle('flipped'); }
    });
  } catch(e) {}
})();

/* ── MARQUEE ─────────────────────────────────────────────────────────────── */
(function initMarquee() {
  try {
    const track = document.querySelector('.marquee-track');
    if (!track) return;
    Array.from(track.children).forEach(child => track.appendChild(child.cloneNode(true)));
  } catch(e) {}
})();

/* ── FOOTER OPEN/CLOSED SIGN ─────────────────────────────────────────────── */
(function initFooterSign() {
  try {
    const sign = document.getElementById('footer-open-sign');
    if (!sign) return;
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    const open = h >= 11 && h < 23;
    const lang = (typeof getLang === 'function') ? getLang() : 'en';
    if (!open) {
      sign.classList.add('closed');
      const txt = sign.querySelector('.footer-sign-text');
      if (txt) txt.textContent = lang === 'mk' ? 'Затворено' : 'Closed';
    }
  } catch(e) {}
})();
