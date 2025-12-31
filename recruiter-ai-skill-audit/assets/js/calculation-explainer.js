/**
 * Calculation Explainer
 * Provides transparent, step-by-step breakdown of how scores are calculated
 * Builds user trust through explainability
 */

class CalculationExplainer {
    constructor() {
        this.steps = [];
        this.confidence = 1.0;
        this.assumptions = [];
        this.warnings = [];
    }

    /**
     * Reset for new calculation
     */
    reset() {
        this.steps = [];
        this.confidence = 1.0;
        this.assumptions = [];
        this.warnings = [];
    }

    /**
     * Add a calculation step
     */
    addStep(operation, value, explanation, data = {}) {
        this.steps.push({
            step: this.steps.length + 1,
            operation: operation,
            value: value,
            explanation: explanation,
            data: data,
            timestamp: Date.now()
        });
    }

    /**
     * Add an assumption
     */
    addAssumption(assumption, impact = 'medium') {
        this.assumptions.push({
            text: assumption,
            impact: impact // low, medium, high
        });

        // Reduce confidence based on assumptions
        const confidenceReduction = {
            'low': 0.02,
            'medium': 0.05,
            'high': 0.10
        };
        this.confidence = Math.max(0.5, this.confidence - confidenceReduction[impact]);
    }

    /**
     * Add a warning
     */
    addWarning(warning) {
        this.warnings.push(warning);
        this.confidence = Math.max(0.6, this.confidence - 0.03);
    }

    /**
     * Calculate base hours from answers
     */
    calculateBaseHours(answers, questions) {
        this.addStep(
            'initialization',
            0,
            'Starting calculation from your responses',
            { answerCount: Object.keys(answers).length }
        );

        let totalBaseHours = 0;
        const hoursByCategory = {};

        Object.entries(answers).forEach(([questionId, answer]) => {
            const question = questions.find(q => q.id === questionId);
            if (!question) return;

            let questionHours = 0;
            const selectedOptions = Array.isArray(answer) ? answer : [answer];

            selectedOptions.forEach(optionValue => {
                const option = question.options?.find(opt => opt.value === optionValue);
                if (option && option.hours) {
                    questionHours += option.hours;

                    if (!hoursByCategory[question.businessUnit]) {
                        hoursByCategory[question.businessUnit] = 0;
                    }
                    hoursByCategory[question.businessUnit] += option.hours;
                }
            });

            if (questionHours > 0) {
                this.addStep(
                    'base_hours',
                    questionHours,
                    `${question.businessUnit}: "${question.question.substring(0, 50)}..." → ${questionHours} hrs/week`,
                    {
                        questionId: questionId,
                        businessUnit: question.businessUnit,
                        options: selectedOptions
                    }
                );
                totalBaseHours += questionHours;
            }
        });

        this.addStep(
            'base_total',
            totalBaseHours,
            `Total base workload across all activities`,
            { hoursByCategory: hoursByCategory }
        );

        if (totalBaseHours === 0) {
            this.addWarning('No time data found in responses. Results may be estimates.');
        }

        return { totalBaseHours, hoursByCategory };
    }

    /**
     * Calculate volume multiplier
     */
    calculateVolumeMultiplier(answers, questions) {
        let multiplier = 1.0;
        let reason = 'Standard workload';

        // Check for high-volume indicators
        const volumeQuestions = questions.filter(q =>
            q.id.includes('active_roles') ||
            q.id.includes('volume') ||
            q.id.includes('candidates')
        );

        volumeQuestions.forEach(question => {
            const answer = answers[question.id];
            if (!answer) return;

            const option = question.options?.find(opt => opt.value === answer);
            if (option && option.multiplier && option.multiplier > multiplier) {
                multiplier = option.multiplier;
                reason = `High volume detected: ${answer}`;
            }
        });

        if (multiplier > 1.0) {
            this.addStep(
                'volume_multiplier',
                multiplier,
                reason,
                { type: 'boost' }
            );
            this.addAssumption(
                `Volume multiplier (${multiplier}x) based on workload scale. May vary with actual workflow efficiency.`,
                'medium'
            );
        }

        return multiplier;
    }

    /**
     * Calculate AI savings percentage
     */
    calculateAISavings(answers, questions) {
        let totalSavings = 0;
        let weightedHours = 0;
        let savingsByActivity = [];

        Object.entries(answers).forEach(([questionId, answer]) => {
            const question = questions.find(q => q.id === questionId);
            if (!question) return;

            const selectedOptions = Array.isArray(answer) ? answer : [answer];

            selectedOptions.forEach(optionValue => {
                const option = question.options?.find(opt => opt.value === optionValue);
                if (option && option.savingsPct !== undefined && option.hours) {
                    const activitySavings = option.savingsPct;
                    const activityHours = option.hours;

                    totalSavings += activitySavings * activityHours;
                    weightedHours += activityHours;

                    savingsByActivity.push({
                        activity: optionValue,
                        hours: activityHours,
                        savingsPct: activitySavings,
                        hoursSaved: (activityHours * activitySavings) / 100
                    });
                }
            });
        });

        const avgSavingsPct = weightedHours > 0 ? totalSavings / weightedHours : 0;

        if (savingsByActivity.length > 0) {
            // Sort by hours saved (descending)
            savingsByActivity.sort((a, b) => b.hoursSaved - a.hoursSaved);

            this.addStep(
                'ai_savings_analysis',
                avgSavingsPct,
                `Weighted average AI automation potential across ${savingsByActivity.length} activities`,
                { savingsByActivity: savingsByActivity.slice(0, 5) } // Top 5
            );

            // Show top opportunities
            const topOpportunity = savingsByActivity[0];
            this.addStep(
                'top_opportunity',
                topOpportunity.hoursSaved,
                `Biggest opportunity: ${topOpportunity.activity} (${topOpportunity.savingsPct}% of ${topOpportunity.hours} hrs = ${topOpportunity.hoursSaved.toFixed(1)} hrs saved)`,
                { opportunity: topOpportunity }
            );
        }

        this.addAssumption(
            `AI savings percentages based on industry benchmarks and current AI capabilities. Actual results may vary based on tool adoption and workflow integration.`,
            'high'
        );

        return { avgSavingsPct, savingsByActivity };
    }

    /**
     * Calculate experience adjustment
     */
    calculateExperienceAdjustment(answers) {
        let adjustment = 1.0;
        let reason = 'Standard experience level';

        // Check for AI experience indicators
        const experienceAnswer = answers['ai_experience'] || answers['readiness_score'];

        if (experienceAnswer) {
            if (experienceAnswer.includes('beginner') || experienceAnswer.includes('none')) {
                adjustment = 0.7; // Lower for beginners
                reason = 'Beginner level: more time needed for learning curve';
                this.addWarning('As a beginner, initial time investment may be higher before seeing savings.');
            } else if (experienceAnswer.includes('advanced') || experienceAnswer.includes('expert')) {
                adjustment = 1.2; // Higher for experts
                reason = 'Advanced level: can leverage AI tools more effectively';
            }
        }

        if (adjustment !== 1.0) {
            this.addStep(
                'experience_adjustment',
                adjustment,
                reason,
                { level: experienceAnswer }
            );
        }

        return adjustment;
    }

    /**
     * Main calculation with full explanation
     */
    calculateWithExplanation(answers, questions) {
        this.reset();

        // Step 1: Base hours
        const { totalBaseHours, hoursByCategory } = this.calculateBaseHours(answers, questions);

        // Step 2: Volume multiplier
        const volumeMultiplier = this.calculateVolumeMultiplier(answers, questions);
        const adjustedHours = totalBaseHours * volumeMultiplier;

        if (volumeMultiplier > 1.0) {
            this.addStep(
                'volume_adjusted_total',
                adjustedHours,
                `Base hours × volume multiplier: ${totalBaseHours} × ${volumeMultiplier} = ${adjustedHours.toFixed(1)} hrs/week`,
                { calculation: 'multiplication' }
            );
        }

        // Step 3: AI savings
        const { avgSavingsPct, savingsByActivity } = this.calculateAISavings(answers, questions);

        // Step 4: Experience adjustment
        const experienceAdj = this.calculateExperienceAdjustment(answers);

        // Step 5: Final calculation
        const finalHoursSaved = (adjustedHours * avgSavingsPct / 100) * experienceAdj;
        const monthlySaved = finalHoursSaved * 4.33; // Average weeks per month
        const yearlySaved = finalHoursSaved * 52;

        this.addStep(
            'final_calculation',
            finalHoursSaved,
            `AI can save ${avgSavingsPct.toFixed(0)}% of ${adjustedHours.toFixed(1)} hours = ${finalHoursSaved.toFixed(1)} hrs/week`,
            {
                formula: `(${adjustedHours.toFixed(1)} hrs × ${avgSavingsPct.toFixed(0)}%) × ${experienceAdj}`,
                monthly: monthlySaved.toFixed(1),
                yearly: yearlySaved.toFixed(0)
            }
        );

        // Calculate confidence score
        const finalConfidence = Math.round(this.confidence * 100);

        return {
            weekly: Math.round(finalHoursSaved * 10) / 10,
            monthly: Math.round(monthlySaved * 10) / 10,
            yearly: Math.round(yearlySaved),
            confidence: finalConfidence,
            steps: this.steps,
            assumptions: this.assumptions,
            warnings: this.warnings,
            breakdown: {
                baseHours: totalBaseHours,
                volumeMultiplier: volumeMultiplier,
                aiSavingsPct: avgSavingsPct,
                experienceAdjustment: experienceAdj,
                hoursByCategory: hoursByCategory,
                topOpportunities: savingsByActivity.slice(0, 3)
            }
        };
    }

    /**
     * Render explanation as HTML
     */
    renderExplanationHTML(result) {
        let html = `
            <div class="calculation-explanation bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mt-6">
                <div class="flex items-center gap-3 mb-4">
                    <div class="text-3xl">🧮</div>
                    <h3 class="text-xl font-bold text-gray-900">How We Calculated Your Results</h3>
                </div>

                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Confidence Score</span>
                        <span class="text-sm font-bold text-indigo-600">${result.confidence}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                             style="width: ${result.confidence}%"></div>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">
                        Based on ${this.steps.length} calculation steps and ${this.assumptions.length} assumptions
                    </p>
                </div>

                <div class="space-y-3 mb-6">
                    <h4 class="font-semibold text-gray-900 flex items-center gap-2">
                        <span>📊</span>
                        <span>Calculation Steps</span>
                    </h4>
        `;

        // Render each step
        this.steps.forEach((step, index) => {
            const isImportant = ['base_total', 'volume_adjusted_total', 'final_calculation'].includes(step.operation);
            const bgClass = isImportant ? 'bg-indigo-100 border-l-4 border-indigo-500' : 'bg-white border-l-4 border-gray-300';

            html += `
                <div class="${bgClass} rounded-lg p-4">
                    <div class="flex items-start gap-3">
                        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                            ${step.step}
                        </div>
                        <div class="flex-1">
                            <p class="text-sm text-gray-900">${step.explanation}</p>
                            ${step.data.formula ? `<p class="text-xs text-gray-600 mt-1 font-mono">${step.data.formula}</p>` : ''}
                        </div>
                        ${typeof step.value === 'number' ? `
                            <div class="flex-shrink-0 text-right">
                                <div class="text-lg font-bold text-indigo-600">${step.value.toFixed(1)}</div>
                                ${step.data.monthly ? `<div class="text-xs text-gray-500">${step.data.monthly} hrs/mo</div>` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        html += `
                </div>

                ${this.warnings.length > 0 ? `
                    <div class="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-4">
                        <h4 class="font-semibold text-yellow-900 flex items-center gap-2 mb-2">
                            <span>⚠️</span>
                            <span>Important Notes</span>
                        </h4>
                        <ul class="space-y-1">
                            ${this.warnings.map(w => `<li class="text-sm text-yellow-800">• ${w}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${this.assumptions.length > 0 ? `
                    <div class="bg-gray-50 border-l-4 border-gray-400 rounded-lg p-4">
                        <h4 class="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                            <span>💡</span>
                            <span>Assumptions</span>
                        </h4>
                        <ul class="space-y-1">
                            ${this.assumptions.map(a => `
                                <li class="text-sm text-gray-700">
                                    <span class="inline-block w-16 text-xs font-medium ${
                                        a.impact === 'high' ? 'text-red-600' :
                                        a.impact === 'medium' ? 'text-yellow-600' :
                                        'text-green-600'
                                    }">[${a.impact.toUpperCase()}]</span>
                                    ${a.text}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}

                <div class="mt-6 pt-4 border-t border-gray-200">
                    <p class="text-xs text-gray-600 text-center">
                        💡 These calculations are based on industry benchmarks and your specific workflow patterns.
                        Actual results may vary based on tool adoption and implementation quality.
                    </p>
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Get summary breakdown
     */
    getSummaryBreakdown(result) {
        return {
            totalSteps: this.steps.length,
            confidence: result.confidence,
            hasWarnings: this.warnings.length > 0,
            hasAssumptions: this.assumptions.length > 0,
            breakdown: result.breakdown
        };
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.CalculationExplainer = CalculationExplainer;
}
