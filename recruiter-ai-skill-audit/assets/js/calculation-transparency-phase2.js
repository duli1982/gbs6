/**
 * Calculation Transparency - Phase 2: Interactive Features
 *
 * Extends Phase 1 with interactive exploration capabilities:
 * 1. Scenario Comparison - Conservative vs Realistic vs Optimistic
 * 2. Interactive Assumption Adjuster - Sliders to tweak assumptions
 *
 * Requires: calculation-transparency.js (Phase 1)
 */

class CalculationTransparencyPhase2 {
    constructor() {
        this.baseTransparency = window.CalculationTransparency ? new window.CalculationTransparency() : null;
        this.currentScenario = 'conservative'; // Default
        this.customAssumptions = {};
        this.originalSavings = null;
    }

    /**
     * Generate three scenarios from user data
     */
    generateScenarios(businessUnit, answers, baseResults) {
        const scenarios = {
            conservative: this.generateConservativeScenario(businessUnit, answers, baseResults),
            realistic: this.generateRealisticScenario(businessUnit, answers, baseResults),
            optimistic: this.generateOptimisticScenario(businessUnit, answers, baseResults)
        };

        return {
            scenarios,
            comparison: this.compareScenarios(scenarios),
            defaultScenario: 'conservative',
            currentScenario: this.currentScenario
        };
    }

    /**
     * Generate conservative scenario (25th percentile)
     */
    generateConservativeScenario(businessUnit, answers, baseResults) {
        return {
            name: 'Conservative',
            percentile: '25th',
            description: 'Lower bound, high confidence',
            icon: '🛡️',
            color: 'blue',
            likelihood: 'Likely',

            // Use lower multipliers
            multipliers: {
                aiEfficiency: 0.70,        // 70% of claimed AI efficiency
                learningCurve: 0.50,       // 50% discount for learning curve
                adoptionRate: 0.80,        // 80% of users adopt successfully
                confidenceAdjust: 1.0      // No confidence boost
            },

            confidence: {
                level: 'high',
                score: 0.85,
                description: 'High probability of achieving these results'
            },

            assumptions: [
                'User is below-average at learning AI tools',
                'Slowest AI adoption curve assumed',
                'Full learning curve impact accounted for',
                'Conservative AI efficiency estimates'
            ],

            // Calculate savings
            weeklyTimeSaved: this.calculateScenarioSavings(baseResults, {
                aiEfficiency: 0.70,
                learningCurve: 0.50,
                adoptionRate: 0.80,
                confidenceAdjust: 1.0
            }),

            characteristics: [
                'Lower bound estimate',
                'Accounts for slow learners',
                'Includes full learning curve',
                'Very achievable target'
            ]
        };
    }

    /**
     * Generate realistic scenario (50th percentile)
     */
    generateRealisticScenario(businessUnit, answers, baseResults) {
        return {
            name: 'Realistic',
            percentile: '50th',
            description: 'Middle estimate, medium confidence',
            icon: '🎯',
            color: 'green',
            likelihood: 'Possible',

            multipliers: {
                aiEfficiency: 0.85,        // 85% of claimed AI efficiency
                learningCurve: 0.70,       // 30% discount for learning curve
                adoptionRate: 0.90,        // 90% of users adopt successfully
                confidenceAdjust: 0.90     // Slight confidence reduction
            },

            confidence: {
                level: 'medium',
                score: 0.70,
                description: 'Moderate probability of achieving these results'
            },

            assumptions: [
                'User has average AI tool aptitude',
                'Median AI adoption curve assumed',
                '50% learning curve impact',
                'Realistic AI efficiency estimates'
            ],

            weeklyTimeSaved: this.calculateScenarioSavings(baseResults, {
                aiEfficiency: 0.85,
                learningCurve: 0.70,
                adoptionRate: 0.90,
                confidenceAdjust: 0.90
            }),

            characteristics: [
                'Median estimate',
                'Average user capability',
                'Moderate learning curve',
                'Most likely outcome'
            ]
        };
    }

    /**
     * Generate optimistic scenario (75th percentile)
     */
    generateOptimisticScenario(businessUnit, answers, baseResults) {
        return {
            name: 'Optimistic',
            percentile: '75th',
            description: 'Upper bound, low confidence',
            icon: '🚀',
            color: 'purple',
            likelihood: 'Optimistic',

            multipliers: {
                aiEfficiency: 1.0,         // 100% of claimed AI efficiency
                learningCurve: 0.90,       // Only 10% learning curve discount
                adoptionRate: 0.95,        // 95% of users adopt successfully
                confidenceAdjust: 0.75     // Reduced confidence
            },

            confidence: {
                level: 'low',
                score: 0.50,
                description: 'Possible but less certain'
            },

            assumptions: [
                'User is above-average at AI tools',
                'Fast AI adoption curve assumed',
                'Minimal learning curve impact',
                'Best-case AI efficiency'
            },

            weeklyTimeSaved: this.calculateScenarioSavings(baseResults, {
                aiEfficiency: 1.0,
                learningCurve: 0.90,
                adoptionRate: 0.95,
                confidenceAdjust: 0.75
            }),

            characteristics: [
                'Upper bound estimate',
                'Fast learner assumption',
                'Minimal friction',
                'Best-case scenario'
            ]
        };
    }

    /**
     * Calculate savings for a specific scenario
     */
    calculateScenarioSavings(baseResults, multipliers) {
        const baseSavings = baseResults.totalTimeSaved || 0;

        const scenarioSavings = baseSavings *
            multipliers.aiEfficiency *
            multipliers.learningCurve *
            multipliers.adoptionRate *
            multipliers.confidenceAdjust;

        return {
            weekly: Math.round(scenarioSavings),
            monthly: Math.round(scenarioSavings * 4.33),
            yearly: Math.round(scenarioSavings * 52),
            dollarValue: Math.round(scenarioSavings * 52 * 50) // Assume $50/hour
        };
    }

    /**
     * Compare scenarios side by side
     */
    compareScenarios(scenarios) {
        const conservative = scenarios.conservative.weeklyTimeSaved.weekly;
        const realistic = scenarios.realistic.weeklyTimeSaved.weekly;
        const optimistic = scenarios.optimistic.weeklyTimeSaved.weekly;

        return {
            range: {
                min: conservative,
                mid: realistic,
                max: optimistic,
                spread: optimistic - conservative
            },
            recommendation: 'conservative',
            reasoning: 'We show Conservative by default to avoid over-promising. Your actual results may vary.'
        };
    }

    /**
     * Render scenario comparison component
     */
    renderScenarioComparison(scenarioData) {
        const { scenarios, comparison } = scenarioData;
        const conservative = scenarios.conservative;
        const realistic = scenarios.realistic;
        const optimistic = scenarios.optimistic;

        return `
            <div class="scenario-comparison bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 shadow-lg border-2 border-blue-200 mb-8">
                <div class="mb-6">
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">
                        🔀 Three Scenarios: How Much Could You Really Save?
                    </h3>
                    <p class="text-gray-600">
                        We calculated three scenarios based on different assumptions. Choose the one that feels right for you.
                    </p>
                </div>

                <!-- Scenario Cards -->
                <div class="grid md:grid-cols-3 gap-6 mb-6">
                    ${this.renderScenarioCard(conservative, 'conservative')}
                    ${this.renderScenarioCard(realistic, 'realistic')}
                    ${this.renderScenarioCard(optimistic, 'optimistic')}
                </div>

                <!-- Comparison Table -->
                <div class="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                    <h4 class="font-bold text-gray-900 mb-4">Quick Comparison</h4>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b border-gray-200">
                                    <th class="text-left py-3 px-2">Metric</th>
                                    <th class="text-center py-3 px-2 bg-blue-50">Conservative</th>
                                    <th class="text-center py-3 px-2 bg-green-50">Realistic</th>
                                    <th class="text-center py-3 px-2 bg-purple-50">Optimistic</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-b border-gray-100">
                                    <td class="py-3 px-2 font-medium">Time Saved/Week</td>
                                    <td class="text-center py-3 px-2 bg-blue-50 font-bold text-blue-700">${conservative.weeklyTimeSaved.weekly} hrs</td>
                                    <td class="text-center py-3 px-2 bg-green-50 font-bold text-green-700">${realistic.weeklyTimeSaved.weekly} hrs</td>
                                    <td class="text-center py-3 px-2 bg-purple-50 font-bold text-purple-700">${optimistic.weeklyTimeSaved.weekly} hrs</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="py-3 px-2 font-medium">Annual Hours</td>
                                    <td class="text-center py-3 px-2 bg-blue-50">${conservative.weeklyTimeSaved.yearly} hrs</td>
                                    <td class="text-center py-3 px-2 bg-green-50">${realistic.weeklyTimeSaved.yearly} hrs</td>
                                    <td class="text-center py-3 px-2 bg-purple-50">${optimistic.weeklyTimeSaved.yearly} hrs</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="py-3 px-2 font-medium">$ Value/Year*</td>
                                    <td class="text-center py-3 px-2 bg-blue-50">${this.formatCurrency(conservative.weeklyTimeSaved.dollarValue)}</td>
                                    <td class="text-center py-3 px-2 bg-green-50">${this.formatCurrency(realistic.weeklyTimeSaved.dollarValue)}</td>
                                    <td class="text-center py-3 px-2 bg-purple-50">${this.formatCurrency(optimistic.weeklyTimeSaved.dollarValue)}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="py-3 px-2 font-medium">Confidence</td>
                                    <td class="text-center py-3 px-2 bg-blue-50">
                                        <span class="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
                                            High (${Math.round(conservative.confidence.score * 100)}%)
                                        </span>
                                    </td>
                                    <td class="text-center py-3 px-2 bg-green-50">
                                        <span class="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                                            Medium (${Math.round(realistic.confidence.score * 100)}%)
                                        </span>
                                    </td>
                                    <td class="text-center py-3 px-2 bg-purple-50">
                                        <span class="px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                                            Low (${Math.round(optimistic.confidence.score * 100)}%)
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-2 font-medium">Likelihood</td>
                                    <td class="text-center py-3 px-2 bg-blue-50 text-sm">${conservative.likelihood}</td>
                                    <td class="text-center py-3 px-2 bg-green-50 text-sm">${realistic.likelihood}</td>
                                    <td class="text-center py-3 px-2 bg-purple-50 text-sm">${optimistic.likelihood}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-xs text-gray-500 mt-3">* Based on $50/hour average recruiter compensation</p>
                </div>

                <!-- Recommendation -->
                <div class="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                    <div class="flex items-start gap-3">
                        <span class="text-3xl">💡</span>
                        <div>
                            <p class="font-bold text-gray-900 mb-2">Our Recommendation: Conservative Scenario</p>
                            <p class="text-sm text-gray-700 mb-3">
                                We show the <strong>Conservative estimate</strong> by default throughout this report to avoid over-promising.
                                This gives you a realistic target that's highly achievable. Your actual results may be higher if you're
                                a fast learner or choose best-in-class AI tools.
                            </p>
                            <div class="flex flex-wrap gap-2">
                                <button onclick="window.switchScenario('conservative')"
                                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                                    View Conservative Results
                                </button>
                                <button onclick="window.switchScenario('realistic')"
                                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold">
                                    View Realistic Results
                                </button>
                                <button onclick="window.switchScenario('optimistic')"
                                        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold">
                                    View Optimistic Results
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render individual scenario card
     */
    renderScenarioCard(scenario, scenarioKey) {
        const colorClasses = {
            conservative: 'border-blue-300 bg-blue-50',
            realistic: 'border-green-300 bg-green-50',
            optimistic: 'border-purple-300 bg-purple-50'
        };

        const badgeClasses = {
            conservative: 'bg-blue-600',
            realistic: 'bg-green-600',
            optimistic: 'bg-purple-600'
        };

        return `
            <div class="bg-white rounded-lg p-6 border-2 ${colorClasses[scenarioKey]} relative">
                <div class="absolute top-0 right-0 mt-4 mr-4">
                    <span class="text-3xl">${scenario.icon}</span>
                </div>

                <div class="mb-4">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">${scenario.name}</h4>
                    <p class="text-sm text-gray-600">${scenario.percentile} percentile</p>
                </div>

                <div class="mb-4">
                    <div class="text-4xl font-bold text-gray-900 mb-1">
                        ${scenario.weeklyTimeSaved.weekly} hrs
                    </div>
                    <div class="text-sm text-gray-600">saved per week</div>
                </div>

                <div class="space-y-2 mb-4">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Monthly:</span>
                        <span class="font-bold text-gray-900">${scenario.weeklyTimeSaved.monthly} hrs</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Annually:</span>
                        <span class="font-bold text-gray-900">${scenario.weeklyTimeSaved.yearly} hrs</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">$ Value:</span>
                        <span class="font-bold text-gray-900">${this.formatCurrency(scenario.weeklyTimeSaved.dollarValue)}</span>
                    </div>
                </div>

                <div class="mb-4">
                    <span class="px-3 py-1 rounded-full text-xs font-bold ${badgeClasses[scenarioKey]} text-white">
                        ${scenario.confidence.level.toUpperCase()} CONFIDENCE (${Math.round(scenario.confidence.score * 100)}%)
                    </span>
                </div>

                <div class="mb-4">
                    <p class="text-xs text-gray-600 mb-2"><strong>Characteristics:</strong></p>
                    <ul class="text-xs text-gray-600 space-y-1">
                        ${scenario.characteristics.map(char => `<li>• ${char}</li>`).join('')}
                    </ul>
                </div>

                <button onclick="window.switchScenario('${scenarioKey}')"
                        class="w-full py-2 ${badgeClasses[scenarioKey]} text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-semibold">
                    Use This Scenario
                </button>
            </div>
        `;
    }

    /**
     * Create interactive assumption adjuster
     */
    createAssumptionAdjuster(businessUnit, baseAssumptions) {
        const adjustableAssumptions = this.getAdjustableAssumptions(businessUnit);

        return {
            businessUnit,
            assumptions: adjustableAssumptions,
            currentValues: this.getDefaultValues(adjustableAssumptions),
            ranges: this.getAssumptionRanges(businessUnit)
        };
    }

    /**
     * Get adjustable assumptions by business unit
     */
    getAdjustableAssumptions(businessUnit) {
        const common = [
            {
                key: 'ai_efficiency',
                label: 'AI Tool Efficiency',
                description: 'How effective are the AI tools you select?',
                unit: '% of claimed performance',
                defaultValue: 85,
                min: 50,
                max: 100,
                step: 5,
                helpText: 'Best-in-class tools perform at 95-100%, average tools at 70-85%'
            },
            {
                key: 'learning_speed',
                label: 'Your Learning Speed',
                description: 'How quickly do you typically learn new software?',
                unit: 'weeks to proficiency',
                defaultValue: 3,
                min: 1,
                max: 8,
                step: 1,
                helpText: 'Fast learners: 1-2 weeks, Average: 3-4 weeks, Slow: 5-8 weeks'
            },
            {
                key: 'adoption_commitment',
                label: 'Adoption Commitment',
                description: 'How consistently will you use AI tools?',
                unit: '% of eligible tasks',
                defaultValue: 80,
                min: 25,
                max: 100,
                step: 5,
                helpText: 'Sporadic use: 25-50%, Regular: 60-80%, Maximized: 90-100%'
            }
        ];

        // Business unit specific assumptions
        const specific = {
            sourcing: [
                {
                    key: 'ai_screening_accuracy',
                    label: 'AI Screening Accuracy',
                    description: 'Expected accuracy of AI resume screening',
                    unit: '% accurate',
                    defaultValue: 90,
                    min: 75,
                    max: 98,
                    step: 1,
                    helpText: 'Industry average: 85-90%, Best tools: 93-98%'
                },
                {
                    key: 'manual_speed',
                    label: 'Your Current Screening Speed',
                    description: 'Profiles you currently review per hour',
                    unit: 'profiles/hour',
                    defaultValue: 8,
                    min: 3,
                    max: 15,
                    step: 1,
                    helpText: 'Thorough review: 3-5, Standard: 8-10, Quick scan: 12-15'
                }
            ],
            scheduling: [
                {
                    key: 'automation_percent',
                    label: 'Tasks Automatable',
                    description: 'Percentage of scheduling tasks that can be automated',
                    unit: '% automatable',
                    defaultValue: 85,
                    min: 60,
                    max: 95,
                    step: 5,
                    helpText: 'Simple scheduling: 90-95%, Complex multi-party: 60-75%'
                }
            ],
            compliance: [
                {
                    key: 'monitoring_automation',
                    label: 'Monitoring Automation',
                    description: 'Percentage of compliance monitoring automatable',
                    unit: '% automatable',
                    defaultValue: 90,
                    min: 70,
                    max: 98,
                    step: 2,
                    helpText: 'Standard policies: 95%+, Complex regulations: 70-80%'
                }
            ],
            contracts: [
                {
                    key: 'contract_complexity',
                    label: 'Average Contract Complexity',
                    description: 'How complex are your typical contracts?',
                    unit: 'complexity (1-5)',
                    defaultValue: 3,
                    min: 1,
                    max: 5,
                    step: 1,
                    helpText: 'Simple templates: 1-2, Standard: 3, Highly custom: 4-5'
                }
            ],
            admin: [
                {
                    key: 'data_structure',
                    label: 'Data Structure Quality',
                    description: 'How well-structured is your current data?',
                    unit: 'quality (1-5)',
                    defaultValue: 3,
                    min: 1,
                    max: 5,
                    step: 1,
                    helpText: 'Chaotic: 1-2, Decent: 3, Very organized: 4-5'
                }
            ]
        };

        return [...common, ...(specific[businessUnit] || [])];
    }

    /**
     * Get default values for assumptions
     */
    getDefaultValues(assumptions) {
        const values = {};
        assumptions.forEach(assumption => {
            values[assumption.key] = assumption.defaultValue;
        });
        return values;
    }

    /**
     * Get assumption ranges
     */
    getAssumptionRanges(businessUnit) {
        // Define realistic ranges for each assumption
        return {
            ai_efficiency: { min: 50, max: 100, realistic: [70, 95] },
            learning_speed: { min: 1, max: 8, realistic: [2, 5] },
            adoption_commitment: { min: 25, max: 100, realistic: [60, 90] }
        };
    }

    /**
     * Render interactive assumption adjuster
     */
    renderAssumptionAdjuster(adjusterData, currentSavings) {
        const { assumptions, currentValues } = adjusterData;

        // Store original savings for comparison
        if (!this.originalSavings) {
            this.originalSavings = currentSavings;
        }

        return `
            <div class="assumption-adjuster bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 shadow-lg border-2 border-purple-200 mb-8">
                <div class="mb-6">
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">
                        🎛️ Interactive Assumption Adjuster
                    </h3>
                    <p class="text-gray-600 mb-4">
                        Want to see how different assumptions affect your savings? Adjust the sliders below and watch the numbers update in real-time.
                    </p>
                    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <p class="text-sm text-gray-700">
                            <strong>💡 Pro Tip:</strong> This is optional! Our default assumptions are already conservative and realistic.
                            Use this tool if you want to model "what if" scenarios or have specific knowledge about your situation.
                        </p>
                    </div>
                </div>

                <!-- Current Savings Display -->
                <div class="bg-white rounded-lg p-6 mb-6 border-2 border-purple-300">
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <p class="text-sm font-semibold text-gray-600 mb-1">Original Estimate:</p>
                            <p class="text-3xl font-bold text-gray-400 line-through">${this.originalSavings || currentSavings} hrs/week</p>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-purple-600 mb-1">Adjusted Estimate:</p>
                            <p id="adjusted-savings" class="text-3xl font-bold text-purple-700">${currentSavings} hrs/week</p>
                            <p id="savings-change" class="text-sm text-gray-600 mt-1">
                                (No change yet)
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Assumption Sliders -->
                <div class="space-y-6 mb-6">
                    ${assumptions.map(assumption => this.renderAssumptionSlider(assumption, currentValues[assumption.key])).join('')}
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-3">
                    <button onclick="window.resetAssumptions()"
                            class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold">
                        Reset to Defaults
                    </button>
                    <button onclick="window.applyCustomAssumptions()"
                            class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                        Apply Custom Scenario
                    </button>
                    <button onclick="window.exportCustomScenario()"
                            class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                        📥 Export My Scenario
                    </button>
                </div>

                <!-- Help Text -->
                <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p class="text-sm text-gray-700">
                        <strong>How to use:</strong> Move the sliders to adjust assumptions. The "Adjusted Estimate" updates in real-time.
                        When satisfied, click "Apply Custom Scenario" to see your results throughout the report with your custom assumptions.
                    </p>
                </div>
            </div>

            <script>
                // Real-time recalculation
                function recalculateSavings() {
                    // Get all slider values
                    const values = {};
                    document.querySelectorAll('.assumption-slider').forEach(slider => {
                        values[slider.dataset.key] = parseFloat(slider.value);
                    });

                    // Calculate adjusted savings
                    const baseSavings = ${this.originalSavings || currentSavings};
                    const aiEfficiency = (values.ai_efficiency || 85) / 100;
                    const learningImpact = 1 - ((values.learning_speed || 3) / 10); // Inverse: longer learning = less savings
                    const adoption = (values.adoption_commitment || 80) / 100;

                    const adjustedSavings = Math.round(baseSavings * aiEfficiency * learningImpact * adoption);
                    const change = adjustedSavings - baseSavings;
                    const changePercent = Math.round((change / baseSavings) * 100);

                    // Update display
                    document.getElementById('adjusted-savings').textContent = adjustedSavings + ' hrs/week';

                    const changeEl = document.getElementById('savings-change');
                    if (change > 0) {
                        changeEl.textContent = \`(+\${change} hrs, +\${changePercent}% from original)\`;
                        changeEl.className = 'text-sm text-green-600 font-semibold mt-1';
                    } else if (change < 0) {
                        changeEl.textContent = \`(\${change} hrs, \${changePercent}% from original)\`;
                        changeEl.className = 'text-sm text-red-600 font-semibold mt-1';
                    } else {
                        changeEl.textContent = '(No change from original)';
                        changeEl.className = 'text-sm text-gray-600 mt-1';
                    }
                }

                // Attach to sliders
                document.querySelectorAll('.assumption-slider').forEach(slider => {
                    slider.addEventListener('input', function() {
                        document.getElementById('value-' + this.dataset.key).textContent = this.value + ' ' + this.dataset.unit;
                        recalculateSavings();
                    });
                });
            </script>
        `;
    }

    /**
     * Render individual assumption slider
     */
    renderAssumptionSlider(assumption, currentValue) {
        return `
            <div class="bg-white rounded-lg p-5 border border-gray-200">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-grow">
                        <label class="font-bold text-gray-900 block mb-1">${assumption.label}</label>
                        <p class="text-sm text-gray-600 mb-2">${assumption.description}</p>
                    </div>
                    <div class="text-right ml-4">
                        <div id="value-${assumption.key}" class="text-xl font-bold text-purple-700">
                            ${currentValue} ${assumption.unit}
                        </div>
                    </div>
                </div>

                <input type="range"
                       class="assumption-slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                       data-key="${assumption.key}"
                       data-unit="${assumption.unit}"
                       min="${assumption.min}"
                       max="${assumption.max}"
                       step="${assumption.step}"
                       value="${currentValue}">

                <div class="flex justify-between text-xs text-gray-500 mt-2">
                    <span>${assumption.min} ${assumption.unit}</span>
                    <span>${assumption.max} ${assumption.unit}</span>
                </div>

                ${assumption.helpText ? `
                    <div class="mt-3 p-3 bg-blue-50 rounded border border-blue-100">
                        <p class="text-xs text-gray-700">
                            <strong>💡 Guidance:</strong> ${assumption.helpText}
                        </p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Format currency
     */
    formatCurrency(amount) {
        return '$' + amount.toLocaleString();
    }

    /**
     * Export custom scenario
     */
    exportCustomScenario(customValues, adjustedSavings) {
        return {
            exportDate: new Date().toISOString(),
            scenarioType: 'custom',
            customAssumptions: customValues,
            originalSavings: this.originalSavings,
            adjustedSavings: adjustedSavings,
            difference: adjustedSavings - this.originalSavings,
            percentChange: Math.round(((adjustedSavings - this.originalSavings) / this.originalSavings) * 100)
        };
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.CalculationTransparencyPhase2 = CalculationTransparencyPhase2;

    // Global functions for scenario switching and assumption adjustment
    window.switchScenario = function(scenarioKey) {
        console.log('Switching to scenario:', scenarioKey);
        alert(`Scenario switching to "${scenarioKey}" - This would update all results throughout the report.`);
        // In production, this would trigger a full results recalculation
    };

    window.resetAssumptions = function() {
        console.log('Resetting assumptions to defaults');
        document.querySelectorAll('.assumption-slider').forEach(slider => {
            const defaultValue = slider.getAttribute('value');
            slider.value = defaultValue;
            document.getElementById('value-' + slider.dataset.key).textContent = defaultValue + ' ' + slider.dataset.unit;
        });
        // Trigger recalculation
        if (typeof recalculateSavings !== 'undefined') {
            recalculateSavings();
        }
    };

    window.applyCustomAssumptions = function() {
        console.log('Applying custom assumptions');
        alert('Custom assumptions applied! In production, this would recalculate all results with your custom values.');
        // In production, this would trigger a full results recalculation with custom values
    };

    window.exportCustomScenario = function() {
        console.log('Exporting custom scenario');
        const values = {};
        document.querySelectorAll('.assumption-slider').forEach(slider => {
            values[slider.dataset.key] = parseFloat(slider.value);
        });

        const exportData = {
            exportDate: new Date().toISOString(),
            scenarioType: 'custom',
            customAssumptions: values
        };

        // Download as JSON
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'custom-scenario-' + new Date().toISOString().split('T')[0] + '.json';
        link.click();
    };
}
