/**
 * GDPR-Compliant Cookie Consent Banner
 * GBS EMEA Learning Hub
 *
 * This script manages cookie consent in compliance with GDPR and ePrivacy Directive.
 * It blocks non-essential cookies until user consent is obtained.
 */

class CookieConsentManager {
    constructor() {
        this.consentCookieName = 'gbs_cookie_consent';
        this.consentVersion = '1.0';
        this.consentExpiry = 365; // days

        // Cookie categories
        this.cookieCategories = {
            necessary: true, // Always enabled
            analytics: false,
            functional: false
        };

        this.init();
    }

    /**
     * Initialize the cookie consent manager
     */
    init() {
        // Check if consent has already been given
        const existingConsent = this.getConsent();

        if (existingConsent) {
            // Apply existing consent
            this.applyConsent(existingConsent);
        } else {
            // Show consent banner
            this.showBanner();
        }

        // Listen for settings button clicks
        this.setupEventListeners();
    }

    /**
     * Get existing consent from cookie
     */
    getConsent() {
        const consent = this.getCookie(this.consentCookieName);
        if (consent) {
            try {
                return JSON.parse(decodeURIComponent(consent));
            } catch (e) {
                console.error('Error parsing consent cookie:', e);
                return null;
            }
        }
        return null;
    }

    /**
     * Save consent to cookie
     */
    saveConsent(preferences) {
        const consentData = {
            version: this.consentVersion,
            timestamp: new Date().toISOString(),
            preferences: preferences
        };

        this.setCookie(
            this.consentCookieName,
            encodeURIComponent(JSON.stringify(consentData)),
            this.consentExpiry
        );

        this.applyConsent(consentData);
    }

    /**
     * Apply consent preferences
     */
    applyConsent(consentData) {
        const preferences = consentData.preferences;

        // Store preferences globally
        window.cookieConsent = preferences;

        // Enable analytics if consented
        if (preferences.analytics && typeof window.enableAnalytics === 'function') {
            window.enableAnalytics();
        }

        // Dispatch custom event for other scripts to listen to
        window.dispatchEvent(new CustomEvent('cookieConsentUpdate', {
            detail: preferences
        }));
    }

    /**
     * Show the cookie consent banner
     */
    showBanner() {
        // Create banner HTML
        const bannerHTML = `
            <div id="cookie-consent-banner" class="cookie-consent-banner" role="dialog" aria-live="polite" aria-label="Cookie consent banner">
                <div class="cookie-consent-container">
                    <div class="cookie-consent-content">
                        <div class="cookie-consent-icon">
                            🍪
                        </div>
                        <div class="cookie-consent-text">
                            <h3 class="cookie-consent-title">We value your privacy</h3>
                            <p class="cookie-consent-description">
                                We use cookies to enhance your experience, analyze site usage, and improve our platform.
                                By clicking "Accept All", you consent to our use of cookies.
                                <a href="/cookie-policy/" class="cookie-consent-link">Learn more about cookies</a>
                            </p>
                        </div>
                    </div>
                    <div class="cookie-consent-actions">
                        <button id="cookie-settings-btn" class="cookie-btn cookie-btn-secondary" aria-label="Customize cookie settings">
                            <svg class="cookie-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M12 1v6m0 6v6m5.196-15.196l-4.242 4.242m-5.908 5.908l-4.242 4.242m16.396 0l-4.242-4.242m-5.908-5.908L1.804 1.804"></path>
                            </svg>
                            Settings
                        </button>
                        <button id="cookie-reject-btn" class="cookie-btn cookie-btn-secondary" aria-label="Reject optional cookies">
                            Reject All
                        </button>
                        <button id="cookie-accept-btn" class="cookie-btn cookie-btn-primary" aria-label="Accept all cookies">
                            Accept All
                        </button>
                    </div>
                </div>
            </div>

            <div id="cookie-settings-modal" class="cookie-modal" style="display: none;" role="dialog" aria-labelledby="cookie-settings-title" aria-modal="true">
                <div class="cookie-modal-overlay"></div>
                <div class="cookie-modal-content">
                    <div class="cookie-modal-header">
                        <h2 id="cookie-settings-title" class="cookie-modal-title">Cookie Settings</h2>
                        <button id="cookie-modal-close" class="cookie-modal-close" aria-label="Close cookie settings">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="cookie-modal-body">
                        <p class="cookie-modal-intro">
                            Manage your cookie preferences. Necessary cookies are always enabled as they are essential
                            for the platform to function properly.
                        </p>

                        <!-- Necessary Cookies -->
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <div class="cookie-category-info">
                                    <h3 class="cookie-category-title">
                                        <span class="cookie-category-icon">🔒</span>
                                        Strictly Necessary Cookies
                                    </h3>
                                    <p class="cookie-category-description">
                                        These cookies are essential for the platform to function and cannot be disabled.
                                    </p>
                                </div>
                                <div class="cookie-toggle">
                                    <input type="checkbox" id="cookie-necessary" checked disabled>
                                    <label for="cookie-necessary" class="cookie-toggle-label">
                                        <span class="cookie-toggle-switch"></span>
                                        <span class="cookie-toggle-text">Always On</span>
                                    </label>
                                </div>
                            </div>
                            <div class="cookie-category-details">
                                <p><strong>Purpose:</strong> Session management, security, authentication</p>
                                <p><strong>Examples:</strong> session_id, csrf_token, cookie_consent</p>
                            </div>
                        </div>

                        <!-- Analytics Cookies -->
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <div class="cookie-category-info">
                                    <h3 class="cookie-category-title">
                                        <span class="cookie-category-icon">📊</span>
                                        Analytics Cookies
                                    </h3>
                                    <p class="cookie-category-description">
                                        Help us understand how you use the platform to improve user experience.
                                    </p>
                                </div>
                                <div class="cookie-toggle">
                                    <input type="checkbox" id="cookie-analytics" class="cookie-toggle-input">
                                    <label for="cookie-analytics" class="cookie-toggle-label">
                                        <span class="cookie-toggle-switch"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="cookie-category-details">
                                <p><strong>Purpose:</strong> Usage analytics, performance monitoring</p>
                                <p><strong>Provider:</strong> Google Analytics</p>
                                <p><strong>Examples:</strong> _ga, _gid, _gat</p>
                                <p><strong>Duration:</strong> Up to 2 years</p>
                            </div>
                        </div>

                        <!-- Functional Cookies -->
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <div class="cookie-category-info">
                                    <h3 class="cookie-category-title">
                                        <span class="cookie-category-icon">⚙️</span>
                                        Functional Cookies
                                    </h3>
                                    <p class="cookie-category-description">
                                        Enable personalized features and remember your preferences.
                                    </p>
                                </div>
                                <div class="cookie-toggle">
                                    <input type="checkbox" id="cookie-functional" class="cookie-toggle-input">
                                    <label for="cookie-functional" class="cookie-toggle-label">
                                        <span class="cookie-toggle-switch"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="cookie-category-details">
                                <p><strong>Purpose:</strong> User preferences, learning progress, personalization</p>
                                <p><strong>Storage:</strong> Local storage and cookies</p>
                                <p><strong>Duration:</strong> Persistent until cleared</p>
                            </div>
                        </div>

                        <div class="cookie-modal-links">
                            <a href="/privacy-policy/" class="cookie-modal-link">Privacy Policy</a>
                            <a href="/cookie-policy/" class="cookie-modal-link">Cookie Policy</a>
                        </div>
                    </div>
                    <div class="cookie-modal-footer">
                        <button id="cookie-save-settings" class="cookie-btn cookie-btn-primary cookie-btn-large">
                            Save My Preferences
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add banner to page
        document.body.insertAdjacentHTML('beforeend', bannerHTML);

        // Add event listeners
        this.attachBannerListeners();
    }

    /**
     * Attach event listeners to banner buttons
     */
    attachBannerListeners() {
        // Accept all button
        const acceptBtn = document.getElementById('cookie-accept-btn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptAll());
        }

        // Reject all button
        const rejectBtn = document.getElementById('cookie-reject-btn');
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => this.rejectAll());
        }

        // Settings button
        const settingsBtn = document.getElementById('cookie-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }

        // Close modal button
        const closeBtn = document.getElementById('cookie-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeSettings());
        }

        // Save settings button
        const saveBtn = document.getElementById('cookie-save-settings');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSettings());
        }

        // Close modal on overlay click
        const overlay = document.querySelector('.cookie-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeSettings());
        }
    }

    /**
     * Accept all cookies
     */
    acceptAll() {
        const preferences = {
            necessary: true,
            analytics: true,
            functional: true
        };

        this.saveConsent(preferences);
        this.hideBanner();
    }

    /**
     * Reject all optional cookies
     */
    rejectAll() {
        const preferences = {
            necessary: true,
            analytics: false,
            functional: false
        };

        this.saveConsent(preferences);
        this.hideBanner();
    }

    /**
     * Open settings modal
     */
    openSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Load current preferences if they exist
            const existingConsent = this.getConsent();
            if (existingConsent) {
                const prefs = existingConsent.preferences;
                document.getElementById('cookie-analytics').checked = prefs.analytics || false;
                document.getElementById('cookie-functional').checked = prefs.functional || false;
            }
        }
    }

    /**
     * Close settings modal
     */
    closeSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    /**
     * Save custom settings
     */
    saveSettings() {
        const preferences = {
            necessary: true,
            analytics: document.getElementById('cookie-analytics').checked,
            functional: document.getElementById('cookie-functional').checked
        };

        this.saveConsent(preferences);
        this.closeSettings();
        this.hideBanner();
    }

    /**
     * Hide the consent banner
     */
    hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }

    /**
     * Setup global event listeners for reopening settings
     */
    setupEventListeners() {
        // Listen for custom events to reopen cookie settings
        window.addEventListener('openCookieSettings', () => {
            // If banner doesn't exist, create it temporarily just to open settings
            if (!document.getElementById('cookie-consent-banner')) {
                this.showBanner();
            }
            this.openSettings();
        });
    }

    /**
     * Utility: Get cookie value
     */
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    /**
     * Utility: Set cookie
     */
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    /**
     * Check if analytics are consented
     */
    static hasAnalyticsConsent() {
        if (window.cookieConsent && window.cookieConsent.analytics) {
            return true;
        }
        return false;
    }
}

// Initialize cookie consent when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cookieConsentManager = new CookieConsentManager();
    });
} else {
    window.cookieConsentManager = new CookieConsentManager();
}

// Export for use in other scripts
window.CookieConsentManager = CookieConsentManager;
