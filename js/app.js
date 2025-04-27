/* ---------- js/app.js ---------- */

/* Charge un fragment HTML dans le conteneur #id -------------------------- */
async function loadComponent(id, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);

    const target = document.getElementById(id);   // vérifie que l’élément existe
    if (target) target.innerHTML = await res.text();
  } catch (e) {
    console.error(`Erreur chargement ${url} :`, e);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadComponent('header',    'components/header.html'),
    loadComponent('footer',    'components/footer.html'),
    loadComponent('hero',      'components/hero.html'),
    loadComponent('howto',     'components/howto.html'),
    loadComponent('cta',       'components/cta.html'),
    loadComponent('cards',     'components/cards.html'),
    loadComponent('progress',  'components/progress.html'),
    loadComponent('admin',     'components/admin.html'),
    loadComponent('login',     'components/login.html'),
    loadComponent('register',  'components/register.html'),
  ]);

  if (window.initLazyLoad) window.initLazyLoad();
  document.dispatchEvent(new Event('cards-ready'));
  document.dispatchEvent(new Event('admin-ready'));

  // --- Gérer bouton déconnexion dans le header ---
  const token     = localStorage.getItem('token');
  const headerBtn = document.querySelector('.header__button');
  if (headerBtn && token) {
    headerBtn.textContent = 'Se déconnecter';
    headerBtn.href        = '#';
    headerBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '/login.html';
    });
  }
});