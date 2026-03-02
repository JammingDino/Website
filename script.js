document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggling ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Function to apply theme
    function applyTheme(theme) {
        body.classList.remove('light-mode', 'dark-mode');
        body.classList.add(theme);
        localStorage.setItem('theme', theme);
    }

    // Set theme on initial load
    const currentTheme = localStorage.getItem('theme') || 'light-mode';
    applyTheme(currentTheme);

    // Add click event for the toggle button
    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
        applyTheme(newTheme);
    });

    // --- Mouse Follower Spotlight Effect ---
    const cursorGlow = document.getElementById('cursor-glow');

    // Only activate this effect on devices that support hover (not touch screens)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    function updateCursorPosition(e) {
        // Use requestAnimationFrame for performance
        requestAnimationFrame(() => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    }

    if (mediaQuery.matches) {
        window.addEventListener('mousemove', updateCursorPosition);
    }

    // --- Scroll-Reveal Animations ---
    const sections = document.querySelectorAll('section');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('section-dimmed');
            } else {
                entry.target.classList.remove('visible');
                entry.target.classList.remove('section-dimmed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    sections.forEach(section => {
        // Pre-add visible to #about to prevent a flash before the observer fires
        if (section.id === 'about') {
            section.classList.add('visible');
        }
        revealObserver.observe(section);
    });

    // --- Active Nav Link on Scroll ---
    const navLinks = document.querySelectorAll('.nav-link');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');

                // Dim all other visible sections for the "grey outside" effect
                sections.forEach(s => {
                    if (s.classList.contains('visible')) {
                        s.classList.toggle('section-dimmed', s !== entry.target);
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => navObserver.observe(section));

    // --- Contact Form (only if element exists) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const subject = `Message from ${name} via your portfolio`;
            const mailBody = `${message}\n\nFrom: ${name}\nEmail: ${email}`;

            window.location.href = `mailto:levipronkjones1@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
        });
    }

    // --- Dynamic Copyright Year ---
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
});