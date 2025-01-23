<?php
require_once '../../config/database.php';

$query = $_GET['q'] ?? '';
$sql = "SELECT * FROM books WHERE 
        title ILIKE ? OR 
        isbn ILIKE ? OR 
        author ILIKE ?";
$stmt = $pdo->prepare($sql);
$param = "%$query%";
try {
    $stmt->execute([$param, $param, $param]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch(PDOException $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}