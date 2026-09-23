const productGrid= document.getElementById("product-grid");

function createProductCard(product) {
  const card =document.createElement("article"); 
  card.className = "card-class";
  card.dataset.id = product.id
  card.innerHTML = `
  <img src="${product.image}" alt="${product.name}">
  <h3>${product.name}</h3>
  <p>${formatPrice(product.price)}</p>
  <p>${product.category}</P>
  `;
  const image = card.querySelector("img");
  image.addEventListener("error", () => {
    image.style.display = "none";
    const fallback = document.createElement("div");
    fallback.textContent = "Image unavailable";
    fallback.className = "image-fallback";

    image.parentElement.prepend(fallback);
  });
  return card;
}

function renderProducts(products){
    productGrid.innerHTML="";

    if (products.length === 0){
       productGrid.innerHTML="<p>No products found.</p>"; 
       return;
    }
 
    for(const product of products){
        const card = createProductCard(product);
        productGrid.appendChild(card);

    }
}

renderProducts(PRODUCTS);