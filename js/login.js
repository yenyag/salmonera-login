console.log("✅ login.js cargado correctamente");

const SUPABASE_URL = 'https://ldacffsmlyfyqczuljsh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYWNmZnNtbHlmeXFjenVsanNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5ODY0ODEsImV4cCI6MjA2NjU2MjQ4MX0.LWRkObfNkmjSquQstGp50v-lNa7kudrNve0mmbofSJs';

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    Swal.fire('⚠️ Campo vacío', 'Por favor ingresa correo y contraseña.', 'warning');
    return;
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?email=eq.${encodeURIComponent(email)}&select=*`, {
      method: 'GET',
      headers
    });

    if (!res.ok) throw new Error('❌ Error al obtener usuario');

    const usuarios = await res.json();

    if (usuarios.length === 0) {
      Swal.fire('🚫 Usuario no encontrado', 'Verifica tu correo', 'error');
      return;
    }

    const usuario = usuarios[0];

    // Validación con bcryptjs (asegúrate de que la librería está bien cargada)
    if (typeof bcrypt === 'undefined') {
      Swal.fire('Error crítico', 'bcryptjs no está definido. Revisa la carga del script.', 'error');
      return;
    }

    bcrypt.compare(password, usuario.password_hash, (err, match) => {
      if (err) {
        console.error('❌ Error al comparar hash:', err);
        Swal.fire('Error interno', 'Intenta nuevamente más tarde', 'error');
        return;
      }

      if (match) {
        localStorage.setItem('usuario', JSON.stringify({
          id: usuario.id,
          nombre: usuario.nombre,
          rol: usuario.rol
        }));

        Swal.fire('✅ Bienvenido', `Hola, ${usuario.nombre}`, 'success').then(() => {
          window.location.href = 'dashboard.html';
        });
      } else {
        Swal.fire('Contraseña incorrecta', 'Intenta nuevamente', 'error');
      }
    });

  } catch (error) {
    console.error('Error login:', error);
    Swal.fire('Error', error.message, 'error');
  }
});
