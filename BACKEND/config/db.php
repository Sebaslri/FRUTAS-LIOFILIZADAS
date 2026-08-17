<?php

declare(strict_types=1);

class Database
{
    private string $host;
    private string $database;
    private string $username;
    private string $password;

    public function __construct()
    {
        $this->host = getenv('DB_HOST') ?: '';
        $this->database = getenv('DB_NAME') ?: '';
        $this->username = getenv('DB_USER') ?: '';
        $this->password = getenv('DB_PASSWORD') ?: '';
    }

    public function getConnection(): PDO
    {
        // TiDB Serverless requiere puerto 4000 y conexión segura (SSL)
        $dsn = "mysql:host={$this->host};port=4000;dbname={$this->database};charset=utf8mb4";

        return new PDO($dsn, $this->username, $this->password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            // Requerido por TiDB Serverless
            PDO::MYSQL_ATTR_SSL_CA => '/etc/ssl/certs/ca-certificates.crt',
            PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
        ]);
    }
}

function getConnection(): PDO
{
    return (new Database())->getConnection();
}

