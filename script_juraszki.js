document.addEventListener('DOMContentLoaded', function() {

    // --- FUNKCJA DO ŁADOWANIA STATUSÓW I TWORZENIA PRZYCISKÓW ---
    function loadUnitStatusesAndButtons() {
        fetch('segment_status.json?t=' + new Date().getTime())
            .then(response => {
                if (!response.ok) {
                    throw new Error('Błąd sieci lub nie znaleziono pliku segment_status.json');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.juraszki) {
                    const statuses = data.juraszki;
                    const container = document.getElementById('unit-status-buttons');
                    if (!container) return;

                    container.innerHTML = ''; // Wyczyść kontener

                    const units = Object.keys(statuses);

                    units.forEach(unitId => {
                        const status = statuses[unitId];
                        const button = document.createElement('button');
                        button.textContent = unitId;
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
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });
    }
    
    // --- LIGHTBOX Z POPRAWIONĄ LOGIKĄ GALERII ---
    function initializeLightbox() {
        // ZMIANA: Poprawiamy selektor, aby pasował do Twojego HTML (używasz .investment-photos)
        const imagesToZoom = document.querySelectorAll('.investment-photos img, .pzt-image, .apartment-image-container img');
        if (imagesToZoom.length === 0) return;

        // Utwórz elementy lightboxa tylko raz i dodaj do strony
        const lightbox = document.createElement('div');
        lightbox.id = 'image-lightbox';
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <span class="lightbox-close-btn">&times;</span>
            <span class="lightbox-prev-btn">&#10094;</span>
            <img id="lightbox-image" src="" alt="Powiększone zdjęcie">
            <span class="lightbox-next-btn">&#10095;</span>
        `;
        document.body.appendChild(lightbox);
        
        const lightboxImage = lightbox.querySelector('#lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close-btn');
        const prevBtn = lightbox.querySelector('.lightbox-prev-btn');
        const nextBtn = lightbox.querySelector('.lightbox-next-btn');
        
        // Zamykanie lightboxa
        const closeLightbox = () => lightbox.classList.remove('visible');
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Dodajemy listener do każdego zdjęcia, które może być powiększone
        imagesToZoom.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function(event) {
                const clickedImage = event.target;

                // === NAJWAŻNIEJSZA ZMIANA JEST TUTAJ ===
                // Dynamicznie ustalamy, co jest naszą bieżącą galerią
                let currentGallery = [];
                const apartmentContainer = clickedImage.closest('.apartment-image-container');
                const carouselContainer = clickedImage.closest('.carousel-track');

                if (apartmentContainer) {
                    // Jeśli kliknięto obrazek w kafelku, galerią są tylko obrazki z tego kafelka
                    currentGallery = Array.from(apartmentContainer.querySelectorAll('img'));
                } else if (carouselContainer) {
                    // Jeśli kliknięto obrazek w karuzeli, galerią są tylko obrazki z tej karuzeli
                    currentGallery = Array.from(carouselContainer.querySelectorAll('img'));
                } else {
                    // W każdym innym przypadku (np. PZT), to pojedynczy obrazek bez galerii
                    currentGallery = [clickedImage];
                }

                let currentIndex = currentGallery.findIndex(item => item.src === clickedImage.src);
                
                // Funkcje do pokazywania i nawigacji
                function showImage(index) {
                    currentIndex = index;
                    lightboxImage.src = currentGallery[index].src;
                    
                    // Pokaż strzałki tylko, jeśli w bieżącej galerii jest więcej niż 1 zdjęcie
                    const showNavigation = currentGallery.length > 1;
                    prevBtn.style.display = showNavigation ? 'block' : 'none';
                    nextBtn.style.display = showNavigation ? 'block' : 'none';
                }

                const showNextImage = () => showImage((currentIndex + 1) % currentGallery.length);
                const showPrevImage = () => showImage((currentIndex - 1 + currentGallery.length) % currentGallery.length);
                
                // Ustawiamy event listenery dla strzałek TYLKO dla tej sesji lightboxa
                prevBtn.onclick = showPrevImage;
                nextBtn.onclick = showNextImage;
                
                // Obsługa klawiatury
                function keydownHandler(e) {
                    if (!lightbox.classList.contains('visible')) return;
                    
                    if (e.key === 'Escape') closeLightbox();
                    if (currentGallery.length > 1) {
                        if (e.key === 'ArrowRight') showNextImage();
                        if (e.key === 'ArrowLeft') showPrevImage();
                    }
                }
                
                // Nasłuchuj klawiatury tylko, gdy lightbox jest otwarty
                document.addEventListener('keydown', keydownHandler);
                lightbox.addEventListener('transitionend', () => {
                    if (!lightbox.classList.contains('visible')) {
                        document.removeEventListener('keydown', keydownHandler);
                    }
                }, { once: true });


                // Pokaż pierwsze kliknięte zdjęcie i otwórz lightbox
                showImage(currentIndex);
                lightbox.classList.add('visible');
            });
        });
    }
    
    // Wywołanie wszystkich funkcji po załadowaniu strony
    loadUnitStatusesAndButtons();
    setupImageSwitcher();
    initializeLightbox();
});