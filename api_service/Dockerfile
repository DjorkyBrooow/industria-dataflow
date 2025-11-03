# Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Copier les fichiers nécessaires
COPY app.py requirements.txt ./

# Installer les dépendances
RUN pip install -r requirements.txt

# Exposer le port Flask
EXPOSE 5000

# Lancer l'application
CMD ["python3", "app.py"]
