<?php
session_start();
if (!isset($_SESSION['zalogowany']) || $_SESSION['zalogowany'] !== true) {
    header('Location: panel.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['status']) && isset($_POST['investment'])) {
    $statusFile = 'segment_status.json';
    $investmentKey = $_POST['investment'];
    $newStatuses = $_POST['status'];
    
    // Wczytaj całą aktualną zawartość pliku JSON
    $allStatuses = [];
    if (file_exists($statusFile)) {
        $allStatuses = json_decode(file_get_contents($statusFile), true);
    }

    // Zaktualizuj tylko klucz dla konkretnej inwestycji
    $allStatuses[$investmentKey] = $newStatuses;

    // Zapisz całą zaktualizowaną strukturę z powrotem do pliku
    file_put_contents($statusFile, json_encode($allStatuses, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    // Przekieruj z powrotem do panelu z komunikatem o sukcesie
    header('Location: panel.php?success_status=' . urlencode($investmentKey));
    exit();

} else {
    header('Location: panel.php');
    exit();
}