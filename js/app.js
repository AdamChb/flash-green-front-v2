// Charge un fragment HTML dans le conteneur #id
async function loadComponent(id, url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      document.getElementById(id).innerHTML = await res.text();
    } catch (e) {
      console.error(`Erreur chargement ${url}:`, e);
    }
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    // 1) On injecte tous les composants en parallèle
    await Promise.all([
      loadComponent('header', 'components/header.html'),
      loadComponent('hero',   'components/hero.html'),
      loadComponent('howto',  'components/howto.html'),
      loadComponent('cta',    'components/cta.html'),
      loadComponent('footer', 'components/footer.html'),
      loadComponent('login',    'components/login.html'),
      loadComponent('register', 'components/register.html')
    ]);
  
    // 2) Une fois injectés, on initialise le lazy‑load
    if (window.initLazyLoad) {
      window.initLazyLoad();
    }
  });
  