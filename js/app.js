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
  const userRole = localStorage.getItem("userRole");
  const loginBtn = document.querySelector("#header__login");
  const adminBtn = document.querySelector("#header__admin");
  if (!loginBtn) return;

  if (token) {
    loginBtn.textContent = "Se déconnecter";
    loginBtn.href = "#";
    loginBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
    if (userRole === "0" || userRole === "1") {
      adminBtn.classList.remove("is-hidden");
      adminBtn.style.display = "flex";
      adminBtn.href = "admin.html";
    }
  } else {
    loginBtn.textContent = "Se connecter";
    loginBtn.href = "login.html";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // 1) On injecte header et footer en premier, puis on met à jour le bouton
  await Promise.all([
    loadComponent("header", "components/header.html"),
    loadComponent("footer", "components/footer.html"),
  ]);
  updateHeaderButton();

  // 2) On injecte tous les autres fragments
  await Promise.all([
    loadComponent("hero", "components/hero.html"),
    loadComponent("howto", "components/howto.html"),
    loadComponent("cta", "components/cta.html"),
    loadComponent("cards", "components/cards.html"),
    loadComponent("progress", "components/progress.html"),
    loadComponent("admin", "components/admin.html"),
    loadComponent("login", "components/login.html"),
    loadComponent("register", "components/register.html"),
  ]);

  // 3) Hooks et animations
  if (window.initLazyLoad) window.initLazyLoad();

  document.dispatchEvent(new Event("cards-ready"));
  document.dispatchEvent(new Event("admin-ready"));
});
