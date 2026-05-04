# ── Build stage (install only production deps) ────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy manifests first to leverage Docker layer cache
COPY package*.json ./
RUN npm install --omit=dev

# ── Runtime stage ──────────────────────────────────────────
FROM node:18-alpine

WORKDIR /app

# Copy installed modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY . .

EXPOSE 5000

# Run as non-root user for security
USER node

CMD ["node", "server.js"]
