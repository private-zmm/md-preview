FROM node:22-bookworm-slim AS web-build

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY src ./src
COPY vite.web.config.js ./vite.web.config.js
RUN npm run build:web

FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends postgresql-client ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY server ./server
COPY --from=web-build /app/dist-web ./dist-web

ENV NODE_ENV=production
EXPOSE 8787

CMD ["node", "server/index.js"]
