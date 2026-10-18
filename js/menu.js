/* ==========================================================================
   Sakura Sushi — menu page rendering and filtering
   ========================================================================== */

const currentFilter = { category: "all", search: "", veg: false, spicy: false };
const localQty = {};

function updateQtyDisplay(id) {
  const el = document.querySelector(`[data-qty-display="${id}"]`);
  if (el) el.textContent = String(localQty[id] || 1);
}

function buildMenuItemRow(item, lang) {
  const row = document.createElement("article");
  row.className = "menu-item";
  row.setAttribute("data-category", item.category);
  row.setAttribute("data-veg", String(item.veg));
  row.setAttribute("data-spicy", String(item.spicy));
  row.setAttribute("data-id", item.id);

  const allergensHtml = item.allergens
    .map((a) => `<span class="allergen-tag">${t("allergens." + a, lang)}</span>`)
    .join("");
  const dietDot = item.veg
    ? `<span class="veg-dot" style="color:var(--matcha)">${t("menuPage.filterVeg", lang)}</span>`
    : "";
  const spicyDot = item.spicy
    ? `<span class="spicy-dot ml-3" style="color:var(--torii)">${t("menuPage.filterSpicy", lang)}</span>`
    : "";
  const chefPickHtml = item.chefPick
    ? `<span class="chef-pick-tag">${t("menuPage.chefPick", lang)}</span>`
    : "";
  const dietRow = dietDot || spicyDot ? `<div class="mt-1 text-xs">${dietDot}${spicyDot}</div>` : "";

  const isFav = (typeof authGetCurrentUser === 'function' && typeof authGetFavorites === 'function')
    ? authGetFavorites((authGetCurrentUser() || {}).id || '').includes(item.id)
    : false;

  row.innerHTML = `
    <img src="${item.icon}" alt="${item[lang].name}" class="menu-item-icon" width="56" height="56" loading="lazy">
    <div>
      <div class="menu-item-name-row">
        <span class="menu-item-name">${item[lang].name}</span>
        ${chefPickHtml}
      </div>
      <p class="menu-item-desc">${item[lang].desc}</p>
      ${dietRow}
      <div class="mt-1">
        <span class="text-xs font-semibold" style="color:var(--ink-soft)">${t("menuPage.allergensLabel", lang)}</span>
        ${allergensHtml}
      </div>
      <div class="add-to-cart-btn flex items-center gap-3 flex-wrap">
        <div class="qty-stepper" role="group" aria-label="${item[lang].name} — quantity">
          <button type="button" data-qty-decrease="${item.id}" aria-label="Decrease quantity">\u2212</button>
          <span data-qty-display="${item.id}">${localQty[item.id] || 1}</span>
          <button type="button" data-qty-increase="${item.id}" aria-label="Increase quantity">+</button>
        </div>
        <button type="button" class="btn btn-primary btn-sm" data-add-to-cart="${item.id}"
          aria-label="${t("menuPage.addToCart", lang)} ${item[lang].name}">
          ${t("menuPage.addToCart", lang)}
        </button>
        <button type="button" class="heart-btn" data-fav-toggle="${item.id}"
          aria-pressed="${isFav}" aria-label="${t("menuPage.favourite", lang)} ${item[lang].name}">
          ${isFav ? '&#9829;' : '&#9825;'}
        </button>
      </div>
    </div>
    <div class="menu-item-price">${formatPrice(item.price)}</div>
  `;
  return row;
}

function renderMenu() {
  const lang = getLang();
  const container = document.getElementById("menu-grid");
  if (!container) return;

  const term = currentFilter.search.trim().toLowerCase();
  const categories = ["nigiri", "rolls", "sets", "drinks"];
  const catKey = { nigiri: "filterNigiri", rolls: "filterRolls", sets: "filterSets", drinks: "filterDrinks" };

  container.innerHTML = "";
  let anyResults = false;

  categories.forEach((cat) => {
    if (currentFilter.category !== "all" && currentFilter.category !== cat) return;

    const items = menuData.filter((item) => {
      if (item.category !== cat) return false;
      if (currentFilter.veg && !item.veg) return false;
      if (currentFilter.spicy && !item.spicy) return false;
      if (term) {
        const haystack = (item.en.name + " " + item.en.desc + " " + item.mk.name + " " + item.mk.desc).toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

    if (items.length === 0) return;
    anyResults = true;

    const section = document.createElement("section");
    section.className = "mb-10";
    section.setAttribute("aria-labelledby", "category-" + cat);
    section.innerHTML = `<h3 id="category-${cat}" class="menu-category-heading">${t("menuPage." + catKey[cat], lang)}</h3>`;
    const list = document.createElement("div");
    items.forEach((item) => list.appendChild(buildMenuItemRow(item, lang)));
    section.appendChild(list);
    container.appendChild(section);
  });

  const noResultsEl = document.getElementById("menu-no-results");
  if (noResultsEl) noResultsEl.classList.toggle("hidden", anyResults);
}

function updateFilterButtonStates() {
  document.querySelectorAll("[data-filter-category]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-filter-category") === currentFilter.category);
    btn.setAttribute("aria-pressed", btn.getAttribute("data-filter-category") === currentFilter.category ? "true" : "false");
  });
  const vegBtn = document.getElementById("filter-veg");
  const spicyBtn = document.getElementById("filter-spicy");
  if (vegBtn) { vegBtn.classList.toggle("active", currentFilter.veg); vegBtn.setAttribute("aria-pressed", String(currentFilter.veg)); }
  if (spicyBtn) { spicyBtn.classList.toggle("active", currentFilter.spicy); spicyBtn.setAttribute("aria-pressed", String(currentFilter.spicy)); }
}

document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  updateFilterButtonStates();

  document.querySelectorAll("[data-filter-category]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter.category = btn.getAttribute("data-filter-category");
      updateFilterButtonStates();
      renderMenu();
    });
  });

  document.getElementById("filter-veg")?.addEventListener("click", () => {
    currentFilter.veg = !currentFilter.veg;
    updateFilterButtonStates();
    renderMenu();
  });

  document.getElementById("filter-spicy")?.addEventListener("click", () => {
    currentFilter.spicy = !currentFilter.spicy;
    updateFilterButtonStates();
    renderMenu();
  });

  const searchInput = document.getElementById("menu-search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      currentFilter.search = searchInput.value;
      renderMenu();
    });
  }

  document.getElementById("menu-grid")?.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-qty-increase]");
    if (inc) {
      const id = inc.getAttribute("data-qty-increase");
      localQty[id] = Math.min(20, (localQty[id] || 1) + 1);
      updateQtyDisplay(id);
    }
    const dec = e.target.closest("[data-qty-decrease]");
    if (dec) {
      const id = dec.getAttribute("data-qty-decrease");
      localQty[id] = Math.max(1, (localQty[id] || 1) - 1);
      updateQtyDisplay(id);
    }
    const add = e.target.closest("[data-add-to-cart]");
    if (add) {
      const id = add.getAttribute("data-add-to-cart");
      const qty = localQty[id] || 1;
      addToCart(id, qty);
      const lang = getLang();
      const item = findMenuItem(id);
      showToast(`${t("menuPage.added", lang)}: ${item[lang].name}`);
      localQty[id] = 1;
      updateQtyDisplay(id);
    }

    const favBtn = e.target.closest("[data-fav-toggle]");
    if (favBtn) {
      const id = favBtn.getAttribute("data-fav-toggle");
      const lang = getLang();
      if (typeof authGetCurrentUser !== 'function' || !authGetCurrentUser()) {
        // Not logged in — redirect to login with ?favorite=id&next=menu.html
        showToast(t("account.loginToFavorite", lang));
        setTimeout(() => {
          window.location.href = `login.html?next=menu.html&favorite=${encodeURIComponent(id)}`;
        }, 1200);
        return;
      }
      const user = authGetCurrentUser();
      const nowFav = typeof authToggleFavorite === 'function' && authToggleFavorite(user.id, id);
      favBtn.setAttribute("aria-pressed", String(nowFav));
      favBtn.innerHTML = nowFav ? '&#9829;' : '&#9825;';
    }
  });

  document.addEventListener("sakura:langchange", renderMenu);
});
