/* ==========================================================================
   Sakura Sushi — login / register page logic
   ========================================================================== */

/* ------------------------------------------------------------------
   Redirect if already logged in
   ------------------------------------------------------------------ */
(function () {
  if (typeof authGetCurrentUser === 'function' && authGetCurrentUser()) {
    const params = new URLSearchParams(window.location.search);
    window.location.replace(params.get('next') || 'account.html');
  }
})();

/* ------------------------------------------------------------------
   Tab switching
   ------------------------------------------------------------------ */
function initTabs() {
  const tabLogin    = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const panelLogin    = document.getElementById('panel-login');
  const panelRegister = document.getElementById('panel-register');

  function selectTab(which) {
    const isLogin = (which === 'login');
    tabLogin.setAttribute('aria-selected', String(isLogin));
    tabRegister.setAttribute('aria-selected', String(!isLogin));
    panelLogin.hidden    = !isLogin;
    panelRegister.hidden = isLogin;
    if (isLogin) tabLogin.focus(); else tabRegister.focus();
  }

  tabLogin.addEventListener('click',    () => selectTab('login'));
  tabRegister.addEventListener('click', () => selectTab('register'));

  // Allow arrow keys between tabs
  [tabLogin, tabRegister].forEach((btn) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        selectTab(btn === tabLogin ? 'register' : 'login');
      }
    });
  });

  // Check hash or query for default tab
  const params = new URLSearchParams(window.location.search);
  if (params.get('tab') === 'register') selectTab('register');
}

/* ------------------------------------------------------------------
   Show/hide password toggle
   ------------------------------------------------------------------ */
function initShowPassword() {
  [
    ['login-show-pw',        'login-password'],
    ['register-show-pw',     'register-password'],
    ['register-show-confirm','register-confirm'],
  ].forEach(([btnId, inputId]) => {
    const btn   = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      const visible = input.type === 'text';
      input.type = visible ? 'password' : 'text';
      const lang = getLang();
      btn.setAttribute('aria-label', t(visible ? 'auth.showPassword' : 'auth.hidePassword', lang));
    });
  });
}

/* ------------------------------------------------------------------
   Password strength indicator
   ------------------------------------------------------------------ */
function getPasswordStrength(pw) {
  if (!pw || pw.length < 4) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-zA-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (pw.length >= 12 || /[^a-zA-Z0-9]/.test(pw)) score++;
  return score; // 0–3
}

function initStrengthBar() {
  const input = document.getElementById('register-password');
  const bar   = document.getElementById('pw-strength-bar');
  const label = document.getElementById('pw-strength-label');
  if (!input || !bar || !label) return;

  input.addEventListener('input', () => {
    const lang = getLang();
    const score = getPasswordStrength(input.value);
    bar.className = 'password-strength mt-2';
    if (score === 1) { bar.classList.add('strength-weak');   label.textContent = t('auth.passwordStrengthWeak', lang); }
    else if (score === 2) { bar.classList.add('strength-fair');   label.textContent = t('auth.passwordStrengthFair', lang); }
    else if (score >= 3) { bar.classList.add('strength-strong'); label.textContent = t('auth.passwordStrengthStrong', lang); }
    else { label.textContent = ''; }
  });
}

/* ------------------------------------------------------------------
   Field-level error helpers
   ------------------------------------------------------------------ */
function setFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errorId);
  if (input) input.classList.toggle('invalid', !!message);
  if (err)   err.textContent = message || '';
}
function clearErrors(ids) {
  ids.forEach(([inputId, errorId]) => setFieldError(inputId, errorId, ''));
}

/* ------------------------------------------------------------------
   Login form
   ------------------------------------------------------------------ */
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = getLang();

    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const remember = document.getElementById('login-remember').checked;

    clearErrors([
      ['login-email', 'login-email-error'],
      ['login-password', 'login-password-error'],
    ]);
    document.getElementById('login-general-error').textContent = '';

    let valid = true;
    if (!email) {
      setFieldError('login-email', 'login-email-error', t('auth.fieldRequired', lang));
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('login-email', 'login-email-error', t('auth.emailInvalid', lang));
      valid = false;
    }
    if (!password) {
      setFieldError('login-password', 'login-password-error', t('auth.fieldRequired', lang));
      valid = false;
    }
    if (!valid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    const result = await authLogin(email, password, remember);

    submitBtn.disabled = false;

    if (!result.ok) {
      // Deliberately vague — do not reveal which field was wrong
      document.getElementById('login-general-error').textContent = t('auth.invalidCredentials', lang);
      return;
    }

    // Merge any pending favorite from query param
    const params = new URLSearchParams(window.location.search);
    const pendingFav = params.get('favorite');
    if (pendingFav) authToggleFavorite(result.user.id, pendingFav);

    showToast(t('auth.registerSuccess', lang));
    const next = params.get('next') || 'index.html';
    window.location.href = next;
  });
}

/* ------------------------------------------------------------------
   Register form
   ------------------------------------------------------------------ */
function initRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = getLang();

    const name     = document.getElementById('register-name').value.trim();
    const email    = document.getElementById('register-email').value.trim();
    const phone    = document.getElementById('register-phone').value.trim();
    const password = document.getElementById('register-password').value;
    const confirm  = document.getElementById('register-confirm').value;

    clearErrors([
      ['register-name',     'register-name-error'],
      ['register-email',    'register-email-error'],
      ['register-password', 'register-password-error'],
      ['register-confirm',  'register-confirm-error'],
    ]);
    document.getElementById('register-general-error').textContent = '';

    let valid = true;
    if (!name) { setFieldError('register-name', 'register-name-error', t('auth.fieldRequired', lang)); valid = false; }
    if (!email) {
      setFieldError('register-email', 'register-email-error', t('auth.fieldRequired', lang)); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('register-email', 'register-email-error', t('auth.emailInvalid', lang)); valid = false;
    }
    if (!password) {
      setFieldError('register-password', 'register-password-error', t('auth.fieldRequired', lang)); valid = false;
    } else if (password.length < 8) {
      setFieldError('register-password', 'register-password-error', t('auth.passwordTooShort', lang)); valid = false;
    } else if (!/[a-zA-Z]/.test(password)) {
      setFieldError('register-password', 'register-password-error', t('auth.passwordNeedsLetter', lang)); valid = false;
    } else if (!/[0-9]/.test(password)) {
      setFieldError('register-password', 'register-password-error', t('auth.passwordNeedsNumber', lang)); valid = false;
    }
    if (password !== confirm) {
      setFieldError('register-confirm', 'register-confirm-error', t('auth.passwordsMismatch', lang)); valid = false;
    }
    if (!valid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const result = await authRegister(name, email, phone, password);
    submitBtn.disabled = false;

    if (!result.ok) {
      const errKey = result.error || 'auth.invalidCredentials';
      if (result.field === 'email') {
        setFieldError('register-email', 'register-email-error', t(errKey, lang));
      } else {
        document.getElementById('register-general-error').textContent = t(errKey, lang);
      }
      return;
    }

    // Auto-login after register
    await authLogin(email, password, false);

    showToast(t('auth.registerSuccess', lang));
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next') || 'index.html';
    window.location.href = next;
  });
}

/* ------------------------------------------------------------------
   Re-render translatable dynamic content on language switch
   ------------------------------------------------------------------ */
function rerenderOnLangChange() {
  const bar   = document.getElementById('pw-strength-bar');
  const label = document.getElementById('pw-strength-label');
  const input = document.getElementById('register-password');
  if (bar && label && input && input.value) {
    const lang  = getLang();
    const score = getPasswordStrength(input.value);
    const keys  = ['', 'auth.passwordStrengthWeak', 'auth.passwordStrengthFair', 'auth.passwordStrengthStrong'];
    label.textContent = score > 0 ? t(keys[score], lang) : '';
  }
}

/* ------------------------------------------------------------------
   Init
   ------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initShowPassword();
  initStrengthBar();
  initLoginForm();
  initRegisterForm();
});

document.addEventListener('sakura:langchange', rerenderOnLangChange);
