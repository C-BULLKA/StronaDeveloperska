<?php
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Ogłoszenia</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style_index.css">
    <link rel="stylesheet" href="menu.css">
    <link rel="stylesheet" href="style_ogloszenia.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
</head>
<body>
    <header class="header" id="header">
        <nav class="nav-container">
            <a href="index.html" class="logo">
                <img class="logo_img" src="podstawowe_zdjęcia/logo_Tarnowski.png" alt="Logo">
                <span style="color: var(--primary-gold);">Deweloper</span>Tarnów
            </a>
            <ul class="nav-menu" id="nav-menu">
                <li><a href="index.html#about" class="nav-link">O nas</a></li>
                <li><a href="index.html#investments" class="nav-link">Inwestycje</a></li>
                <li><a href="ogloszenia.php" class="nav-link">Ogłoszenia</a></li>
                <li><a href="index.html#contact" class="nav-link">Kontakt</a></li>
            </ul>
            <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
                <i class="fas fa-bars"></i>
            </button>
        </nav>
    </header>

    <main>
        <section class="page-header visible" style="background: var(--light-gray); text-align: center; padding: 6rem 0;">
            <div class="container">
                <h1 class="section-title">Dostępne lokale</h1>
                <p class="section-subtitle">Znajdź swoją wymarzoną nieruchomość pośród naszych aktualnych ofert.</p>
            </div>
        </section>

        <section class="apartments-section">
            <div class="apartments-container">
                <div id="ads-container" class="apartments-grid">
                    <?php
                        $baseDir = __DIR__ . '/../ogloszenia/';
                        if (is_dir($baseDir)) {
                            $ads = array_diff(scandir($baseDir), array('..', '.'));
                            if (empty($ads)) {
                                echo '<p>Aktualnie brak dostępnych ofert.</p>';
                            } else {
                                foreach ($ads as $adFolder) {
                                    $adPath = $baseDir . $adFolder . '/';
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
                                        } else { continue; }

                                        $image_files = glob($adPath . '/*.{jpg,jpeg,png,gif}', GLOB_BRACE);
                                        $image_urls = [];
                                        if (!empty($image_files)) {
                                            $firstImage = $image_files[0];
                                            $filename = basename($firstImage);
                                            $main_image = 'serve_image.php?file=' . urlencode($adFolder . '/' . $filename);
                                            foreach ($image_files as $imgpath) {
                                                $image_urls[] = 'serve_image.php?file=' . urlencode($adFolder . '/' . basename($imgpath));
                                            }
                                        } else {
                                            $main_image = 'https://via.placeholder.com/600x400.png?text=Brak+zdj%C4%99cia';
                                        }
                                        $features = isset($ad_data['cechy']) ? explode(', ', $ad_data['cechy']) : [];

                                        $feature_labels = [
                                            'furnished' => 'Umeblowane',
                                            'developer_condition' => 'Stan developerski',
                                            'internet' => 'Szybki internet',
                                            'energy_efficient' => 'Energooszczędne',
                                            'near_shops' => 'Blisko sklepy',
                                            'near_transport' => 'Blisko komunikacja',
                                            'quiet' => 'Cicha okolica',
                                            'near_schools' => 'Blisko szkoły',
                                            'near_parks' => 'Blisko parki',
                                            'parking' => 'Miejsce parkingowe',
                                            'balcony' => 'Balkon',
                                            'elevator' => 'Winda',
                                            'gym' => 'Siłownia',
                                            'pool' => 'Basen',
                                            'pet_friendly' => 'Przyjazne zwierzętom',
                                            'security' => 'System bezpieczeństwa'
                                        ];

                                        echo '<div class="apartment-card">';
                                        echo '    <div class="apartment-image" style="background-image: url(\'' . htmlspecialchars($main_image) . '\');">';
                                        echo '        <span class="apartment-badge">' . htmlspecialchars(number_format($ad_data['cena'] ?? 0, 0, ',', ' ')) . ' PLN</span>';
                                        echo '    </div>';
                                        echo '    <div class="apartment-content">';
                                        echo '        <h3 class="apartment-title">' . htmlspecialchars($ad_data['tytuł'] ?? 'Brak tytułu') . '</h3>';
                                        echo '        <p class="apartment-floor"><i class="fas fa-map-marker-alt"></i> ' . htmlspecialchars($ad_data['adres'] ?? 'Brak adresu') . '</p>';
                                        echo '        <div class="apartment-specs" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 1.5rem;">';
                                        echo '            <div class="spec-item"><div class="spec-value">' . htmlspecialchars($ad_data['pokoje'] ?? '?') . '</div><div class="spec-label">pokoje</div></div>';
                                        echo '            <div class="spec-item"><div class="spec-value">' . htmlspecialchars($ad_data['powierzchnia'] ?? '?') . '</div><div class="spec-label">m²</div></div>';
                                        echo '        </div>';

                                        if (!empty($features)) {
                                            echo '        <div class="ad-features-card">';
                                            foreach ($features as $f) {
                                                $key = trim($f);
                                                $label = isset($feature_labels[$key]) ? $feature_labels[$key] : ucwords(str_replace('_', ' ', $key));
                                                echo '            <span class="feature-badge">' . htmlspecialchars($label) . '</span>';
                                            }
                                            echo '        </div>';
                                        }
                                        echo '        <div class="apartment-actions" style="margin-top: 10px;">';
                                        echo '            <button class="btn-details btn-primary" style="width: 100%; padding: 12px; cursor: pointer; border: none; border-radius: 8px; font-weight: 600;"';
                                        echo '                data-title="' . htmlspecialchars($ad_data['tytuł'] ?? '') . '"';
                                        echo '                data-address="' . htmlspecialchars($ad_data['adres'] ?? '') . '"';
                                        echo '                data-price="' . htmlspecialchars(number_format($ad_data['cena'] ?? 0, 0, ',', ' ')) . ' PLN"';
                                        echo '                data-rooms="' . htmlspecialchars($ad_data['pokoje'] ?? '') . '"';
                                        echo '                data-area="' . htmlspecialchars($ad_data['powierzchnia'] ?? '') . '"';
                                        echo '                data-description="' . htmlspecialchars($ad_data['opis'] ?? 'Brak opisu') . '"';
                                        echo '                data-features="' . htmlspecialchars(implode(',', $features)) . '"';
                                        echo '                data-images="' . htmlspecialchars(json_encode($image_urls)) . '">Zobacz ofertę</button>';
                                        echo '        </div>';
                                        echo '    </div>';
                                        echo '</div>';
                                        }
                                    }
                                }
                            }
                         else {
                            echo '<p>Folder z ogłoszeniami nie istnieje.</p>';
                        }
                    ?>
                </div>
            </div>
        </section>
    </main>

    <div id="ad-modal" class="modal-overlay">
        <div class="modal-content">
            <button class="modal-close-btn" type="button">&times;</button>
            <div class="modal-image-container">
                <img id="modal-main-image" src="" alt="Zdjęcie nieruchomości">
                <button id="prev-image" class="modal-nav-arrow prev" type="button">&#10094;</button>
                <button id="next-image" class="modal-nav-arrow next" type="button">&#10095;</button>
            </div>
            <div class="modal-details">
                <h3 id="modal-title"></h3>
                <p id="modal-location" class="ad-location" style="margin-bottom: 10px; color: #666;"></p>
                <div class="modal-price-tag"><span id="modal-price"></span></div>
                <div class="modal-specs" style="margin: 20px 0; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                    <span style="margin-right: 20px;">Pokoje: <strong id="modal-rooms"></strong></span>
                    <span>Powierzchnia: <strong id="modal-area"></strong> m²</span>
                </div>
                <h4>Cechy</h4>
                <div id="modal-features" class="ad-features" style="margin-bottom: 20px;"></div>
                <h4>Opis</h4>
                <p id="modal-description" style="line-height: 1.6; margin-bottom: 25px;"></p>
                <h4>Lokalizacja na mapie</h4>
                <div id="map"></div>
            </div>
        </div>
    </div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="menu.js"></script>
    <script src="script.js"></script>
<!-- Kontakt -->
    <section id="contact" class="contact-section">
        <div class="contact-container">
            <h2>Masz pytania? Skontaktuj się z nami</h2>
            <p>Jesteśmy do Twojej dyspozycji od poniedziałku do piątku w godzinach 8:00-16:00</p>
            
            <div class="contact-info">
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fas fa-phone-alt"></i>
                    </div>
                    <h4>Telefon</h4>
                    <p>+48 693 933 786</p>
                </div>
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <h4>E-mail</h4>
                    <p>kontakt@tarnowskideveloper.pl</p>
                </div>
            </div>
        </div>
    </section>


    <!-- Footer -->
    <footer class="footer">
        <div class="nav-container">
            <p>&copy; 
                2025 DeweloperTarnow.Created by  <a href="https://github.com/C-BULLKA" target="_blank" class="github-link">Piotr Cebula</a>. Wszelkie prawa zastrzeżone.
                <br>
                Generalni Wykonwacy <img src="../podstawowe_zdjęcia/emb_logo.png" style="height: 5vh;" alt="Logo EMB DEWELOPER">
            </p>
        </div>
    </footer>
</body>
</html>