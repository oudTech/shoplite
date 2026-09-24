const productGrid = document.getElementById("product-grid");

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.id = product.id;

  card.innerHTML = `
    <img
      src="${product.image}"
      alt="${product.name}"
      onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'"
    />
    <h3>${product.name}</h3>
    <p class="category">${product.category}</p>
    <p class="price">${formatPrice(product.price)}</p>
  `;

  return card;
}

function renderProducts(products) {
  productGrid.innerHTML = "";
  if (products.length === 0) {
    productGrid.innerHTML = `<p class="empty-state">No products found.</p>`;
    return;
  }

  products.forEach((product) => {
    productGrid.appendChild(createProductCard(product));
  });
}

renderProducts(PRODUCTS);
