document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Płynne przewijanie do kotwic w nawigacji ---
    const navLinks = document.querySelectorAll('.main-nav a[href*="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') || href.includes(window.location.pathname + '#')) {
                const targetId = href.substring(href.indexOf('#'));
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // --- 2. Animacja sekcji przy przewijaniu (Intersection Observer) ---
    const sections = document.querySelectorAll('section');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    sections.forEach(section => { observer.observe(section); });

    // --- 3. Mapa główna na stronie index.html ---
    const cityMapContainer = document.getElementById('cityMap');
    if (cityMapContainer) {
        try {
            // Współrzędne dla Tarnowa
            const tarnowLat = 50.0129;
            const tarnowLng = 20.9847;
            
            const cityMap = L.map('cityMap').setView([tarnowLat, tarnowLng], 14);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(cityMap);

            // Główny marker dla inwestycji
            L.marker([tarnowLat, tarnowLng])
                .addTo(cityMap)
                .bindPopup('<b>TarnowskiDeveloper</b><br>Nowoczesne apartamenty')
                .openPopup();

            // Dodatkowe markery dla udogodnień
            const amenities = [
                { lat: 50.0135, lng: 20.9853, name: 'Sklepy', icon: '🛒' },
                { lat: 50.0125, lng: 20.9842, name: 'Park', icon: '🌳' },
                { lat: 50.0140, lng: 20.9860, name: 'Szkoła', icon: '🏫' },
                { lat: 50.0120, lng: 20.9835, name: 'Przychodnia', icon: '🏥' }
            ];

            amenities.forEach(amenity => {
                L.marker([amenity.lat, amenity.lng])
                    .addTo(cityMap)
                    .bindPopup(`<b>${amenity.icon} ${amenity.name}</b>`);
            });

        } catch (error) {
            console.error('Błąd przy inicjalizacji głównej mapy:', error);
            cityMapContainer.innerHTML = '<p style="text-align:center; padding: 40px; color: #666;">Błąd ładowania mapy. Sprawdź połączenie internetowe.</p>';
        }
    }

    // --- 4. Logika okna modalnego (szczegóły ogłoszenia) ---
    const modal = document.getElementById('ad-modal');
    if (modal) {
        const listingsGrid = document.querySelector('.listings-grid');
        const closeModalBtn = modal.querySelector('.modal-close-btn');
        const prevImageBtn = document.getElementById('prev-image');
        const nextImageBtn = document.getElementById('next-image');
        const modalImage = document.getElementById('modal-main-image');

        let currentImages = [];
        let currentImageIndex = 0;
        let modalMap = null;

        const initializeModalMap = async (address) => {
            const mapContainer = document.getElementById('map');
            if (!mapContainer) return;

            mapContainer.innerHTML = ''; 

            if (modalMap) { 
                modalMap.remove(); 
                modalMap = null; 
            }
            
            if (!address || address.trim() === '') {
                mapContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Brak adresu do wyświetlenia na mapie.</p>';
                return;
            }

            // Pokazuj loader podczas ładowania
            mapContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Ładowanie mapy...</p>';
            
            const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
            
            try {
                const response = await fetch(apiUrl, {
                    headers: { 'User-Agent': 'TarnowskiDeveloper/1.0 (contact@example.com)' }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    
                    // Wyczyść container przed utworzeniem mapy
                    mapContainer.innerHTML = '';
                    
                    modalMap = L.map('map').setView([lat, lon], 16);
                    
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(modalMap);
                    
                    L.marker([lat, lon])
                        .addTo(modalMap)
                        .bindPopup(`<b>${address}</b>`)
                        .openPopup();
                    
                    // Wymuszenie odświeżenia rozmiaru mapy
                    setTimeout(() => {
                        if (modalMap) {
                            modalMap.invalidateSize();
                        }
                    }, 100);
                    
                } else {
                    mapContainer.innerHTML = `<p style="text-align:center; padding: 20px;">Nie znaleziono lokalizacji dla adresu: ${address}</p>`;
                }
            } catch (error) {
                console.error('Błąd mapy modalnej:', error);
                mapContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Błąd ładowania mapy. Sprawdź połączenie internetowe.</p>';
            }
        };

        const showModal = (data) => {
            document.getElementById('modal-title').textContent = data.title || 'Brak tytułu';
            document.getElementById('modal-location').textContent = data.location || 'Brak lokalizacji';
            document.getElementById('modal-price').textContent = data.price || '0 PLN';
            document.getElementById('modal-rooms').textContent = data.rooms || '?';
            document.getElementById('modal-area').textContent = data.area || '?';
            document.getElementById('modal-description').textContent = data.description || 'Brak opisu';
            
            // Obsługa features
            const featuresContainer = document.getElementById('modal-features');
            featuresContainer.innerHTML = '';
            
            if (data.features && data.features.trim() !== '') {
                const features = data.features.split(',').map(f => f.trim()).filter(f => f !== '');
                
                const feature_labels = {
                    'furnished': '<i class="fas fa-couch"></i> Umeblowane',
                    'developer_condition': '<i class="fas fa-paint-roller"></i> Stan developerski',
                    'internet': '<i class="fas fa-wifi"></i> Szybki internet',
                    'energy_efficient': '<i class="fas fa-leaf"></i> Energooszczędne',
                    'near_shops': '<i class="fas fa-shopping-bag"></i> Blisko sklepy',
                    'near_transport': '<i class="fas fa-bus"></i> Blisko komunikacja',
                    'quiet': '<i class="fas fa-volume-mute"></i> Cicha okolica',
                    'near_schools': '<i class="fas fa-school"></i> Blisko szkoły',
                    'near_parks': '<i class="fas fa-tree"></i> Blisko parki',
                    'parking': '<i class="fas fa-parking"></i> Miejsce parkingowe',
                    'balcony': '<i class="fas fa-door-open"></i> Balkon',
                    'elevator': '<i class="fas fa-elevator"></i> Winda',
                    'gym': '<i class="fas fa-dumbbell"></i> Siłownia',
                    'pool': '<i class="fas fa-swimming-pool"></i> Basen',
                    'pet_friendly': '<i class="fas fa-paw"></i> Przyjazne zwierzętom',
                    'security': '<i class="fas fa-shield-alt"></i> System bezpieczeństwa'
                };

                features.forEach(feature => {
                    if (feature && feature_labels[feature]) {
                        const badge = document.createElement('span');
                        badge.className = 'feature-badge';
                        badge.innerHTML = feature_labels[feature];
                        featuresContainer.appendChild(badge);
                    }
                });
            }

            // Obsługa zdjęć
            try {
                currentImages = JSON.parse(data.images || '[]');
            } catch (e) {
                console.error('Błąd parsowania zdjęć:', e);
                currentImages = [];
            }
            
            currentImageIndex = 0;
            updateModalImage();
            
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.querySelector('.modal-content').style.transform = 'scale(1)';
                
                // Inicjalizacja mapy po pokazaniu modala
                initializeModalMap(data.address);
            }, 10);
        };

        const hideModal = () => {
            if (modalMap) { 
                modalMap.remove(); 
                modalMap = null; 
            }
            modal.style.opacity = '0';
            modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
            setTimeout(() => {
                modal.style.display = 'none';
                const mapContainer = document.getElementById('map');
                if (mapContainer) {
                    mapContainer.innerHTML = '';
                }
            }, 300);
        };

        const updateModalImage = () => {
            if (currentImages.length > 0) {
                modalImage.src = currentImages[currentImageIndex];
                modalImage.style.display = 'block';
            } else {
                modalImage.src = 'https://via.placeholder.com/400x250.png?text=Brak+zdj%C4%99cia';
                modalImage.style.display = 'block';
            }
            
            // Pokazuj/ukrywaj strzałki nawigacji
            if (prevImageBtn) prevImageBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
            if (nextImageBtn) nextImageBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
        };

        const showNextImage = () => {
            if (currentImages.length > 1) {
                currentImageIndex = (currentImageIndex + 1) % currentImages.length;
                updateModalImage();
            }
        };

        const showPrevImage = () => {
            if (currentImages.length > 1) {
                currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
                updateModalImage();
            }
        };

        // Event listenery
        if (listingsGrid) {
            listingsGrid.addEventListener('click', function(e) {
                let targetElement = e.target;
                
                // Znajdź przycisk "Zobacz szczegóły"
                while (targetElement && !targetElement.classList.contains('btn-details')) {
                    targetElement = targetElement.parentElement;
                    if (targetElement === listingsGrid) break;
                }
                
                if (targetElement && targetElement.classList.contains('btn-details')) {
                    e.preventDefault();
                    showModal(targetElement.dataset);
                }
            });
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', hideModal);
        }

        modal.addEventListener('click', function(e) {
            if (e.target === modal) hideModal();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                hideModal();
            }
        });

        if (nextImageBtn) {
            nextImageBtn.addEventListener('click', showNextImage);
        }
        
        if (prevImageBtn) {
            prevImageBtn.addEventListener('click', showPrevImage);
        }

        // --- 5. Funkcja powiększania zdjęć (Lightbox) ---
        if (modalImage) {
            modalImage.addEventListener('click', function() {
                // Tworzymy lightbox dynamicznie jeśli nie istnieje
                let lightbox = document.getElementById('image-lightbox');
                
                if (!lightbox) {
                    lightbox = document.createElement('div');
                    lightbox.id = 'image-lightbox';
                    lightbox.className = 'lightbox-overlay';
                    lightbox.innerHTML = `
                        <img id="lightbox-image" src="" alt="Powiększone zdjęcie">
                        <button class="lightbox-close-btn">&times;</button>
                    `;
                    document.body.appendChild(lightbox);
                }

                const lightboxImage = lightbox.querySelector('#lightbox-image');
                const lightboxCloseBtn = lightbox.querySelector('.lightbox-close-btn');

                // Ustaw źródło zdjęcia
                lightboxImage.src = modalImage.src;
                
                // Pokaż lightbox
                lightbox.classList.add('visible');

                // Event listenery dla zamykania
                const closeLightbox = () => {
                    lightbox.classList.remove('visible');
                };

                lightboxCloseBtn.onclick = closeLightbox;
                
                lightbox.onclick = function(e) {
                    if (e.target === lightbox) {
                        closeLightbox();
                    }
                };

                // Zamykanie na ESC
                const handleEscKey = (e) => {
                    if (e.key === 'Escape') {
                        closeLightbox();
                        document.removeEventListener('keydown', handleEscKey);
                    }
                };
                document.addEventListener('keydown', handleEscKey);
            });
        }
    }
});
// Funkcja ładująca statusy segmentów i generująca przyciski
function loadSegmentStatuses() {
    fetch('segment_status.json')
        .then(response => response.json())
        .then(data => {
            // Aktualizuj przyciski dla każdego mieszkania
            updateSegmentButtons('L1', data.L1);
            updateSegmentButtons('L2', data.L2);
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
        const status = statusData[segment] || 'available';
        const button = document.createElement('button');
        button.className = `btn-segment status-${status}`;
        button.textContent = segment;
        container.appendChild(button);
    });
}
const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .cta-button');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            // Pokazuje lub ukrywa menu
            navMenu.classList.toggle('active');

            // Zmienia ikonę hamburgera na "X" i z powrotem
            const icon = navToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Zamyka menu po kliknięciu w dowolny link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

// Wywołaj funkcję ładującą statusy
loadSegmentStatuses();
// Helper: URL do obrazka (serweruje serve_image.php)
function getImageUrl(folder, filename) {
    return 'serve_image.php?file=' + encodeURIComponent(folder + '/' + filename);
}

// Pobierz listę ogłoszeń i wyrenderuj prosto do sekcji .apartments-section
async function fetchAndRenderAds() {
    try {
        const res = await fetch('serve_ads.php', {cache: 'no-cache'});
        if (!res.ok) throw new Error('Błąd pobierania ogłoszeń');
        const ads = await res.json();
        const container = document.querySelector('.apartments-section');
        if (!container) return;
        container.innerHTML = '';
        ads.forEach(ad => {
            const el = document.createElement('article');
            el.className = 'apartment-card';
            const imgHtml = (ad.images && ad.images.length) ? `<img src="${ad.images[0]}" alt="${escapeHtml(ad.title || '')}">` : '';
            el.innerHTML = `
                <div class="apartment-image">${imgHtml}</div>
                <div class="apartment-info">
                    <h3>${escapeHtml(ad.title || 'Bez tytułu')}</h3>
                    <p class="location">${escapeHtml(ad.location || '')}</p>
                    <p class="price">${escapeHtml(String(ad.price || ''))}</p>
                    <a class="details-link" href="ogloszenia.php#${encodeURIComponent(ad.folder)}">Zobacz</a>
                </div>
            `;
            container.appendChild(el);
        });
    } catch (e) {
        console.error('fetchAndRenderAds error', e);
    }
}

// Prosta funkcja escape
function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function(m){
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
}

// Uruchom po załadowaniu DOM
document.addEventListener('DOMContentLoaded', function(){
    if (typeof fetchAndRenderAds === 'function') fetchAndRenderAds();
});