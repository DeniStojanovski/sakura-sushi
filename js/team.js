/* ==========================================================================
   Sakura Sushi — team page rendering (flip cards)
   ========================================================================== */

function renderTeam() {
  const lang = getLang();
  const container = document.getElementById("team-grid");
  if (!container) return;

  container.innerHTML = teamData
    .map(
      (c) => `
    <div class="chef-card" role="button" tabindex="0" aria-label="${c[lang].name} — ${c[lang].role}">
      <div class="chef-card-inner">
        <div class="chef-card-front">
          <div class="flex items-start gap-4">
            <img src="${c.image}" alt="Portrait illustration of ${c[lang].name}" class="chef-medallion" width="96" height="96" loading="lazy">
            <div>
              <h3 class="font-display text-xl" style="color:var(--washi)">${c[lang].name}</h3>
              <p class="chef-role">${c[lang].role}</p>
              <span class="chef-years-badge mt-2 block" style="display:inline-block;margin-top:0.5rem">${c.years} ${t("team.years", lang)}</span>
            </div>
          </div>
          <p class="mt-3 text-xs" style="color:var(--washi-dim);opacity:0.6">${t("team.flipHint", lang)}</p>
        </div>
        <div class="chef-card-back">
          <p class="chef-role mb-3">${c[lang].name}</p>
          <p class="text-sm leading-relaxed" style="color:var(--washi-dim)">${c[lang].bio}</p>
        </div>
      </div>
    </div>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", renderTeam);
document.addEventListener("sakura:langchange", renderTeam);
