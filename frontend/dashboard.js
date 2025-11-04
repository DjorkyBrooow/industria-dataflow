const API = (window.location.hostname.includes('localhost') ? 'http://localhost:8000' : '') || '/';
async function fetchStats() {
    const res = await fetch('/stats');
    return res.json();
}


async function fetchAndDraw() {
    try {
        const stats = await fetch('/stats');
        const data = await stats.json();
        document.getElementById('chartTemp').remove();
        const c = document.createElement('canvas'); c.id = 'chartTemp'; c.width = 600; c.height = 200;
        document.body.appendChild(c);
        new Chart(c.getContext('2d'), {
            type: 'bar',
            data: { labels: ['temp', 'pressure', 'flow'], datasets: [{ label: 'mean', data: [data.temperature_mean, data.pressure_mean, data.flow_mean] }] }
        });
    } catch (e) {
        console.error(e);
    }
}


document.getElementById('refresh').addEventListener('click', fetchAndDraw);
window.onload = fetchAndDraw;