import csv
import random
from datetime import datetime, timedelta

# Nom du fichier CSV
DATA_FILE = "./data_collector/dataset.csv"

# Fonction pour générer une ligne de données simulée
def generate_data(date: datetime):
    # Base réaliste pour un procédé industriel
    temperature = round(random.uniform(45, 95), 2)  # en °C
    pression = round(1 + (temperature - 60) * 0.05 + random.uniform(-0.3, 0.3), 2)  # en bar
    debit = round(random.uniform(10, 20), 2)  # en L/s
    rendement = round(95 - abs((temperature - 75)) * 0.3 - random.uniform(0, 2), 2)  # en %
    timestamp = date.strftime("%Y-%m-%dT%H:%M:%S")

    return [timestamp, temperature, pression, debit, rendement]


# Fonction principale
def collect_data():
    # Vérifie si le fichier CSV existe déjà
    try:
        open(DATA_FILE, "r")
    except FileNotFoundError:
        pass

    # Ouvre le fichier en mode ajout
    with open(DATA_FILE, mode="w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp","temperature","pression","debit","rendement"])

        date=datetime(2000, 1, 1, 0, 0, 0)
        maintenant=datetime.now()
        while date < maintenant:
            data = generate_data(date)
            writer.writerow(data)
            f.flush()  # force l'écriture sur le disque
            # Tous les 30 jours
            date += timedelta(days=30)


if __name__ == "__main__":
    collect_data()