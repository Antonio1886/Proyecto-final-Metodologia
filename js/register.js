// register.js
import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.profile-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
      alert('Por favor, completa todos los campos');
      return;
    }

    // 1. Registrar en Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError) {
      alert('Error al registrar: ' + signUpError.message);
      return;
    }

    const userId = signUpData.user?.id;

    // 2. Guardar el username en tu tabla de usuarios (opcional)
    const { error: insertError } = await supabase
      .from('usuarios')
      .insert([{ id: userId, username, email }]);

    if (insertError) {
      alert('Error al guardar perfil: ' + insertError.message);
      return;
    }

    alert('¡Perfil creado con éxito! Revisa tu correo para confirmar tu cuenta.');
    window.location.href = 'Home.html'; // o la ruta que elijas
  });
});
