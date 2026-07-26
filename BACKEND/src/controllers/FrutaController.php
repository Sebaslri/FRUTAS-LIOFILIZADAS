<?php

declare(strict_types=1);

class FrutaController
{
    private Fruta $model;

    public function __construct(Fruta $model)
    {
        $this->model = $model;
    }

    public function listar(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            apiResponse(false, null, 'Metodo no permitido.', 405);
        }

        $frutas = $this->model->listar();
        apiResponse(true, $frutas, 'Frutas obtenidas correctamente.');
    }


    public function frutaPorId(int $frutaId): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        apiResponse(false, null, 'Método no permitido.', 405);
        return;
    }

    if ($frutaId <= 0) {
        apiResponse(false, null, 'El ID de la fruta no es válido.', 400);
        return;
    }

    $fruta = $this->model->frutaPorId($frutaId);

    if ($fruta === []) {
        apiResponse(false, null, 'Fruta no encontrada.', 404);
        return;
    }

    apiResponse(
        true,
        $fruta,
        'Fruta obtenida correctamente.'
    );
}

    public function listarMapaBioactivo(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            apiResponse(false, null, 'Metodo no permitido.', 405);
            return;
        }

        apiResponse(true, $this->model->listarMapaBioactivo(), 'Mapa bioactivo obtenido correctamente.');
    }

    public function listarMixes(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            apiResponse(false, null, 'Metodo no permitido.', 405);
            return;
        }

        apiResponse(true, $this->model->listarMixes(), 'Mixes obtenidos correctamente.');
    }


}
