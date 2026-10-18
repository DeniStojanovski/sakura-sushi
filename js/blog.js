/* ==========================================================================
   Sakura Sushi — blog / journal page
   ========================================================================== */

const monthNames = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  mk: ["јан", "фев", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "ное", "дек"]
};

function formatBlogDate(iso, lang) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${monthNames[lang][d.getMonth()]} ${d.getFullYear()}`;
}

let currentOpenBlogId = null;

function renderBlog() {
  const lang = getLang();
  const featuredContainer = document.getElementById("blog-featured");
  const listContainer = document.getElementById("blog-list");
  if (!featuredContainer && !listContainer) return;

  const sorted = [...blogData].sort((a, b) => new Date(b.date) - new Date(a.date));
  const [featured, ...rest] = sorted;

  if (featuredContainer && featured) {
    const categoryLabel = featured.category === "guide" ? t("blog.categoryGuide", lang) : t("blog.categoryNews", lang);
    featuredContainer.innerHTML = `
      <div class="blog-featured-img">
        <img src="${featured.icon}" alt="${featured[lang].title}" width="480" height="360" loading="eager">
      </div>
      <div>
        <span class="blog-cat" style="color:${featured.category === "guide" ? "var(--matcha)" : "var(--gold)"}">${categoryLabel}</span>
        <h3 class="font-display text-2xl md:text-3xl mt-2" style="color:var(--ink)">${featured[lang].title}</h3>
        <p class="text-xs mt-2" style="color:var(--ink-soft)">${formatBlogDate(featured.date, lang)} · ${featured.minutes} ${t("blog.minRead", lang)}</p>
        <p class="mt-3 text-sm leading-relaxed" style="color:var(--ink-soft)">${featured[lang].excerpt}</p>
        <button type="button" class="btn btn-outline btn-sm mt-4" data-read-more="${featured.id}">${t("blog.readMore", lang)}</button>
      </div>
    `;
  }

  if (listContainer) {
    listContainer.innerHTML = rest
      .map((post) => {
        const categoryLabel = post.category === "guide" ? t("blog.categoryGuide", lang) : t("blog.categoryNews", lang);
        return `
        <article class="blog-row">
          <img src="${post.icon}" alt="${post[lang].title}" class="blog-thumb" width="96" height="96" loading="lazy">
          <div>
            <span class="blog-cat" style="color:${post.category === "guide" ? "var(--matcha)" : "var(--gold)"}">${categoryLabel}</span>
            <h4 class="font-display text-lg mt-1" style="color:var(--ink)">${post[lang].title}</h4>
            <p class="text-xs mt-1" style="color:var(--ink-soft)">${formatBlogDate(post.date, lang)} · ${post.minutes} ${t("blog.minRead", lang)}</p>
          </div>
          <button type="button" class="btn btn-outline btn-sm" data-read-more="${post.id}">${t("blog.readMore", lang)}</button>
        </article>`;
      })
      .join("");
  }

  if (currentOpenBlogId) renderBlogModal(currentOpenBlogId);
}

function renderBlogModal(id) {
  const lang = getLang();
  const post = blogData.find((p) => p.id === id);
  if (!post) return;
  const categoryLabel = post.category === "guide" ? t("blog.categoryGuide", lang) : t("blog.categoryNews", lang);

  const titleEl = document.getElementById("blog-modal-title");
  const metaEl = document.getElementById("blog-modal-meta");
  const bodyEl = document.getElementById("blog-modal-body");
  if (titleEl) titleEl.textContent = post[lang].title;
  if (metaEl) metaEl.textContent = `${categoryLabel} · ${formatBlogDate(post.date, lang)} · ${post.minutes} ${t("blog.minRead", lang)}`;
  if (bodyEl) bodyEl.innerHTML = post[lang].body.map((para) => `<p class="mb-4">${para}</p>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderBlog();

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-read-more]");
    if (btn) {
      currentOpenBlogId = btn.getAttribute("data-read-more");
      renderBlogModal(currentOpenBlogId);
      openPanel("blog-modal");
    }
  });

  document.getElementById("blog-modal")?.addEventListener("transitionend", (e) => {
    const modal = document.getElementById("blog-modal");
    if (modal && !modal.classList.contains("open")) currentOpenBlogId = null;
  });

  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const lang = getLang();
      const input = document.getElementById("newsletter-email");
      const errorEl = document.getElementById("newsletter-error");
      const successEl = document.getElementById("newsletter-success");
      const value = input.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!valid) {
        input.classList.add("invalid");
        if (errorEl) errorEl.textContent = t("blog.subscribeErrorEmail", lang);
        if (successEl) successEl.textContent = "";
        return;
      }
      input.classList.remove("invalid");
      if (errorEl) errorEl.textContent = "";
      if (successEl) successEl.textContent = t("blog.subscribeSuccess", lang);
      newsletterForm.reset();
    });
  }

  document.addEventListener("sakura:langchange", renderBlog);
});
