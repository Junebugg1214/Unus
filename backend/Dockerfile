FROM python:3.9-slim-buster

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create necessary directories
RUN mkdir -p uploads cloned_agents

EXPOSE 5000

# Add wsgi.py if it doesn't exist
RUN echo "from app import app" > wsgi.py

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]

