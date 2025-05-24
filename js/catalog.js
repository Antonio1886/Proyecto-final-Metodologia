// catalog.js
import { supabase } from './supabaseClient.js';

async function cargarProductos() {
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) return console.error(error);
  
  const contenedor = document.querySelector('.product-grid');
  products.forEach(p => {
    contenedor.innerHTML += `
      <div class="product-card">
        <img src="${p.image_url}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="description">${p.description}</p>
        <div class="price">$${p.price}</div>
        <button onclick="agregarAlCarrito('${p.id}')">Agregar</button>
      </div>
    `;
  });
}
// al final de catalog.js
async function agregarAlCarrito(productId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Debes iniciar sesión");

  const { error } = await supabase.from('cart_items').insert([
    { user_id: user.id, product_id: productId, quantity: 1 }
  ]);
  if (error) return console.error("Error al agregar al carrito:", error);
  alert("Producto añadido al carrito");
}
