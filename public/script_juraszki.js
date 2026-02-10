document.addEventListener('DOMContentLoaded', function() {
    // --- 1. LOGIKA FILTROWANIA KAFELKÓW ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const apartments = document.querySelectorAll('.apartment-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deaktywuj wszystkie przyciski
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Aktywuj kliknięty przycisk
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

    // --- 2. LOGIKA PRZEŁĄCZANIA OBRAZKÓW W KAFELKACH ---
    const apartmentCards = document.querySelectorAll('.apartment-card');
    apartmentCards.forEach(card => {
        const images = card.querySelectorAll('.apartment-image-container img');
        const prevBtn = card.querySelector('.prev-btn');
        const nextBtn = card.querySelector('.next-btn');
        let currentIndex = 0;

        if (!images || images.length === 0) return;

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                images[currentIndex].classList.add('hidden');
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                images[currentIndex].classList.remove('hidden');
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                images[currentIndex].classList.add('hidden');
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].classList.remove('hidden');
            });
        }
    });

    // --- 3. ŁADOWANIE STATUSÓW LOKALI (JURASZKI) ---
    function loadUnitStatusesAndButtons() {
        // Dodano parametr cache-busting (?t=...) aby uniknąć cachowania pliku JSON
        fetch('segment_status.json?t=' + new Date().getTime())
            .then(response => {
                if (!response.ok) throw new Error('Błąd sieci');
                return response.json();
            })
            .then(data => {
                // Używamy klucza 'juraszki' zgodnie z Twoją strukturą JSON
                if (data && data.juraszki) {
                    const statuses = data.juraszki;
                    const container = document.getElementById('unit-status-buttons');
                    
                    // Jeśli kontener nie istnieje, nie rób nic (zabezpieczenie)
                    if (!container) return;

                    container.innerHTML = ''; // Wyczyść kontener przed dodaniem nowych przycisków

                    const units = Object.keys(statuses);
                    
                    // Sortowanie, aby kafelki były w kolejności (opcjonalne, ale przydatne)
                    units.sort(); 

                    units.forEach(unitId => {
                        const status = statuses[unitId]; // np. 'sold', 'reserved', 'available'
                        const button = document.createElement('button');
                        
                        button.textContent = unitId;
                        
                        // Dodanie klas bazowych i klasy statusu
                        button.className = 'btn-segment'; 
                        
                        // Logika mapowania statusu na klasę CSS
                        if (status === 'sold') {
                            button.classList.add('status-sold');
                        } else if (status === 'reserved') {
                            button.classList.add('status-reserved');
                        } else {
                            // Domyślnie 'available' lub jakikolwiek inny status traktujemy jako dostępny (zielony)
                            button.classList.add('status-available'); 
                        }
                        
                        container.appendChild(button);
                    });
                }
            })
            .catch(error => {
                console.error('Błąd ładowania statusów Juraszki:', error);
                const container = document.getElementById('unit-status-buttons');
                if(container) container.innerHTML = '<p style="color:red;">Błąd wczytywania statusów.</p>';
            });
    }

    // --- 4. LIGHTBOX (IDENTYCZNY JAK W INVESTMENTS) ---
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

                const closeLightbox = () => {
                    lightbox.classList.remove('visible');
                    lightbox.style.display = 'none';
                };
                lightboxCloseBtn.onclick = closeLightbox;
                lightbox.onclick = (e) => { if (e.target === lightbox) closeLightbox(); };
            });
        });
    }

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
                            <button class="lightbox-prev-btn">&#10094;</button>
                            <img id="lightbox-image" src="" alt="Powiększone zdjęcie">
                            <button class="lightbox-next-btn">&#10095;</button>
                            <button class="lightbox-close-btn">&times;</button>
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
                    lightbox.onclick = (e) => { if (e.target === lightbox) closeLightbox(); };
                    
                    document.addEventListener('keydown', function escListener(e) {
                        if (e.key === 'Escape') {
                            closeLightbox();
                            document.removeEventListener('keydown', escListener);
                        }
                        if (e.key === 'ArrowLeft') lightboxPrevBtn.click();
                        if (e.key === 'ArrowRight') lightboxNextBtn.click();
                    });
                });
            });
        });
    }

    // Wywołanie funkcji
    loadUnitStatusesAndButtons();
    enableLightbox('.investment-photos img');
    enableLightbox('.pzt-image');
    enableApartmentLightbox();
});