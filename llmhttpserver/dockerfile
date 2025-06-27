# Use a stable and slim Python image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Install required system packages
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy your application files into the container
COPY . .

# Expose both ports: HTTP (80) and gRPC-compatible (50051)
EXPOSE 80

# Start FastAPI with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
