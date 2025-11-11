FROM oven/bun:1 AS build
WORKDIR /app
COPY . .
RUN bun install
RUN bun build src/index.ts --outdir dist --target=bun --external express --external mongodb

FROM oven/bun:1-slim
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json bun.lock ./
RUN bun install --frozen-lockfile --production

EXPOSE 3000
CMD ["bun", "run", "dist/index.js"]
