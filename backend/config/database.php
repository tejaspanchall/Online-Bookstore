<?php
//Local Connection
// $db_config = [
//     'host' => 'localhost',
//     'dbname' => 'bookstore',
//     'user' => 'postgres',
//     'password' => 'root'
// ];

// try {
//     $pdo = new PDO(
//         "pgsql:host={$db_config['host']};dbname={$db_config['dbname']}",
//         $db_config['user'],
//         $db_config['password']
//     );
//     $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// } catch(PDOException $e) {
//     die("Connection failed: " . $e->getMessage());
// }

//Railway Connection
$db_config = [
    'host' => getenv('DB_HOST') ?: 'localhost',
    'port' => getenv('DB_PORT') ?: '5432',
    'dbname' => getenv('DB_NAME') ?: 'bookstore',
    'user' => getenv('DB_USER') ?: 'postgres',
    'password' => getenv('DB_PASSWORD') ?: 'root'
];

try {
    $dsn = "pgsql:host={$db_config['host']};port={$db_config['port']};dbname={$db_config['dbname']}";
    $pdo = new PDO($dsn, $db_config['user'], $db_config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage()); // Logs error instead of exposing it
    die("Database connection failed. Please check logs.");
}
?>
