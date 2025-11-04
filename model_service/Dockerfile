# Base image python
FROM python:3.10-slim
# Set the working directory as /app
WORKDIR /app
# Copy the needed files in the working directory
COPY train_model.py .
COPY requirements.txt .
# Install the needed dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Volume contenant dataset.csv
ENV CSV_PATH=/data/dataset.csv
ENV MODEL_PATH=/data/model.pkl

CMD ["python", "train_model.py"]
