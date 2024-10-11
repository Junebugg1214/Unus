# Use Node.js as the base image to build the frontend
FROM node:14 as build

# Set working directory for frontend
WORKDIR /app

# Copy package.json and package-lock.json files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend source code to the container
COPY frontend/ ./

# Build the production-ready static files
RUN npm run build

# Use Nginx to serve the frontend
FROM nginx:alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy a custom Nginx configuration file for routing and handling front-back communication
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend static files from the previous step
COPY --from=build /app/build /usr/share/nginx/html

# Copy other static files (manifest, icons, etc.)
COPY frontend/public/favicon.ico /usr/share/nginx/html
COPY frontend/public/logo192.png /usr/share/nginx/html
COPY frontend/public/manifest.json /usr/share/nginx/html
COPY frontend/public/styles.css /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80