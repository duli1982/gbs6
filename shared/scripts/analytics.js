/**
 * GDPR-Compliant Google Analytics Configuration
 * GBS EMEA Learning Hub
 *
 * This script only initializes Google Analytics after user consent is obtained.
 * It respects the cookie consent settings and complies with GDPR requirements.
 */

// Initialize dataLayer
window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}

// Google Analytics ID
const GA_TRACKING_ID = 'G-RGZJ52VXFF';

// Flag to track if GA has been initialized
let analyticsInitialized = false;

/**
 * Enable Google Analytics after consent
 */
window.enableAnalytics = function() {
    // Prevent double initialization
    if (analyticsInitialized) {
        console.log('Google Analytics already initialized');
        return;
    }

    console.log('Initializing Google Analytics with user consent');

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;

    script.onload = function() {
        // Configure Google Analytics
        gtag('js', new Date());
        gtag('config', GA_TRACKING_ID, {
            'anonymize_ip': true, // Anonymize IP addresses for privacy
            'cookie_flags': 'SameSite=Lax;Secure', // Secure cookie settings
            'cookie_expires': 63072000 // 2 years in seconds (GA default)
        });

        analyticsInitialized = true;
        console.log('Google Analytics initialized successfully');

        // Dispatch event for other scripts to know GA is ready
        window.dispatchEvent(new CustomEvent('analyticsReady'));
    };

    script.onerror = function() {
        console.error('Failed to load Google Analytics');
    };

    // Add script to page
    document.head.appendChild(script);
};

/**
 * Disable Google Analytics
 */
window.disableAnalytics = function() {
    // Set Google Analytics opt-out property
    window['ga-disable-' + GA_TRACKING_ID] = true;
    console.log('Google Analytics disabled');
};

/**
 * Check if analytics consent has been given and enable if so
 */
function checkAnalyticsConsent() {
    // Check if cookie consent exists
    if (typeof window.cookieConsent !== 'undefined' && window.cookieConsent.analytics) {
        window.enableAnalytics();
    } else if (typeof CookieConsentManager !== 'undefined' && CookieConsentManager.hasAnalyticsConsent()) {
        window.enableAnalytics();
    }
}

/**
 * Listen for cookie consent updates
 */
window.addEventListener('cookieConsentUpdate', function(event) {
    const preferences = event.detail;

    if (preferences.analytics && !analyticsInitialized) {
        // User consented to analytics
        window.enableAnalytics();
    } else if (!preferences.analytics && analyticsInitialized) {
        // User revoked consent
        window.disableAnalytics();
    }
});

/**
 * Custom event tracking function (only works if consent given)
 */
window.trackEvent = function(eventName, eventParams = {}) {
    if (!analyticsInitialized) {
        console.warn('Analytics not initialized - event not tracked:', eventName);
        return;
    }

    gtag('event', eventName, eventParams);
    console.log('Event tracked:', eventName, eventParams);
};

/**
 * Custom page view tracking
 */
window.trackPageView = function(pagePath, pageTitle) {
    if (!analyticsInitialized) {
        console.warn('Analytics not initialized - page view not tracked');
        return;
    }

    gtag('config', GA_TRACKING_ID, {
        'page_path': pagePath || window.location.pathname,
        'page_title': pageTitle || document.title
    });
};

// Check for existing consent on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAnalyticsConsent);
} else {
    // DOM already loaded
    checkAnalyticsConsent();
}

// Also check periodically in case cookie consent loads later
let consentCheckAttempts = 0;
const consentCheckInterval = setInterval(function() {
    if (analyticsInitialized || consentCheckAttempts > 20) {
        // Stop checking if analytics initialized or after 10 seconds
        clearInterval(consentCheckInterval);
        return;
    }

    checkAnalyticsConsent();
    consentCheckAttempts++;
}, 500);

// Export for debugging
window.analyticsDebug = {
    isInitialized: () => analyticsInitialized,
    hasConsent: () => window.cookieConsent && window.cookieConsent.analytics,
    trackingId: GA_TRACKING_ID
};

console.log('Analytics script loaded - waiting for user consent');
