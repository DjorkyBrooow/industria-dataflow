import csv
import random
import os
from datetime import datetime, timedelta

CSV = "/data/dataset.csv"

def generate_data(date: datetime):
    # ---- Température ----
    temperature = round(random.gauss(75, 10), 2)   # °C
    temperature = max(35, min(temperature, 110))

    # ---- Pression ----
    pressure = 1 + (temperature - 60) * 0.05 + random.uniform(-0.25, 0.25)
    pressure = max(0.3, min(pressure, 7))
    pressure = round(pressure, 2)

    # ---- Débit ----
    flow = pressure * random.uniform(5, 10) + random.uniform(-3, 3)
    flow = max(0, min(flow, 25))
    flow = round(flow, 2)

    # ---- Rendement ----

    # Accident si conditions extrêmes
    bad_cond = (
        temperature < 50 or
        temperature > 105 or
        pressure < 1 or
        pressure > 6 or
        flow < 3 or
        flow > 20
    )

    rare_random_accident = (random.random() < 0.03)   # ~0.3 fois/an

    if bad_cond or rare_random_accident:
        # Effondrement lié à une vrais mauvaise condition
        yield_est = random.uniform(5, 30)
    else:
        # Rendement normal, dépendance paramétrique
        temp_opt_dev = abs(temperature - 75) * 0.1
        pres_opt_dev = abs(pressure - 4) * 1.0
        flow_opt_dev = abs(flow - 12) * 0.25

        base = 98 - (temp_opt_dev + pres_opt_dev + flow_opt_dev)
        noise = random.uniform(-1, 2)
        yield_est = base + noise

    yield_est = round(max(0, min(yield_est, 100)), 2)

    timestamp = date.strftime("%Y-%m-%d")

    return [timestamp, temperature, pressure, flow, yield_est]

def collect_data(out = CSV):
    # Check existence of file
    try:
        open(out, "r")
    except FileNotFoundError:
        import os
        try:
            os.mkdir("/data")
        except OSError:
            pass

    # Open file in write mode
    with open(out, mode="w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp","temperature","pressure","flow","yield_est"])

        date=datetime(2000, 1, 1, 0, 0, 0)
        maintenant=datetime.now()
        while date < maintenant:
            data = generate_data(date)
            writer.writerow(data)
            f.flush() 
            # Generate new data every 30 days
            date += timedelta(days=30)
        print(f"File {out} successfully created")

if __name__ == "__main__":
    out = os.environ.get('OUTPUT_PATH','/data/dataset.csv')
    collect_data(out)