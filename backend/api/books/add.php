<?php
require_once '../../config/database.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$stmt = $pdo->prepare("INSERT INTO books (title, image, description, isbn, author) VALUES (?, ?, ?, ?, ?)");
try {
    $stmt->execute([
        $data['title'],
        $data['image'],
        $data['description'],
        $data['isbn'],
        $data['author']
    ]);
    echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
} catch(PDOException $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}