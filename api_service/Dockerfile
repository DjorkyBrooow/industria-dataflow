# Base image python
FROM python:3.10-slim
# Set the working directory as /app
WORKDIR /app
# Copy the needed files in the working directory
COPY app.py .
COPY requirements.txt .
# Install the needed dependencies
RUN pip install --no-cache-dir -r requirements.txt
# Create non root user to reduce attack surface
RUN useradd -m appuser && chown -R appuser /app
# Use new user as default user
USER appuser
# Create persistent volume
VOLUME ["/data"]
# Expose to the port 8000
EXPOSE 8000
# Run the server
CMD ["uvicorn","app:app","--host","0.0.0.0","--port","8000"]