<?php
// php/change-password.php
// Off-chain password management (optional feature)
// Since this DApp uses MetaMask, passwords are secondary.
// Passwords are stored in a simple JSON file per wallet address.

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

function respond($success, $data = []) {
    echo json_encode(array_merge(['success' => $success], $data));
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['wallet'], $input['currentPassword'], $input['newPassword'])) {
    respond(false, ['error' => 'Invalid input']);
}

$wallet = strtolower(preg_replace('/[^a-zA-Z0-9x]/', '', $input['wallet']));
$currentPwd = $input['currentPassword'];
$newPwd = $input['newPassword'];

$pwdFile = __DIR__ . '/../data/passwords.json';
$dir = dirname($pwdFile);
if (!is_dir($dir)) mkdir($dir, 0755, true);

$passwords = [];
if (file_exists($pwdFile)) {
    $passwords = json_decode(file_get_contents($pwdFile), true) ?? [];
}

// Check current password
if (isset($passwords[$wallet])) {
    if (!password_verify($currentPwd, $passwords[$wallet])) {
        respond(false, ['error' => 'Current password is incorrect']);
    }
} else {
    // First time setting password — any "current" is accepted if wallet doesn't have one
    // In production, require admin approval or MetaMask signature
}

// Set new password
$passwords[$wallet] = password_hash($newPwd, PASSWORD_DEFAULT);
file_put_contents($pwdFile, json_encode($passwords, JSON_PRETTY_PRINT));

respond(true, ['message' => 'Password updated successfully']);
?>
