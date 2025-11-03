from flask import Flask, jsonify, request
import pandas as pd
import requests
import os

app = Flask(__name__)

# Récupère l'URL du service modèle IA
MODEL_URL = os.getenv("MODEL_URL", "http://model_service:8000")
DATA_PATH = "./data_collector/dataset.csv"  # volume partagé entre les conteneurs


@app.route("/")
def home():
    return jsonify({"message": "Bienvenue sur l’API centrale Industria 🚀"})


@app.route("/stats", methods=["GET"])
def get_stats():
    """Retourne les statistiques moyennes issues du dataset"""
    try:
        df = pd.read_csv(DATA_PATH)
        stats = {
            "temperature_moyenne": round(df["temperature"].mean(), 2),
            "pression_moyenne": round(df["pression"].mean(), 2),
            "debit_moyen": round(df["debit"].mean(), 2),
            "rendement_moyen": round(df["rendement"].mean(), 2)
        }
        return jsonify({"status": "OK", "indicateurs": stats})
    except FileNotFoundError:
        return jsonify({"error": "Le fichier dataset.csv est introuvable."}), 404
    except Exception as e:
        return jsonify({"error": f"Erreur lors du calcul des statistiques : {str(e)}"}), 500


@app.route("/predict", methods=["POST"])
def predict():
    """Appelle le service IA pour prédire le rendement"""
    try:
        data = request.get_json()
        response = requests.post(f"{MODEL_URL}/predict", json=data)
        if response.status_code == 200:
            return jsonify({
                "status": "OK",
                "entrée": data,
                "sortie": response.json()
            })
        else:
            return jsonify({"error": f"Erreur du modèle IA : {response.text}"}), 502
    except requests.exceptions.ConnectionError:
        return jsonify({"error": "Impossible de contacter le service IA."}), 503
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)


