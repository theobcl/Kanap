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
        "Nous n'avons pas réussi à afficher nos produits. Avez vous bien lancé le serveur local (Port 3000) ? <br>Si le problème persiste, contactez-nous.";
      itemsContainer.style.textAlign = "center";
      itemsContainer.style.padding = "50px 0";
    })
  
    // Dispatcher les données de chaque produit (prix, nom...) dans le DOM
    .then(function (dataAPI) {
      const items = dataAPI;
      console.log(items);

      for (let item in items) {
        let itemCard = document.createElement("div");
        document.querySelector(".items").appendChild(itemCard);
        itemCard.classList.add("item");
        itemCard.style.padding = "40px 0px";
        
        let itemLink = document.createElement("a");
        itemCard.appendChild(itemLink);
        itemLink.href = `product.html?id=${dataAPI[item]._id}`;
        itemLink.classList.add("stretched-link");

        let itemImgDiv = document.createElement("div");
        itemLink.appendChild(itemImgDiv);
        itemImgDiv.classList.add("item__img");

        let itemImg = document.createElement("img");
        itemImgDiv.appendChild(itemImg);
        itemImg.src = dataAPI[item].imageUrl;
        itemImg.style.width = "300px";
        itemImg.style.height = "200px";
        itemImg.style.borderRadius = "25px 25px 0px 0px"

        let itemInfosDiv = document.createElement("div");
        itemLink.appendChild(itemInfosDiv);
        itemInfosDiv.classList.add("item__infos");

        let itemInfoTitle = document.createElement("div");
        itemInfosDiv.appendChild(itemInfoTitle);
        itemInfoTitle.classList.add("item__infos__title");
        itemInfoTitle.innerHTML = dataAPI[item].name;
        itemInfoTitle.style.background = "white";
        itemInfoTitle.style.color = "#3498db"; 
        itemInfoTitle.style.margin = "-10px 0px 0px 0px"; 
        itemInfoTitle.style.textAlign = "center"; 

        let itemInfoPrice = document.createElement("div");
        itemInfosDiv.appendChild(itemInfoPrice);
        itemInfoPrice.classList.add("item__infos__price");
        itemInfoPrice.style.background = "white";
        itemInfoPrice.style.color = "#3498db"; 
        itemInfoPrice.style.borderRadius = "0px 0px 25px 25px"
        itemInfoPrice.style.padding = "0px 0px 10px 0px"; 
        itemInfoPrice.style.textAlign = "center"; 


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