/**
 * Multi-Dimensional Scorer
 * Calculates impact across multiple dimensions beyond just time saved
 * Provides richer insights: time, cost, quality, satisfaction, risk
 */

class MultiDimensionalScorer {
    constructor() {
        this.dimensions = window.DataConstants?.SCORING_DIMENSIONS || this.getDefaultDimensions();
        this.scores = {};
        this.overallScore = 0;
    }

    /**
     * Get default dimensions if DataConstants not available
     */
    getDefaultDimensions() {
        return {
            TIME_SAVED: { id: 'time_saved', label: 'Time Saved', weight: 0.40, unit: 'hours/week' },
            COST_SAVED: { id: 'cost_saved', label: 'Cost Saved', weight: 0.25, unit: '$/year' },
            QUALITY_IMPROVEMENT: { id: 'quality_improvement', label: 'Quality Improvement', weight: 0.20, unit: '% increase' },
            SATISFACTION_IMPACT: { id: 'satisfaction_impact', label: 'Satisfaction Impact', weight: 0.10, unit: '% increase' },
            RISK_REDUCTION: { id: 'risk_reduction', label: 'Risk Reduction', weight: 0.05, unit: 'risk level' }
        };
    }

    /**
     * Calculate all dimensions from user answers
     */
    calculateAllDimensions(answers, questions, basicResults) {
        // 1. Time Saved (already calculated)
        this.scores.time_saved = this.calculateTimeSaved(basicResults);

        // 2. Cost Saved
        this.scores.cost_saved = this.calculateCostSaved(this.scores.time_saved);

        // 3. Quality Improvement
        this.scores.quality_improvement = this.calculateQualityImpact(answers, questions);

        // 4. Satisfaction Impact
        this.scores.satisfaction_impact = this.calculateSatisfactionImpact(answers, questions);

        // 5. Risk Reduction
        this.scores.risk_reduction = this.calculateRiskReduction(answers, questions);

        // Calculate overall weighted score
        this.overallScore = this.calculateOverallScore();

        return {
            scores: this.scores,
            overallScore: this.overallScore,
            breakdown: this.getDetailedBreakdown()
        };
    }

    /**
     * Calculate time saved dimension
     */
    calculateTimeSaved(basicResults) {
        return {
            dimension: 'time_saved',
            weekly: basicResults.totalTimeSaved || 0,
            monthly: basicResults.monthlyTimeSaved || 0,
            yearly: basicResults.yearlyTimeSaved || 0,
            normalized: this.normalizeValue(basicResults.totalTimeSaved || 0, 0, 50), // Normalize to 0-100
            raw: basicResults.totalTimeSaved || 0,
            unit: 'hours/week',
            details: {
                breakdown: 'Weekly time savings from AI automation',
                impact: this.getImpactLevel(basicResults.totalTimeSaved || 0, [
                    { threshold: 10, label: 'Moderate' },
                    { threshold: 20, label: 'Significant' },
                    { threshold: 35, label: 'Transformative' }
                ])
            }
        };
    }

    /**
     * Calculate cost saved dimension
     */
    calculateCostSaved(timeSavedScore) {
        const hourlyRate = 45; // Average fully-loaded cost per hour
        const weeklyCost = timeSavedScore.weekly * hourlyRate;
        const monthlyCost = weeklyCost * 4.33;
        const yearlyCost = weeklyCost * 52;

        return {
            dimension: 'cost_saved',
            weekly: Math.round(weeklyCost),
            monthly: Math.round(monthlyCost),
            yearly: Math.round(yearlyCost),
            normalized: this.normalizeValue(yearlyCost, 0, 150000), // Normalize to 0-100
            raw: yearlyCost,
            unit: '$/year',
            hourlyRate: hourlyRate,
            details: {
                breakdown: `Based on $${hourlyRate}/hr fully-loaded cost`,
                impact: this.getImpactLevel(yearlyCost, [
                    { threshold: 25000, label: 'Notable savings' },
                    { threshold: 75000, label: 'Significant ROI' },
                    { threshold: 125000, label: 'Transformative ROI' }
                ])
            }
        };
    }

    /**
     * Calculate quality improvement dimension
     */
    calculateQualityImpact(answers, questions) {
        let qualityScore = 0;
        let qualityMetrics = {
            accuracy: 0,
            consistency: 0,
            biasReduction: 0,
            errorRate: 0
        };

        // Analyze answers for quality indicators
        Object.entries(answers).forEach(([questionId, answer]) => {
            const question = questions.find(q => q.id === questionId);
            if (!question) return;

            const selectedOptions = Array.isArray(answer) ? answer : [answer];

            selectedOptions.forEach(optionValue => {
                const option = question.options?.find(opt => opt.value === optionValue);
                if (!option) return;

                // Estimate quality improvements based on automation potential
                const aiSavings = option.savingsPct || 0;

                // High automation potential = high quality improvement
                if (aiSavings > 60) {
                    qualityMetrics.accuracy += 25;
                    qualityMetrics.consistency += 40;
                    qualityMetrics.biasReduction += 30;
                    qualityMetrics.errorRate += 35;
                } else if (aiSavings > 30) {
                    qualityMetrics.accuracy += 15;
                    qualityMetrics.consistency += 25;
                    qualityMetrics.biasReduction += 20;
                    qualityMetrics.errorRate += 20;
                } else if (aiSavings > 0) {
                    qualityMetrics.accuracy += 5;
                    qualityMetrics.consistency += 10;
                    qualityMetrics.biasReduction += 10;
                    qualityMetrics.errorRate += 10;
                }
            });
        });

        // Calculate average quality improvement
        const avgQuality = (
            qualityMetrics.accuracy +
            qualityMetrics.consistency +
            qualityMetrics.biasReduction +
            qualityMetrics.errorRate
        ) / 4;

        qualityScore = Math.min(100, avgQuality);

        return {
            dimension: 'quality_improvement',
            score: Math.round(qualityScore),
            normalized: qualityScore,
            raw: qualityScore,
            unit: '% improvement',
            metrics: {
                accuracy: Math.min(100, Math.round(qualityMetrics.accuracy)),
                consistency: Math.min(100, Math.round(qualityMetrics.consistency)),
                biasReduction: Math.min(100, Math.round(qualityMetrics.biasReduction)),
                errorRateReduction: Math.min(100, Math.round(qualityMetrics.errorRate))
            },
            details: {
                breakdown: 'AI tools improve accuracy, consistency, and reduce bias',
                impact: this.getImpactLevel(qualityScore, [
                    { threshold: 20, label: 'Modest improvement' },
                    { threshold: 40, label: 'Significant improvement' },
                    { threshold: 60, label: 'Major quality gains' }
                ])
            }
        };
    }

    /**
     * Calculate satisfaction impact dimension
     */
    calculateSatisfactionImpact(answers, questions) {
        let satisfactionScore = 0;
        let stakeholderSatisfaction = {
            recruiter: 0,
            hiringManager: 0,
            candidate: 0
        };

        // Analyze answers for satisfaction indicators
        Object.entries(answers).forEach(([questionId, answer]) => {
            const question = questions.find(q => q.id === questionId);
            if (!question) return;

            const selectedOptions = Array.isArray(answer) ? answer : [answer];

            selectedOptions.forEach(optionValue => {
                const option = question.options?.find(opt => opt.value === optionValue);
                if (!option) return;

                const aiSavings = option.savingsPct || 0;
                const hours = option.hours || 0;

                // More time saved = higher satisfaction
                if (hours > 5 && aiSavings > 50) {
                    stakeholderSatisfaction.recruiter += 35;
                    stakeholderSatisfaction.hiringManager += 20;
                    stakeholderSatisfaction.candidate += 15;
                } else if (hours > 2 && aiSavings > 30) {
                    stakeholderSatisfaction.recruiter += 20;
                    stakeholderSatisfaction.hiringManager += 10;
                    stakeholderSatisfaction.candidate += 8;
                } else if (hours > 0 && aiSavings > 0) {
                    stakeholderSatisfaction.recruiter += 10;
                    stakeholderSatisfaction.hiringManager += 5;
                    stakeholderSatisfaction.candidate += 3;
                }
            });
        });

        // Calculate average satisfaction
        const avgSatisfaction = (
            Math.min(100, stakeholderSatisfaction.recruiter) +
            Math.min(100, stakeholderSatisfaction.hiringManager) +
            Math.min(100, stakeholderSatisfaction.candidate)
        ) / 3;

        satisfactionScore = avgSatisfaction;

        return {
            dimension: 'satisfaction_impact',
            score: Math.round(satisfactionScore),
            normalized: satisfactionScore,
            raw: satisfactionScore,
            unit: '% increase',
            stakeholders: {
                recruiter: Math.min(100, Math.round(stakeholderSatisfaction.recruiter)),
                hiringManager: Math.min(100, Math.round(stakeholderSatisfaction.hiringManager)),
                candidate: Math.min(100, Math.round(stakeholderSatisfaction.candidate))
            },
            details: {
                breakdown: 'Reduced workload improves experience for all stakeholders',
                impact: this.getImpactLevel(satisfactionScore, [
                    { threshold: 15, label: 'Modest morale boost' },
                    { threshold: 30, label: 'Significant satisfaction gains' },
                    { threshold: 50, label: 'Major employee happiness increase' }
                ])
            }
        };
    }

    /**
     * Calculate risk reduction dimension
     */
    calculateRiskReduction(answers, questions) {
        let riskScore = 0;
        let riskMetrics = {
            compliance: 0,
            dataSecurity: 0,
            humanError: 0,
            processFailure: 0
        };

        // Analyze answers for risk indicators
        Object.entries(answers).forEach(([questionId, answer]) => {
            const question = questions.find(q => q.id === questionId);
            if (!question) return;

            const businessUnit = question.businessUnit || '';

            const selectedOptions = Array.isArray(answer) ? answer : [answer];

            selectedOptions.forEach(optionValue => {
                const option = question.options?.find(opt => opt.value === optionValue);
                if (!option) return;

                const aiSavings = option.savingsPct || 0;

                // High automation = lower risk
                if (businessUnit === 'compliance' && aiSavings > 40) {
                    riskMetrics.compliance += 40;
                    riskMetrics.dataSecurity += 35;
                    riskMetrics.humanError += 50;
                    riskMetrics.processFailure += 30;
                } else if (businessUnit === 'contracts' && aiSavings > 40) {
                    riskMetrics.compliance += 30;
                    riskMetrics.humanError += 40;
                    riskMetrics.processFailure += 25;
                } else if (aiSavings > 50) {
                    riskMetrics.humanError += 30;
                    riskMetrics.processFailure += 20;
                } else if (aiSavings > 0) {
                    riskMetrics.humanError += 10;
                    riskMetrics.processFailure += 8;
                }
            });
        });

        // Calculate average risk reduction
        const avgRiskReduction = (
            riskMetrics.compliance +
            riskMetrics.dataSecurity +
            riskMetrics.humanError +
            riskMetrics.processFailure
        ) / 4;

        riskScore = Math.min(100, avgRiskReduction);

        return {
            dimension: 'risk_reduction',
            score: Math.round(riskScore),
            normalized: riskScore,
            raw: riskScore,
            unit: '% reduction',
            riskAreas: {
                complianceRisk: Math.min(100, Math.round(riskMetrics.compliance)),
                dataSecurityRisk: Math.min(100, Math.round(riskMetrics.dataSecurity)),
                humanErrorRisk: Math.min(100, Math.round(riskMetrics.humanError)),
                processFailureRisk: Math.min(100, Math.round(riskMetrics.processFailure))
            },
            details: {
                breakdown: 'AI automation reduces compliance, security, and human error risks',
                impact: this.getImpactLevel(riskScore, [
                    { threshold: 20, label: 'Modest risk reduction' },
                    { threshold: 40, label: 'Significant risk mitigation' },
                    { threshold: 60, label: 'Major risk elimination' }
                ])
            }
        };
    }

    /**
     * Calculate overall weighted score
     */
    calculateOverallScore() {
        let weightedSum = 0;
        let totalWeight = 0;

        Object.values(this.dimensions).forEach(dimension => {
            const score = this.scores[dimension.id];
            if (score && score.normalized !== undefined) {
                weightedSum += score.normalized * dimension.weight;
                totalWeight += dimension.weight;
            }
        });

        return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
    }

    /**
     * Get detailed breakdown
     */
    getDetailedBreakdown() {
        return {
            dimensions: Object.values(this.dimensions).map(dim => {
                const score = this.scores[dim.id] || {};
                return {
                    id: dim.id,
                    label: dim.label,
                    icon: dim.icon,
                    weight: dim.weight,
                    score: score.normalized || 0,
                    raw: score.raw || 0,
                    unit: score.unit || dim.unit,
                    impact: score.details?.impact || 'Unknown',
                    contribution: (score.normalized || 0) * dim.weight
                };
            }),
            total: this.overallScore,
            grade: this.getGrade(this.overallScore)
        };
    }

    /**
     * Get letter grade from score
     */
    getGrade(score) {
        if (score >= 90) return { letter: 'A+', label: 'Exceptional', color: '#10B981' };
        if (score >= 80) return { letter: 'A', label: 'Excellent', color: '#10B981' };
        if (score >= 70) return { letter: 'B', label: 'Good', color: '#3B82F6' };
        if (score >= 60) return { letter: 'C', label: 'Average', color: '#EAB308' };
        if (score >= 50) return { letter: 'D', label: 'Below Average', color: '#F97316' };
        return { letter: 'F', label: 'Needs Improvement', color: '#EF4444' };
    }

    /**
     * Normalize value to 0-100 scale
     */
    normalizeValue(value, min, max) {
        if (max === min) return 100;
        return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    }

    /**
     * Get impact level label
     */
    getImpactLevel(value, thresholds) {
        for (let i = thresholds.length - 1; i >= 0; i--) {
            if (value >= thresholds[i].threshold) {
                return thresholds[i].label;
            }
        }
        return 'Minimal impact';
    }

    /**
     * Render multi-dimensional scorecard as HTML
     */
    renderScorecardHTML(multiDimResult) {
        const breakdown = multiDimResult.breakdown;

        return `
            <div class="multi-dimensional-scorecard bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mt-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="text-3xl">📊</div>
                    <h3 class="text-xl font-bold text-gray-900">Multi-Dimensional Impact Assessment</h3>
                </div>

                <!-- Overall Score -->
                <div class="bg-white rounded-xl p-6 mb-6 border-2 border-indigo-200">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <div class="text-sm text-gray-600 mb-1">Overall Impact Score</div>
                            <div class="text-5xl font-bold ${breakdown.grade.color}" style="color: ${breakdown.grade.color}">
                                ${breakdown.total}
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-3xl font-bold ${breakdown.grade.color}" style="color: ${breakdown.grade.color}">
                                ${breakdown.grade.letter}
                            </div>
                            <div class="text-sm font-medium text-gray-700">${breakdown.grade.label}</div>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                        <div class="h-3 rounded-full transition-all duration-500"
                             style="width: ${breakdown.total}%; background: ${breakdown.grade.color}"></div>
                    </div>
                </div>

                <!-- Dimension Breakdown -->
                <div class="space-y-4 mb-6">
                    <h4 class="font-semibold text-gray-900 flex items-center gap-2">
                        <span>🎯</span>
                        <span>Impact by Dimension</span>
                    </h4>

                    ${breakdown.dimensions.map(dim => `
                        <div class="bg-white rounded-lg p-4 border border-gray-200">
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">${dim.icon}</span>
                                    <div>
                                        <div class="font-semibold text-gray-900">${dim.label}</div>
                                        <div class="text-xs text-gray-500">Weight: ${(dim.weight * 100).toFixed(0)}% of total</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-indigo-600">${Math.round(dim.score)}</div>
                                    <div class="text-xs text-gray-600">/ 100</div>
                                </div>
                            </div>

                            <div class="mb-2">
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                         style="width: ${dim.score}%"></div>
                                </div>
                            </div>

                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-600">${dim.impact}</span>
                                <span class="font-medium text-indigo-600">
                                    ${this.formatDimensionValue(dim)}
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Detailed Metrics -->
                <div class="grid md:grid-cols-2 gap-4">
                    ${this.renderDetailedMetrics()}
                </div>

                <div class="mt-6 pt-4 border-t border-gray-200">
                    <p class="text-xs text-gray-600 text-center">
                        💡 This multi-dimensional analysis considers time, cost, quality, satisfaction, and risk factors
                        to provide a comprehensive view of AI's potential impact on your workflow.
                    </p>
                </div>
            </div>
        `;
    }

    /**
     * Format dimension value with unit
     */
    formatDimensionValue(dim) {
        const score = this.scores[dim.id];
        if (!score) return '--';

        if (dim.id === 'time_saved') {
            return `${score.weekly.toFixed(1)} hrs/week`;
        } else if (dim.id === 'cost_saved') {
            return `$${score.yearly.toLocaleString()}/year`;
        } else {
            return `+${Math.round(score.score)}%`;
        }
    }

    /**
     * Render detailed metrics
     */
    renderDetailedMetrics() {
        const qualityScore = this.scores.quality_improvement;
        const satisfactionScore = this.scores.satisfaction_impact;
        const riskScore = this.scores.risk_reduction;

        let html = '';

        // Quality Metrics
        if (qualityScore && qualityScore.metrics) {
            html += `
                <div class="bg-purple-50 rounded-lg p-4">
                    <h5 class="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                        <span>📈</span>
                        <span>Quality Improvements</span>
                    </h5>
                    <div class="space-y-2 text-sm">
                        ${this.renderMetricBar('Accuracy', qualityScore.metrics.accuracy, '#7C3AED')}
                        ${this.renderMetricBar('Consistency', qualityScore.metrics.consistency, '#7C3AED')}
                        ${this.renderMetricBar('Bias Reduction', qualityScore.metrics.biasReduction, '#7C3AED')}
                        ${this.renderMetricBar('Error Rate ↓', qualityScore.metrics.errorRateReduction, '#7C3AED')}
                    </div>
                </div>
            `;
        }

        // Satisfaction Metrics
        if (satisfactionScore && satisfactionScore.stakeholders) {
            html += `
                <div class="bg-pink-50 rounded-lg p-4">
                    <h5 class="font-semibold text-pink-900 mb-3 flex items-center gap-2">
                        <span>😊</span>
                        <span>Satisfaction Gains</span>
                    </h5>
                    <div class="space-y-2 text-sm">
                        ${this.renderMetricBar('Your Satisfaction', satisfactionScore.stakeholders.recruiter, '#EC4899')}
                        ${this.renderMetricBar('Hiring Managers', satisfactionScore.stakeholders.hiringManager, '#EC4899')}
                        ${this.renderMetricBar('Candidates', satisfactionScore.stakeholders.candidate, '#EC4899')}
                    </div>
                </div>
            `;
        }

        return html;
    }

    /**
     * Render metric bar
     */
    renderMetricBar(label, value, color) {
        return `
            <div>
                <div class="flex justify-between mb-1">
                    <span class="text-gray-700">${label}</span>
                    <span class="font-semibold" style="color: ${color}">+${value}%</span>
                </div>
                <div class="w-full bg-white rounded-full h-1.5">
                    <div class="h-1.5 rounded-full transition-all duration-500"
                         style="width: ${value}%; background: ${color}"></div>
                </div>
            </div>
        `;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.MultiDimensionalScorer = MultiDimensionalScorer;
}
