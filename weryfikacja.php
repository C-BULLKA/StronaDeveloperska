<?php
session_start();

$correct_password = 'admin'; // Pamiętaj, by ustawić bezpieczniejsze hasło

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['password']) && $_POST['password'] === $correct_password) {
        $_SESSION['zalogowany'] = true;
        header('Location: panel.php'); // ZMIANA TUTAJ
        exit;
    } else {
        header('Location: panel.php?error=1'); // ZMIANA TUTAJ
        exit;
    }
} else {
    header('Location: panel.php'); // ZMIANA TUTAJ
    exit;
}
?>