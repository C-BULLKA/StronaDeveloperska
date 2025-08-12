Jasne, oto poprawiony kod pliku `panel.php`, który zawiera teraz obsługę statusów dla obu inwestycji: "Osiedle Na Ścieżki" oraz "Osiedle Juraszki".

Zgodnie z prośbą, istniejący kod został w większości nietknięty. Dodałem nową, osobną sekcję do zarządzania statusami dla "Osiedla Juraszki" tuż pod istniejącym formularzem.

-----

### Poprawiony `panel.php`

```php
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Administracyjny | TarnowskiDeveloper</title>
    <link rel="stylesheet" href="style.css">
    <style>
        /* W sekcji <style> */
.segment-status-form {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-top: 30px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
}
</style>
</head>
<body>
    <header class="main-header">
        <div class="container">
            <a href="index.html" class="logo">TarnowskiDeveloper</a>
            <nav class="main-nav">
                <ul>
                    <li><a href="index.html#about">O Inwestycji</a></li>
                    <li><a href="index.html#location">Lokalizacja</a></li>
                    <li><a href="ogloszenia.php">Ogłoszenia</a></li>
                    <li><a href="panel.php">Panel Admina</a></li>
                    <li><a href="panel.php#contact" class="btn btn-accent">Kontakt</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section class="page-header visible">
            <div class="container">
                <h1>Panel Administracyjny</h1>
                <?php
                session_start();
                if (isset($_SESSION['zalogowany']) && $_SESSION['zalogowany'] === true): ?>
                    <p>Jesteś zalogowany. Możesz zarządzać ogłoszeniami i statusami inwestycji.</p>
                    <a href="wyloguj.php" class="btn btn-secondary">Wyloguj</a>
                <?php else: ?>
                    <p>Zaloguj się, aby zarządzać ogłoszeniami.</p>
                <?php endif; ?>
            </div>
        </section>

        <section class="visible">
            <div class="container">
                <?php if (isset($_SESSION['zalogowany']) && $_SESSION['zalogowany'] === true): ?>
                    <div class="form-section">
                        <h2>Dodaj nowe ogłoszenie</h2>
                        <?php if(isset($_GET['success'])): ?>
                            <p class="success-message">Ogłoszenie zostało pomyślnie dodane!</p>
                        <?php endif; ?>
                        <form action="dodaj_ogloszenia.php" method="POST" enctype="multipart/form-data" class="add-listing-form">
                            <input type="text" name="title" placeholder="Tytuł ogłoszenia" required>
                            <input type="text" name="location" placeholder="Lokalizacja, np. Tarnów" required>
                            <input type="text" name="address" placeholder="Dokładny adres, np. Rynek 1, Tarnów" required>
                            <input type="number" name="price" placeholder="Cena (PLN)" required>
                            <input type="number" name="rooms" placeholder="Liczba pokoi" required>
                            <input type="number" name="area" placeholder="Powierzchnia (m²)" required>
                            <textarea name="description" placeholder="Opis nieruchomości" rows="5" required></textarea>
                            <label for="images">Zdjęcia (możesz wybrać wiele):</label>
                            <input type="file" name="images[]" id="images" multiple required>
                            <fieldset>
                                <legend>Wyposażenie</legend>
                                <label><input type="checkbox" name="features[]" value="furnished" title="Mieszkanie w pełni umeblowane"> Umeblowane</label>
                                <label><input type="checkbox" name="features[]" value="developer_condition" title="Mieszkanie gotowe do wykończenia"> Stan developerski</label>
                                <label><input type="checkbox" name="features[]" value="internet" title="Dostęp do szybkiego internetu"> Szybki internet</label>
                            </fieldset>
                            <fieldset>
                                <legend>Lokalizacja</legend>
                                <label><input type="checkbox" name="features[]" value="near_shops" title="W pobliżu sklepy i centra handlowe"> Blisko sklepy</label>
                                <label><input type="checkbox" name="features[]" value="near_transport" title="Dobra komunikacja miejska"> Blisko komunikacja</label>
                                <label><input type="checkbox" name="features[]" value="quiet" title="Spokojna i cicha okolica"> Cicha okolica</label>
                                <label><input type="checkbox" name="features[]" value="near_schools" title="W pobliżu szkoły i przedszkola"> Blisko szkoły</label>
                                <label><input type="checkbox" name="features[]" value="near_parks" title="W pobliżu parki i tereny zielone"> Blisko parki</label>
                            </fieldset>
                            <fieldset>
                                <legend>Udogodnienia</legend>
                                <label><input type="checkbox" name="features[]" value="parking" title="Miejsce parkingowe w cenie"> Miejsce parkingowe</label>
                                <label><input type="checkbox" name="features[]" value="balcony" title="Balkon lub taras"> Balkon</label>
                                <label><input type="checkbox" name="features[]" value="elevator" title="Budynek z windą"> Winda</label>
                                <label><input type="checkbox" name="features[]" value="gym" title="Dostęp do siłowni"> Siłownia</label>
                                <label><input type="checkbox" name="features[]" value="pool" title="Dostęp do basenu"> Basen</label>
                            </fieldset>
                            <fieldset>
                                <legend>Inne</legend>
                                <label><input type="checkbox" name="features[]" value="pet_friendly" title="Zwierzęta są akceptowane"> Przyjazne zwierzętom</label>
                                <label><input type="checkbox" name="features[]" value="security" title="Monitoring i ochrona"> System bezpieczeństwa</label>
                            </fieldset>
                            <button type="submit" class="btn btn-primary">Wyślij ogłoszenie</button>
                        </form>
                    </div>
                <?php else: ?>
                    <div class="login-box">
                        <h2>Logowanie do panelu</h2>
                        <form action="weryfikacja.php" method="POST" class="login-form">
                            <input type="password" name="password" placeholder="Wprowadź hasło" required>
                            <?php if(isset($_GET['error'])): ?>
                                <p class="error-message">Nieprawidłowe hasło.</p>
                            <?php endif; ?>
                            <button type="submit" class="btn btn-primary">Zaloguj się</button>
                        </form>
                    </div>
                <?php endif; ?>
            </div>
            
            <?php if (isset($_SESSION['zalogowany']) && $_SESSION['zalogowany'] === true): ?>
            
            <div class="form-section">
                <h2>Zarządzaj statusami - Osiedle Na Ścieżki</h2>
                <?php
                $statusFile = 'segment_status.json';
                $defaultStatuses = [
                    'L1' => ['B1' => 'available', 'B2' => 'available', 'B3' => 'available', 'B4' => 'available'],
                    'L2' => ['B1' => 'available', 'B2' => 'available', 'B3' => 'available', 'B4' => 'available']
                ];
                
                if (file_exists($statusFile)) {
                    $segmentStatuses = json_decode(file_get_contents($statusFile), true);
                    if (!is_array($segmentStatuses) || !isset($segmentStatuses['L1']) || !isset($segmentStatuses['L2'])) {
                        $segmentStatuses = $defaultStatuses;
                    }
                } else {
                    $segmentStatuses = $defaultStatuses;
                }
                ?>
                <form action="zapisz_statusy.php" method="POST" class="segment-status-form">
                    <h3>Mieszkanie L1 (Parter)</h3>
                    <?php foreach(['B1', 'B2', 'B3', 'B4'] as $segment): ?>
                    <div class="form-group">
                        <label for="status_L1_<?= $segment ?>">Segment <?= $segment ?>:</label>
                        <select name="status[L1][<?= $segment ?>]" id="status_L1_<?= $segment ?>">
                            <option value="available" <?= ($segmentStatuses['L1'][$segment] ?? 'available') === 'available' ? 'selected' : '' ?>>Dostępne</option>
                            <option value="reserved" <?= ($segmentStatuses['L1'][$segment] ?? '') === 'reserved' ? 'selected' : '' ?>>Rezerwacja</option>
                            <option value="sold" <?= ($segmentStatuses['L1'][$segment] ?? '') === 'sold' ? 'selected' : '' ?>>Sprzedane</option>
                        </select>
                    </div>
                    <?php endforeach; ?>
                    
                    <h3>Mieszkanie L2 (Piętro)</h3>
                    <?php foreach(['B1', 'B2', 'B3', 'B4'] as $segment): ?>
                    <div class="form-group">
                        <label for="status_L2_<?= $segment ?>">Segment <?= $segment ?>:</label>
                        <select name="status[L2][<?= $segment ?>]" id="status_L2_<?= $segment ?>">
                            <option value="available" <?= ($segmentStatuses['L2'][$segment] ?? 'available') === 'available' ? 'selected' : '' ?>>Dostępne</option>
                            <option value="reserved" <?= ($segmentStatuses['L2'][$segment] ?? '') === 'reserved' ? 'selected' : '' ?>>Rezerwacja</option>
                            <option value="sold" <?= ($segmentStatuses['L2'][$segment] ?? '') === 'sold' ? 'selected' : '' ?>>Sprzedane</option>
                        </select>
                    </div>
                    <?php endforeach; ?>
                    <button type="submit" class="btn btn-primary">Zapisz statusy "Na Ścieżki"</button>
                </form>
            </div>

            <div class="form-section" style="margin-top: 50px; border-top: 2px solid #ddd; padding-top: 30px;">
                <h2>Zarządzaj statusami lokali - Osiedle Juraszki</h2>
                <?php
                // Definicja pliku i statusów domyślnych dla Juraszki
                $juraszkiStatusFile = 'juraszki_status.json';
                $juraszkiDefaultStatuses = [
                    'B1L1' => 'available',
                    'B1L2' => 'available',
                    'B2L1' => 'available',
                    'B2L2' => 'available'
                ];
                
                // Wczytywanie aktualnych statusów z pliku JSON dla Juraszki
                if (file_exists($juraszkiStatusFile)) {
                    $juraszkiStatuses = json_decode(file_get_contents($juraszkiStatusFile), true) ?: $juraszkiDefaultStatuses;
                } else {
                    $juraszkiStatuses = $juraszkiDefaultStatuses;
                }
                ?>
                <form action="zapisz_statusy_juraszki.php" method="POST" class="segment-status-form">
                    <?php foreach($juraszkiStatuses as $unitId => $status): ?>
                    <div class="form-group">
                        <label for="status_<?= $unitId ?>">Lokal <?= $unitId ?>:</label>
                        <select name="status[<?= $unitId ?>]" id="status_<?= $unitId ?>">
                            <option value="available" <?= $status === 'available' ? 'selected' : '' ?>>Dostępny</option>
                            <option value="reserved" <?= $status === 'reserved' ? 'selected' : '' ?>>Rezerwacja</option>
                            <option value="sold" <?= $status === 'sold' ? 'selected' : '' ?>>Sprzedany</option>
                        </select>
                    </div>
                    <?php endforeach; ?>
                    
                    <button type="submit" class="btn btn-primary">Zapisz statusy "Juraszki"</button>
                </form>
            </div>
            
            <?php endif; ?>
        </section>
    </main>

    <footer class="footer">
        <div class="nav-container">
            <p>&copy; 2025 TarnowskiDeveloper. Created by Piotr Cebula. Wszelkie prawa zastrzeżone.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
```