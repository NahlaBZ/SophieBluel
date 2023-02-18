const backEndAPI="http://localhost:5678/api/";

async function fetchWorks() {
    
    try {
        //Appel de l'API pour obtenir les travaux
        await fetch(backEndAPI + "works")
        .then((response) => response.json())
        .then((data) => (works = data));
        
        //console.log(works);
        displayWorks();
    } catch (error) {
        //On affiche une erreur dans la console
        console.log(`Une erreur s'est produite:  ${error}`);
    }
}

function displayWorks() {
    //On récupère le bloc "gallery"
    const gallery = document.querySelector(".gallery");
    //On vide le bloc défini par la classe gallery
    gallery.innerHTML = "";
    
    //On ajoute les travaux un par un
    works.forEach((work) => {
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