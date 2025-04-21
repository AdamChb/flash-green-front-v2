/* ------------------------------------------------------------------
   Système de cartes — attend le signal “cards-ready” envoyé par app.js
------------------------------------------------------------------ */
document.addEventListener('cards-ready', initFlashCards);

function initFlashCards(){

  /* --------- 5 cartes de test ------------------------------------ */
  const deck = [
    { q:`Quelle est la différence\nentre Green IT et IT for Green ?`,
      a:`<strong>Green IT :</strong> réduire l’empreinte du numérique.<br>
         <strong>IT for Green :</strong> verdir les autres secteurs.` },

    { q:`Donne 3 indicateurs clés\ndu Green IT.`,
      a:`Empreinte carbone, conso d'énergie, durée de vie des équipements.` },

    { q:`Cite un pattern d'éco‑conception\ncôté front.`,
      a:`Lazy‑loading des médias.` },

    { q:`Quel format d’image est\nefficace en compression ?`,
      a:`WebP (ou AVIF) : 25‑35 % plus léger que JPEG/PNG.` },

    { q:`Qu’est‑ce que l’accessibilité\nnumérique ?`,
      a:`Garantir l'accès à tous, y compris les personnes en situation de handicap.` }
  ];

  /* --------- références DOM -------------------------------------- */
  const container = document.getElementById('card-container');
  const btnOK = document.getElementById('btn-success');
  const btnKO = document.getElementById('btn-fail');
  let queue = [...deck];

  /* --------- helpers --------------------------------------------- */
  const createCard = ({q,a})=>{
    const el = document.createElement('article');
    el.className = 'flashcard';
    el.innerHTML = `
      <div class="flashcard__inner">
        <div class="flashcard__face flashcard__front flashcard__text">
          ${q.replace(/\n/g,'<br>')}
        </div>
        <div class="flashcard__face flashcard__back flashcard__text">
          ${a}
        </div>
      </div>`;
    return el;
  };

  const showNext = ()=>{
    if(!queue.length){
      container.innerHTML = "<p class='flashcard__text'>🎉 Terminé !</p>";
      btnOK.disabled = btnKO.disabled = true;
      return;
    }
    container.replaceChildren( createCard(queue[0]) );
  };

  /* --------- swipe animation ------------------------------------- */
  const swipe = (dir, cb)=>{
    const card = container.querySelector('.flashcard');
    if(!card){ cb(); return; }
    card.classList.add(dir==='right' ? 'swipe-right' : 'swipe-left');
    card.addEventListener('transitionend', cb, { once:true });
  };

  /* --------- interactions ---------------------------------------- */
  container.addEventListener('click', e=>{
    const c = e.target.closest('.flashcard');
    if(c) c.classList.toggle('is-flipped');
  });

  btnOK.addEventListener('click', ()=>{
    queue.shift();                       // retire définitif
    swipe('right', showNext);
  });

  btnKO.addEventListener('click', ()=>{
    const cur = queue.shift();
    queue.push(cur);                     // remet à la fin
    swipe('left', showNext);
  });

  /* --------- start ----------------------------------------------- */
  showNext();
}
