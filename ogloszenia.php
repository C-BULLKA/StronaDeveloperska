<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ogłoszenia Nieruchomości | TarnowskiDeveloper</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
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
                    <li><a href="#contact" class="btn btn-accent">Kontakt</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section class="page-header visible">
            <div class="container">
                <h1>Dostępne lokale</h1>
                <p>Znajdź swoją wymarzoną nieruchomość</p>
            </div>
        </section>

        <section class="listings-section visible">
            <div class="container">
                <div class="listings-grid">
                    <?php
                        $baseDir = 'ogloszenia/';
                        $feature_labels = [
                            'furnished' => '<i class="fas fa-couch"></i> Umeblowane',
                            'developer_condition' => '<i class="fas fa-paint-roller"></i> Stan developerski',
                            'internet' => '<i class="fas fa-wifi"></i> Szybki internet',
                            'energy_efficient' => '<i class="fas fa-leaf"></i> Energooszczędne',
                            'near_shops' => '<i class="fas fa-shopping-bag"></i> Blisko sklepy',
                            'near_transport' => '<i class="fas fa-bus"></i> Blisko komunikacja',
                            'quiet' => '<i class="fas fa-volume-mute"></i> Cicha okolica',
                            'near_schools' => '<i class="fas fa-school"></i> Blisko szkoły',
                            'near_parks' => '<i class="fas fa-tree"></i> Blisko parki',
                            'parking' => '<i class="fas fa-parking"></i> Miejsce parkingowe',
                            'balcony' => '<i class="fas fa-door-open"></i> Balkon',
                            'elevator' => '<i class="fas fa-elevator"></i> Winda',
                            'gym' => '<i class="fas fa-dumbbell"></i> Siłownia',
                            'pool' => '<i class="fas fa-swimming-pool"></i> Basen',
                            'pet_friendly' => '<i class=" fas fa-paw"></i> Przyjazne zwierzętom',
                            'security' => '<i class="fas fa-shield-alt"></i> System bezpieczeństwa',
                        ];
                        $feature_groups = [
                            'Wyposażenie' => ['furnished', 'developer_condition', 'internet', 'energy_efficient'],
                            'Lokalizacja' => ['near_shops', 'near_transport', 'quiet', 'near_schools', 'near_parks'],
                            'Udogodnienia' => ['parking', 'balcony', 'elevator', 'gym', 'pool'],
                            'Inne' => ['pet_friendly', 'security'],
                        ];

                        if (is_dir($baseDir)) {
                            $ads = array_diff(scandir($baseDir), array('..', '.'));
                            if (empty($ads)) {
                                echo '<p>Aktualnie brak dostępnych ofert.</p>';
                            } else {
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
                                        } else { continue; }

                                        $image_files = glob($adPath . '/*.{jpg,jpeg,png,gif}', GLOB_BRACE);
                                        $main_image = !empty($image_files) ? $image_files[0] : 'https://via.placeholder.com/400x250.png?text=Brak+zdj%C4%99cia';
                                        $features = isset($ad_data['cechy']) ? explode(', ', $ad_data['cechy']) : [];

                                        echo '<div class="ad-card">';
                                        echo '    <div class="ad-image">';
                                        echo '        <img src="' . htmlspecialchars($main_image) . '" alt="Zdjęcie nieruchomości">';
                                        echo '        <span class="ad-price">' . htmlspecialchars(number_format($ad_data['cena'] ?? 0, 0, ',', ' ')) . ' PLN</span>';
                                        echo '    </div>';
                                        echo '    <div class="ad-content">';
                                        echo '        <h3>' . htmlspecialchars($ad_data['tytuł'] ?? 'Brak tytułu') . '</h3>';
                                        echo '        <p class="ad-location">' . htmlspecialchars($ad_data['lokalizacja'] ?? 'Brak lokalizacji') . '</p>';
                                        echo '        <div class="ad-details">';
                                        echo '            <span><strong>' . htmlspecialchars($ad_data['pokoje'] ?? '?') . '</strong> pokoi</span>';
                                        echo '            <span><strong>' . htmlspecialchars($ad_data['powierzchnia'] ?? '?') . '</strong> m²</span>';
                                        echo '        </div>';
                                        echo '        <div class="ad-features">';
                                        foreach ($feature_groups as $group => $group_features) {
                                            $group_has_features = array_intersect($group_features, $features);
                                            if (!empty($group_has_features)) {
                                                echo "<div class='feature-group'><h4>$group</h4>";
                                                foreach ($group_has_features as $feature) {
                                                    echo '<span class="feature-badge">' . $feature_labels[$feature] . '</span>';
                                                }
                                                echo "</div>";
                                            }
                                        }
                                        echo '        </div>';
                                        echo '        <a href="#" class="btn btn-secondary btn-details"';
                                        echo '            data-title="' . htmlspecialchars($ad_data['tytuł'] ?? '') . '"';
                                        echo '            data-location="' . htmlspecialchars($ad_data['lokalizacja'] ?? '') . '"';
                                        echo '            data-address="' . htmlspecialchars($ad_data['adres'] ?? '') . '"';
                                        echo '            data-price="' . htmlspecialchars(number_format($ad_data['cena'] ?? 0, 0, ',', ' ')) . ' PLN"';
                                        echo '            data-rooms="' . htmlspecialchars($ad_data['pokoje'] ?? '') . '"';
                                        echo '            data-area="' . htmlspecialchars($ad_data['powierzchnia'] ?? '') . '"';
                                        echo '            data-description="' . htmlspecialchars($ad_data['opis'] ?? 'Brak opisu') . '"';
                                        echo '            data-features="' . htmlspecialchars(implode(', ', $features)) . '"';
                                        echo '            data-images="' . htmlspecialchars(json_encode($image_files)) . '">Zobacz szczegóły</a>';
                                        echo '    </div>';
                                        echo '</div>';
                                    }
                                }
                            }
                        } else {
                            echo '<p>Folder z ogłoszeniami nie istnieje.</p>';
                        }
                    ?>
                </div>
            </div>
        </section>

        <section id="contact" class="contact-section">
            <div class="container">
                <h2>Skontaktuj się z nami</h2>
                <form class="contact-form">
                    <input type="text" placeholder="Imię" required>
                    <input type="email" placeholder="E-mail" required>
                    <textarea placeholder="Twoja wiadomość" rows="5"></textarea>
                    <button type="submit" class="btn btn-primary">Wyślij</button>
                </form>
            </div>
        </section>
    </main>

    <div id="ad-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content">
            <button class="modal-close-btn">&times;</button>
            <div class="modal-image-container">
                <img id="modal-main-image" src="" alt="Zdjęcie nieruchomości">
                <button id="prev-image" class="modal-nav-arrow prev">&#10094;</button>
                <button id="next-image" class="modal-nav-arrow next">&#10095;</button>
            </div>
            <div class="modal-details">
                <h3 id="modal-title"></h3>
                <p id="modal-location" class="ad-location"></p>
                <div class="modal-price-tag">
                    <span id="modal-price"></span>
                </div>
                <div class="modal-specs">
                    <span>Pokoje: <strong id="modal-rooms"></strong></span>
                    <span>Powierzchnia: <strong id="modal-area"></strong> m²</span>
                </div>
                <h4>Cechy</h4>
                <div id="modal-features" class="ad-features"></div>
                <h4>Opis</h4>
                <p id="modal-description"></p>
                <h4>Lokalizacja na mapie</h4>
                <div id="map" style="height: 300px;"></div>
            </div>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container">
            <p>&copy; 2025 TarnowskiDeveloper. Wszelkie prawa zastrzeżone.</p>
        </div>
    </footer>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="script.js"></script>
</body>
</html>