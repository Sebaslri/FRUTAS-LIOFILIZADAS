<?php

declare(strict_types=1);

class CondicionController
{
    private Condicion $model;

    public function __construct(Condicion $model)
    {
        $this->model = $model;
    }

    public function listar(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            apiResponse(false, null, 'Metodo no permitido.', 405);
        }

        $condiciones = $this->model->listar();
        apiResponse(true, $condiciones, 'Condiciones obtenidas correctamente.');
    }

    public function frutasPorCondicion(int $condicionId): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            apiResponse(false, null, 'Metodo no permitido.', 405);
            return;
        }

        if ($condicionId <= 0) {
            apiResponse(false, null, 'El ID de la condicion no es valido.', 400);
            return;
        }

        apiResponse(
            true,
            $this->model->frutasPorCondicion($condicionId),
            'Frutas relacionadas correctamente.'
        );
    }
}
