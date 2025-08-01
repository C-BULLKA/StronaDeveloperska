<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['title'], $_POST['location'], $_POST['address'], $_POST['price'], $_POST['rooms'], $_POST['area'], $_FILES['images'])) {

        $title = $_POST['title'];
        $location = $_POST['location'];
        $address = $_POST['address'];
        $price = $_POST['price'];
        $rooms = $_POST['rooms'];
        $area = $_POST['area'];
        $description = $_POST['description'] ?? 'Brak opisu.';
        $features = isset($_POST['features']) ? implode(', ', $_POST['features']) : '';

        $sanitizedTitle = preg_replace('/[^a-zA-Z0-9-]/', '_', $title);
        $folderName = 'ad_' . time() . '_' . $sanitizedTitle;
        $adDirectory = 'ogloszenia/' . $folderName;

        if (!is_dir($adDirectory)) {
            mkdir($adDirectory, 0777, true);
        }

        $adData = "Tytuł: " . $title . "\n";
        $adData .= "Lokalizacja: " . $location ." \n";
        $adData .= "Adres: " . $address . "\n";
        $adData .= "Cena: " . $price . "\n";
        $adData .= "Pokoje: " . $rooms . "\n";
        $adData .= "Powierzchnia: " . $area . "\n";
        $adData .= "Opis: " . $description . "\n";
        $adData .= "Cechy: " . $features . "\n";

        file_put_contents($adDirectory . '/data.txt', $adData);

        $imageCount = count($_FILES['images']['name']);
        for ($i = 0; $i < $imageCount; $i++) {
            $imageTmpName = $_FILES['images']['tmp_name'][$i];
            $imageName = basename($_FILES['images']['name'][$i]);
            $imagePath = $adDirectory . '/' . $imageName;

            move_uploaded_file($imageTmpName, $imagePath);
        }

        header('Location: panel.php?success=1');
        exit;
    } else {
        echo "Błąd: Niekompletne dane formularza.";
    }
} else {
    echo "Błąd: Dostęp tylko przez formularz POST.";
}
?>