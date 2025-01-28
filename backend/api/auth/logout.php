<?php
require_once '../../config/database.php';

session_start();

// Clear session data
$_SESSION = array();

// Destroy session completely
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"], // Ensure this matches your dev environment
        $params["httponly"]
    );
}

session_destroy();

// Enhanced CORS headers
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

echo json_encode(['status' => 'success']);
?>