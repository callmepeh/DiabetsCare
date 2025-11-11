document.addEventListener('DOMContentLoaded', () => {
  const postsSection = document.querySelector('.posts-list');

  // 🔒 Recupera usuário logado
  let usuarioLogado;
  try {
    usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado || !usuarioLogado.nome) {
      alert("Você precisa estar logado para acessar o feed.");
      window.location.href = "login.html";
      return;
    }
  } catch (erro) {
    console.error("Erro ao recuperar usuário logado:", erro);
    alert("Erro ao carregar dados do usuário. Faça login novamente.");
    window.location.href = "login.html";
    return;
  }

  // 🧩 Recupera posts do localStorage com segurança
  let posts = [];
  try {
    posts = JSON.parse(localStorage.getItem('posts')) || [];
  } catch (erro) {
    console.error("Erro ao carregar posts:", erro);
    localStorage.removeItem('posts'); // limpa se corrompido
    posts = [];
  }

  // Se não há posts, cria alguns exemplos
  if (posts.length === 0) {
    posts = [
      {
        id: 1,
        nome: 'Maria Silva',
        usuario: '@maria',
        data: 'Há 2 horas',
        conteudo: 'Hoje consegui manter minha glicemia estável após a caminhada matinal!',
        curtidas: 0,
        comentarios: []
      },
      {
        id: 2,
        nome: 'João Pedro',
        usuario: '@joao',
        data: 'Ontem',
        conteudo: 'Alguém tem dicas para controlar a ansiedade e não exagerar na alimentação?',
        curtidas: 0,
        comentarios: []
      }
    ];
    localStorage.setItem('posts', JSON.stringify(posts));
  }

  mostrarPosts();

  
  function mostrarPosts() {
    postsSection.innerHTML = "";

    if (!posts || posts.length === 0) {
      postsSection.innerHTML = "<p class='sem-posts'>Nenhum post disponível ainda.</p>";
      return;
    }

    posts.forEach(post => {
      const div = document.createElement('div');
      div.classList.add('post-card');
      div.innerHTML = `
        <div class="post-header">
          <img src="img/user.png" alt="Avatar do usuário">
          <div>
            <h2>${post.nome}</h2>
            <span>${post.data}</span>
          </div>
        </div>

        <p class="post-text">${post.conteudo}</p>

        <div class="post-acoes">
          <button class="btn-curtir" data-id="${post.id}"> Curtir (${post.curtidas || 0})</button>
          <button class="btn-comentar" data-id="${post.id}"> Comentar</button>
        </div>

        <div class="comentarios">
          ${(post.comentarios || []).map(c => `
            <p><strong>${c.usuario}:</strong> ${c.texto}</p>
          `).join("")}
        </div>
      `;
      postsSection.appendChild(div);
    });

    document.querySelectorAll('.btn-curtir').forEach(btn => {
      btn.addEventListener('click', () => curtirPost(btn.dataset.id));
    });
    document.querySelectorAll('.btn-comentar').forEach(btn => {
      btn.addEventListener('click', () => comentarPost(btn.dataset.id));
    });
  }


  function curtirPost(id) {
    try {
      const post = posts.find(p => p.id == id);
      if (!post) throw new Error("Post não encontrado.");

      post.curtidas = (post.curtidas || 0) + 1;
      localStorage.setItem('posts', JSON.stringify(posts));
      mostrarPosts();
    } catch (erro) {
      console.error("Erro ao curtir post:", erro);
      alert("Não foi possível curtir o post. Tente novamente.");
    }
  }

  
  function comentarPost(id) {
    const texto = prompt("Digite seu comentário:");
    if (!texto || texto.trim() === "") return;

    try {
      const post = posts.find(p => p.id == id);
      if (!post) throw new Error("Post não encontrado.");

      if (!post.comentarios) post.comentarios = [];
      post.comentarios.push({ 
        usuario: usuarioLogado.nome, 
        texto: texto.trim() 
      });

      localStorage.setItem('posts', JSON.stringify(posts));
      mostrarPosts();
    } catch (erro) {
      console.error("Erro ao comentar:", erro);
      alert("Erro ao adicionar comentário. Tente novamente.");
    }
  }
});
