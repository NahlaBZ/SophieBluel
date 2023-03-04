const backEndApiURL = "http://localhost:5678/api/";
let selectedCategory = "Tous";
const filterButtons = document.querySelector(".filter");

async function fetchWorks() {

    try {
        //Appel de l'API pour obtenir les projets
        const works = await fetch(backEndApiURL + "works")
            .then((response) => response.json());
        //console.log(works);

        //On récupère tous les noms de filtres de façon dynamique (toutes les catégories)
        const filterNames = getFilterNames(works);
        //console.log(filterNames);

        //On ajoute les boutons filtres au HTML
        displayFilterButtons(filterNames, works);

        //Affichage des projets
        displayWorks(works);
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

function  displayFilterButtons(filterNames, works) {
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

function displayWorks(works) {
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


window.addEventListener("load", () => {
    //On appelle la fonction fetchWorks au chargement de la page HTML
    fetchWorks();
});