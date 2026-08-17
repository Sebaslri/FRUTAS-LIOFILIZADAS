<?php
$plotPath = __DIR__ . '/../ml_training/evaluation_plot.png';
if (file_exists($plotPath)) {
    header('Content-Type: image/png');
    header('Content-Length: ' . filesize($plotPath));
    readfile($plotPath);
} else {
    http_response_code(404);
    echo "Image not found";
}
