
const accessMessage = document.getElementById('access-message');
const adminContent = document.getElementById('admin-content');
const logoutButton = document.getElementById('logout-button');

const productForm = document.getElementById('product-form');
const formMessage = document.getElementById('form-message');
const productsList = document.getElementById('products-list');
const ordersList = document.getElementById('orders-list');

const productIdInput = document.getElementById('product-id');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const productCategoryInput = document.getElementById('product-category');
const productImageInput = document.getElementById('product-image');
const productStockInput = document.getElementById('product-stock');

const formTitle = document.getElementById('form-title');
const saveProductButton = document.getElementById('save-product-button');
const cancelEditButton = document.getElementById('cancel-edit-button');



async function checkAdminAccess() {
  if (!isLoggedIn()) {
    showAccessDenied();
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/me', {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const data = await response.json();

    if (!response.ok || data.user?.isAdmin !== true) {
      showAccessDenied();
      return;
    }

    accessMessage.hidden = true;
    adminContent.hidden = false;

    await loadProducts();
    await loadAdminOrders();

  } catch (error) {
    console.error('Admin verification error:', error);

    accessMessage.innerHTML =
      '<h2>Unable to verify admin access. Please try again.</h2>';
  }
}



function showAccessDenied() {
  accessMessage.innerHTML = `
    <h2>Not Authorized</h2>
    <p>You do not have permission to access this page.</p>
    <a href="index.html">Return to ShopLite</a>
  `;

  adminContent.hidden = true;
}




async function loadProducts() {
  productsList.textContent = 'Loading products...';

  try {
    const response = await fetch('http://localhost:3000/products');
    const products = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch products.');
    }

    if (!Array.isArray(products)) {
      throw new Error('Unexpected products response.');
    }

    productsList.innerHTML = '';

    if (products.length === 0) {
      productsList.textContent = 'No products found.';
      return;
    }

    products.forEach((product) => {
      const productItem = document.createElement('div');

      const productName = document.createElement('h4');
      const productPrice = document.createElement('p');
      const productCategory = document.createElement('p');
      const productStock = document.createElement('p');

      productName.textContent = product.name;

      productPrice.textContent =
        `Price: ₦${Number(product.price).toLocaleString('en-NG')}`;

      productCategory.textContent = `Category: ${product.category}`;

      productStock.textContent = `Stock: ${product.stock}`;

      
      const editButton = document.createElement('button');

      editButton.textContent = 'Edit';

      editButton.addEventListener('click', () => {
        startEditing(product);
      });

      
      const deleteButton = document.createElement('button');

      deleteButton.textContent = 'Delete';

      deleteButton.addEventListener('click', () => {
        deleteProduct(product._id, product.name);
      });

      productItem.append(
        productName,
        productPrice,
        productCategory,
        productStock,
        editButton,
        deleteButton
      );

      productsList.appendChild(productItem);
    });

  } catch (error) {
    console.error('Error loading products:', error);

    productsList.textContent =
      'Unable to load products. Please try again.';
  }
}

async function loadAdminOrders() {
  ordersList.textContent = 'Loading orders...';

  try {
    const response = await fetch('http://localhost:3000/admin/orders', {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch orders.');
    }

    ordersList.innerHTML = '';

    if (data.orders.length === 0) {
      ordersList.textContent = 'No customer orders found.';
      return;
    }

    data.orders.forEach((order) => {
      const orderItem = document.createElement('div');

      const customer = document.createElement('p');
      const orderDate = document.createElement('p');
      const orderStatus = document.createElement('p');
      const orderTotal = document.createElement('p');
      const itemCount = document.createElement('p');

      customer.textContent =
        `Customer: ${order.userId?.email || 'Customer unavailable'}`;

      orderDate.textContent =
        `Date: ${new Date(order.createdAt).toLocaleString('en-NG')}`;

      orderStatus.textContent =
        `Status: ${order.status}`;

      orderTotal.textContent =
        `Total: ₦${Number(order.total).toLocaleString('en-NG')}`;

      const totalItems = order.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      itemCount.textContent =
        `Items: ${totalItems}`;

      orderItem.append(
        customer,
        orderDate,
        orderStatus,
        orderTotal,
        itemCount
      );

      ordersList.appendChild(orderItem);
    });

  } catch (error) {
    console.error('Error loading admin orders:', error);

    ordersList.textContent =
      'Unable to load customer orders. Please try again.';
  }
}


function getProductFormData() {
  return {
    name: productNameInput.value.trim(),
    price: Number(productPriceInput.value),
    category: productCategoryInput.value.trim(),
    image: productImageInput.value.trim(),
    stock: Number(productStockInput.value)
  };
}




function validateProduct(product) {
  if (
    !product.name ||
    !product.category ||
    !product.image ||
    !Number.isFinite(product.price) ||
    product.price <= 0 ||
    !Number.isInteger(product.stock) ||
    product.stock < 0
  ) {
    return 'Please enter valid product details.';
  }

  return null;
}


productForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const product = getProductFormData();

  const problem = validateProduct(product);

  if (problem) {
    formMessage.textContent = problem;
    return;
  }

  const productId = productIdInput.value;

  const isEditing = Boolean(productId);

  const url = isEditing
    ? `http://localhost:3000/products/${productId}`
    : 'http://localhost:3000/products';

  const method = isEditing ? 'PUT' : 'POST';

  saveProductButton.disabled = true;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(product)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to save product.'
      );
    }

    formMessage.textContent = isEditing
      ? 'Product updated successfully!'
      : 'Product created successfully!';

    resetProductForm();

    await loadProducts();

  } catch (error) {
    formMessage.textContent = error.message;

  } finally {
    saveProductButton.disabled = false;
  }
});



function startEditing(product) {
  productIdInput.value = product._id;

  productNameInput.value = product.name;
  productPriceInput.value = product.price;
  productCategoryInput.value = product.category || '';
  productImageInput.value = product.image || '';
  productStockInput.value = product.stock ?? 0;

  formTitle.textContent = 'Edit Product';

  saveProductButton.textContent = 'Update Product';

  cancelEditButton.hidden = false;

  formMessage.textContent = '';
}



function resetProductForm() {
  productForm.reset();

  productIdInput.value = '';

  formTitle.textContent = 'Create a Product';

  saveProductButton.textContent = 'Create Product';

  cancelEditButton.hidden = true;

  formMessage.textContent = '';
}



cancelEditButton.addEventListener('click', () => {
  resetProductForm();
});



async function deleteProduct(productId, productName) {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${productName}"?`
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/products/${productId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to delete product.'
      );
    }

    formMessage.textContent = 'Product deleted successfully!';

    if (productIdInput.value === productId) {
      resetProductForm();
    }

    await loadProducts();

  } catch (error) {
    formMessage.textContent = error.message;
  }
}



logoutButton.addEventListener('click', () => {
  clearToken();
  window.location.href = 'auth.html';
});




checkAdminAccess();
