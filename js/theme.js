/* ==========================================================================
   Sakura Sushi — Theme persistence
   Storage key: "sakura_theme" ("dark" | "light"). Default: "dark".
   Does NOT auto-follow prefers-color-scheme.
   ========================================================================== */
'use strict';

const THEME_KEY = 'sakura_theme';
const THEME_META_COLOR = { dark: '#0d0b0f', light: '#f6efe3' };

function _readTheme() {
  try { return localStorage.getItem(THEME_KEY) || 'dark'; } catch(e) { return 'dark'; }
}

function _saveTheme(t) {
  try { localStorage.setItem(THEME_KEY, t); } catch(e) {}
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  // Update meta theme-color
  try {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
    meta.content = THEME_META_COLOR[theme] || THEME_META_COLOR.dark;
  } catch(e) {}
  // Update toggle button state
  try {
    document.querySelectorAll('#theme-toggle').forEach(btn => {
      btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      const lang = (typeof getLang === 'function') ? getLang() : 'en';
      const labelKey = theme === 'light' ? 'nav.themeDark' : 'nav.themeLight';
      const label = (typeof t === 'function') ? t(labelKey, lang) : (theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      btn.setAttribute('aria-label', label);
    });
  } catch(e) {}
}

function toggleTheme() {
  const current = _readTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  _saveTheme(next);
  applyTheme(next);
}

// Apply on load
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(_readTheme());
});

// Update labels when language changes
document.addEventListener('sakura:langchange', () => {
  applyTheme(_readTheme());
});

// Expose globally
window.toggleTheme = toggleTheme;
window.getTheme = _readTheme;
