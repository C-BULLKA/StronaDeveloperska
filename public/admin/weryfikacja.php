<?php
session_start();

require_once __DIR__ . '/../../inc/auth_admin.php';
require_once __DIR__ . '/../../inc/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    if ($password !== '' && password_verify($password, ADMIN_PASSWORD_HASH)) {
        $_SESSION['zalogowany'] = true;
        $_SESSION['is_admin'] = true;
        generate_csrf_token();
        header('Location: panel.php');
        exit;
    } else {
        header('Location: panel.php?error=1');
        exit;
    }
} else {
    header('Location: panel.php');
    exit;
}
?>