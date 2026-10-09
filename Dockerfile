# -----------Etapa 1: build ------------
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ----------Etapa 2: produccion -----------
FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

# carpeta de fotos, propiedad del usuario node ( no root )
RUN mkdir -p uploads && chown node:node uploads
USER node

EXPOSE 4000
CMD ["node","dist/main.js"]