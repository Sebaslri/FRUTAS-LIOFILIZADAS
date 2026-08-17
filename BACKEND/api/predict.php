<?php

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';
applyCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    apiResponse(false, null, 'Método no permitido. Use POST.', 405);
    exit;
}

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/MLPPredictor.php';

try {
    $inputJSON = file_get_contents('php://input');
    $requestData = json_decode($inputJSON, true);

    if (!isset($requestData['fruit_ids']) || !is_array($requestData['fruit_ids']) || empty($requestData['fruit_ids'])) {
        http_response_code(400);
        echo json_encode(['detail' => 'Debe enviar al menos el ID de una fruta']);
        exit;
    }

    $fruitIds = array_map('intval', $requestData['fruit_ids']);

    $db = getConnection();
    
    // Preparar placeholders
    $inQuery = implode(',', array_fill(0, count($fruitIds), '?'));
    $query = "
        SELECT p.* 
        FROM fruta f
        JOIN frutapropiedad fp ON f.frutaId = fp.frutaId
        JOIN propiedades p ON fp.propiedadId = p.propiedadId
        WHERE f.frutaId IN ($inQuery)
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute($fruitIds);
    $propertiesList = $stmt->fetchAll();

    if (empty($propertiesList)) {
        http_response_code(404);
        echo json_encode(['detail' => 'No se encontraron las propiedades para esas frutas en la BD']);
        exit;
    }

    $jsonPath = __DIR__ . '/../ml_training/model_weights.json';
    // Por si aún no se ha movido
    if (!file_exists($jsonPath)) {
        $jsonPath = __DIR__ . '/../../ML_BACKEND/model_weights.json';
    }

    $predictor = new MLPPredictor($jsonPath);

    // Calcular el promedio de las entradas
    $inputsMatrix = [];
    foreach ($propertiesList as $prop) {
        $row = [];
        foreach ($predictor->inputFeatures as $feature) {
            $row[] = isset($prop[$feature]) ? (float)$prop[$feature] : 0.0;
        }
        $inputsMatrix[] = $row;
    }

    $numFruits = count($inputsMatrix);
    $numFeatures = count($predictor->inputFeatures);
    $avgInputs = array_fill(0, $numFeatures, 0.0);

    for ($i = 0; $i < $numFruits; $i++) {
        for ($j = 0; $j < $numFeatures; $j++) {
            $avgInputs[$j] += $inputsMatrix[$i][$j];
        }
    }

    for ($j = 0; $j < $numFeatures; $j++) {
        $avgInputs[$j] /= $numFruits;
    }

    // Hacer la predicción
    $prediction = $predictor->predict($avgInputs);

    // Formatear respuesta (mismo formato que el FastAPI de Python)
    $response = [
        'capacidad_antioxidante' => round($prediction['cap_ant_digerido'] ?? 0, 2),
        'carotenoides' => round($prediction['bioacc_carotenoides'] ?? 0, 2),
        'flavonoides' => round($prediction['bioacc_flavonoides'] ?? 0, 2),
        'acido_ascorbico' => round($prediction['bioacc_acAsc'] ?? 0, 2),
        'metrics' => [
            'global_metrics' => $predictor->metrics['global'],
            'per_target' => [
                'cap_ant_digerido' => $predictor->metrics['per_target']['cap_ant_digerido'],
                'bioacc_carotenoides' => $predictor->metrics['per_target']['bioacc_carotenoides'],
                'bioacc_flavonoides' => $predictor->metrics['per_target']['bioacc_flavonoides'],
                'bioacc_acAsc' => $predictor->metrics['per_target']['bioacc_acAsc']
            ]
        ]
    ];

    header('Content-Type: application/json');
    echo json_encode($response);

} catch (Throwable $exception) {
    http_response_code(500);
    echo json_encode(['detail' => 'Error interno del servidor: ' . $exception->getMessage()]);
}
