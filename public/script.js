document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Płynne przewijanie (bezpieczne dla wszystkich stron) ---
    const navLinks = document.querySelectorAll('.nav-link[href*="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.includes('#')) {
                const targetId = href.substring(href.indexOf('#'));
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // --- 3. Logika Modala Ogłoszeń ---
    const modal = document.getElementById('ad-modal');
    if (modal) {
        const adsContainer = document.getElementById('ads-container');
        const closeModalBtn = modal.querySelector('.modal-close-btn');
        const modalImage = document.getElementById('modal-main-image');
        const prevBtn = document.getElementById('prev-image');
        const nextBtn = document.getElementById('next-image');

        let currentImages = [];
        let currentIndex = 0;
        let leafletModalMap = null;

        const showModal = (data) => {
            // Wypełnianie pól tekstowych
            document.getElementById('modal-title').innerText = data.title;
            document.getElementById('modal-location').innerText = data.address;
            document.getElementById('modal-price').innerText = data.price;
            document.getElementById('modal-rooms').innerText = data.rooms;
            document.getElementById('modal-area').innerText = data.area;
            document.getElementById('modal-description').innerText = data.description;

            // Cechy / Ikony
            const featuresContainer = document.getElementById('modal-features');
            featuresContainer.innerHTML = '';
            if (data.features) {
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
                data.features.split(',').forEach(f => {
                    const key = f.trim();
                    if (feature_labels[key]) {
                        const span = document.createElement('span');
                        span.className = 'feature-badge';
                        span.innerHTML = feature_labels[key];
                        featuresContainer.appendChild(span);
                    }
                });
            }

            // Obsługa zdjęć
            try { currentImages = JSON.parse(data.images); } catch(e) { currentImages = []; }
            currentIndex = 0;
            updateImage();

            // Pokazywanie modala
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);

            // Mapa
            initMap(data.address);
        };

        const updateImage = () => {
            if (currentImages.length > 0) {
                modalImage.src = currentImages[currentIndex];
            }
            prevBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
            nextBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
        };

        const initMap = async (address) => {
            const mapEl = document.getElementById('map');
            if (!mapEl) return;
            if (leafletModalMap) { leafletModalMap.remove(); leafletModalMap = null; }
            mapEl.innerHTML = '';

            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
                const geo = await res.json();
                if (geo.length > 0) {
                    leafletModalMap = L.map('map').setView([geo[0].lat, geo[0].lon], 15);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletModalMap);
                    L.marker([geo[0].lat, geo[0].lon]).addTo(leafletModalMap);
                    setTimeout(() => leafletModalMap.invalidateSize(), 400);
                }
            } catch (err) { console.warn("Map error:", err); }
        };

        // Event Listeners
        if (adsContainer) {
            adsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-details');
                if (btn) showModal(btn.dataset);
            });
        }

        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        });

        nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % currentImages.length; updateImage(); });
        prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length; updateImage(); });

        // Lightbox
        modalImage.addEventListener('click', () => {
            let lb = document.getElementById('image-lightbox');
            if (!lb) {
                lb = document.createElement('div');
                lb.id = 'image-lightbox';
                lb.className = 'lightbox-overlay';
                lb.innerHTML = '<img id="lightbox-image" src=""><span class="close-lb" style="position:absolute;top:20px;right:40px;color:#fff;font-size:40px;cursor:pointer;">&times;</span>';
                document.body.appendChild(lb);
                lb.onclick = (e) => { if(e.target !== document.getElementById('lightbox-image')) lb.classList.remove('visible'); setTimeout(() => lb.style.display='none', 300); };
            }
            document.getElementById('lightbox-image').src = modalImage.src;
            lb.style.display = 'flex';
            setTimeout(() => lb.classList.add('visible'), 10);
        });
    }

    // --- 4. Mapa na stronie głównej (index.html) ---
    const cityMapEl = document.getElementById('cityMap');
    if (cityMapEl) {
        const cityMap = L.map('cityMap').setView([50.0129, 20.9847], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(cityMap);
        L.marker([50.0129, 20.9847]).addTo(cityMap).bindPopup('Biuro Sprzedaży');
    }
});