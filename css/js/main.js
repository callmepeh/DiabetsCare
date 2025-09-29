// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = JSON.parse(localStorage.getItem(username));
    if (user && user.password === password) {
      alert("Login realizado com sucesso!");
      window.location.href = "dashboard.html";
    } else {
      alert("Usuário ou senha inválidos.");
    }
  });
}

// CADASTRO
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;

    if (localStorage.getItem(username)) {
      alert("Usuário já existe!");
    } else {
      localStorage.setItem(username, JSON.stringify({ username, password }));
      alert("Cadastro realizado com sucesso!");
      window.location.href = "index.html";
    }
  });
}
