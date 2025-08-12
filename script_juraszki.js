document.addEventListener('DOMContentLoaded', function() {

    // --- NOWA GŁÓWNA FUNKCJA DO ŁADOWANIA STATUSÓW I TWORZENIA PRZYCISKÓW ---
    function loadUnitStatusesAndButtons() {
        // ZMIANA: Pobieramy dane z ujednoliconego pliku segment_status.json
        fetch('segment_status.json?t=' + new Date().getTime())
            .then(response => {
                if (!response.ok) {
                    throw new Error('Błąd sieci lub nie znaleziono pliku segment_status.json');
                }
                return response.json();
            })
            .then(data => {
                // ZMIANA: Sprawdzamy, czy istnieje klucz 'juraszki'
                if (data && data.juraszki) {
                    const statuses = data.juraszki;
                    const container = document.getElementById('unit-status-buttons');
                    if (!container) return;

                    container.innerHTML = ''; // Wyczyść kontener przed dodaniem nowych przycisków

                    // Klucze z pliku JSON (np. ["B1L1", "B1L2", "B2L1", "B2L2"])
                    const units = Object.keys(statuses);

                    units.forEach(unitId => {
                        const status = statuses[unitId]; // np. "available", "reserved", "sold"
                        
                        const button = document.createElement('button');
                        button.textContent = unitId;
                        // Używamy klasy .btn-segment, która ma już zdefiniowane style statusów
                        button.className = `btn-segment status-${status}`;
                        
                        container.appendChild(button);
                    });
                }
            })
            .catch(error => {
                console.error('Błąd ładowania statusów dla Osiedla Juraszki:', error);
                const container = document.getElementById('unit-status-buttons');
                if(container) container.innerHTML = '<p style="color:red;">Nie udało się wczytać statusów lokali.</p>';
            });
    }

    // --- LOGIKA PRZEŁĄCZANIA OBRAZKÓW W GŁÓWNYM KAFELKU ---
    function setupImageSwitcher() {
        const card = document.querySelector('.apartment-card');
        if (!card) return;

        const images = card.querySelectorAll('.apartment-image-container img');
        if (images.length < 2) return;

        const prevBtn = card.querySelector('.prev-btn');
        const nextBtn = card.querySelector('.next-btn');
        let currentIndex = 0;

        function showImage(index) {
            images.forEach((img, i) => {
                img.classList.toggle('hidden', i !== index);
            });
        }

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Zapobiega otwarciu lightoboxa
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Zapobiega otwarciu lightoboxa
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });
    }
    
    // --- NAPRAWIONA I UPROSZCZONA FUNKCJA LIGHTBOX (POWIĘKSZANIE ZDJĘĆ) ---
    function initializeLightbox() {
        // Zbierz wszystkie zdjęcia, które mają być powiększane
        const imagesToZoom = document.querySelectorAll('.highlight-photo, .pzt-image, .apartment-image-container img');
        
        if (imagesToZoom.length === 0) return;

        // Utwórz elementy lightboxa tylko raz
        const lightbox = document.createElement('div');
        lightbox.id = 'image-lightbox';
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <span class="lightbox-close-btn">&times;</span>
            <img id="lightbox-image" src="" alt="Powiększone zdjęcie">
        `;
        document.body.appendChild(lightbox);
        
        const lightboxImage = lightbox.querySelector('#lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close-btn');

        // Funkcja do zamykania lightboxa
        const closeLightbox = () => {
            lightbox.classList.remove('visible');
        };

        // Dodaj event listener do każdego zdjęcia
        imagesToZoom.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                lightboxImage.src = img.src;
                lightbox.classList.add('visible');
            });
        });
        
        // Eventy do zamknięcia
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            // Zamknij tylko, jeśli kliknięto tło (a nie obrazek)
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Zamknij klawiszem Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });
    }
    
    // Wywołanie wszystkich funkcji po załadowaniu strony
    loadUnitStatusesAndButtons();
    setupImageSwitcher();
    initializeLightbox();
});
/* ================================= 
   LOGIKA DLA RESPONSIVE MENU
==================================== */
document.addEventListener('DOMContentLoaded', function() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    // Funkcja do przełączania menu
    const toggleMenu = () => {
        navMenu.classList.toggle('active');
        // Zmiana ikony hamburgera na 'X' i z powrotem
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    };

    // Przełączanie menu po kliknięciu w przycisk
    if (navToggle) {
        navToggle.addEventListener('click', toggleMenu);
    }

    // Zamykanie menu po kliknięciu w dowolny link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
});