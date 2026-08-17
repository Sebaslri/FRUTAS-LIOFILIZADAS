FROM php:8.2-apache

# Instalar extensiones necesarias para MySQL/PDO
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Copiar todo el backend PHP al servidor Apache
COPY . /var/www/html/

# Puerto HTTP
EXPOSE 80

# Iniciar Apache
CMD ["apache2-foreground"]