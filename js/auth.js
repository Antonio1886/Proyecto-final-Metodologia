import { supabase } from './supabase.js';

// Detectar si estamos en la página de registro
const path = window.location.pathname;
const isRegisterPage = path.includes("register.html");

if (isRegisterPage) {
  const form = document.getElementById("register-form");
  const googleBtn = document.getElementById("google-register");

  // Registro con email y contraseña
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creando cuenta...';

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/login.html`
        }
      });

      if (error) throw error;

      alert(`¡Cuenta creada con éxito! Se ha enviado un correo de confirmación a ${email}`);
      window.location.href = "login.html";

    } catch (error) {
      console.error("Error en registro:", error);
      alert(`Error: ${error.message}`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  // Registro con Google
  googleBtn?.addEventListener("click", async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/index.html`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error en registro con Google:", error);
      alert(`Error con Google: ${error.message}`);
    }
  });
}
