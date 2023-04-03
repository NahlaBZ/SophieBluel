const backEndApiURL = "http://localhost:5678/api/";
let works;
const token = localStorage.getItem("token");
let selectedCategory = "Tous";
const filterButtons = document.querySelector(".filter");
let filterNames;
let categories = [];

// Actions à faire au chargement de la page
window.addEventListener("load", () => {
    // Chargement des travaux
    fetchWorks();
    // Récupération des catégories et leurs ids
    fetchApiCategories();
    // Vérification du Token de connexion
    checkToken();
});

//événement fermeture onglet ou redirection vers un autre site
window.addEventListener("unload", removeToken);


// Récupération et affichage des projets
async function fetchWorks() {

    try {
        //Appel de l'API pour obtenir les projets
        works = await fetch(backEndApiURL + "works")
            .then((response) => response.json());
        //console.log(works);

        //On récupère tous les noms de filtres de façon dynamique (toutes les catégories)
        filterNames = getFilterNames();
        //console.log(filterNames);

        //On ajoute les boutons filtres au HTML
        displayFilterButtons(filterNames);

        //Affichage des projets
        displayWorks();
    } catch (error) {
        //On affiche une erreur dans la console
        console.log(`Une erreur s'est produite:  ${error}`);
    }

}

// Récupération dynamique de toutes les catégories
function getFilterNames() {
    // On récupère l'ensemble des catégories dans un Set (pour éviter les doublons)
    return [...new Set(works.map((work) => work.category.name))];
}

//Affichage des boutons filtres
function displayFilterButtons(filterNames) {
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

    //On définit l'action à faire si on clique sur un bouton filtre
    buttons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            //On récupère le texte du filtre sélectionné
            selectedCategory = e.target.textContent;
            //console.log(categoryIdValue);

            //Pour chaque bouton, on enlève la classe active
            buttons.forEach((btn) => {
                btn.classList.remove("active");
            });

            //On ajoute la classe active au bouton cliqué
            e.target.classList.add("active");

            //On rafraîchit les projets
            displayWorks();
        });
    });
}

// Affichage des projets en fonction du filtre sélectionné
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

    // Affichage des projets
    workDisplay.forEach((work) => {
        gallery.appendChild(workTemplate(work));
    });
}


//Affichage du projet passé en paramètre
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

    // Ajout des éléments construits
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

//Vérification de la présence du token pour savoir si l'administrateur est connecté
function checkToken() {
    // Vérifie si le token est dans le localStorage
    const token = localStorage.getItem("token");
    if (token) {
        //console.log("Token présent");
        // Affichage en mode Admin
        adminmode();
    } else {
        //console.log("Token non présent ");
    }
}

//Déconnexion avec Logout, suppression du token
function removeToken() {
    // Supprime le token du localStorage
    localStorage.removeItem("token");
    sessionStorage.removeItem("deletedImages");

}

// Affichage du mode admin (utilisateur connecté)
function adminmode() {
    adminHTML();

    const modalJs = document.getElementById("titleProjectEdition");

    // Quand on clique sur le bouton Modifier
    modalJs.addEventListener("click", (e) => {
        e.preventDefault();
        modalHTML();
        displayModal();
        openModal();
        openAddPictureModal();
    });

    const deleteWorksApi = document.querySelector("body > div > button");

    // Publication de la suppression de projets
    deleteWorksApi.addEventListener("click", (e) => {
        e.preventDefault();
        publishDeletedWorks();
    });

}

const adminHTML = () => {
    //Création du bandeau noir Admin Editor
    const blackEditor = document.createElement("div");
    blackEditor.classList.add("blackEditor");
    document
        .querySelector("body")
        .insertAdjacentElement("afterbegin", blackEditor);

    // Création du SPAN 
    const spanblackEditor = document.createElement("span");
    spanblackEditor.classList.add("projectEdition");
    spanblackEditor.textContent = "Mode édition";
    //création de l'élement i : Icone Pen to Square : 
    const iconblackEditor = document.createElement("i");
    iconblackEditor.className = "fa-regular fa-pen-to-square";

    //Insertion de l'élément i avant le texte de span
    spanblackEditor.insertBefore(iconblackEditor, spanblackEditor.firstChild);
    //Création du bouton 'publier les changement'
    const btnblackEditor = document.createElement("button");
    btnblackEditor.textContent = "publier les changements";
    //Ajout du span et le bouton au bandeau noir 
    blackEditor.appendChild(spanblackEditor);
    blackEditor.appendChild(btnblackEditor);


    //Ajout des boutons "Modifier"
    const figurePosition = document.querySelector("#introduction figure");
    const projectTitlePosition = document.querySelector("#portfolio > h2");

    //SPAN "Modifier" en dessous de la photo de Sophie
    const spanFigure = document.createElement("span");
    spanFigure.classList.add("figureEdition");
    spanFigure.textContent = "Modifier";
    // Ajout de l'icone avant "Modifier"
    const iconfigureEdition = document.createElement("i");
    iconfigureEdition.className = "fa-regular fa-pen-to-square";
    //Insertion de l'élément i avant le texte de span 
    spanFigure.insertBefore(iconfigureEdition, spanFigure.firstChild);

    // Ajout du bouton "Modifier" à côté de Mes Projets
    const spanTitleProject = spanFigure.cloneNode(true);
    spanTitleProject.classList.remove("figureEdition");
    spanTitleProject.setAttribute("id", "titleProjectEdition");

    //Insertion des deux éléments créés
    figurePosition.appendChild(spanFigure);
    projectTitlePosition.appendChild(spanTitleProject);

    // Remplacement du bouton "login" par "logout ""
    // Sélection de l'élément <li> à modifier
    const logout = document.querySelector(
        "body > header > nav > ul > li:nth-child(3)"
    );

    // Création d'un élément <a> pour le lien de déconnexion
    const logoutLink = document.createElement("a");
    logoutLink.href = "./index.html";

    const logoutText = document.createTextNode("logout");
    logoutLink.appendChild(logoutText);

    logout.innerHTML = "";
    logout.appendChild(logoutLink);

    // Action à faire lorsque l'utilisateur clique sur "logout"
    logoutLink.addEventListener("click", (event) => {
        event.preventDefault();
        //Suppression du token
        removeToken();
        //Redirection vers la page index
        window.location.assign("./index.html");
    });

    //Ajout class pour mieux intégrer le Blackeditor
    document.body.classList.add("marginTop");

    //Masquage des boutons de filtres lorsque l'utilisateur est connecté
    filterButtons.remove();
};

// Affichage de la Modal d'édition
function openModal() {
    let deletedImages = {};
    // Récupération de l'emplacement à modifier
    document.getElementById("modalworks").innerHTML = "";

    // Récupération des images
    const imagesUrl = [...document.querySelectorAll(".gallery img")].map((img) =>
        img.getAttribute("src")
    );

    const imagesUrlSet = new Set(imagesUrl);

    //Ajout des images
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const imageElements = [...imagesUrlSet].map((link, index) => {
        const container = document.createElement("figure");
        const img = document.createElement("img");
        const p = document.createElement("p");
        const iconDelete = document.createElement("i");

        // Ajout de l'attribut data-card-id
        container.setAttribute("data-card-id", works[index].id);
        iconDelete.id = "deleteIcon";
        iconDelete.classList.add("fa-solid", "fa-trash-can", "iconModal");
        iconDelete.setAttribute("aria-hidden", "true");
        img.src = link;
        p.textContent = "éditer";
        container.appendChild(img);
        container.appendChild(p);
        container.appendChild(iconDelete);

        // Ajout de l'icône de déplacement uniquement sur le premier élément
        if (index === 0) {
            const iconMove = document.createElement("i");
            iconMove.id = "moveIcon";
            iconMove.classList.add(
                "fa-solid",
                "fa-arrows-up-down-left-right",
                "iconModal"
            );
            container.appendChild(iconMove);
        }
        // Action à faire lorsque l'utilisateur clique sur le bouton Supprimer
        iconDelete.addEventListener("click", async (e) => {
            e.preventDefault();
            const cardDelete = e.target.parentNode.getAttribute("data-card-id");
            //Masquage de l'image à supprimer
            removeElement(cardDelete);
            deletedImages[cardDelete] = true;
            console.log(deletedImages);

            // Conversion de l'objet en chaîne de caractères JSON
            const deletedImagesJSON = JSON.stringify(deletedImages);
            // Stockage des images supprimées dans sessionStorage
            sessionStorage.setItem("deletedImages", deletedImagesJSON);
        });

        //Masquage de l'image à supprimer
        function removeElement(cardDelete) {
            const card = document.querySelector(`[data-card-id="${cardDelete}"]`);
            if (card && card.parentNode) {
                card.parentNode.removeChild(card);
                container.remove(card);
            }
        }

        //Bouton "Supprimer la galerie"
        const deleteALL = document.querySelector("#deleteAllWorks");

        // Action à faire lorsque l'utilisateur clique sur "Supprimer la galerie"
        deleteALL.addEventListener("click", () => {
            const figureModals = document.querySelectorAll("#modalworks figure");
            const galleryModals = document.querySelectorAll("#portfolio figure");
            const deletedImages =
                JSON.parse(sessionStorage.getItem("deletedImages")) || {};
            const imageIds = [];

            figureModals.forEach((figure) => {
                const dataCardId = figure.getAttribute("data-card-id");
                imageIds.push(dataCardId);
                // stocke l'ID deletedImages
                deletedImages[dataCardId] = true;
            });

            // Masquage de toutes les images
            figureModals.forEach((figure) => figure.remove());
            galleryModals.forEach((figure) => figure.remove());

            // Stockage des images à supprimer
            sessionStorage.setItem("deletedImages", JSON.stringify(deletedImages));
        });

        return container;
    });

    const galleryMap = document.getElementById("modalworks");
    galleryMap.append(...imageElements);
}

//Publication des suppressions
const publishDeletedWorks = () => {
    // Récupérer les images à supprimer dpuis le sessionStorage
    const deletedImagesJSON = sessionStorage.getItem("deletedImages");
    // Convertir la chaîne JSON en objet JavaScript
    const deletedImages = JSON.parse(deletedImagesJSON);

    // Suppression des projets à supprimer
    //méthode JavaScript qui renvoie un tableau contenant les clés d'un objet
    Object.keys(deletedImages).forEach(async (id) => {
        try {
            if (token === false) return console.log({ error: "Pas connecté" });

            const response = await fetch(`${backEndApiURL}works/${id}`, {
                method: "DELETE",
                headers: {
                    Accept: "*/*",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                console.log(`Image avec ID ${id} supprimée`);
            } else {
                throw new Error(response.statusText);
            }
        } catch (e) {
            console.error(
                `Erreur lors de la suppression de l'image avec ID ${id}: ${e}`
            );
        }
    });
};



// Ouverture de la page d'ajout des photos à partir de la modale
function openAddPictureModal() {
    const addProject = document.getElementById("addPictureModal");
    const inputFile = document.getElementById("filetoUpload");
    const selectCategory = document.getElementById("category");
    const editSection = document.querySelector("#editSection");
    const addPictureToDB = document.getElementById("editWorks");
    const gallerySection = document.querySelector("#modalContent");
    const previewModal = document.querySelector("#previewModal");
    let iCanSubmit = false;

    //
    addProject.addEventListener("click", () => {
        gallerySection.style.display = "none";
        editSection.style.display = "";
        previewModal.style.display = "initial";
    });

    previewModal.addEventListener("click", () => {
        gallerySection.style.display = "";
        editSection.style.display = "none";
        previewModal.style.display = "none";
    });

    // Image
    inputFile.addEventListener("change", addPicture);

    // Catégorie
    if (selectCategory.options.length === 0) {
        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = "";
        selectCategory.appendChild(emptyOption);

        categories.forEach((category) => {
            const option = document.createElement("option");
            option.textContent = category.name;
            option.setAttribute("data-id", category.id);
            selectCategory.appendChild(option);
        });
    }


    editSection.addEventListener("input", () => {
        const editTitle = document.querySelector("#title");
        const errorImg = document.getElementById("errorImg");
        const titleError = document.querySelector("#ErrorTitleSubmit");
        const categoryError = document.querySelector("#ErrorCategorySubmit");
        const submitForm = document.querySelector(
            "#editWorks > div.footerModal.editFooter > input[type=submit]"
        );
        iCanSubmit = false;
        titleSelected = false;
        categorySelected = false;
        submitForm.style.background = " grey";
        let category = document.querySelector("#category").value;
        const title = editTitle.value;
        const image = inputFile.files[0];
        // console.log(typeof image);

        if (image === null || image === undefined) {
            errorImg.textContent = "Veuillez selectionnez une image";
            imageSelected = false;
        } else if (title.length < 1) {
            titleError.textContent = "Ajoutez un titre";
            titleSelected = false;
        } else if (category === "") {
            categoryError.textContent = "Choisissez une catégorie";
            titleError.textContent = "";
            categorySelected = false;
        } else {
            //submitForm.style.background = " #1d6154";
            titleError.textContent = "";
            categoryError.textContent = "";
            categorySelected = true;
            titleSelected = true;
            imageSelected = true;

            //iCanSubmit = true;
        }
        if (titleSelected && categorySelected && imageSelected) {
            submitForm.style.background = " #1d6154";
            iCanSubmit = true;
        }
    });

    addPictureToDB.addEventListener("submit", (e) => {
        e.preventDefault();

        if (iCanSubmit) {
            //Récupérer image
            const image = inputFile.files[0];

            //Récupérer Titre
            const title = document.querySelector("#title").value;

            //Récupérer id du fetch Category depuis la liste
            let categorySelect = document.querySelector("#category");
            let selectedOption = categorySelect.selectedOptions[0];
            let category = selectedOption.getAttribute("data-id");
            category = parseInt(category);

            const formData = new FormData();
            formData.append("image", image);
            formData.append("title", title);
            formData.append("category", category);
            //console.log(formData);

            fetch(backEndApiURL + "works", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
                body: formData,
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Requête POST non passée");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Requête POST passée", data);
                    fetchWorks();
                    displayWorks();
                    closeModal();
                    // réinitialisation du champ inputFile sinon il envoie plusieur formData en post
                    inputFile.value = "";
                })
                .catch((error) => {
                    console.error("Error:", error);
                    console.log("Requête POST non passée");
                });
        } else {
            console.log("Formulaire invalide");
        }
    });
}
function disableScroll() {
    document.body.classList.add("modalOpen");
}

function enableScroll() {
    document.body.classList.remove("modalOpen");
}

function displayModal() {
    const modal = document.querySelector("#modal");
    const closeModalBtn = document.querySelector("#closeModal");
    closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
    disableScroll();
}
function closeModal() {
    document.getElementById("modal").remove();
    enableScroll();
}

const modalHTML = () => {
    document.body.insertAdjacentHTML(
        "beforeend",
        `
            <aside id="modal" class="modal" role="dialog" aria-labelledby="modalTitle" aria-hidden="true" display="initial">
    <div id="modalBlock">
      <i id="closeModal" class="fa-solid fa-xmark"></i>
      <i id="previewModal" class="fa-solid fa-arrow-left "></i>
      
      <!-- GALERIE PHOTO -->
      <section class="modalTemplate" id="modalContent">
        <div id="editionGallery">
          <h2 class="modalTitle">Galerie photo</h2>
         
          <div id="modalworks">
          </div>
        </div>
        <div class="footerModal">
          <hr>
          <input type="submit" value="Ajouter une photo" id="addPictureModal">
          <p id="deleteAllWorks">Supprimer la galerie</p>
        </div>
      </section>
      <!-- EDIT PHOTO -->
      <section class="modalTemplate" id="editSection" style="display:none">
        <h2 class="modalTitle">Ajout photo</h2>
        <form id="editWorks">
          <div id="addImageContainer">
            <i class="fa-solid fa-image"></i>
            <div id="inputFile">
              <label for="filetoUpload" class="fileLabel">
                <span>+ Ajouter une photo</span>
                <input type="file" id="filetoUpload" name="image" accept="image/png, image/jpeg"
                  class="file-input">
              </label>
            </div>
            <span class="filesize">jpg, png : 4mo max</span>
            <span id="errorImg"></span>
          </div>
          <div class="inputEdit" id="addTitle">
            <label for="title">Titre</label>
            <input type="text" name="title" id="title" class="inputCss" required>
            <span id="ErrorTitleSubmit" class="errormsg"></span>
          </div>
          <div class=" inputEdit" id="addCategory">
            <label for="category">Catégorie</label>
            <select name="category" id="category" data-id="" class="inputCss"></select>
            <span id="ErrorCategorySubmit" class="errormsg"></span>
          </div>
          <div class="footerModal editFooter">
            <hr>
            <input type="submit" value="Valider">
          </div>
        </form>
      </section>
    </div>
  </aside>
            `
    );
};
const addPicture = () => {
    const inputFile = document.getElementById("filetoUpload");
    const viewImage = document.getElementById("addImageContainer");
    const file = inputFile.files[0];
    // Taille maximale = 4MO
    const maxFileSize = 4 * 1024 * 1024;

    if (file.size > maxFileSize) {
        errorImg.textContent = "Votre image est trop volumineuse";
        console.log("fichier > 4MO!");
        return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", function () {
        viewImage.innerHTML = "";
        const img = document.createElement("img");
        img.setAttribute("src", reader.result);
        viewImage.appendChild(img);
        viewImage.style.padding = "0";
    });

    reader.readAsDataURL(file);
};
