<?php

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';

applyCorsHeaders();

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../src/models/Condicion.php';
require_once __DIR__ . '/../src/controllers/CondicionController.php';

try {
    $database = new Database();
    $model = new Condicion($database->getConnection());
    $controller = new CondicionController($model);
    $accion = $_GET['accion'] ?? 'listar';

    switch ($accion) {
        case 'listar':
            $controller->listar();
            break;

        case 'frutasPorCondicion':
            $condicionId = filter_input(INPUT_GET, 'Id', FILTER_VALIDATE_INT);

            if ($condicionId === false || $condicionId === null || $condicionId <= 0) {
                apiResponse(false, null, 'El ID de la condicion no es valido.', 400);
                break;
            }

            $controller->frutasPorCondicion($condicionId);
            break;

        default:
            apiResponse(false, null, 'Accion no encontrada.', 404);
    }
} catch (Throwable $exception) {
    apiResponse(false, null, 'Error interno del servidor.', 500);
}
