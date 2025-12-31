/**
 * Benchmarking Data System
 * Provides comparative analytics and industry benchmarks
 * Adds context to user results through peer comparisons
 */

class BenchmarkingData {
    constructor() {
        this.benchmarks = this.initializeBenchmarks();
    }

    /**
     * Initialize benchmark data
     * Based on industry research and aggregated data
     */
    initializeBenchmarks() {
        return {
            // Sourcing benchmarks
            sourcing: {
                active_roles: {
                    distribution: {
                        '1-5': 25,    // 25% of recruiters
                        '6-10': 42,   // 42% of recruiters
                        '11-20': 28,  // 28% of recruiters
                        '20+': 5      // 5% of recruiters
                    },
                    averageValue: 8.5,
                    medianValue: 7,
                    topPerformers: 15, // Top 10% handle this many
                    industry: 'Recruitment/HR'
                },
                hours_saved: {
                    beginner: { min: 5, max: 15, avg: 10 },
                    intermediate: { min: 15, max: 30, avg: 22 },
                    advanced: { min: 30, max: 50, avg: 38 },
                    expert: { min: 40, max: 70, avg: 52 }
                }
            },

            // Admin benchmarks
            admin: {
                doc_creation_hours: {
                    distribution: {
                        '<1 hour': 15,
                        '1-3 hours': 40,
                        '3-5 hours': 30,
                        '5+ hours': 15
                    },
                    averageValue: 2.8,
                    topPerformers: 5.5
                },
                hours_saved: {
                    beginner: { min: 3, max: 10, avg: 6 },
                    intermediate: { min: 8, max: 18, avg: 12 },
                    advanced: { min: 15, max: 28, avg: 20 },
                    expert: { min: 22, max: 35, avg: 28 }
                }
            },

            // Scheduling benchmarks
            scheduling: {
                interviews_per_week: {
                    distribution: {
                        '1-5': 20,
                        '6-15': 45,
                        '16-30': 25,
                        '30+': 10
                    },
                    averageValue: 12,
                    topPerformers: 25
                },
                hours_saved: {
                    beginner: { min: 2, max: 8, avg: 5 },
                    intermediate: { min: 6, max: 15, avg: 10 },
                    advanced: { min: 12, max: 25, avg: 18 },
                    expert: { min: 18, max: 35, avg: 25 }
                }
            },

            // Compliance benchmarks
            compliance: {
                hours_saved: {
                    beginner: { min: 1, max: 5, avg: 3 },
                    intermediate: { min: 4, max: 10, avg: 7 },
                    advanced: { min: 8, max: 16, avg: 12 },
                    expert: { min: 12, max: 22, avg: 16 }
                }
            },

            // Contracts benchmarks
            contracts: {
                hours_saved: {
                    beginner: { min: 2, max: 6, avg: 4 },
                    intermediate: { min: 5, max: 12, avg: 8 },
                    advanced: { min: 10, max: 20, avg: 14 },
                    expert: { min: 15, max: 28, avg: 20 }
                }
            },

            // Overall benchmarks
            overall: {
                total_hours_saved: {
                    bottom10: 8,    // 10th percentile
                    bottom25: 12,   // 25th percentile
                    median: 20,     // 50th percentile
                    top25: 32,      // 75th percentile
                    top10: 45,      // 90th percentile
                    average: 23.5
                },
                adoption_rate: {
                    noAI: 12,           // 12% not using AI
                    beginner: 38,       // 38% basic usage
                    intermediate: 32,   // 32% moderate usage
                    advanced: 14,       // 14% advanced usage
                    expert: 4           // 4% expert usage
                },
                satisfaction: {
                    noAI: 3.2,
                    beginner: 3.8,
                    intermediate: 4.3,
                    advanced: 4.6,
                    expert: 4.8
                }
            }
        };
    }

    /**
     * Calculate percentile rank
     */
    calculatePercentile(yourValue, benchmarkData) {
        const { bottom10, bottom25, median, top25, top10 } = benchmarkData;

        if (yourValue <= bottom10) return 10;
        if (yourValue <= bottom25) return 25;
        if (yourValue <= median) return 50;
        if (yourValue <= top25) return 75;
        if (yourValue <= top10) return 90;
        return 95;
    }

    /**
     * Get experience level from hours saved
     */
    getExperienceLevel(hoursSaved) {
        if (hoursSaved < 10) return 'beginner';
        if (hoursSaved < 22) return 'intermediate';
        if (hoursSaved < 38) return 'advanced';
        return 'expert';
    }

    /**
     * Generate comparison analysis
     */
    generateComparison(userResult) {
        const weeklyHours = userResult.weekly || 0;
        const percentile = this.calculatePercentile(
            weeklyHours,
            this.benchmarks.overall.total_hours_saved
        );
        const experienceLevel = this.getExperienceLevel(weeklyHours);

        return {
            yourScore: weeklyHours,
            percentile: percentile,
            experienceLevel: experienceLevel,
            average: this.benchmarks.overall.total_hours_saved.average,
            median: this.benchmarks.overall.total_hours_saved.median,
            topPerformers: this.benchmarks.overall.total_hours_saved.top10,
            comparison: {
                vsAverage: ((weeklyHours / this.benchmarks.overall.total_hours_saved.average - 1) * 100).toFixed(0),
                vsMedian: ((weeklyHours / this.benchmarks.overall.total_hours_saved.median - 1) * 100).toFixed(0),
                vsTop10: ((weeklyHours / this.benchmarks.overall.total_hours_saved.top10 - 1) * 100).toFixed(0)
            },
            benchmarkRange: this.benchmarks.sourcing.hours_saved[experienceLevel],
            performanceLevel: this.getPerformanceLevel(percentile)
        };
    }

    /**
     * Get performance level description
     */
    getPerformanceLevel(percentile) {
        if (percentile >= 90) return {
            label: 'Top Performer',
            emoji: '🏆',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
            message: "You're in the top 10%! Exceptional AI utilization."
        };
        if (percentile >= 75) return {
            label: 'High Performer',
            emoji: '⭐',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            message: "You're in the top 25%! Great use of AI tools."
        };
        if (percentile >= 50) return {
            label: 'Above Average',
            emoji: '👍',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            message: "You're above average! Good AI adoption progress."
        };
        if (percentile >= 25) return {
            label: 'Average',
            emoji: '📊',
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
            message: "You're at the average level. Room for growth!"
        };
        return {
            label: 'Getting Started',
            emoji: '🌱',
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            message: "Just getting started! Lots of opportunity ahead."
        };
    }

    /**
     * Render comparison HTML
     */
    renderComparisonHTML(comparison) {
        const perf = comparison.performanceLevel;

        return `
            <div class="benchmarking-comparison bg-white rounded-xl shadow-lg p-6 mt-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="text-3xl">📊</div>
                    <h3 class="text-xl font-bold text-gray-900">How You Compare</h3>
                </div>

                <!-- Performance Badge -->
                <div class="${perf.bgColor} border-2 border-opacity-50 rounded-xl p-4 mb-6">
                    <div class="flex items-center gap-3 mb-2">
                        <span class="text-4xl">${perf.emoji}</span>
                        <div>
                            <div class="${perf.color} font-bold text-lg">${perf.label}</div>
                            <div class="text-sm text-gray-700">${comparison.percentile}th Percentile</div>
                        </div>
                    </div>
                    <p class="text-sm ${perf.color} font-medium">${perf.message}</p>
                </div>

                <!-- Comparison Chart -->
                <div class="mb-6">
                    <h4 class="font-semibold text-gray-900 mb-3">Time Savings Distribution</h4>
                    <div class="relative">
                        <div class="flex items-center justify-between mb-2 text-xs text-gray-600">
                            <span>0 hrs</span>
                            <span>25 hrs (avg)</span>
                            <span>50 hrs</span>
                        </div>
                        <div class="relative h-12 bg-gradient-to-r from-red-100 via-yellow-100 via-green-100 to-blue-100 rounded-lg overflow-hidden">
                            <!-- Markers -->
                            <div class="absolute inset-0 flex items-center justify-between px-2">
                                ${this.renderMarker('Bottom 10%', (this.benchmarks.overall.total_hours_saved.bottom10 / 50) * 100, false)}
                                ${this.renderMarker('Average', (this.benchmarks.overall.total_hours_saved.average / 50) * 100, false)}
                                ${this.renderMarker('Top 10%', (this.benchmarks.overall.total_hours_saved.top10 / 50) * 100, false)}
                            </div>
                            <!-- Your Position -->
                            <div class="absolute top-0 bottom-0 flex items-center transition-all duration-500"
                                 style="left: ${Math.min((comparison.yourScore / 50) * 100, 98)}%">
                                <div class="relative">
                                    <div class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                        <div class="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                                            You: ${comparison.yourScore} hrs
                                        </div>
                                        <div class="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-indigo-600 mx-auto"></div>
                                    </div>
                                    <div class="w-1 h-12 bg-indigo-600 shadow-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="text-center p-3 bg-gray-50 rounded-lg">
                        <div class="text-2xl font-bold text-gray-900">${comparison.yourScore}</div>
                        <div class="text-xs text-gray-600 mt-1">Your Score</div>
                    </div>
                    <div class="text-center p-3 bg-blue-50 rounded-lg">
                        <div class="text-2xl font-bold text-blue-600">${comparison.average}</div>
                        <div class="text-xs text-gray-600 mt-1">Industry Avg</div>
                    </div>
                    <div class="text-center p-3 bg-purple-50 rounded-lg">
                        <div class="text-2xl font-bold text-purple-600">${comparison.topPerformers}</div>
                        <div class="text-xs text-gray-600 mt-1">Top 10%</div>
                    </div>
                </div>

                <!-- Comparison Details -->
                <div class="space-y-2">
                    <h4 class="font-semibold text-gray-900 mb-3">Performance Analysis</h4>

                    ${this.renderComparisonRow(
                        'vs Industry Average',
                        comparison.comparison.vsAverage,
                        comparison.average
                    )}

                    ${this.renderComparisonRow(
                        'vs Median',
                        comparison.comparison.vsMedian,
                        comparison.median
                    )}

                    ${this.renderComparisonRow(
                        'vs Top Performers',
                        comparison.comparison.vsTop10,
                        comparison.topPerformers
                    )}
                </div>

                <!-- Experience Level -->
                <div class="mt-6 pt-4 border-t border-gray-200">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700">Experience Level</span>
                        <span class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                            ${comparison.experienceLevel.charAt(0).toUpperCase() + comparison.experienceLevel.slice(1)}
                        </span>
                    </div>
                    <div class="mt-2 text-xs text-gray-600">
                        Expected range: ${comparison.benchmarkRange.min}-${comparison.benchmarkRange.max} hrs/week
                        (avg: ${comparison.benchmarkRange.avg} hrs)
                    </div>
                </div>

                <!-- Adoption Stats -->
                <div class="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
                    <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span>🌍</span>
                        <span>Industry Adoption</span>
                    </h4>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <div class="text-gray-600">Not using AI:</div>
                            <div class="font-bold text-gray-900">${this.benchmarks.overall.adoption_rate.noAI}%</div>
                        </div>
                        <div>
                            <div class="text-gray-600">Advanced users:</div>
                            <div class="font-bold text-indigo-600">${this.benchmarks.overall.adoption_rate.advanced + this.benchmarks.overall.adoption_rate.expert}%</div>
                        </div>
                    </div>
                    <p class="text-xs text-gray-600 mt-3">
                        💡 ${100 - this.benchmarks.overall.adoption_rate.noAI}% of recruiters are already using AI tools.
                        Don't get left behind!
                    </p>
                </div>
            </div>
        `;
    }

    /**
     * Render a marker on the chart
     */
    renderMarker(label, position, highlight = false) {
        return `
            <div class="absolute flex flex-col items-center" style="left: ${position}%">
                <div class="text-xs text-gray-500 whitespace-nowrap mb-1">${label}</div>
                <div class="w-px h-4 ${highlight ? 'bg-indigo-600' : 'bg-gray-400'}"></div>
            </div>
        `;
    }

    /**
     * Render comparison row
     */
    renderComparisonRow(label, percentDiff, benchmarkValue) {
        const diff = parseFloat(percentDiff);
        const isPositive = diff > 0;
        const icon = isPositive ? '▲' : diff < 0 ? '▼' : '━';
        const colorClass = isPositive ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-600';

        return `
            <div class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <span class="text-sm text-gray-700">${label}</span>
                <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-500">${benchmarkValue} hrs</span>
                    <span class="${colorClass} font-semibold text-sm flex items-center gap-1">
                        <span class="text-xs">${icon}</span>
                        <span>${Math.abs(diff)}%</span>
                    </span>
                </div>
            </div>
        `;
    }

    /**
     * Get insights based on comparison
     */
    getInsights(comparison) {
        const insights = [];

        // Performance insights
        if (comparison.percentile >= 75) {
            insights.push({
                type: 'success',
                icon: '🎉',
                message: `You're outperforming ${comparison.percentile}% of your peers! Keep up the excellent work.`
            });
        } else if (comparison.percentile < 50) {
            insights.push({
                type: 'opportunity',
                icon: '📈',
                message: `You have significant room to grow. Implementing recommended tools could move you to the top 50%.`
            });
        }

        // Gap to top performers
        const gapToTop = comparison.topPerformers - comparison.yourScore;
        if (gapToTop > 0) {
            insights.push({
                type: 'info',
                icon: '🎯',
                message: `To reach top performer status, you'd need to save an additional ${gapToTop.toFixed(1)} hours per week.`
            });
        }

        // Experience level insight
        if (comparison.yourScore > comparison.benchmarkRange.max) {
            insights.push({
                type: 'success',
                icon: '⭐',
                message: `You're exceeding the expected range for ${comparison.experienceLevel} users!`
            });
        }

        return insights;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.BenchmarkingData = BenchmarkingData;
}
