// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links (account for fixed header)
const anchorNodes = document.querySelectorAll('a[href^="#"]');
if (anchorNodes && anchorNodes.length) {
    anchorNodes.forEach(anchor => {
        if (!anchor) return;
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            // compute offset to avoid header overlap
            const header = document.getElementById('header') || document.querySelector('.header');
            const headerHeight = header ? header.getBoundingClientRect().height : 0;
            const targetY = window.scrollY + target.getBoundingClientRect().top - Math.ceil(headerHeight) - 10; // small gap
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        });
    });
}

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all fade-in-up elements
document.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce.');
        this.reset();
    });
}
// Karuzela inwestycji
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".carousel").forEach(carousel => {
        const track = carousel.querySelector(".carousel-track");
        if (!track) return; // nothing to do
        const prevBtn = carousel.querySelector(".carousel-btn.prev");
        const nextBtn = carousel.querySelector(".carousel-btn.next");
        const slides = Array.from(track.children || []);
        if (!slides.length) return; // no slides, skip
        let currentIndex = 0; 

        function slidesPerView() {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 900) return 2;
            return 3;
        }

        function updateCarousel() {
            if (!slides[0]) return;
            const slideWidth = slides[0].getBoundingClientRect().width + 16; // +margin
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                if (currentIndex < slides.length - slidesPerView()) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
        }

        window.addEventListener("resize", updateCarousel);
        updateCarousel();
    });
});

