/**
 * KNOWLEDGE CONTENT - DYNAMIC JSON LOADER
 *
 * This script loads knowledge content from knowledge.json and renders it dynamically
 * Replaces hardcoded sections with CMS-managed content
 */

// Load knowledge content from JSON on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadAndRenderKnowledge();
});

/**
 * Main function to load and render knowledge content
 */
async function loadAndRenderKnowledge() {
    try {
        console.log('Loading knowledge content from JSON...');
        const response = await fetch('knowledge.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Loaded ${data.sections.length} sections`);

        renderSections(data.sections);
        console.log('Knowledge content rendered successfully!');

    } catch (error) {
        console.error('Failed to load knowledge content:', error);
        showErrorMessage();
    }
}

/**
 * Render all sections to the page
 */
function renderSections(sections) {
    const container = document.querySelector('main.space-y-8');

    if (!container) {
        console.error('Knowledge content container not found!');
        return;
    }

    // Clear existing content (remove hardcoded sections)
    container.innerHTML = '';

    // Sort by order and render each section
    sections.sort((a, b) => a.order - b.order);
    sections.forEach(section => {
        const sectionElement = createSection(section);
        container.appendChild(sectionElement);
    });
}

/**
 * Create a section element
 */
function createSection(section) {
    const sectionEl = document.createElement('section');
    sectionEl.id = section.id;
    sectionEl.className = 'bg-white p-6 rounded-xl shadow-sm border border-gray-200';

    // Create header
    const header = document.createElement('div');
    header.className = 'flex items-center mb-4';
    header.innerHTML = `
        ${section.icon}
        <h2 class="text-2xl font-bold text-gray-800">${section.title}</h2>
    `;

    // Create items container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'space-y-2';

    // Render items based on section type
    section.items.forEach(item => {
        const itemElement = createItem(item);
        itemsContainer.appendChild(itemElement);
    });

    sectionEl.appendChild(header);
    sectionEl.appendChild(itemsContainer);

    return sectionEl;
}

/**
 * Create an item element (video or category with links)
 */
function createItem(item) {
    const details = document.createElement('details');
    details.className = 'group';

    // Create summary (clickable header)
    const summary = document.createElement('summary');
    summary.className = 'flex items-center justify-between p-3 font-semibold text-gray-700 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors';

    if (item.type === 'video') {
        // Video item
        summary.innerHTML = `
            <span>${item.title} <span class="text-sm font-medium text-gray-500">(${item.duration})</span></span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        `;

        // Create video content
        const content = document.createElement('div');
        content.className = 'p-4 mt-2';
        content.innerHTML = `
            <div class="iframe-container rounded-lg">
                <iframe src="${item.embedUrl}" width="640" height="480" allow="autoplay"></iframe>
            </div>
        `;

        details.appendChild(summary);
        details.appendChild(content);

    } else if (item.type === 'category') {
        // Category with links
        summary.innerHTML = `
            ${item.title}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        `;

        // Create links content
        const content = document.createElement('div');
        content.className = 'p-4 space-y-2 border-l-2 border-indigo-200 ml-3';

        item.links.forEach(link => {
            const linkEl = document.createElement('a');
            linkEl.href = link.url;
            linkEl.className = 'block text-indigo-700 hover:underline';
            linkEl.target = '_blank';
            linkEl.rel = 'noopener noreferrer';
            linkEl.textContent = link.text;
            content.appendChild(linkEl);
        });

        details.appendChild(summary);
        details.appendChild(content);
    }

    return details;
}

/**
 * Show error message when knowledge content fails to load
 */
function showErrorMessage() {
    const container = document.querySelector('main.space-y-8');
    if (container) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <div class="text-6xl mb-4">⚠️</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Failed to Load Knowledge Content</h3>
                <p class="text-gray-600 mb-4">We couldn't load the knowledge content. Please try refreshing the page.</p>
                <button onclick="location.reload()"
                        class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                    Refresh Page
                </button>
            </div>
        `;
    }
}

console.log('Knowledge content JSON loader initialized');
