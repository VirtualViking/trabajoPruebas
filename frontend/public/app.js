const API_URL = '/api';

// Estado de edición
let editingCategory = false;
let editingProduct = false;

// Elementos del DOM
const categoryForm = document.getElementById('category-form');
const categoryIdInput = document.getElementById('category-id');
const categoryNameInput = document.getElementById('category-name');
const categoryBtn = document.getElementById('category-btn');
const categoryCancelBtn = document.getElementById('category-cancel');
const categoriesList = document.getElementById('categories-list');

const productForm = document.getElementById('product-form');
const productIdInput = document.getElementById('product-id');
const productNameInput = document.getElementById('product-name');
const productCategorySelect = document.getElementById('product-category');
const productPriceInput = document.getElementById('product-price');
const productStockInput = document.getElementById('product-stock');
const productDescriptionInput = document.getElementById('product-description');
const productBtn = document.getElementById('product-btn');
const productCancelBtn = document.getElementById('product-cancel');
const productsList = document.getElementById('products-list');

// Notificaciones
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// API calls
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (data) options.body = JSON.stringify(data);

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Error en la operación');
  }
  return result;
}

// ==================== CATEGORÍAS ====================

async function loadCategories() {
  try {
    const result = await apiCall('/categories');
    renderCategories(result.data);
    updateCategorySelect(result.data);
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

function renderCategories(categories) {
  categoriesList.innerHTML = categories.map(cat => `
    <div class="list-item" data-id="${cat.id}">
      <span>${cat.name}</span>
      <button class="btn-edit" onclick="editCategory(${cat.id}, '${cat.name}')">Editar</button>
      <button class="btn-delete" onclick="deleteCategory(${cat.id})">Eliminar</button>
    </div>
  `).join('');
}

function updateCategorySelect(categories) {
  productCategorySelect.innerHTML = '<option value="">Sin categoría</option>' +
    categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
}

categoryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = categoryNameInput.value.trim();
  
  try {
    if (editingCategory) {
      await apiCall(`/categories/${categoryIdInput.value}`, 'PUT', { name });
      showNotification('Categoría actualizada');
    } else {
      await apiCall('/categories', 'POST', { name });
      showNotification('Categoría creada');
    }
    resetCategoryForm();
    loadCategories();
  } catch (error) {
    showNotification(error.message, 'error');
  }
});

function editCategory(id, name) {
  editingCategory = true;
  categoryIdInput.value = id;
  categoryNameInput.value = name;
  categoryBtn.textContent = 'Actualizar';
  categoryCancelBtn.style.display = 'inline-block';
  categoryNameInput.focus();
}

async function deleteCategory(id) {
  if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
  
  try {
    await apiCall(`/categories/${id}`, 'DELETE');
    showNotification('Categoría eliminada');
    loadCategories();
    loadProducts();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

function resetCategoryForm() {
  editingCategory = false;
  categoryForm.reset();
  categoryIdInput.value = '';
  categoryBtn.textContent = 'Agregar';
  categoryCancelBtn.style.display = 'none';
}

categoryCancelBtn.addEventListener('click', resetCategoryForm);

// ==================== PRODUCTOS ====================

async function loadProducts() {
  try {
    const result = await apiCall('/products');
    renderProducts(result.data);
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

function renderProducts(products) {
  productsList.innerHTML = products.map(prod => `
    <tr data-id="${prod.id}">
      <td>${prod.id}</td>
      <td>${prod.name}</td>
      <td>${prod.category_name || '-'}</td>
      <td>$${parseFloat(prod.price).toFixed(2)}</td>
      <td>${prod.stock}</td>
      <td>
        <button class="btn-edit" onclick="editProduct(${prod.id})">Editar</button>
        <button class="btn-delete" onclick="deleteProduct(${prod.id})">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    name: productNameInput.value.trim(),
    description: productDescriptionInput.value.trim(),
    price: parseFloat(productPriceInput.value),
    stock: parseInt(productStockInput.value),
    category_id: productCategorySelect.value || null
  };
  
  try {
    if (editingProduct) {
      await apiCall(`/products/${productIdInput.value}`, 'PUT', data);
      showNotification('Producto actualizado');
    } else {
      await apiCall('/products', 'POST', data);
      showNotification('Producto creado');
    }
    resetProductForm();
    loadProducts();
  } catch (error) {
    showNotification(error.message, 'error');
  }
});

async function editProduct(id) {
  try {
    const result = await apiCall(`/products/${id}`);
    const prod = result.data;
    
    editingProduct = true;
    productIdInput.value = prod.id;
    productNameInput.value = prod.name;
    productDescriptionInput.value = prod.description || '';
    productPriceInput.value = prod.price;
    productStockInput.value = prod.stock;
    productCategorySelect.value = prod.category_id || '';
    
    productBtn.textContent = 'Actualizar Producto';
    productCancelBtn.style.display = 'inline-block';
    productNameInput.focus();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

async function deleteProduct(id) {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return;
  
  try {
    await apiCall(`/products/${id}`, 'DELETE');
    showNotification('Producto eliminado');
    loadProducts();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

function resetProductForm() {
  editingProduct = false;
  productForm.reset();
  productIdInput.value = '';
  productStockInput.value = '0';
  productBtn.textContent = 'Agregar Producto';
  productCancelBtn.style.display = 'none';
}

productCancelBtn.addEventListener('click', resetProductForm);

// ==================== INICIALIZACIÓN ====================

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadProducts();
});