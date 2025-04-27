/* ------------------------------------------------------------------
   Avancé des cartes — attend le signal “cards-ready” envoyé par app.js
------------------------------------------------------------------ */
document.addEventListener("cards-ready", initProgress);

function initProgress() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  /* --------- Cartes ------------------------------------ */
  fetch("https://flash-green.api.arcktis.fr/api/questions/known/" + userId, {
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
    .then((known) => {
      fetch(
        "https://flash-green.api.arcktis.fr/api/questions/unknown/" + userId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            console.error("HTTP error", response.status, response.statusText);
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .then((unknown) => {
          /* --------- références DOM -------------------------------------- */
          const count = document.querySelector("#count");
          const content = document.querySelector("#progress-list");
          const progress = document.querySelector(".progress-fill");

          total = known.length + unknown.length;
          item_total = document.createElement("strong");
          item_total.textContent = `${unknown.length} / ${total}`;
          count.appendChild(item_total);

          progress.style.width = `${(known.length / total) * 100}%`;

          for (const item of data) {
            const el = document.createElement("tr");
            el.innerHTML = `
                <td>${item.Intitule}</td>
                <td>
                <a href="card.html?id=${item.id}">
                <button class="btn-small">Relire</button>
                </a><
                </td>
              `;
            content.appendChild(el);
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          alert("Failed to fetch unknown questions. Please try again later.");
        });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      alert("Failed to fetch known questions. Please try again later.");
    });
}
