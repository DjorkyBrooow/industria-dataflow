from fastapi import FastAPI, HTTPException
import pandas as pd
import os
import requests


app = FastAPI()
CSV_PATH = os.environ.get('CSV_PATH','/data/dataset.csv')
MODEL_URL = os.environ.get('MODEL_URL','http://model_service:8001/predict')


@app.get('/stats')
def stats():
    try:
        df = pd.read_csv(CSV_PATH)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    if df.empty:
        return {"count":0}
    return {
        "count": len(df),
        "temperature_mean": round(float(df['temperature'].mean()), 2),
        "pressure_mean": round(float(df['pressure'].mean()), 2),
        "flow_mean": round(float(df['flow'].mean()), 2),
    }


@app.post('/predict')
def predict(temperature: float, pressure: float, flow: float):
    try:
        r = requests.post(MODEL_URL, json={"temperature": temperature, "pressure": pressure, "flow": flow}, timeout=5)
    except requests.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Model service unreachable: {e}")
    if r.status_code != 200:
        raise HTTPException(status_code=502, detail="Model error")
    return r.json()


@app.get('/health')
def health():
    return {"status":"ok"}