async function carregarPosts() {
  try {
    const response = await fetch("data/posts.json");
    const posts = await response.json();
    const container = document.getElementById("posts");

    posts.forEach((post) => {
      const card = document.createElement("div");
      card.classList.add("post-card");
      card.innerHTML = `
        <h3>${post.titulo}</h3>
        <p>${post.conteudo}</p>
        <span>Autor: ${post.autor}</span>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar posts:", error);
  }
}

carregarPosts();
