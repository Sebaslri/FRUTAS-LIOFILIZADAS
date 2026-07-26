<?php

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';
applyCorsHeaders();

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../src/models/Profile.php';
require_once __DIR__ . '/../src/controllers/ProfileController.php';

session_start();

// Validar que el usuario haya iniciado sesión (esto depende de cómo manejen la auth en tu backend)
// Normalmente se guarda un token o un usuarioId en la sesión
$usuarioId = $_SESSION['usuarioId'] ?? null;

// Si no estás usando PHP sessions, asume que el token JWT es verificado o pasa el ID temporalmente para la demo:
if (!$usuarioId) {
    // Si viene en el body o header por no usar cookies:
    $body = getJsonBody();
    $usuarioId = $body['usuarioId'] ?? $_GET['usuarioId'] ?? null;
}

if (!$usuarioId) {
    apiResponse(false, null, 'No autorizado. Inicie sesión.', 401);
    exit;
}

try {
    $database = new Database();
    $model = new Profile($database->getConnection());
    $controller = new ProfileController($model);
    
    $accion = $_GET['accion'] ?? $_POST['accion'] ?? null;
    $body = getJsonBody();

    switch ($accion) {
        case 'obtener':
            $controller->getProfile((int) $usuarioId);
            break;

        case 'actualizar':
            $controller->updateProfile((int) $usuarioId, $body);
            break;

        default:
            apiResponse(false, null, 'Accion no encontrada.', 404);
    }
} catch (Throwable $exception) {
    apiResponse(false, null, 'Error interno del servidor.', 500);
}
