import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert('Error al iniciar sesión: ' + error.message);

    window.location.href = 'store.html';
  });

  document.getElementById('google-login').addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) alert('Error con Google: ' + error.message);
  });
});
