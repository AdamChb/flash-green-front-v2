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

/* Injection des composants une fois le DOM prêt ------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    /* commun à toutes les pages */
    loadComponent('header', 'components/header.html'),
    loadComponent('footer', 'components/footer.html'),

    /* page d’accueil */
    loadComponent('hero',   'components/hero.html'),
    loadComponent('howto',  'components/howto.html'),
    loadComponent('cta',    'components/cta.html'),

    /* page Cartes */
    loadComponent('cards',  'components/cards.html'),
    
    /* pages account */
    loadComponent('login',    'components/login.html'),
    loadComponent('register', 'components/register.html')
  ]);

  /* Lazy‑load des images (s’il existe) */
  if (window.initLazyLoad) window.initLazyLoad();

  document.dispatchEvent(new Event('cards-ready'));
});
