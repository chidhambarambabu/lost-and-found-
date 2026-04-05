<?php
// php/upload-image.php
// Image upload handler for XAMPP
// Images are stored locally; only the filename/path is stored on blockchain

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// ---- CONFIG ----
define('UPLOAD_BASE', __DIR__ . '/../uploads/');
define('MAX_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_TYPES', ['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

function respond($success, $data = []) {
    echo json_encode(array_merge(['success' => $success], $data));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, ['error' => 'Only POST allowed']);
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    respond(false, ['error' => 'No file uploaded or upload error: ' . ($_FILES['image']['error'] ?? 'unknown')]);
}

$file = $_FILES['image'];
$folder = isset($_POST['folder']) ? preg_replace('/[^a-z0-9_-]/', '', $_POST['folder']) : 'items';

// Validate type
if (!in_array($file['type'], ALLOWED_TYPES)) {
    respond(false, ['error' => 'Invalid file type. Only JPG, PNG, GIF, WEBP allowed.']);
}

// Validate size
if ($file['size'] > MAX_SIZE) {
    respond(false, ['error' => 'File too large. Max 5MB.']);
}

// Create upload directory
$uploadDir = UPLOAD_BASE . $folder . '/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filename
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = $folder . '/' . uniqid('img_', true) . '.' . strtolower($ext);
$destination = UPLOAD_BASE . $filename;

if (move_uploaded_file($file['tmp_name'], $destination)) {
    respond(true, ['filename' => $filename, 'url' => 'uploads/' . $filename]);
} else {
    respond(false, ['error' => 'Failed to move uploaded file.']);
}
?>
