document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const auth_form = document.querySelector(".auth-form");

    auth_form.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent the default form submission
      console.log("Form submitted");

      const username = document.querySelector("#name").value;
      const email = document.querySelector("#email").value;
      const new_password = document.querySelector("#new-password").value;
      const confirm_password =
        document.querySelector("#confirm-password").value;

      if (new_password !== confirm_password) {
        alert("Passwords do not match. Please try again.");
        return;
      }

      const password = new_password; // Use the new password for login

      fetch("https://flash-green.api.arcktis.fr/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
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
        .then(() => {
          window.location.href = "/login.html";
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          alert("Login failed. Please check your credentials and try again.");
        });
    });
  }, 1000); // Simulate a delay for demonstration purposes
});
