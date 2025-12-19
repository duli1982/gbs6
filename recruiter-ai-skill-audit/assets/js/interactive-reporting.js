/**
 * Interactive Reporting System
 * Transforms static reports into dynamic, filterable, scenario-based dashboards
 */

class InteractiveReportingSystem {
    constructor(results, enhancedContext) {
        this.results = results;
        this.enhancedContext = enhancedContext;
        this.filters = {
            priority: 'all', // all, critical, high, medium, low
            implementationTime: 'all', // all, quick (<1 week), medium (1-4 weeks), long (>4 weeks)
            roiThreshold: 0 // minimum hours saved per week
        };
        this.sortBy = 'savings'; // savings, priority, name, roi
        this.sortOrder = 'desc'; // desc, asc
        this.activeScenario = null;
    }

    /**
     * Render interactive report dashboard
     */
    renderInteractiveDashboard() {
        return `
            <div class="interactive-dashboard">
                <!-- Filter Controls -->
                ${this.renderFilterControls()}

                <!-- Scenario Analysis -->
                ${this.renderScenarioAnalysis()}

                <!-- Recommendations with drill-down -->
                ${this.renderInteractiveRecommendations()}

                <!-- Visual Analytics -->
                ${this.renderVisualAnalytics()}
            </div>
        `;
    }

    /**
     * Filter Controls
     */
    renderFilterControls() {
        return `
            <div class="bg-white rounded-xl shadow-md p-6 mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-900">🔍 Filter & Sort Recommendations</h3>
                    <button id="reset-filters-btn" class="text-sm text-indigo-600 hover:text-indigo-800">
                        Reset All Filters
                    </button>
                </div>

                <div class="grid md:grid-cols-4 gap-4">
                    <!-- Priority Filter -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                        <select id="filter-priority" class="w-full p-2 border-2 border-gray-300 rounded-lg">
                            <option value="all">All Priorities</option>
                            <option value="critical">Critical Only</option>
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                    </div>

                    <!-- Implementation Time Filter -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Implementation Time</label>
                        <select id="filter-implementation-time" class="w-full p-2 border-2 border-gray-300 rounded-lg">
                            <option value="all">All Timeframes</option>
                            <option value="quick">Quick Wins (&lt; 1 week)</option>
                            <option value="medium">Medium (1-4 weeks)</option>
                            <option value="long">Long-term (&gt; 4 weeks)</option>
                        </select>
                    </div>

                    <!-- ROI Threshold Filter -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Min. Hours Saved/Week</label>
                        <input type="number" id="filter-roi-threshold" min="0" step="0.5" placeholder="0"
                               class="w-full p-2 border-2 border-gray-300 rounded-lg" value="0">
                    </div>

                    <!-- Sort By -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                        <select id="sort-by" class="w-full p-2 border-2 border-gray-300 rounded-lg">
                            <option value="savings">Time Saved (High to Low)</option>
                            <option value="priority">Priority (High to Low)</option>
                            <option value="roi">ROI (High to Low)</option>
                            <option value="name">Name (A-Z)</option>
                        </select>
                    </div>
                </div>

                <!-- Active Filter Summary -->
                <div id="filter-summary" class="mt-4 flex flex-wrap gap-2"></div>
            </div>
        `;
    }

    /**
     * Scenario Analysis
     */
    renderScenarioAnalysis() {
        return `
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-md p-6 mb-6 border border-purple-200">
                <h3 class="text-lg font-bold text-gray-900 mb-4">🎯 What-If Scenario Analysis</h3>

                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Time Investment Scenario -->
                    <div class="bg-white rounded-lg p-4">
                        <h4 class="font-semibold text-gray-900 mb-3">What if I had more time to invest?</h4>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm text-gray-600 mb-1">Extra hours per week:</label>
                                <input type="range" id="scenario-extra-time" min="1" max="10" value="2"
                                       class="w-full" oninput="this.nextElementSibling.textContent = this.value + ' hrs'">
                                <span class="text-sm font-semibold text-indigo-600">2 hrs</span>
                            </div>
                            <button id="run-time-scenario-btn" class="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                                Calculate Impact
                            </button>
                        </div>
                        <div id="time-scenario-results" class="mt-4 hidden"></div>
                    </div>

                    <!-- Prioritization Scenario -->
                    <div class="bg-white rounded-lg p-4">
                        <h4 class="font-semibold text-gray-900 mb-3">What if I prioritize differently?</h4>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm text-gray-600 mb-2">Start with:</label>
                                <select id="scenario-priority-area" class="w-full p-2 border-2 border-gray-300 rounded-lg">
                                    ${this.results.recommendations.map((rec, idx) => `
                                        <option value="${idx}">${rec.name}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <button id="run-priority-scenario-btn" class="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors">
                                Show Impact Path
                            </button>
                        </div>
                        <div id="priority-scenario-results" class="mt-4 hidden"></div>
                    </div>
                </div>

                <!-- Scenario Results Comparison -->
                <div id="scenario-comparison" class="mt-6 hidden">
                    <h4 class="font-semibold text-gray-900 mb-3">📊 Scenario Comparison</h4>
                    <div class="bg-white rounded-lg p-4">
                        <canvas id="scenario-comparison-chart"></canvas>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Interactive Recommendations with Drill-Down
     */
    renderInteractiveRecommendations() {
        const recommendations = this.getFilteredRecommendations();

        return `
            <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-900">
                        💼 Your AI Opportunities
                        <span class="text-sm font-normal text-gray-600">(${recommendations.length} shown)</span>
                    </h3>
                    <div class="flex gap-2">
                        <button id="expand-all-btn" class="text-sm text-indigo-600 hover:text-indigo-800">
                            Expand All
                        </button>
                        <span class="text-gray-400">|</span>
                        <button id="collapse-all-btn" class="text-sm text-indigo-600 hover:text-indigo-800">
                            Collapse All
                        </button>
                    </div>
                </div>

                <div id="recommendations-container" class="space-y-4">
                    ${recommendations.length > 0 ?
                        recommendations.map((rec, idx) => this.renderDrillDownRecommendation(rec, idx)).join('') :
                        '<div class="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center"><p class="text-yellow-800">No recommendations match your current filters. Try adjusting the filters above.</p></div>'
                    }
                </div>
            </div>
        `;
    }

    /**
     * Render a single recommendation with drill-down capability
     */
    renderDrillDownRecommendation(rec, index) {
        const priorityColors = {
            critical: 'red',
            high: 'orange',
            medium: 'yellow',
            low: 'blue'
        };
        const color = priorityColors[rec.priority] || 'gray';

        return `
            <div class="recommendation-card border-2 border-gray-200 rounded-xl transition-all hover:shadow-lg" data-rec-index="${index}">
                <!-- Summary View (Always Visible) -->
                <div class="p-6 cursor-pointer" onclick="window.toggleRecDetails(${index})">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-2">
                                <span class="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full font-bold">
                                    ${index + 1}
                                </span>
                                <h4 class="text-lg font-bold text-gray-900">${rec.name}</h4>
                                <span class="px-3 py-1 bg-${color}-100 text-${color}-700 rounded-full text-xs font-semibold">
                                    ${rec.priority.toUpperCase()}
                                </span>
                            </div>
                            <div class="flex items-center gap-6 text-sm text-gray-600 ml-11">
                                <div>
                                    <span class="font-semibold">Current:</span> ${rec.hours} hrs/week
                                </div>
                                <div>
                                    <span class="font-semibold text-green-600">Save:</span> ${rec.savings.toFixed(1)} hrs/week
                                </div>
                                <div>
                                    <span class="font-semibold">ROI:</span> ${((rec.savings / rec.hours) * 100).toFixed(0)}%
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col items-end gap-2">
                            <button class="text-indigo-600 hover:text-indigo-800 transition-colors">
                                <svg class="w-6 h-6 expand-icon-${index}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Detailed View (Expandable) -->
                <div id="rec-details-${index}" class="rec-details hidden border-t-2 border-gray-200 bg-gray-50 p-6">
                    <div class="grid md:grid-cols-2 gap-6">
                        <!-- Time Breakdown -->
                        <div>
                            <h5 class="font-semibold text-gray-900 mb-3">⏱️ Time Breakdown</h5>
                            <div class="bg-white rounded-lg p-4 space-y-2">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Current Time:</span>
                                    <span class="font-semibold">${rec.hours} hrs/week</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">With AI:</span>
                                    <span class="font-semibold">${(rec.hours - rec.savings).toFixed(1)} hrs/week</span>
                                </div>
                                <div class="flex justify-between text-green-600">
                                    <span class="font-semibold">Time Saved:</span>
                                    <span class="font-bold">${rec.savings.toFixed(1)} hrs/week</span>
                                </div>
                                ${rec.confidenceInterval ? `
                                    <div class="pt-2 border-t border-gray-200 text-xs text-gray-500">
                                        Range: ${rec.confidenceInterval.low.toFixed(1)}-${rec.confidenceInterval.high.toFixed(1)} hrs/week
                                        (${rec.confidenceInterval.confidence}% confidence)
                                    </div>
                                ` : ''}
                            </div>
                        </div>

                        <!-- AI Tools -->
                        <div>
                            <h5 class="font-semibold text-gray-900 mb-3">🤖 Recommended AI Tools</h5>
                            <div class="bg-white rounded-lg p-4">
                                <div class="flex flex-wrap gap-2">
                                    ${rec.tools.map(tool => `
                                        <span class="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                                            ${tool}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Implementation Timeline -->
                        <div>
                            <h5 class="font-semibold text-gray-900 mb-3">📅 Implementation Timeline</h5>
                            <div class="bg-white rounded-lg p-4">
                                ${this.generateImplementationTimeline(rec)}
                            </div>
                        </div>
                    </div>

                    <!-- Success Metrics -->
                    <div class="mt-6">
                        <h5 class="font-semibold text-gray-900 mb-3">📈 Success Metrics</h5>
                        <div class="bg-white rounded-lg p-4">
                            <div class="grid md:grid-cols-3 gap-4">
                                <div class="text-center p-3 bg-green-50 rounded-lg">
                                    <div class="text-2xl font-bold text-green-600">${rec.savings.toFixed(1)}hrs</div>
                                    <div class="text-xs text-gray-600">Weekly Time Saved</div>
                                </div>
                                <div class="text-center p-3 bg-blue-50 rounded-lg">
                                    <div class="text-2xl font-bold text-blue-600">${((rec.savings / rec.hours) * 100).toFixed(0)}%</div>
                                    <div class="text-xs text-gray-600">Efficiency Gain</div>
                                </div>
                                <div class="text-center p-3 bg-purple-50 rounded-lg">
                                    <div class="text-2xl font-bold text-purple-600">${Math.round(rec.savings * 52 / 8)}</div>
                                    <div class="text-xs text-gray-600">Work Days Saved/Year</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate implementation timeline
     */
    generateImplementationTimeline(rec) {
        const estimatedDays = this.estimateImplementationDays(rec);
        const phases = [
            { name: 'Setup & Training', duration: Math.ceil(estimatedDays * 0.3), icon: '📚' },
            { name: 'Pilot Testing', duration: Math.ceil(estimatedDays * 0.3), icon: '🧪' },
            { name: 'Full Implementation', duration: Math.ceil(estimatedDays * 0.4), icon: '🚀' }
        ];

        return `
            <div class="space-y-2">
                ${phases.map((phase, idx) => `
                    <div class="flex items-center gap-3">
                        <span class="text-xl">${phase.icon}</span>
                        <div class="flex-1">
                            <div class="flex justify-between text-sm mb-1">
                                <span class="font-medium text-gray-700">${phase.name}</span>
                                <span class="text-gray-500">${phase.duration} days</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-indigo-600 h-2 rounded-full" style="width: ${(phase.duration / estimatedDays) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                `).join('')}
                <div class="pt-2 border-t border-gray-200 text-center">
                    <span class="text-sm font-semibold text-gray-700">Total: ${estimatedDays} days to full implementation</span>
                </div>
            </div>
        `;
    }

    /**
     * Estimate implementation days based on complexity
     */
    estimateImplementationDays(rec) {
        const baseDays = 7; // Base 1 week
        const complexityMultiplier = rec.hours > 10 ? 2 : rec.hours > 5 ? 1.5 : 1;
        const toolsMultiplier = 1 + (rec.tools.length * 0.15);

        return Math.ceil(baseDays * complexityMultiplier * toolsMultiplier);
    }

    /**
     * Visual Analytics Section
     */
    renderVisualAnalytics() {
        return `
            <div class="bg-white rounded-xl shadow-md p-6 mb-6">
                <h3 class="text-xl font-bold text-gray-900 mb-6">📊 Visual Analytics</h3>

                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Time Flow Sankey Diagram -->
                    <div>
                        <h4 class="font-semibold text-gray-700 mb-3">Time Flow Analysis</h4>
                        <div class="bg-gray-50 rounded-lg p-4 h-64">
                            ${this.renderTimeFlowDiagram()}
                        </div>
                        <p class="text-xs text-gray-500 mt-2">Shows how time flows from current state to AI-assisted state</p>
                    </div>

                    <!-- Time Waste Heatmap -->
                    <div>
                        <h4 class="font-semibold text-gray-700 mb-3">Time Waste Heatmap</h4>
                        <div class="bg-gray-50 rounded-lg p-4 h-64">
                            ${this.renderTimeWasteHeatmap()}
                        </div>
                        <p class="text-xs text-gray-500 mt-2">Highlights areas where most time is currently wasted</p>
                    </div>

                    <!-- Benchmark Progress Bars -->
                    <div>
                        <h4 class="font-semibold text-gray-700 mb-3">Benchmark Comparison</h4>
                        <div class="bg-gray-50 rounded-lg p-4">
                            ${this.renderBenchmarkBars()}
                        </div>
                    </div>

                    <!-- 30-Day Timeline -->
                    <div>
                        <h4 class="font-semibold text-gray-700 mb-3">30-Day Implementation Timeline</h4>
                        <div class="bg-gray-50 rounded-lg p-4">
                            ${this.render30DayTimeline()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render Time Flow Diagram (HTML/CSS-based)
     */
    renderTimeFlowDiagram() {
        const recs = this.results.recommendations.slice(0, 3);
        const totalCurrent = recs.reduce((sum, rec) => sum + rec.hours, 0);
        const totalSaved = recs.reduce((sum, rec) => sum + rec.savings, 0);
        const totalAfter = totalCurrent - totalSaved;

        return `
            <div class="h-full flex flex-col justify-center space-y-4">
                <!-- Current State -->
                <div class="flex items-center">
                    <div class="w-24 text-xs font-semibold text-gray-600">Current</div>
                    <div class="flex-1 bg-red-200 rounded-lg h-8 flex items-center px-3 relative">
                        <span class="text-xs font-bold text-red-800">${totalCurrent.toFixed(1)} hrs/week</span>
                    </div>
                </div>

                <!-- Flow Arrow -->
                <div class="flex items-center">
                    <div class="w-24"></div>
                    <div class="flex-1 flex items-center">
                        <div class="flex-1 border-t-2 border-dashed border-indigo-300"></div>
                        <svg class="text-indigo-500" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4l-8 8h6v8h4v-8h6z"/>
                        </svg>
                        <div class="flex-1 border-t-2 border-dashed border-indigo-300"></div>
                    </div>
                </div>

                <!-- Saved Time -->
                <div class="flex items-center">
                    <div class="w-24 text-xs font-semibold text-gray-600">AI Saves</div>
                    <div class="flex-1 bg-green-200 rounded-lg h-8 flex items-center px-3 relative">
                        <span class="text-xs font-bold text-green-800">${totalSaved.toFixed(1)} hrs/week</span>
                    </div>
                </div>

                <!-- Flow Arrow -->
                <div class="flex items-center">
                    <div class="w-24"></div>
                    <div class="flex-1 flex items-center">
                        <div class="flex-1 border-t-2 border-dashed border-green-300"></div>
                        <svg class="text-green-500" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4l-8 8h6v8h4v-8h6z"/>
                        </svg>
                        <div class="flex-1 border-t-2 border-dashed border-green-300"></div>
                    </div>
                </div>

                <!-- After State -->
                <div class="flex items-center">
                    <div class="w-24 text-xs font-semibold text-gray-600">After AI</div>
                    <div class="flex-1 bg-blue-200 rounded-lg h-8 flex items-center px-3 relative">
                        <span class="text-xs font-bold text-blue-800">${totalAfter.toFixed(1)} hrs/week</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render Time Waste Heatmap (HTML/CSS-based)
     */
    renderTimeWasteHeatmap() {
        const recs = this.results.recommendations.slice(0, 6);

        // Calculate intensity based on hours (for color coding)
        const maxHours = Math.max(...recs.map(r => r.hours));

        return `
            <div class="h-full grid grid-cols-3 gap-2">
                ${recs.map(rec => {
                    const intensity = Math.round((rec.hours / maxHours) * 100);
                    let bgColor = 'bg-green-100 border-green-300';
                    let textColor = 'text-green-800';

                    if (intensity > 66) {
                        bgColor = 'bg-red-100 border-red-300';
                        textColor = 'text-red-800';
                    } else if (intensity > 33) {
                        bgColor = 'bg-yellow-100 border-yellow-300';
                        textColor = 'text-yellow-800';
                    }

                    return `
                        <div class="${bgColor} border-2 rounded-lg p-2 flex flex-col items-center justify-center text-center">
                            <div class="text-xs font-semibold ${textColor} mb-1">${rec.name.substring(0, 20)}${rec.name.length > 20 ? '...' : ''}</div>
                            <div class="text-lg font-bold ${textColor}">${rec.hours}</div>
                            <div class="text-xs ${textColor}">hrs/wk</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * Render benchmark comparison bars
     */
    renderBenchmarkBars() {
        const userSavings = this.results.totalTimeSaved;
        const benchmarks = [
            { label: 'Industry Average', value: 8, percentile: '50th' },
            { label: 'Above Average', value: 12, percentile: '60th' },
            { label: 'Top Performers', value: 18, percentile: '75th' },
            { label: 'Elite Level', value: 25, percentile: '90th' }
        ];

        return `
            <div class="space-y-3">
                ${benchmarks.map(benchmark => {
                    const percentage = Math.min(100, (userSavings / benchmark.value) * 100);
                    const isAchieved = userSavings >= benchmark.value;

                    return `
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="font-medium text-gray-700">${benchmark.label}</span>
                                <span class="text-xs ${isAchieved ? 'text-green-600 font-semibold' : 'text-gray-500'}">
                                    ${benchmark.value} hrs/week (${benchmark.percentile})
                                    ${isAchieved ? ' ✓' : ''}
                                </span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="h-3 rounded-full transition-all ${isAchieved ? 'bg-green-500' : 'bg-indigo-500'}"
                                     style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * Render 30-day timeline
     */
    render30DayTimeline() {
        const weeks = [
            { week: 1, focus: 'Setup & Exploration', tasks: 3, color: 'indigo' },
            { week: 2, focus: 'Pilot Implementation', tasks: 4, color: 'purple' },
            { week: 3, focus: 'Scale & Optimize', tasks: 5, color: 'pink' },
            { week: 4, focus: 'Measure & Iterate', tasks: 3, color: 'green' }
        ];

        return `
            <div class="space-y-3">
                ${weeks.map((week, idx) => `
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 flex items-center justify-center bg-${week.color}-100 text-${week.color}-700 rounded-lg font-bold">
                            W${week.week}
                        </div>
                        <div class="flex-1">
                            <div class="font-medium text-gray-900">${week.focus}</div>
                            <div class="text-xs text-gray-500">${week.tasks} key tasks</div>
                        </div>
                        <button class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                                onclick="window.showWeekDetails(${week.week})">
                            View Details
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Get filtered recommendations based on current filter settings
     */
    getFilteredRecommendations() {
        let recommendations = [...this.results.recommendations];

        // Apply priority filter
        if (this.filters.priority !== 'all') {
            recommendations = recommendations.filter(rec => rec.priority === this.filters.priority);
        }

        // Apply ROI threshold filter
        if (this.filters.roiThreshold > 0) {
            recommendations = recommendations.filter(rec => rec.savings >= this.filters.roiThreshold);
        }

        // Apply implementation time filter
        if (this.filters.implementationTime !== 'all') {
            recommendations = recommendations.filter(rec => {
                const estimatedDays = this.estimateImplementationDays(rec);
                if (this.filters.implementationTime === 'quick') return estimatedDays <= 7;
                if (this.filters.implementationTime === 'medium') return estimatedDays > 7 && estimatedDays <= 28;
                if (this.filters.implementationTime === 'long') return estimatedDays > 28;
                return true;
            });
        }

        // Apply sorting
        recommendations.sort((a, b) => {
            let compareA, compareB;

            switch (this.sortBy) {
                case 'savings':
                    compareA = a.savings;
                    compareB = b.savings;
                    break;
                case 'priority':
                    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                    compareA = priorityOrder[a.priority];
                    compareB = priorityOrder[b.priority];
                    break;
                case 'roi':
                    compareA = (a.savings / a.hours) * 100;
                    compareB = (b.savings / b.hours) * 100;
                    break;
                case 'name':
                    compareA = a.name.toLowerCase();
                    compareB = b.name.toLowerCase();
                    break;
                default:
                    return 0;
            }

            if (this.sortOrder === 'desc') {
                return compareB > compareA ? 1 : compareB < compareA ? -1 : 0;
            } else {
                return compareA > compareB ? 1 : compareA < compareB ? -1 : 0;
            }
        });

        return recommendations;
    }

    /**
     * Attach event listeners for interactive features
     */
    attachEventListeners() {
        // Filter controls
        document.getElementById('filter-priority')?.addEventListener('change', (e) => {
            this.filters.priority = e.target.value;
            this.refreshRecommendations();
        });

        document.getElementById('filter-implementation-time')?.addEventListener('change', (e) => {
            this.filters.implementationTime = e.target.value;
            this.refreshRecommendations();
        });

        document.getElementById('filter-roi-threshold')?.addEventListener('input', (e) => {
            this.filters.roiThreshold = parseFloat(e.target.value) || 0;
            this.refreshRecommendations();
        });

        document.getElementById('sort-by')?.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.refreshRecommendations();
        });

        document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
            this.resetFilters();
        });

        // Scenario analysis
        document.getElementById('run-time-scenario-btn')?.addEventListener('click', () => {
            this.runTimeScenario();
        });

        document.getElementById('run-priority-scenario-btn')?.addEventListener('click', () => {
            this.runPriorityScenario();
        });

        // Expand/Collapse all
        document.getElementById('expand-all-btn')?.addEventListener('click', () => {
            this.expandAll();
        });

        document.getElementById('collapse-all-btn')?.addEventListener('click', () => {
            this.collapseAll();
        });
    }

    /**
     * Refresh recommendations display
     */
    refreshRecommendations() {
        const container = document.getElementById('recommendations-container');
        if (!container) return;

        const recommendations = this.getFilteredRecommendations();
        container.innerHTML = recommendations.length > 0 ?
            recommendations.map((rec, idx) => this.renderDrillDownRecommendation(rec, idx)).join('') :
            '<div class="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center"><p class="text-yellow-800">No recommendations match your current filters. Try adjusting the filters above.</p></div>';

        this.updateFilterSummary();
    }

    /**
     * Update filter summary badges
     */
    updateFilterSummary() {
        const summary = document.getElementById('filter-summary');
        if (!summary) return;

        const badges = [];

        if (this.filters.priority !== 'all') {
            badges.push(`Priority: ${this.filters.priority}`);
        }
        if (this.filters.implementationTime !== 'all') {
            badges.push(`Time: ${this.filters.implementationTime}`);
        }
        if (this.filters.roiThreshold > 0) {
            badges.push(`Min ${this.filters.roiThreshold} hrs/week`);
        }

        summary.innerHTML = badges.length > 0 ?
            `<span class="text-sm text-gray-600 mr-2">Active filters:</span>` +
            badges.map(badge => `<span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">${badge}</span>`).join('') :
            '';
    }

    /**
     * Reset all filters
     */
    resetFilters() {
        this.filters = {
            priority: 'all',
            implementationTime: 'all',
            roiThreshold: 0
        };
        this.sortBy = 'savings';
        this.sortOrder = 'desc';

        document.getElementById('filter-priority').value = 'all';
        document.getElementById('filter-implementation-time').value = 'all';
        document.getElementById('filter-roi-threshold').value = '0';
        document.getElementById('sort-by').value = 'savings';

        this.refreshRecommendations();
    }

    /**
     * Run time investment scenario
     */
    runTimeScenario() {
        const extraHours = parseFloat(document.getElementById('scenario-extra-time').value);
        const results = document.getElementById('time-scenario-results');

        const totalSavings = this.results.totalTimeSaved;
        const withExtraTime = totalSavings + (extraHours * 0.75); // 75% efficiency assumption

        results.innerHTML = `
            <div class="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <h5 class="font-semibold text-green-900 mb-2">💡 Scenario Results</h5>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-700">Current AI Savings:</span>
                        <span class="font-semibold">${totalSavings.toFixed(1)} hrs/week</span>
                    </div>
                    <div class="flex justify-between text-green-700">
                        <span class="font-semibold">With ${extraHours} extra hrs invested:</span>
                        <span class="font-bold">${withExtraTime.toFixed(1)} hrs/week</span>
                    </div>
                    <div class="pt-2 border-t border-green-300">
                        <p class="text-xs text-gray-600">
                            Investing ${extraHours} extra hours upfront could boost your weekly savings by
                            <span class="font-semibold">${(withExtraTime - totalSavings).toFixed(1)} hrs/week</span>
                            (${Math.round(((withExtraTime - totalSavings) / totalSavings) * 100)}% increase)
                        </p>
                    </div>
                </div>
            </div>
        `;
        results.classList.remove('hidden');
    }

    /**
     * Run priority scenario
     */
    runPriorityScenario() {
        const selectedIndex = parseInt(document.getElementById('scenario-priority-area').value);
        const selectedRec = this.results.recommendations[selectedIndex];
        const results = document.getElementById('priority-scenario-results');

        const impactPath = this.calculateImpactPath(selectedRec);

        results.innerHTML = `
            <div class="p-4 bg-pink-50 border-2 border-pink-200 rounded-lg">
                <h5 class="font-semibold text-pink-900 mb-2">🎯 Impact Path</h5>
                <div class="space-y-2 text-sm">
                    <div class="font-medium text-gray-900">Starting with: ${selectedRec.name}</div>
                    <div class="space-y-1 mt-3">
                        ${impactPath.map((phase, idx) => `
                            <div class="flex items-center gap-2">
                                <span class="w-6 h-6 flex items-center justify-center bg-pink-600 text-white rounded-full text-xs font-bold">
                                    ${idx + 1}
                                </span>
                                <span class="text-gray-700">${phase.action} → <span class="font-semibold text-pink-700">${phase.impact}</span></span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        results.classList.remove('hidden');
    }

    /**
     * Calculate impact path for prioritization scenario
     */
    calculateImpactPath(startingRec) {
        return [
            {
                action: `Implement ${startingRec.name}`,
                impact: `Save ${startingRec.savings.toFixed(1)} hrs/week`
            },
            {
                action: 'Use saved time to learn next tool',
                impact: '50% faster implementation'
            },
            {
                action: 'Apply learnings to other areas',
                impact: 'Compound savings effect'
            },
            {
                action: 'Reach full optimization',
                impact: `${Math.round(this.results.totalTimeSaved * 1.2)} hrs/week total`
            }
        ];
    }

    /**
     * Expand all recommendations
     */
    expandAll() {
        this.results.recommendations.forEach((rec, idx) => {
            const details = document.getElementById(`rec-details-${idx}`);
            const icon = document.querySelector(`.expand-icon-${idx}`);
            if (details) {
                details.classList.remove('hidden');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    }

    /**
     * Collapse all recommendations
     */
    collapseAll() {
        this.results.recommendations.forEach((rec, idx) => {
            const details = document.getElementById(`rec-details-${idx}`);
            const icon = document.querySelector(`.expand-icon-${idx}`);
            if (details) {
                details.classList.add('hidden');
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        });
    }
}

/**
 * Global helper functions for onclick handlers
 */
window.toggleRecDetails = function(index) {
    const details = document.getElementById(`rec-details-${index}`);
    const icon = document.querySelector(`.expand-icon-${index}`);

    if (details) {
        details.classList.toggle('hidden');
        if (icon) {
            const isExpanded = !details.classList.contains('hidden');
            icon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    }
};

window.showWeekDetails = function(weekNumber) {
    alert(`Week ${weekNumber} detailed plan coming soon!`);
};
