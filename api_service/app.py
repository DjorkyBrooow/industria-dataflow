from fastapi import FastAPI, HTTPException
import pandas as pd
import os
import joblib
import time


app = FastAPI()

CSV_PATH = os.environ.get('CSV_PATH', '/data/dataset.csv')

MODEL_PATH = os.environ.get("MODEL_PATH", "/data/model.pkl")
model = None

def load_model(max_retries=5, delay=2):
    global model
    retries = 0
    while retries < max_retries:
        if os.path.exists(MODEL_PATH):
            try:
                model = joblib.load(MODEL_PATH)
                print("✅ Model loaded")
                return
            except Exception as e:
                print("❌ Model load error:", e)
        else:
            print(f"Waiting for model.pkl... attempt {retries+1}")
        retries += 1
        time.sleep(delay)
    print("❌ Model not loaded after retries")

load_model()

@app.get("/stats")
def stats():
    try:
        df = pd.read_csv(CSV_PATH)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    if df.empty:
        return {"count": 0}
    return {
        "count": len(df),
        "temperature_mean": round(float(df['temperature'].mean()), 2),
        "pressure_mean": round(float(df['pressure'].mean()), 2),
        "flow_mean": round(float(df['flow'].mean()), 2),
    }

@app.post("/predict")
def predict(temperature: float, pressure: float, flow: float):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    X = pd.DataFrame([{
        "temperature": temperature,
        "pressure": pressure,
        "flow": flow,
    }])
    try:
        pred = model.predict(X)[0]
        return {"yield": float(pred)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {
        "status": "ok",
        "csv_found": os.path.exists(CSV_PATH),
        "model_found": os.path.exists(MODEL_PATH),
        "model_loaded": model is not None
    }
