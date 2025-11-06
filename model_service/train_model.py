# train_model.py
import time
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import pickle

CSV = '/data/dataset.csv'
OUT = '/data/model.pkl'

def create_model():

    # Load dataset
    df = pd.read_csv(CSV)
    df = df.dropna()

    # Explanatory variables (X) and target variable (y)
    X = df[["temperature", "pressure", "flow"]]
    y = df["yield_est"]

    # Model creation & training
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42
    )

    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X_train, y_train)

    # Evaluation
    preds = model.predict(X_test)
    print('R2:', r2_score(y_test, preds))
    print('MSE:', mean_squared_error(y_test, preds))

    # Save model
    with open(OUT, "wb") as f:
        pickle.dump(model, f)

    print(f"Model saved to {OUT}")

if __name__ == "__main__":
    while True:
        create_model()
        time.sleep(300)
