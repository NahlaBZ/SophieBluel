// Variable à afficher pour le mode éditeur
const modeEdition = document.querySelector(".mode-edition");
const editBtn = document.querySelectorAll(".modifier");
const logout = document.querySelector('[href="login.html"]');
const filters = document.querySelectorAll("#category");

// Si nous avons récupéré le token
if (isConnected()) {
    modeEdition.style.display = "flex";

    const logo = document.querySelector("#logo");
    logo.style.paddingTop = "25px";
    logo.style.fontSize = "17px";

    const navHeader = document.querySelector("#navHeader");
    navHeader.style.paddingTop = "25px";

    for (let i = 0; i < filters.length; i++) {
        filters[i].style.display = "none";
    }

    for (let i = 0; i < editBtn.length; i++) {
        editBtn[i].style.display = "flex";
    }

    // Changer login en logout
    logout.textContent = "logout";
    logout.setAttribute("href", "#");

    // Lorque l'on clic sur logout cela déconnecte l'utilisateur
    logout.addEventListener("click", event => {
        event.preventDefault();

        localStorage.removeItem("userId");
        localStorage.removeItem("auth");
        window.location.reload();
    });
}