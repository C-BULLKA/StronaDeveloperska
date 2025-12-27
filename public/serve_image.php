<?php
// Usage: serve_image.php?file=ad_xxx/abcdef.jpg
if (!isset($_GET['file']) || !is_string($_GET['file'])) {
    http_response_code(400);
    exit;
}

$requested = $_GET['file'];
// Prosty sanitizer: usuń .. i początkowe slashe
$requested = str_replace(['..', '\\'], '', $requested);
$requested = ltrim($requested, '/\\');

// Try multiple base dirs (public/uploads_ogloszenia, public/ogloszenia, ../ogloszenia, ../uploads_ogloszenia)
$cands = [
    __DIR__ . '/uploads_ogloszenia',
    __DIR__ . '/ogloszenia',
    __DIR__ . '/../ogloszenia',
    __DIR__ . '/../uploads_ogloszenia'
];
$baseDir = false;
foreach ($cands as $c) {
    $r = realpath($c);
    if ($r !== false && is_dir($r)) { $baseDir = $r; break; }
}
if ($baseDir === false) { http_response_code(404); exit; }

// Rozdziel podkatalog i nazwę pliku
$parts = explode('/', $requested, 2);
if (count($parts) !== 2) { http_response_code(404); exit; }
$subdir = $parts[0];
$filename = basename($parts[1]);

$fullDir = realpath($baseDir . DIRECTORY_SEPARATOR . $subdir);
if ($fullDir === false || strpos($fullDir, $baseDir) !== 0) { http_response_code(404); exit; }

$fullPath = $fullDir . DIRECTORY_SEPARATOR . $filename;
if (!is_file($fullPath)) { http_response_code(404); exit; }

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($fullPath);
$allowed = ['image/jpeg','image/png','image/gif'];
if (!in_array($mime, $allowed, true)) { http_response_code(403); exit; }

header('Content-Type: ' . $mime);
header('Content-Length: ' . filesize($fullPath));
header('Cache-Control: public, max-age=86400');
readfile($fullPath);
exit;
?>