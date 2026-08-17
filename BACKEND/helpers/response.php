<?php

declare(strict_types=1);

function applyCorsHeaders(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowedOrigins = [
        'http://localhost:4200',
        'http://127.0.0.1:4200',
        'https://frutas-frontend.onrender.com',
    ];

    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Access-Control-Allow-Credentials: true');
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=utf-8');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function getJsonBody(): array
{
    $rawBody = file_get_contents('php://input');
    $payload = json_decode($rawBody ?: '{}', true);

    return is_array($payload) ? $payload : [];
}

function jsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function apiResponse(
    bool $isSuccess,
    mixed $data = null,
    string $message = '',
    int $statusCode = 200,
    array $extra = []
): void {
    jsonResponse(array_merge([
        'isSuccess' => $isSuccess,
        'data' => $data ?? new stdClass(),
        'message' => $message,
    ], $extra), $statusCode);
}
