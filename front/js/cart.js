main();

function main() {
	displayCartContent();
};

//// Affichage Panier ////

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

	if (e.target.value > 100) {
		e.target.value = 100;
	} else if (e.target.value < 0) {
		e.target.value = 0;
	};

	cart[index].quantity = parseInt(e.target.value)
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





//// Remplissage formulaire ////

//  Check que la valeur du champs n'est pas nulle et ne contient pas plus de 99 caractères
function notEmptyNotTooLong(value) {
	return value.length > 0 && value.length < 100
}

// Function notEmptyNotTooLong() + Check si la valeur du champs contient un ou plusieurs chiffres
function notEmptyNotTooLongNoNumbers (value) {
	return notEmptyNotTooLong(value) && /^([^0-9]*)$/.test(value)
}

// Check que la valeur du champs est un email valide
function isValidEmail(value) {
	return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
}

// Check si la validation d'un champs est true
function fieldIsValid(field) {
	return field.validation(document.getElementById(field.id).value)
}

// Création d'un array de hash pour chaque champs du formulaire avec comme clefs :
	// 1 - l'id de l'input HTML
	// 2 - le résultat (boolean) de la validation du champs
	// 3 - le message d'erreur à afficher dans le cas ou validation: false
const fields = [
	{
			id: "firstName",
			validation: notEmptyNotTooLongNoNumbers,
			errorMsg: "Le champ doit contenir entre 1 et 99 caractères sans chiffres"
	},
	{
			id: "lastName",
			validation: notEmptyNotTooLongNoNumbers,
			errorMsg: "Le champ doit contenir entre 1 et 99 caractères sans chiffres"
	},
	{
			id: "address",
			validation: notEmptyNotTooLong,
			errorMsg: "Le champ doit contenir entre 1 et 99 caractères"
	},
	{
			id: "city",
			validation: notEmptyNotTooLong,
			errorMsg: "Le champ doit contenir entre 1 et 99 caractères"
	},
	{
			id: "email",
			validation: isValidEmail,
			errorMsg: "Cet email n'est pas valide"
	}
]

// Affiche un message d'erreur si le champs n'est pas valide
fields.forEach(field => {
	document.getElementById(field.id).addEventListener('input', (e) => {
			const value = e.target.value
			document.getElementById(`${field.id}ErrorMsg`).innerText = field.validation(value) ? "" : field.errorMsg
	});
})

// Au clique sur le bouton "Commander !"
const submitButton = document.getElementById("order")
submitButton.addEventListener('click', function(e) {
	e.preventDefault()
	// Check que tous les champs sont valides
	const fieldsAreValid = fields.every(field => fieldIsValid(field))
	if (fieldsAreValid) {
		const contact = getContactObject(fields)
		handleSubmit(contact)
	}
})

// Génère un hash avec le contenu du formulaire complété par le user
function getContactObject(fields) {
	return Object.fromEntries(fields.map(field => [field.id, document.getElementById(field.id).value]))
}

function handleSubmit(contact) {
	let productsIds=[]
	// Recupère les infos contenu dans le panier
	const data = JSON.parse(localStorage.getItem('item'))
	// Ajouter chaque item du panier dans l'arret productsIds
	for (let i=0 ; i< data.length ; i++) {
		const item = data[i]
		productsIds.push(item.id);
	}
	// Génére un hash contenant les infos des items du panier + les infos du formulaire
	const postData = {
		contact: contact,
		products: productsIds
	}
	if (JSON.parse(localStorage.getItem("item")).length != 0) {
		send(postData)
	}
}

// Requete Post pour envoyer les données du panier et du formulaire sur l'API
function send(postData) {
	fetch('http://localhost:3000/api/products/order', {
		method : "POST",
		headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
		},
		body: JSON.stringify(postData),
	})
	.then(function(res){
			if(res.ok){
					return res.json()
			}
	})
	.then(function(value){
			localStorage.clear();
			document.location.href=`confirmation.html?orderId=${value.orderId}`
	})
	.catch(function(err){
			console.log(`erreur ${err}`)
	})
}
