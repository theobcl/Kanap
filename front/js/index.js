main(); 

function main() {
  getItems()
};

function getItems() {
  let url = "http://localhost:3000/api/products"; 
  fetch(url)
    // En cas de succès du fetching, recupérer les données de l'API
    .then(response => {
      return response.json()
    }) 
    // En cas d'erreur du fetching, afficher un message d'erreur
    .catch((error) => {
      let itemsContainer = document.querySelector(".items");
      itemsContainer.innerHTML =
        "Nous n'avons pas réussi à afficher nos produits. Avez vous bien lancé le serveur local (Port 3000) ?";
      itemsContainer.style.textAlign = "center";
      itemsContainer.style.padding = "50px 0";
    })
  
    // Générer les éléments HTML de la page d'accueil a partir du résultat du fetching
    .then(function (dataAPI) {
      const items = dataAPI;
      console.log(items);

      // Itérer sur le tableau json et créer une carte par produit
      for (let item in items) {
        let itemCard = document.createElement("div");
        document.querySelector(".items").appendChild(itemCard);
        itemCard.classList.add("item");
        itemCard.style.padding = "40px 0px";
        
        // Générer les liens vers les pages produits
        let itemLink = document.createElement("a");
        itemCard.appendChild(itemLink);
        itemLink.href = `product.html?id=${dataAPI[item]._id}`;
        itemLink.classList.add("stretched-link");

        // Générer la div contenant l'image de la carte produit
        let itemImgDiv = document.createElement("div");
        itemLink.appendChild(itemImgDiv);
        itemImgDiv.classList.add("item-img");
        
        // Générer l'image de la carte produit
        let itemImg = document.createElement("img");
        itemImgDiv.appendChild(itemImg);
        itemImg.src = dataAPI[item].imageUrl;
        itemImg.style.width = "300px";
        itemImg.style.height = "200px";
        itemImg.style.borderRadius = "25px 25px 0px 0px"

        // Générer la div contenant les infos de la carte produit
        let itemInfosDiv = document.createElement("div");
        itemLink.appendChild(itemInfosDiv);
        itemInfosDiv.classList.add("item-infos");
        itemInfosDiv.style.background = "white";
        itemInfosDiv.style.color = "#3498db"; 
        itemInfosDiv.style.textAlign = "center"; 
        itemInfosDiv.style.borderRadius = "0px 0px 25px 25px"
        itemInfosDiv.style.margin = "-10px 0px 0px 0px"; 
        itemInfosDiv.style.padding = "0px 0px 10px 0px"; 

        // Générer le nom du produit
        let itemInfoTitle = document.createElement("div");
        itemInfosDiv.appendChild(itemInfoTitle);
        itemInfoTitle.classList.add("item-infos-title");
        itemInfoTitle.innerHTML = dataAPI[item].name;
        
        // Générer le prix du produit 
        let itemInfoPrice = document.createElement("div");
        itemInfosDiv.appendChild(itemInfoPrice);
        itemInfoPrice.classList.add("item-infos-price");


        // Formatage du prix pour l'afficher en euros
        dataAPI[item].price = dataAPI[item].price;
        itemInfoPrice.innerHTML = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(dataAPI[item].price);
      }
    });

}






// document.querySelector("#items")