const apiUrl = 'http://157.230.56.12:3000/api';
const rallySelect = document.getElementById('rallySelect');
const rankingVisual = document.getElementById('rankingVisual');

document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch(apiUrl + '/rallys/activos');
  const rallys = await res.json();

  rallys.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = r.nombre;
    rallySelect.appendChild(opt);
  });
});

rallySelect.addEventListener('change', async () => {
  const rallyId = rallySelect.value;
  if (!rallyId) return;

  const res = await fetch(`${apiUrl}/votaciones/ranking?rally_id=${rallyId}`);
  const votos = await res.json();

  rankingVisual.innerHTML = '';

  if (!votos.length) {
    rankingVisual.innerHTML = '<p>No hay votos registrados para este rally.</p>';
    return;
  }

  votos.forEach((v, i) => {
    const card = document.createElement('div');
    card.className = 'ranking-card';
    card.innerHTML = `
      <div class="puesto">${i + 1}º</div>
      <img src="${v.url}" alt="foto ${v.fotografia_id}" />
      <div class="info">
        <h3>${v.autor}</h3>
        <p>${v.votos} votos</p>
      </div>
    `;
    rankingVisual.appendChild(card);
  });
});
