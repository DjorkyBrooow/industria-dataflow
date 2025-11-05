// ------------------------------
//  Simulation de données
// ------------------------------
function getSimulatedData() {
  const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const values = years.map(() => 60 + Math.random() * 40);
  return { years, values };
}

// ------------------------------
//  Initialisation du graphique
// ------------------------------
const ctx = document.getElementById("evolutionChart").getContext("2d");
let chartData = getSimulatedData();

const evolutionChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: chartData.years,
    datasets: [{
      label: "Rendement (%)",
      data: chartData.values,
      borderColor: "#0052a5",
      backgroundColor: "rgba(0,82,165,0.1)",
      borderWidth: 3,
      tension: 0.3,
      fill: true,
      pointRadius: 5,
      pointHoverRadius: 7
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: "Année" },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: "Rendement (%)" }
      }
    },
    plugins: {
      legend: { display: true, labels: { color: "#222" } }
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart"
    }
  }
});

// ------------------------------
//  Mise à jour du tableau de bord (simulation)
// ------------------------------
function updateDashboard() {
  const past = (70 + Math.random() * 10).toFixed(1);
  const present = (80 + Math.random() * 10).toFixed(1);
  const future = (85 + Math.random() * 10).toFixed(1);

  // Mise à jour des disques
  document.getElementById("pastValue").textContent = past + "%";
  document.getElementById("presentValue").textContent = present + "%";
  document.getElementById("futureValue").textContent = future + "%";
  document.getElementById("rendement").textContent = present + " %";

  // Capteurs simulés
  const temp = (70 + Math.random() * 15).toFixed(1);
  const press = (90 + Math.random() * 15).toFixed(1);
  const flow = (12 + Math.random() * 3).toFixed(1);

  document.getElementById("temp").textContent = temp + " °C";
  document.getElementById("press").textContent = press + " kPa";
  document.getElementById("flow").textContent = flow + " L/min";

  // Animation douce des disques
  animateDisk("pastValue", past);
  animateDisk("presentValue", present);
  animateDisk("futureValue", future);

  // Mise à jour du graphique
  chartData = getSimulatedData();
  evolutionChart.data.datasets[0].data = chartData.values;
  evolutionChart.update();
}

// ------------------------------
//  Animation des disques
// ------------------------------
function animateDisk(id, newValue) {
  const element = document.getElementById(id);
  let currentValue = parseFloat(element.textContent) || 0;
  const target = parseFloat(newValue);
  const step = (target - currentValue) / 20;

  let frame = 0;
  const interval = setInterval(() => {
    currentValue += step;
    element.textContent = currentValue.toFixed(1) + "%";
    if (++frame >= 20) clearInterval(interval);
  }, 50);
}

// ------------------------------
//  Démarrage automatique (simulation)
// ------------------------------
updateDashboard();
setInterval(updateDashboard, 5000);

// ------------------------------
//  Connexion à l’API FastAPI (vraies données)
// ------------------------------
const ENDPOINT_API = "http://localhost:8000/";

async function getData() {
  const btn = document.getElementById("loadButton");
  btn.disabled = true;
  btn.textContent = "⏳ Chargement...";

  try {
    const response = await fetch(ENDPOINT_API + "stats");
    if (!response.ok) throw new Error(`Erreur API (${response.status})`);

    const result = await response.json();
    console.log("✅ Données reçues :", result);

    // Supposons que ton API renvoie { temperature, pressure, flow, yield }
    document.getElementById("temp").textContent = result.temperature.toFixed(1) + " °C";
    document.getElementById("press").textContent = result.pressure.toFixed(1) + " kPa";
    document.getElementById("flow").textContent = result.flow.toFixed(1) + " L/min";
    document.getElementById("rendement").textContent = result.yield.toFixed(1) + " %";

    alert("✅ Données réelles chargées avec succès !");
  } catch (error) {
    console.error("⚠️ Erreur :", error);
    alert("Erreur lors du chargement des données depuis l’API !");
  } finally {
    btn.textContent = "🔄 Charger les données réelles";
    btn.disabled = false;
  }
}
