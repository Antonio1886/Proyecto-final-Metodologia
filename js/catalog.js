// js/catalog.js
import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
  const productGrid = document.querySelector('.product-grid');
  if (!productGrid) {
    console.error('No se encontró el contenedor .product-grid');
    return;
  }

  // Obtiene los productos desde Supabase
  const { data: products, error } = await supabase.from('products').select('*');

  if (error) {
    console.error('Error al obtener productos de Supabase:', error.message);
    return;
  }

  // Limpia el contenido actual
  productGrid.innerHTML = '';

  // Renderiza cada producto
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
      <img src="${product.image_url}" alt="${product.title}" loading="lazy">
      <h3>${product.name}</h3>
      <p class="description">${product.description}</p>
      <div class="price">
        $${(product.price ?? 0).toFixed(2)} 
        <span class="original-price">$${(product.original_price ?? product.price ?? 0).toFixed(2)}</span>
      </div>
      <div class="rating">
        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
        <span>(123)</span>
      </div>
      <button class="add-to-cart" role="button" aria-label="Añadir ${product.name} al carrito"
        data-id="${product.id}"
        data-name="${product.name}"
        data-price="${product.price}">
        Añadir al carrito
      </button>
    `;
    productGrid.appendChild(productCard);
  });

  // Delegación de eventos para botones "Añadir al carrito"
  productGrid.addEventListener('click', event => {
    if (event.target.classList.contains('add-to-cart')) {
      const button = event.target;
      const product = {
        id: parseInt(button.dataset.id),
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
      };
      addToCart(product);
      alert(`${product.name} fue añadido al carrito.`);
    }
  });
});

// Funciones de carrito
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  
}
