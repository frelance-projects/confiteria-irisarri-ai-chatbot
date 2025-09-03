# Etapa de construcción
FROM node:22 AS build  

# Instalar PNPM sin Corepack
RUN npm install -g pnpm

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración y dependencias
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copiar el resto del código
COPY . .

# Etapa final
FROM node:22-alpine  

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache ffmpeg 

# Instalar PM2
RUN npm install -g pm2

# Copiar archivos de la etapa de build
COPY --from=build /app /app

# Exponer puerto
EXPOSE 3000

# Variable de entorno
ENV RUNNING_IN_DOCKER=true
ENV NODE_ENV=production
RUN ls -R /app/src
# Ejecutar aplicación
CMD ["pm2-runtime", "start", "src/index.js", "--cron", "0 3 * * *"]
