// ==============================
// RENDERIZAÇÃO DO FEED
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  renderFeed();
});

// Função principal para montar o feed dinamicamente
function renderFeed() {
  const postsList = document.querySelector(".posts-list");
  if (!postsList) return;

  postsList.innerHTML = ""; // limpar visual

  const safeGet = (key) => {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); }
    catch { return []; }
  };

  const posts = safeGet("posts");
  const users = safeGet("users");

  const findUser = (id) => users.find(u =>
    u.id == id || u._id == id || u.userId == id
  ) || null;

  const formatTime = (t) => new Date(t).toLocaleString("pt-BR");

  posts.forEach(post => {
    const user = findUser(post.authorId);
    const name = user?.name || "Usuário Anônimo";
    const avatar = user?.avatar || "images/user1.png";

    const card = document.createElement("div");
    card.className = "post-card";

    const header = `
      <div class="post-header">
        <img src="${avatar}" alt="Avatar">
        <div>
          <h2>${name}</h2>
          <span>${formatTime(post.createdAt)}</span>
        </div>
      </div>
    `;

    const body = `<p class="post-text">${post.content}</p>`;

    card.innerHTML = header + body;
    postsList.appendChild(card);
  });
}

// ==============================
// CRIAÇÃO DE POST
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.querySelector(".post-create textarea");
  const publishBtn = document.querySelector(".btn-publish");

  if (publishBtn) {
    publishBtn.addEventListener("click", () => {
      const content = textarea.value.trim();
      if (!content) return alert("Digite algo para publicar!");

      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) return alert("Nenhum usuário logado!");

      const post = {
        id: Date.now(),
        authorId: currentUser.id || currentUser._id,
        createdAt: new Date().toISOString(),
        content: content
      };

      const posts = JSON.parse(localStorage.getItem("posts") || "[]");
      posts.unshift(post);

      localStorage.setItem("posts", JSON.stringify(posts));

      textarea.value = "";
      renderFeed(); // atualiza sem recarregar
    });
  }
});
