<?php
require_once '../../config/database.php';

session_start();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user) {
    $reset_token = bin2hex(random_bytes(32));
    $stmt = $pdo->prepare("UPDATE users SET reset_token = ? WHERE email = ?");
    $stmt->execute([$reset_token, $email]);
    
    // In production: Send email with reset link
    echo json_encode(['status' => 'success', 'message' => 'Reset instructions sent']);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Email not found']);
}