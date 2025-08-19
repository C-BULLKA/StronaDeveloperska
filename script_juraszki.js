document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const apartments = document.querySelectorAll('.apartment-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Activate the clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            apartments.forEach(apartment => {
                const rooms = apartment.getAttribute('data-rooms');
                const status = apartment.getAttribute('data-status');

                let show = false;
                if (filter === 'all') {
                    show = true;
                } else if (filter === 'available' && status === 'available') {
                    show = true;
                } else if (rooms === filter) {
                    show = true;
                }

                apartment.style.display = show ? 'block' : 'none';
            });
        });
    });

    // Image switching logic
    const apartmentCards = document.querySelectorAll('.apartment-card');
    apartmentCards.forEach(card => {
        const images = card.querySelectorAll('.apartment-image-container img');
        const prevBtn = card.querySelector('.prev-btn');
        const nextBtn = card.querySelector('.next-btn');
        let currentIndex = 0;

        prevBtn.addEventListener('click', () => {
            images[currentIndex].classList.add('hidden');
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            images[currentIndex].classList.remove('hidden');
        });

        nextBtn.addEventListener('click', () => {
            images[currentIndex].classList.add('hidden');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.remove('hidden');
        });
    });

    // Funkcja ładująca statusy segmentów i generująca przyciski
    function loadSegmentStatuses() {
        fetch('segment_status.json?t=' + new Date().getTime()) 
            .then(response => response.json())
            .then(data => {
                // ZMIANA: Sprawdzamy, czy istnieje klucz 'naSciezki' i przekazujemy odpowiednie dane
                if (data && data.naSciezki) {
                    updateSegmentButtons('L1', data.naSciezki.L1);
                    updateSegmentButtons('L2', data.naSciezki.L2);
                }
            })
            .catch(error => {
                console.error('Błąd ładowania statusów:', error);
            });
    }

    function updateSegmentButtons(apartmentId, statusData) {
        const container = document.getElementById(`segment-buttons-${apartmentId}`);
        if (!container) return;

        container.innerHTML = ''; // Wyczyść kontener

        // Dla każdego segmentu (B1, B2, B3, B4) utwórz przycisk
        ['B1', 'B2', 'B3', 'B4'].forEach(segment => {
            const status = statusData && statusData[segment] ? statusData[segment] : 'available';
            const button = document.createElement('button');
            button.className = `btn-segment status-${status}`;
            button.textContent = segment;
            container.appendChild(button);
        });
    }

    // Wywołaj funkcję ładującą statusy
    loadSegmentStatuses();

    // Lightbox dla zdjęć inwestycji i PZT
    function enableLightbox(selector) {
        document.querySelectorAll(selector).forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function() {
                let lightbox = document.getElementById('image-lightbox');
                if (!lightbox) {
                    lightbox = document.createElement('div');
                    lightbox.id = 'image-lightbox';
                    lightbox.className = 'lightbox-overlay';
                    lightbox.innerHTML = `
                        <img id="lightbox-image" src="" alt="Powiększone zdjęcie">
                        <button class="lightbox-close-btn" style="position:absolute;top:20px;right:30px;font-size:2rem;background:none;border:none;color:white;cursor:pointer;">&times;</button>
                    `;
                    document.body.appendChild(lightbox);
                }
                const lightboxImage = lightbox.querySelector('#lightbox-image');
                const lightboxCloseBtn = lightbox.querySelector('.lightbox-close-btn');
                lightboxImage.src = img.src;
                lightbox.classList.add('visible');
                lightbox.style.display = 'flex';

                // Zamknięcie lightbox
                const closeLightbox = () => {
                    lightbox.classList.remove('visible');
                    lightbox.style.display = 'none';
                };
                lightboxCloseBtn.onclick = closeLightbox;
                lightbox.onclick = function(e) {
                    if (e.target === lightbox) closeLightbox();
                };
                document.addEventListener('keydown', function escListener(e) {
                    if (e.key === 'Escape') {
                        closeLightbox();
                        document.removeEventListener('keydown', escListener);
                    }
                });
            });
        });
    }
    enableLightbox('.investment-photos img');
    enableLightbox('.pzt-image');
    enableApartmentLightbox(); // Użyj nowej funkcji dla mieszkań
});

function enableApartmentLightbox() {
    document.querySelectorAll('.apartment-card').forEach(card => {
        const images = Array.from(card.querySelectorAll('.apartment-image-container img'));
        images.forEach((img, idx) => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function() {
                let lightbox = document.getElementById('image-lightbox');
                if (!lightbox) {
                    lightbox = document.createElement('div');
                    lightbox.id = 'image-lightbox';
                    lightbox.className = 'lightbox-overlay';
                    lightbox.innerHTML = `
                        <button class="lightbox-prev-btn" style="position:absolute;left:30px;top:50%;transform:translateY(-50%);font-size:2rem;background:none;border:none;color:white;cursor:pointer;">&#10094;</button>
                        <img id="lightbox-image" src="" alt="Powiększone zdjęcie">
                        <button class="lightbox-next-btn" style="position:absolute;right:30px;top:50%;transform:translateY(-50%);font-size:2rem;background:none;border:none;color:white;cursor:pointer;">&#10095;</button>
                        <button class="lightbox-close-btn" style="position:absolute;top:20px;right:30px;font-size:2rem;background:none;border:none;color:white;cursor:pointer;">&times;</button>
                    `;
                    document.body.appendChild(lightbox);
                }
                const lightboxImage = lightbox.querySelector('#lightbox-image');
                const lightboxCloseBtn = lightbox.querySelector('.lightbox-close-btn');
                const lightboxPrevBtn = lightbox.querySelector('.lightbox-prev-btn');
                const lightboxNextBtn = lightbox.querySelector('.lightbox-next-btn');
                let currentIndex = idx;

                function showImage(index) {
                    lightboxImage.src = images[index].src;
                }
                showImage(currentIndex);

                lightbox.classList.add('visible');
                lightbox.style.display = 'flex';

                lightboxPrevBtn.onclick = function(e) {
                    e.stopPropagation();
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                    showImage(currentIndex);
                };
                lightboxNextBtn.onclick = function(e) {
                    e.stopPropagation();
                    currentIndex = (currentIndex + 1) % images.length;
                    showImage(currentIndex);
                };

                const closeLightbox = () => {
                    lightbox.classList.remove('visible');
                    lightbox.style.display = 'none';
                };
                lightboxCloseBtn.onclick = closeLightbox;
                lightbox.onclick = function(e) {
                    if (e.target === lightbox) closeLightbox();
                };
                document.addEventListener('keydown', function escListener(e) {
                    if (e.key === 'Escape') {
                        closeLightbox();
                        document.removeEventListener('keydown', escListener);
                    }
                    if (e.key === 'ArrowLeft') {
                        lightboxPrevBtn.click();
                    }
                    if (e.key === 'ArrowRight') {
                        lightboxNextBtn.click();
                    }
                });
            });
        });
    });
}
