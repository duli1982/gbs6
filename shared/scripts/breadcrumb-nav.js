/**
 * Enhanced Breadcrumb Navigation - Randstad GBS Learning Hub
 * Handles scroll behavior, mobile responsiveness, and accessibility
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        scrollThreshold: 10,
        mobileBreakpoint: 768,
        animationDuration: 300
    };

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const breadcrumbContainer = document.querySelector('.breadcrumb-container');
        if (!breadcrumbContainer) return;

        // Initialize features
        handleScrollShadow(breadcrumbContainer);
        handleMobileCollapse();
        enhanceKeyboardNavigation();
        addLoadingStates();
    }

    /**
     * Add shadow to breadcrumb on scroll
     */
    function handleScrollShadow(container) {
        let lastScrollY = window.scrollY;
        let ticking = false;

        window.addEventListener('scroll', () => {
            lastScrollY = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (lastScrollY > CONFIG.scrollThreshold) {
                        container.classList.add('scrolled');
                    } else {
                        container.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Handle mobile breadcrumb collapse
     */
    function handleMobileCollapse() {
        const breadcrumbNav = document.querySelector('.breadcrumb-nav');
        if (!breadcrumbNav) return;

        function checkMobileCollapse() {
            if (window.innerWidth < CONFIG.mobileBreakpoint) {
                const items = breadcrumbNav.querySelectorAll('.breadcrumb-item');
                if (items.length > 3) {
                    breadcrumbNav.classList.add('has-hidden-items');
                }
            } else {
                breadcrumbNav.classList.remove('has-hidden-items');
            }
        }

        // Check on load and resize
        checkMobileCollapse();
        window.addEventListener('resize', debounce(checkMobileCollapse, 250));
    }

    /**
     * Enhance keyboard navigation
     */
    function enhanceKeyboardNavigation() {
        const links = document.querySelectorAll('.breadcrumb-link, .breadcrumb-hub-btn, .breadcrumb-back-btn');

        links.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                // Arrow key navigation
                if (e.key === 'ArrowRight' && links[index + 1]) {
                    e.preventDefault();
                    links[index + 1].focus();
                } else if (e.key === 'ArrowLeft' && links[index - 1]) {
                    e.preventDefault();
                    links[index - 1].focus();
                }
                // Home/End keys
                else if (e.key === 'Home') {
                    e.preventDefault();
                    links[0].focus();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    links[links.length - 1].focus();
                }
            });
        });
    }

    /**
     * Add loading state to navigation buttons
     */
    function addLoadingStates() {
        const navButtons = document.querySelectorAll('.breadcrumb-hub-btn, .breadcrumb-back-btn, .breadcrumb-link');

        navButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Skip if it's an anchor link or has no href
                if (!this.href || this.href.includes('#')) return;

                // Add loading state
                this.classList.add('nav-button-loading');

                // Remove loading state if navigation is cancelled (e.g., back button)
                window.addEventListener('pageshow', () => {
                    this.classList.remove('nav-button-loading');
                }, { once: true });
            });
        });
    }

    /**
     * Utility: Debounce function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Announce navigation changes to screen readers
     */
    function announceNavigation(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Export for use in other scripts if needed
    window.BreadcrumbNav = {
        announceNavigation
    };

})();
