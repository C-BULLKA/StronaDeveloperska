<?php
// Try multiple candidate directories (works when site is served from `public/` or from project root)
$candidates = [
    __DIR__ . '/uploads_ogloszenia',    // public/uploads_ogloszenia
    __DIR__ . '/ogloszenia',            // public/ogloszenia
    __DIR__ . '/../uploads_ogloszenia', // ../uploads_ogloszenia
    __DIR__ . '/../ogloszenia'          // ../ogloszenia
];

$uploadsRoot = false;
foreach ($candidates as $cand) {
    $real = realpath($cand);
    if ($real !== false && is_dir($real)) { $uploadsRoot = $real; break; }
}

if ($uploadsRoot === false) {
    // return empty list instead of 500 so front-end can handle gracefully
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([]);
    exit;
}

$entries = array_values(array_filter(scandir($uploadsRoot), function($n){
    return $n !== '.' && $n !== '..';
}));

$result = [];
foreach ($entries as $d) {
    $adDir = $uploadsRoot . DIRECTORY_SEPARATOR . $d;
    if (!is_dir($adDir)) continue;

    // Prefer data.json, but accept legacy data.txt (key: value lines)
    $jsonFile = $adDir . DIRECTORY_SEPARATOR . 'data.json';
    $txtFile = $adDir . DIRECTORY_SEPARATOR . 'data.txt';

    $data = null;
    if (is_file($jsonFile)) {
        $data = json_decode(file_get_contents($jsonFile), true);
    } elseif (is_file($txtFile)) {
        $lines = array_map('trim', file($txtFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES));
        $obj = [];
        foreach ($lines as $line) {
            // split at first ':'
            $pos = strpos($line, ':');
            if ($pos === false) continue;
            $key = trim(substr($line, 0, $pos));
            $val = trim(substr($line, $pos + 1));
            // map some Polish keys to expected fields
            $map = [
                'Tytuł' => 'title',
                'Tytul' => 'title',
                'Lokalizacja' => 'location',
                'Cena' => 'price',
                'Pokoje' => 'rooms',
                'Powierzchnia' => 'area',
                'Opis' => 'description'
            ];
            $k = $map[$key] ?? strtolower(preg_replace('/[^a-z0-9]+/i', '_', $key));
            $obj[$k] = $val;
        }
        $data = $obj;
    }

    if (!is_array($data)) continue;

    // collect images present in directory (common extensions)
    $images = [];
    $files = array_values(array_filter(scandir($adDir), function($f){
        $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
        return in_array($ext, ['jpg','jpeg','png','gif','webp']);
    }));
    foreach ($files as $f) {
        $images[] = 'serve_image.php?file=' . rawurlencode($d . '/' . $f);
    }
    // if data contains images array, merge/convert
    if (!empty($data['images']) && is_array($data['images'])) {
        foreach ($data['images'] as $img) {
            $images[] = 'serve_image.php?file=' . rawurlencode($d . '/' . $img);
        }
    }

    $data['images'] = array_values(array_unique($images));
    $data['folder'] = $d;
    $result[] = $data;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($result, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
exit;
?>