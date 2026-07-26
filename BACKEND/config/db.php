<?php

declare(strict_types=1);

class Database
{
    private string $host = 'localhost';
    private string $database = 'db_frutas';
    private string $username = 'root';
    private string $password = '';

    public function getConnection(): PDO
    {
        $dsn = "mysql:host={$this->host};dbname={$this->database};charset=utf8mb4";

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

