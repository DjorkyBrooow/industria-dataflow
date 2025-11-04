# train_model.py
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import pickle

CSV = '/data/dataset.csv'
OUT = './model.pkl'

def create_model():
    # Load dataset
    df = pd.read_csv(CSV)
    # Drop rows with NaN
    df = df.dropna()

    # Explanatory variables (X) and target variable (y)
    X = df[["temperature", "pressure", "flow"]]
    y = df["yield_est"]

    # Creation and training of the model
    X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.2,random_state=42)
    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X_train, y_train)

    # Evaluation of the model
    preds = model.predict(X_test)
    print('R2:', r2_score(y_test, preds))
    print('MSE:', mean_squared_error(y_test, preds))

    # Sauvegarde du modèle
    with open("./model.pkl", "wb") as f:
        pickle.dump(model, f)

    print(f"Model saved to {OUT}")

if __name__ == "__main__":
    create_model()

