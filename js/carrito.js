// carrito.js
async function mostrarCarrito() {
  const user = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('cart_items')
    .select('id, quantity, product:products(*)')
    .eq('user_id', user.data.user.id);
  
  if (error) return console.error(error);

  const contenedor = document.querySelector('.cart-items');
  contenedor.innerHTML = '';
  data.forEach(item => {
    contenedor.innerHTML += `
      <div class="cart-item">
        <img src="${item.product.image_url}" alt="">
        <div class="item-details">
          <h3>${item.product.name}</h3>
          <span class="price">$${item.product.price}</span>
        </div>
        <button onclick="quitarItem('${item.id}')">❌</button>
      </div>
    `;
  });
}
// al final de carrito.js
async function quitarItem(itemId) {
  const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
  if (error) return console.error("Error al eliminar:", error);
  mostrarCarrito(); // recarga la lista
}
