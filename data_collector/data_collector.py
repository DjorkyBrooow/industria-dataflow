import csv
import random
import os
from datetime import datetime, timedelta

CSV = "/data/dataset.csv"

def generate_data(date: datetime):
    # Random realistic generation
    temperature = round(random.uniform(45, 95), 2)  # en °C
    pressure = round(1 + (temperature - 60) * 0.05 + random.uniform(-0.3, 0.3), 2)  # en bar
    flow = round(random.uniform(10, 20), 2)  # en L/s
    yield_est = round(95 - abs((temperature - 75)) * 0.3 - random.uniform(0, 2), 2)  # en %
    timestamp = date.strftime("%Y-%m-%dT%H:%M:%S")

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