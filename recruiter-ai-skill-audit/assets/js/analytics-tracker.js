/**
 * Analytics Tracker
 * Tracks question performance, answer distributions, and user behavior
 * Provides insights for continuous optimization
 */

class AnalyticsTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.events = [];
        this.questionMetrics = {};
        this.storageKey = 'aiSkillsAudit_analytics';
        this.loadHistoricalData();
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Load historical analytics data from localStorage
     */
    loadHistoricalData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                this.questionMetrics = data.questionMetrics || {};
            }
        } catch (error) {
            console.warn('Failed to load analytics data:', error);
            this.questionMetrics = {};
        }
    }

    /**
     * Save analytics data to localStorage
     */
    saveAnalyticsData() {
        try {
            const data = {
                questionMetrics: this.questionMetrics,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save analytics data:', error);
        }
    }

    /**
     * Track event
     */
    trackEvent(eventType, eventData = {}) {
        const event = {
            sessionId: this.sessionId,
            timestamp: Date.now(),
            type: eventType,
            data: eventData
        };

        this.events.push(event);

        // Process event for metrics
        this.processEvent(event);

        return event;
    }

    /**
     * Process event for metrics
     */
    processEvent(event) {
        switch (event.type) {
            case 'question_viewed':
                this.trackQuestionView(event.data);
                break;
            case 'question_answered':
                this.trackQuestionAnswer(event.data);
                break;
            case 'answer_changed':
                this.trackAnswerChange(event.data);
                break;
            case 'assessment_started':
                this.trackAssessmentStart(event.data);
                break;
            case 'assessment_completed':
                this.trackAssessmentComplete(event.data);
                break;
            case 'assessment_abandoned':
                this.trackAssessmentAbandoned(event.data);
                break;
        }
    }

    /**
     * Track question view
     */
    trackQuestionView(data) {
        const { questionId } = data;

        if (!this.questionMetrics[questionId]) {
            this.questionMetrics[questionId] = {
                totalViews: 0,
                totalAnswers: 0,
                totalRevisions: 0,
                averageTimeToAnswer: 0,
                answerDistribution: {},
                dropOffCount: 0,
                clarityRatings: [],
                lastViewed: null
            };
        }

        this.questionMetrics[questionId].totalViews++;
        this.questionMetrics[questionId].lastViewed = Date.now();
        this.questionMetrics[questionId].viewStartTime = Date.now();

        this.saveAnalyticsData();
    }

    /**
     * Track question answer
     */
    trackQuestionAnswer(data) {
        const { questionId, answer, timeToAnswer } = data;

        if (!this.questionMetrics[questionId]) {
            this.trackQuestionView({ questionId });
        }

        const metrics = this.questionMetrics[questionId];

        metrics.totalAnswers++;

        // Track answer distribution
        const answerKey = Array.isArray(answer) ? answer.join(',') : answer;
        metrics.answerDistribution[answerKey] = (metrics.answerDistribution[answerKey] || 0) + 1;

        // Update average time to answer
        if (timeToAnswer) {
            const currentTotal = metrics.averageTimeToAnswer * (metrics.totalAnswers - 1);
            metrics.averageTimeToAnswer = (currentTotal + timeToAnswer) / metrics.totalAnswers;
        } else if (metrics.viewStartTime) {
            const calculatedTime = Date.now() - metrics.viewStartTime;
            const currentTotal = metrics.averageTimeToAnswer * (metrics.totalAnswers - 1);
            metrics.averageTimeToAnswer = (currentTotal + calculatedTime) / metrics.totalAnswers;
        }

        this.saveAnalyticsData();
    }

    /**
     * Track answer change (user goes back)
     */
    trackAnswerChange(data) {
        const { questionId } = data;

        if (this.questionMetrics[questionId]) {
            this.questionMetrics[questionId].totalRevisions++;
        }

        this.saveAnalyticsData();
    }

    /**
     * Track assessment start
     */
    trackAssessmentStart(data) {
        this.assessmentStartTime = Date.now();
    }

    /**
     * Track assessment completion
     */
    trackAssessmentComplete(data) {
        const completionTime = Date.now() - this.assessmentStartTime;

        this.trackEvent('completion_time', {
            duration: completionTime,
            durationMinutes: Math.round(completionTime / 60000)
        });

        this.saveAnalyticsData();
    }

    /**
     * Track assessment abandonment
     */
    trackAssessmentAbandoned(data) {
        const { questionId } = data;

        if (this.questionMetrics[questionId]) {
            this.questionMetrics[questionId].dropOffCount++;
        }

        this.saveAnalyticsData();
    }

    /**
     * Get question performance report
     */
    getQuestionPerformance(questionId) {
        const metrics = this.questionMetrics[questionId];
        if (!metrics) return null;

        const completionRate = metrics.totalViews > 0
            ? (metrics.totalAnswers / metrics.totalViews) * 100
            : 0;

        const revisionRate = metrics.totalAnswers > 0
            ? (metrics.totalRevisions / metrics.totalAnswers) * 100
            : 0;

        const dropOffRate = metrics.totalViews > 0
            ? (metrics.dropOffCount / metrics.totalViews) * 100
            : 0;

        return {
            questionId,
            totalViews: metrics.totalViews,
            totalAnswers: metrics.totalAnswers,
            completionRate: Math.round(completionRate * 10) / 10,
            averageTimeToAnswer: Math.round(metrics.averageTimeToAnswer / 1000), // Convert to seconds
            revisionRate: Math.round(revisionRate * 10) / 10,
            dropOffRate: Math.round(dropOffRate * 10) / 10,
            answerDistribution: metrics.answerDistribution,
            status: this.getQuestionStatus(completionRate, revisionRate, dropOffRate)
        };
    }

    /**
     * Get question status (attention needed, monitor, performing well)
     */
    getQuestionStatus(completionRate, revisionRate, dropOffRate) {
        if (dropOffRate > 15 || completionRate < 60) {
            return {
                level: 'attention_needed',
                emoji: '🔴',
                label: 'Attention Needed',
                issues: [
                    dropOffRate > 15 ? `High drop-off rate (${dropOffRate}%)` : null,
                    completionRate < 60 ? `Low completion rate (${completionRate}%)` : null
                ].filter(Boolean)
            };
        }

        if (revisionRate > 15 || dropOffRate > 8) {
            return {
                level: 'monitor',
                emoji: '🟡',
                label: 'Monitor',
                issues: [
                    revisionRate > 15 ? `High revision rate (${revisionRate}%)` : null,
                    dropOffRate > 8 ? `Moderate drop-off (${dropOffRate}%)` : null
                ].filter(Boolean)
            };
        }

        return {
            level: 'performing_well',
            emoji: '🟢',
            label: 'Performing Well',
            issues: []
        };
    }

    /**
     * Get overall analytics summary
     */
    getAnalyticsSummary() {
        const allQuestions = Object.keys(this.questionMetrics);
        const totalQuestions = allQuestions.length;

        if (totalQuestions === 0) {
            return {
                totalQuestions: 0,
                averageCompletionRate: 0,
                averageRevisionRate: 0,
                averageDropOffRate: 0,
                questionsNeedingAttention: 0,
                questionsToMonitor: 0,
                questionsPerformingWell: 0
            };
        }

        let totalCompletionRate = 0;
        let totalRevisionRate = 0;
        let totalDropOffRate = 0;
        let needingAttention = 0;
        let toMonitor = 0;
        let performingWell = 0;

        allQuestions.forEach(questionId => {
            const perf = this.getQuestionPerformance(questionId);
            if (perf) {
                totalCompletionRate += perf.completionRate;
                totalRevisionRate += perf.revisionRate;
                totalDropOffRate += perf.dropOffRate;

                if (perf.status.level === 'attention_needed') needingAttention++;
                else if (perf.status.level === 'monitor') toMonitor++;
                else performingWell++;
            }
        });

        return {
            totalQuestions,
            averageCompletionRate: Math.round((totalCompletionRate / totalQuestions) * 10) / 10,
            averageRevisionRate: Math.round((totalRevisionRate / totalQuestions) * 10) / 10,
            averageDropOffRate: Math.round((totalDropOffRate / totalQuestions) * 10) / 10,
            questionsNeedingAttention: needingAttention,
            questionsToMonitor: toMonitor,
            questionsPerformingWell: performingWell
        };
    }

    /**
     * Get answer distribution insights
     */
    getAnswerDistributionInsights(questionId) {
        const metrics = this.questionMetrics[questionId];
        if (!metrics || !metrics.answerDistribution) return null;

        const distribution = metrics.answerDistribution;
        const totalAnswers = Object.values(distribution).reduce((sum, count) => sum + count, 0);

        if (totalAnswers === 0) return null;

        const options = Object.keys(distribution).map(answer => ({
            answer,
            count: distribution[answer],
            percentage: Math.round((distribution[answer] / totalAnswers) * 100)
        })).sort((a, b) => b.count - a.count);

        const mostPopular = options[0];
        const leastPopular = options[options.length - 1];
        const isSkewed = mostPopular.percentage > 70; // One option dominates

        return {
            totalResponses: totalAnswers,
            options,
            mostPopular,
            leastPopular,
            isSkewed,
            insights: isSkewed
                ? `⚠️ Unbalanced: ${mostPopular.percentage}% choose "${mostPopular.answer}". Consider reviewing option balance.`
                : `✅ Well-balanced distribution across options.`
        };
    }

    /**
     * Export analytics data as JSON
     */
    exportAnalytics() {
        return {
            sessionId: this.sessionId,
            events: this.events,
            questionMetrics: this.questionMetrics,
            summary: this.getAnalyticsSummary(),
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * Clear all analytics data
     */
    clearAnalytics() {
        this.questionMetrics = {};
        this.events = [];
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Get A/B test suggestion
     */
    getABTestSuggestions() {
        const summary = this.getAnalyticsSummary();
        const suggestions = [];

        // Find questions needing attention
        Object.keys(this.questionMetrics).forEach(questionId => {
            const perf = this.getQuestionPerformance(questionId);

            if (perf && perf.status.level === 'attention_needed') {
                suggestions.push({
                    questionId,
                    issue: perf.status.issues.join(', '),
                    suggestion: this.generateTestSuggestion(perf),
                    priority: 'high'
                });
            } else if (perf && perf.status.level === 'monitor') {
                suggestions.push({
                    questionId,
                    issue: perf.status.issues.join(', '),
                    suggestion: this.generateTestSuggestion(perf),
                    priority: 'medium'
                });
            }
        });

        return suggestions;
    }

    /**
     * Generate A/B test suggestion based on performance
     */
    generateTestSuggestion(performance) {
        const suggestions = [];

        if (performance.dropOffRate > 15) {
            suggestions.push('Test: Simplify question wording or reduce number of options');
        }

        if (performance.revisionRate > 15) {
            suggestions.push('Test: Add clarifying descriptions or examples to options');
        }

        if (performance.averageTimeToAnswer > 60) {
            suggestions.push('Test: Break into multiple simpler questions');
        }

        return suggestions.length > 0
            ? suggestions.join(' OR ')
            : 'Monitor performance and consider question rewording';
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AnalyticsTracker = AnalyticsTracker;
}
