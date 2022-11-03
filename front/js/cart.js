main(); 

function main() {
	displayCartContent(); 
};

function displayCartContent () {
  fetch("http://localhost:3000/api/products")
	// Récupérer les données de tous les items dans l'API
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })

  .then(function(productsList) {  
		// Récupérer les données des items stocké dans le LS
		let productInLocalStorage = JSON.parse(localStorage.getItem('item'));

		// Pour chaque item dans le LS
		let cart = productInLocalStorage.map(product => {
			// Retrouver cet item dans l'API
			const index = productsList.findIndex(item => item._id === product.id, item => item.color === product.color);
			const data = productsList[index];
			// Générer un hash contenant les infos propres à cet item
			return {
				...product, 
				name: data.name,
				imageUrl: data.imageUrl,
				price: data.price,
				totalPrice: data.price * product.quantity
			}
		})

		// A partir de ce hash, générer un élément HTML pour chaque item stocké dans le LS
		const htmlCart = cart.map(product => `
				<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
				<div class="cart__item__img">
					<img src="${product.imageUrl}" alt="Photographie d'un canapé">
				</div>
				<div class="cart__item__content">
					<div class="cart__item__content__description">
						<h2>${product.name}</h2>
						<p>${product.color}</p>
						<p>${product.price} €</p>
					</div>
					<div class="cart__item__content__settings">
						<div class="cart__item__content__settings__quantity">
							<p>Qté : </p>
							<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
						</div>
						<div class="cart__item__content__settings__delete">
							<p class="deleteItem">Supprimer</p>
						</div>
					</div>
				</div>
			</article>
		`).join('')

		// Inserer cet élément HTML dans le code HTML de la page panier
		document.getElementById("cart__items").innerHTML = htmlCart;

		// Event pour augmenter ou diminuer la quantité d'un produit
		const quantityList = document.getElementsByClassName("itemQuantity");
		for (let item of quantityList) {
			item.addEventListener("change", changeQuantity)
		}

		// Event pour supprimer un item du panier
		const deleteList = document.getElementsByClassName("deleteItem");
			for (let item of deleteList) {
					item.addEventListener("click", removeFromCart)
			}

		// Affichage de la quantité total de produit dans le panier
		let totalQuantity = cart.reduce((acc , val) => acc + val.quantity, 0); 
		document.getElementById("totalQuantity").innerText = totalQuantity;

		// Affichage du prix total du panier
		document.getElementById("totalPrice").innerText = cart.reduce((acc , val) => acc + val.totalPrice, 0)

	})
  .catch(function(err) {
      console.log(err)
  });
}

// 1. Change le quantité d'item dans le panier
function changeQuantity(e) {
	const [ cart, index ] = getCartAndProductIndex(e)
	cart[index].quantity = parseInt(e.target.value)
	console.log(e.target)
	localStorage.setItem('item', JSON.stringify(cart))
	displayCartContent();
}

// 1. Supprime un item du panier
function removeFromCart(e) {
	const [ cart, index ] = getCartAndProductIndex(e)
	cart.splice(index, 1)
	localStorage.setItem('item', JSON.stringify(cart))
	displayCartContent()
}

// 2. Récupérer le contenu du panier et l'index du produit concerné
function getCartAndProductIndex(e) {
	const { id, color } = getProductIdAndColor(e)
	const localStorageCart = localStorage.getItem('item')
	if(localStorageCart) {
		cart = JSON.parse(localStorageCart);
	}
	const index = getCartIndex(cart, id, color)
	return [cart, index]
}

// 3. Fournit le dataset de l'élement html le plus proche de l'event
function getProductIdAndColor(e) {
	return e.target.closest(".cart__item").dataset
}

// 4. Récupérer l'index de l'item recherché dans le panier à partir de l'id et de la couleur
function getCartIndex(cart, id, color) {
	return cart.findIndex(item => item.color === color && item.id === id)
}
