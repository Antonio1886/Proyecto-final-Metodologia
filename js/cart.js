// cart.js

// Obtener el contador del carrito desde localStorage y mostrarlo
const cartCount = document.getElementById('cart-count');
const storedCount = localStorage.getItem('cart-count');
cartCount.textContent = storedCount ? storedCount : 0;

// Mostrar productos en cart.html si existe el contenedor
const cartContainer = document.getElementById('cart-container');
if (cartContainer) {
  const cartItems = JSON.parse(localStorage.getItem('cart-items')) || [];

  if (cartItems.length === 0) {
    cartContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
  } else {
    let total = 0;
    const productList = document.createElement('ul');
    productList.classList.add('cart-list');

    cartItems.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${item.name}</strong> - $${item.price} x ${item.quantity}
        <br><small>ID: ${item.id}</small>
      `;
      productList.appendChild(li);
      total += item.price * item.quantity;
    });

    const totalDiv = document.createElement('div');
    totalDiv.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
    cartContainer.appendChild(productList);
    cartContainer.appendChild(totalDiv);
  }

  // Botón de compra
  const buyBtn = document.getElementById('buy-btn');
  buyBtn.addEventListener('click', () => {
    alert('¡Compra realizada con éxito!');
    localStorage.removeItem('cart-items');
    localStorage.removeItem('cart-count');
    window.location.reload();
  });
}

// Escuchar clicks en botones "Añadir al carrito"
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function () {
    const id = this.dataset.id;
    const name = this.dataset.name;
    const price = parseFloat(this.dataset.price);

    let cartItems = JSON.parse(localStorage.getItem('cart-items')) || [];

    const existingItem = cartItems.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem('cart-items', JSON.stringify(cartItems));

    // Actualizar contador
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;
    localStorage.setItem('cart-count', totalCount);

    // Mostrar notificación
    const notification = document.getElementById('cart-notification');
    if (notification) {
      notification.style.display = 'block';
      setTimeout(() => {
        notification.style.display = 'none';
      }, 3000);
    }
  });
});
