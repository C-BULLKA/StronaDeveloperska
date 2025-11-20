<?php
<?php
// Przechowuje hash hasła admina poza public.
// Przy pierwszym uruchomieniu zapisze domyślny hash dla 'admin' do inc/admin_pass.hash.
// Zmodyfikuj zawartość inc/admin_pass.hash, by ustawić własne hasło:
//   php -r "echo password_hash('TwojeHaslo', PASSWORD_DEFAULT).PHP_EOL;"
$hashFile = __DIR__ . '/admin_pass.hash';
if (!file_exists($hashFile)) {
    // domyślne hasło: 'admin' - wygeneruj hash i zapisz (zmień na produkcji)
    file_put_contents($hashFile, password_hash('admin', PASSWORD_DEFAULT));
}
define('ADMIN_PASSWORD_HASH', trim(file_get_contents($hashFile)));
?>