/**
 * glicemia.js
 * 
 * Script para registro de glicemia
 * - Torna os sliders interativos (atualiza número em tempo real)
 * - Salva registros no localStorage usando GlicemiaService
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".formulario-glicemia");
  const sliders = document.querySelectorAll(".controle-deslizante");

  if (!form) {
    console.error("Formulário de glicemia não encontrado.");
    return;
  }

  // Verifica se está logado
  if (!AuthService.estaLogado()) {
    alert("Você precisa estar logado para registrar glicemia.");
    window.location.href = "login.html";
    return;
  }

    // Atualiza o número e status conforme o usuário move o slider
    sliders.forEach((slider) => {
      const valorDisplay = slider.parentElement.querySelector(".valor-controle");
      const indicadorStatus = slider.parentElement.nextElementSibling;

      if (!valorDisplay || !indicadorStatus) return;

      // Atualiza inicialmente
      atualizarValorESstatus(slider, valorDisplay, indicadorStatus);

      // Atualiza em tempo real quando o usuário move o slider
      slider.addEventListener("input", () => {
        atualizarValorESstatus(slider, valorDisplay, indicadorStatus);
      });

      // Também atualiza quando o mouse passa sobre (para melhor UX)
      slider.addEventListener("mousemove", () => {
        atualizarValorESstatus(slider, valorDisplay, indicadorStatus);
      });
    });

    // Quando o formulário for enviado
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Captura os valores do formulário
      const glicemiaJejum = document.getElementById("glicemia-jejum").value;
      const glicemiaPosPrandial = document.getElementById("glicemia-pos-prandial").value;
      const glicemiaAntesDormir = document.getElementById("glicemia-antes-dormir").value;
      const observacoes = document.getElementById("campo-observacoes").value.trim();

      // Validação básica
      if (!glicemiaJejum || !glicemiaPosPrandial || !glicemiaAntesDormir) {
        alert("Por favor, preencha todos os valores de glicemia.");
        return;
      }

      try {
        // Cria registro usando GlicemiaService
        const registro = GlicemiaService.criar({
          glicemiaJejum,
          glicemiaPosPrandial,
          glicemiaAntesDormir,
          observacoes
        });

        alert("Registro de glicemia salvo com sucesso!");
        
        // Reseta o formulário
        form.reset();
        
        // Reseta os valores dos sliders e displays
        sliders.forEach((slider) => {
          const valorDisplay = slider.parentElement.querySelector(".valor-controle");
          const indicadorStatus = slider.parentElement.nextElementSibling;
          if (valorDisplay && indicadorStatus) {
            atualizarValorESstatus(slider, valorDisplay, indicadorStatus);
          }
        });

        // Opcional: redireciona para dashboard após salvar
        setTimeout(() => {
          if (confirm("Deseja ver seu dashboard?")) {
            window.location.href = "dashboard.html";
          }
        }, 500);
      } catch (erro) {
        console.error("Erro ao salvar registro:", erro);
        alert("Erro ao salvar registro. Tente novamente.");
      }
    });
});

/**
 * Atualiza o valor exibido e o status baseado no valor do slider
 * @param {HTMLInputElement} slider - Elemento input range
 * @param {HTMLElement} valorDisplay - Elemento que exibe o valor
 * @param {HTMLElement} indicadorStatus - Elemento que exibe o status
 */
function atualizarValorESstatus(slider, valorDisplay, indicadorStatus) {
  const valor = parseInt(slider.value);
  
  // Atualiza o número exibido (torna interativo)
  valorDisplay.textContent = valor;

  // Atualiza o status de acordo com o valor
  // Valores de referência:
  // - Baixa: < 70 mg/dL
  // - Normal: 70-140 mg/dL
  // - Alta: > 140 mg/dL
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
}
