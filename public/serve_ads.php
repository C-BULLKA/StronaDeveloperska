<?php
// Zwraca listę ogłoszeń z ../uploads_ogloszenia
$uploadsRoot = realpath(__DIR__ . '/../uploads_ogloszenia');
if ($uploadsRoot === false || !is_dir($uploadsRoot)) {
    header('Content-Type: application/json; charset=utf-8', true, 500);
    echo json_encode(['error' => 'uploads directory missing']);
    exit;
}

$dirs = array_values(array_filter(scandir($uploadsRoot), function($n){
    return $n !== '.' && $n !== '..';
}));

$result = [];
foreach ($dirs as $d) {
    $adDir = $uploadsRoot . DIRECTORY_SEPARATOR . $d;
    if (!is_dir($adDir)) continue;
    $jsonFile = $adDir . DIRECTORY_SEPARATOR . 'data.json';
    if (!is_file($jsonFile)) continue;
    $data = json_decode(file_get_contents($jsonFile), true);
    if (!is_array($data)) continue;
    $images = [];
    foreach (($data['images'] ?? []) as $img) {
        $images[] = 'serve_image.php?file=' . rawurlencode($d . '/' . $img);
    }
    $data['images'] = $images;
    $data['folder'] = $d;
    $result[] = $data;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($result, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
exit;
?>