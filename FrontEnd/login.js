// CONST VERS L'API //
const apiWorks = "http://localhost:5678/api/";

// Variable email,password,form //
let emailInput = document.querySelector("#email");
let passwordInput = document.querySelector("#password");
let form = document.querySelector("form");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    // const pour avoir la value de password et de l'email //
    const userlogin = {
        email: emailInput.value,
        password: passwordInput.value,
    };
    fetch(apiWorks + "users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(userlogin),
    })
        // Message d'erreurs //
        .then((response) => {
            if (!response.ok) {
                let ExistingErrorContainer = document.querySelector(".error_container");
                if (ExistingErrorContainer) {
                    form.removeChild(ExistingErrorContainer);
                }

                // Affichage Erreur //
                const errorContainer = document.createElement("div");
                errorContainer.classList.add("error_container");
                const connexionInput = form.querySelector('input[type="submit"]');
                form.insertBefore(errorContainer, connexionInput);

                if (response.status === 404) {
                    errorContainer.innerText =
                        "Erreur dans l’identifiant ou le mot de passe";
                }
                if (response.status === 401) {
                    errorContainer.innerText =
                        "Erreur dans l’identifiant ou le mot de passe";
                }
            } else {
                return response.json();
            }
        })

        //Stockage  userId,token ET redirection //
        .then((data) => {
            localStorage.setItem("id", data.userId);
            localStorage.setItem("token", data.token);
            document.location.href = "index.html";
        })
        .catch((error) => {
            console.log(error);
        });
});
