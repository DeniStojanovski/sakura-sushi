/* ==========================================================================
   Sakura Sushi — contact form validation
   ========================================================================== */

function validateContactForm(form) {
  const lang = getLang();
  let valid = true;

  const name = form.querySelector("#contact-name");
  const email = form.querySelector("#contact-email");
  const message = form.querySelector("#contact-message");

  const checks = [
    { input: name, test: (v) => v.length > 0, error: t("contact.errorRequired", lang) },
    {
      input: email,
      test: (v) => v.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      error: (v) => (v.length === 0 ? t("contact.errorRequired", lang) : t("contact.errorEmail", lang))
    },
    {
      input: message,
      test: (v) => v.length >= 10,
      error: (v) => (v.length === 0 ? t("contact.errorRequired", lang) : t("contact.errorMinLength", lang))
    }
  ];

  checks.forEach(({ input, test, error }) => {
    if (!input) return;
    const value = input.value.trim();
    const errorEl = form.querySelector("#" + input.id + "-error");
    if (!test(value)) {
      valid = false;
      input.classList.add("invalid");
      if (errorEl) errorEl.textContent = typeof error === "function" ? error(value) : error;
    } else {
      input.classList.remove("invalid");
      if (errorEl) errorEl.textContent = "";
    }
  });

  return valid;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const successEl = document.getElementById("contact-success");
    if (!validateContactForm(form)) {
      if (successEl) successEl.classList.add("hidden");
      return;
    }
    if (successEl) {
      successEl.textContent = t("contact.formSuccess", getLang());
      successEl.classList.remove("hidden");
    }
    form.reset();
  });

  document.addEventListener("sakura:langchange", () => {
    const successEl = document.getElementById("contact-success");
    if (successEl && !successEl.classList.contains("hidden")) {
      successEl.textContent = t("contact.formSuccess", getLang());
    }
  });
});
