document.addEventListener("DOMContentLoaded", function() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) {
        console.warn('Footer placeholder not found');
        return;
    }

    // Configuration
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 1000; // 1 second
    const FETCH_TIMEOUT = 5000; // 5 seconds

    // Determine the path to the footer file based on the current page's depth
    const path = window.location.pathname;
    const depth = path.split('/').length - 2;
    const relativePath = '../'.repeat(depth > 0 ? depth : 0) + 'shared/footer.html';

    // Show loading state
    function showLoadingState() {
        placeholder.innerHTML = '<div style="text-align: center; padding: 2rem; color: #9ca3af;">Loading footer...</div>';
    }

    // Static fallback footer
    function showFallbackFooter() {
        console.warn('Showing fallback footer');
        placeholder.innerHTML = `
            <footer class="bg-white border-t border-gray-200 mt-16">
                <div class="container mx-auto px-4 py-12">
                    <div class="max-w-4xl mx-auto text-center">
                        <div class="mb-6">
                            <h3 class="google-sans text-lg font-bold text-gray-900 mb-2">GBS EMEA Learning Hub</h3>
                            <p class="text-gray-600 text-sm">Empowering teams with AI-driven learning</p>
                        </div>
                        <div class="flex flex-wrap justify-center gap-4 mb-4 text-xs">
                            <a href="${getRelativePath('/privacy-policy/')}" class="text-gray-600 hover:text-blue-600">Privacy Policy</a>
                            <span class="text-gray-400">•</span>
                            <a href="${getRelativePath('/terms-of-service/')}" class="text-gray-600 hover:text-blue-600">Terms of Service</a>
                            <span class="text-gray-400">•</span>
                            <a href="${getRelativePath('/faq.html')}" class="text-gray-600 hover:text-blue-600">FAQ</a>
                            <span class="text-gray-400">•</span>
                            <a href="${getRelativePath('/feedback/')}" class="text-gray-600 hover:text-blue-600">Feedback</a>
                        </div>
                        <div class="text-sm text-gray-500 pt-4 border-t border-gray-200">
                            © 2026 GBS EMEA. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }

    // Get relative path helper
    function getRelativePath(absolutePath) {
        const relativePrefix = '../'.repeat(depth > 0 ? depth : 0);
        return relativePrefix.slice(0, -1) + absolutePath;
    }

    // Fetch with timeout
    function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
        return Promise.race([
            fetch(url),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), timeout)
            )
        ]);
    }

    // Load footer with retry logic
    async function loadFooter(retryCount = 0) {
        try {
            console.log(`Loading footer from: ${relativePath} (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);

            const response = await fetchWithTimeout(relativePath);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text();

            if (!data || data.trim().length === 0) {
                throw new Error('Empty footer content received');
            }

            placeholder.innerHTML = data;

            // Adjust link paths to be relative to the root
            const links = placeholder.querySelectorAll('a');
            const isFileProtocol = window.location.protocol === 'file:';

            links.forEach(link => {
                const originalHref = link.getAttribute('href');
                if (originalHref && originalHref.startsWith('/')) {
                    let newHref = originalHref;
                    if (isFileProtocol) {
                        // For local file viewing, construct a relative path from the root
                        const rootPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/shared/'));
                        newHref = `file://${rootPath}${originalHref}`;
                    } else {
                        // For server viewing, construct relative path
                        newHref = getRelativePath(originalHref);
                    }
                    link.setAttribute('href', newHref);
                }
            });

            console.log('Footer loaded successfully');

        } catch (error) {
            console.error(`Footer loading error (attempt ${retryCount + 1}):`, error.message);

            // Retry logic
            if (retryCount < MAX_RETRIES) {
                console.log(`Retrying in ${RETRY_DELAY}ms...`);
                setTimeout(() => loadFooter(retryCount + 1), RETRY_DELAY);
            } else {
                // All retries exhausted, show fallback
                console.error('All retry attempts failed. Showing fallback footer.');
                showFallbackFooter();
            }
        }
    }

    // Start loading
    showLoadingState();
    loadFooter();
});
