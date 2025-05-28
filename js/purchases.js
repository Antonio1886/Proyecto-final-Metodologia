// js/purchases.js
import { supabase } from './supabase.js';

// Función para hacer la compra y registrar en Supabase
export async function makePurchase(cart) {
  const userId = localStorage.getItem('user_id');
  if (!userId || cart.length === 0) return null;

  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .insert([{ user_id: parseInt(userId), purchase_date: new Date().toISOString() }])
    .select()
    .single();

  if (purchaseError || !purchase) {
    console.error('Error creando la compra:', purchaseError);
    return null;
  }

  const purchaseItems = cart.map(item => ({
    purchase_id: purchase.id,
    product_id: item.id,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('purchase_items')
    .insert(purchaseItems);

  if (itemsError) {
    console.error('Error agregando productos a la compra:', itemsError);
    return null;
  }

  // Disminuir stock
  for (const item of cart) {
    await supabase.rpc('decrease_stock', {
      p_id: item.id,
      qty: item.quantity,
    });
  }

  return purchase;
}

// Cargar historial en purchases.html (solo si es necesario)
export async function loadPurchaseHistory() {
  const container = document.getElementById('purchase-history');
  const userId = localStorage.getItem('user_id');

  if (!userId) {
    container.innerHTML = '<p class="text-red-500">Debes iniciar sesión para ver tu historial.</p>';
    return;
  }

  const { data: purchases, error } = await supabase
    .from('purchases')
    .select(`
      id,
      purchase_date,
      purchase_items (
        quantity,
        products (
          name
        )
      )
    `)
    .eq('user_id', parseInt(userId))
    .order('purchase_date', { ascending: false });

  if (error) {
    console.error('Error al cargar historial:', error);
    container.innerHTML = '<p class="text-red-500">Error al cargar el historial de compras.</p>';
    return;
  }

  if (!purchases || purchases.length === 0) {
    container.innerHTML = '<p class="text-gray-300">No has realizado compras aún.</p>';
    return;
  }

  purchases.forEach(purchase => {
    const date = new Date(purchase.purchase_date).toLocaleString();
    const div = document.createElement('div');
    div.className = 'bg-gray-800 p-4 rounded text-white';

    const itemsHtml = (purchase.purchase_items || []).map(item => `
      <li>
        <strong>${item.products?.name || 'Producto desconocido'}</strong> - Cantidad: ${item.quantity}
      </li>
    `).join('');

    div.innerHTML = `
      <p class="font-semibold mb-2">Fecha: ${date}</p>
      <ul class="list-disc list-inside">${itemsHtml}</ul>
    `;

    container.appendChild(div);
  });
}
