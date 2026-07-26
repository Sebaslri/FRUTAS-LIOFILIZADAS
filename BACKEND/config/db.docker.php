<?php

declare(strict_types=1);

class Database
{
    private string $host;
    private string $port;
    private string $database;
    private string $username;
    private string $password;

    public function __construct()
    {
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->port = getenv('DB_PORT') ?: '3306';
        $this->database = getenv('DB_DATABASE') ?: 'db_frutas';
        $this->username = getenv('DB_USERNAME') ?: 'root';
        $this->password = getenv('DB_PASSWORD') ?: '';
    }

    public function getConnection(): PDO
    {
        $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->database};charset=utf8mb4";

        return new PDO($dsn, $this->username, $this->password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
}

function getConnection(): PDO
{
    return (new Database())->getConnection();
}
