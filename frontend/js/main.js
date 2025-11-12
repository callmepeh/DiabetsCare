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
 * 
 * IMPORTANTE: storage.js deve ser carregado ANTES deste script no HTML
 */

/**
 * Lista de páginas que NÃO requerem autenticação
 */
const PAGINAS_PUBLICAS = [
  'login.html',
  'cadastro.html',
  'index.html'
];

/**
 * Verifica se a página atual requer autenticação
 * @returns {boolean} True se a página requer autenticação
 */
const paginaRequerAutenticacao = () => {
  const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
  return !PAGINAS_PUBLICAS.includes(paginaAtual);
};

/**
 * Protege rotas - redireciona para login se não estiver autenticado
 * Esta função é executada IMEDIATAMENTE, antes do DOMContentLoaded
 * para garantir proteção mesmo se a página carregar parcialmente
 */
const protegerRotas = () => {
  // Verifica se o AuthService está disponível (storage.js foi carregado)
  if (typeof AuthService === 'undefined') {
    // Se não estiver disponível ainda, tenta novamente após um pequeno delay
    setTimeout(protegerRotas, 50);
    return;
  }

  if (paginaRequerAutenticacao()) {
    if (!AuthService.estaLogado()) {
      alert("Você precisa estar logado para acessar esta página.");
      window.location.href = "login.html";
      return false;
    }
  }
  return true;
};

// Executa proteção IMEDIATAMENTE (antes do DOM carregar)
protegerRotas();

/**
 * Realiza o logout do usuário
 */
const fazerLogout = () => {
  AuthService.fazerLogout();
  window.location.href = "login.html";
};

/**
 * Inicializa a aplicação quando a página é carregada.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Protege rotas novamente (caso a primeira verificação não tenha funcionado)
  if (!protegerRotas()) {
    return; // Se não estiver autenticado, para a execução aqui
  }

  // Configura botões de logout
  const botoesLogout = document.querySelectorAll("#logoutBtn, .btn-logout, [data-logout]");
  botoesLogout.forEach(botao => {
    botao.addEventListener("click", (e) => {
      e.preventDefault();
      fazerLogout();
    });
  });

  // Atualiza links de login/logout no header baseado no estado de autenticação
  const linksLogin = document.querySelectorAll('a.btn-login, nav a[href="login.html"]');
  const usuario = AuthService.obterUsuario();
  
  linksLogin.forEach(link => {
    if (usuario) {
      // Se estiver logado, pode mudar para mostrar nome ou logout
      link.textContent = usuario.nome || 'Perfil';
      link.href = 'perfil.html';
    }
  });
});
