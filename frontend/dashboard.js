async function loadStats() {
  const resultDiv = document.getElementById("result");

  try {
    const res = await fetch("http://localhost:8000/stats");
    if (!res.ok) {
      throw new Error("Erreur HTTP " + res.status);
    }

    const data = await res.json();
    resultDiv.textContent = JSON.stringify(data, null, 2);

  } catch (e) {
    resultDiv.textContent = "❌ Erreur : " + e.message;
  }
}

loadStats();
