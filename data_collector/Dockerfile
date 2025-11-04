# Base image python
FROM python:3.10-slim
# Set working directory as /app in the container
WORKDIR /app
# Copy the data collector in the working directory
COPY data_collector.py ./data_collector
# Create non root user to reduce attack surface
RUN useradd -m appuser && chown -R appuser /app
# Use new user as default user
USER appuser
# # Declare /data as a persistant volume so the dataset can persist outside the container
VOLUME ["/data"]
# Define environment variable
ENV OUTPUT_PATH=/data/dataset.csv
# Execute the data_collector at the end of the configuration
CMD ["python","./data_collector/data_collector.py"]