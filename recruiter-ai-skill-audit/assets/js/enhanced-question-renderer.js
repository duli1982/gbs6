/**
 * Enhanced Question Renderer
 * Transforms GOOD question design → GREAT question design
 *
 * Features:
 * 1. Smart Type Indicators
 * 2. Visual Value Indicators
 * 3. Hover Previews
 * 4. Interactive Animations
 * 5. Semantic Emoji System
 * 6. Layered Information
 * 7. Comparative Hover
 * 8. Ranked Multi-Select
 */

class EnhancedQuestionRenderer {
    constructor() {
        this.questionMetadata = this.initializeMetadata();
        this.selectedOptions = new Map();
        this.hoveringOption = null;
    }

    /**
     * Initialize enhanced metadata for all questions
     * Adds AI savings, difficulty, social proof, etc.
     */
    initializeMetadata() {
        return {
            // Sourcing questions
            'sourcing_active_roles': {
                '1-5': { aiSavings: 40, difficulty: 3, popular: 25, timeImpact: '~10 hrs/week', emoji: '🟢', priority: 'low' },
                '6-10': { aiSavings: 55, difficulty: 5, popular: 42, timeImpact: '~20 hrs/week', emoji: '🟡', priority: 'medium' },
                '11-20': { aiSavings: 70, difficulty: 7, popular: 28, timeImpact: '~35 hrs/week', emoji: '🟠', priority: 'high' },
                '20+': { aiSavings: 80, difficulty: 9, popular: 5, timeImpact: '~50 hrs/week', emoji: '🔴', priority: 'critical' }
            },
            'sourcing_profiles_per_role': {
                '10-25': { aiSavings: 45, difficulty: 4, popular: 18, timeImpact: '~2 hrs/role', emoji: '🟢', priority: 'low', tools: ['ChatGPT', 'LinkedIn AI'] },
                '26-50': { aiSavings: 65, difficulty: 6, popular: 42, timeImpact: '~3 hrs/role', emoji: '🟡', priority: 'medium', tools: ['Gemini', 'SeekOut'] },
                '51-100': { aiSavings: 75, difficulty: 7, popular: 32, timeImpact: '~5 hrs/role', emoji: '🟠', priority: 'high', tools: ['HireEZ', 'Copilot'] },
                '100+': { aiSavings: 85, difficulty: 9, popular: 8, timeImpact: '~8 hrs/role', emoji: '🔴', priority: 'critical', tools: ['AI Screening', 'Auto-reject'] }
            },
            'sourcing_boolean_usage': {
                'never': { aiSavings: 70, difficulty: 2, popular: 15, timeImpact: 'Missing opportunities', emoji: '🔴', priority: 'critical' },
                'rarely': { aiSavings: 60, difficulty: 4, popular: 25, timeImpact: '~1 hr/week', emoji: '🟠', priority: 'high' },
                'sometimes': { aiSavings: 50, difficulty: 5, popular: 38, timeImpact: '~2 hrs/week', emoji: '🟡', priority: 'medium' },
                'frequently': { aiSavings: 40, difficulty: 6, popular: 22, timeImpact: '~3 hrs/week', emoji: '🟢', priority: 'low' }
            },

            // Admin questions
            'admin_doc_creation_time': {
                '<1': { aiSavings: 50, difficulty: 3, popular: 20, timeImpact: '<1 hr/week', emoji: '🟢', priority: 'low' },
                '1-3': { aiSavings: 60, difficulty: 5, popular: 40, timeImpact: '~2 hrs/week', emoji: '🟡', priority: 'medium' },
                '3-5': { aiSavings: 70, difficulty: 6, popular: 30, timeImpact: '~4 hrs/week', emoji: '🟠', priority: 'high' },
                '5+': { aiSavings: 80, difficulty: 8, popular: 10, timeImpact: '~6+ hrs/week', emoji: '🔴', priority: 'critical' }
            },

            // Scheduling questions
            'scheduling_interviews_per_week': {
                '1-10': { aiSavings: 50, difficulty: 3, popular: 25, timeImpact: '~3 hrs/week', emoji: '🟢', priority: 'low' },
                '11-25': { aiSavings: 65, difficulty: 5, popular: 45, timeImpact: '~8 hrs/week', emoji: '🟡', priority: 'medium' },
                '26-50': { aiSavings: 75, difficulty: 7, popular: 25, timeImpact: '~15 hrs/week', emoji: '🟠', priority: 'high' },
                '50+': { aiSavings: 85, difficulty: 9, popular: 5, timeImpact: '~25 hrs/week', emoji: '🔴', priority: 'critical' }
            },

            // Compliance questions
            'compliance_weekly_time': {
                '<2': { aiSavings: 40, difficulty: 3, popular: 30, timeImpact: '<2 hrs/week', emoji: '🟢', priority: 'low' },
                '2-5': { aiSavings: 60, difficulty: 5, popular: 45, timeImpact: '~3.5 hrs/week', emoji: '🟡', priority: 'medium' },
                '5-10': { aiSavings: 70, difficulty: 7, popular: 20, timeImpact: '~7.5 hrs/week', emoji: '🟠', priority: 'high' },
                '10+': { aiSavings: 80, difficulty: 9, popular: 5, timeImpact: '~12+ hrs/week', emoji: '🔴', priority: 'critical' }
            },

            // Contracts questions
            'contracts_per_month': {
                '<5': { aiSavings: 45, difficulty: 3, popular: 20, timeImpact: '~2 hrs/month', emoji: '🟢', priority: 'low' },
                '5-10': { aiSavings: 60, difficulty: 5, popular: 40, timeImpact: '~6 hrs/month', emoji: '🟡', priority: 'medium' },
                '10-20': { aiSavings: 70, difficulty: 7, popular: 30, timeImpact: '~12 hrs/month', emoji: '🟠', priority: 'high' },
                '20+': { aiSavings: 80, difficulty: 9, popular: 10, timeImpact: '~20+ hrs/month', emoji: '🔴', priority: 'critical' }
            }
        };
    }

    /**
     * Get metadata for a specific question option
     */
    getMetadata(questionId, optionValue) {
        const questionMeta = this.questionMetadata[questionId];
        if (!questionMeta) return this.getDefaultMetadata();

        const optionMeta = questionMeta[optionValue];
        return optionMeta || this.getDefaultMetadata();
    }

    getDefaultMetadata() {
        return {
            aiSavings: 50,
            difficulty: 5,
            popular: 30,
            timeImpact: 'Variable',
            emoji: '🟡',
            priority: 'medium',
            tools: ['AI Tools Available']
        };
    }

    /**
     * 1. SMART TYPE INDICATORS
     * Renders clear instructions for single vs multi-select
     */
    renderTypeIndicator(question) {
        if (question.type === 'checkbox') {
            const maxSelections = question.maxSelections || null;
            const selectedCount = this.selectedOptions.get(question.id)?.length || 0;

            return `
                <div class="type-indicator mb-4 p-3 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl">☑️</span>
                            <div>
                                <p class="font-semibold text-indigo-900">
                                    ${maxSelections ? `Select up to ${maxSelections}` : 'Select all that apply'}
                                </p>
                                <p class="text-xs text-indigo-600">Pick as many as relevant</p>
                            </div>
                        </div>
                        ${selectedCount > 0 ? `
                            <div class="selection-counter">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-600 text-white">
                                    ✓ ${selectedCount} ${maxSelections ? `of ${maxSelections}` : ''} selected
                                </span>
                            </div>
                        ` : ''}
                    </div>
                    ${maxSelections && selectedCount >= maxSelections ? `
                        <p class="text-xs text-indigo-700 mt-2">
                            ⚠️ Limit reached. Uncheck an item to select another.
                        </p>
                    ` : ''}
                </div>
            `;
        } else {
            return `
                <div class="type-indicator mb-4 p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">⭕</span>
                        <div>
                            <p class="font-semibold text-purple-900">Select one option</p>
                            <p class="text-xs text-purple-600">Choose the best match</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * 2. VISUAL VALUE INDICATORS
     * Shows AI savings potential, difficulty, and popularity as visual bars
     */
    renderVisualIndicators(metadata, option) {
        const { aiSavings, difficulty, popular, timeImpact, priority, emoji } = metadata;

        return `
            <div class="visual-indicators mt-3 space-y-2 p-3 bg-gray-50 rounded-lg">
                <!-- AI Savings Bar -->
                <div class="indicator-row">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-xs font-semibold text-gray-600">AI Savings Potential</span>
                        <span class="text-xs font-bold text-green-600">${aiSavings}% ⚡</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-green-400 to-green-600"
                             style="width: ${aiSavings}%"></div>
                    </div>
                </div>

                <!-- Difficulty Bar -->
                <div class="indicator-row">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-xs font-semibold text-gray-600">Complexity Level</span>
                        <span class="text-xs font-bold ${this.getDifficultyColor(difficulty)}">${difficulty}/10 ${emoji}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="h-2 rounded-full transition-all duration-500 ${this.getDifficultyGradient(difficulty)}"
                             style="width: ${difficulty * 10}%"></div>
                    </div>
                </div>

                <!-- Time Impact & Popularity -->
                <div class="flex justify-between items-center text-xs mt-2">
                    <div class="flex items-center gap-1">
                        <span class="font-semibold text-gray-600">⏱️ Time:</span>
                        <span class="text-gray-700">${timeImpact}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <span class="font-semibold text-gray-600">👥</span>
                        <span class="text-gray-700">${popular}% choose this</span>
                    </div>
                </div>

                <!-- Priority Badge -->
                ${this.renderPriorityBadge(priority)}
            </div>
        `;
    }

    getDifficultyColor(difficulty) {
        if (difficulty <= 3) return 'text-green-600';
        if (difficulty <= 6) return 'text-yellow-600';
        if (difficulty <= 8) return 'text-orange-600';
        return 'text-red-600';
    }

    getDifficultyGradient(difficulty) {
        if (difficulty <= 3) return 'bg-gradient-to-r from-green-300 to-green-500';
        if (difficulty <= 6) return 'bg-gradient-to-r from-yellow-300 to-yellow-500';
        if (difficulty <= 8) return 'bg-gradient-to-r from-orange-300 to-orange-500';
        return 'bg-gradient-to-r from-red-400 to-red-600';
    }

    renderPriorityBadge(priority) {
        const badges = {
            'critical': { color: 'bg-red-500', text: '🚨 CRITICAL', pulse: true },
            'high': { color: 'bg-orange-500', text: '🎯 HIGH PRIORITY', pulse: false },
            'medium': { color: 'bg-yellow-500', text: '📌 MEDIUM', pulse: false },
            'low': { color: 'bg-green-500', text: '💡 OPTIONAL', pulse: false }
        };

        const badge = badges[priority] || badges['medium'];

        return `
            <div class="mt-2">
                <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold text-white ${badge.color} ${badge.pulse ? 'animate-pulse' : ''}">
                    ${badge.text}
                </span>
            </div>
        `;
    }

    /**
     * 3. HOVER PREVIEW SYSTEM
     * Shows detailed impact preview on hover
     */
    renderHoverPreview(questionId, option, metadata) {
        const { aiSavings, timeImpact, tools } = metadata;

        // Calculate monthly and yearly savings based on timeImpact
        const weeklyHours = this.extractHours(timeImpact);
        const monthlySavings = Math.round(weeklyHours * aiSavings / 100 * 4.3 * 10) / 10;
        const yearlySavings = Math.round(weeklyHours * aiSavings / 100 * 52 * 10) / 10;

        return `
            <div class="hover-preview absolute left-0 right-0 top-full mt-2 p-4 bg-white rounded-xl shadow-2xl border-2 border-indigo-200 z-50 opacity-0 pointer-events-none transition-all duration-300" data-preview="${questionId}-${option.value}">
                <div class="text-center mb-3">
                    <p class="text-lg font-bold text-indigo-900">📊 Impact Preview</p>
                    <div class="w-12 h-1 bg-indigo-600 mx-auto mt-2 rounded-full"></div>
                </div>

                <div class="grid grid-cols-3 gap-3 mb-3">
                    <div class="text-center p-2 bg-indigo-50 rounded-lg">
                        <p class="text-xs text-gray-600">Weekly</p>
                        <p class="text-lg font-bold text-indigo-600">${Math.round(weeklyHours * aiSavings / 100 * 10) / 10}h</p>
                    </div>
                    <div class="text-center p-2 bg-purple-50 rounded-lg">
                        <p class="text-xs text-gray-600">Monthly</p>
                        <p class="text-lg font-bold text-purple-600">${monthlySavings}h</p>
                    </div>
                    <div class="text-center p-2 bg-pink-50 rounded-lg">
                        <p class="text-xs text-gray-600">Yearly</p>
                        <p class="text-lg font-bold text-pink-600">${yearlySavings}h</p>
                    </div>
                </div>

                ${tools ? `
                    <div class="mb-3">
                        <p class="text-xs font-semibold text-gray-700 mb-2">🤖 Recommended AI Tools:</p>
                        <div class="flex flex-wrap gap-1">
                            ${tools.map(tool => `
                                <span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">${tool}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg">
                    <p class="text-xs font-semibold text-gray-700 mb-1">🎯 You could:</p>
                    <ul class="text-xs text-gray-600 space-y-1">
                        <li>• Handle ${Math.round(100 / (100 - aiSavings) * 10) / 10}x more work</li>
                        <li>• Focus on strategic tasks</li>
                        <li>• Reduce overtime stress</li>
                    </ul>
                </div>

                <button class="w-full mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm">
                    Click to select →
                </button>
            </div>
        `;
    }

    extractHours(timeImpact) {
        // Extract numeric value from strings like "~3 hrs/week"
        const match = timeImpact.match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 5; // default to 5 if can't extract
    }

    /**
     * 4. LAYERED INFORMATION
     * Progressive disclosure of details
     */
    renderLayeredInfo(metadata, option) {
        return `
            <div class="layered-info mt-2">
                <!-- Always visible summary -->
                <p class="text-sm text-gray-600">${option.description || option.label}</p>

                <!-- Expandable details -->
                <div class="expandable-content hidden mt-2 p-3 bg-blue-50 rounded-lg">
                    <p class="text-xs font-semibold text-blue-900 mb-2">💡 Why this matters:</p>
                    <p class="text-xs text-blue-700">${this.getWhyItMatters(metadata)}</p>

                    <p class="text-xs font-semibold text-blue-900 mt-2 mb-1">📊 Similar users report:</p>
                    <p class="text-xs text-blue-700">${this.getSocialProof(metadata)}</p>
                </div>

                <button class="expand-details-btn text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-1">
                    + Show more details
                </button>
            </div>
        `;
    }

    getWhyItMatters(metadata) {
        if (metadata.aiSavings >= 70) {
            return "High AI automation potential means you could save significant time with the right tools.";
        } else if (metadata.aiSavings >= 50) {
            return "Moderate AI benefit available. Focus on repetitive tasks for best results.";
        } else {
            return "Some AI tools can assist, but manual expertise still important here.";
        }
    }

    getSocialProof(metadata) {
        return `${metadata.popular}% of similar professionals choose this option. Average satisfaction: ${this.calculateSatisfaction(metadata)}/5 ⭐`;
    }

    calculateSatisfaction(metadata) {
        // Higher AI savings and lower difficulty = higher satisfaction
        const score = (metadata.aiSavings + (10 - metadata.difficulty) * 10) / 40;
        return Math.min(5, Math.max(3, Math.round(score * 10) / 10));
    }

    /**
     * 5. SEMANTIC EMOJI SYSTEM
     * Color-coded emojis with specific meanings
     */
    getSemanticEmoji(priority, aiSavings, difficulty) {
        const emojiMap = {
            critical: { icon: '🔴', color: 'text-red-600', bg: 'bg-red-100' },
            high: { icon: '🟠', color: 'text-orange-600', bg: 'bg-orange-100' },
            medium: { icon: '🟡', color: 'text-yellow-600', bg: 'bg-yellow-100' },
            low: { icon: '🟢', color: 'text-green-600', bg: 'bg-green-100' }
        };

        return emojiMap[priority] || emojiMap.medium;
    }

    /**
     * MAIN RENDER METHOD
     * Combines all enhancements into enhanced option rendering
     */
    renderEnhancedOption(question, option, isSelected = false) {
        const metadata = this.getMetadata(question.id, option.value);
        const semanticEmoji = this.getSemanticEmoji(metadata.priority, metadata.aiSavings, metadata.difficulty);

        const baseClass = question.type === 'checkbox'
            ? 'enhanced-checkbox-option'
            : 'enhanced-single-option';

        return `
            <div class="${baseClass} relative group"
                 data-question-id="${question.id}"
                 data-option-value="${option.value}"
                 data-metadata='${JSON.stringify(metadata)}'>

                <!-- Main Option Container -->
                <label class="option-container block p-5 border-2 rounded-xl cursor-pointer transition-all duration-300
                              ${isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-25'}">

                    <div class="flex items-start gap-4">
                        <!-- Semantic Emoji Badge -->
                        <div class="emoji-badge ${semanticEmoji.bg} ${semanticEmoji.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                            ${semanticEmoji.icon}
                        </div>

                        <!-- Content -->
                        <div class="flex-1">
                            <!-- Option Label -->
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-lg font-semibold text-gray-900 group-hover:text-indigo-900">
                                    ${option.label}
                                </span>
                                ${question.type === 'checkbox' ? `
                                    <input type="checkbox"
                                           ${isSelected ? 'checked' : ''}
                                           class="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                                ` : `
                                    <div class="radio-indicator w-5 h-5 rounded-full border-2
                                                ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}
                                                flex items-center justify-center">
                                        ${isSelected ? '<div class="w-2 h-2 bg-white rounded-full"></div>' : ''}
                                    </div>
                                `}
                            </div>

                            <!-- Visual Value Indicators -->
                            ${this.renderVisualIndicators(metadata, option)}

                            <!-- Layered Information -->
                            ${this.renderLayeredInfo(metadata, option)}
                        </div>
                    </div>
                </label>

                <!-- Hover Preview (shown on hover) -->
                ${this.renderHoverPreview(question.id, option, metadata)}
            </div>
        `;
    }

    /**
     * RENDER FULL QUESTION
     * Main entry point for rendering enhanced questions
     */
    renderEnhancedQuestion(question, selectedAnswers = {}) {
        let html = '';

        // Type Indicator
        html += this.renderTypeIndicator(question);

        // Options Container
        html += '<div class="enhanced-options-container space-y-4">';

        question.options.forEach(option => {
            const isSelected = question.type === 'checkbox'
                ? (selectedAnswers[question.id] || []).includes(option.value)
                : selectedAnswers[question.id] === option.value;

            html += this.renderEnhancedOption(question, option, isSelected);
        });

        html += '</div>';

        return html;
    }

    /**
     * ATTACH INTERACTIVE BEHAVIORS
     * Sets up hover previews, expand/collapse, etc.
     */
    attachInteractiveBehaviors(questionElement) {
        // Hover Preview
        const options = questionElement.querySelectorAll('[data-option-value]');
        options.forEach(optionEl => {
            optionEl.addEventListener('mouseenter', () => {
                const preview = optionEl.querySelector('.hover-preview');
                if (preview) {
                    preview.style.opacity = '1';
                    preview.style.pointerEvents = 'auto';
                }
            });

            optionEl.addEventListener('mouseleave', () => {
                const preview = optionEl.querySelector('.hover-preview');
                if (preview) {
                    preview.style.opacity = '0';
                    preview.style.pointerEvents = 'none';
                }
            });
        });

        // Expandable Details
        const expandBtns = questionElement.querySelectorAll('.expand-details-btn');
        expandBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const content = btn.previousElementSibling;
                const isHidden = content.classList.contains('hidden');

                if (isHidden) {
                    content.classList.remove('hidden');
                    content.classList.add('slide-in-up');
                    btn.textContent = '- Show less';
                } else {
                    content.classList.add('hidden');
                    btn.textContent = '+ Show more details';
                }
            });
        });

        // Checkbox limit enforcement
        const checkboxes = questionElement.querySelectorAll('input[type="checkbox"]');
        if (checkboxes.length > 0) {
            const maxSelections = parseInt(questionElement.dataset.maxSelections) || null;

            if (maxSelections) {
                checkboxes.forEach(cb => {
                    cb.addEventListener('change', () => {
                        const checked = Array.from(checkboxes).filter(c => c.checked);
                        if (checked.length >= maxSelections) {
                            checkboxes.forEach(c => {
                                if (!c.checked) c.disabled = true;
                            });
                        } else {
                            checkboxes.forEach(c => c.disabled = false);
                        }
                    });
                });
            }
        }
    }
}

// Initialize globally
if (typeof window !== 'undefined') {
    window.EnhancedQuestionRenderer = EnhancedQuestionRenderer;
    window.enhancedQuestionRenderer = new EnhancedQuestionRenderer();
}
