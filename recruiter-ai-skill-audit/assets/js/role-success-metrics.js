/**
 * Role-Specific Success Metrics
 * Tracks KPIs that matter to each specific role
 * Provides before/after AI comparisons
 */

class RoleSuccessMetrics {
    constructor() {
        this.metricDefinitions = this.initializeMetricDefinitions();
        this.industryBenchmarks = this.initializeIndustryBenchmarks();
    }

    /**
     * Initialize metric definitions for each business unit
     */
    initializeMetricDefinitions() {
        return {
            sourcing: {
                profiles_reviewed_per_hour: {
                    id: 'profiles_reviewed_per_hour',
                    name: 'Profiles Reviewed per Hour',
                    icon: '📊',
                    unit: 'profiles/hr',
                    higherIsBetter: true,
                    description: 'How many candidate profiles you can review in an hour',
                    calculation: (answers) => {
                        const profilesPerWeek = parseFloat(answers.sourcing_profiles_per_week) || 0;
                        const hoursPerWeek = parseFloat(answers.sourcing_review_hours) || 1;
                        return profilesPerWeek / hoursPerWeek;
                    },
                    withAI: (current) => current * 4.5, // 350% increase
                    improvement: 'AI resume screeners can review 350% more profiles'
                },
                response_rate: {
                    id: 'response_rate',
                    name: 'Candidate Response Rate',
                    icon: '💬',
                    unit: '%',
                    higherIsBetter: true,
                    description: 'Percentage of candidates who respond to your outreach',
                    calculation: (answers) => {
                        return parseFloat(answers.sourcing_response_rate) || 15;
                    },
                    withAI: (current) => Math.min(current * 2.3, 95), // 130% increase, cap at 95%
                    improvement: 'AI personalization increases response rates by 130%'
                },
                time_to_first_submission: {
                    id: 'time_to_first_submission',
                    name: 'Time to First Candidate Submission',
                    icon: '⏱️',
                    unit: 'days',
                    higherIsBetter: false,
                    description: 'Average days from req opening to first qualified candidate submitted',
                    calculation: (answers) => {
                        return parseFloat(answers.sourcing_time_to_submit) || 3.5;
                    },
                    withAI: (current) => current * 0.25, // 75% reduction
                    improvement: 'AI sourcing reduces time-to-submit by 75%'
                },
                quality_of_hire: {
                    id: 'quality_of_hire',
                    name: 'Candidate Pass-Through Rate',
                    icon: '✅',
                    unit: '%',
                    higherIsBetter: true,
                    description: 'Percentage of submitted candidates that pass initial screening',
                    calculation: (answers) => {
                        return parseFloat(answers.sourcing_passthrough_rate) || 60;
                    },
                    withAI: (current) => Math.min(current * 1.4, 95), // 40% increase
                    improvement: 'AI skills matching improves candidate quality by 40%'
                }
            },

            scheduling: {
                reschedule_rate: {
                    id: 'reschedule_rate',
                    name: 'Interview Reschedule Rate',
                    icon: '🔄',
                    unit: '%',
                    higherIsBetter: false,
                    description: 'Percentage of interviews that need rescheduling',
                    calculation: (answers) => {
                        const interviewsPerWeek = parseFloat(answers.scheduling_interviews_per_week) || 10;
                        const reschedulesPerWeek = parseFloat(answers.scheduling_reschedules_per_week) || 3;
                        return (reschedulesPerWeek / interviewsPerWeek) * 100;
                    },
                    withAI: (current) => current * 0.35, // 65% reduction
                    improvement: 'AI scheduling reduces reschedules by 65%'
                },
                time_to_schedule: {
                    id: 'time_to_schedule',
                    name: 'Average Time to Schedule Interview',
                    icon: '⏰',
                    unit: 'hours',
                    higherIsBetter: false,
                    description: 'Hours from interview request to confirmed interview slot',
                    calculation: (answers) => {
                        return parseFloat(answers.scheduling_avg_time_to_schedule) || 48;
                    },
                    withAI: (current) => current * 0.08, // 92% reduction (instant scheduling)
                    improvement: 'AI self-scheduling reduces time from 48hrs to 4hrs'
                },
                no_show_rate: {
                    id: 'no_show_rate',
                    name: 'Candidate No-Show Rate',
                    icon: '👻',
                    unit: '%',
                    higherIsBetter: false,
                    description: 'Percentage of candidates who don\'t show up for interviews',
                    calculation: (answers) => {
                        return parseFloat(answers.scheduling_no_show_rate) || 8;
                    },
                    withAI: (current) => current * 0.4, // 60% reduction
                    improvement: 'AI reminders and confirmations reduce no-shows by 60%'
                },
                calendar_utilization: {
                    id: 'calendar_utilization',
                    name: 'Interview Slot Utilization',
                    icon: '📅',
                    unit: '%',
                    higherIsBetter: true,
                    description: 'Percentage of available interview slots actually used',
                    calculation: (answers) => {
                        return parseFloat(answers.scheduling_calendar_utilization) || 65;
                    },
                    withAI: (current) => Math.min(current * 1.35, 95), // 35% increase
                    improvement: 'AI optimization improves calendar utilization by 35%'
                }
            },

            compliance: {
                audit_readiness_score: {
                    id: 'audit_readiness_score',
                    name: 'Audit Readiness Score',
                    icon: '📋',
                    unit: '%',
                    higherIsBetter: true,
                    description: 'Percentage of records audit-ready at any given time',
                    calculation: (answers) => {
                        return parseFloat(answers.compliance_audit_readiness) || 70;
                    },
                    withAI: (current) => 100, // Always 100% with AI
                    improvement: 'AI ensures 100% audit readiness at all times'
                },
                policy_violation_detection: {
                    id: 'policy_violation_detection',
                    name: 'Policy Violation Detection Rate',
                    icon: '🔍',
                    unit: '%',
                    higherIsBetter: true,
                    description: 'Percentage of policy violations caught before they become issues',
                    calculation: (answers) => {
                        return parseFloat(answers.compliance_detection_rate) || 60;
                    },
                    withAI: (current) => Math.min(current * 1.5, 98), // 50% increase
                    improvement: 'AI monitoring catches violations 50% more effectively'
                },
                avg_time_to_resolve: {
                    id: 'avg_time_to_resolve',
                    name: 'Average Time to Resolve Issues',
                    icon: '⚡',
                    unit: 'hours',
                    higherIsBetter: false,
                    description: 'Average hours to investigate and resolve compliance issues',
                    calculation: (answers) => {
                        return parseFloat(answers.compliance_resolution_time) || 12;
                    },
                    withAI: (current) => current * 0.3, // 70% reduction
                    improvement: 'AI root cause analysis resolves issues 70% faster'
                },
                documentation_completeness: {
                    id: 'documentation_completeness',
                    name: 'Documentation Completeness',
                    icon: '📄',
                    unit: '%',
                    higherIsBetter: true,
                    description: 'Percentage of records with complete documentation',
                    calculation: (answers) => {
                        return parseFloat(answers.compliance_doc_completeness) || 85;
                    },
                    withAI: (current) => 100, // Always 100% with AI
                    improvement: 'AI auto-documentation ensures 100% completeness'
                }
            },

            contracts: {
                turnaround_time_per_contract: {
                    id: 'turnaround_time_per_contract',
                    name: 'Contract Turnaround Time',
                    icon: '⏱️',
                    unit: 'hours',
                    higherIsBetter: false,
                    description: 'Average hours from draft to signed contract',
                    calculation: (answers) => {
                        return parseFloat(answers.contracts_avg_turnaround) || 72;
                    },
                    withAI: (current) => current * 0.1, // 90% reduction
                    improvement: 'AI automation reduces contract time from 72hrs to 7hrs'
                },
                redline_cycles: {
                    id: 'redline_cycles',
                    name: 'Average Redline Cycles',
                    icon: '🔄',
                    unit: 'cycles',
                    higherIsBetter: false,
                    description: 'Average number of redline rounds per contract',
                    calculation: (answers) => {
                        return parseFloat(answers.contracts_avg_redlines) || 4.5;
                    },
                    withAI: (current) => current * 0.4, // 60% reduction
                    improvement: 'AI clause suggestions reduce redlines by 60%'
                },
                contract_error_rate: {
                    id: 'contract_error_rate',
                    name: 'Contract Error Rate',
                    icon: '❌',
                    unit: '%',
                    higherIsBetter: false,
                    description: 'Percentage of contracts with errors requiring revision',
                    calculation: (answers) => {
                        return parseFloat(answers.contracts_error_rate) || 12;
                    },
                    withAI: (current) => current * 0.1, // 90% reduction
                    improvement: 'AI validation reduces errors by 90%'
                },
                approval_bottlenecks: {
                    id: 'approval_bottlenecks',
                    name: 'Approval Bottleneck Time',
                    icon: '⏳',
                    unit: 'hours',
                    higherIsBetter: false,
                    description: 'Average hours contracts spend waiting for approvals',
                    calculation: (answers) => {
                        return parseFloat(answers.contracts_approval_wait) || 48;
                    },
                    withAI: (current) => current * 0.2, // 80% reduction
                    improvement: 'AI routing and auto-approval reduces wait by 80%'
                }
            },

            admin: {
                data_accuracy_score: {
                    id: 'data_accuracy_score',
                    name: 'Data Accuracy Score',
                    icon: '🎯',
                    unit: '%',
                    higherIsBetter: true,
                    description: 'Percentage of records with accurate, complete data',
                    calculation: (answers) => {
                        return parseFloat(answers.admin_data_accuracy) || 82;
                    },
                    withAI: (current) => Math.min(current * 1.17, 99), // 17% increase to ~99%
                    improvement: 'AI validation ensures 99% data accuracy'
                },
                report_generation_time: {
                    id: 'report_generation_time',
                    name: 'Report Generation Time',
                    icon: '📊',
                    unit: 'hours',
                    higherIsBetter: false,
                    description: 'Average hours to create a standard report',
                    calculation: (answers) => {
                        return parseFloat(answers.admin_report_time) || 4;
                    },
                    withAI: (current) => current * 0.05, // 95% reduction (4hrs to 12min)
                    improvement: 'AI auto-reports reduce time from 4hrs to 12 minutes'
                },
                data_refresh_frequency: {
                    id: 'data_refresh_frequency',
                    name: 'Data Refresh Frequency',
                    icon: '🔄',
                    unit: 'per day',
                    higherIsBetter: true,
                    description: 'How many times per day data is refreshed/updated',
                    calculation: (answers) => {
                        const frequency = answers.admin_refresh_frequency;
                        const mapping = {
                            'real-time': 100,
                            'hourly': 24,
                            'daily': 1,
                            'weekly': 0.14,
                            'monthly': 0.03
                        };
                        return mapping[frequency] || 1;
                    },
                    withAI: (current) => 100, // Real-time with AI
                    improvement: 'AI enables real-time data refresh'
                },
                manual_entry_reduction: {
                    id: 'manual_entry_reduction',
                    name: 'Manual Data Entry Reduction',
                    icon: '⌨️',
                    unit: '%',
                    higherIsBetter: true,
                    description: 'Percentage of data entry eliminated through automation',
                    calculation: (answers) => {
                        return parseFloat(answers.admin_automation_level) || 20;
                    },
                    withAI: (current) => Math.min(current + 70, 95), // +70% to ~95%
                    improvement: 'AI automation eliminates 70% of manual data entry'
                }
            }
        };
    }

    /**
     * Initialize industry benchmarks for context
     */
    initializeIndustryBenchmarks() {
        return {
            sourcing: {
                profiles_reviewed_per_hour: { bottom10: 5, average: 12, top10: 35 },
                response_rate: { bottom10: 8, average: 15, top10: 32 },
                time_to_first_submission: { bottom10: 7, average: 3.5, top10: 1 },
                quality_of_hire: { bottom10: 40, average: 60, top10: 85 }
            },
            scheduling: {
                reschedule_rate: { bottom10: 45, average: 25, top10: 8 },
                time_to_schedule: { bottom10: 96, average: 48, top10: 12 },
                no_show_rate: { bottom10: 18, average: 8, top10: 2 },
                calendar_utilization: { bottom10: 45, average: 65, top10: 88 }
            },
            compliance: {
                audit_readiness_score: { bottom10: 50, average: 70, top10: 95 },
                policy_violation_detection: { bottom10: 40, average: 60, top10: 90 },
                avg_time_to_resolve: { bottom10: 24, average: 12, top10: 3 },
                documentation_completeness: { bottom10: 70, average: 85, top10: 98 }
            },
            contracts: {
                turnaround_time_per_contract: { bottom10: 120, average: 72, top10: 24 },
                redline_cycles: { bottom10: 8, average: 4.5, top10: 2 },
                contract_error_rate: { bottom10: 25, average: 12, top10: 3 },
                approval_bottlenecks: { bottom10: 96, average: 48, top10: 12 }
            },
            admin: {
                data_accuracy_score: { bottom10: 70, average: 82, top10: 96 },
                report_generation_time: { bottom10: 8, average: 4, top10: 0.5 },
                data_refresh_frequency: { bottom10: 0.14, average: 1, top10: 24 },
                manual_entry_reduction: { bottom10: 10, average: 20, top10: 80 }
            }
        };
    }

    /**
     * Calculate all metrics for a business unit
     */
    calculateMetrics(businessUnit, answers) {
        const metrics = this.metricDefinitions[businessUnit];
        if (!metrics) return null;

        const calculatedMetrics = [];

        for (const [key, metric] of Object.entries(metrics)) {
            const currentValue = metric.calculation(answers);
            const withAIValue = metric.withAI(currentValue);
            const improvement = this.calculateImprovement(currentValue, withAIValue, metric.higherIsBetter);
            const benchmark = this.industryBenchmarks[businessUnit][key];

            calculatedMetrics.push({
                ...metric,
                currentValue: Math.round(currentValue * 10) / 10,
                withAIValue: Math.round(withAIValue * 10) / 10,
                improvement,
                benchmark,
                status: this.getMetricStatus(currentValue, benchmark, metric.higherIsBetter)
            });
        }

        return {
            businessUnit,
            metrics: calculatedMetrics,
            summary: this.generateMetricsSummary(calculatedMetrics)
        };
    }

    /**
     * Calculate improvement percentage
     */
    calculateImprovement(current, withAI, higherIsBetter) {
        if (current === 0) return 0;

        if (higherIsBetter) {
            return Math.round(((withAI - current) / current) * 100);
        } else {
            return Math.round(((current - withAI) / current) * 100);
        }
    }

    /**
     * Get metric status compared to industry
     */
    getMetricStatus(value, benchmark, higherIsBetter) {
        if (!benchmark) return { level: 'unknown', label: 'No benchmark data' };

        if (higherIsBetter) {
            if (value >= benchmark.top10) return { level: 'excellent', label: 'Top 10%', color: 'green' };
            if (value >= benchmark.average) return { level: 'good', label: 'Above Average', color: 'blue' };
            if (value >= benchmark.bottom10) return { level: 'fair', label: 'Below Average', color: 'yellow' };
            return { level: 'poor', label: 'Bottom 10%', color: 'red' };
        } else {
            if (value <= benchmark.top10) return { level: 'excellent', label: 'Top 10%', color: 'green' };
            if (value <= benchmark.average) return { level: 'good', label: 'Above Average', color: 'blue' };
            if (value <= benchmark.bottom10) return { level: 'fair', label: 'Below Average', color: 'yellow' };
            return { level: 'poor', label: 'Bottom 10%', color: 'red' };
        }
    }

    /**
     * Generate metrics summary
     */
    generateMetricsSummary(metrics) {
        const avgImprovement = metrics.reduce((sum, m) => sum + m.improvement, 0) / metrics.length;
        const excellentCount = metrics.filter(m => m.status.level === 'excellent').length;
        const needsImprovementCount = metrics.filter(m => m.status.level === 'poor' || m.status.level === 'fair').length;

        return {
            avgImprovement: Math.round(avgImprovement),
            excellentMetrics: excellentCount,
            needsImprovement: needsImprovementCount,
            totalMetrics: metrics.length
        };
    }

    /**
     * Render success metrics HTML
     */
    renderSuccessMetrics(metricsData) {
        if (!metricsData || !metricsData.metrics) return '';

        const { metrics, summary } = metricsData;

        return `
            <div class="success-metrics bg-white rounded-xl shadow-lg p-6 mb-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="text-3xl">📈</div>
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">Your Success Metrics</h3>
                        <p class="text-sm text-gray-600">
                            Track KPIs that matter to your role | Avg AI Improvement: +${summary.avgImprovement}%
                        </p>
                    </div>
                </div>

                <!-- Summary Cards -->
                <div class="grid md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div class="text-2xl font-bold text-green-600">${summary.excellentMetrics}/${summary.totalMetrics}</div>
                        <div class="text-sm text-green-800">Top 10% Metrics</div>
                    </div>
                    <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div class="text-2xl font-bold text-blue-600">+${summary.avgImprovement}%</div>
                        <div class="text-sm text-blue-800">Avg AI Improvement</div>
                    </div>
                    <div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <div class="text-2xl font-bold text-orange-600">${summary.needsImprovement}</div>
                        <div class="text-sm text-orange-800">Metrics to Improve</div>
                    </div>
                </div>

                <!-- Metrics Table -->
                <div class="space-y-4">
                    ${metrics.map((metric, index) => this.renderMetricCard(metric, index + 1)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render individual metric card
     */
    renderMetricCard(metric) {
        const directionIcon = metric.higherIsBetter ? '▲' : '▼';
        const improvementColor = metric.improvement > 0 ? 'green' : 'red';

        return `
            <div class="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">${metric.icon}</span>
                        <div>
                            <div class="font-semibold text-gray-900">${metric.name}</div>
                            <div class="text-xs text-gray-600">${metric.description}</div>
                        </div>
                    </div>
                    <span class="px-3 py-1 bg-${metric.status.color}-100 text-${metric.status.color}-800 text-xs font-semibold rounded-full">
                        ${metric.status.label}
                    </span>
                </div>

                <div class="grid md:grid-cols-3 gap-4 mb-4">
                    <div class="text-center p-3 bg-gray-50 rounded-lg">
                        <div class="text-xs text-gray-600 mb-1">Current</div>
                        <div class="text-2xl font-bold text-gray-900">
                            ${metric.currentValue}${metric.unit === '%' ? '%' : ''}
                        </div>
                        ${metric.unit !== '%' ? `<div class="text-xs text-gray-600">${metric.unit}</div>` : ''}
                    </div>
                    <div class="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div class="text-xs text-green-700 mb-1">With AI</div>
                        <div class="text-2xl font-bold text-green-600">
                            ${metric.withAIValue}${metric.unit === '%' ? '%' : ''}
                        </div>
                        ${metric.unit !== '%' ? `<div class="text-xs text-green-700">${metric.unit}</div>` : ''}
                    </div>
                    <div class="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <div class="text-xs text-indigo-700 mb-1">Improvement</div>
                        <div class="text-2xl font-bold text-${improvementColor}-600">
                            ${directionIcon}${metric.improvement}%
                        </div>
                    </div>
                </div>

                ${metric.benchmark ? `
                    <div class="bg-gray-50 rounded-lg p-3 mb-3">
                        <div class="text-xs font-semibold text-gray-700 mb-2">Industry Benchmarks:</div>
                        <div class="flex items-center gap-2 text-xs">
                            <span class="text-gray-600">Bottom 10%:</span>
                            <span class="font-semibold">${metric.benchmark.bottom10}${metric.unit === '%' ? '%' : metric.unit}</span>
                            <span class="text-gray-400">|</span>
                            <span class="text-gray-600">Average:</span>
                            <span class="font-semibold">${metric.benchmark.average}${metric.unit === '%' ? '%' : metric.unit}</span>
                            <span class="text-gray-400">|</span>
                            <span class="text-gray-600">Top 10%:</span>
                            <span class="font-semibold">${metric.benchmark.top10}${metric.unit === '%' ? '%' : metric.unit}</span>
                        </div>
                    </div>
                ` : ''}

                <div class="text-sm text-indigo-700 bg-indigo-50 rounded p-2">
                    💡 ${metric.improvement}
                </div>
            </div>
        `;
    }

    /**
     * Export success metrics
     */
    exportSuccessMetrics(metricsData) {
        return {
            ...metricsData,
            exportedAt: new Date().toISOString()
        };
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.RoleSuccessMetrics = RoleSuccessMetrics;
}
