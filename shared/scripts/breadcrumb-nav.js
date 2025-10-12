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

    // Module context: remember the module page a user came from
    // and provide a Back to Module button on session pages
    function setupModuleContext() {
        try {
            const KEY = 'rpo:lastModule';
            const path = (window.location.pathname || '').toLowerCase();

            // Helper to store module context
            const saveModule = (url, name) => {
                if (!url) return;
                const data = { url, name: name || 'Module', ts: Date.now() };
                sessionStorage.setItem(KEY, JSON.stringify(data));
            };

            // 1) If we are on a module/hub page, cache it for subsequent clicks
            const isModulePage = (path.includes('/rpo-training/') && !path.includes('/rpo-training/sessions/'));
            if (isModulePage) {
                // Derive a friendly name
                const h1 = document.querySelector('h1,h2');
                const name = (h1 && h1.textContent) ? h1.textContent.trim() : 'RPO Training';
                saveModule(window.location.href, name);
            }

            // 2) If we landed here from a module page, store that referrer
            const ref = document.referrer || '';
            if (ref.includes('/rpo-training/pathways/') || ref.includes('/rpo-training/modules/')) {
                // Try to read the title from the current document (best effort)
                const name = 'Module';
                saveModule(ref, name);
            }

            // 3) On a session page, inject Back to Module if cached
            const isSessionPage = path.includes('/rpo-training/sessions/');
            if (isSessionPage) {
                const raw = sessionStorage.getItem(KEY);
                let data = raw ? JSON.parse(raw) : null;

                // If no stored module, but referrer is within rpo-training, use it
                if (!data && (ref && ref.includes('/rpo-training/'))) {
                    data = { url: ref, name: 'RPO Training' };
                }

                if (data) {
                    const actions = document.querySelector('.breadcrumb-actions');
                    if (actions) {
                        const back = document.createElement('a');
                        back.className = 'breadcrumb-back-btn';
                        back.href = data.url;
                        back.setAttribute('aria-label', 'Back to Module');
                        const label = (data.name && data.name.length < 60) ? data.name : 'Module';
                        back.innerHTML = '<span class="icon-arrow-left"></span><span>Back to ' + label + '</span>';
                        actions.prepend(back);
                    } else {
                        // If actions block is missing for some reason, append near breadcrumb nav
                        const nav = document.querySelector('.breadcrumb-container .breadcrumb-wrapper');
                        if (nav) {
                            const fallback = document.createElement('div');
                            fallback.className = 'breadcrumb-actions';
                            const back2 = document.createElement('a');
                            back2.className = 'breadcrumb-back-btn';
                            back2.href = data.url;
                            back2.setAttribute('aria-label', 'Back to Module');
                            const label2 = (data.name && data.name.length < 60) ? data.name : 'Module';
                            back2.innerHTML = '<span class=\"icon-arrow-left\"></span><span>Back to ' + label2 + '</span>';
                            fallback.appendChild(back2);
                            nav.appendChild(fallback);
                        }
                    }
                }
                // If still no data, provide a generic back to RPO hub
                if (!data) {
                    const actions = document.querySelector('.breadcrumb-actions');
                    if (actions) {
                        const back = document.createElement('a');
                        back.className = 'breadcrumb-back-btn';
                        const target = getRpoHubURL();
                        back.href = target;
                        back.setAttribute('aria-label', 'Back to RPO Training');
                        back.innerHTML = '<span class="icon-arrow-left"></span><span>Back to RPO Training</span>';
                        actions.prepend(back);
                    }
                }
            }
        } catch (_) { /* no-op */ }
    }

    // If on a session page and we have a module context, extend the breadcrumb trail with the module item
    function insertModuleBreadcrumb() {
        try {
            const path = (window.location.pathname || '').toLowerCase();
            if (!path.includes('/rpo-training/sessions/')) return;

            const raw = sessionStorage.getItem('rpo:lastModule');
            const data = raw ? JSON.parse(raw) : null;
            if (!data || !data.url) return;

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
