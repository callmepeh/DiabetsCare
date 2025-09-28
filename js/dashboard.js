let registros = [];
const logForm = document.getElementById('logForm');
const logsTableBody = document.querySelector('#logsTable tbody');
const chartCtx = document.getElementById('chart').getContext('2d');

let glicemiaChart = new Chart(chartCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Jejum (mg/dL)',
      data: [],
      borderColor: '#4a90e2',
      fill: false,
      tension: 0.3
    },
    {
      label: 'Pós-prandial (mg/dL)',
      data: [],
      borderColor: '#f39c12',
      fill: false,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Evolução da Glicemia' }
    },
    scales: {
      y: { beginAtZero: false }
    }
  }
});

function atualizarDashboard() {
  logsTableBody.innerHTML = '';
  registros.forEach(reg => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${reg.date}</td>
      <td>${reg.fasting}</td>
      <td>${reg.postMeal}</td>
      <td>${reg.notes}</td>
    `;
    logsTableBody.appendChild(row);
  });

  glicemiaChart.data.labels = registros.map(r => r.date);
  glicemiaChart.data.datasets[0].data = registros.map(r => r.fasting);
  glicemiaChart.data.datasets[1].data = registros.map(r => r.postMeal || null);
  glicemiaChart.update();
}

logForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const date = document.getElementById('date').value;
  const fasting = document.getElementById('fasting').value;
  const postMeal = document.getElementById('postMeal').value;
  const notes = document.getElementById('notes').value;

  if (!date || !fasting) {
    alert('Preencha pelo menos data e glicemia em jejum.');
    return;
  }

  registros.push({ date, fasting, postMeal, notes });
  logForm.reset();
  atualizarDashboard();
});
