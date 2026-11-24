# ─── Stage 1: Build

FROM node:22.22.3-alpine AS builder

ARG NODE_OPTIONS
ENV NODE_OPTIONS=$NODE_OPTIONS
ARG GITHUB_PACKAGES_TOKEN

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN test -n "$GITHUB_PACKAGES_TOKEN" || (echo "ERRO: GITHUB_PACKAGES_TOKEN vazio. No Coolify, defina-o em Environment Variables com 'Build Variable' activo (sem aspas/espacos)." && exit 1)
RUN npm ci

COPY . .

RUN npm run build

# ─── Stage 2: Dependências de produção (o token fica só neste stage, descartado no final)
FROM node:22.22.3-alpine AS prod-deps

ARG GITHUB_PACKAGES_TOKEN

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN test -n "$GITHUB_PACKAGES_TOKEN" || (echo "ERRO: GITHUB_PACKAGES_TOKEN vazio. No Coolify, defina-o em Environment Variables com 'Build Variable' activo (sem aspas/espacos)." && exit 1)
RUN npm ci --omit=dev

# ─── Stage 3: Runtime
FROM node:22.22.3-alpine AS runtime

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package.json package-lock.json ./
COPY --from=prod-deps /app/node_modules /app/node_modules

# Copy the entire dist folder from builder
COPY --from=builder /app/dist /app/dist

RUN chown -R appuser:appgroup /app

USER appuser

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

# Start the server - use absolute path
CMD ["node", "/app/dist/web-site-unagro/server/server.mjs"]


