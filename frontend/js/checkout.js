
const API_BASE_URL = "http://localhost:3000";

const checkoutMessage = document.getElementById("checkout-message");
const checkoutContent = document.getElementById("checkout-content");
const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const placeOrderButton = document.getElementById("place-order");

const formatCheckoutPrice = (amount) =>
  `₦${amount.toLocaleString("en-NG")}`;

function showCheckoutMessage(message) {
  checkoutMessage.textContent = message;
}

function renderCheckoutSummary() {
  checkoutItems.innerHTML = "";

  if (CART.length === 0) {
    checkoutContent.hidden = true;
    showCheckoutMessage("Your cart is empty. Visit the store to add products.");

    const storeLink = document.createElement("a");
    storeLink.href = "index.html";
    storeLink.textContent = "Continue shopping";
    checkoutMessage.appendChild(document.createTextNode(" "));
    checkoutMessage.appendChild(storeLink);

    return;
  }

  for (const item of CART) {
    const product = PRODUCTS.find(
      (product) => String(product._id) === String(item.id)
    );

    if (!product) continue;

    const line = document.createElement("p");
    const lineSubtotal = product.price * item.quantity;

    line.textContent =
      `${product.name} × ${item.quantity} — ` +
      formatCheckoutPrice(lineSubtotal);

    checkoutItems.appendChild(line);
  }

  checkoutTotal.textContent = formatCheckoutPrice(getCartSubtotal());
  checkoutContent.hidden = false;
  checkoutMessage.textContent = "";
}

async function initCheckout() {
  checkoutContent.hidden = true;
  showCheckoutMessage("Loading your order summary...");

  try {
    const response = await fetch(`${API_BASE_URL}/products`);

    if (!response.ok) {
      throw new Error("Could not load products. Please try again.");
    }

    PRODUCTS = await response.json();
    loadCart();

    if (!isLoggedIn()) {
      checkoutContent.hidden = true;
      showCheckoutMessage("Please log in before placing an order. ");

      const loginLink = document.createElement("a");
      loginLink.href = "auth.html";
      loginLink.textContent = "Log in";
      checkoutMessage.appendChild(loginLink);

      return;
    }

    renderCheckoutSummary();
  } catch (error) {
    console.error("Checkout initialization failed:", error);
    showCheckoutMessage(
      "Could not load checkout. Check that the backend is running, then reload."
    );
  }
}


async function handlePlaceOrder() {
  placeOrderButton.disabled = true;
  placeOrderButton.textContent = "Placing order...";

  try {
    const orderItems = CART.map((item) => ({
      productId: item.id,
      quantity: item.quantity
    }));

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        items: orderItems
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not place your order.");
    }

    clearCart();

    checkoutContent.hidden = true;
    showCheckoutMessage(
      `Order placed successfully! Order ID: ${data.order?._id || data._id || "Confirmed"}`
    );

  } catch (error) {
    console.error("Order submission failed:", error);
    showCheckoutMessage(
  error instanceof TypeError
    ? "Unable to connect to the server. Please check your connection and try again. Your cart has been preserved."
    : error.message
);
  } finally {
    placeOrderButton.disabled = false;
    placeOrderButton.textContent = "Place Order";
  }
}

placeOrderButton.addEventListener("click", handlePlaceOrder);

initCheckout();
