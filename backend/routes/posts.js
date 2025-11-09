// post.js

// Carrega usuário logado
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;
if (!usuarioLogado) {
    alert("Você precisa estar logado para criar um post.");
    window.location.href = "login.html";
}

// Referências dos elementos
const tituloInput = document.getElementById("titulo-post");
const editorInput = document.getElementById("conteudo-post");
const btnPublicar = document.getElementById("btn-publicar");

// Evento de publicação
btnPublicar.addEventListener("click", function () {
    const titulo = tituloInput.value.trim();
    const conteudo = editorInput.innerHTML.trim();

    if (titulo === "" || conteudo === "") {
        alert("Por favor, escreva um título e um conteúdo para o post.");
        return;
    }

    const novoPost = {
        id: Date.now(),
        autorId: usuarioLogado.id,
        autorNome: usuarioLogado.nome,
        titulo: titulo,
        conteudo: conteudo,
        timestamp: new Date().toISOString()
    };

    // Salvar no localStorage
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.push(novoPost);
    localStorage.setItem("posts", JSON.stringify(posts));

    alert("Post publicado com sucesso!");
    window.location.href = "feed.html";
});
