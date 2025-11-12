/**
 * login.js
 * 
 * Script de autenticação - Login de usuários
 * Usa localStorage para armazenar e validar credenciais
 */

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("loginForm");

  if (!formulario) {
    console.error("Formulário de login não encontrado na página.");
    return;
  }

  // Validação em tempo real
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  emailInput.addEventListener("blur", () => {
    const email = emailInput.value.trim();
    if (email && !validarEmail(email)) {
      emailInput.setCustomValidity("Por favor, insira um e-mail válido.");
    } else {
      emailInput.setCustomValidity("");
    }
  });

  passwordInput.addEventListener("input", () => {
    passwordInput.setCustomValidity("");
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const email = emailInput.value.trim();
    const senha = passwordInput.value.trim();

    // Validação básica
    if (!email || !senha) {
      alert("Informe e-mail e senha para continuar.");
      return;
    }

    if (!validarEmail(email)) {
      alert("Por favor, insira um e-mail válido.");
      emailInput.focus();
      return;
    }

    try {
      // Valida credenciais usando UserService
      const usuario = UserService.validarLogin(email, senha);

      if (!usuario) {
        alert("E-mail ou senha incorretos. Verifique suas credenciais.");
        passwordInput.value = "";
        passwordInput.focus();
        return;
      }

      // Faz login usando AuthService
      AuthService.fazerLogin(usuario);

      // Verifica se os dados foram salvos corretamente
      const usuarioVerificado = AuthService.obterUsuario();
      if (usuarioVerificado) {
        console.log('Dados do usuário salvos:', usuarioVerificado);
      } else {
        console.error('Erro: dados do usuário não foram salvos corretamente');
      }

      alert("Login realizado com sucesso!");
      window.location.href = "dashboard.html";
    } catch (erro) {
      console.error("Erro ao efetuar login:", erro);
      alert("Erro ao realizar login. Tente novamente.");
    }
  });
});

/**
 * Valida formato de e-mail
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se válido
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
