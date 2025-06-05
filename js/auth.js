const token = localStorage.getItem('token');
const authNav = document.getElementById('nav-auth');
const nav = document.querySelector('nav ul');

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

async function mostrarUsuarioNav() {
  if (!token) {
    authNav.innerHTML = `<a href="login.html" class="nav-link">Iniciar Sesión</a>`;
    return;
  }

  const user = parseJwt(token);
  if (!user) return;

  try {
    const res = await fetch('http://157.230.56.12:3000/api/usuarios/me', {
      headers: { Authorization: 'Bearer ' + token }
    });

    const yo = await res.json();
    const img = yo.imagen_url;

    if (yo.rol === 'admin') {
      const li = document.createElement('li');
      li.classList.add('nav-item');
      li.innerHTML = `<a href="admin-panel.html" class="nav-link nav-admin">Panel Admin</a>`;
      nav.insertBefore(li, authNav);
    }

    authNav.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <img src="${img}" alt="Perfil" class="avatar-img rounded-circle border border-info" />
        <button onclick="cerrarSesion()" class="btn btn-sm btn-link text-danger p-0 m-0 fw-semibold">Cerrar sesión</button>
      </div>
    `;
  } catch (err) {
    console.error('No se pudo cargar el usuario', err);
  }
}

function cerrarSesion() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', mostrarUsuarioNav);
