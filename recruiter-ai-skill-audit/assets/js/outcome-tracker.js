/**
 * Outcome Tracker
 * Collects feedback on AI implementation outcomes to improve future predictions
 */

class OutcomeTracker {
    constructor() {
        this.storageKey = 'ai_audit_outcomes';
        this.followUpSchedule = [7, 30, 90]; // days
    }

    /**
     * Save initial assessment for future follow-up
     */
    saveInitialAssessment(results, enhancedContext, recommendations) {
        const assessment = {
            id: this.generateAssessmentId(),
            timestamp: new Date().toISOString(),
            businessUnit: results.businessUnit,

            // Predictions
            predictions: {
                totalTimeSaved: results.totalTimeSaved,
                monthlyTimeSaved: results.monthlyTimeSaved,
                yearlyTimeSaved: results.yearlyTimeSaved,
                contextMultiplier: results.contextMultiplier,
                adoptionReadiness: results.adoptionReadiness,
                topRecommendations: recommendations.slice(0, 3)
            },

            // User context snapshot
            context: {
                aiExperience: enhancedContext.userAnswers.aiexperience,
                urgencyScore: enhancedContext.urgencyScore,
                painPoints: enhancedContext.painPoints.slice(0, 5),
                toolGaps: enhancedContext.toolGaps.slice(0, 5),
                environmentalContext: enhancedContext.environmentalContext
            },

            // Follow-up tracking
            followUps: {
                day7: { scheduled: this.addDays(new Date(), 7), completed: false },
                day30: { scheduled: this.addDays(new Date(), 30), completed: false },
                day90: { scheduled: this.addDays(new Date(), 90), completed: false }
            },

            // Outcomes (filled in during follow-ups)
            outcomes: null
        };

        this.saveAssessment(assessment);
        this.scheduleFollowUpReminders(assessment);

        return assessment.id;
    }

    /**
     * Collect feedback after implementation period
     */
    async collectFeedback(assessmentId, daysMark) {
        const assessment = this.getAssessment(assessmentId);
        if (!assessment) {
            console.error('Assessment not found:', assessmentId);
            return null;
        }

        const feedback = await this.showFeedbackModal(assessment, daysMark);

        if (feedback) {
            this.saveFeedback(assessmentId, daysMark, feedback);
            this.analyzeOutcomes(assessmentId);
        }

        return feedback;
    }

    /**
     * Display feedback collection modal
     */
    async showFeedbackModal(assessment, daysMark) {
        return new Promise((resolve) => {
            const modal = new FeedbackModal(assessment, daysMark);
            modal.show((feedback) => {
                resolve(feedback);
            });
        });
    }

    /**
     * Save feedback data
     */
    saveFeedback(assessmentId, daysMark, feedback) {
        const assessment = this.getAssessment(assessmentId);
        if (!assessment) return;

        if (!assessment.outcomes) {
            assessment.outcomes = {};
        }

        assessment.outcomes[`day${daysMark}`] = {
            timestamp: new Date().toISOString(),
            implemented: feedback.implemented,
            toolsAdopted: feedback.toolsAdopted,
            actualTimeSaved: feedback.actualTimeSaved,
            satisfaction: feedback.satisfaction,
            challenges: feedback.challenges,
            successes: feedback.successes,
            nextSteps: feedback.nextSteps
        };

        assessment.followUps[`day${daysMark}`].completed = true;

        this.saveAssessment(assessment);
    }

    /**
     * Analyze outcomes vs predictions to improve future assessments
     */
    analyzeOutcomes(assessmentId) {
        const assessment = this.getAssessment(assessmentId);
        if (!assessment || !assessment.outcomes) return;

        const analysis = {
            assessmentId,
            businessUnit: assessment.businessUnit,

            // Prediction accuracy
            predictionAccuracy: this.calculatePredictionAccuracy(assessment),

            // Success factors
            successFactors: this.identifySuccessFactors(assessment),

            // Failure patterns
            failurePatterns: this.identifyFailurePatterns(assessment),

            // Recommendations adjustment
            recommendationsAdjustment: this.recommendAdjustments(assessment)
        };

        this.saveAnalysis(analysis);
        this.updatePredictionModel(analysis);

        return analysis;
    }

    /**
     * Calculate how accurate our predictions were
     */
    calculatePredictionAccuracy(assessment) {
        const outcomes = assessment.outcomes;
        const predictions = assessment.predictions;

        let accuracy = {
            timeSavingsAccuracy: 0,
            adoptionRateAccuracy: 0,
            overallAccuracy: 0
        };

        // Day 30 is the most reliable for accuracy measurement
        if (outcomes.day30) {
            const predictedWeekly = predictions.totalTimeSaved;
            const actualWeekly = outcomes.day30.actualTimeSaved;

            if (actualWeekly > 0) {
                const ratio = Math.min(actualWeekly, predictedWeekly) / Math.max(actualWeekly, predictedWeekly);
                accuracy.timeSavingsAccuracy = Math.round(ratio * 100);
            }

            const recommendedTools = predictions.topRecommendations.length;
            const adoptedTools = outcomes.day30.toolsAdopted?.length || 0;
            accuracy.adoptionRateAccuracy = Math.round((adoptedTools / recommendedTools) * 100);

            accuracy.overallAccuracy = Math.round(
                (accuracy.timeSavingsAccuracy * 0.6 + accuracy.adoptionRateAccuracy * 0.4)
            );
        }

        return accuracy;
    }

    /**
     * Identify what made successful implementations work
     */
    identifySuccessFactors(assessment) {
        const outcomes = assessment.outcomes.day30 || assessment.outcomes.day7;
        if (!outcomes) return [];

        const factors = [];

        // High implementation rate
        if (outcomes.implemented >= 0.7) {
            factors.push({
                factor: 'high_implementation_rate',
                description: 'User implemented 70%+ of recommendations',
                correlates_with: assessment.context.urgencyScore > 70 ? 'high_urgency' : 'strong_readiness'
            });
        }

        // Exceeded time savings
        if (outcomes.actualTimeSaved > assessment.predictions.totalTimeSaved) {
            factors.push({
                factor: 'exceeded_predictions',
                description: 'Actual savings exceeded predictions',
                correlates_with: assessment.context.aiExperience !== 'none' ? 'ai_experience' : 'high_automation_potential'
            });
        }

        // High satisfaction
        if (outcomes.satisfaction >= 4) {
            factors.push({
                factor: 'high_satisfaction',
                description: 'User very satisfied with results',
                correlates_with: outcomes.successes || 'good_tool_match'
            });
        }

        // Quick wins mentioned
        if (outcomes.successes && outcomes.successes.toLowerCase().includes('immediate')) {
            factors.push({
                factor: 'quick_wins_realized',
                description: 'User saw immediate results',
                correlates_with: 'appropriate_tool_selection'
            });
        }

        return factors;
    }

    /**
     * Identify patterns in failed or low-adoption implementations
     */
    identifyFailurePatterns(assessment) {
        const outcomes = assessment.outcomes.day30 || assessment.outcomes.day7;
        if (!outcomes) return [];

        const patterns = [];

        // Low implementation
        if (outcomes.implemented < 0.3) {
            patterns.push({
                pattern: 'low_implementation',
                description: 'User implemented less than 30% of recommendations',
                likely_causes: this.diagnoseLowImplementation(outcomes, assessment.context)
            });
        }

        // Below predicted savings
        if (outcomes.actualTimeSaved < assessment.predictions.totalTimeSaved * 0.5) {
            patterns.push({
                pattern: 'below_predicted_savings',
                description: 'Actual savings less than 50% of prediction',
                likely_causes: this.diagnoseLowSavings(outcomes, assessment)
            });
        }

        // Low satisfaction
        if (outcomes.satisfaction <= 2) {
            patterns.push({
                pattern: 'low_satisfaction',
                description: 'User rated experience 2/5 or lower',
                likely_causes: outcomes.challenges || 'tool_mismatch_or_complexity'
            });
        }

        return patterns;
    }

    diagnoseLowImplementation(outcomes, context) {
        const causes = [];

        if (context.aiExperience === 'none') {
            causes.push('Steep learning curve for AI beginners');
        }

        if (context.environmentalContext.supportLevel === 'no_support') {
            causes.push('Lack of organizational support');
        }

        if (outcomes.challenges && outcomes.challenges.toLowerCase().includes('time')) {
            causes.push('Insufficient time for implementation');
        }

        if (outcomes.challenges && outcomes.challenges.toLowerCase().includes('budget')) {
            causes.push('Budget constraints');
        }

        return causes.length > 0 ? causes : ['Unknown - need more data'];
    }

    diagnoseLowSavings(outcomes, assessment) {
        const causes = [];

        if (assessment.predictions.contextMultiplier > 1.2) {
            causes.push('Overestimated context multiplier');
        }

        if (assessment.predictions.adoptionReadiness > 0.8 && outcomes.implemented < 0.5) {
            causes.push('Overestimated adoption readiness');
        }

        if (outcomes.challenges && outcomes.challenges.toLowerCase().includes('complex')) {
            causes.push('Tools more complex than anticipated');
        }

        return causes.length > 0 ? causes : ['Need detailed follow-up interview'];
    }

    /**
     * Recommend adjustments to prediction model based on outcomes
     */
    recommendAdjustments(assessment) {
        const accuracy = this.calculatePredictionAccuracy(assessment);
        const adjustments = [];

        // Time savings consistently overestimated
        if (accuracy.timeSavingsAccuracy < 70 &&
            assessment.outcomes.day30?.actualTimeSaved < assessment.predictions.totalTimeSaved) {
            adjustments.push({
                parameter: 'savingsPct',
                businessUnit: assessment.businessUnit,
                direction: 'decrease',
                magnitude: '10-15%',
                reason: 'Predictions consistently overestimate savings'
            });
        }

        // Adoption readiness overestimated
        if (accuracy.adoptionRateAccuracy < 50) {
            adjustments.push({
                parameter: 'adoptionReadiness',
                condition: `aiExperience=${assessment.context.aiExperience}`,
                direction: 'decrease',
                magnitude: '0.1-0.15',
                reason: 'Tool adoption lower than predicted for this experience level'
            });
        }

        // Context multiplier needs adjustment
        const predictedVsActual = assessment.outcomes.day30?.actualTimeSaved / assessment.predictions.totalTimeSaved;
        if (predictedVsActual < 0.7 || predictedVsActual > 1.3) {
            adjustments.push({
                parameter: 'contextMultiplier',
                businessUnit: assessment.businessUnit,
                direction: predictedVsActual < 1 ? 'decrease' : 'increase',
                magnitude: Math.abs(1 - predictedVsActual).toFixed(2),
                reason: `Actual savings ${predictedVsActual < 1 ? 'lower' : 'higher'} than predicted`
            });
        }

        return adjustments;
    }

    /**
     * Update prediction model with learnings from outcomes
     */
    updatePredictionModel(analysis) {
        const modelUpdates = this.getModelUpdates() || {
            lastUpdated: new Date().toISOString(),
            totalAssessments: 0,
            adjustments: {}
        };

        modelUpdates.totalAssessments++;
        modelUpdates.lastUpdated = new Date().toISOString();

        // Apply recommended adjustments
        analysis.recommendationsAdjustment.forEach(adj => {
            const key = `${adj.parameter}_${adj.businessUnit || 'all'}`;

            if (!modelUpdates.adjustments[key]) {
                modelUpdates.adjustments[key] = {
                    parameter: adj.parameter,
                    businessUnit: adj.businessUnit,
                    cumulativeAdjustment: 0,
                    sampleSize: 0
                };
            }

            const adjustment = adj.direction === 'increase' ?
                parseFloat(adj.magnitude) :
                -parseFloat(adj.magnitude);

            modelUpdates.adjustments[key].cumulativeAdjustment += adjustment;
            modelUpdates.adjustments[key].sampleSize++;
        });

        this.saveModelUpdates(modelUpdates);
    }

    /**
     * Get adjusted prediction parameters based on learning
     */
    getAdjustedParameters(businessUnit, parameter) {
        const modelUpdates = this.getModelUpdates();
        if (!modelUpdates) return 1.0;

        const key = `${parameter}_${businessUnit}`;
        const adjustment = modelUpdates.adjustments[key];

        if (!adjustment || adjustment.sampleSize < 3) {
            return 1.0; // Need at least 3 samples before applying
        }

        const avgAdjustment = adjustment.cumulativeAdjustment / adjustment.sampleSize;
        return 1 + avgAdjustment; // Return as multiplier
    }

    /**
     * Storage methods
     */
    saveAssessment(assessment) {
        const assessments = this.getAllAssessments();
        const index = assessments.findIndex(a => a.id === assessment.id);

        if (index >= 0) {
            assessments[index] = assessment;
        } else {
            assessments.push(assessment);
        }

        localStorage.setItem(this.storageKey, JSON.stringify(assessments));
    }

    getAssessment(id) {
        const assessments = this.getAllAssessments();
        return assessments.find(a => a.id === id);
    }

    getAllAssessments() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    saveAnalysis(analysis) {
        const analyses = JSON.parse(localStorage.getItem('ai_audit_analyses') || '[]');
        analyses.push(analysis);
        localStorage.setItem('ai_audit_analyses', JSON.stringify(analyses));
    }

    saveModelUpdates(updates) {
        localStorage.setItem('ai_audit_model_updates', JSON.stringify(updates));
    }

    getModelUpdates() {
        const data = localStorage.getItem('ai_audit_model_updates');
        return data ? JSON.parse(data) : null;
    }

    /**
     * Utility methods
     */
    generateAssessmentId() {
        return `assess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString();
    }

    scheduleFollowUpReminders(assessment) {
        // In a real app, this would set up email/notification reminders
        // For now, just log the schedule
        console.log('Follow-up reminders scheduled:', {
            day7: assessment.followUps.day7.scheduled,
            day30: assessment.followUps.day30.scheduled,
            day90: assessment.followUps.day90.scheduled
        });
    }

    /**
     * Check for pending follow-ups
     */
    checkPendingFollowUps() {
        const assessments = this.getAllAssessments();
        const pending = [];
        const now = new Date();

        assessments.forEach(assessment => {
            Object.entries(assessment.followUps).forEach(([key, followUp]) => {
                if (!followUp.completed && new Date(followUp.scheduled) <= now) {
                    pending.push({
                        assessmentId: assessment.id,
                        daysMark: parseInt(key.replace('day', '')),
                        scheduled: followUp.scheduled
                    });
                }
            });
        });

        return pending;
    }
}

/**
 * Feedback Modal UI
 */
class FeedbackModal {
    constructor(assessment, daysMark) {
        this.assessment = assessment;
        this.daysMark = daysMark;
        this.callback = null;
    }

    show(callback) {
        this.callback = callback;

        const html = `
            <div class="feedback-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="p-8">
                        <!-- Header -->
                        <div class="text-center mb-6">
                            <div class="inline-block p-4 bg-green-100 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-600">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h2 class="text-3xl font-bold text-gray-900 mb-2">How's Your AI Journey Going?</h2>
                            <p class="text-gray-600">It's been ${daysMark} days since your assessment. Let's see how you're doing!</p>
                        </div>

                        <form id="feedback-form" class="space-y-6">
                            <!-- Implementation Progress -->
                            <div>
                                <label class="block font-semibold text-gray-900 mb-3">
                                    What percentage of recommendations did you implement?
                                </label>
                                <div class="grid grid-cols-5 gap-2">
                                    ${[0, 25, 50, 75, 100].map(val => `
                                        <label class="text-center cursor-pointer">
                                            <input type="radio" name="implemented" value="${val / 100}" class="sr-only peer" required>
                                            <div class="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-green-500 peer-checked:bg-green-50 transition-all">
                                                <div class="text-2xl font-bold text-gray-900">${val}%</div>
                                            </div>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Tools Adopted -->
                            <div>
                                <label class="block font-semibold text-gray-900 mb-3">
                                    Which tools did you actually adopt?
                                </label>
                                <div class="space-y-2">
                                    ${this.assessment.predictions.topRecommendations.map(rec => `
                                        <label class="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition-colors">
                                            <input type="checkbox" name="toolsAdopted" value="${rec.name}" class="mr-3">
                                            <span class="text-gray-700">${rec.name}</span>
                                        </label>
                                    `).join('')}
                                    <div class="flex items-center p-3">
                                        <input type="checkbox" name="otherTool" id="other-tool-check" class="mr-3">
                                        <input type="text" placeholder="Other tool (specify)" id="other-tool-input" class="flex-1 p-2 border-2 border-gray-200 rounded-lg" disabled>
                                    </div>
                                </div>
                            </div>

                            <!-- Time Saved -->
                            <div>
                                <label class="block font-semibold text-gray-900 mb-3">
                                    How many hours per week are you actually saving?
                                    <span class="text-sm font-normal text-gray-500">(We predicted ${this.assessment.predictions.totalTimeSaved} hrs/week)</span>
                                </label>
                                <div class="flex items-center gap-4">
                                    <input type="number" name="actualTimeSaved" min="0" max="100" step="0.5" class="flex-1 p-3 border-2 border-gray-300 rounded-lg text-lg" placeholder="0.0" required>
                                    <span class="text-gray-600">hours/week</span>
                                </div>
                            </div>

                            <!-- Satisfaction -->
                            <div>
                                <label class="block font-semibold text-gray-900 mb-3">
                                    How satisfied are you with the results?
                                </label>
                                <div class="flex justify-between gap-2">
                                    ${[1, 2, 3, 4, 5].map(rating => `
                                        <label class="flex-1 cursor-pointer">
                                            <input type="radio" name="satisfaction" value="${rating}" class="sr-only peer" required>
                                            <div class="text-center p-4 border-2 border-gray-200 rounded-lg peer-checked:border-yellow-500 peer-checked:bg-yellow-50 transition-all">
                                                <div class="text-3xl mb-1">${'⭐'.repeat(rating)}</div>
                                                <div class="text-xs text-gray-600">${['Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating - 1]}</div>
                                            </div>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Challenges -->
                            <div>
                                <label class="block font-semibold text-gray-900 mb-3">
                                    What challenges did you face?
                                </label>
                                <textarea name="challenges" rows="3" class="w-full p-3 border-2 border-gray-300 rounded-lg" placeholder="e.g., Learning curve, technical issues, time constraints..."></textarea>
                            </div>

                            <!-- Successes -->
                            <div>
                                <label class="block font-semibold text-gray-900 mb-3">
                                    What worked really well?
                                </label>
                                <textarea name="successes" rows="3" class="w-full p-3 border-2 border-gray-300 rounded-lg" placeholder="e.g., Specific tools, workflows, quick wins..."></textarea>
                            </div>

                            <!-- Next Steps -->
                            <div>
                                <label class="block font-semibold text-gray-900 mb-3">
                                    What are your next steps?
                                </label>
                                <textarea name="nextSteps" rows="3" class="w-full p-3 border-2 border-gray-300 rounded-lg" placeholder="e.g., Tools to try next, skills to develop..."></textarea>
                            </div>

                            <!-- Submit -->
                            <div class="flex justify-between pt-4">
                                <button type="button" id="feedback-skip-btn" class="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium">
                                    Skip for Now
                                </button>
                                <button type="submit" class="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                                    Submit Feedback
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Other tool checkbox enables input
        document.getElementById('other-tool-check').addEventListener('change', (e) => {
            document.getElementById('other-tool-input').disabled = !e.target.checked;
        });

        // Form submission
        document.getElementById('feedback-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const feedback = this.collectFeedback();
            this.close();
            if (this.callback) this.callback(feedback);
        });

        // Skip button
        document.getElementById('feedback-skip-btn').addEventListener('click', () => {
            this.close();
            if (this.callback) this.callback(null);
        });
    }

    collectFeedback() {
        const form = document.getElementById('feedback-form');
        const formData = new FormData(form);

        // Collect tools adopted
        const toolsAdopted = Array.from(document.querySelectorAll('input[name="toolsAdopted"]:checked'))
            .map(input => input.value);

        const otherTool = document.getElementById('other-tool-input').value.trim();
        if (otherTool) toolsAdopted.push(otherTool);

        return {
            implemented: parseFloat(formData.get('implemented')),
            toolsAdopted: toolsAdopted,
            actualTimeSaved: parseFloat(formData.get('actualTimeSaved')),
            satisfaction: parseInt(formData.get('satisfaction')),
            challenges: formData.get('challenges'),
            successes: formData.get('successes'),
            nextSteps: formData.get('nextSteps')
        };
    }

    close() {
        const modal = document.querySelector('.feedback-modal');
        if (modal) modal.remove();
    }
}
