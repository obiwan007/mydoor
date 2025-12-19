# Backend (NestJS) Dockerfile

FROM node:24-alpine AS build
WORKDIR /workspace

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy workspace and build backend
COPY . .
RUN npx nx build nestjs-mydoor

# Runtime image
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Use generated minimal package.json and lockfile from dist for runtime deps
COPY --from=build /workspace/dist/apps/nestjs-mydoor/package.json ./
COPY --from=build /workspace/dist/apps/nestjs-mydoor/package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled app
COPY --from=build /workspace/dist/apps/nestjs-mydoor ./

EXPOSE 3000
CMD ["node", "main.js"]
