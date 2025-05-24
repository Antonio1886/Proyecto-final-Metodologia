// register.js
import { supabase } from './supabaseClient.js';

async function registrarUsuario(email, password) {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) return alert('Error: ' + error.message);
  alert('¡Registro exitoso!');
}
