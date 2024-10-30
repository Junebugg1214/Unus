# Base image for backend setup
FROM python:3.9-slim-bullseye AS base

# Install build essentials and utilities
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential curl git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Set up Python virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
COPY backend/requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip uninstall -y pywin32 || true

# Copy backend source code
COPY backend/ /app/

# Build stage for frontend
FROM node:18-alpine AS frontend-build

WORKDIR /frontend

# Install frontend dependencies and build
COPY frontend/package*.json ./
RUN npm install --no-audit
COPY frontend/ ./
RUN npm run build

# Production stage with Gunicorn and combined backend and frontend
FROM python:3.9-slim-bullseye AS production

RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*

# Activate virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy dependencies and app files
COPY --from=base /opt/venv /opt/venv
COPY --from=base /app /app
COPY --from=frontend-build /frontend/build /app/static

WORKDIR /app

# Configure runtime environment
ENV FLASK_ENV=production \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080

# Create necessary directories and set permissions
RUN mkdir -p /app/uploads /app/cloned_agents /app/instance && \
    chmod -R 755 /app && \
    chmod -R 777 /app/uploads /app/cloned_agents /app/instance

# Install Gunicorn
RUN pip install --no-cache-dir gunicorn

EXPOSE ${PORT}

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Run Gunicorn server
CMD ["gunicorn", "--workers=3", "--worker-class=sync", "--worker-tmp-dir=/dev/shm", "--bind=0.0.0.0:${PORT}", "--log-level=info", "--access-logfile=-", "--error-logfile=-", "--timeout=60", "wsgi:app"]


