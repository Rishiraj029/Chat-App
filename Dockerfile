FROM oven/bun:latest

WORKDIR /app

# ---------- Build frontend ----------
WORKDIR /app/web
COPY web/package.json web/bun.lock* ./
RUN bun install --frozen-lockfile

COPY web/ ./

ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY


ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN bun run build


# ---------- Setup backend ----------
WORKDIR /app/backend
COPY backend/package.json backend/bun.lock* ./
RUN bun install --frozen-lockfile

COPY backend/ ./


# ---------- Environment ----------
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000


# ---------- Start server ----------
CMD ["bun", "run", "start"]
