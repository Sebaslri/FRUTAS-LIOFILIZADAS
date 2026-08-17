<?php

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';

applyCorsHeaders();

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../src/models/Auth.php';
require_once __DIR__ . '/../src/controllers/AuthController.php';

session_start();

try {
    $database = new Database();
    $model = new Auth($database->getConnection());
    $controller = new AuthController($model);
    $accion = $_GET['accion'] ?? $_POST['accion'] ?? 'login';
    $body = getJsonBody();

    switch ($accion) {
        case 'fix_db':
            try {
                $db = $database->getConnection();
                $db->exec("ALTER TABLE usuario MODIFY foto LONGTEXT");
                apiResponse(true, null, "Database updated successfully.");
            } catch (Exception $e) {
                apiResponse(false, null, "Error: " . $e->getMessage());
            }
            break;

        case 'login':
        case 'iniciar-sesion':
            $controller->login($body);
            break;

        case 'register':
        case 'registro':
        case 'registrar':
            $controller->register($body);
            break;

        case 'logout':
        case 'cerrar-sesion':
            $controller->logout();
            break;

        default:
            apiResponse(false, null, 'Accion no encontrada.', 404);
    }
} catch (Throwable $exception) {
    apiResponse(false, null, 'Error interno del servidor.', 500);
}
