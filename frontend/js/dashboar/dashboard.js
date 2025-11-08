/**
 * dashboard.js
 * 
 * Script de gerenciamento da página do dashboard.
 * 
 * Este módulo é responsável por:
 * - Verificar se o usuário está autenticado
 * - Exibir dados básicos do usuário logado
 * - Gerenciar o logout do usuário
 */

/**
 * Verifica se o usuário está autenticado verificando o token no localStorage.
 * 
 * @returns {boolean} True se o usuário estiver autenticado, False caso contrário
 */
const estaAutenticado = () => {
  const token = localStorage.getItem("dc_token");
  return token !== null && token !== "";
};

/**
 * Obtém os dados do usuário logado do localStorage.
 * 
 * @returns {Object|null} Objeto com dados do usuário ou null se não encontrado
 */
const obterUsuario = () => {
  const usuarioStr = localStorage.getItem("dc_usuario");
  if (!usuarioStr) {
    return null;
  }
  try {
    return JSON.parse(usuarioStr);
  } catch (erro) {
    console.error("Erro ao parsear dados do usuário:", erro);
    return null;
  }
};

/**
 * Realiza o logout do usuário, removendo os dados de autenticação.
 */
const fazerLogout = () => {
  // Remove o token JWT
  localStorage.removeItem("dc_token");
  
  // Remove os dados do usuário
  localStorage.removeItem("dc_usuario");
  
  // Redireciona para a página de login
  window.location.href = "login.html";
};

/**
 * Inicializa o dashboard quando a página é carregada.
 * 
 * Aguarda o carregamento completo do DOM e então:
 * 1. Verifica se há um usuário autenticado
 * 2. Carrega e exibe os dados do usuário
 * 3. Configura os event listeners para botões
 */
document.addEventListener("DOMContentLoaded", () => {
  // Verifica se o usuário está autenticado
  if (!estaAutenticado()) {
    alert("Faça login primeiro!");
    window.location.href = "login.html";
    return;
  }

  // Obtém os dados do usuário
  const usuario = obterUsuario();
  
  if (!usuario) {
    alert("Erro ao carregar dados do usuário. Faça login novamente.");
    fazerLogout();
    return;
  }

  // Obtém referências aos elementos do DOM
  const elementoNome = document.getElementById("userName");
  const botaoLogout = document.getElementById("logoutBtn");

  // Exibe o nome do usuário na página (se o elemento existir)
  if (elementoNome) {
    elementoNome.textContent = usuario.nome || usuario.name || "Usuário";
  }

  /**
   * Manipula o evento de clique no botão de logout.
   * 
   * Quando o usuário clica no botão de logout:
   * 1. Remove os dados de autenticação do localStorage
   * 2. Redireciona para a página de login
   */
  if (botaoLogout) {
    botaoLogout.addEventListener("click", () => {
      fazerLogout();
    });
  }
});
