<?php
require_once '../../config/database.php';
session_start();

session_unset();
session_destroy();

echo json_encode(['status' => 'success']);