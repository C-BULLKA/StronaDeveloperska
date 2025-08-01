<?php
session_start();
if (!isset($_SESSION['zalogowany']) || $_SESSION['zalogowany'] !== true) {
    header('Location: panel.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['status'])) {
    $statuses = $_POST['status'];
    $allowedStatuses = ['available', 'reserved', 'sold'];
    
    // Walidacja
    $validStatuses = [];
    foreach (['L1', 'L2'] as $apartment) {
        if (!isset($statuses[$apartment])) continue;
        $validStatuses[$apartment] = [];
        foreach ($statuses[$apartment] as $segment => $status) {
            if (in_array($status, $allowedStatuses)) {
                $validStatuses[$apartment][$segment] = $status;
            }
        }
    }
    
    file_put_contents('segment_status.json', json_encode($validStatuses));
    header('Location: panel.php?status_saved=1');
    exit();
} else {
    header('Location: panel.php');
    exit();
}