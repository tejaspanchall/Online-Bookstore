<?php
require_once '../../config/database.php';
require '../../vendor/autoload.php'; // Include Composer's autoloader

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

session_start();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user) {
    $reset_token = bin2hex(random_bytes(32));
    $stmt = $pdo->prepare("UPDATE users SET reset_token = ? WHERE email = ?");
    $stmt->execute([$reset_token, $email]);

    // Send email with reset link
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Replace with your SMTP server
        $mail->SMTPAuth = true;
        $mail->Username = 'tejaspanchal127@gmail.com'; // Replace with your email
        $mail->Password = 'hnkbcikfudkrqtyc'; // Replace with your email password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('admin@bookcafe.com', 'BookCafe'); // Replace with your email and name
        $mail->addAddress($email); // Add a recipient

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Password Reset Instructions';
        $reset_link = "http://localhost:3000/reset-password?token=$reset_token";
        $mail->Body = "Click the following link to reset your password: <a href='$reset_link'>$reset_link</a>";

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Reset instructions sent']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send reset instructions']);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Email not found']);
}