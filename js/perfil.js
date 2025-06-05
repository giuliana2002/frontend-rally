const apiUrl = 'http://157.230.56.12:3000/api';
const token = localStorage.getItem('token');

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

async function cargarPerfil() {
  try {
    const res = await fetch(apiUrl + '/usuarios/me', {
      headers: { Authorization: 'Bearer ' + token }
    });
    const yo = await res.json();
    if (!yo) return;

    document.querySelector('input[name=nombre]').value = yo.nombre;
    document.querySelector('input[name=email]').value = yo.email;
    document.getElementById('imagenPerfil').src = yo.imagen_url || 'https://res.cloudinary.com/daqqbvl4t/image/upload/v1747403653/samples/animals/cat.jpg';

  } catch (err) {
    console.error('Error cargando perfil:', err.message);
  }
}

async function cargarMisFotos() {
  try {
    const res = await fetch(apiUrl + '/fotografias/mias', {
      headers: { Authorization: 'Bearer ' + token }
    });
    const fotos = await res.json();
    console.log('Fotos mías:', fotos);

    const contenedor = document.getElementById('misFotos');
    contenedor.innerHTML = '';

    if (!fotos.length) {
      contenedor.innerHTML = '<p>No has subido ninguna foto todavía.</p>';
      return;
    }

    fotos.forEach(f => {
      const div = document.createElement('div');
      div.className = 'foto-card';
      div.innerHTML = `
        <img src="${f.url}" />
        <p><strong>${f.titulo || 'Sin título'}</strong></p>
        <p>Estado: ${f.estado}</p>
      `;
      contenedor.appendChild(div);
    });
  } catch (err) {
    console.error('Error cargando tus fotos:', err.message);
  }
}

document.getElementById('perfilForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData();

  const nombre = form.nombre.value.trim();
  const email = form.email.value.trim();
  const imagen = form.imagen.files[0];

  formData.append('nombre', nombre || '');
  formData.append('email', email || '');
  if (imagen) {
    formData.append('imagen', imagen);
  }

  try {
    const res = await fetch(apiUrl + '/usuarios/perfil', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.mensaje || 'Error al actualizar');
    }

    alert(result.mensaje || 'Perfil actualizado');
    cargarPerfil();
  } catch (err) {
    console.error('Error al enviar el formulario:', err.message);
    alert('Error al actualizar perfil. Consulta la consola para más detalles.');
  }
});


document.addEventListener('DOMContentLoaded', () => {
  if (!token) return location.href = 'login.html';
  cargarPerfil();
  cargarMisFotos();
});

