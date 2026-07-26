FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# La imagen usa una ruta relativa para comunicarse con el proxy de Nginx.
# Este cambio ocurre dentro de la imagen y no modifica el código local.
RUN sed -i 's#http://localhost/api-frutas/#/api-frutas/#g' src/app/environments/environment.ts \
    && npm run build -- --configuration development

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frutas-app/browser /usr/share/nginx/html

EXPOSE 80
