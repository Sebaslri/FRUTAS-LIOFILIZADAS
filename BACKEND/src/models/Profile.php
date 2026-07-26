<?php

declare(strict_types=1);

class Profile
{
    private PDO $conn;
    private string $table = 'usuario';

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    public function getProfile(int $usuarioId): ?array
    {
        $query = "SELECT * 
                  FROM {$this->table} 
                  WHERE usuarioId = :usuarioId LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':usuarioId', $usuarioId, PDO::PARAM_INT);
        $stmt->execute();
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);

        return $profile ?: null;
    }

    public function updateProfile(int $usuarioId, array $data): bool
    {
        $nombre = trim((string) ($data['nombre'] ?? ''));
        $apellido = trim((string) ($data['apellido'] ?? ''));
        $foto = trim((string) ($data['foto'] ?? ''));

        // If email was to be updated, we'd add it here, but typically it requires more validation.
        // For now, updating nombre, apellido, and foto.

        $query = "UPDATE {$this->table} 
                  SET nombre = :nombre, apellido = :apellido, foto = :foto 
                  WHERE usuarioId = :usuarioId";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':nombre', $nombre);
        $stmt->bindValue(':apellido', $apellido);
        
        if (empty($foto)) {
            $stmt->bindValue(':foto', null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(':foto', $foto);
        }
        
        $stmt->bindValue(':usuarioId', $usuarioId, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
