document.addEventListener("DOMContentLoaded", function () {
    console.log('menu.js: DOMContentLoaded');
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (navToggle && navMenu) {
        console.log('menu.js: found navToggle and navMenu');
        // Toggle menu visibility and ARIA
        navToggle.addEventListener("click", () => {
            console.log('menu.js: navToggle clicked');
            const isActive = navMenu.classList.toggle("active");
            navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            // Prevent body scrolling when menu open
            document.body.classList.toggle('nav-open', isActive);
        });

        // Close menu when a link inside it is clicked (mobile behaviour)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('nav-open');
                }
            });
        });
    }
});
