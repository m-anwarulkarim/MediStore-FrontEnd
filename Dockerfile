# 1) deps
FROM oven/bun:latest AS deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# 2) build
FROM oven/bun:latest AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build

# 3) run
FROM oven/bun:latest AS runner
WORKDIR /app
ENV NODE_ENV=production

# next standalone দিলে সবচেয়ে ভালো (নিচে বলছি)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.* ./

EXPOSE 3000
CMD ["bun", "run", "start"]