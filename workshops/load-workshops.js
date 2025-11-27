/**
 * WORKSHOPS - DYNAMIC JSON LOADER
 *
 * This script loads workshops from workshops.json and renders them dynamically
 * Replaces hardcoded workshop cards with CMS-managed content
 */

// Load workshops from JSON on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadAndRenderWorkshops();
});

/**
 * Main function to load and render workshops
 */
async function loadAndRenderWorkshops() {
    try {
        console.log('Loading workshops from JSON...');
        const response = await fetch('workshops.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Loaded ${data.workshops.length} workshops`);

        renderWorkshops(data.workshops);
        renderWorkshopInfo(data.workshopInfo);
        console.log('Workshops rendered successfully!');

    } catch (error) {
        console.error('Failed to load workshops:', error);
        showErrorMessage();
    }
}

/**
 * Render all workshops to the page
 */
function renderWorkshops(workshops) {
    const container = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4.gap-4.md\\:gap-6.mb-8.md\\:mb-12.px-4');

    if (!container) {
        console.error('Workshops container not found!');
        return;
    }

    // Clear existing content (remove hardcoded workshops)
    container.innerHTML = '';

    // Sort by order and render each workshop
    workshops.sort((a, b) => a.order - b.order);
    workshops.forEach(workshop => {
        const workshopCard = createWorkshopCard(workshop);
        container.appendChild(workshopCard);
    });

    // Re-attach event listeners for register buttons
    attachRegisterButtonListeners();
}

/**
 * Create a workshop card element
 */
function createWorkshopCard(workshop) {
    const card = document.createElement('div');
    card.className = 'workshop-card bg-white p-6 rounded-xl shadow-sm';

    card.innerHTML = `
        <div class="flex items-start justify-between mb-4">
            <div class="workshop-icon ${workshop.iconBackground}">
                ${workshop.icon}
            </div>
        </div>
        <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600 font-medium">${workshop.date}</span>
            <span class="coming-soon-badge">${workshop.statusLabel}</span>
        </div>
        <h3 class="google-sans text-xl font-bold text-gray-900 mb-3">${workshop.title}</h3>
        <p class="text-gray-600 text-sm mb-4 leading-relaxed">${workshop.description}</p>

        <div class="space-y-2 text-xs text-gray-500 mb-6">
            <div><strong>Time:</strong> ${workshop.time}</div>
            <div><strong>Instructor:</strong> ${workshop.instructor}</div>
        </div>

        <button class="register-btn w-full py-3 px-4 text-white font-semibold rounded-lg">
            Register Now
        </button>
    `;

    return card;
}

/**
 * Render workshop information section
 */
function renderWorkshopInfo(workshopInfo) {
    // Render "What to Expect" section
    const expectContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-8 > div:first-child ul');
    if (expectContainer && workshopInfo.whatToExpect) {
        expectContainer.innerHTML = '';
        workshopInfo.whatToExpect.forEach(item => {
            const li = document.createElement('li');
            li.className = 'flex items-start';
            li.innerHTML = `
                <span class="${item.color} mr-2">${item.icon}</span>
                ${item.text}
            `;
            expectContainer.appendChild(li);
        });
    }

    // Render "Registration Details" section
    const detailsContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-8 > div:last-child ul');
    if (detailsContainer && workshopInfo.registrationDetails) {
        detailsContainer.innerHTML = '';
        workshopInfo.registrationDetails.forEach(item => {
            const li = document.createElement('li');
            li.className = 'flex items-start';
            li.innerHTML = `
                <span class="${item.color} mr-2">${item.icon}</span>
                ${item.text}
            `;
            detailsContainer.appendChild(li);
        });
    }
}

/**
 * Attach event listeners to register buttons
 */
function attachRegisterButtonListeners() {
    document.querySelectorAll('.register-btn').forEach(button => {
        button.addEventListener('click', function() {
            openRegistrationModal();
        });
    });
}

/**
 * Show error message when workshops fail to load
 */
function showErrorMessage() {
    const container = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4.gap-4.md\\:gap-6.mb-8.md\\:mb-12.px-4');
    if (container) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-6xl mb-4">⚠️</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Failed to Load Workshops</h3>
                <p class="text-gray-600 mb-4">We couldn't load the workshops collection. Please try refreshing the page.</p>
                <button onclick="location.reload()"
                        class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Refresh Page
                </button>
            </div>
        `;
    }
}

console.log('Workshops JSON loader initialized');
