/**
 * feed.js
 * 
 * Script para exibição e interação com posts no feed
 * Usa PostService para gerenciar posts
 */

document.addEventListener('DOMContentLoaded', () => {
  const postsSection = document.querySelector('.posts-list');
  const postCreateSection = document.querySelector('.post-create');
  const textareaPost = postCreateSection?.querySelector('textarea');
  const btnPublish = postCreateSection?.querySelector('.btn-publish');

  // Verifica se está logado
  if (!AuthService.estaLogado()) {
    alert("Você precisa estar logado para acessar o feed.");
    window.location.href = "login.html";
    return;
  }

    const usuario = AuthService.obterUsuario();
    if (!usuario) {
      alert("Erro ao carregar dados do usuário. Faça login novamente.");
      window.location.href = "login.html";
      return;
    }

    console.log('Usuário logado no feed:', usuario);

    // Atualiza saudação
    const feedHeader = document.querySelector('.feed-header h1');
    if (feedHeader && usuario.nome) {
      feedHeader.textContent = `Olá, ${usuario.nome}!`;
    }

    // Configura criação de posts
    if (btnPublish && textareaPost) {
      btnPublish.addEventListener('click', () => {
        const conteudo = textareaPost.value.trim();
        if (!conteudo) {
          alert("Por favor, escreva algo para publicar.");
          return;
        }

        try {
          PostService.criar({
            titulo: '', // Posts simples sem título
            conteudo: conteudo
          });

          textareaPost.value = '';
          alert("Post publicado com sucesso!");
          mostrarPosts();
        } catch (erro) {
          console.error("Erro ao criar post:", erro);
          alert("Erro ao publicar post. Tente novamente.");
        }
      });
    }

    mostrarPosts();

    function mostrarPosts() {
      if (!postsSection) return;

      const posts = PostService.obterTodos();

      postsSection.innerHTML = "";

      if (!posts || posts.length === 0) {
        postsSection.innerHTML = "<p class='sem-posts'>Nenhum post disponível ainda. Seja o primeiro a compartilhar!</p>";
        return;
      }

      posts.forEach(post => {
        const div = document.createElement('div');
        div.classList.add('post-card');
        
        // Formata data
        const dataPost = new Date(post.createdAt);
        const dataFormatada = formatarData(dataPost);

        div.innerHTML = `
          <div class="post-header">
            <img src="img/user.png" alt="Avatar do usuário">
            <div>
              <h2>${escapeHtml(post.authorName || 'Usuário')}</h2>
              <span>${dataFormatada}</span>
            </div>
          </div>

          ${post.title ? `<h3 class="post-title" style="cursor: pointer;" data-id="${post.id}">${escapeHtml(post.title)}</h3>` : ''}
          <div class="post-text" style="cursor: pointer;" data-id="${post.id}">${post.content || post.conteudo || ''}</div>

          <div class="post-acoes">
            <button class="btn-curtir" data-id="${post.id}">❤️ Curtir (${post.curtidas || 0})</button>
            <button class="btn-comentar" data-id="${post.id}">💬 Comentar</button>
            ${post.title ? `<button class="btn-ver-mais" data-id="${post.id}" style="background: #4c8bf5; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 13px;">Ver mais</button>` : ''}
          </div>

          <div class="comentarios" id="comentarios-${post.id}">
            ${renderizarComentarios(post.comentarios || [])}
          </div>
        `;
        postsSection.appendChild(div);
        
        // Adiciona evento de clique para ver detalhes do post
        if (post.title) {
          const titleEl = div.querySelector('.post-title');
          const textEl = div.querySelector('.post-text');
          const verMaisBtn = div.querySelector('.btn-ver-mais');
          
          const verDetalhes = () => {
            sessionStorage.setItem('postViewId', post.id);
            window.location.href = `postView.html?id=${post.id}`;
          };
          
          if (titleEl) titleEl.addEventListener('click', verDetalhes);
          if (textEl) textEl.addEventListener('click', verDetalhes);
          if (verMaisBtn) verMaisBtn.addEventListener('click', verDetalhes);
        }
      });

      // Adiciona event listeners
      document.querySelectorAll('.btn-curtir').forEach(btn => {
        btn.addEventListener('click', () => curtirPost(btn.dataset.id));
      });
      document.querySelectorAll('.btn-comentar').forEach(btn => {
        btn.addEventListener('click', () => comentarPost(btn.dataset.id));
      });
    }

    function curtirPost(id) {
      try {
        PostService.curtir(id);
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
        PostService.comentar(id, texto);
        mostrarPosts();
      } catch (erro) {
        console.error("Erro ao comentar:", erro);
        alert("Erro ao adicionar comentário. Tente novamente.");
      }
    }

    function renderizarComentarios(comentarios) {
      if (!comentarios || comentarios.length === 0) return '';
      
      return comentarios.map(c => `
        <div class="comentario">
          <strong>${escapeHtml(c.authorName || 'Usuário')}:</strong> 
          <span>${escapeHtml(c.texto || c.text || '')}</span>
        </div>
      `).join('');
    }

    function formatarData(data) {
      const agora = new Date();
      const diffMs = agora - data;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Agora';
      if (diffMins < 60) return `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
      if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
      if (diffDays < 7) return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
      
      return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
});
