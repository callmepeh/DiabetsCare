const URL_API = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formCadastro");

  if (!formulario) {
    console.error("Formulário de cadastro não encontrado na página.");
    return;
  }

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const tipoConta = document.querySelector('input[name="tipoConta"]:checked')?.value;

    if (!nome || !email || !senha || !tipoConta) {
      alert("Preencha todos os campos para continuar.");
      return;
    }

    try {
      const resposta = await fetch(`${URL_API}/auth/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, email, senha, tipoConta }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados?.message || "Não foi possível concluir o cadastro.");
        return;
      }
      alert(dados.message || "Cadastro realizado com sucesso! Faça login para continuar.");
      
      window.location.href = "login.html";
    } catch (erro) {
      console.error("Erro ao cadastrar usuário", erro);
      alert("Erro de conexão com o servidor. Tente novamente em instantes.");
    }
  });
});
