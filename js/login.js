// login.js
import { supabase } from './supabaseClient.js';

async function login(email, password) {
  const { user, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert('Error: ' + error.message);
  window.location.href = "catalog.html";
}
