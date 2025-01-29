<?php
require_once '../../config/database.php';
session_start();

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Log incoming request
$requestLog = [
    'method' => $_SERVER['REQUEST_METHOD'],
    'session' => isset($_SESSION['user_id']) ? 'exists' : 'missing'
];

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'error' => 'Unauthorized',
        'debug' => $requestLog
    ]);
    exit;
}

// Get JSON data from request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Log request data
$requestLog['rawInput'] = $json;
$requestLog['parsedData'] = $data;

if (!$data || !isset($data['bookId'])) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Invalid request data',
        'debug' => $requestLog
    ]);
    exit;
}

try {
    // Begin transaction
    $pdo->beginTransaction();

    // First, ensure the book exists in the books table
    $insertBook = $pdo->prepare("
        INSERT INTO books (id, isbn, title, author, image) 
        VALUES (:id, :isbn, :title, :author, :image)
        ON DUPLICATE KEY UPDATE
        isbn = VALUES(isbn),
        title = VALUES(title),
        author = VALUES(author),
        image = VALUES(image)
    ");
    
    $bookData = [
        ':id' => $data['bookId'],
        ':isbn' => $data['isbn'] ?? '',
        ':title' => $data['title'] ?? '',
        ':author' => $data['author'] ?? '',
        ':image' => $data['image'] ?? ''
    ];
    
    $insertBook->execute($bookData);

    // Then add to user's library if not already there
    $addToLibrary = $pdo->prepare("
        INSERT IGNORE INTO user_books (user_id, book_id) 
        VALUES (:userId, :bookId)
    ");
    
    $addToLibrary->execute([
        ':userId' => $_SESSION['user_id'],
        ':bookId' => $data['bookId']
    ]);

    // Commit transaction
    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Book successfully added to library',
        'debug' => [
            'request' => $requestLog,
            'bookId' => $data['bookId'],
            'userId' => $_SESSION['user_id']
        ]
    ]);

} catch (PDOException $e) {
    // Rollback transaction on error
    $pdo->rollBack();
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'message' => $e->getMessage(),
        'debug' => [
            'request' => $requestLog,
            'sqlState' => $e->errorInfo[0],
            'errorCode' => $e->errorInfo[1],
            'errorMsg' => $e->errorInfo[2]
        ]
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Server error',
        'message' => $e->getMessage(),
        'debug' => $requestLog
    ]);
}