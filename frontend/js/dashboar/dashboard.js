/**
 * dashboard.js
 * 
 * Script de gerenciamento da página do dashboard.
 * Exibe dados do usuário, glicemias, estatísticas e gráfico de evolução.
 */

/**
 * Verifica se o usuário está autenticado verificando o token no localStorage.
 * @returns {boolean} True se autenticado, false caso contrário
 */
const estaAutenticado = () => {
  const token = localStorage.getItem("dc_token");
  return token !== null && token !== "";
};

/**
 * Obtém os dados do usuário logado do localStorage.
 * @returns {Object|null} Objeto com dados do usuário ou null
 */
const obterUsuario = () => {
  const usuarioStr = localStorage.getItem("dc_usuario");
  if (!usuarioStr) return null;

  try {
    return JSON.parse(usuarioStr);
  } catch (erro) {
    console.error("Erro ao parsear dados do usuário:", erro);
    return null;
  }
};

/**
 * Realiza o logout do usuário
 */
const fazerLogout = () => {
  localStorage.removeItem("dc_token");
  localStorage.removeItem("dc_usuario");
  window.location.href = "login.html";
};

/**
 * Cria uma linha de tabela de glicemia a partir de um registro
 * @param {Object} registro - objeto com { data, valor }
 * @returns {HTMLTableRowElement} elemento <tr>
 */
const criarLinhaGlicemia = (registro) => {
  const linha = document.createElement("tr");
  const tdData = document.createElement("td");
  tdData.textContent = registro.data;
  const tdValor = document.createElement("td");
  tdValor.textContent = registro.valor;
  linha.appendChild(tdData);
  linha.appendChild(tdValor);
  return linha;
};

/**
 * Calcula a média dos últimos 'n' dias para um usuário
 * @param {Array} registros - array de registros do usuário
 * @param {number} dias - quantidade de dias para calcular a média
 * @returns {string} média formatada com 2 casas decimais
 */
const mediaUltimosDias = (registros, dias) => {
  const hoje = new Date();
  const dataLimite = new Date();
  dataLimite.setDate(hoje.getDate() - dias + 1);

  const recentes = registros.filter(r => new Date(r.data) >= dataLimite);
  if (recentes.length === 0) return "0";

  const soma = recentes.reduce((acc, r) => acc + r.valor, 0);
  return (soma / recentes.length).toFixed(2);
};

/**
 * Retorna o último registro do usuário
 * @param {Array} registros - array de registros do usuário
 * @returns {Object|null} último registro ou null
 */
const ultimoRegistro = (registros) => {
  if (registros.length === 0) return null;
  return registros[registros.length - 1];
};

/**
 * Conta o total de registros do usuário
 * @param {Array} registros - array de registros do usuário
 * @returns {number} quantidade de registros
 */
const contarRegistros = (registros) => registros.length;

/**
 * Renderiza as estatísticas de glicemia no HTML
 * @param {Array} registros - array de registros do usuário
 */
const renderizarEstatisticas = (registros) => {
  const mediaEl = document.getElementById("media");
  const ultimoEl = document.getElementById("ultimo");
  const totalEl = document.getElementById("total");

  if (mediaEl) mediaEl.innerText = mediaUltimosDias(registros, 3);
  const ultimo = ultimoRegistro(registros);
  if (ultimoEl) ultimoEl.innerText = ultimo ? `${ultimo.valor} mg/dL (${ultimo.data})` : "Nenhum registro";
  if (totalEl) totalEl.innerText = contarRegistros(registros);
};

/**
 * Gera gráfico de linha mostrando evolução da glicemia
 * @param {Array} registros - array de registros do usuário
 */
const renderizarGrafico = (registros) => {
  const canvas = document.getElementById('graficoGlicemia');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Ordena registros por data
  const registrosOrdenados = registros.sort((a, b) => new Date(a.data) - new Date(b.data));
  const labels = registrosOrdenados.map(r => r.data);
  const valores = registrosOrdenados.map(r => r.valor);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Glicemia (mg/dL)',
        data: valores,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 4
      }]
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
 * Exibe registros, estatísticas e gráfico no dashboard
 * @param {string} emailUsuario
 */
const exibirDashboard = (emailUsuario) => {
  const dados = JSON.parse(localStorage.getItem("dc_glicemias")) || [];
  const registrosUsuario = dados.filter(reg => reg.email === emailUsuario);
  const corpoTabela = document.getElementById("tabela-glicemia");

  if (!corpoTabela) return;
  corpoTabela.innerHTML = "";

  if (registrosUsuario.length === 0) {
    corpoTabela.innerHTML = `<tr><td colspan="2">Nenhum registro de glicemia encontrado.</td></tr>`;
    renderizarEstatisticas([]); // zera estatísticas
    return;
  }

  // Renderiza linhas da tabela
  registrosUsuario.forEach(item => {
    const linha = criarLinhaGlicemia(item);
    corpoTabela.appendChild(linha);
  });

  // Renderiza estatísticas e gráfico
  renderizarEstatisticas(registrosUsuario);
  renderizarGrafico(registrosUsuario);
};

/**
 * Inicializa o dashboard
 */
document.addEventListener("DOMContentLoaded", () => {
  if (!estaAutenticado()) {
    alert("Faça login primeiro!");
    window.location.href = "login.html";
    return;
  }

  const usuario = obterUsuario();
  if (!usuario) {
    alert("Erro ao carregar dados do usuário. Faça login novamente.");
    fazerLogout();
    return;
  }

  // Exibe nome do usuário
  const elementoNome = document.getElementById("userName");
  if (elementoNome) elementoNome.textContent = usuario.nome || usuario.name || "Usuário";

  // Botão logout
  const botaoLogout = document.getElementById("logoutBtn");
  if (botaoLogout) botaoLogout.addEventListener("click", fazerLogout);

  // Exibe todo o dashboard (tabela, estatísticas e gráfico)
  exibirDashboard(usuario.email);
});
