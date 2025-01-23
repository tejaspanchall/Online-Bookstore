<?php
require_once '../../config/database.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$stmt = $pdo->prepare("
    SELECT b.* FROM books b
    JOIN user_books ub ON b.id = ub.book_id
    WHERE ub.user_id = ?
");

try {
    $stmt->execute([$_SESSION['user_id']]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch(PDOException $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}