
const ENDPOINT_API = "http://localhost:8000/";

// ------------------------------
//  Calcul de la moyenne
// ------------------------------
function calculateAverage(array) {
  const total = array.reduce((acc, val) => acc + val, 0);
  return total / array.length;
}

// ------------------------------
//  Simulation de données
// ------------------------------
async function getSimulatedData() {
  try {
    const data = await getPastData();

    const yields = Object.values(data.yield_est);
    const allYears = dates.map(date => date.getFullYear());

    let years = [];
    let totalYield = 0;
    let nbValues = 0;
    let averageYields = [];

    allYears.forEach((elem, index) => {
      if (!years.includes(elem)) {
        years.push(elem);

        if (nbValues > 0) {
          averageYields.push(totalYield / nbValues);
        }
        
        totalYield = yields[index]; 
        nbValues = 1;
      } else {
        totalYield += yields[index];
        nbValues += 1;
      }
    });

    if (nbValues > 0) {
      averageYields.push(totalYield / nbValues);
    }

    const dict = { "years": years, "yields": averageYields };
    return dict;
  } catch {
    console.error("⚠️ Erreur :", error);
    alert("Erreur lors du chargement des données depuis l’API !");
  }
}

// ------------------------------
//  Initialisation du graphique
// ------------------------------
async function initChart() {
  const ctx = document.getElementById("evolutionChart").getContext("2d");
  const chartData = await getSimulatedData();

  const evolutionChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.years,
      datasets: [{
        label: "Rendement (%)",
        data: chartData.yields,
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
  evolutionChart.data.datasets[0].data = chartData.yields;
  evolutionChart.update();
}

window.onload = async function () {
  await initChart();
};


// ------------------------------
//  Mise à jour du tableau de bord (simulation)
// ------------------------------
function updateDashboard(past, present, future) {
  // Mise à jour des disques
  document.getElementById("pastValue").textContent = past + "%";
  document.getElementById("presentValue").textContent = present + "%";
  document.getElementById("futureValue").textContent = future + "%";

  // Animation douce des disques
  animateDisk("pastValue", past);
  animateDisk("presentValue", present);
  animateDisk("futureValue", future);
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
//  Connexion à l’API FastAPI (données moyennes)
// ------------------------------

async function getData() {
  const btn = document.getElementById("loadButton");
  btn.disabled = true;
  btn.textContent = "⏳ Chargement...";

  try {
    const response = await fetch(ENDPOINT_API + "stats");
    if (!response.ok) throw new Error(`Erreur API (${response.status})`);

    const result = await response.json();

    document.getElementById("temp").textContent = result.temperature_mean.toFixed(1) + " °C";
    document.getElementById("press").textContent = result.pressure_mean.toFixed(1) + " kPa";
    document.getElementById("flow").textContent = result.flow_mean.toFixed(1) + " L/min";

    const response2 = await fetch(ENDPOINT_API + "predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        temperature: result.temperature_mean.toFixed(1),
        pressure: result.pressure_mean.toFixed(1),
        flow: result.flow_mean.toFixed(1),
      })
    });

    const prediction = await response2.json();

    document.getElementById("rendement").textContent = prediction.yield.toFixed(1) + " %";

  } catch (error) {
    console.error("⚠️ Erreur :", error);
    alert("Erreur lors du chargement des données depuis l’API !");
  } finally {
    btn.textContent = "🔄 Charger les données réelles";
    btn.disabled = false;
  }
}

// ------------------------------
//  Connexion à l’API FastAPI (données totales)
// ------------------------------
async function getPastData() {
  try {
    const response = await fetch(ENDPOINT_API + "past_data");
    if (!response.ok) throw new Error(`Erreur API (${response.status})`);

    const result = await response.json();
    const data = JSON.parse(result);

    return data;
  } catch (error) {
    console.error("⚠️ Erreur :", error);
    alert("Erreur lors du chargement des données depuis l’API !");
  }
}
