# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código y buildear
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:1.25-alpine

# Borrar config default
RUN rm /etc/nginx/conf.d/default.conf

# Copiar config custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build Angular
COPY --from=build /app/dist/riu-challenge/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]