document.addEventListener("DOMContentLoaded", () => {
  // ---------- 1. Carregar dados do usuário ----------
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const secaoInfo = document.getElementById("infoProfissional");
  const secaoPosts = document.getElementById("postsProfissional");

  if (!usuario) {
    alert("Nenhum usuário logado. Faça login novamente.");
    window.location.href = "login.html";
    return;
  }

  
  const { nome, usuario: user, tipoConta, especialidade, crm, bio } = usuario;

  secaoInfo.innerHTML = `
    <h2>${nome}</h2>
    <p><strong>Usuário:</strong> ${user}</p>
    <p><strong>Tipo de Conta:</strong> ${tipoConta || "Profissional"}</p>
    <p><strong>Especialidade:</strong> ${especialidade || "Não informada"}</p>
    <p><strong>CRM:</strong> ${crm || "Não informado"}</p>
    <p><strong>Biografia:</strong> ${bio || "Sem biografia cadastrada."}</p>
  `;

  const todosPosts = JSON.parse(localStorage.getItem("posts")) || [];
  const postsDoProfissional = todosPosts.filter(p => p.usuario === user);


  if (postsDoProfissional.length === 0) {
    secaoPosts.innerHTML = "<p>Você ainda não fez nenhuma publicação.</p>";
  } else {
    secaoPosts.innerHTML = postsDoProfissional.map(post => `
      <div class="post-card">
        <div class="post-header">
          <img src="img/user.png" alt="Avatar do usuário">
          <div>
            <h2>${post.nome}</h2>
            <span>${post.data}</span>
          </div>
        </div>
        <p class="post-text">${post.conteudo}</p>
        <p><strong>Curtidas:</strong> ${post.curtidas}</p>
      </div>
    `).join("");
  }

  // ---------- 5. Tratamento de erros básicos ----------
  window.addEventListener("error", (e) => {
    console.error("Erro detectado:", e.message);
    alert("Ocorreu um erro inesperado. Recarregue a página e tente novamente.");
  });
});
