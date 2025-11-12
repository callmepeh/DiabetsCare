/**
 * dashboard.js
 * 
 * Script de gerenciamento da página do dashboard.
 * Exibe dados do usuário, glicemias, estatísticas e gráfico de evolução.
 */

// Aguarda o carregamento do storage.js

/**
 * Calcula a média de um tipo específico de glicemia
 * @param {Array} registros - array de registros do usuário
 * @param {string} tipo - 'jejum', 'posPrandial' ou 'antesDormir'
 * @returns {string} média formatada com 2 casas decimais
 */
const calcularMedia = (registros, tipo) => {
  if (registros.length === 0) return "—";
  
  const valores = registros.map(r => {
    if (tipo === 'jejum') return r.glicemiaJejum;
    if (tipo === 'posPrandial') return r.glicemiaPosPrandial;
    if (tipo === 'antesDormir') return r.glicemiaAntesDormir;
    return 0;
  }).filter(v => v > 0);

  if (valores.length === 0) return "—";
  
  const soma = valores.reduce((acc, v) => acc + v, 0);
  return (soma / valores.length).toFixed(1);
};

/**
 * Gera gráfico de linha mostrando evolução da glicemia
 * @param {Array} registros - array de registros do usuário
 */
const renderizarGrafico = (registros) => {
  const canvas = document.getElementById('graficoGlicemia');
  if (!canvas) return;

  // Ordena registros por data (mais antigo primeiro)
  const registrosOrdenados = registros.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));
  
  if (registrosOrdenados.length === 0) {
    // Se não há registros, mostra mensagem
    canvas.parentElement.innerHTML = '<p style="text-align: center; padding: 20px;">Nenhum registro para exibir no gráfico. Registre sua primeira glicemia!</p>';
    return;
  }

  const labels = registrosOrdenados.map(r => {
    const data = new Date(r.dataHora);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  });

  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Jejum (mg/dL)',
          data: registrosOrdenados.map(r => r.glicemiaJejum),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3,
          fill: false,
          pointRadius: 4
        },
        {
          label: 'Pós-prandial (mg/dL)',
          data: registrosOrdenados.map(r => r.glicemiaPosPrandial),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.3,
          fill: false,
          pointRadius: 4
        },
        {
          label: 'Antes de dormir (mg/dL)',
          data: registrosOrdenados.map(r => r.glicemiaAntesDormir),
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          tension: 0.3,
          fill: false,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 50,
          max: 250,
          title: { display: true, text: 'mg/dL' }
        },
        x: {
          title: { display: true, text: 'Data' }
        }
      }
    }
  });
};

/**
 * Inicializa o dashboard
 */
document.addEventListener("DOMContentLoaded", () => {
  if (!AuthService.estaLogado()) {
    alert("Faça login primeiro!");
    window.location.href = "login.html";
    return;
  }

  const usuario = AuthService.obterUsuario();
  if (!usuario) {
    alert("Erro ao carregar dados do usuário. Faça login novamente.");
    AuthService.fazerLogout();
    window.location.href = "login.html";
    return;
  }

  console.log('Usuário logado no dashboard:', usuario);

  // Exibe nome do usuário no dashboard
  const subtitleEl = document.getElementById("dashboard-subtitle");
  if (subtitleEl && usuario.nome) {
    subtitleEl.textContent = `Olá, ${usuario.nome}! Acompanhe sua evolução diária da glicemia`;
  }

  // Obtém registros do usuário
  const registros = GlicemiaService.obterPorUsuario(usuario.id);

  // Atualiza médias
  const mediaJejumEl = document.getElementById("media-jejum");
  const mediaPosEl = document.getElementById("media-pos");
  const mediaDormirEl = document.getElementById("media-dormir");

  if (mediaJejumEl) mediaJejumEl.textContent = calcularMedia(registros, 'jejum') + " mg/dL";
  if (mediaPosEl) mediaPosEl.textContent = calcularMedia(registros, 'posPrandial') + " mg/dL";
  if (mediaDormirEl) mediaDormirEl.textContent = calcularMedia(registros, 'antesDormir') + " mg/dL";

  // Renderiza gráfico
  renderizarGrafico(registros);
});
