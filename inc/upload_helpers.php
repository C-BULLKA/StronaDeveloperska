<?php
function is_allowed_image_file(string $tmpPath, string $originalName): bool {
    if (!is_uploaded_file($tmpPath)) return false;

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($tmpPath);
    $allowed_mime = ['image/jpeg','image/png','image/gif'];
    if (!in_array($mime, $allowed_mime, true)) return false;

    $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    $allowed_ext = ['jpg','jpeg','png','gif'];
    if (!in_array($ext, $allowed_ext, true)) return false;

    return true;
}

function save_image_upload(string $tmpPath, string $originalName, string $destDir): string {
    if (!is_dir($destDir) && !mkdir($destDir, 0750, true)) {
        throw new RuntimeException('Nie można utworzyć katalogu docelowego.');
    }

    $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    $newName = bin2hex(random_bytes(16)) . '.' . $ext;
    $destPath = rtrim($destDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $newName;

    if (!move_uploaded_file($tmpPath, $destPath)) {
        throw new RuntimeException('Błąd zapisu pliku.');
    }

    chmod($destPath, 0644);
    return $newName;
}
?>