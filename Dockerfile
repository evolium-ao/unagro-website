# ─── Stage 1: Build

FROM node:22.22.3-alpine AS builder

ARG NODE_OPTIONS
ENV NODE_OPTIONS=$NODE_OPTIONS

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# ─── Stage 2: Runtime
FROM node:22-alpine AS runtime

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the entire dist folder from builder
COPY --from=builder /app/dist /app/dist

RUN chown -R appuser:appgroup /app

USER appuser

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT}/ || exit 1

# Start the server - use absolute path
CMD ["node", "/app/dist/web-site-unagro/server/server.mjs"]


