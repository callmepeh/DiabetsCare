/**
 * main.js
 * 
 * Script principal de inicialização da aplicação.
 * 
 * Este módulo é responsável por:
 * - Verificar autenticação do usuário em páginas protegidas
 * - Configurar o botão de logout global
 * - Redirecionar usuários não autenticados para a página de login
 * 
 * Este script é carregado em todas as páginas que precisam de verificação
 * de autenticação e funcionalidade de logout.
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
 * Inicializa a aplicação quando a página é carregada.
 * 
 * Aguarda o carregamento completo do DOM e então:
 * 1. Verifica se há um usuário autenticado
 * 2. Configura o botão de logout (se existir na página)
 * 3. Protege páginas que exigem autenticação
 */
document.addEventListener("DOMContentLoaded", () => {
  // Obtém referência ao botão de logout (pode não existir em todas as páginas)
  const botaoLogout = document.querySelector("#logoutBtn");

  /**
   * Configura o botão de logout se existir na página.
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

  /**
   * Protege páginas que exigem autenticação.
   * 
   * Se a página atual for o dashboard e o usuário não estiver autenticado,
   * redireciona para a página de login.
   */
  if (window.location.pathname.includes("dashboard.html") && !estaAutenticado()) {
    alert("Faça login para acessar o dashboard!");
    window.location.href = "login.html";
  }
});
