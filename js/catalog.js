// catalog.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ⚠️ Reemplaza con tu URL y clave pública de Supabase
const supabaseUrl = 'https://TU-https://ejseoopywhotaxctscbm.supabase.co.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqc2Vvb3B5d2hvdGF4Y3RzY2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNjkyMjYsImV4cCI6MjA2Mjc0NTIyNn0.DmYXz1VRK9oHu5MT0oIxiX2NanLrvTSRyo4zagLJpfk';


const supabase = createClient(supabaseUrl, supabaseKey);

const productGrid = document.querySelector('.product-grid');
const cartCount = document.getElementById('cart-count');

// Mostrar contador previo del carrito
const storedCount = localStorage.getItem('cart-count');
cartCount.textContent = storedCount || 0;

// Cargar productos desde Supabase
async function cargarProductos() {
    const { data: products, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error al cargar productos:', error.message);
        productGrid.innerHTML = '<p>Error al cargar productos.</p>';
        return;
    }

    products.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        const estrellas = Math.floor(producto.rating);
        const mediaEstrella = producto.rating % 1 >= 0.5;

        card.innerHTML = `
            <img src="${producto.image_url || 'https://via.placeholder.com/300x200?text=Game+Key'}" alt="Imagen de ${producto.name}">
            <h3>${producto.name}</h3>
            <p class="description">${producto.description}</p>
            <div class="price">$${producto.price} <span class="original-price">$${producto.original_price}</span></div>
            <div class="rating">
                ${'<i class="fas fa-star" aria-hidden="true"></i>'.repeat(estrellas)}
                ${mediaEstrella ? '<i class="fas fa-star-half-alt" aria-hidden="true"></i>' : ''}
                <span>(${producto.reviews_count})</span>
            </div>
            <button class="add-to-cart" 
                aria-label="Añadir ${producto.name} al carrito" 
                data-id="${producto.id}" 
                data-name="${producto.name}" 
                data-price="${producto.price}">
                Añadir al carrito
            </button>
        `;
        productGrid.appendChild(card);
    });
}

cargarProductos();

// Evento para añadir productos al carrito
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('add-to-cart')) {
        let count = parseInt(cartCount.textContent) + 1;
        cartCount.textContent = count;
        localStorage.setItem('cart-count', count);

        const notification = document.getElementById('cart-notification');
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
});

// Obtener productos guardados del carrito
function getCartItems() {
    return JSON.parse(localStorage.getItem('cart-items')) || [];
}

// Guardar productos en el carrito
function saveCartItems(items) {
    localStorage.setItem('cart-items', JSON.stringify(items));
}

// Escuchar clicks en botones "Añadir al carrito"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const product = {
            id: this.dataset.id,
            name: this.dataset.name,
            price: parseFloat(this.dataset.price),
            image: this.closest('.product-card').querySelector('img').src
        };

        const cartItems = getCartItems();
        cartItems.push(product);
        saveCartItems(cartItems);

        // Actualizar el contador del carrito
        document.getElementById('cart-count').textContent = cartItems.length;
        localStorage.setItem('cart-count', cartItems.length);

        // Notificación
        const notification = document.getElementById('cart-notification');
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    });
});
