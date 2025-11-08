const URL_API = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("loginForm");

  if (!formulario) {
    console.error("Formulário de login não encontrado na página.");
    return;
  }

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const email = formulario.email.value.trim();
    const senha = formulario.password.value.trim();

    if (!email || !senha) {
      alert("Informe e-mail e senha para continuar.");
      return;
    }

    try {
      const resposta = await fetch(`${URL_API}/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados?.message || "Não foi possível realizar o login.");
        return;
      }

      localStorage.setItem("dc_token", dados.token);
      localStorage.setItem("dc_usuario", JSON.stringify(dados.usuario));

      alert("Login realizado com sucesso!");
      window.location.href = "dashboard.html";
    } catch (erro) {
      console.error("Erro ao efetuar login", erro);
      alert("Erro de conexão com o servidor. Tente novamente em instantes.");
    }
  });
});
