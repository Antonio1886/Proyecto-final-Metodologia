// logout.js
import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-btn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        alert('Error al cerrar sesión: ' + error.message);
      } else {
        alert('Sesión cerrada correctamente');
        window.location.href = 'index.html'; // Redirige a la página pública
      }
    });
  }
});
