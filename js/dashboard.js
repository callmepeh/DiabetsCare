const glucoseForm = document.getElementById("glucoseForm");
const tableBody = document.getElementById("historyTable");
const ctx = document.getElementById("glucoseChart").getContext("2d");

let history = JSON.parse(localStorage.getItem("glucoseHistory")) || [];

function renderTable() {
  tableBody.innerHTML = "";
  history.forEach((entry) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.fasting}</td>
      <td>${entry.postMeal}</td>
      <td>${entry.note}</td>
    `;
    tableBody.appendChild(tr);
  });
}

function renderChart() {
  const labels = history.map((e) => e.date);
  const fastingData = history.map((e) => e.fasting);
  const postMealData = history.map((e) => e.postMeal);

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Jejum (mg/dL)",
          data: fastingData,
          borderColor: "#1a73e8",
          tension: 0.2,
          fill: false,
        },
        {
          label: "Pós-prandial (mg/dL)",
          data: postMealData,
          borderColor: "#f39c12",
          tension: 0.2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
    },
  });
}

if (glucoseForm) {
  glucoseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fasting = document.getElementById("fasting").value;
    const postMeal = document.getElementById("postMeal").value;
    const note = document.getElementById("note").value;

    const date = new Date().toLocaleDateString("pt-BR");
    history.push({ date, fasting, postMeal, note });
    localStorage.setItem("glucoseHistory", JSON.stringify(history));

    glucoseForm.reset();
    renderTable();
    renderChart();
  });

  renderTable();
  renderChart();
}

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  alert("Você saiu da conta!");
  localStorage.removeItem("currentUser");
});
