/* ==========================================================================
   Sakura Sushi — cart, checkout and order confirmation
   Cart is persisted to localStorage as [{id, qty}, ...] so it survives a
   page change or a language switch; item names/prices are always looked
   up fresh from menuData in the current language.
   ========================================================================== */

const CART_KEY = "sakura_cart";
const DELIVERY_FEE = 3.5;
const FREE_DELIVERY_THRESHOLD = 40;

function getCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function findMenuItem(id) {
  return menuData.find((m) => m.id === id);
}

function addToCart(id, qty) {
  qty = qty || 1;
  const cart = getCart();
  const existing = cart.find((l) => l.id === id);
  if (existing) existing.qty += qty;
  else cart.push({ id, qty });
  saveCart(cart);
}

function setQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter((l) => l.id !== id);
  } else {
    const line = cart.find((l) => l.id === id);
    if (line) line.qty = qty;
    else cart.push({ id, qty });
  }
  saveCart(cart);
}

function removeFromCart(id) {
  setQty(id, 0);
}

function cartCount() {
  return getCart().reduce((sum, l) => sum + l.qty, 0);
}

function cartSubtotal() {
  return getCart().reduce((sum, l) => {
    const item = findMenuItem(l.id);
    return item ? sum + item.price * l.qty : sum;
  }, 0);
}

function cartDeliveryFee() {
  const sub = cartSubtotal();
  if (sub <= 0) return 0;
  return sub >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

function cartTotal() {
  return cartSubtotal() + cartDeliveryFee();
}

function formatPrice(n) {
  return "$" + n.toFixed(2);
}

/* ---------------------------------------------------------------------
   Rendering
   --------------------------------------------------------------------- */
function updateCartUI() {
  document.querySelectorAll("#cart-count").forEach((el) => {
    el.textContent = String(cartCount());
  });
  renderCartDrawerContents();
}

function renderCartDrawerContents() {
  const container = document.getElementById("cart-items");
  if (!container) return;
  const lang = getLang();
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `<p class="px-5 py-8 text-sm" style="color:var(--ink-soft)">${t("cart.empty", lang)}</p>`;
  } else {
    container.innerHTML = cart
      .map((line) => {
        const item = findMenuItem(line.id);
        if (!item) return "";
        const name = item[lang].name;
        return `
        <div class="cart-line px-5">
          <div>
            <p class="cart-line-name">${name}</p>
            <div class="qty-stepper mt-2" role="group" aria-label="${name}">
              <button type="button" data-cart-decrease="${item.id}" aria-label="${t("cart.remove", lang)} / -1">\u2212</button>
              <span aria-live="polite">${line.qty}</span>
              <button type="button" data-cart-increase="${item.id}" aria-label="+1">+</button>
            </div>
            <button type="button" class="cart-line-remove mt-2" data-cart-remove="${item.id}">${t("cart.remove", lang)}</button>
          </div>
          <div class="cart-line-price">${formatPrice(item.price * line.qty)}</div>
        </div>`;
      })
      .join("");
  }

  const subtotalEl = document.getElementById("cart-subtotal");
  const deliveryEl = document.getElementById("cart-delivery");
  const totalEl = document.getElementById("cart-total");
  if (subtotalEl) subtotalEl.textContent = formatPrice(cartSubtotal());
  if (deliveryEl) deliveryEl.textContent = formatPrice(cartDeliveryFee());
  if (totalEl) totalEl.textContent = formatPrice(cartTotal());

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
}

function renderCheckoutSummary() {
  const container = document.getElementById("checkout-summary-items");
  if (!container) return;
  const lang = getLang();
  const cart = getCart();
  container.innerHTML = cart
    .map((line) => {
      const item = findMenuItem(line.id);
      if (!item) return "";
      return `<div class="flex justify-between text-sm py-1">
        <span>${line.qty}\u00d7 ${item[lang].name}</span>
        <span>${formatPrice(item.price * line.qty)}</span>
      </div>`;
    })
    .join("");

  const sub = document.getElementById("checkout-summary-subtotal");
  const del = document.getElementById("checkout-summary-delivery");
  const tot = document.getElementById("checkout-summary-total");
  if (sub) sub.textContent = formatPrice(cartSubtotal());
  if (del) del.textContent = formatPrice(cartDeliveryFee());
  if (tot) tot.textContent = formatPrice(cartTotal());
}

/* ---------------------------------------------------------------------
   Order placement
   --------------------------------------------------------------------- */
function generateOrderId() {
  const now = new Date();
  const datePart =
    String(now.getFullYear()).slice(2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SKR-${datePart}-${rand}`;
}

function validateCheckoutForm(form) {
  const lang = getLang();
  let valid = true;
  const fields = [
    { id: "checkout-name", type: "required" },
    { id: "checkout-phone", type: "phone" },
    { id: "checkout-email", type: "email" },
    { id: "checkout-address", type: "required" },
    { id: "checkout-city", type: "required" }
  ];

  fields.forEach(({ id, type }) => {
    const input = form.querySelector("#" + id);
    const errorEl = form.querySelector("#" + id + "-error");
    if (!input) return;
    const value = input.value.trim();
    let message = "";

    if (value === "") {
      message = t("checkout.errorRequired", lang);
    } else if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = t("checkout.errorEmail", lang);
    } else if (type === "phone" && !/^[0-9+\-\s()]{6,20}$/.test(value)) {
      message = t("checkout.errorPhone", lang);
    }

    if (message) {
      valid = false;
      input.classList.add("invalid");
      if (errorEl) errorEl.textContent = message;
    } else {
      input.classList.remove("invalid");
      if (errorEl) errorEl.textContent = "";
    }
  });

  return valid;
}

function renderConfirmation(order) {
  const lang = getLang();
  document.getElementById("confirmation-order-id").textContent = order.id;
  document.getElementById("confirmation-total-paid").textContent = formatPrice(order.total);

  const itemsEl = document.getElementById("confirmation-items");
  if (itemsEl) {
    itemsEl.innerHTML = order.lines
      .map(
        (l) => `<div class="flex justify-between text-sm py-1">
          <span>${l.qty}\u00d7 ${l.name}</span>
          <span>${formatPrice(l.price * l.qty)}</span>
        </div>`
      )
      .join("");
  }

  const stampImg = document.getElementById("confirmation-stamp");
  if (stampImg) {
    stampImg.classList.remove("stamped");
    // force reflow so the animation can replay on every order
    void stampImg.offsetWidth;
    stampImg.classList.add("stamped");
  }
}

function placeOrder(form) {
  const lang = getLang();
  if (cartCount() === 0) return;
  if (!validateCheckoutForm(form)) return;

  const paymentInput = form.querySelector('input[name="payment"]:checked');
  const lines = getCart().map((line) => {
    const item = findMenuItem(line.id);
    return { name: item[lang].name, qty: line.qty, price: item.price };
  });

  const order = {
    id: generateOrderId(),
    date: new Date().toISOString(),
    name: form.querySelector("#checkout-name").value.trim(),
    address: form.querySelector("#checkout-address").value.trim(),
    city: form.querySelector("#checkout-city").value.trim(),
    payment: paymentInput ? paymentInput.value : "cash",
    lines,
    subtotal: cartSubtotal(),
    delivery: cartDeliveryFee(),
    total: cartTotal()
  };

  renderConfirmation(order);
  saveCart([]);
  form.reset();
  closePanel("checkout-modal");
  openPanel("confirmation-modal");
}

/* ---------------------------------------------------------------------
   Wire-up
   --------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();

  document.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-cart-increase]");
    if (inc) {
      const id = inc.getAttribute("data-cart-increase");
      const line = getCart().find((l) => l.id === id);
      setQty(id, (line ? line.qty : 0) + 1);
    }
    const dec = e.target.closest("[data-cart-decrease]");
    if (dec) {
      const id = dec.getAttribute("data-cart-decrease");
      const line = getCart().find((l) => l.id === id);
      setQty(id, (line ? line.qty : 1) - 1);
    }
    const rem = e.target.closest("[data-cart-remove]");
    if (rem) removeFromCart(rem.getAttribute("data-cart-remove"));

    const checkoutOpener = e.target.closest('[data-open-panel="checkout-modal"]');
    if (checkoutOpener) {
      if (cartCount() === 0) return;
      closePanel("cart-drawer");
      renderCheckoutSummary();
    }

    const printBtn = e.target.closest("#print-receipt-btn");
    if (printBtn) window.print();
  });

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      placeOrder(checkoutForm);
    });
  }

  document.addEventListener("sakura:langchange", () => {
    renderCartDrawerContents();
    if (document.getElementById("checkout-modal")?.classList.contains("open")) {
      renderCheckoutSummary();
    }
  });
});
