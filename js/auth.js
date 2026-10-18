/* ==========================================================================
   Sakura Sushi — authentication module
   ⚠  IMPORTANT: CLIENT-SIDE DEMO ONLY.
      User data, hashed passwords and session tokens are stored in
      localStorage / sessionStorage in this browser only. There is no
      server, no real security boundary and no encrypted transport.
      Do not use this pattern for anything beyond a front-end demo.
   ========================================================================== */

/* ------------------------------------------------------------------
   Storage keys — all namespaced sakura_*
   ------------------------------------------------------------------ */
const SAKURA_KEYS = {
  USERS:    'sakura_users',
  SESSION:  'sakura_session',
  DEMO_INIT:'sakura_demo_initialized',
  ordersKey:      (uid) => `sakura_orders_${uid}`,
  favoritesKey:   (uid) => `sakura_favorites_${uid}`,
  resKey:         (uid) => `sakura_reservations_${uid}`,
};

/* ------------------------------------------------------------------
   Safe storage helpers — private-mode browsers may throw
   ------------------------------------------------------------------ */
function safeStorageGet(key, store) {
  try {
    const raw = (store || localStorage).getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function safeStorageSet(key, value, store) {
  try { (store || localStorage).setItem(key, JSON.stringify(value)); return true; }
  catch (e) { return false; }
}
function safeStorageRemove(key, store) {
  try { (store || localStorage).removeItem(key); } catch (e) { /* silent */ }
}

/* ------------------------------------------------------------------
   XSS protection helper
   Use for ANY user-supplied text inserted via innerHTML.
   ------------------------------------------------------------------ */
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/* ------------------------------------------------------------------
   Password hashing
   Primary:  crypto.subtle PBKDF2-SHA256 (requires secure context / HTTPS).
   Fallback: demo-grade deterministic hash — NOT real security.
             Active only when crypto.subtle is unavailable (plain HTTP).
             Per-user salt still prevents trivial dictionary attacks on
             stored data, but this must never be used in production.
   ------------------------------------------------------------------ */
async function _generateSalt() {
  if (window.crypto && window.crypto.getRandomValues) {
    const b = new Uint8Array(16);
    window.crypto.getRandomValues(b);
    return Array.from(b).map(x => x.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

async function _hashPassword(password, salt) {
  if (window.crypto && window.crypto.subtle) {
    try {
      const enc = new TextEncoder();
      const key = await window.crypto.subtle.importKey(
        'raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']
      );
      const bits = await window.crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
        key, 256
      );
      return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) { /* fall through */ }
  }
  // ⚠ DEMO FALLBACK ONLY — djb2 + FNV fold, NOT secure
  const s = password + '::' + salt;
  let h1 = 5381, h2 = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = (Math.imul(h1, 33) ^ c) >>> 0;
    h2 = (Math.imul(h2 ^ c, 0x01000193)) >>> 0;
  }
  return h1.toString(16).padStart(8,'0') + h2.toString(16).padStart(8,'0') +
         (h1 ^ h2).toString(16).padStart(8,'0');
}

/* ------------------------------------------------------------------
   User CRUD
   ------------------------------------------------------------------ */
function authGetAllUsers() {
  return safeStorageGet(SAKURA_KEYS.USERS) || [];
}
function _saveAllUsers(users) {
  safeStorageSet(SAKURA_KEYS.USERS, users);
}
function authGetUserByEmail(email) {
  return authGetAllUsers().find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || null;
}
function authGetUserById(id) {
  return authGetAllUsers().find(u => u.id === id) || null;
}
function _generateUserId() {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ------------------------------------------------------------------
   Session management
   remember=true  → localStorage  (survives tab/browser close)
   remember=false → sessionStorage (cleared on tab close)
   ------------------------------------------------------------------ */
function authGetSession() {
  return safeStorageGet(SAKURA_KEYS.SESSION, localStorage) ||
         safeStorageGet(SAKURA_KEYS.SESSION, sessionStorage) || null;
}
function authGetCurrentUser() {
  const s = authGetSession();
  return s ? authGetUserById(s.userId) : null;
}
function _saveSession(userId, remember) {
  const session = { userId, remember: !!remember };
  const store = remember ? localStorage : sessionStorage;
  safeStorageSet(SAKURA_KEYS.SESSION, session, store);
  // clear from the other store to avoid stale sessions
  safeStorageRemove(SAKURA_KEYS.SESSION, remember ? sessionStorage : localStorage);
}
function _clearSession() {
  safeStorageRemove(SAKURA_KEYS.SESSION, localStorage);
  safeStorageRemove(SAKURA_KEYS.SESSION, sessionStorage);
}

/* ------------------------------------------------------------------
   Register
   Returns { ok: true, user } or { ok: false, error: 'translation.key' }
   ------------------------------------------------------------------ */
async function authRegister(name, email, phone, password) {
  if (!name || !name.trim()) return { ok: false, error: 'auth.fieldRequired', field: 'name' };
  if (!email)                 return { ok: false, error: 'auth.fieldRequired', field: 'email' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'auth.emailInvalid', field: 'email' };
  if (!password || password.length < 8) return { ok: false, error: 'auth.passwordTooShort', field: 'password' };
  if (!/[a-zA-Z]/.test(password)) return { ok: false, error: 'auth.passwordNeedsLetter', field: 'password' };
  if (!/[0-9]/.test(password))    return { ok: false, error: 'auth.passwordNeedsNumber', field: 'password' };
  if (authGetUserByEmail(email))  return { ok: false, error: 'auth.emailTaken', field: 'email' };

  const salt = await _generateSalt();
  const passwordHash = await _hashPassword(password, salt);
  const user = {
    id: _generateUserId(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: (phone || '').trim(),
    defaultAddress: '',
    defaultCity: 'Skopje',
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  };
  const users = authGetAllUsers();
  users.push(user);
  _saveAllUsers(users);
  return { ok: true, user };
}

/* ------------------------------------------------------------------
   Login
   Returns { ok: true, user } or { ok: false, error: 'translation.key' }
   ------------------------------------------------------------------ */
async function authLogin(email, password, remember) {
  const user = authGetUserByEmail(email);
  if (!user) return { ok: false, error: 'auth.invalidCredentials' };
  const hash = await _hashPassword(password, user.salt);
  if (hash !== user.passwordHash) return { ok: false, error: 'auth.invalidCredentials' };
  _saveSession(user.id, !!remember);
  return { ok: true, user };
}

/* ------------------------------------------------------------------
   Logout
   ------------------------------------------------------------------ */
function authLogout() {
  _clearSession();
}

/* ------------------------------------------------------------------
   Profile updates
   ------------------------------------------------------------------ */
function authUpdateProfile(userId, data) {
  const users = authGetAllUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return { ok: false };
  const allowed = ['name', 'phone', 'defaultAddress', 'defaultCity'];
  allowed.forEach(k => { if (data[k] !== undefined) users[idx][k] = data[k]; });
  _saveAllUsers(users);
  return { ok: true };
}

async function authChangePassword(userId, currentPw, newPw) {
  const users = authGetAllUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return { ok: false, error: 'account.wrongCurrentPassword' };
  const u = users[idx];
  const currentHash = await _hashPassword(currentPw, u.salt);
  if (currentHash !== u.passwordHash) return { ok: false, error: 'account.wrongCurrentPassword' };
  if (!newPw || newPw.length < 8)   return { ok: false, error: 'auth.passwordTooShort' };
  if (!/[a-zA-Z]/.test(newPw))      return { ok: false, error: 'auth.passwordNeedsLetter' };
  if (!/[0-9]/.test(newPw))         return { ok: false, error: 'auth.passwordNeedsNumber' };
  const newSalt = await _generateSalt();
  users[idx].salt = newSalt;
  users[idx].passwordHash = await _hashPassword(newPw, newSalt);
  _saveAllUsers(users);
  return { ok: true };
}

function authDeleteAccount(userId) {
  _saveAllUsers(authGetAllUsers().filter(u => u.id !== userId));
  safeStorageRemove(SAKURA_KEYS.ordersKey(userId));
  safeStorageRemove(SAKURA_KEYS.favoritesKey(userId));
  safeStorageRemove(SAKURA_KEYS.resKey(userId));
  _clearSession();
}

/* ------------------------------------------------------------------
   Orders
   ------------------------------------------------------------------ */
function authGetOrders(userId) {
  return safeStorageGet(SAKURA_KEYS.ordersKey(userId)) || [];
}
function authSaveOrder(userId, order) {
  const orders = authGetOrders(userId);
  orders.unshift(order); // newest first
  safeStorageSet(SAKURA_KEYS.ordersKey(userId), orders);
}

/* ------------------------------------------------------------------
   Favorites
   ------------------------------------------------------------------ */
function authGetFavorites(userId) {
  return safeStorageGet(SAKURA_KEYS.favoritesKey(userId)) || [];
}
function authSetFavorites(userId, favorites) {
  safeStorageSet(SAKURA_KEYS.favoritesKey(userId), favorites);
}
function authToggleFavorite(userId, itemId) {
  const favs = authGetFavorites(userId);
  const idx = favs.indexOf(itemId);
  if (idx === -1) favs.push(itemId);
  else favs.splice(idx, 1);
  authSetFavorites(userId, favs);
  return !( idx >= 0 ); // true = now favorited
}

/* ------------------------------------------------------------------
   Reservations
   ------------------------------------------------------------------ */
function authGetReservations(userId) {
  return safeStorageGet(SAKURA_KEYS.resKey(userId)) || [];
}
function authSaveReservation(userId, reservation) {
  const list = authGetReservations(userId);
  list.unshift(reservation);
  safeStorageSet(SAKURA_KEYS.resKey(userId), list);
}
function authCancelReservation(userId, resId) {
  const list = authGetReservations(userId).map(r =>
    r.id === resId ? { ...r, status: 'cancelled' } : r
  );
  safeStorageSet(SAKURA_KEYS.resKey(userId), list);
}

/* ------------------------------------------------------------------
   Header auth state — called on every page after DOM ready
   ------------------------------------------------------------------ */
function authInitHeader() {
  const user = authGetCurrentUser();
  const loginLink      = document.getElementById('login-link');
  const userMenu       = document.getElementById('account-user-menu');
  const greeting       = document.getElementById('account-greeting');
  const logoutBtn      = document.getElementById('logout-btn');
  const dropBtn        = document.getElementById('account-dropdown-btn');
  const dropPanel      = document.getElementById('account-dropdown-panel');

  if (user) {
    if (loginLink) loginLink.classList.add('hidden');
    if (userMenu)  userMenu.classList.remove('hidden');
    if (greeting)  greeting.textContent = escapeHtml(user.name.split(' ')[0]);
  } else {
    if (loginLink) loginLink.classList.remove('hidden');
    if (userMenu)  userMenu.classList.add('hidden');
  }

  // Dropdown toggle (no overlay — just a small nav menu)
  if (dropBtn && dropPanel) {
    dropBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !dropPanel.hidden;
      dropPanel.hidden = open;
      dropBtn.setAttribute('aria-expanded', String(!open));
    });
    document.addEventListener('click', () => {
      if (dropPanel && !dropPanel.hidden) {
        dropPanel.hidden = true;
        dropBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropPanel && !dropPanel.hidden) {
        dropPanel.hidden = true;
        dropBtn.setAttribute('aria-expanded', 'false');
        dropBtn.focus();
      }
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      authLogout();
      const lang = typeof getLang === 'function' ? getLang() : 'en';
      const msg  = typeof t === 'function' ? t('auth.logoutSuccess', lang) : 'Signed out.';
      if (typeof showToast === 'function') showToast(msg);
      window.location.href = 'index.html';
    });
  }
}

/* ------------------------------------------------------------------
   Demo account seed (idempotent — runs once per browser)
   Credentials: demo@sakurasushi.mk / Demo1234
   ------------------------------------------------------------------ */
async function authSeedDemo() {
  if (safeStorageGet(SAKURA_KEYS.DEMO_INIT)) return;

  const res = await authRegister('Demo User', 'demo@sakurasushi.mk', '+389 70 000 001', 'Demo1234');
  if (res.ok) {
    const uid = res.user.id;
    // sample orders
    authSaveOrder(uid, {
      id: 'SKR-260215-SEED',
      date: '2026-02-20T20:00:00Z',
      lines: [
        { name: "Chef's Omakase Set", qty: 1, price: 42.0 },
        { name: 'Japanese Green Tea', qty: 2, price: 3.0 },
      ],
      subtotal: 48.0, delivery: 0, tip: 5.0, discount: 0, total: 53.0,
      deliveryType: 'delivery',
    });
    authSaveOrder(uid, {
      id: 'SKR-260115-SEED',
      date: '2026-01-15T19:30:00Z',
      lines: [
        { name: 'Dragon Roll',   qty: 1, price: 13.5 },
        { name: 'Salmon Nigiri', qty: 2, price: 5.5  },
      ],
      subtotal: 24.5, delivery: 3.5, tip: 0, discount: 0, total: 28.0,
      deliveryType: 'delivery',
    });
    // sample favorites
    authSetFavorites(uid, ['n5', 'r3', 's4']);
  }
  safeStorageSet(SAKURA_KEYS.DEMO_INIT, true);
}

/* ------------------------------------------------------------------
   Init on every page
   ------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', async () => {
  try { await authSeedDemo(); } catch(e) {}
  try { authInitHeader(); } catch(e) {}
});
