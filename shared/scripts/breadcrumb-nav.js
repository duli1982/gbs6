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
        // Ensure required styles are present for standalone session pages
        ensureStyles();

        // De-duplicate any breadcrumb containers that might be rendered twice
        const breadcrumbContainer = dedupeBreadcrumbs();
        if (!breadcrumbContainer) return;

        // Initialize features on the surviving container
        handleScrollShadow(breadcrumbContainer);
        handleMobileCollapse();
        enhanceKeyboardNavigation();
        addLoadingStates();
        normalizeLinks();
        setupModuleContext();
        insertModuleBreadcrumb();

        // Extra safety: observe DOM for late-inserted breadcrumbs
        try {
            const observer = new MutationObserver(() => dedupeBreadcrumbs());
            observer.observe(document.body, { childList: true, subtree: true });
            // Run again after full load in case of late templates
            window.addEventListener('load', dedupeBreadcrumbs, { once: true });
        } catch (_) { /* no-op */ }
    }

    // Inject Tailwind and shared CSS if missing (for standalone session pages)
    function ensureStyles() {
        try {
            const hasTailwind = !!document.querySelector('script[src*="tailwindcss.com"]');
            const needFonts = !document.querySelector('link[href*="/shared/fonts.css"]');
            const needButtons = !document.querySelector('link[href*="/shared/buttons.css"]');
            const needHubBtn = !document.querySelector('link[href*="/shared/hub-button.css"]');

            const head = document.head || document.getElementsByTagName('head')[0];
            if (!head) return;

            if (!hasTailwind) {
                const s = document.createElement('script');
                s.src = 'https://cdn.tailwindcss.com';
                head.appendChild(s);
            }
            if (needFonts) {
                const l = document.createElement('link');
                l.rel = 'stylesheet';
                l.href = '../../shared/fonts.css';
                head.appendChild(l);
            }
            if (needButtons) {
                const l = document.createElement('link');
                l.rel = 'stylesheet';
                l.href = '../../shared/buttons.css';
                head.appendChild(l);
            }
            if (needHubBtn) {
                const l = document.createElement('link');
                l.rel = 'stylesheet';
                l.href = '../../shared/hub-button.css';
                head.appendChild(l);
            }
        } catch (_) { /* no-op */ }
    }

    // Remove all but the last breadcrumb container; return the one we keep
    function dedupeBreadcrumbs() {
        const containers = Array.from(document.querySelectorAll('.breadcrumb-container'));
        if (!containers.length) return null;

        if (containers.length > 1) {
            containers.slice(0, -1).forEach(el => {
                try {
                    el.setAttribute('data-duplicate', 'true');
                    el.parentNode && el.parentNode.removeChild(el);
                } catch (_) {
                    el.style.display = 'none';
                }
            });
        }
        return containers[containers.length - 1] || containers[0];
    }

    // Ensure breadcrumb link for RPO Training always points to the correct hub
    function normalizeLinks() {
        try {
            const anchors = document.querySelectorAll('.breadcrumb-nav a');
            if (!anchors.length) return;
            const target = getRpoHubURL();

            anchors.forEach(a => {
                // Only adjust anchors that clearly represent the RPO Training crumb
                const text = (a.textContent || '').replace(/\s+/g,' ').trim();
                const isRpoCrumb = (a.getAttribute('aria-label') === 'Go to RPO Training') || text.includes('RPO Training');
                if (!isRpoCrumb) return;
                a.setAttribute('href', target);
                // Enforce navigation target on click as well
                a.addEventListener('click', function(ev) {
                    ev.preventDefault();
                    window.location.href = target;
                });
            });
        } catch (_) { /* no-op */ }
    }

    function getRpoHubURL() {
        const href = (window.location.href || '');
        const lower = href.toLowerCase();
        const marker = '/rpo-training/';
        const idx = lower.indexOf(marker);
        if (idx >= 0) {
            const base = href.substring(0, idx + marker.length);
            return new URL('index.html', base).toString();
        }
        return new URL('/rpo-training/index.html', href).toString();
    }

    // Session pages: always provide a generic Back to RPO Training button
    function setupModuleContext() {
        try {
            const path = (window.location.pathname || '').toLowerCase();
            const isSessionPage = path.includes('/rpo-training/sessions/');
            if (!isSessionPage) return;

            // Determine module number from the session path
            const match = path.match(/\/rpo-training\/sessions\/(\d+)-/);
            if (!match) return;
            const moduleNum = match[1];
            const moduleUrl = `/rpo-training/index.html#module-${moduleNum}`;
            const moduleLabel = `Back to Module ${moduleNum}`;

            const actions = document.querySelector('.breadcrumb-actions');
            if (!actions) return;

            // If there's already any back button, retarget and relabel it
            const existingBack = Array.from(actions.querySelectorAll('a')).find(a => {
                const t = (a.textContent || '').trim();
                return t.startsWith('Back to');
            });
            if (existingBack) {
                existingBack.href = moduleUrl;
                existingBack.setAttribute('aria-label', moduleLabel);
                existingBack.innerHTML = '<span class="icon-arrow-left"></span><span>' + moduleLabel + '</span>';
                return;
            }

            // Otherwise, insert a module-specific back button
            const back = document.createElement('a');
            back.className = 'breadcrumb-back-btn';
            back.href = moduleUrl;
            back.setAttribute('aria-label', moduleLabel);
            back.innerHTML = '<span class="icon-arrow-left"></span><span>' + moduleLabel + '</span>';
            actions.prepend(back);
        } catch (_) { /* no-op */ }
    }

    // If on a session page and we have a module context, extend the breadcrumb trail with the module item
    function insertModuleBreadcrumb() {
        try {
            const path = (window.location.pathname || '').toLowerCase();
            if (!path.includes('/rpo-training/sessions/')) return;

            let raw = sessionStorage.getItem('rpo:lastModule');
            let data = raw ? JSON.parse(raw) : null;
            if (!data || !data.url) {
                // Fallback: infer module from session filename
                const match = path.match(/\/rpo-training\/sessions\/(\d+)-/);
                if (match) {
                    const num = match[1];
                    data = {
                        url: `/rpo-training/index.html#module-${num}`,
                        name: `Module ${num}`
                    };
                } else {
                    return;
                }
            }

            const ol = document.querySelector('.breadcrumb-nav ol');
            if (!ol) return;

            // Find the current page item (last li)
            const items = ol.querySelectorAll('li.breadcrumb-item');
            if (!items.length) return;
            const currentItem = items[items.length - 1];

            // Create module breadcrumb item and separator
            const sep = document.createElement('li');
            sep.className = 'breadcrumb-separator';
            sep.setAttribute('aria-hidden', 'true');
            sep.textContent = '>';

            const li = document.createElement('li');
            li.className = 'breadcrumb-item';
            const a = document.createElement('a');
            a.className = 'breadcrumb-link';
            a.href = data.url;
            a.innerHTML = '<span class="breadcrumb-icon icon-book"></span><span>' + (data.name || 'Module') + '</span>';
            li.appendChild(a);

            // Insert before the current item
            ol.insertBefore(sep, currentItem);
            ol.insertBefore(li, sep);
        } catch (_) { /* no-op */ }
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
