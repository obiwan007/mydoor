# Frontend (Angular) Dockerfile

FROM node:24-alpine AS build
WORKDIR /workspace

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy workspace and build frontend
COPY . .
RUN npx nx build angular-mydoor --configuration=production

# Runtime image serving via Nginx
FROM nginx:alpine AS runtime

# Nginx config for SPA and API proxy
COPY apps/angular-mydoor/docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files (Angular outputs to the browser/ subfolder)
COPY --from=build /workspace/dist/apps/angular-mydoor/browser/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
