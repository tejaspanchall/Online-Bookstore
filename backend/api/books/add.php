<?php
require_once '../../config/database.php';

session_start();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Please login to continue']);
    exit;
}

$required = ['title', 'description', 'isbn', 'author'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

$imagePath = '';
if (!empty($_FILES['image'])) {
    $uploadDir = '../../uploads/book_covers/';
    
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $imageFileName = uniqid() . '_' . basename($_FILES['image']['name']);
    $targetFilePath = $uploadDir . $imageFileName;

    $imageFileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($imageFileType, $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid image type']);
        exit;
    }

    if ($_FILES['image']['size'] > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['error' => 'Image too large (max 5MB)']);
        exit;
    }

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
        $imagePath = '/online-bookstore/backend/uploads/book_covers/' . $imageFileName;
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to upload image']);
        exit;
    }

    $imagePath = str_replace('../../', '', $targetFilePath);
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("SELECT id FROM books WHERE isbn = ?");
    $stmt->execute([$_POST['isbn']]);
    $existingBook = $stmt->fetch();

    if ($existingBook) {
        $bookId = $existingBook['id'];
    } else {
        $stmt = $pdo->prepare("INSERT INTO books (title, image, description, isbn, author) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $_POST['title'],
            $imagePath,
            $_POST['description'],
            $_POST['isbn'],
            $_POST['author']
        ]);
        $bookId = $pdo->lastInsertId();
    }

    $stmt = $pdo->prepare("SELECT * FROM user_books WHERE user_id = ? AND book_id = ?");
    $stmt->execute([$_SESSION['user_id'], $bookId]);

    if ($stmt->fetch()) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(['error' => 'This book is already in your library']);
        exit;
    }

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