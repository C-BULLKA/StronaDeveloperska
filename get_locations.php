<?php
header('Content-Type: application/json');

$baseDir = 'ogloszenia/';
$unique_locations = [];

if (is_dir($baseDir)) {
    $ads = array_diff(scandir($baseDir), array('..', '.'));
    foreach ($ads as $adFolder) {
        $adPath = $baseDir . $adFolder;
        if (is_dir($adPath)) {
            $dataFile = $adPath . '/data.txt';
            $ad_data = [];
            if (file_exists($dataFile)) {
                $lines = file($dataFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    if (strpos($line, ': ') !== false) {
                        list($key, $value) = explode(': ', $line, 2);
                        $ad_data[trim(strtolower($key))] = trim($value);
                    }
                }
                if (isset($ad_data['lokalizacja']) && !empty($ad_data['lokalizacja'])) {
                    $unique_locations[] = htmlspecialchars($ad_data['lokalizacja']);
                }
            }
        }
    }
    $unique_locations = array_values(array_unique($unique_locations));
}

echo json_encode($unique_locations);
?>