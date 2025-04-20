// EXTRAIT la logique sous forme d'une fonction
function initLazyLoad() {
    const imgs = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            obs.unobserve(img);
          }
        });
      }, { rootMargin: '50px 0', threshold: 0.01 });
      imgs.forEach(img => obs.observe(img));
    } else {
      imgs.forEach(img => { img.src = img.dataset.src; });
    }
  }
  
  // Rend la fonction accessible globalement
  window.initLazyLoad = initLazyLoad;
  