# Base image to build the backend and frontend
FROM python:3.9-slim-buster AS base

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create working directory for the backend
WORKDIR /app

# Copy Python requirements first for better caching
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend/ /app/

# Build stage for the frontend
FROM node:16-alpine AS frontend-build

WORKDIR /frontend

# Copy and install frontend dependencies
COPY frontend/package*.json ./
RUN npm install

# Build the frontend
COPY frontend/ ./
RUN npm run build

# Production stage - combine backend and frontend with Gunicorn
FROM python:3.9-slim-buster AS production

# Copy the backend code
COPY --from=base /app /app

# Install Gunicorn for serving the backend
RUN pip install gunicorn

# Copy the built frontend assets from the build stage
COPY --from=frontend-build /frontend/build /app/static

# Set the working directory to /app
WORKDIR /app

# Expose necessary ports
EXPOSE 5000

# Run Gunicorn server
CMD ["gunicorn", "--workers", "3", "--bind", "0.0.0.0:5000", "wsgi:app"]

