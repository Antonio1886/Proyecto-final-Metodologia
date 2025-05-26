// authCheck.js
import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = 'index.html';
  } else {
    const userEmail = session.user.email;
    const emailDisplay = document.getElementById('user-email');
    const usernameDisplay = document.getElementById('user-username');

    // Mostrar correo
    if (emailDisplay) {
      emailDisplay.textContent = userEmail;
    }

    // Buscar el username asociado al email
    const { data, error } = await supabase
      .from('usuarios')
      .select('username')
      .eq('email', userEmail)
      .single();

    if (error) {
      console.error('Error al obtener username:', error.message);
    } else if (usernameDisplay) {
      usernameDisplay.textContent = data.username;
    }
  }
});
