<?php
$host = 'localhost';
$dbname = 'bookstore';
$user = 'postgres';
$password = 'yourpassword';

$conn = pg_connect("host=$host dbname=$dbname user=$user password=$password");
if (!$conn) {
    die("Database connection failed");
}
?>
