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
$url = "postgresql://postgres:RSLLHhIyrWqduCsBMpFBjdNHnvmHXEBk@autorack.proxy.rlwy.net:44469/railway";

$parsed_url = parse_url($url);
$db_config = [
    'host' => $parsed_url['host'],
    'port' => $parsed_url['port'],
    'dbname' => ltrim($parsed_url['path'], '/'),
    'user' => $parsed_url['user'],
    'password' => $parsed_url['pass']
];

try {
    $dsn = "pgsql:host={$db_config['host']};port={$db_config['port']};dbname={$db_config['dbname']}";
    
    $pdo = new PDO($dsn, $db_config['user'], $db_config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    echo "✅ Database connected successfully!";
} catch (PDOException $e) {
    error_log("❌ Database connection failed: " . $e->getMessage());
    die("Database connection failed. Please check logs.");
}
?>
