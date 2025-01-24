<?php
require_once '../../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

// Validate email match
if ($data['email'] !== $data['confirmEmail']) {
    http_response_code(400);
    echo json_encode(['error' => 'Emails do not match']);
    exit;
}

$firstname = $data['firstname'];
$lastname = $data['lastname'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);

// Check if email exists
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    http_response_code(400);
    echo json_encode(['error' => 'Email already registered']);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)");
try {
    $stmt->execute([$firstname, $lastname, $email, $password]);
    echo json_encode(['status' => 'success']);
} catch(PDOException $e) {
    http_response_code(400);
    echo json_encode(['error' => 'Registration failed: ' . $e->getMessage()]);
}