# train_model.py
import pandas as pd
from sklearn.linear_model import LinearRegression
import pickle

# Chargement du dataset
df = pd.read_csv("../data_collector/dataset.csv")

# Variables explicatives (X) et variable cible (y)
X = df[["temperature", "pression", "debit", "rendement"]]
y = df["rendement"]

# Création et entraînement du modèle
model = LinearRegression()
model.fit(X, y)

# Évaluation rapide
score = model.score(X, y)
print(f"[INFO] Modèle entraîné avec un R² = {score:.3f}")

# Sauvegarde du modèle
with open("./model.pkl", "wb") as f:
    pickle.dump(model, f)

print("[OK] Modèle sauvegardé sous 'model.pkl'")


