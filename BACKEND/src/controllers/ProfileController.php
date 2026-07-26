<?php

declare(strict_types=1);

class ProfileController
{
    private Profile $model;

    public function __construct(Profile $model)
    {
        $this->model = $model;
    }

    public function getProfile(int $usuarioId): void
    {
        $profile = $this->model->getProfile($usuarioId);

        if (!$profile) {
            apiResponse(false, null, 'Usuario no encontrado', 404);
            return;
        }

        // Clean up the response
        $email = $profile['email'] ?? $profile['correo'] ?? '';
        unset($profile['password'], $profile['contrasena']);

        $responseData = [
            'usuarioId' => $profile['usuarioId'],
            'nombre' => $profile['nombre'],
            'apellido' => $profile['apellido'],
            'email' => $email,
            'foto' => $profile['foto'] ?? null
        ];

        apiResponse(true, $responseData, 'Perfil obtenido correctamente');
    }

    public function updateProfile(int $usuarioId, array $data): void
    {
        $nombre = $data['nombre'] ?? $_POST['nombre'] ?? '';
        $apellido = $data['apellido'] ?? $_POST['apellido'] ?? '';

        if (empty($nombre) || empty($apellido)) {
            apiResponse(false, null, 'Nombre y apellido son obligatorios', 400);
            return;
        }

        $foto = $data['foto'] ?? $_POST['foto'] ?? null;
        if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
            require_once __DIR__ . '/../../helpers/UploadHelper.php';
            $uploadedFoto = handleAvatarUpload($_FILES['foto']);
            if ($uploadedFoto) {
                // Fetch existing profile to delete old photo
                $oldProfile = $this->model->getProfile($usuarioId);
                if ($oldProfile && !empty($oldProfile['foto'])) {
                    $oldFotoPath = __DIR__ . '/../../' . $oldProfile['foto'];
                    if (file_exists($oldFotoPath) && is_file($oldFotoPath)) {
                        unlink($oldFotoPath);
                    }
                }
                $foto = $uploadedFoto;
            }
        }

        $updateData = [
            'nombre' => $nombre,
            'apellido' => $apellido,
            'foto' => $foto
        ];

        $success = $this->model->updateProfile($usuarioId, $updateData);

        if ($success) {
            apiResponse(true, $updateData, 'Perfil actualizado correctamente');
        } else {
            apiResponse(false, null, 'No se pudo actualizar el perfil', 500);
        }
    }
}
