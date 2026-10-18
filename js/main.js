/* ==========================================================================
   Sakura Sushi — shared site behaviour
   Loaded on every page, after translations.js and data.js, before cart.js
   and any page-specific script.
   ========================================================================== */

/* ---------------------------------------------------------------------
   Generic slide-in / modal panel engine.
   Any element with [data-open-panel="id"] opens #id; any element with
   [data-close-panel="id"] closes it. A single overlay dims the page
   while one or more panels are open.
   --------------------------------------------------------------------- */
const openPanels = new Set();

function openPanel(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("open");
  el.setAttribute("aria-hidden", "false");
  openPanels.add(id);
  const overlay = document.getElementById("overlay");
  if (overlay) overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  window.setTimeout(() => {
    const focusable = el.querySelector("input, textarea, select, button, a[href]");
    if (focusable) focusable.focus();
  }, 60);
}

function closePanel(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("open");
  el.setAttribute("aria-hidden", "true");
  openPanels.delete(id);
  if (openPanels.size === 0) {
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function closeAllPanels() {
  [...openPanels].forEach(closePanel);
}

/* ---------------------------------------------------------------------
   Toast (small confirmation message, e.g. "Added to cart")
   --------------------------------------------------------------------- */
let toastTimer = null;
function showToast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---------------------------------------------------------------------
   Cookie consent
   --------------------------------------------------------------------- */
const COOKIE_KEY = "sakura_cookie_consent";

function getCookieConsent() {
  try { return JSON.parse(localStorage.getItem(COOKIE_KEY)); } catch (e) { return null; }
}

function saveCookieConsent(consent) {
  try { localStorage.setItem(COOKIE_KEY, JSON.stringify(consent)); } catch(e) {}
}

function initCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  if (!banner) return;
  const consent = getCookieConsent();

  if (!consent) {
    window.setTimeout(() => banner.classList.add("open"), 900);
  }

  document.getElementById("cookie-accept")?.addEventListener("click", () => {
    saveCookieConsent({ necessary: true, analytics: true, marketing: true });
    banner.classList.remove("open");
    closePanel("cookie-preferences-modal");
  });

  document.getElementById("cookie-preferences-btn")?.addEventListener("click", () => {
    const saved = getCookieConsent() || { necessary: true, analytics: false, marketing: false };
    const analyticsBox = document.getElementById("cookie-analytics");
    const marketingBox = document.getElementById("cookie-marketing");
    if (analyticsBox) analyticsBox.checked = !!saved.analytics;
    if (marketingBox) marketingBox.checked = !!saved.marketing;
    openPanel("cookie-preferences-modal");
  });

  document.getElementById("cookie-save-preferences")?.addEventListener("click", () => {
    const analyticsBox = document.getElementById("cookie-analytics");
    const marketingBox = document.getElementById("cookie-marketing");
    saveCookieConsent({
      necessary: true,
      analytics: !!analyticsBox?.checked,
      marketing: !!marketingBox?.checked
    });
    closePanel("cookie-preferences-modal");
    banner.classList.remove("open");
  });
}

/* ---------------------------------------------------------------------
   Mobile nav toggle + active link
   --------------------------------------------------------------------- */
function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll(".main-nav-link").forEach((link) => {
      if (link.getAttribute("data-page") === page) {
        link.setAttribute("aria-current", "page");
      }
    });
  }
}

/* ---------------------------------------------------------------------
   Sakura petals — a single ambient, decorative moment in the hero.
   Skipped entirely for prefers-reduced-motion.
   --------------------------------------------------------------------- */
function initPetals() {
  const field = document.querySelector(".hero-petals");
  if (!field) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const count = 14;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "%";
    petal.style.animationDuration = 9 + Math.random() * 8 + "s";
    petal.style.animationDelay = Math.random() * 10 + "s";
    petal.style.opacity = String(0.5 + Math.random() * 0.4);
    petal.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
    field.appendChild(petal);
  }
}

/* ---------------------------------------------------------------------
   Wire-up
   --------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initPetals();
  initCookieBanner();

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open-panel]");
    if (opener) {
      openPanel(opener.getAttribute("data-open-panel"));
    }
    const closer = e.target.closest("[data-close-panel]");
    if (closer) {
      closePanel(closer.getAttribute("data-close-panel"));
    }
  });

  document.getElementById("overlay")?.addEventListener("click", closeAllPanels);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllPanels();
  });
});
