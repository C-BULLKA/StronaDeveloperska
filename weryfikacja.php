<?php
session_start();

require_once __DIR__ . '/inc/auth_admin.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $correct_password = 'admin'; // Pamiętaj, by ustawić bezpieczniejsze hasło w produkcji
    if (isset($_POST['password']) && $_POST['password'] === $correct_password) {
        // Oznacz admina i wygeneruj token CSRF
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