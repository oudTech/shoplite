let CART = [];
let cartNumber = document.getElementById('cart-badge');
function addToCart(productId) {
  const existingItem = CART.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
    
  } else {
    CART.push({
      id: productId,
      quantity: 1
    });
  }
  cartNumber.textContent = getCartCount();
  saveCart();

}

function removeFromCart(productId) {
  CART = CART.filter(item => item.id !== productId);

  saveCart();
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const item = CART.find(item => item.id === productId);

  if (item) {
    item.quantity = newQuantity;
  }

  saveCart();
}

function getCartCount() {
  return CART.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
}

function getCartSubtotal() {
  return CART.reduce((total, item) => {
    const product = PRODUCTS.find(product => product.id === item.id);

    if (!product) {
      return total;
    }

    return total + product.price * item.quantity;
  }, 0);
}

function saveCart() {
  localStorage.setItem("shoplite-cart", JSON.stringify(CART));
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("shoplite-cart"));
    if (!Array.isArray(saved)) return;

    CART = saved
      .map(item => ({ id: Number(item.id), quantity: Number(item.quantity) }))
      .filter(item =>
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        PRODUCTS.some(p => p.id === item.id)   // drops ids that no longer exist
      );
  } catch (error) {
    console.warn("Saved cart was corrupted, starting fresh.", error);
    CART = [];
    localStorage.removeItem("shoplite-cart");
  }
}

function clearCart() {
  CART = [];
  saveCart();
}

loadCart();