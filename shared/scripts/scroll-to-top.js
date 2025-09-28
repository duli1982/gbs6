// Scroll to Top Button - Standardized Component
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll-to-top button if it doesn't exist
    let scrollButton = document.getElementById('scroll-to-top');
    if (!scrollButton) {
        scrollButton = document.createElement('button');
        scrollButton.id = 'scroll-to-top';
        scrollButton.className = 'scroll-to-top';
        scrollButton.innerHTML = '↑';
        scrollButton.setAttribute('aria-label', 'Scroll to top');
        scrollButton.setAttribute('title', 'Back to top');
        document.body.appendChild(scrollButton);
    }

    // Show/hide button based on scroll position
    function toggleScrollButton() {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    }

    // Smooth scroll to top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Event listeners
    window.addEventListener('scroll', toggleScrollButton);
    scrollButton.addEventListener('click', scrollToTop);

    // Initial check
    toggleScrollButton();
});