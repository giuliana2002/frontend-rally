const apiUrl = 'http://157.230.56.12:3000/api';
const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
  if (!token) return location.href = 'login.html';
  const select = document.getElementById('rallySelect');
  const res = await fetch(apiUrl + '/rallys/activos');
  const rallys = await res.json();
  rallys.forEach(r => {
    const option = document.createElement('option');
    option.value = r.id;
    option.textContent = r.nombre;
    select.appendChild(option);
  });
});

document.getElementById('subirForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);

  const res = await fetch(apiUrl + '/fotografias/subir', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    body: data
  });

  const result = await res.json();
  if (res.ok) {
    alert('Fotografía subida con éxito. Espera aprobación.');
    form.reset();
  } else {
    alert(result.mensaje || 'Error al subir la fotografía');
  }
});
