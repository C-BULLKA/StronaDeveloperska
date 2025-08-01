<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Administracyjny | TarnowskiDeveloper</title>
    <link rel="stylesheet" href="style.css">
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
                    <p>Jesteś zalogowany. Możesz dodać nowe ogłoszenie.</p>
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
                            <p style="color: green; font-weight: bold; text-align: center; margin-bottom: 20px;">Ogłoszenie zostało pomyślnie dodane!</p>
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
                    <div style="max-width: 400px; margin: 40px auto; padding: 40px; background-color: var(--color-gray); border-radius: 8px; text-align: center;">
                        <h2>Logowanie do panelu</h2>
                        <form action="weryfikacja.php" method="POST">
                            <input type="password" name="password" placeholder="Wprowadź hasło" required style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 5px;">
                            <?php if(isset($_GET['error'])): ?>
                                <p style="color: red; margin-bottom: 15px;">Nieprawidłowe hasło.</p>
                            <?php endif; ?>
                            <button type="submit" class="btn btn-primary">Zaloguj się</button>
                        </form>
                    </div>
                <?php endif; ?>
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

    <footer class="main-footer">
        <div class="container">
            <p>&copy; 2025 TarnowskiDeveloper. Wszelkie prawa zastrzeżone.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>