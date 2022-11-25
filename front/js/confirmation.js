// Récupération de l'orderId dans l'URL
const url = new URL(window.location.href)
const orderId = url.searchParams.get("orderId");

// Affichage de l'orderId sur la page
document.getElementById("orderId").innerText = orderId