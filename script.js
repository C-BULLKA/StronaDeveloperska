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

    // --- 3. Logika okna modalnego (szczegóły ogłoszenia) ---
    const modal = document.getElementById('ad-modal');
    if (modal) {
        const listingsGrid = document.querySelector('.listings-grid');
        const closeModalBtn = modal.querySelector('.modal-close-btn');
        const prevImageBtn = document.getElementById('prev-image');
        const nextImageBtn = document.getElementById('next-image');
        const modalImage = document.getElementById('modal-main-image');

        let currentImages = [];
        let currentImageIndex = 0;
        let map = null;

        const initializeMap = async (address) => {
            const mapContainer = document.getElementById('map');
            if (!mapContainer) return;

            mapContainer.innerHTML = ''; 

            if (map) { map.remove(); map = null; }
            if (!address) {
                mapContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Brak adresu do wyświetlenia na mapie.</p>';
                return;
            }
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
                    map = L.map('map').setView([lat, lon], 16);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);
                    L.marker([lat, lon]).addTo(map).bindPopup(`<b>${address}</b>`).openPopup();
                    setTimeout(() => map.invalidateSize(), 100);
                } else {
                    mapContainer.innerHTML = `<p style="text-align:center; padding: 20px;">Nie znaleziono lokalizacji dla adresu: ${address}</p>`;
                }
            } catch (error) {
                console.error('Błąd mapy modalnej:', error);
                mapContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Błąd ładowania mapy. Sprawdź konsolę.</p>';
            }
        };

        const showModal = (data) => {
            document.getElementById('modal-title').textContent = data.title;
            document.getElementById('modal-location').textContent = data.location;
            document.getElementById('modal-price').textContent = data.price;
            document.getElementById('modal-rooms').textContent = data.rooms;
            document.getElementById('modal-area').textContent = data.area;
            document.getElementById('modal-description').textContent = data.description;
            
            // Nowa logika do wyświetlania udogodnień
            const featuresContainer = document.getElementById('modal-features');
            featuresContainer.innerHTML = ''; // Wyczyść stare udogodnienia
            
            if (data.features) {
                const features = data.features.split(',').map(f => f.trim());
                features.forEach(feature => {
                    if (feature) {
                        const badge = document.createElement('span');
                        badge.className = 'feature-badge';
                        badge.textContent = feature;
                        featuresContainer.appendChild(badge);
                    }
                });
            }

            currentImages = JSON.parse(data.images);
            currentImageIndex = 0;
            updateModalImage();
            
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.querySelector('.modal-content').style.transform = 'scale(1)';
                
                const mapContainer = document.getElementById('map');
                if (mapContainer) {
                    initializeMap(data.address);
                }
            }, 10);
        };

        const hideModal = () => {
            if (map) { map.remove(); map = null; }
            modal.style.opacity = '0';
            modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
            setTimeout(() => {
                modal.style.display = 'none';
                document.getElementById('map').innerHTML = '';
            }, 300);
        };

        const updateModalImage = () => {
            if (currentImages.length > 0) {
                modalImage.src = currentImages[currentImageIndex];
            }
            prevImageBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
            nextImageBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
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

        if (listingsGrid) {
            listingsGrid.addEventListener('click', function(e) {
                let targetElement = e.target;
                if (targetElement.nodeType !== Node.ELEMENT_NODE) {
                    targetElement = targetElement.parentElement;
                }
                const detailsButton = targetElement.closest('.btn-details');
                if (detailsButton) {
                    e.preventDefault();
                    showModal(detailsButton.dataset);
                }
            });
        }
        closeModalBtn.addEventListener('click', hideModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) hideModal();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') hideModal();
        });
        nextImageBtn.addEventListener('click', showNextImage);
        prevImageBtn.addEventListener('click', showPrevImage);
    }
    
    // --- 4. Logika dla powiększania zdjęcia (Lightbox) ---
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
        const modalImage = document.getElementById('modal-main-image');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCloseBtn = lightbox.querySelector('.lightbox-close-btn');

        const openLightbox = () => {
            lightboxImage.src = modalImage.src;
            lightbox.classList.add('visible');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
        };

        modalImage.addEventListener('click', openLightbox);
        lightboxCloseBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

});