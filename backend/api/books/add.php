<?php
// add.php
require_once '../../config/database.php';

session_start();

// Updated CORS headers
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Cache-Control, Pragma, Expires');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Please login to continue']);
    exit;
}

// Get and decode input data
$input = file_get_contents('php://input');
if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'No data received']);
    exit;
}

$data = json_decode($input, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Validate required fields
$required = ['title', 'description', 'isbn', 'author'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

try {
    $pdo->beginTransaction();

    // Check if book exists
    $stmt = $pdo->prepare("SELECT id FROM books WHERE isbn = ?");
    $stmt->execute([$data['isbn']]);
    $existingBook = $stmt->fetch();

    if ($existingBook) {
        $bookId = $existingBook['id'];
    } else {
        // Insert new book
        $stmt = $pdo->prepare("INSERT INTO books (title, image, description, isbn, author) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['image'] ?? '',
            $data['description'],
            $data['isbn'],
            $data['author']
        ]);
        $bookId = $pdo->lastInsertId();
    }

    // Check if user already has this book
    $stmt = $pdo->prepare("SELECT * FROM user_books WHERE user_id = ? AND book_id = ?");
    $stmt->execute([$_SESSION['user_id'], $bookId]);

    if ($stmt->fetch()) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(['error' => 'This book is already in your library']);
        exit;
    }

    // Add book to user's library
    $stmt = $pdo->prepare("INSERT INTO user_books (user_id, book_id) VALUES (?, ?)");
    $stmt->execute([$_SESSION['user_id'], $bookId]);

    $pdo->commit();
    echo json_encode([
        'status' => 'success',
        'message' => 'Book added successfully',
        'id' => $bookId
    ]);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}