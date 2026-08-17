<?php

declare(strict_types=1);

function handleAvatarUpload(?array $fileInfo): ?string
{
    if (!$fileInfo || $fileInfo['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $extension = strtolower(pathinfo($fileInfo['name'], PATHINFO_EXTENSION));
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($extension, $allowedExtensions)) {
        return null; // Invalid extension
    }

    // Instead of saving to a temporary Docker folder, return Base64!
    $fileData = file_get_contents($fileInfo['tmp_name']);
    $mimeType = mime_content_type($fileInfo['tmp_name']) ?: 'image/' . $extension;
    
    // Return Base64 data URI to be stored directly in TiDB LONGTEXT column
    return 'data:' . $mimeType . ';base64,' . base64_encode($fileData);
}
