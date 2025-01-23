<?php
require_once '../../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);
$firstname = $data['firstname'];
$lastname = $data['lastname'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);

$stmt = $pdo->prepare("INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)");
try {
    $stmt->execute([$firstname, $lastname, $email, $password]);
    echo json_encode(['status' => 'success']);
} catch(PDOException $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}