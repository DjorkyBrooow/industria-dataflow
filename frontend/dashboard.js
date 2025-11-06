
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
async function getYearlyData() {
  try {
    const data = await getPastData();
    const timestamps = Object.values(data.timestamp);

    const temperature = Object.values(data.temperature);
    const pressure = Object.values(data.pressure);
    const flow = Object.values(data.flow);
    const yields = Object.values(data.yield_est);

    const dates = timestamps.map(timestamp => new Date(timestamp));
    const allYears = dates.map(date => date.getFullYear());

    let years = [];
    let totalYield = 0;
    let totalTemp = 0;
    let totalPress = 0;
    let totalFlow = 0;
    let nbValues = 0;
    let averageYields = [];
    let averageTemp = [];
    let averagePress = [];
    let averageFlow = [];

    allYears.forEach((elem, index) => {
      if (!years.includes(elem)) {
        years.push(elem);

        if (nbValues > 0) {
          averageYields.push(totalYield / nbValues);
          averageTemp.push(totalTemp / nbValues);
          averagePress.push(totalPress / nbValues);
          averageFlow.push(totalFlow / nbValues);
        }

        totalYield = yields[index];
        totalTemp = temperature[index];
        totalPress = pressure[index];
        totalFlow = flow[index];
        nbValues = 1;
      } else {
        totalYield += yields[index];
        totalTemp += temperature[index];
        totalPress += pressure[index];
        totalFlow += flow[index];
        nbValues += 1;
      }
    });

    if (nbValues > 0) {
      averageYields.push(totalYield / nbValues);
      averageTemp.push(totalTemp / nbValues);
      averagePress.push(totalPress / nbValues);
      averageFlow.push(totalFlow / nbValues);
    }

    const dict = { "years": years, "temperature": averageTemp, "pressure": averagePress, "flow": averageFlow, "yields": averageYields };
    return dict;
  } catch (error) {
    console.error("⚠️ Erreur :", error);
    alert("Erreur lors du chargement des données depuis l’API !");
  }
}

// ------------------------------
//  Initialisation du graphique
// ------------------------------
async function initChart() {
  const ctx = document.getElementById("evolutionChart").getContext("2d");
  const chartData = await getYearlyData();

  // Couleurs des points selon leur valeur
  const pointColors = chartData.yields.map(v =>
    v < 70 ? "red" : v > 90 ? "green" : "#0052a5"
  );

  const evolutionChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.years,
      datasets: [
        {
          label: "Rendement (%)",
          data: chartData.yields,
          borderColor: "#0052a5",
          backgroundColor: "rgba(0,82,165,0.1)",
          borderWidth: 1.5,       // ligne principale plus fine
          tension: 0.3,
          fill: true,
          pointRadius: 7,         // points légèrement plus gros
          pointHoverRadius: 9,
          pointBackgroundColor: pointColors
        },
        // Ligne seuil bas 70%
        {
          label: "Seuil 70%",
          data: Array(chartData.yields.length).fill(70),
          borderColor: "orange",
          borderWidth: 2,
          borderDash: [6, 6],
          pointRadius: 0
        },
        // Ligne seuil haut 90%
        {
          label: "Seuil 90%",
          data: Array(chartData.yields.length).fill(90),
          borderColor: "green",
          borderWidth: 2,
          borderDash: [6, 6],
          pointRadius: 0
        }
      ]
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

  evolutionChart.update();
};

window.onload = async function () {
  await initChart();
  await updateDashboard();
};


// ------------------------------
//  Mise à jour du tableau de bord (simulation)
// ------------------------------

function getPastAndCurrentAverages(data) {
  const { years, temperature, pressure, flow, yields } = data;

  if (!years || !yields || years.length !== yields.length) {
    console.error("❌ Données invalides !");
    return null;
  }

  const currentYear = new Date().getFullYear();

  let pastValues = [];
  let currentYield = null;
  let currentTemp = null;
  let currentPress = null;
  let currentFlow = null;

  years.forEach((year, index) => {
    if (year === currentYear) {
      currentYield = yields[index];
      currentTemp = temperature[index];
      currentPress = pressure[index];
      currentFlow = flow[index];
    } else {
      pastValues.push(yields[index]);
    }
  });

  // moyenne des années passées
  const pastAvg = pastValues.length
    ? pastValues.reduce((a, b) => a + b, 0) / pastValues.length
    : null;

  return { pastAvg, currentTemp, currentPress, currentFlow, currentYield };
}

async function updateDashboard() {
  try {
    const yearlyData = await getYearlyData();
    const { pastAvg, currentTemp, currentPress, currentFlow, currentYield } = getPastAndCurrentAverages(yearlyData);

    // Mise à jour des disques
    document.getElementById("pastValue").textContent =
      pastAvg !== null ? pastAvg.toFixed(2) + "%" : "--%";

    document.getElementById("presentValue").textContent =
      currentYield !== null ? currentYield.toFixed(2) + "%" : "--%";

    const response = await fetch(ENDPOINT_API + "predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        temperature: currentTemp,
        pressure: currentPress,
        flow: currentFlow,
      })
    });
    const res = await response.json();

    document.getElementById("futureValue").textContent = res.yield.toFixed(2) + "%";

    // Animation douce des disques
    animateDisk("pastValue", past);
    animateDisk("presentValue", present);
    animateDisk("futureValue", future);
  } catch (error) {

  }
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
    element.textContent = currentValue.toFixed(2) + "%";
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

    document.getElementById("temp").textContent = result.temperature_mean + " °C";
    document.getElementById("press").textContent = result.pressure_mean + " kPa";
    document.getElementById("flow").textContent = result.flow_mean + " L/min";
    document.getElementById("yield").textContent = result.yield_mean + " L/min";

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
