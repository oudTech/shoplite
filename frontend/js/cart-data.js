
let CART = [];

function addToCart(productId) {
  const id = String(productId);
  const existingItem = CART.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    CART.push({
      id,
      quantity: 1
    });
  }

  saveCart();
}

function removeFromCart(productId) {
  const id = String(productId);
  CART = CART.filter(item => item.id !== id);
  saveCart();
}

function updateQuantity(productId, newQuantity) {
  const id = String(productId);

  if (newQuantity <= 0) {
    removeFromCart(id);
    return;
  }

  const item = CART.find(item => item.id === id);

  if (item) {
    item.quantity = newQuantity;
  }

  saveCart();
}

function getCartCount() {
  return CART.reduce((total, item) => total + item.quantity, 0);
}

function getCartSubtotal() {
  return CART.reduce((total, item) => {
    const product = PRODUCTS.find(product => String(product.id) === item.id);

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
      .map(item => ({
        id: String(item.id),
        quantity: Number(item.quantity)
      }))
      .filter(item =>
        item.id &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        PRODUCTS.some(product => String(product.id) === item.id)
      );
  } catch (error) {
    console.warn("Saved cart was corrupted, starting fresh.", error);
    CART = [];
    localStorage.removeItem("shoplite-cart");
  }
}
