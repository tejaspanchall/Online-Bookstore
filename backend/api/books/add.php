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

    // Validate required fields
    $required = ['title', 'description', 'isbn', 'author'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Check if book already exists by ISBN
    $stmt = $pdo->prepare("SELECT id FROM books WHERE isbn = ?");
    $stmt->execute([$data['isbn']]);
    $existingBook = $stmt->fetch();

    if ($existingBook) {
        $bookId = $existingBook['id'];
    } else {
        // Insert new book if not exists
        $stmt = $pdo->prepare("INSERT INTO books (title, image, description, isbn, author) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['image'] ?? '', // Handle optional image field
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
        throw new Exception('This book is already in your library');
    }

    // Link to user
    $stmt = $pdo->prepare("INSERT INTO user_books (user_id, book_id) VALUES (?, ?)");
    $stmt->execute([$_SESSION['user_id'], $bookId]);
    
    $pdo->commit();
    echo json_encode([
        'status' => 'success', 
        'id' => $bookId,
        'message' => $existingBook ? 'Existing book added to library' : 'New book created and added to library'
    ]);
    
} catch(PDOException $e) {
    $pdo->rollBack();
    http_response_code(400);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch(Exception $e) {
    $pdo->rollBack();
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}