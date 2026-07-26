<?php

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';

applyCorsHeaders();

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../src/models/Fruta.php';
require_once __DIR__ . '/../src/controllers/FrutaController.php';

try {
    $database = new Database();
    $model = new Fruta($database->getConnection());
    $controller = new FrutaController($model);

    $accion = $_GET['accion'] ?? 'listar';

    switch ($accion) {
        case 'listar':
            $controller->listar();
            break;

        case 'frutaPorId':
            $frutaId = filter_input(
                INPUT_GET,
                'Id',
                FILTER_VALIDATE_INT
            );

            if ($frutaId === false || $frutaId === null || $frutaId <= 0) {
                apiResponse( false, null, 'El ID de la fruta no es válido.',400);
                break;
            }

            $controller->frutaPorId($frutaId);
            break;

        case 'mapaBioactivo':
            $controller->listarMapaBioactivo();
            break;

        case 'mixes':
            $controller->listarMixes();
            break;

        default:
            apiResponse(false,null,'Acción no encontrada.',404);
    }
} catch (Throwable $exception) {
    apiResponse(
        false,
        null,
        'Error interno del servidor.',
        500
    );
}
