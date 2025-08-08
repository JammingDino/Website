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

});