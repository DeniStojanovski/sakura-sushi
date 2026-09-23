/* ==========================================================================
   Sakura Sushi — team page rendering
   ========================================================================== */

function renderTeam() {
  const lang = getLang();
  const container = document.getElementById("team-grid");
  if (!container) return;

  container.innerHTML = teamData
    .map(
      (c) => `
    <div class="chef-card">
      <div class="flex items-start gap-4">
        <img src="${c.image}" alt="Portrait illustration of ${c[lang].name}" class="chef-medallion" width="96" height="96" loading="lazy">
        <div>
          <h3 class="font-display text-xl" style="color:var(--ink)">${c[lang].name}</h3>
          <p class="chef-role">${c[lang].role}</p>
          <p class="text-xs mt-1" style="color:var(--ink-soft)">${c.years} ${t("team.years", lang)}</p>
        </div>
      </div>
      <p class="mt-4 text-sm leading-relaxed" style="color:var(--ink-soft)">${c[lang].bio}</p>
    </div>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", renderTeam);
document.addEventListener("sakura:langchange", renderTeam);
