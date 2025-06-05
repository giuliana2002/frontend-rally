const apiUrl = 'http://157.230.56.12:3000/api';
const params = new URLSearchParams(window.location.search);
const fotoId = params.get('foto_id');

const contenedor = document.getElementById('contenedorFoto');
const btnVotar = document.getElementById('btnVotar');

async function cargarFoto() {
  try {
    const res = await fetch(`${apiUrl}/fotografias/${fotoId}`);
    const foto = await res.json();
    if (!foto || res.status !== 200) {
      contenedor.innerHTML = '<p>Fotografía no encontrada.</p>';
      btnVotar.style.display = 'none';
      return;
    }

    contenedor.innerHTML = `
      <img src="${foto.url}" alt="${foto.titulo}" class="foto-grande" />
      <h3>${foto.titulo || 'Sin título'}</h3>
      <p>Autor: ${foto.autor}</p>
      <p>${foto.descripcion || ''}</p>
    `;
  } catch (err) {
    console.error('Error al cargar foto:', err);
    contenedor.innerHTML = '<p>Error al cargar fotografía.</p>';
  }
}

btnVotar.addEventListener('click', async () => {
  try {
    const res = await fetch(apiUrl + '/votaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fotografia_id: fotoId })
    });
    const result = await res.json();
    alert(result.mensaje || 'Voto registrado');
  } catch (err) {
    alert('Error al votar.');
  }
});

cargarFoto();
