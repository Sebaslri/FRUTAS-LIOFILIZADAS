<?php

declare(strict_types=1);

function handleAvatarUpload(?array $fileInfo): ?string
{
    if (!$fileInfo || $fileInfo['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $uploadDir = __DIR__ . '/../uploads/avatars/';
    
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $extension = strtolower(pathinfo($fileInfo['name'], PATHINFO_EXTENSION));
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($extension, $allowedExtensions)) {
        return null; // Invalid extension
    }

    // Generate unique name
    $fileName = uniqid('avatar_') . '.' . $extension;
    $destination = $uploadDir . $fileName;

    if (move_uploaded_file($fileInfo['tmp_name'], $destination)) {
        // Return the relative URL to be saved in DB
        // Assuming your API is at /api-frutas/api/
        return 'uploads/avatars/' . $fileName;
    }

    return null;
}
