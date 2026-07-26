FROM php:8.2-apache

RUN docker-php-ext-install pdo_mysql

WORKDIR /var/www/html/api-frutas
COPY . .
RUN cp config/db.docker.php config/db.php

EXPOSE 80
