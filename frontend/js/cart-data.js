let CART = [];

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
  const savedCart = localStorage.getItem("shoplite-cart");

  if (savedCart) {
    CART = JSON.parse(savedCart);
  }
}

function clearCart() {
  CART = [];
  saveCart();
}

loadCart();