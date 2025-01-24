<?php
require_once '../../config/database.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

try {
    $pdo->beginTransaction();
    
    // Insert book
    $stmt = $pdo->prepare("INSERT INTO books (title, image, description, isbn, author) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['title'],
        $data['image'],
        $data['description'],
        $data['isbn'],
        $data['author']
    ]);
    $bookId = $pdo->lastInsertId();
    
    // Link to user
    $stmt = $pdo->prepare("INSERT INTO user_books (user_id, book_id) VALUES (?, ?)");
    $stmt->execute([$_SESSION['user_id'], $bookId]);
    
    $pdo->commit();
    echo json_encode(['status' => 'success', 'id' => $bookId]);
} catch(PDOException $e) {
    $pdo->rollBack();
    http_response_code(400);
    echo json_encode(['error' => 'Failed to add book']);
}