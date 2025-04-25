/* ------------------------------------------------------------------
   Système de cartes — attend le signal “cards-ready” envoyé par app.js
------------------------------------------------------------------ */
document.addEventListener("cards-ready", initFlashCards);

function initFlashCards() {
  const token = localStorage.getItem("token");
  /* --------- Cartes ------------------------------------ */
  /*  const deck = fetch("https://flash-green.api.arcktis.fr/api/questions/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
     },
    });*/

  /* --------- références DOM -------------------------------------- */
  const container = document.getElementById("card-container");
  const btnOK = document.getElementById("btn-success");
  const btnKO = document.getElementById("btn-fail");
  let queue = [...deck]; // copie du deck

  /* --------- helpers --------------------------------------------- */
  const createCard = ({ Intitule, Reponse }) => {
    const el = document.createElement("article");
    el.className = "flashcard";
    el.innerHTML = `
      <div class="flashcard__inner">
        <div class="flashcard__face flashcard__front flashcard__text">
          ${Intitule.replace(/\n/g, "<br>")}
        </div>
        <div class="flashcard__face flashcard__back flashcard__text">
          ${Reponse}
        </div>
      </div>`;
    return el;
  };

  const showNext = () => {
    if (!queue.length) {
      container.innerHTML = "<p class='flashcard__text'>🎉 Terminé !</p>";
      btnOK.disabled = btnKO.disabled = true;
      return;
    }
    container.replaceChildren(createCard(queue[0]));
  };

  /* --------- swipe animation ------------------------------------- */
  const swipe = (dir, cb) => {
    const card = container.querySelector(".flashcard");
    if (!card) {
      cb();
      return;
    }
    card.classList.add(dir === "right" ? "swipe-right" : "swipe-left");
    card.addEventListener("transitionend", cb, { once: true });
  };

  /* --------- interactions ---------------------------------------- */
  container.addEventListener("click", (e) => {
    const c = e.target.closest(".flashcard");
    if (c) c.classList.toggle("is-flipped");
  });

  btnOK.addEventListener("click", () => {
    queue.shift(); // retire définitif
    swipe("right", showNext);
  });

  btnKO.addEventListener("click", () => {
    const cur = queue.shift();
    queue.push(cur); // remet à la fin
    swipe("left", showNext);
  });

  /* --------- start ----------------------------------------------- */
  showNext();
}
