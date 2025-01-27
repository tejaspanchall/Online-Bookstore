<?php
require_once '../../config/database.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents('php://input'), true);

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

    // Check if the book already exists by ISBN
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
            $data['image'] ?? '', // Optional image field
            $data['description'],
            $data['isbn'],
            $data['author']
        ]);
        $bookId = $pdo->lastInsertId();
    }

    // Check if the user already has this book
    $stmt = $pdo->prepare("SELECT * FROM user_books WHERE user_id = ? AND book_id = ?");
    $stmt->execute([$_SESSION['user_id'], $bookId]);

    if ($stmt->fetch()) {
        throw new Exception('This book is already in your library');
    }

    // Link the book to the user
    $stmt = $pdo->prepare("INSERT INTO user_books (user_id, book_id) VALUES (?, ?)");
    $stmt->execute([$_SESSION['user_id'], $bookId]);

    $pdo->commit();
    echo json_encode([
        'status' => 'success',
        'id' => $bookId,
        'message' => $existingBook ? 'Existing book added to library' : 'New book created and added to library'
    ]);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(400);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}