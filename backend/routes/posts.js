document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("post-btn");
  const textarea = document.getElementById("post-content");

  btn.addEventListener("click", () => {
    const text = textarea.value.trim();
    if (!text) return alert("Escreva algo antes de publicar!");

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return alert("Nenhum usuário logado!");

    const newPost = {
      id: Date.now(),
      content: text,
      authorId: currentUser.id || currentUser._id,
      createdAt: new Date().toISOString()
    };

    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.unshift(newPost);

    localStorage.setItem("posts", JSON.stringify(posts));

    alert("Post publicado!");
    window.location.href = "feed.html";
  });
});
