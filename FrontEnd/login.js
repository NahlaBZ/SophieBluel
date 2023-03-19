const loginUrl = "http://localhost:5678/api/users/login";
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const form = document.getElementById("loginForm");
const loginError = document.querySelector(".loginError");
var data;

const logUser = {
    email: "",
    password: "",
};

//Quand on clique sur le bouton "Se connecter"
form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    loginUser();
});

// Action suite à la saisie de l'email
inputEmail.addEventListener("input", (e) => {
    //inputEmail.reportValidity();
    inputPassword.style.color = "#1d6154";
    inputEmail.style.color = "#1d6154";
    logUser.email = e.target.value;
});

// Action suite à la saisie du mot de passe
inputPassword.addEventListener("input", (e) => {
    //inputPassword.reportValidity();
    inputPassword.style.color = "#1d6154";
    inputEmail.style.color = "#1d6154";
    logUser.password = e.target.value;
});

//Au chargement de la page
document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();
    logUser.email = inputEmail.value;
    logUser.password = inputPassword.value;
    //console.log(logUser);
});

// Appel de la fonction login
async function loginUser() {
    try {
        data = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(logUser),
        }).then((response) => response.json());

        //console.log(data);

        if (data.message || data.error) {
            loginError.textContent = "Erreur dans l’identifiant ou le mot de passe";
            inputEmail.style.color = "red";
            inputPassword.style.color = "red";

        } else { //Si le login / mot de passe sont corrects

            //console.log("LogAdmin OK");
            //console.log(logUser);

            // stockage du token dans le stockage local
            localStorage.setItem("token", data.token);

            //Redirection vers index.html
            window.location.href = "./index.html";
        }
    } catch (error) {
        console.log(error);
    }
}