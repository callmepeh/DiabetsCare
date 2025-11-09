document.addEventListener("DOMContentLoaded", () => {
  const dadosUsuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const secaoInfo = document.getElementById("infoUsuario");
  const secaoPosts = document.getElementById("postsUsuario");

  if (!dadosUsuario) {
    alert("Nenhum usuário logado. Faça login novamente.");
    window.location.href = "login.html";
    return;
  }

  secaoInfo.innerHTML = `
    <h2>${dadosUsuario.nome}</h2>
    <p>${dadosUsuario.usuario}</p>
    <p>Tipo de conta: ${dadosUsuario.tipoConta || "Comum"}</p>
  `;

  const todosPosts = JSON.parse(localStorage.getItem("posts")) || [];
  const postsUsuario = todosPosts.filter(p => p.usuario === dadosUsuario.usuario);

  if (postsUsuario.length === 0) {
    secaoPosts.innerHTML = "<p>Você ainda não publicou nada.</p>";
  } else {
    secaoPosts.innerHTML = postsUsuario.map(post => `
      <div class="post-card">
        <p>${post.conteudo}</p>
        <span>${post.data}</span>
        <p><strong>Curtidas:</strong> ${post.curtidas}</p>
      </div>
    `).join("");
  }
});
