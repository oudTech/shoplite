
const API_URL = 'http://localhost:3000';

const ordersMessage = document.getElementById('orders-message');
const ordersList = document.getElementById('orders-list');
const ordersEmpty = document.getElementById('orders-empty');
const orderDetails = document.getElementById('order-details');
const orderDetailsContent = document.getElementById('order-details-content');
const orderDetailsClose = document.getElementById('order-details-close');
const ordersAuthLink = document.getElementById('orders-auth-link');

function showMessage(message) {
  ordersMessage.textContent = message;
  ordersMessage.hidden = false;
}

function formatPrice(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 2
  }).format(amount);
}

function formatDate(date) {
  return new Date(date).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

async function loadOrders() {
  if (!isLoggedIn()) {
    showMessage('Please log in to view your orders.');
    ordersList.hidden = true;
    ordersEmpty.hidden = true;

    const loginLink = createElement('a', 'checkout-link', 'Log in');
    loginLink.href = 'auth.html';
    ordersMessage.appendChild(document.createTextNode(' '));
    ordersMessage.appendChild(loginLink);
    return;
  }

  if (ordersAuthLink && isLoggedIn()) {
    ordersAuthLink.textContent = 'Account';
  }

  showMessage('Loading your orders...');

  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const data = await response.json();

    if (response.status === 401) {
      clearToken();
      showMessage('Your session has expired. Please log in again.');
      return;
    }

    if (!response.ok) {
      throw new Error(data.error || 'Could not load your orders.');
    }

    ordersList.replaceChildren();

    if (!data.orders || data.orders.length === 0) {
      ordersMessage.hidden = true;
      ordersEmpty.hidden = false;
      return;
    }

    ordersEmpty.hidden = true;
    ordersList.hidden = false;
    ordersMessage.hidden = true;

    data.orders.forEach((order) => {
      const card = createElement('article', 'order-card');
      const heading = createElement('h2', '', `Order #${order._id}`);
      const date = createElement('p', '', `Placed: ${formatDate(order.createdAt)}`);
      const total = createElement('p', '', `Total: ${formatPrice(order.total)}`);
      const status = createElement('p', 'order-status', `Status: ${order.status}`);
      const itemCount = createElement(
        'p',
        '',
        `${order.items.length} item type(s)`
      );
      const detailsButton = createElement(
        'button',
        'order-details-button',
        'View details'
      );

      detailsButton.type = 'button';
      detailsButton.addEventListener('click', () => {
        loadOrderDetails(order._id);
      });

      card.append(heading, date, total, status, itemCount, detailsButton);
      ordersList.appendChild(card);
    });
  } catch (error) {
    showMessage(error.message || 'Something went wrong while loading orders.');
  }
}

async function loadOrderDetails(orderId) {
  orderDetails.hidden = false;
  orderDetailsContent.replaceChildren();
  orderDetailsContent.appendChild(
    createElement('p', '', 'Loading order details...')
  );

  try {
    const response = await fetch(
      `${API_URL}/orders/${encodeURIComponent(orderId)}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }
    );

    const data = await response.json();

    if (response.status === 401) {
      clearToken();
      orderDetailsContent.replaceChildren(
        createElement('p', '', 'Your session has expired. Please log in again.')
      );
      return;
    }

    if (!response.ok) {
      throw new Error(data.error || 'Could not load order details.');
    }

    const order = data.order;
    orderDetailsContent.replaceChildren();

    orderDetailsContent.appendChild(
      createElement('h2', '', `Order #${order._id}`)
    );
    orderDetailsContent.appendChild(
      createElement('p', '', `Placed: ${formatDate(order.createdAt)}`)
    );
    orderDetailsContent.appendChild(
      createElement('p', '', `Status: ${order.status}`)
    );

    const itemsHeading = createElement('h3', '', 'Items');
    const itemsList = createElement('ul');

    order.items.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      const listItem = createElement(
        'li',
        '',
        `${item.name} — ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(itemTotal)}`
      );

      itemsList.appendChild(listItem);
    });

    orderDetailsContent.append(
      itemsHeading,
      itemsList,
      createElement('h3', '', `Total: ${formatPrice(order.total)}`)
    );
  } catch (error) {
    orderDetailsContent.replaceChildren(
      createElement('p', '', error.message || 'Could not load order details.')
    );
  }
}

orderDetailsClose.addEventListener('click', () => {
  orderDetails.hidden = true;
  orderDetailsContent.replaceChildren();
});

loadOrders();
