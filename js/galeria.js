const apiUrl = 'http://157.230.56.12:3000/api';
const listaRallys = document.getElementById('listaRallys');
const galeriaFotos = document.getElementById('galeriaFotos');
const buscador = document.getElementById('buscador');

let rallys = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch(apiUrl + '/rallys/activos');
    rallys = await res.json();
    mostrarRallys(rallys);
  } catch (error) {
    console.error('Error cargando rallys:', error);
  }
});

buscador.addEventListener('input', () => {
  const texto = buscador.value.toLowerCase();
  const filtrados = rallys.filter(r => r.nombre.toLowerCase().includes(texto));
  mostrarRallys(filtrados);
});

function mostrarRallys(rallysFiltrados) {
  listaRallys.innerHTML = '';
  rallysFiltrados.forEach(r => {
    const btn = document.createElement('button');
    btn.textContent = r.nombre;
    btn.className = 'rally-btn';
    btn.onclick = () => cargarGaleria(r.id);
    listaRallys.appendChild(btn);
  });
}

async function cargarGaleria(rally_id) {
  try {
    const res = await fetch(`${apiUrl}/fotografias/publicas?rally_id=${rally_id}`);
    const fotos = await res.json();
    galeriaFotos.innerHTML = '';

    if (!fotos.length) {
      galeriaFotos.innerHTML = '<p>No hay fotografías admitidas para este rally.</p>';
      return;
    }

    fotos.forEach(foto => {
      console.log('FOTO:', foto); 
      const card = document.createElement('div');
      card.className = 'foto-card';
      card.innerHTML = `
        <img src="${foto.url}" alt="${foto.titulo || 'Foto'}" />
        <h3>${foto.titulo || 'Sin título'}</h3>
        <p>Autor: ${foto.autor}</p>
      `;
      card.onclick = () => {
        window.location.href = 'votacion.html?foto_id=' + foto.id;
      };
      galeriaFotos.appendChild(card);
    });

  } catch (error) {
    console.error('Error al cargar galería:', error);
    galeriaFotos.innerHTML = '<p>Error al cargar fotografías.</p>';
  }
}
