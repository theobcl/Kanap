// Récupérer les éléments commums aux fonctions de ce fichier
let itemId = new URL(document.location).searchParams.get("id");
let colorSelect = document.querySelector("#colors");

main(); 

function main() {
  getItem(); 
  addToCart();
}; 

function getItem() {
  fetch(`http://localhost:3000/api/products/${itemId}`)
    // Récupérer uniquement les informations du produit de la page grace à son id
    .then(function(response) {
      if (response.ok) {
          return response.json();
      }
    })
    // Générer le contenu des différents éléments de la page
    .then(function(item) {
      // Modifier le titre de l'onglet de la page sur le navigateur
      document.title = item.name
      // Générer l'image du produit
      let itemImgDiv = document.querySelector(".item__img");
      let itemImg = document.createElement("img");
      itemImgDiv.appendChild(itemImg);
      itemImg.src = item.imageUrl;
      // Générer le nom du produit
      document.querySelector("#title").innerHTML = item.name;
      // Générer le prix du produit
      document.querySelector("#price").innerHTML = `${item.price},00 `;
      // Générer la description du produit
      document.querySelector("#description").innerText = item.description;
      // Générer les options de couleurs du produit
      for (let i = 0; i < item.colors.length; i++) {
          let option = document.createElement("option");
          option.innerText = item.colors[i];
          colorSelect.appendChild(option);
      }
    })
    // Générer un message en cas d'erreur
    .catch(function(error) {
      console.log(error)
    });
};

function addToCart() {
  // Récuperer le bouton d'ajout au panier
  let addToCartBtn = document.querySelector("#addToCart");
  // Création d'un evenement lors du click sur le bouton d'ajout au panier
  addToCartBtn.addEventListener("click", () => {
    // Récuperer la couleur sélectionnée par l'utilisateur
    let itemColor = colorSelect.value
    // Récuperer la quantité sélectionnée par l'utilisateur
    let itemQuantity = document.querySelector("#quantity").value;
    // Si 0 < quantité < 100 et qu'une couleur a été choisi
    if (0 < itemQuantity < 100 && itemColor !== "--SVP, choisissez une couleur --") {
      // Création du objet avec les informations du produit ajouté au panier
      let itemAdded = {
        id: itemId,
        color: itemColor,
        quantity: parseFloat(itemQuantity),
      };

      let productInKart = JSON.parse(localStorage.getItem("item"))
      // s'il y a un produit dans le local storage //
      if (productInKart) {
        // On check si ce produit n'est pas le même que celui qu'on ajoute au panier
        const similarItem = productInKart.find(element => element.id == itemAdded.id && element.color == itemAdded.color);
        if (similarItem) {
          // Si c'est le cas, on incremente la quantité du produit
          similarItem.quantity += itemAdded.quantity;
          localStorage.setItem("item", JSON.stringify(productInKart));
        } else {
          // Sinon, on ajoute un nouveau produit
          productInKart.push(itemAdded);
          localStorage.setItem("item", JSON.stringify(productInKart));
        }
      // Si le LS n'existe pas encore, on l'initialise et on ajoute le produit au panier
      } else {
        productInKart = []
        productInKart.push(itemAdded)
        localStorage.setItem("item", JSON.stringify(productInKart))
      }
    };
  });
};
