document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".carousel").forEach(carousel => {
        const track = carousel.querySelector(".carousel-track");
        const prevBtn = carousel.querySelector(".carousel-btn.prev");
        const nextBtn = carousel.querySelector(".carousel-btn.next");
        const slides = Array.from(track.children);
        let currentIndex = 0;

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        prevBtn.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        nextBtn.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });
    });
});
