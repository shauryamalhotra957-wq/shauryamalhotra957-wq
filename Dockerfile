FROM node:24-slim
WORKDIR /app
COPY . .
CMD ["node", "scripts/benchmark_portfolio.mjs"]
