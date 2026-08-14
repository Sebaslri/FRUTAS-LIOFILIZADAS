<?php

declare(strict_types=1);

class Database
{
    private string $host = 'sql309.infinityfree.com';
    private string $database = 'if0_42657101_db_frutas'; // ¡Revisa este nombre en tu cPanel!
    private string $username = 'if0_42657101';
    private string $password = 'xbBWV5AviMp6';

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

