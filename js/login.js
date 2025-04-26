document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const auth_form = document.querySelector(".auth-form");

    auth_form.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent the default form submission

      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;

      fetch("https://flash-green.api.arcktis.fr/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => {
          if (!response.ok) {
            console.error("HTTP error", response.status, response.statusText);
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .then((data) => {
          localStorage.setItem("token", data.token); // Store the token in local storage
          window.location.href = "/cards.html";
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          alert("Login failed. Please check your credentials and try again.");
        });
    });
  }, 1000); // Simulate a delay for demonstration purposes
});
