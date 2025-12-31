/**
 * Comparative Role Analysis
 * Shows how user compares to others in same role
 * Provides percentile rankings and peer insights
 */

class ComparativeRoleAnalyzer {
    constructor() {
        this.peerData = this.initializePeerData();
        this.distributionData = this.initializeDistributionData();
    }

    /**
     * Initialize peer comparison data for each business unit
     */
    initializePeerData() {
        return {
            sourcing: {
                active_roles: {
                    distribution: {
                        '1-5': 0.25,      // 25% of recruiters
                        '6-10': 0.42,     // 42%
                        '11-20': 0.28,    // 28%
                        '20+': 0.05       // 5%
                    },
                    percentileMap: {
                        '1-5': 25,
                        '6-10': 60,
                        '11-20': 85,
                        '20+': 95
                    }
                },
                hours_screening: {
                    percentiles: {
                        p10: 5,
                        p25: 8,
                        p50: 12,
                        p75: 18,
                        p90: 25
                    }
                },
                ai_adoption: {
                    none: 0.35,           // 35% not using AI
                    exploring: 0.40,      // 40% exploring
                    using: 0.20,          // 20% actively using
                    advanced: 0.05        // 5% advanced users
                }
            },

            scheduling: {
                interviews_per_week: {
                    distribution: {
                        '1-5': 0.20,
                        '6-10': 0.35,
                        '11-15': 0.25,
                        '16-25': 0.15,
                        '25+': 0.05
                    },
                    percentileMap: {
                        '1-5': 20,
                        '6-10': 50,
                        '11-15': 70,
                        '16-25': 85,
                        '25+': 95
                    }
                },
                reschedules: {
                    percentiles: {
                        p10: 2,
                        p25: 5,
                        p50: 10,
                        p75: 15,
                        p90: 22
                    }
                },
                ai_adoption: {
                    none: 0.45,
                    exploring: 0.35,
                    using: 0.15,
                    advanced: 0.05
                }
            },

            compliance: {
                weekly_hours: {
                    distribution: {
                        '<5': 0.30,
                        '5-10': 0.40,
                        '10+': 0.30
                    },
                    percentileMap: {
                        '<5': 30,
                        '5-10': 65,
                        '10+': 90
                    }
                },
                audit_frequency: {
                    percentiles: {
                        p10: 0.5,   // Issues found per audit
                        p25: 2,
                        p50: 5,
                        p75: 10,
                        p90: 18
                    }
                },
                ai_adoption: {
                    none: 0.55,
                    exploring: 0.30,
                    using: 0.12,
                    advanced: 0.03
                }
            },

            contracts: {
                contracts_per_month: {
                    distribution: {
                        '1-5': 0.35,
                        '6-10': 0.30,
                        '11-15': 0.20,
                        '16-20': 0.10,
                        '20+': 0.05
                    },
                    percentileMap: {
                        '1-5': 35,
                        '6-10': 60,
                        '11-15': 78,
                        '16-20': 88,
                        '20+': 95
                    }
                },
                turnaround_time: {
                    percentiles: {
                        p10: 24,    // hours
                        p25: 48,
                        p50: 72,
                        p75: 96,
                        p90: 120
                    }
                },
                ai_adoption: {
                    none: 0.50,
                    exploring: 0.32,
                    using: 0.14,
                    advanced: 0.04
                }
            },

            admin: {
                data_entry_hours: {
                    distribution: {
                        '<5': 0.25,
                        '5-10': 0.40,
                        '10-15': 0.25,
                        '15+': 0.10
                    },
                    percentileMap: {
                        '<5': 25,
                        '5-10': 60,
                        '10-15': 82,
                        '15+': 95
                    }
                },
                reporting_hours: {
                    percentiles: {
                        p10: 1,
                        p25: 2,
                        p50: 4,
                        p75: 6,
                        p90: 10
                    }
                },
                ai_adoption: {
                    none: 0.40,
                    exploring: 0.38,
                    using: 0.18,
                    advanced: 0.04
                }
            }
        };
    }

    /**
     * Initialize distribution visualization data
     */
    initializeDistributionData() {
        return {
            sourcing: {
                time_saved_weekly: {
                    p10: 3,
                    p25: 6,
                    p50: 12,
                    p75: 20,
                    p90: 32
                }
            },
            scheduling: {
                time_saved_weekly: {
                    p10: 2,
                    p25: 4,
                    p50: 8,
                    p75: 14,
                    p90: 22
                }
            },
            compliance: {
                time_saved_weekly: {
                    p10: 2,
                    p25: 5,
                    p50: 8,
                    p75: 15,
                    p90: 25
                }
            },
            contracts: {
                time_saved_weekly: {
                    p10: 3,
                    p25: 6,
                    p50: 10,
                    p75: 18,
                    p90: 28
                }
            },
            admin: {
                time_saved_weekly: {
                    p10: 4,
                    p25: 8,
                    p50: 15,
                    p75: 25,
                    p90: 40
                }
            }
        };
    }

    /**
     * Perform comparative analysis
     */
    performComparativeAnalysis(businessUnit, answers, userMetrics) {
        const peerData = this.peerData[businessUnit];
        const distribution = this.distributionData[businessUnit];

        if (!peerData || !distribution) return null;

        // Calculate user's percentile
        const userPercentile = this.calculatePercentile(businessUnit, answers, userMetrics);

        // Get peer insights
        const peerInsights = this.generatePeerInsights(businessUnit, userPercentile, answers);

        // Get AI adoption comparison
        const aiAdoptionComparison = this.getAIAdoptionComparison(businessUnit, answers);

        // Calculate where user stands
        const standing = this.determineStanding(userPercentile);

        return {
            businessUnit,
            userPercentile,
            standing,
            peerInsights,
            aiAdoptionComparison,
            distribution,
            comparisons: this.generateComparisons(businessUnit, userMetrics)
        };
    }

    /**
     * Calculate user's percentile
     */
    calculatePercentile(businessUnit, answers, userMetrics) {
        // Use multiple factors to estimate percentile
        let percentileScore = 50; // Start at median

        // Factor 1: Workload volume
        if (businessUnit === 'sourcing') {
            const activeRoles = answers.sourcing_active_roles;
            if (activeRoles) {
                const rolePercentile = this.peerData[businessUnit].active_roles.percentileMap[activeRoles];
                if (rolePercentile) percentileScore = (percentileScore + rolePercentile) / 2;
            }
        }

        // Factor 2: AI adoption level
        const aiExperience = answers.aiexperience;
        const adoptionBonus = {
            'none': 0,
            'explored': 10,
            'using': 30,
            'advanced': 50
        }[aiExperience] || 0;

        percentileScore = Math.min(percentileScore + adoptionBonus, 95);

        // Factor 3: Efficiency (if metrics available)
        if (userMetrics && userMetrics.summary) {
            const excellentMetrics = userMetrics.summary.excellentMetrics;
            const totalMetrics = userMetrics.summary.totalMetrics;

            if (totalMetrics > 0) {
                const efficiencyBonus = (excellentMetrics / totalMetrics) * 20;
                percentileScore = (percentileScore + efficiencyBonus) / 2;
            }
        }

        return Math.round(percentileScore);
    }

    /**
     * Determine user's standing
     */
    determineStanding(percentile) {
        if (percentile >= 90) {
            return {
                level: 'top_performer',
                label: 'Top 10% Performer',
                icon: '🏆',
                color: 'yellow',
                message: 'You\'re in the top 10%! Exceptional performance.'
            };
        } else if (percentile >= 75) {
            return {
                level: 'high_performer',
                label: 'High Performer',
                icon: '⭐',
                color: 'green',
                message: 'You\'re performing well above average.'
            };
        } else if (percentile >= 50) {
            return {
                level: 'above_average',
                label: 'Above Average',
                icon: '👍',
                color: 'blue',
                message: 'You\'re performing above the median.'
            };
        } else if (percentile >= 25) {
            return {
                level: 'average',
                label: 'Average',
                icon: '📊',
                color: 'gray',
                message: 'You\'re performing at the average level.'
            };
        } else {
            return {
                level: 'developing',
                label: 'Developing',
                icon: '🌱',
                color: 'orange',
                message: 'Significant room for growth and improvement.'
            };
        }
    }

    /**
     * Generate peer insights
     */
    generatePeerInsights(businessUnit, userPercentile, answers) {
        const insights = [];

        // AI adoption insight
        const aiExperience = answers.aiexperience;
        const adoptionData = this.peerData[businessUnit].ai_adoption;

        if (aiExperience === 'none' || aiExperience === 'explored') {
            const usingPercent = Math.round((adoptionData.using + adoptionData.advanced) * 100);
            insights.push({
                type: 'adoption',
                icon: '🚀',
                message: `${usingPercent}% of your peers are actively using AI tools. You could join them!`
            });
        } else {
            const notUsingPercent = Math.round((adoptionData.none + adoptionData.exploring) * 100);
            insights.push({
                type: 'adoption',
                icon: '✅',
                message: `Great! You're ahead of ${notUsingPercent}% of peers who haven't adopted AI yet.`
            });
        }

        // Percentile-based insights
        if (userPercentile < 50) {
            insights.push({
                type: 'opportunity',
                icon: '💡',
                message: `Moving to the 75th percentile could save you an additional 5-8 hours per week.`
            });
        } else if (userPercentile >= 75) {
            insights.push({
                type: 'leadership',
                icon: '🎯',
                message: `Share your best practices! Your peers could learn from your efficiency.`
            });
        }

        // Top performers insight
        const distribution = this.distributionData[businessUnit].time_saved_weekly;
        insights.push({
            type: 'benchmark',
            icon: '📊',
            message: `Top 10% save ${distribution.p90} hrs/week while bottom 10% save only ${distribution.p10} hrs/week.`
        });

        return insights;
    }

    /**
     * Get AI adoption comparison
     */
    getAIAdoptionComparison(businessUnit, answers) {
        const aiExperience = answers.aiexperience;
        const adoptionData = this.peerData[businessUnit].ai_adoption;

        const userLevel = {
            'none': 'Not using AI',
            'explored': 'Exploring AI',
            'using': 'Actively using AI',
            'advanced': 'Advanced AI user'
        }[aiExperience] || 'Unknown';

        const percentiles = {
            'none': 35,
            'explored': 65,
            'using': 85,
            'advanced': 98
        };

        return {
            userLevel,
            userPercentile: percentiles[aiExperience] || 50,
            distribution: {
                none: Math.round(adoptionData.none * 100),
                exploring: Math.round(adoptionData.exploring * 100),
                using: Math.round(adoptionData.using * 100),
                advanced: Math.round(adoptionData.advanced * 100)
            }
        };
    }

    /**
     * Generate metric comparisons
     */
    generateComparisons(businessUnit, userMetrics) {
        if (!userMetrics || !userMetrics.metrics) return [];

        return userMetrics.metrics.map(metric => {
            const vsAverage = this.calculateVsAverage(metric);
            const vsTop10 = this.calculateVsTop10(metric);

            return {
                name: metric.name,
                current: metric.currentValue,
                withAI: metric.withAIValue,
                vsAverage,
                vsTop10
            };
        });
    }

    /**
     * Calculate vs average
     */
    calculateVsAverage(metric) {
        if (!metric.benchmark) return null;

        const current = metric.currentValue;
        const average = metric.benchmark.average;

        if (metric.higherIsBetter) {
            const diff = current - average;
            const pct = Math.round((diff / average) * 100);
            return {
                value: diff,
                percentage: pct,
                better: diff > 0
            };
        } else {
            const diff = average - current;
            const pct = Math.round((diff / average) * 100);
            return {
                value: diff,
                percentage: pct,
                better: diff > 0
            };
        }
    }

    /**
     * Calculate vs top 10%
     */
    calculateVsTop10(metric) {
        if (!metric.benchmark) return null;

        const current = metric.currentValue;
        const top10 = metric.benchmark.top10;

        if (metric.higherIsBetter) {
            const diff = current - top10;
            const pct = Math.round((diff / top10) * 100);
            return {
                value: diff,
                percentage: pct,
                better: diff >= 0
            };
        } else {
            const diff = top10 - current;
            const pct = Math.round((diff / top10) * 100);
            return {
                value: diff,
                percentage: pct,
                better: diff >= 0
            };
        }
    }

    /**
     * Render comparative analysis HTML
     */
    renderComparativeAnalysis(analysis) {
        if (!analysis) return '';

        const { userPercentile, standing, peerInsights, aiAdoptionComparison, distribution } = analysis;

        return `
            <div class="comparative-analysis bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="text-3xl">📊</div>
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">How You Compare to Your Peers</h3>
                        <p class="text-sm text-gray-600">See where you stand among ${analysis.businessUnit} professionals</p>
                    </div>
                </div>

                <!-- Standing Card -->
                <div class="bg-white rounded-xl p-6 mb-6 border-2 border-${standing.color}-300">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <span class="text-5xl">${standing.icon}</span>
                            <div>
                                <h4 class="text-2xl font-bold text-gray-900">${standing.label}</h4>
                                <p class="text-gray-700">${standing.message}</p>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="text-4xl font-bold text-${standing.color}-600">${userPercentile}th</div>
                            <div class="text-sm text-gray-600">Percentile</div>
                        </div>
                    </div>

                    <!-- Percentile Visualization -->
                    <div class="relative">
                        <div class="bg-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-emerald-400 h-6 rounded-full"></div>
                        <div class="absolute top-0 h-6 flex items-center" style="left: ${userPercentile}%;">
                            <div class="w-0.5 h-8 bg-gray-900 -translate-y-1"></div>
                            <div class="absolute -top-10 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                                You: ${userPercentile}th %ile
                            </div>
                        </div>
                        <div class="flex justify-between text-xs text-gray-600 mt-2">
                            <span>0th (Bottom)</span>
                            <span>50th (Median)</span>
                            <span>100th (Top)</span>
                        </div>
                    </div>
                </div>

                <!-- Time Savings Distribution -->
                ${distribution ? `
                    <div class="bg-white rounded-xl p-6 mb-6">
                        <h4 class="font-semibold text-gray-900 mb-4">Weekly Time Savings Distribution</h4>
                        <div class="space-y-3">
                            ${this.renderDistributionBar('Bottom 10%', distribution.time_saved_weekly.p10, 'red')}
                            ${this.renderDistributionBar('25th Percentile', distribution.time_saved_weekly.p25, 'orange')}
                            ${this.renderDistributionBar('Median (50th)', distribution.time_saved_weekly.p50, 'yellow')}
                            ${this.renderDistributionBar('75th Percentile', distribution.time_saved_weekly.p75, 'green')}
                            ${this.renderDistributionBar('Top 10%', distribution.time_saved_weekly.p90, 'emerald')}
                        </div>
                    </div>
                ` : ''}

                <!-- AI Adoption Comparison -->
                <div class="bg-white rounded-xl p-6 mb-6">
                    <h4 class="font-semibold text-gray-900 mb-4">AI Adoption Among Your Peers</h4>
                    <div class="mb-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-gray-700">Your Level: ${aiAdoptionComparison.userLevel}</span>
                            <span class="text-sm text-gray-600">${aiAdoptionComparison.userPercentile}th percentile</span>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div>
                            <div class="flex justify-between text-xs mb-1">
                                <span>Not Using AI</span>
                                <span>${aiAdoptionComparison.distribution.none}%</span>
                            </div>
                            <div class="bg-gray-200 rounded-full h-2">
                                <div class="bg-red-500 h-2 rounded-full" style="width: ${aiAdoptionComparison.distribution.none}%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs mb-1">
                                <span>Exploring AI</span>
                                <span>${aiAdoptionComparison.distribution.exploring}%</span>
                            </div>
                            <div class="bg-gray-200 rounded-full h-2">
                                <div class="bg-yellow-500 h-2 rounded-full" style="width: ${aiAdoptionComparison.distribution.exploring}%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs mb-1">
                                <span>Actively Using AI</span>
                                <span>${aiAdoptionComparison.distribution.using}%</span>
                            </div>
                            <div class="bg-gray-200 rounded-full h-2">
                                <div class="bg-green-500 h-2 rounded-full" style="width: ${aiAdoptionComparison.distribution.using}%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs mb-1">
                                <span>Advanced AI Users</span>
                                <span>${aiAdoptionComparison.distribution.advanced}%</span>
                            </div>
                            <div class="bg-gray-200 rounded-full h-2">
                                <div class="bg-emerald-600 h-2 rounded-full" style="width: ${aiAdoptionComparison.distribution.advanced}%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Peer Insights -->
                <div class="space-y-3">
                    <h4 class="font-semibold text-gray-900">Peer Insights</h4>
                    ${peerInsights.map(insight => `
                        <div class="bg-white rounded-lg p-4 border-l-4 border-indigo-500">
                            <div class="flex items-start gap-3">
                                <span class="text-2xl">${insight.icon}</span>
                                <p class="text-sm text-gray-800">${insight.message}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render distribution bar
     */
    renderDistributionBar(label, value, color) {
        const maxValue = 40; // Assume max is 40 hours for visualization
        const widthPercent = Math.min((value / maxValue) * 100, 100);

        return `
            <div>
                <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-700">${label}</span>
                    <span class="font-semibold text-gray-900">${value} hrs/week</span>
                </div>
                <div class="bg-gray-200 rounded-full h-3">
                    <div class="bg-${color}-500 h-3 rounded-full" style="width: ${widthPercent}%"></div>
                </div>
            </div>
        `;
    }

    /**
     * Export comparative analysis
     */
    exportComparativeAnalysis(analysis) {
        return {
            ...analysis,
            exportedAt: new Date().toISOString()
        };
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ComparativeRoleAnalyzer = ComparativeRoleAnalyzer;
}
