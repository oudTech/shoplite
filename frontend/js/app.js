const productGrid = document.getElementById("product-grid");
productGrid.addEventListener("click", function (event) {
  const button = event.target.closest(".add-to-cart-btn");
  if (!button) return;

  const card = button.closest(".product-card");
  const productId = Number(card.dataset.id);  

  addToCart(productId);
  renderCart();
});

function createProductCard(product) {
  const card = document.createElement("article");

  card.className = "product-card";
  card.dataset.id = product.id;

  card.innerHTML = `
    <img
      src="${product.image}"
      alt="${product.name}"
    />
    <h3>${product.name}</h3>
    <p class="category">${product.category}</p>
    <p class="price">${formatPrice(product.price)}</p>

    <button class="add-to-cart-btn">Add to Cart</button>
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

function populateCategoryDropdown(products) {
  const select = document.getElementById("category-select"); 
  const productCat = products.map(product => product.category);
  const categories = [...new Set(productCat)];

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
}

function getFilteredProducts() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const selectedCategory = document.getElementById('category-select').value;

  return PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
}

function updateDisplay() {
  const filtered = getFilteredProducts();
  renderProducts(filtered);
}

document.getElementById('search-input').addEventListener('input', updateDisplay);
document.getElementById('category-select').addEventListener('change', updateDisplay);

populateCategoryDropdown(PRODUCTS);
renderProducts(PRODUCTS);

function getSortSelection() {
  return document.getElementById('sort-select').value; // 'low-high' or 'high-low'
}

function getFilteredAndSortedProducts() {
  const filtered = getFilteredProducts();
  const sortOrder = getSortSelection();

  const sorted = [...filtered]; // copy, so we don't mutate the filtered array
  if (sortOrder === 'low-high') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'high-low') {
    sorted.sort((a, b) => b.price - a.price);
  }
  return sorted;
}

const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

// close the menu after tapping a link
mainNav.addEventListener("click", (e) => {
  if (e.target.classList.contains("navigation")) {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", false);
  }
});