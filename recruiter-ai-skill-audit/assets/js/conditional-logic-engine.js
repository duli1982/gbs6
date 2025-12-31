/**
 * Conditional Logic Engine
 * Implements dynamic question flow with skip/show conditions
 * Enables personalized assessment paths based on user answers
 */

class ConditionalLogicEngine {
    constructor() {
        this.rules = this.initializeRules();
        this.conditionCache = new Map();
    }

    /**
     * Initialize conditional rules for questions
     */
    initializeRules() {
        return {
            // Example: Skip ATS questions if user handles very few roles
            'sourcing_ats_integration': {
                skipIf: [
                    {
                        field: 'sourcing_active_roles',
                        operator: 'equals',
                        value: '1-5',
                        reason: 'Low volume doesn\'t need advanced ATS features'
                    }
                ]
            },

            // Show advanced sourcing questions only for high-volume recruiters
            'sourcing_ai_tools_advanced': {
                showIf: [
                    {
                        field: 'sourcing_active_roles',
                        operator: 'in',
                        value: ['11-20', '20+'],
                        reason: 'High-volume recruiters benefit from advanced tools'
                    }
                ]
            },

            // Skip scheduling automation questions if very few interviews
            'scheduling_automation_tools': {
                skipIf: [
                    {
                        field: 'scheduling_interviews_per_week',
                        operator: 'equals',
                        value: '1-5',
                        reason: 'Low interview volume doesn\'t justify automation setup'
                    }
                ]
            },

            // Show compliance automation only if high workload
            'compliance_automation_priority': {
                showIf: [
                    {
                        field: 'compliance_weekly_time',
                        operator: 'in',
                        value: ['5-10 hours', '10+ hours'],
                        reason: 'High compliance workload benefits from automation'
                    }
                ]
            },

            // Skip contract templates question if low volume
            'contracts_template_customization': {
                skipIf: [
                    {
                        field: 'contracts_per_month',
                        operator: 'equals',
                        value: '1-5',
                        reason: 'Low contract volume doesn\'t need extensive templates'
                    }
                ]
            },

            // Show admin automation priority based on multiple factors
            'admin_automation_priority': {
                showIf: [
                    {
                        operator: 'or',
                        conditions: [
                            {
                                field: 'admin_doc_creation_time',
                                operator: 'in',
                                value: ['3-5 hours', '5+ hours']
                            },
                            {
                                field: 'admin_data_cleanup_frequency',
                                operator: 'equals',
                                value: 'Daily'
                            }
                        ],
                        reason: 'High admin workload indicates automation opportunity'
                    }
                ]
            },

            // Beginner path: Skip advanced AI questions
            'ai_advanced_techniques': {
                skipIf: [
                    {
                        field: 'aiexperience',
                        operator: 'in',
                        value: ['none', 'explored'],
                        reason: 'Focus on basics for beginners'
                    }
                ]
            }
        };
    }

    /**
     * Evaluate a condition
     */
    evaluateCondition(condition, answers) {
        // Check cache first
        const cacheKey = JSON.stringify({ condition, answers });
        if (this.conditionCache.has(cacheKey)) {
            return this.conditionCache.get(cacheKey);
        }

        let result = false;

        // Handle compound conditions (AND/OR)
        if (condition.operator === 'and') {
            result = condition.conditions.every(c => this.evaluateCondition(c, answers));
        } else if (condition.operator === 'or') {
            result = condition.conditions.some(c => this.evaluateCondition(c, answers));
        } else {
            // Simple condition
            const fieldValue = answers[condition.field];

            switch (condition.operator) {
                case 'equals':
                    result = fieldValue === condition.value;
                    break;

                case 'not_equals':
                    result = fieldValue !== condition.value;
                    break;

                case 'in':
                    if (Array.isArray(condition.value)) {
                        result = condition.value.includes(fieldValue);
                    } else {
                        result = fieldValue === condition.value;
                    }
                    break;

                case 'not_in':
                    if (Array.isArray(condition.value)) {
                        result = !condition.value.includes(fieldValue);
                    } else {
                        result = fieldValue !== condition.value;
                    }
                    break;

                case 'contains':
                    if (Array.isArray(fieldValue)) {
                        result = fieldValue.includes(condition.value);
                    } else {
                        result = fieldValue?.toString().includes(condition.value);
                    }
                    break;

                case 'greater_than':
                    result = parseFloat(fieldValue) > parseFloat(condition.value);
                    break;

                case 'less_than':
                    result = parseFloat(fieldValue) < parseFloat(condition.value);
                    break;

                case 'exists':
                    result = fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
                    break;

                case 'not_exists':
                    result = fieldValue === undefined || fieldValue === null || fieldValue === '';
                    break;

                default:
                    console.warn(`Unknown operator: ${condition.operator}`);
                    result = false;
            }
        }

        // Cache result
        this.conditionCache.set(cacheKey, result);

        return result;
    }

    /**
     * Check if a question should be skipped
     */
    shouldSkipQuestion(questionId, answers) {
        const rule = this.rules[questionId];
        if (!rule || !rule.skipIf) return false;

        for (const condition of rule.skipIf) {
            if (this.evaluateCondition(condition, answers)) {
                return {
                    skip: true,
                    reason: condition.reason || 'Condition met'
                };
            }
        }

        return { skip: false };
    }

    /**
     * Check if a question should be shown
     */
    shouldShowQuestion(questionId, answers) {
        const rule = this.rules[questionId];
        if (!rule || !rule.showIf) return { show: true }; // Default to showing

        for (const condition of rule.showIf) {
            if (this.evaluateCondition(condition, answers)) {
                return {
                    show: true,
                    reason: condition.reason || 'Condition met'
                };
            }
        }

        return {
            show: false,
            reason: 'Show conditions not met'
        };
    }

    /**
     * Filter questions based on conditional logic
     */
    filterQuestions(questions, answers) {
        const filteredQuestions = [];
        const skippedQuestions = [];

        questions.forEach(question => {
            // Check skip conditions
            const skipResult = this.shouldSkipQuestion(question.id, answers);
            if (skipResult.skip) {
                skippedQuestions.push({
                    question: question,
                    reason: skipResult.reason
                });
                return;
            }

            // Check show conditions
            const showResult = this.shouldShowQuestion(question.id, answers);
            if (!showResult.show) {
                skippedQuestions.push({
                    question: question,
                    reason: showResult.reason
                });
                return;
            }

            filteredQuestions.push(question);
        });

        return {
            questions: filteredQuestions,
            skipped: skippedQuestions
        };
    }

    /**
     * Get next question based on conditional logic
     */
    getNextQuestion(currentQuestion, allQuestions, answers) {
        const currentIndex = allQuestions.findIndex(q => q.id === currentQuestion.id);
        if (currentIndex === -1) return null;

        // Look ahead from current position
        for (let i = currentIndex + 1; i < allQuestions.length; i++) {
            const question = allQuestions[i];

            // Check if should skip
            const skipResult = this.shouldSkipQuestion(question.id, answers);
            if (skipResult.skip) continue;

            // Check if should show
            const showResult = this.shouldShowQuestion(question.id, answers);
            if (!showResult.show) continue;

            return question;
        }

        return null; // No more questions
    }

    /**
     * Calculate total questions that will be asked
     */
    calculateTotalQuestions(allQuestions, currentAnswers = {}) {
        const { questions } = this.filterQuestions(allQuestions, currentAnswers);
        return questions.length;
    }

    /**
     * Get question path (what questions will be asked)
     */
    getQuestionPath(allQuestions, currentAnswers = {}) {
        const path = [];
        let tempAnswers = { ...currentAnswers };

        allQuestions.forEach(question => {
            const skipResult = this.shouldSkipQuestion(question.id, tempAnswers);
            const showResult = this.shouldShowQuestion(question.id, tempAnswers);

            if (!skipResult.skip && showResult.show) {
                path.push({
                    id: question.id,
                    question: question.question,
                    conditionallyShown: false
                });
            }
        });

        return path;
    }

    /**
     * Render conditional logic explanation
     */
    renderConditionalExplanation(skippedQuestions) {
        if (skippedQuestions.length === 0) return '';

        return `
            <div class="conditional-logic-info bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 mt-4">
                <h4 class="font-semibold text-blue-900 flex items-center gap-2 mb-2">
                    <span>🎯</span>
                    <span>Personalized Assessment Path</span>
                </h4>
                <p class="text-sm text-blue-800 mb-2">
                    Based on your responses, we've customized your assessment to focus on the most relevant areas.
                </p>
                <details class="text-sm">
                    <summary class="cursor-pointer text-blue-700 hover:text-blue-900 font-medium">
                        ${skippedQuestions.length} question${skippedQuestions.length === 1 ? '' : 's'} skipped (click to see why)
                    </summary>
                    <ul class="mt-2 space-y-1 ml-4">
                        ${skippedQuestions.map(sq => `
                            <li class="text-blue-700">
                                <span class="font-medium">${sq.question.question}</span>
                                <div class="text-xs text-blue-600 italic">→ ${sq.reason}</div>
                            </li>
                        `).join('')}
                    </ul>
                </details>
            </div>
        `;
    }

    /**
     * Get statistics about conditional logic usage
     */
    getStatistics(allQuestions, answers) {
        const { questions, skipped } = this.filterQuestions(allQuestions, answers);

        return {
            totalQuestions: allQuestions.length,
            questionsToAsk: questions.length,
            questionsSkipped: skipped.length,
            reductionPercentage: Math.round((skipped.length / allQuestions.length) * 100),
            skipReasons: skipped.map(sq => ({
                question: sq.question.question,
                reason: sq.reason
            }))
        };
    }

    /**
     * Add custom rule
     */
    addRule(questionId, rule) {
        this.rules[questionId] = rule;
        this.conditionCache.clear(); // Clear cache when rules change
    }

    /**
     * Remove rule
     */
    removeRule(questionId) {
        delete this.rules[questionId];
        this.conditionCache.clear();
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.conditionCache.clear();
    }

    /**
     * Export rules as JSON
     */
    exportRules() {
        return JSON.stringify(this.rules, null, 2);
    }

    /**
     * Import rules from JSON
     */
    importRules(rulesJson) {
        try {
            this.rules = JSON.parse(rulesJson);
            this.conditionCache.clear();
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ConditionalLogicEngine = ConditionalLogicEngine;
}
