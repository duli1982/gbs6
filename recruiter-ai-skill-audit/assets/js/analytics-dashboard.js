/**
 * Analytics Dashboard
 * Visualizes question performance metrics and provides insights
 * Helps optimize the assessment over time
 */

class AnalyticsDashboard {
    constructor(analyticsTracker) {
        this.tracker = analyticsTracker || (window.analyticsTracker || new window.AnalyticsTracker());
    }

    /**
     * Render complete analytics dashboard
     */
    renderDashboard() {
        const summary = this.tracker.getAnalyticsSummary();
        const suggestions = this.tracker.getABTestSuggestions();

        return `
            <div class="analytics-dashboard bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="text-3xl">📊</div>
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">Assessment Analytics Dashboard</h2>
                        <p class="text-sm text-gray-600">Performance insights and optimization recommendations</p>
                    </div>
                </div>

                ${this.renderSummaryCards(summary)}
                ${this.renderQuestionPerformance()}
                ${this.renderABTestSuggestions(suggestions)}
                ${this.renderAnswerDistributions()}
            </div>
        `;
    }

    /**
     * Render summary cards
     */
    renderSummaryCards(summary) {
        return `
            <div class="grid md:grid-cols-4 gap-4 mb-6">
                <div class="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <div class="text-sm text-gray-600 mb-1">Total Questions</div>
                    <div class="text-3xl font-bold text-gray-900">${summary.totalQuestions}</div>
                    <div class="text-xs text-gray-500 mt-1">Being tracked</div>
                </div>

                <div class="bg-white rounded-lg p-4 border-l-4 border-green-500">
                    <div class="text-sm text-gray-600 mb-1">Completion Rate</div>
                    <div class="text-3xl font-bold text-green-600">${summary.averageCompletionRate}%</div>
                    <div class="text-xs text-gray-500 mt-1">Average across all questions</div>
                </div>

                <div class="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
                    <div class="text-sm text-gray-600 mb-1">Drop-Off Rate</div>
                    <div class="text-3xl font-bold text-yellow-600">${summary.averageDropOffRate}%</div>
                    <div class="text-xs text-gray-500 mt-1">Users abandoning questions</div>
                </div>

                <div class="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                    <div class="text-sm text-gray-600 mb-1">Revision Rate</div>
                    <div class="text-3xl font-bold text-purple-600">${summary.averageRevisionRate}%</div>
                    <div class="text-xs text-gray-500 mt-1">Users changing answers</div>
                </div>
            </div>

            <div class="grid md:grid-cols-3 gap-4 mb-6">
                <div class="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-2xl">🔴</span>
                        <span class="font-semibold text-red-900">Attention Needed</span>
                    </div>
                    <div class="text-3xl font-bold text-red-600">${summary.questionsNeedingAttention}</div>
                    <div class="text-xs text-red-700 mt-1">High drop-off or low completion</div>
                </div>

                <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-2xl">🟡</span>
                        <span class="font-semibold text-yellow-900">Monitor</span>
                    </div>
                    <div class="text-3xl font-bold text-yellow-600">${summary.questionsToMonitor}</div>
                    <div class="text-xs text-yellow-700 mt-1">Moderate issues detected</div>
                </div>

                <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-2xl">🟢</span>
                        <span class="font-semibold text-green-900">Performing Well</span>
                    </div>
                    <div class="text-3xl font-bold text-green-600">${summary.questionsPerformingWell}</div>
                    <div class="text-xs text-green-700 mt-1">No issues detected</div>
                </div>
            </div>
        `;
    }

    /**
     * Render question performance table
     */
    renderQuestionPerformance() {
        const allQuestions = Object.keys(this.tracker.questionMetrics);

        if (allQuestions.length === 0) {
            return `
                <div class="bg-white rounded-lg p-8 text-center border border-gray-200 mb-6">
                    <div class="text-4xl mb-2">📊</div>
                    <p class="text-gray-600">No analytics data yet. Complete an assessment to see metrics.</p>
                </div>
            `;
        }

        // Get performance for all questions and sort by status
        const performances = allQuestions
            .map(qId => this.tracker.getQuestionPerformance(qId))
            .filter(p => p !== null)
            .sort((a, b) => {
                const statusOrder = { 'attention_needed': 0, 'monitor': 1, 'performing_well': 2 };
                return statusOrder[a.status.level] - statusOrder[b.status.level];
            });

        return `
            <div class="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📈</span>
                    <span>Question Performance</span>
                </h3>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-gray-200">
                                <th class="text-left p-3 font-semibold text-gray-700">Status</th>
                                <th class="text-left p-3 font-semibold text-gray-700">Question ID</th>
                                <th class="text-right p-3 font-semibold text-gray-700">Views</th>
                                <th class="text-right p-3 font-semibold text-gray-700">Completion</th>
                                <th class="text-right p-3 font-semibold text-gray-700">Avg Time</th>
                                <th class="text-right p-3 font-semibold text-gray-700">Revisions</th>
                                <th class="text-right p-3 font-semibold text-gray-700">Drop-Off</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${performances.map(perf => this.renderPerformanceRow(perf)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    /**
     * Render single performance row
     */
    renderPerformanceRow(perf) {
        const statusBg = {
            'attention_needed': 'bg-red-100',
            'monitor': 'bg-yellow-100',
            'performing_well': 'bg-green-100'
        }[perf.status.level];

        return `
            <tr class="border-b border-gray-100 hover:bg-gray-50">
                <td class="p-3">
                    <span class="inline-flex items-center gap-1 ${statusBg} px-2 py-1 rounded text-xs font-medium">
                        ${perf.status.emoji} ${perf.status.label}
                    </span>
                </td>
                <td class="p-3 font-mono text-xs text-gray-700">${perf.questionId}</td>
                <td class="p-3 text-right text-gray-900">${perf.totalViews}</td>
                <td class="p-3 text-right">
                    <span class="font-semibold ${this.getCompletionColor(perf.completionRate)}">
                        ${perf.completionRate}%
                    </span>
                </td>
                <td class="p-3 text-right text-gray-700">${perf.averageTimeToAnswer}s</td>
                <td class="p-3 text-right ${this.getRevisionColor(perf.revisionRate)}">
                    ${perf.revisionRate}%
                </td>
                <td class="p-3 text-right ${this.getDropOffColor(perf.dropOffRate)}">
                    ${perf.dropOffRate}%
                </td>
            </tr>
        `;
    }

    /**
     * Get color class for completion rate
     */
    getCompletionColor(rate) {
        if (rate >= 80) return 'text-green-600';
        if (rate >= 60) return 'text-yellow-600';
        return 'text-red-600';
    }

    /**
     * Get color class for revision rate
     */
    getRevisionColor(rate) {
        if (rate > 15) return 'text-red-600';
        if (rate > 8) return 'text-yellow-600';
        return 'text-green-600';
    }

    /**
     * Get color class for drop-off rate
     */
    getDropOffColor(rate) {
        if (rate > 15) return 'text-red-600';
        if (rate > 8) return 'text-yellow-600';
        return 'text-green-600';
    }

    /**
     * Render A/B test suggestions
     */
    renderABTestSuggestions(suggestions) {
        if (suggestions.length === 0) {
            return `
                <div class="bg-green-50 rounded-lg p-6 border border-green-200 mb-6">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-2xl">✅</span>
                        <span class="font-semibold text-green-900">All Questions Performing Well</span>
                    </div>
                    <p class="text-sm text-green-700">No optimization suggestions at this time. Keep monitoring!</p>
                </div>
            `;
        }

        return `
            <div class="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>🧪</span>
                    <span>A/B Testing Suggestions</span>
                </h3>

                <div class="space-y-4">
                    ${suggestions.map(sug => this.renderSuggestion(sug)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render single suggestion
     */
    renderSuggestion(suggestion) {
        const priorityColors = {
            'high': 'border-red-400 bg-red-50',
            'medium': 'border-yellow-400 bg-yellow-50',
            'low': 'border-blue-400 bg-blue-50'
        };

        const priorityBadgeColors = {
            'high': 'bg-red-100 text-red-700',
            'medium': 'bg-yellow-100 text-yellow-700',
            'low': 'bg-blue-100 text-blue-700'
        };

        return `
            <div class="border-l-4 ${priorityColors[suggestion.priority]} rounded-lg p-4">
                <div class="flex items-start justify-between mb-2">
                    <div>
                        <div class="font-mono text-xs text-gray-600 mb-1">${suggestion.questionId}</div>
                        <div class="text-sm text-gray-700">
                            <span class="font-semibold">Issue:</span> ${suggestion.issue}
                        </div>
                    </div>
                    <span class="inline-block px-2 py-1 rounded text-xs font-semibold ${priorityBadgeColors[suggestion.priority]}">
                        ${suggestion.priority.toUpperCase()}
                    </span>
                </div>
                <div class="text-sm text-gray-900 mt-2">
                    <span class="font-semibold">💡 Suggestion:</span> ${suggestion.suggestion}
                </div>
            </div>
        `;
    }

    /**
     * Render answer distributions
     */
    renderAnswerDistributions() {
        const allQuestions = Object.keys(this.tracker.questionMetrics);

        if (allQuestions.length === 0) return '';

        // Get questions with interesting distributions (skewed or balanced)
        const distributions = allQuestions
            .map(qId => ({
                questionId: qId,
                insights: this.tracker.getAnswerDistributionInsights(qId)
            }))
            .filter(d => d.insights !== null)
            .slice(0, 5); // Show top 5

        if (distributions.length === 0) return '';

        return `
            <div class="bg-white rounded-lg p-6 border border-gray-200">
                <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📊</span>
                    <span>Answer Distributions</span>
                </h3>

                <div class="space-y-6">
                    ${distributions.map(d => this.renderDistribution(d)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render single distribution
     */
    renderDistribution(data) {
        const { questionId, insights } = data;

        return `
            <div class="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                <div class="font-mono text-xs text-gray-600 mb-2">${questionId}</div>
                <div class="text-sm text-gray-700 mb-3">${insights.insights}</div>

                <div class="space-y-2">
                    ${insights.options.map(opt => `
                        <div>
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-sm text-gray-700">${opt.answer}</span>
                                <span class="text-sm font-semibold text-gray-900">${opt.percentage}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                     style="width: ${opt.percentage}%"></div>
                            </div>
                            <div class="text-xs text-gray-500 mt-1">${opt.count} response${opt.count === 1 ? '' : 's'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render compact analytics widget (for embedding)
     */
    renderCompactWidget() {
        const summary = this.tracker.getAnalyticsSummary();

        return `
            <div class="analytics-widget bg-white rounded-lg p-4 border border-gray-200">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-semibold text-gray-900 flex items-center gap-2">
                        <span>📊</span>
                        <span>Analytics</span>
                    </h4>
                    <button onclick="window.showFullAnalytics()" class="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        View Full →
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <div class="text-xs text-gray-600">Completion</div>
                        <div class="text-lg font-bold text-green-600">${summary.averageCompletionRate}%</div>
                    </div>
                    <div>
                        <div class="text-xs text-gray-600">Drop-Off</div>
                        <div class="text-lg font-bold text-yellow-600">${summary.averageDropOffRate}%</div>
                    </div>
                </div>

                <div class="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
                    <span class="font-medium">${summary.questionsNeedingAttention}</span> questions need attention
                </div>
            </div>
        `;
    }

    /**
     * Export dashboard as HTML
     */
    exportDashboard() {
        return this.renderDashboard();
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AnalyticsDashboard = AnalyticsDashboard;

    // Helper function to show full analytics
    window.showFullAnalytics = function() {
        const dashboard = new AnalyticsDashboard();
        const modalHtml = `
            <div id="analytics-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-900">Analytics Dashboard</h2>
                        <button onclick="document.getElementById('analytics-modal').remove()" class="text-gray-600 hover:text-gray-900">
                            ✕
                        </button>
                    </div>
                    <div class="p-6">
                        ${dashboard.renderDashboard()}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    };
}
