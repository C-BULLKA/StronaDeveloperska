<?php
session_start();
if (!isset($_SESSION['zalogowany']) || $_SESSION['zalogowany'] !== true) {
    header('Location: panel.php');
    exit();
}

require_once __DIR__ . '/../../inc/auth_admin.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['status']) && isset($_POST['investment'])) {
    // CSRF
    if (!verify_csrf_token($_POST['csrf_token'] ?? null)) {
        http_response_code(400);
        echo 'Nieprawidłowy token CSRF';
        exit();
    }

    $statusFile = __DIR__ . '/../../segment_status.json';
    $investmentKey = $_POST['investment'];
    $newStatuses = $_POST['status'];

    // Dozwolone inwestycje i wartości statusów
    $allowedInvestments = ['naSciezki', 'juraszki'];
    $allowedValues = ['available', 'reserved', 'sold'];

    if (!in_array($investmentKey, $allowedInvestments, true)) {
        http_response_code(400);
        echo 'Nieprawidłowa inwestycja';
        exit();
    }

    // Wczytaj istniejące statusy
    $allStatuses = [];
    if (file_exists($statusFile)) {
        $allStatuses = json_decode(file_get_contents($statusFile), true) ?? [];
    }

    // Sanitacja nowych statusów: dopuszczalne klucze i wartości
    $sanitized = [];
    foreach ($newStatuses as $k => $v) {
        if (is_array($v)) {
            // np. struktura L1 => [B1 => value, ...]
            $sanitized[$k] = [];
            foreach ($v as $subk => $subv) {
                if (in_array($subv, $allowedValues, true)) {
                    $sanitized[$k][$subk] = $subv;
                }
            }
        } else {
            if (in_array($v, $allowedValues, true)) {
                $sanitized[$k] = $v;
            }
        }
    }

    // Nadpisz tylko dany klucz
    $allStatuses[$investmentKey] = $sanitized;

    file_put_contents($statusFile, json_encode($allStatuses, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    header('Location: panel.php?success_status=' . urlencode($investmentKey));
    exit();

} else {
    header('Location: panel.php');
    exit();
}
?>