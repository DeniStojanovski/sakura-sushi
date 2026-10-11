/* ==========================================================================
   Sakura Sushi — homepage: featured-menu teaser + stat counter animation
   ========================================================================== */

const FEATURED_MENU_IDS = ["n5", "r3", "s1", "s4"];

function renderFeaturedMenu() {
  const lang = getLang();
  const container = document.getElementById("featured-menu-grid");
  if (!container) return;

  container.innerHTML = FEATURED_MENU_IDS.map((id) => {
    const item = findMenuItem(id);
    if (!item) return "";
    return `
    <div class="feature-card">
      <img src="${item.icon}" alt="${item[lang].name}" class="menu-item-icon" width="56" height="56" loading="lazy">
      <span class="chef-pick-tag mt-3" style="display:inline-flex">${t("menuPage.chefPick", lang)}</span>
      <h3 class="font-display text-lg mt-2">${item[lang].name}</h3>
      <p class="text-sm mt-1" style="color:var(--ink-soft)">${item[lang].desc}</p>
      <div class="flex items-center justify-between mt-4">
        <span class="menu-item-price">${formatPrice(item.price)}</span>
        <button type="button" class="btn btn-outline btn-sm" data-featured-add="${item.id}"
          aria-label="${t("menuPage.addToCart", lang)} ${item[lang].name}">${t("menuPage.addToCart", lang)}</button>
      </div>
    </div>`;
  }).join("");
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-featured-add]");
  if (!btn) return;
  const id = btn.getAttribute("data-featured-add");
  const item = findMenuItem(id);
  if (!item) return;
  addToCart(id, 1);
  const lang = getLang();
  showToast(`${t("menuPage.added", lang)}: ${item[lang].name}`);
});

document.addEventListener("sakura:langchange", renderFeaturedMenu);

/* ---------------------------------------------------------------------
   Stat counters — count up once each .stat-num scrolls into view.
   Respects prefers-reduced-motion by jumping straight to the final value.
   --------------------------------------------------------------------- */
function initStatCounters() {
  const stats = document.querySelectorAll(".stat-num[data-count]");
  if (!stats.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animate(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const suffix = el.getAttribute("data-suffix") || "";

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (!("IntersectionObserver" in window)) {
    stats.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedMenu();
  initStatCounters();
});
