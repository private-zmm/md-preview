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
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc -o /usr/share/keyrings/postgresql.asc \
  && echo "deb [signed-by=/usr/share/keyrings/postgresql.asc] https://apt.postgresql.org/pub/repos/apt bookworm-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
  && apt-get update \
  && apt-get install -y --no-install-recommends postgresql-client-16 tar \
  && pg_dump --version \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY server ./server
COPY --from=web-build /app/dist-web ./dist-web

ENV NODE_ENV=production
EXPOSE 8787

CMD ["node", "server/index.js"]
