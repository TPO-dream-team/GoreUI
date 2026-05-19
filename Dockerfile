# Stage 1: Build the application
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Injects the API base URL from build arguments
ARG VITE_AUTH_API_BASEURL=http://localhost:5148
ENV VITE_AUTH_API_BASEURL=$VITE_AUTH_API_BASEURL

# Build the app (Vite outputs to the /dist folder by default)
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]