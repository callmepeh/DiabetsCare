/**
 * register.js
 * 
 * Script de cadastro de novos usuários
 * Usa localStorage para armazenar dados de usuários
 */

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formCadastro");

  if (!formulario) {
    console.error("Formulário de cadastro não encontrado na página.");
    return;
  }

  // Referências aos campos
  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const tipoContaInputs = document.querySelectorAll('input[name="tipoConta"]');

  // Validação em tempo real
  emailInput.addEventListener("blur", () => {
    const email = emailInput.value.trim();
    if (email && !validarEmail(email)) {
      emailInput.setCustomValidity("Por favor, insira um e-mail válido.");
    } else {
      emailInput.setCustomValidity("");
    }
  });

  senhaInput.addEventListener("input", () => {
    const senha = senhaInput.value;
    if (senha && !validarSenha(senha)) {
      senhaInput.setCustomValidity("A senha deve ter pelo menos 6 caracteres.");
    } else {
      senhaInput.setCustomValidity("");
    }
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();
    const tipoConta = document.querySelector('input[name="tipoConta"]:checked')?.value;

    // Validação de campos obrigatórios
    if (!nome || !email || !senha || !tipoConta) {
      alert("Preencha todos os campos para continuar.");
      return;
    }

    // Validação de formato de e-mail
    if (!validarEmail(email)) {
      alert("Por favor, insira um e-mail válido.");
      emailInput.focus();
      return;
    }

    // Validação de força de senha
    if (!validarSenha(senha)) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      senhaInput.focus();
      return;
    }

    try {
      // Cria novo usuário usando UserService
      const novoUsuario = UserService.criar({
        nome,
        email,
        senha,
        tipoConta
      });

      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      window.location.href = "login.html";
    } catch (erro) {
      console.error("Erro ao cadastrar usuário:", erro);
      if (erro.message === 'Email já cadastrado') {
        alert("Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.");
        emailInput.focus();
      } else {
        alert("Erro ao realizar cadastro. Tente novamente.");
      }
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

/**
 * Valida força da senha
 * @param {string} senha - Senha a ser validada
 * @returns {boolean} True se válida (mínimo 6 caracteres)
 */
function validarSenha(senha) {
  return senha.length >= 6;
}
