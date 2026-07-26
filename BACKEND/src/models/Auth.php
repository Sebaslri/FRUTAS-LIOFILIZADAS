<?php

declare(strict_types=1);

class Auth
{
    private PDO $conn;
    private string $table = 'usuario';
    private ?array $columns = null;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    public function findByEmail(string $email): ?array
    {
        $emailColumn = $this->emailColumn();
        $passwordColumn = $this->passwordColumn();

        $query = "SELECT usuarioId, rolId, nombre, apellido, foto, {$emailColumn} AS email, {$passwordColumn} AS password
                  FROM {$this->table}
                  WHERE {$emailColumn} = :email
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch();

        return $user ?: null;
    }

    public function emailExists(string $email): bool
    {
        return $this->findByEmail($email) !== null;
    }

    public function create(array $data): array
    {
        $rolId = (int) ($data['rolId'] ?? 1);
        $nombre = trim((string) $data['nombre']);
        $apellido = trim((string) $data['apellido']);
        $email = trim((string) $data['email']);
        $passwordHash = password_hash((string) $data['password'], PASSWORD_DEFAULT);
        $foto = $data['foto'] ?? null;
        $emailColumn = $this->emailColumn();
        $passwordColumn = $this->passwordColumn();

        $query = "INSERT INTO {$this->table} (rolId, nombre, apellido, {$emailColumn}, {$passwordColumn}, foto)
                  VALUES (:rolId, :nombre, :apellido, :email, :password, :foto)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':rolId', $rolId, PDO::PARAM_INT);
        $stmt->bindValue(':nombre', $nombre);
        $stmt->bindValue(':apellido', $apellido);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':password', $passwordHash);
        
        if (empty($foto)) {
            $stmt->bindValue(':foto', null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(':foto', $foto);
        }
        
        $stmt->execute();

        return [
            'usuarioId' => (int) $this->conn->lastInsertId(),
            'rolId' => $rolId,
            'nombre' => $nombre,
            'apellido' => $apellido,
            'email' => $email,
            'foto' => $foto
        ];
    }

    private function emailColumn(): string
    {
        return $this->quoteKnownColumn(['email', 'correo']);
    }

    private function passwordColumn(): string
    {
        return $this->quoteKnownColumn(['password', 'contrasena', 'contraseña', 'contraseÃ±a']);
    }

    private function quoteKnownColumn(array $candidates): string
    {
        $columns = $this->getColumns();

        foreach ($candidates as $candidate) {
            if (in_array($candidate, $columns, true)) {
                return "`{$candidate}`";
            }
        }

        throw new RuntimeException('La tabla usuario no tiene las columnas esperadas.');
    }

    private function getColumns(): array
    {
        if ($this->columns !== null) {
            return $this->columns;
        }

        $stmt = $this->conn->query("SHOW COLUMNS FROM {$this->table}");
        $this->columns = array_map(
            static fn (array $column): string => (string) $column['Field'],
            $stmt->fetchAll()
        );

        return $this->columns;
    }
}
