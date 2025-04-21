document.addEventListener('click', (e)=>{
    const card = e.target.closest('.flashcard');
    if(card) card.classList.toggle('is-flipped');
  });
  