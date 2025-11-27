/**
 * USE CASES - DYNAMIC JSON LOADER
 *
 * This script loads use cases from use-cases.json and renders them dynamically
 * Replaces hardcoded use case cards with CMS-managed content
 */

// Load use cases from JSON on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadAndRenderUseCases();
});

/**
 * Main function to load and render use cases
 */
async function loadAndRenderUseCases() {
    try {
        console.log('Loading use cases from JSON...');
        const response = await fetch('use-cases.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Loaded ${data.useCases.length} use cases`);

        renderUseCases(data.useCases);
        renderFeaturedStories(data.featuredStories);
        renderImpactStats(data.impactStats);
        console.log('Use cases rendered successfully!');

    } catch (error) {
        console.error('Failed to load use cases:', error);
        showErrorMessage();
    }
}

/**
 * Render impact statistics header
 */
function renderImpactStats(stats) {
    const container = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3.gap-6.max-w-4xl.mx-auto');
    if (!container) return;

    container.innerHTML = '';
    stats.forEach(stat => {
        const statCard = document.createElement('div');
        statCard.className = 'impact-stat p-6 rounded-xl';
        statCard.innerHTML = `
            <div class="text-3xl font-bold mb-2">${stat.value}</div>
            <div class="text-sm opacity-90">${stat.label}</div>
        `;
        container.appendChild(statCard);
    });
}

/**
 * Render featured success stories
 */
function renderFeaturedStories(stories) {
    const container = document.querySelector('.max-w-6xl.mx-auto.grid.grid-cols-1.md\\:grid-cols-3.gap-6');
    if (!container) return;

    container.innerHTML = '';
    stories.forEach(story => {
        const storyCard = document.createElement('div');
        storyCard.className = `bg-gradient-to-br ${story.gradient} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`;

        let metricsHTML = '';
        if (story.timeSaved && story.betterCandidates) {
            metricsHTML = `
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs text-gray-600">Time saved:</span>
                    <span class="text-lg font-bold text-blue-600">${story.timeSaved}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-600">Better candidates:</span>
                    <span class="text-lg font-bold text-green-600">${story.betterCandidates}</span>
                </div>
            `;
        } else if (story.fasterCreation && story.responseRate) {
            metricsHTML = `
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs text-gray-600">Faster creation:</span>
                    <span class="text-lg font-bold text-emerald-600">${story.fasterCreation}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-600">Response rate:</span>
                    <span class="text-lg font-bold text-green-600">${story.responseRate}</span>
                </div>
            `;
        } else if (story.timeSaved && story.weeklySavings) {
            metricsHTML = `
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs text-gray-600">Time saved:</span>
                    <span class="text-lg font-bold text-blue-600">${story.timeSaved}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-600">Weekly savings:</span>
                    <span class="text-lg font-bold text-purple-600">${story.weeklySavings}</span>
                </div>
            `;
        } else if (story.timeSaved && story.insightQuality) {
            metricsHTML = `
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs text-gray-600">Time saved:</span>
                    <span class="text-lg font-bold text-purple-600">${story.timeSaved}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-600">Insight quality:</span>
                    <span class="text-lg font-bold text-pink-600">${story.insightQuality}</span>
                </div>
            `;
        }

        storyCard.innerHTML = `
            <div class="text-4xl mb-3">${story.icon}</div>
            <h3 class="google-sans text-lg font-bold text-gray-900 mb-2">${story.title}</h3>
            <p class="text-gray-700 text-sm mb-4">"${story.quote}"</p>
            <div class="bg-white rounded-lg p-4 mb-3">
                ${metricsHTML}
            </div>
            <div class="text-xs text-gray-600">
                <strong>${story.name}</strong> - ${story.role}
            </div>
        `;
        container.appendChild(storyCard);
    });
}

/**
 * Render all use cases to the page
 */
function renderUseCases(useCases) {
    const container = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2.gap-8.max-w-6xl.mx-auto');

    if (!container) {
        console.error('Use cases container not found!');
        return;
    }

    // Clear existing content (remove hardcoded use cases)
    container.innerHTML = '';

    // Sort by order and render each use case
    useCases.sort((a, b) => a.order - b.order);
    useCases.forEach(useCase => {
        const useCaseCard = createUseCaseCard(useCase);
        container.appendChild(useCaseCard);
    });

    // Re-initialize animations after rendering
    initializeUseCaseAnimations();
}

/**
 * Create a use case card element
 */
function createUseCaseCard(useCase) {
    const card = document.createElement('div');
    card.className = `use-case-card ${useCase.cardColor} p-8 rounded-xl case-item`;
    card.dataset.category = useCase.categorySlug;
    if (useCase.id === 'boolean-search' || useCase.id === 'job-description' || useCase.id === 'candidate-outreach') {
        card.id = useCase.demoType;
    }

    // Build prerequisites HTML
    const prerequisitesHTML = `
        <div class="mb-4 p-3 bg-${useCase.badgeColor}-50 rounded-lg">
            <h4 class="font-semibold text-${useCase.badgeColor}-900 mb-2">📋 Prerequisites</h4>
            <ul class="text-sm text-${useCase.badgeColor}-800 space-y-1">
                ${useCase.prerequisites.map(prereq => `<li>• ${prereq}</li>`).join('')}
            </ul>
        </div>
    `;

    // Build getting started HTML
    const gettingStartedHTML = `
        <div class="getting-started p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-green-900 mb-3">🚀 Getting Started</h4>
            <div class="space-y-3">
                ${useCase.gettingStarted.map(step => `
                    <div class="flex items-start gap-3">
                        <div class="step-number">${step.step}</div>
                        <div class="text-sm">
                            <strong>${step.title}:</strong> ${step.description}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Build common pitfalls HTML
    const pitfallsHTML = `
        <div class="mb-4">
            <h4 class="font-semibold text-gray-900 mb-2">⚠️ Common Pitfalls</h4>
            <div class="space-y-2">
                ${useCase.commonPitfalls.map(pitfall => `
                    <div class="pitfall-item p-2 rounded text-sm">
                        <strong>${pitfall.title}:</strong> ${pitfall.description}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Build example/output section (varies by use case type)
    let exampleHTML = '';
    if (useCase.realExample) {
        exampleHTML = `
            <div class="mb-4">
                <h4 class="font-semibold text-gray-900 mb-2">Real Example:</h4>
                <div class="bg-gray-50 p-3 rounded text-sm">
                    <strong>Input:</strong> "${useCase.realExample.input}"<br>
                    <strong>AI Output:</strong> ${useCase.realExample.output}
                </div>
            </div>
        `;
    } else if (useCase.sampleOutput) {
        exampleHTML = `
            <div class="mb-4">
                <h4 class="font-semibold text-gray-900 mb-2">Sample Output Structure:</h4>
                <div class="bg-gray-50 p-3 rounded text-sm">
                    ${useCase.sampleOutput.elements.map(el => `<strong>✓ ${el}</strong>`).join('<br>')}
                </div>
            </div>
        `;
    } else if (useCase.personalizationElements) {
        exampleHTML = `
            <div class="mb-4">
                <h4 class="font-semibold text-gray-900 mb-2">Personalization Elements:</h4>
                <div class="flex flex-wrap gap-2">
                    ${useCase.personalizationElements.map(el => {
                        const colorMap = {
                            'Company Research': 'blue',
                            'Role Relevance': 'green',
                            'Career Progression': 'purple',
                            'Industry Insights': 'orange'
                        };
                        const color = colorMap[el] || 'gray';
                        return `<span class="bg-${color}-100 text-${color}-800 px-2 py-1 rounded text-xs">${el}</span>`;
                    }).join('')}
                </div>
            </div>
        `;
    } else if (useCase.analysisIncludes) {
        exampleHTML = `
            <div class="mb-4">
                <h4 class="font-semibold text-gray-900 mb-2">Analysis Includes:</h4>
                <div class="grid grid-cols-2 gap-2 text-sm">
                    ${useCase.analysisIncludes.map(item => `<div>• ${item}</div>`).join('')}
                </div>
            </div>
        `;
    } else if (useCase.questionCategories) {
        exampleHTML = `
            <div class="mb-4">
                <h4 class="font-semibold text-gray-900 mb-2">Question Categories:</h4>
                <div class="flex flex-wrap gap-2">
                    ${useCase.questionCategories.map(cat => {
                        const colorMap = {
                            'Technical Skills': 'indigo',
                            'Behavioral': 'pink',
                            'Situational': 'yellow',
                            'Culture Fit': 'teal'
                        };
                        const color = colorMap[cat] || 'gray';
                        return `<span class="bg-${color}-100 text-${color}-800 px-2 py-1 rounded text-xs">${cat}</span>`;
                    }).join('')}
                </div>
            </div>
        `;
    } else if (useCase.reportFeatures) {
        exampleHTML = `
            <div class="mb-4">
                <h4 class="font-semibold text-gray-900 mb-2">Report Features:</h4>
                <div class="grid grid-cols-2 gap-2 text-sm">
                    ${useCase.reportFeatures.map(feature => `<div>• ${feature}</div>`).join('')}
                </div>
            </div>
        `;
    }

    // Build the complete card HTML
    card.innerHTML = `
        <div class="text-center use-case-icon">${useCase.icon}</div>
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
                <span class="badge-${useCase.categorySlug} px-3 py-1 rounded-full text-xs font-semibold">${useCase.category}</span>
                <span class="difficulty-${useCase.difficultySlug} px-2 py-1 rounded text-xs font-semibold">${useCase.difficulty}</span>
            </div>
            <span class="text-green-600 font-semibold">${useCase.timeSaved}</span>
        </div>
        <h3 class="google-sans text-xl font-bold text-gray-900 mb-3">${useCase.title}</h3>

        <!-- Enhanced Metrics -->
        <div class="grid grid-cols-3 gap-3 mb-4">
            <div class="metric-time p-3 rounded-lg text-center">
                <div class="text-lg font-bold text-blue-700">${useCase.metrics.time.before} → ${useCase.metrics.time.after}</div>
                <div class="text-xs text-gray-600">${useCase.metrics.time.label}</div>
            </div>
            <div class="metric-improvement p-3 rounded-lg text-center">
                <div class="text-lg font-bold text-green-700">${useCase.metrics.improvement.value}</div>
                <div class="text-xs text-gray-600">${useCase.metrics.improvement.label}</div>
            </div>
            <div class="metric-quality p-3 rounded-lg text-center">
                <div class="text-lg font-bold text-purple-700">${useCase.metrics.quality.value}</div>
                <div class="text-xs text-gray-600">${useCase.metrics.quality.label}</div>
            </div>
        </div>

        ${prerequisitesHTML}
        ${gettingStartedHTML}
        ${pitfallsHTML}
        ${exampleHTML}

        <a href="${useCase.gbsPromptLink}"
           class="block w-full bg-${useCase.badgeColor}-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-${useCase.badgeColor}-700 transition-colors duration-200 text-center">
            ${useCase.buttonText || 'Use GBS Prompt'}
        </a>
    `;

    return card;
}

/**
 * Show error message when use cases fail to load
 */
function showErrorMessage() {
    const container = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2.gap-8.max-w-6xl.mx-auto');
    if (container) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-6xl mb-4">⚠️</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Failed to Load Use Cases</h3>
                <p class="text-gray-600 mb-4">We couldn't load the use cases collection. Please try refreshing the page.</p>
                <button onclick="location.reload()"
                        class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Refresh Page
                </button>
            </div>
        `;
    }
}

/**
 * Re-initialize animations after dynamic rendering
 */
function initializeUseCaseAnimations() {
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

    // Observe all use case cards
    document.querySelectorAll('.use-case-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

console.log('Use cases JSON loader initialized');
