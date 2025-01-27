<?php
require_once '../../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];
$password = $data['password'];

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    session_start();

    session_set_cookie_params([
        'lifetime' => 86400,
        'path' => '/',
        'domain' => 'localhost',
        'secure' => false,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    
    $_SESSION['user_id'] = $user['id'];
    echo json_encode(['status' => 'success', 'user' => [
        'id' => $user['id'],
        'firstname' => $user['firstname'],
        'lastname' => $user['lastname'],
        'email' => $user['email']
    ]]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
}