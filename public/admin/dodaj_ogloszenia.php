<?php
require_once __DIR__ . '/../../inc/auth_admin.php';
require_once __DIR__ . '/../../inc/upload_helpers.php';

// Tylko zalogowany admin może dodawać ogłoszenia
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

// CSRF
if (!verify_csrf_token($_POST['csrf_token'] ?? null)) {
    http_response_code(400);
    echo "Nieprawidłowy token CSRF.";
    exit;
}

if (!isset($_POST['title'], $_POST['location'], $_POST['address'], $_POST['price'], $_POST['rooms'], $_POST['area'])) {
    http_response_code(400);
    echo "Błąd: Niekompletne dane formularza.";
    exit;
}

$title = trim($_POST['title']);
$location = trim($_POST['location']);
$address = trim($_POST['address']);
$price = (int)$_POST['price'];
$rooms = (int)$_POST['rooms'];
$area = (float)$_POST['area'];
$description = trim($_POST['description'] ?? 'Brak opisu.');
$features = isset($_POST['features']) ? array_map('trim', (array)$_POST['features']) : [];

$folderName = 'ad_' . time() . '_' . preg_replace('/[^a-zA-Z0-9-_]/', '_', substr($title, 0, 50));

// uploads poza public
$uploadRoot = realpath(__DIR__ . '/../../uploads_ogloszenia') ?: (__DIR__ . '/../../uploads_ogloszenia');
$adDirectory = $uploadRoot . '/' . $folderName;

if (!is_dir($adDirectory) && !mkdir($adDirectory, 0750, true)) {
    http_response_code(500);
    echo "Nie można utworzyć katalogu ogłoszenia.";
    exit;
}

// Zapis danych jako JSON
$adJson = [
    'title' => $title,
    'location' => $location,
    'address' => $address,
    'price' => $price,
    'rooms' => $rooms,
    'area' => $area,
    'description' => $description,
    'features' => array_values($features),
    'created_at' => date('c'),
    'images' => []
];

// Obsługa plików (opcjonalnie brak obrazów)
if (!empty($_FILES['images']) && is_array($_FILES['images']['name'])) {
    $count = count($_FILES['images']['name']);
    for ($i = 0; $i < $count; $i++) {
        $tmp = $_FILES['images']['tmp_name'][$i];
        $name = $_FILES['images']['name'][$i];
        $err = $_FILES['images']['error'][$i] ?? UPLOAD_ERR_OK;
        if ($err !== UPLOAD_ERR_OK) {
            // cleanup
            array_map('unlink', glob($adDirectory . '/*'));
            rmdir($adDirectory);
            http_response_code(400);
            echo "Błąd uploadu pliku: " . htmlspecialchars($name);
            exit;
        }

        if (!is_allowed_image_file($tmp, $name)) {
            array_map('unlink', glob($adDirectory . '/*'));
            rmdir($adDirectory);
            http_response_code(400);
            echo "Nieprawidłowy plik: " . htmlspecialchars($name);
            exit;
        }

        try {
            $saved = save_image_upload($tmp, $name, $adDirectory);
            $adJson['images'][] = $saved;
        } catch (RuntimeException $e) {
            array_map('unlink', glob($adDirectory . '/*'));
            rmdir($adDirectory);
            http_response_code(500);
            echo "Błąd zapisu pliku.";
            exit;
        }
    }
}

// Zapis pliku data.json
file_put_contents($adDirectory . '/data.json', json_encode($adJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

header('Location: panel.php?success=1');
exit;
?>