# --------- Build Stage ---------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install

COPY . .

# Run tests before building
RUN npm test -- --run

RUN npm run build

# --------- Serve with Nginx ---------
FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist .

# 👇 ADD THIS LINE to copy your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

