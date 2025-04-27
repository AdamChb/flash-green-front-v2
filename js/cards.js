/* ------------------------------------------------------------------
   Système de cartes — attend le signal “cards-ready” envoyé par app.js
------------------------------------------------------------------ */
document.addEventListener("cards-ready", initFlashCards);
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

function validateQuestion(questionId, isValid) {
  fetch(`https://flash-green.api.arcktis.fr/api/questions/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ questionId, isValid }),
  })
    .then((response) => {
      if (!response.ok) {
        console.error("HTTP error", response.status, response.statusText);
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Erreur lors de l'enregistrement de la réponse :", error);
    });
}

function initFlashCards() {
  const token = localStorage.getItem("token");
  /* --------- Cartes ------------------------------------ */
  fetch("https://flash-green.api.arcktis.fr/api/questions/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.error("HTTP error", response.status, response.statusText);
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      /* --------- références DOM -------------------------------------- */
      const container = document.getElementById("card-container");
      const btnOK = document.getElementById("btn-success");
      const btnKO = document.getElementById("btn-fail");
      let queue = [...data]; // copie du deck
      queue.sort(() => Math.random() - 0.5); // mélange le deck

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
        const cur = queue[0];
        validateQuestion(cur.ID_question, 1); // enregistre la réponse
        queue.shift(); // retire définitif
        swipe("right", showNext);
      });

      btnKO.addEventListener("click", () => {
        const cur = queue.shift();
        validateQuestion(cur.ID_question, 0); // enregistre la réponse
        queue.push(cur); // remet à la fin
        swipe("left", showNext);
      });

      /* --------- start ----------------------------------------------- */
      showNext();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      alert("Erreur de chargement des cartes. Veuillez réessayer.");
    });
}
