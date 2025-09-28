const postsList = document.getElementById('postsList');

fetch('data/posts.json')
  .then(res => res.json())
  .then(posts => {
    posts.forEach(post => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h3>${post.titulo}</h3>
        <p>${post.conteudo}</p>
        <small>Autor: ${post.autor} | ${post.data}</small>
      `;
      postsList.appendChild(div);
    });
  })
  .catch(err => console.error('Erro ao carregar posts:', err));
