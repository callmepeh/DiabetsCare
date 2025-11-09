// feed.js

const postsList = document.getElementById("posts-list");

// Carregar posts do localStorage
let posts = JSON.parse(localStorage.getItem("posts")) || [];

// Ordena do mais novo para o mais antigo
posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

// Renderizar posts
function carregarFeed() {

    if (posts.length === 0) {
        postsList.innerHTML = `<p>Nenhum post encontrado.</p>`;
        return;
    }

    postsList.innerHTML = ""; // Limpa a lista

    posts.forEach(post => {
        const card = document.createElement("div");
        card.classList.add("post-card");

        card.innerHTML = `
            <h3>${post.titulo}</h3>
            <small>Por <strong>${post.autorNome}</strong> — ${new Date(post.timestamp).toLocaleString()}</small>
            <p>${post.conteudo.substring(0, 200)}...</p>

            <button class="btn-abrir" onclick="abrirPost(${post.id})">Ler artigo completo</button>
        `;

        postsList.appendChild(card);
    });
}

function abrirPost(id) {
    localStorage.setItem("postAtual", id);
    window.location.href = "postView.html";
}

// Inicializa o feed
carregarFeed();
