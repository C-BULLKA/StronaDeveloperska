// ========== Logika dla karuzeli etapów budowy ==========
document.addEventListener('DOMContentLoaded', function() {
    
    // Konfiguracja dla karuzeli. 
    // Aby zmienić etapy na innej podstronie, wystarczy zmodyfikować tę tablicę.
    const stagesData = [
        { 
            image: "podstawowe_zdjęcia/Sciezka/Etapy/etap1.jpg", // Zmień na właściwą ścieżkę
            caption: "Styczeń 2025 - Przygotowanie terenu i prace ziemne"
        },
        { 
            image: "podstawowe_zdjęcia/Sciezka/Etapy/etap2.jpg", // Zmień na właściwą ścieżkę
            caption: "Marzec 2025 - Wykonanie fundamentów" 
        },
        { 
            image: "podstawowe_zdjęcia/Sciezka/Etapy/etap3.jpg", // Zmień na właściwą ścieżkę
            caption: "Czerwiec 2025 - Stan surowy otwarty" 
        },
        { 
            image: "podstawowe_zdjęcia/Sciezka/Etapy/etap4.jpg", // Zmień na właściwą ścieżkę
            caption: "Wrzesień 2025 - Montaż okien i dachu" 
        }
    ];

    // Sprawdzenie, czy kontener karuzeli istnieje na stronie
    const carouselWrapper = document.querySelector('.stages-carousel-wrapper');
    if (!carouselWrapper) {
        return; // Jeśli nie ma karuzeli na tej stronie, zakończ działanie skryptu
    }

    const track = carouselWrapper.querySelector('.stages-carousel-track');
    const dotsContainer = carouselWrapper.querySelector('.stages-carousel-dots');
    const prevButton = carouselWrapper.querySelector('.stages-btn.prev');
    const nextButton = carouselWrapper.querySelector('.stages-btn.next');

    let currentIndex = 0;
    let intervalId; // Zmienna do przechowywania interwału automatycznego przewijania

    // Funkcja generująca slajdy i kropki na podstawie danych
    function initializeCarousel() {
        track.innerHTML = '';
        dotsContainer.innerHTML = '';

        stagesData.forEach((stage, index) => {
            // Tworzenie slajdu
            const slide = document.createElement('div');
            slide.className = 'stage-slide';
            slide.innerHTML = `
                <img src="${stage.image}" alt="Etap budowy ${index + 1}">
                <div class="stage-slide-caption">${stage.caption}</div>
            `;
            track.appendChild(slide);

            // Tworzenie kropki
            const dot = document.createElement('button');
            dot.className = 'dot';
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);
        });

        updateCarousel();
        startAutoPlay();
    }
    
    // Funkcja aktualizująca widok karuzeli
    function updateCarousel() {
        const slides = track.querySelectorAll('.stage-slide');
        const slideWidth = slides[0].clientWidth;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        // Aktualizacja aktywnej kropki
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    // Funkcje do nawigacji
    function goToNextSlide() {
        currentIndex = (currentIndex + 1) % stagesData.length;
        updateCarousel();
    }

    function goToPrevSlide() {
        currentIndex = (currentIndex - 1 + stagesData.length) % stagesData.length;
        updateCarousel();
    }
    
    // Funkcje do obsługi automatycznego przewijania
    function startAutoPlay() {
        intervalId = setInterval(goToNextSlide, 5000); // Zmieniaj slajd co 5 sekund (5000ms)
    }

    function stopAutoPlay() {
        clearInterval(intervalId);
    }

    // Event Listeners
    nextButton.addEventListener('click', () => {
        goToNextSlide();
        stopAutoPlay(); // Zatrzymuje automatyczne przewijanie po ręcznej interakcji
    });

    prevButton.addEventListener('click', () => {
        goToPrevSlide();
        stopAutoPlay();
    });

    dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dot')) {
            currentIndex = parseInt(e.target.dataset.index);
            updateCarousel();
            stopAutoPlay();
        }
    });

    // Aktualizacja na zmianę rozmiaru okna
    window.addEventListener('resize', updateCarousel);
    
    // Inicjalizacja
    initializeCarousel();
});