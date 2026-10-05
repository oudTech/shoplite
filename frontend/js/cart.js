 const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("open");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("open");
}

document.getElementById("cart-open").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function createCartLine(line) {
  const product = PRODUCTS.find(p => p.id === line.id);

  const el = document.createElement("div");
  el.className = "cart-line";
  el.innerHTML = `
    <img src="${product.image}" alt="${product.name}" width="60">
    <div>
      <strong>${product.name}</strong>
      <div>$${product.price.toFixed(2)} each</div>
      <div>
        <button data-action="decrease" data-id="${product.id}">-</button>
        <span>${line.quantity}</span>
        <button data-action="increase" data-id="${product.id}">+</button>
      </div>
      <div>Line total: $${(product.price * line.quantity).toFixed(2)}</div>
      <button data-action="remove" data-id="${product.id}">Remove</button>
    </div>
  `;
  return el;
}

const cartItems = document.getElementById("cart-items");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartBadge = document.getElementById("cart-badge");

function renderCart() {
  cartItems.innerHTML = "";

  if (CART.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    CART.forEach(line => {
      cartItems.appendChild(createCartLine(line));
    });
  }

  cartSubtotal.textContent = formatPrice(getCartSubtotal());
  cartBadge.textContent = getCartCount();
}

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;
  const line = CART.find(item => item.id === id);
  if (!line) return;

  if (action === "remove") {
    removeFromCart(id);
  } else if (action === "increase") {
    updateQuantity(id, line.quantity + 1);
  } else if (action === "decrease") {
    updateQuantity(id, line.quantity - 1);
  }

  renderCart();
});


renderCart();