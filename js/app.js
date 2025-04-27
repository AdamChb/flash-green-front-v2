/* Charge un fragment HTML dans le conteneur #id */
async function loadComponent(id, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);

    const target = document.getElementById(id); // vérifie que l’élément existe

    if (target) target.innerHTML = await res.text();
  } catch (e) {
    console.error(`Erreur chargement ${url} :`, e);
  }
}

/* Met à jour le bouton du header en fonction du token */
function updateHeaderButton() {
  const token = localStorage.getItem("token");
  const headerBtn = document.querySelector(".header__button");
  if (!headerBtn) return;

  if (token) {
    headerBtn.textContent = "Se déconnecter";
    headerBtn.href = "#";
    headerBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  } else {
    headerBtn.textContent = "Se connecter";
    headerBtn.href = "login.html";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // 1) On injecte header et footer en premier, puis on met à jour le bouton
  await Promise.all([
    loadComponent("header", "components/header.html"),
    loadComponent("footer", "components/footer.html"),
  ]);
  updateHeaderButton();

  /* page d’accueil */
  loadComponent("hero", "components/hero.html");
  loadComponent("howto", "components/howto.html");
  loadComponent("cta", "components/cta.html");

  /* page Cartes */
  loadComponent("cards", "components/cards.html");
  loadComponent("progress", "components/progress.html");
  loadComponent("admin", "components/admin.html");

  /* pages account */
  loadComponent("login", "components/login.html");
  loadComponent("register", "components/register.html");

  // 3) Hooks et animations
  if (window.initLazyLoad) window.initLazyLoad();

  document.dispatchEvent(new Event("cards-ready"));
  document.dispatchEvent(new Event("admin-ready"));
});
