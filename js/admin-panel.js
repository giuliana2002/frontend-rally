const apiUrl = 'http://157.230.56.12:3000/api';
const token = localStorage.getItem('token');

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

function mostrarSeccion(id) {
  document.querySelectorAll('.seccion-panel').forEach(seccion => {
    seccion.classList.remove('active');
  });
  const activa = document.getElementById(id);
  if (activa) {
    activa.classList.add('active');
  }
}



async function cargarFotosPendientes() {
  const res = await fetch(apiUrl + '/fotografias/pendientes', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  const fotos = await res.json();
  console.log('Fotos pendientes:', fotos);

  const contenedor = document.getElementById('listaFotos');
  contenedor.innerHTML = '';

  if (!Array.isArray(fotos)) {
    contenedor.innerHTML = '<p>No se encontraron fotografías pendientes.</p>';
    return;
  }

  fotos.forEach(foto => {
    const div = document.createElement('div');
    div.className = 'foto-card';
    div.innerHTML = `
      <img src="${foto.url}" />
      <p><strong>${foto.titulo}</strong> - Autor: ${foto.autor}</p>
      <p>Estado: ${foto.estado}</p>
      <button onclick="validarFoto(${foto.id}, 'admitida')"> Admitir </button>
      <button onclick="validarFoto(${foto.id}, 'rechazada')"> Rechazar </button>
    `;
    contenedor.appendChild(div);
  });
}

async function validarFoto(id, estado) {
  const res = await fetch(`${apiUrl}/fotografias/${id}/validar`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ estado })
  });
  const result = await res.json();
  alert(result.mensaje || 'Estado actualizado');
  cargarFotosPendientes();
}

async function cargarUsuarios() {
  const res = await fetch(apiUrl + '/usuarios', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const usuarios = await res.json();
  const contenedor = document.getElementById('listaUsuarios');
  contenedor.innerHTML = '';
  usuarios.forEach(u => {
    const div = document.createElement('div');
    div.className = 'foto-card';
    div.innerHTML = `
      <p>${u.nombre} - ${u.email} [${u.rol}]</p>
      <button onclick="cambiarRol(${u.id}, '${u.rol === 'admin' ? 'participante' : 'admin'}')">Cambiar Rol</button>
      <button onclick="eliminarUsuario(${u.id})">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });
}

async function cambiarRol(id, nuevoRol) {
  const res = await fetch(`${apiUrl}/usuarios/${id}/rol`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nuevoRol })
  });
  const result = await res.json();
  alert(result.mensaje || 'Rol actualizado');
  cargarUsuarios();
}

async function eliminarUsuario(id) {
  const res = await fetch(`${apiUrl}/usuarios/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const result = await res.json();
  alert(result.mensaje || 'Usuario eliminado');
  cargarUsuarios();
}

// NUEVA: función para crear un rally
async function crearRally(e) {
  e.preventDefault();

  const datos = {
    nombre: document.getElementById('nombre').value,
    descripcion: document.getElementById('descripcion').value,
    fecha_inicio: document.getElementById('fecha_inicio').value,
    fecha_fin: document.getElementById('fecha_fin').value
  };

  const res = await fetch(`${apiUrl}/rallys`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  });

  const result = await res.json();
  alert(result.mensaje || 'Rally creado');
  document.getElementById('formRally').reset();
}

document.addEventListener('DOMContentLoaded', () => {
  const datos = parseJwt(token);
  if (!token || datos?.rol !== 'admin') {
    alert('Acceso denegado: solo para administradores');
    return (window.location.href = 'index.html');
  }

  cargarFotosPendientes();
  cargarUsuarios();

  // Establecer fecha actual en el campo fecha_inicio
  const hoy = new Date().toISOString().split('T')[0];
  const inputFechaInicio = document.getElementById('fecha_inicio');
  if (inputFechaInicio) {
    inputFechaInicio.value = hoy;
  }

  // Activar formulario de crear rally
  const formRally = document.getElementById('formRally');
  if (formRally) {
    formRally.addEventListener('submit', crearRally);
  }
});

