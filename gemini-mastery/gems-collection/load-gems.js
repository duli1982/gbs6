/**
 * GEMS COLLECTION - DYNAMIC JSON LOADER
 *
 * This script loads gems from gems.json and renders them dynamically
 * Replaces hardcoded gem cards with CMS-managed content
 */

// Load gems from JSON on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadAndRenderGems();
});

/**
 * Main function to load and render gems
 */
async function loadAndRenderGems() {
    try {
        console.log('Loading gems from JSON...');
        const response = await fetch('gems.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Loaded ${data.gems.length} gems`);

        renderGems(data.gems);
        console.log('Gems rendered successfully!');

    } catch (error) {
        console.error('Failed to load gems:', error);
        showErrorMessage();
    }
}

/**
 * Render all gems to the page
 */
function renderGems(gems) {
    const container = document.querySelector('.gems-grid');

    if (!container) {
        console.error('Gems container not found!');
        return;
    }

    // Clear existing content (remove hardcoded gems)
    container.innerHTML = '';

    // Render each gem
    gems.forEach(gem => {
        const gemCard = createGemCard(gem);
        container.appendChild(gemCard);
    });

    // Re-initialize animations and observers after rendering
    initializeGemAnimations();
}

/**
 * Create a gem card element
 */
function createGemCard(gem) {
    const card = document.createElement('div');
    card.className = 'gem-card';

    // Set category data attribute for filtering
    const categorySlug = gem.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
    card.dataset.category = categorySlug;

    // Build the card HTML
    card.innerHTML = `
        <div class="gem-status status-${gem.status.toLowerCase().replace(/\s+/g, '-')}">${gem.status}</div>
        <div class="gem-icon ${gem.iconColor}">${gem.icon}</div>
        <div class="gem-category">${gem.category}</div>
        <h3 class="text-2xl font-bold text-gray-800 mb-3">${gem.title}</h3>
        <p class="text-gray-600 mb-4 leading-relaxed">${gem.description}</p>

        <div class="prompt-preview mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 class="font-semibold text-gray-700 mb-2">Perfect For:</h4>
            <ul class="text-sm text-gray-600 space-y-1">
                ${gem.perfectFor.slice(0, 3).map(item => `<li>• ${item}</li>`).join('')}
            </ul>
        </div>

        <div class="key-features mt-4 space-y-2">
            <h4 class="font-semibold text-gray-700 mb-2">Key Features:</h4>
            ${gem.keyFeatures.slice(0, 2).map(feature => `
                <div class="flex items-start gap-2 text-sm text-gray-600">
                    <span class="flex-shrink-0">${feature.icon}</span>
                    <div>
                        <span class="font-medium">${feature.title}:</span>
                        <span>${feature.description}</span>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="mt-6">
            <a href="gem.html?id=${gem.id}"
               class="inline-block text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full">
                Explore This Gem
            </a>
        </div>
    `;

    return card;
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    toast.className = `fixed bottom-8 right-8 z-50 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg`;
    toast.style.animation = 'slideInRight 0.3s ease-out';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Show error message when gems fail to load
 */
function showErrorMessage() {
    const container = document.querySelector('.gems-grid');
    if (container) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-6xl mb-4">⚠️</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Failed to Load Gems</h3>
                <p class="text-gray-600 mb-4">We couldn't load the gems collection. Please try refreshing the page.</p>
                <button onclick="location.reload()"
                        class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                    Refresh Page
                </button>
            </div>
        `;
    }
}

/**
 * Re-initialize animations after dynamic rendering
 */
function initializeGemAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all gem cards
    document.querySelectorAll('.gem-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Add animation keyframes to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('Gems JSON loader initialized');
