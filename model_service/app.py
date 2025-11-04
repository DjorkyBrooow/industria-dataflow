from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import os
import pandas as pd
import subprocess


MODEL_PATH = os.environ.get('MODEL_PATH','./model.pkl')
app = FastAPI()
model = None


class InputRow(BaseModel):
    temperature: float
    pressure: float
    flow: float


@app.post('/predict')
def predict(row: InputRow):
    if model is None:
        subprocess.run(["python3", "train_model.py"])
        def load_model():
            global model
            try:
                model = joblib.load(MODEL_PATH)
                print('Model loaded')
            except Exception as e:
                print('Model load error', e)
        load_model()
        if model is None :
            return {"error":"model not loaded"}
    X = pd.DataFrame([row.dict()])
    pred = model.predict(X)[0]
    return {"yield": float(pred)}


@app.get('/health')
def health():
    return {
        "status":"ok",
        "model_loaded": model is not None
    }