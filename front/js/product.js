// Recupérer l'ID du produit
let itemId = new URL(document.location).searchParams.get("id");

// Récuperer / Créer les éléments à générer sur la page produit
let itemImgDiv = document.querySelector(".item__img");
let itemImg = document.createElement("img");
let itemName = document.querySelector("#title");
let itemDescription = document.querySelector("#description");
let itemPrice = document.querySelector("#price");
let colorSelect = document.querySelector("#colors");

main(); 

function main() {
  getItem(); 
  addToCart();
}; 

function getItem() {
  // Récupèrer uniquement les informations du produit de la page grace à son id
  fetch(`http://localhost:3000/api/products/${itemId}`)
    .then(function (response) {
    return response.json();
    })
    // Générer un message en cas d'erreur du fetching
    .catch((error) => {
    let container = document.querySelector("#item");
    container.innerHTML = "Nous n'avons pas réussi à afficher notre produit. Avez vous bien lancé le serveur local (Port 3000) ?";
    container.style.textAlign = "center";
    container.style.padding = "50px 0";
    })
    // Générer le contenu des différents éléments de la page
    .then(function (dataAPI) {
    item = dataAPI;

    // Modifier le titre de l'onglet de la page sur le navigateur
    document.title = item.name

    // Générer l'image du produit
    itemImgDiv.appendChild(itemImg);
    itemImg.src = item.imageUrl;
    
    // Générer le nom du produit
    itemName.innerHTML = item.name;

    // Générer le prix du produit
    itemPrice.innerHTML = `${item.price},00 `;

    // Générer la description du produit
    itemDescription.innerText = item.description;

    // Générer les options de couleurs du produit
    for (let i = 0; i < item.colors.length; i++) {
        let option = document.createElement("option");
        option.innerText = item.colors[i];
        colorSelect.appendChild(option);
    }
  });
}


function addToCart() {
  // Récuperer la couleur sélectionnée par l'utilisateur
  let itemColor = colorSelect.value
  // Récuperer la quantité sélectionnée par l'utilisateur
  let itemQuantity = document.querySelector("#quantity");
  // Récuperer le bouton d'ajout au panier
  let addToCartBtn = document.querySelector("#addToCart");
  
  // Création d'un evenement lors du click sur le bouton d'ajout au panier
  addToCartBtn.addEventListener("click", () => {
    // Si 0 < quantité < 100 et qu'une couleur a été choisi
    if (itemQuantity.value > 0 && itemQuantity.value < 100 && itemColor !== "--SVP, choisissez une couleur --") {

      // Création du objet avec les informations du produit ajouté au panier
      let itemAdded = {
        _id: itemId,
        color: itemColor,
        quantity: parseFloat(itemQuantity.value),
      };

      //  Gestion du localStorage
      let productsInCart = [];
      
      // Si le LS existe, on insère son contenu dans productsInCart, puis on le renvoit vers le LS avec le nouveau produit ajouté.
      if (localStorage.getItem("items") !== null) {
        productsInCart = JSON.parse(localStorage.getItem("items"));
      } 
      // Si le LS est vide, on le crée avec le produit ajouté
      productsInCart.push(itemAdded);
      localStorage.setItem("items", JSON.stringify(productsInCart));

      // Message de confirmation lors d'un ajout au panier
      itemContentContainer = document.querySelector(".item__content");
      
      if (typeof confirmationMessage == 'undefined') {
        confirmationMessage = document.createElement("h4")
        itemContentContainer.appendChild(confirmationMessage);
        confirmationMessage.innerHTML = `Vous avez ajouté ${itemQuantity.value} canapé(s) à votre panier !`;
        confirmationMessage.justifyContent = "center";
        setTimeout("location.reload(true);", 4000);
      }
    };
  });
}
