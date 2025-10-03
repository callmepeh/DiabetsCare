document.addEventListener("DOMContentLoaded", () => {
  // Dados simulados (exemplo)
  const dados = [
    { dia: "Seg", jejum: 85, pos: 130, dormir: 110 },
    { dia: "Ter", jejum: 90, pos: 140, dormir: 120 },
    { dia: "Qua", jejum: 100, pos: 150, dormir: 130 },
    { dia: "Qui", jejum: 95, pos: 135, dormir: 125 },
    { dia: "Sex", jejum: 88, pos: 128, dormir: 118 },
    { dia: "Sáb", jejum: 92, pos: 138, dormir: 122 },
    { dia: "Dom", jejum: 89, pos: 132, dormir: 117 },
  ];

  // Calcular médias
  const mediaJejum = (
    dados.reduce((acc, d) => acc + d.jejum, 0) / dados.length
  ).toFixed(1);
  const mediaPos = (
    dados.reduce((acc, d) => acc + d.pos, 0) / dados.length
  ).toFixed(1);
  const mediaDormir = (
    dados.reduce((acc, d) => acc + d.dormir, 0) / dados.length
  ).toFixed(1);

  // Atualizar no HTML
  document.getElementById("media-jejum").textContent = `${mediaJejum} mg/dL`;
  document.getElementById("media-pos").textContent = `${mediaPos} mg/dL`;
  document.getElementById("media-dormir").textContent = `${mediaDormir} mg/dL`;

  // Configurar gráfico
  const ctx = document.getElementById("graficoGlicemia").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: dados.map((d) => d.dia),
      datasets: [
        {
          label: "Jejum",
          data: dados.map((d) => d.jejum),
          borderColor: "#4285f4",
          backgroundColor: "rgba(66,133,244,0.1)",
          fill: true,
          tension: 0.3,
        },
        {
          label: "Pós-prandial",
          data: dados.map((d) => d.pos),
          borderColor: "#28a745",
          backgroundColor: "rgba(40,167,69,0.1)",
          fill: true,
          tension: 0.3,
        },
        {
          label: "Antes de Dormir",
          data: dados.map((d) => d.dormir),
          borderColor: "#dc3545",
          backgroundColor: "rgba(220,53,69,0.1)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: false },
      },
      scales: {
        y: {
          beginAtZero: false,
          title: { display: true, text: "mg/dL" },
        },
      },
    },
  });
});
