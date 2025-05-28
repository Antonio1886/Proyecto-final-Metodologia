import { supabase } from './supabase.js';

// Simular usuario logueado
const userId = localStorage.getItem('user_id');

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});

// Mostrar productos del carrito
function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartContainer = document.getElementById('cart-container');
  const cartTotal = document.getElementById('cart-total');
  const buyBtn = document.getElementById('buy-btn');

  if (!cartContainer || !cartTotal || !buyBtn) return;

  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
    cartTotal.textContent = '0.00';
    buyBtn.disabled = true;
    updateCartCount(0);
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <p><strong>${item.name}</strong></p>
      <p>Precio: $${item.price.toFixed(2)}</p>
      <p>
        Cantidad: 
        <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
        ${item.quantity}
        <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
      </p>
      <p>Total: $${itemTotal.toFixed(2)}</p>
      <button class="delete-btn" data-index="${index}">🗑️ Eliminar</button>
      <hr/>
    `;
    cartContainer.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);
  updateCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));

  // Agregar listeners
  document.querySelectorAll('.qty-btn').forEach(btn =>
    btn.addEventListener('click', handleQuantityChange)
  );

  document.querySelectorAll('.delete-btn').forEach(btn =>
    btn.addEventListener('click', handleDeleteItem)
  );
}

// Cambiar cantidad
function handleQuantityChange(e) {
  const index = parseInt(e.target.dataset.index);
  const action = e.target.dataset.action;
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (action === 'increase') {
    cart[index].quantity += 1;
  } else if (action === 'decrease' && cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Eliminar producto
function handleDeleteItem(e) {
  const index = parseInt(e.target.dataset.index);
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Actualizar contador global
function updateCartCount(count) {
  localStorage.setItem('cart-count', count);
  const cartCount = document.getElementById('cart-count');
  if (cartCount) cartCount.textContent = count;
}

// Comprar productos
document.getElementById('buy-btn')?.addEventListener('click', async () => {
  // Asegurar que todos los IDs sean números
const cart = JSON.parse(localStorage.getItem('cart')) || [];


  // Verificar stock antes de procesar
  for (const item of cart) {
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', (item.id))
      .single();

    if (fetchError || !product) {
      alert(`Error al verificar stock de ${item.name}`);
      return;
    }

    if (product.stock < item.quantity) {
      alert(`No hay suficiente stock para ${item.name}`);
      return;
    }
  }

  // Insertar en purchases
  const { data: purchaseData, error: purchaseError } = await supabase
    .from('purchases')
    .insert({
      user_id: userId,
      purchase_date: new Date().toISOString()
    })
    .select()
    .single();

  if (purchaseError) {
    alert('Error al registrar la compra.');
    return;
  }

  const purchaseId = purchaseData.id;

  for (const item of cart) {
    // Reconsultar stock actualizado
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', (item.id))
      .single();

    if (fetchError || !product) {
      alert(`Error al reconsultar stock de ${item.name}`);
      continue;
    }

    // Actualizar stock
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock: product.stock - item.quantity })
      .eq('id', (item.id))

    if (updateError) {
      alert(`Error al actualizar stock de ${item.name}`);
      continue;
    }

    // Insertar item en purchase_items
    const { error: itemError } = await supabase.from('purchase_items').insert({
      purchase_id: purchaseId,
      product_id: item.id,
      quantity: item.quantity
    });

    if (itemError) {
      alert(`Error al registrar producto ${item.name} en la compra.`);
      continue;
    }
  }

  // Vaciar carrito y redirigir
  localStorage.removeItem('cart');
  localStorage.setItem('cart-count', 0);
  window.location.href = 'purchases.html';
});
