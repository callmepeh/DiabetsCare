// frontend/js/glicemia.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".formulario-glicemia");
  const sliders = document.querySelectorAll(".controle-deslizante");

  // Atualiza o número e status conforme o usuário move o slider
  sliders.forEach((slider) => {
    const valorDisplay = slider.parentElement.querySelector(".valor-controle");
    const indicadorStatus = slider.parentElement.nextElementSibling;

    slider.addEventListener("input", () => {
      const valor = slider.value;
      valorDisplay.textContent = valor;

      // Atualiza o status de acordo com o valor
      if (valor < 70) {
        indicadorStatus.textContent = "Baixa";
        indicadorStatus.className = "indicador-status status-baixa";
      } else if (valor <= 140) {
        indicadorStatus.textContent = "Normal";
        indicadorStatus.className = "indicador-status status-normal";
      } else {
        indicadorStatus.textContent = "Alta";
        indicadorStatus.className = "indicador-status status-alta";
      }
    });
  });

  // Quando o formulário for enviado
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Captura os valores do formulário
    const glicemiaJejum = document.getElementById("glicemia-jejum").value;
    const glicemiaPosPrandial = document.getElementById("glicemia-pos-prandial").value;
    const glicemiaAntesDormir = document.getElementById("glicemia-antes-dormir").value;
    const observacoes = document.getElementById("campo-observacoes").value;

    // Pega o usuário logado
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
      alert("Nenhum usuário logado encontrado! Faça login novamente.");
      window.location.href = "login.html";
      return;
    }

    // Cria um registro de glicemia
    const registro = {
      usuario: usuarioLogado.email, // ou .id, conforme seu login salva
      dataHora: new Date().toLocaleString(),
      glicemiaJejum,
      glicemiaPosPrandial,
      glicemiaAntesDormir,
      observacoes,
    };

    // Recupera registros existentes
    const registros = JSON.parse(localStorage.getItem("glicemias")) || [];

    // Adiciona novo registro
    registros.push(registro);

    // Salva de volta
    localStorage.setItem("glicemias", JSON.stringify(registros));

    alert("Registro de glicemia salvo com sucesso!");
    form.reset();
  });
});
