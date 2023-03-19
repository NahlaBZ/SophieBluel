const backEndApiURL = "http://localhost:5678/api/";
const token = localStorage.getItem("token");
let selectedCategory = "Tous";
const filterButtons = document.querySelector(".filter");
let filterNames;
let categories = [];

async function fetchWorks() {

    try {
        //Appel de l'API pour obtenir les projets
        works = await fetch(backEndApiURL + "works")
            .then((response) => response.json());
        console.log(works);

        //On récupère tous les noms de filtres de façon dynamique (toutes les catégories)
        filterNames = getFilterNames(works);
        //console.log(filterNames);

        //On ajoute les boutons filtres au HTML
        displayFilterButtons(filterNames, works);

        //Affichage des projets
        displayWorks();
    } catch (error) {
        //On affiche une erreur dans la console
        console.log(`Une erreur s'est produite:  ${error}`);
    }

}

//Récupération dynamique de toutes les catégories
function getFilterNames(works) {
    //On récupère l'ensemble des catégories
    return [...new Set(works.map((work) => work.category.name))];
}

function displayFilterButtons(filterNames, works) {
    // On crée d'abord le bouton "Tous" qui ne correspond pas à une vraie catégorie
    const allButton = document.createElement("button");
    //On lui attribue une classe css, ce bouton est celui qui est actif au démarrage de la page
    allButton.classList.add("btn", "active");
    //Texte
    allButton.textContent = "Tous";
    //On l'ajoute à la liste de boutons
    filterButtons.appendChild(allButton);
    filterButtons.classList.add("filter");

    //On crée une collection de boutons: Bouton Tous avec chacune des catégories
    const buttons = [
        allButton,
        ...filterNames.map((categoryName) => {
            const button = document.createElement("button");
            button.classList.add("btn");
            button.textContent = categoryName;
            filterButtons.appendChild(button);
            return button;
        }),
    ];

    //Lorsqu'on clique sur un filtre
    buttons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            //On récupère le texte du filtre sélectionné
            selectedCategory = e.target.textContent;
            //console.log(categoryIdValue);

            //Pour chaque bouton, on retire la classe active
            buttons.forEach((btn) => {
                btn.classList.remove("active");
            });

            //On ajoute la classe active au bouton cliqué
            e.target.classList.add("active");

            //On rafraîchit les projets
            displayWorks(works);
        });
    });
}

function displayWorks() {
    //On récupère le bloc "gallery"
    const gallery = document.querySelector(".gallery");
    //On vide le bloc défini par la classe gallery 
    gallery.innerHTML = "";

    //On crée un sous ensemble de works pour ajouter uniquement les projets qui correspondent au filtre
    const workDisplay = new Set();

    works.forEach((work) => {
        //Un projet est ajouté uniquement si sa catégorie est celle sélectionnée ou bien si Catégorie=Tous
        if (selectedCategory === "Tous" || work.category.name === selectedCategory) {
            workDisplay.add(work);
        }
    });

    // Afficher les projets
    workDisplay.forEach((work) => {
        gallery.appendChild(workTemplate(work));
    });
}

function workTemplate(work) {
    //Création de l'élément figure
    const workElement = document.createElement("figure");
    workElement.setAttribute("data-card-id", work.id);
    workElement.setAttribute("value", work.categoryId);

    //Création de l'élément img
    const imgElement = document.createElement("img");
    imgElement.setAttribute("src", work.imageUrl);
    imgElement.setAttribute("alt", work.title);

    // Création de l'élément figcaption
    const imgTitleElement = document.createElement("figcaption");
    imgTitleElement.textContent = work.title;

    workElement.appendChild(imgElement);
    workElement.appendChild(imgTitleElement);

    // Retourner l'élément figure créé
    return workElement;
}

//On recherche les noms de catégories avec les ids
async function fetchApiCategories() {
    try {
        await fetch(backEndApiURL + "categories")
            .then((res) => res.json())
            .then((data) => (categories = data));
        console.log(categories);
    } catch (error) {
        console.log(
            `Erreur dans la récupération des catégories:  ${error}`
        );
    }
}

window.addEventListener("load", () => {
    //On appelle la fonction fetchWorks au chargement de la page HTML
    fetchWorks();
    checkToken();
});



//Vérification de la présence du token pour savoir s'il l'administrateur est connecté
function checkToken() {
    // Vérifie si le token est dans le localStorage
    const token = localStorage.getItem("token");
    if (token) {
        //console.log("Token présent");
        adminmode();
    } else {
        //console.log("Token non présent ");
    }
}

//Déconnexion avec Logout, suppression du token
function removeToken() {
    // Supprime le token du localStorage
    localStorage.removeItem("token");

}

//événement fermeture onglet ou redirection vers un autre site
window.addEventListener("unload", removeToken);

// Affichage du mode admin
function adminmode() {
    adminHTML();




    //SUPRESSION DES TRAVAUX DE L'API
    const deleteWorksApi = document.querySelector("body > div > button");
    //Confirmation DELETE CARTES dans L'API
    deleteWorksApi.addEventListener("click", (e) => {
        e.preventDefault();
        functionDeleteWorksApi();
    });
}

const adminHTML = () => {


    //Créer le bandeau noir Admin Editor
    const blackEditor = document.createElement("div");
    blackEditor.classList.add("blackEditor");
    document
        .querySelector("body")
        .insertAdjacentElement("afterbegin", blackEditor);

    const spanblackEditor = document.createElement("span");
    spanblackEditor.classList.add("projectRemove");
    spanblackEditor.textContent = "Mode édition";

    //Créer Le SPAN avec le "i"
    const iconblackEditor = document.createElement("i");
    iconblackEditor.className = "fa-regular fa-pen-to-square";

    //Insérer l'élément i avant le texte de span
    spanblackEditor.insertBefore(iconblackEditor, spanblackEditor.firstChild);

    const btnblackEditor = document.createElement("button");
    btnblackEditor.textContent = "publier les changements";

    blackEditor.appendChild(spanblackEditor);
    blackEditor.appendChild(btnblackEditor);

    //Pointage des position à injecter
    const figure = document.querySelector("#introduction figure");
    const titleProject = document.querySelector("#portfolio > h2");

    //SPAN "Mode édition" en dessou de Sophie
    const spanFigure = spanblackEditor.cloneNode(true);
    spanFigure.classList.remove("projectRemove");
    spanFigure.classList.add("figureRemove");
    //SPAN "Mode édition" des Projets
    const spanTitleProject = spanblackEditor.cloneNode(true);
    spanTitleProject.classList.remove("projectRemove");
    spanTitleProject.setAttribute("id", "titleProjectRemove");

    //INJECTION  SPAN
    figure.appendChild(spanFigure);
    titleProject.appendChild(spanTitleProject);

    //Login -> Logout HTML

    // Sélectionner l'élément <li> à modifier
    const logout = document.querySelector(
        "body > header > nav > ul > li:nth-child(3)"
    );

    // Créer un élément <a> pour le lien de déconnexion
    const logoutLink = document.createElement("a");
    logoutLink.href = "./index.html";

    const logoutText = document.createTextNode("logout");
    logoutLink.appendChild(logoutText);

    logout.innerHTML = "";
    logout.appendChild(logoutLink);

    //  DECONEXion
    logoutLink.addEventListener("click", (event) => {
        event.preventDefault();
        removeToken();
        window.location.assign("./index.html");
    });

    //Ajout class pour mieux intégrer le Blackeditor *fixed
    document.body.classList.add("marginTop");

    //Delete les filtres de Recherche HTML
    filterButtons.remove();
};


