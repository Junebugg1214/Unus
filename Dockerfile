# Base image to build the backend and frontend
FROM python:3.9-slim-buster AS base

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Create working directory for the backend
WORKDIR /app

# Create and activate virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy Python requirements first for better caching
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt && \
    pip uninstall -y pywin32 || true

# Copy the backend code
COPY backend/ /app/

# Build stage for the frontend
FROM node:16-alpine AS frontend-build

WORKDIR /frontend

# Copy package files first for better caching
COPY frontend/package*.json ./

# Install dependencies with specific npm config for better security
RUN npm set progress=false && \
    npm config set fund false && \
    npm install --no-audit

# Copy frontend source code
COPY frontend/ ./

# Build the frontend with production optimization
RUN npm run build

# Production stage - combine backend and frontend with Gunicorn
FROM python:3.9-slim-buster AS production

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# Create and activate virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy virtual environment and backend from base stage
COPY --from=base /opt/venv /opt/venv
COPY --from=base /app /app

# Copy the built frontend assets from the build stage
COPY --from=frontend-build /frontend/build /app/static

# Set the working directory to /app
WORKDIR /app

# Create required directories
RUN mkdir -p /app/uploads /app/cloned_agents /app/instance

# Set production environment variables
ENV FLASK_ENV=production \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Install Gunicorn
RUN pip install gunicorn

# Set permissions for app directories
RUN chmod -R 755 /app && \
    chmod -R 777 /app/uploads /app/cloned_agents /app/instance

# Default port for DigitalOcean App Platform
ENV PORT=8080

# Expose the port
EXPOSE ${PORT}

# Start Gunicorn
CMD ["gunicorn", "--workers=3", "--worker-class=sync", "--worker-tmp-dir=/dev/shm", "--bind=0.0.0.0:${PORT}", "--log-level=info", "--access-logfile=-", "--error-logfile=-", "wsgi:app"]


