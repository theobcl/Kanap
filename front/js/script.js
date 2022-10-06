main(); 

function main() {
  getAllItems();
}; 

function getAllItems () {
  fetch("http://localhost:3000/api/products")
    // Récupérer les données de tous les items dans l'API
    .then(function(response) {
      if (response.ok) {
          return response.json();
      }
    })
    // Générer un nouvel élément HTML pour chaque item de l'API
    .then(function(value) {  
      document.getElementById("items").innerHTML = value.map(item => `
        <a href="./product.html?id=${item._id}">
          <article>
            <img src=${item.imageUrl} alt=${item.altTxt}>
            <h3 class="productName">${item.name}</h3>
            <p class="productDescription">${item.description}</p>
          </article>
        </a>
      `).join('')
    })
    // Générer un message en cas d'erreur
    .catch(function(error) {
      console.log(error)
    })
};
