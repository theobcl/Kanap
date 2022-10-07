// Récupérer les éléments commums aux fonctions de ce fichier
let itemId = new URL(document.location).searchParams.get("id");
let colorSelectInput = document.querySelector("#colors");
let itemQuantityInput = document.querySelector("#quantity")

main(); 

function main() {
  getItem(); 
  restrictQuantityInput();
  addToCart();
}; 

function getItem() {
  fetch(`http://localhost:3000/api/products/${itemId}`)
    // Récupérer uniquement les informations du produit de la page grace à son id
    .then(function(res) {
      if (res.ok) {
          return res.json();
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
          colorSelectInput.appendChild(option);
      }
    })
    // Générer un message en cas d'erreur
    .catch(function(err) {
      console.log(err)
    });
};

// Empecher l'utilisateur de choisir une quantité inférieur à 0 ou supérieur à 100. 
function restrictQuantityInput() {
  itemQuantityInput.addEventListener("input", () => {
    if (itemQuantityInput.value > 100) {
      itemQuantityInput.value = 100;
    } else if (itemQuantityInput.value < 0) {
      itemQuantityInput.value = 0;
    };
  }); 
  itemQuantityInput.addEventListener("keypress", (e) => {
    if (e.charCode >= 48 && e.charCode <= 57) {
      e.charCode;
    } else {
      e.preventDefault();
    };
  });
};

function addToCart() {
  // Récuperer le bouton d'ajout au panier
  let addToCartBtn = document.querySelector("#addToCart");
  // Création d'un evenement lors du click sur le bouton d'ajout au panier
  addToCartBtn.addEventListener("click", () => {
    // Récuperer la couleur sélectionnée par l'utilisateur
    let itemColor = colorSelectInput.value
    // Récuperer la quantité sélectionnée par l'utilisateur
    let itemQuantity = +document.querySelector("#quantity").value;

    // Alerte si la couleur n'est pas selectionnée
    if (!itemColor) {
      alert("Veuillez selectionner une couleur s'il vous plaît");

    // Alerte si la quantité n'est pas selectionnée
    } else if (itemQuantity == 0) {
      alert("Veuillez selectionner une quantité entre 1 et 100 s'il vous plaît");

    // Si couleur et quantité sont complétées
    } else {
      let itemAdded = {
        id: itemId,
        color: itemColor,
        quantity: parseFloat(itemQuantity),
      };

      let productInCart = JSON.parse(localStorage.getItem("item"))
      // s'il y a un produit dans le local storage //
      if (productInCart) {
        // On check si ce produit n'est pas le même que celui qu'on ajoute au panier
        const similarItem = productInCart.find(element => element.id == itemAdded.id && element.color == itemAdded.color);

        if (similarItem) {
          // Si c'est le cas, on incremente la quantité du produit
          similarItem.quantity += itemAdded.quantity;
          localStorage.setItem("item", JSON.stringify(productInCart));
        } else {
          // Sinon, on ajoute un nouveau produit
          productInCart.push(itemAdded);
          localStorage.setItem("item", JSON.stringify(productInCart));
        }
      // Si le LS n'existe pas encore, on l'initialise et on ajoute le produit au panier
      } else {
        productInCart = []
        productInCart.push(itemAdded)
        localStorage.setItem("item", JSON.stringify(productInCart))
      }
    
    // Redirection vers le panier
    alert("Votre sélection a été ajouté au panier")
    window.location.href = '/front/html/cart.html'
    };
  });
};
