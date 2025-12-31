/**
 * Cross-Functional Pain Detector
 * Identifies workflow issues that span multiple business units
 * Provides integrated solutions for systemic problems
 */

class CrossFunctionalPainDetector {
    constructor() {
        this.crossFunctionalPatterns = this.initializeCrossFunctionalPatterns();
        this.detectionThreshold = 0.7; // 70% confidence required
    }

    /**
     * Initialize cross-functional issue patterns
     */
    initializeCrossFunctionalPatterns() {
        return [
            {
                id: 'sourcing_scheduling_handoff',
                name: 'Sourcing → Scheduling Handoff Gap',
                icon: '🔄',
                description: 'Candidates fall through the cracks between sourcing and scheduling',
                involvedUnits: ['sourcing', 'scheduling'],
                detectionRules: [
                    {
                        condition: (answers) => {
                            const candidatesPerWeek = parseFloat(answers.sourcing_candidates_per_week) || 0;
                            const interviewsPerWeek = parseFloat(answers.scheduling_interviews_per_week) || 0;

                            // If sourcing many candidates but scheduling fewer interviews, there's a gap
                            return candidatesPerWeek > 20 && interviewsPerWeek < 15 && (candidatesPerWeek - interviewsPerWeek) > 5;
                        },
                        confidence: 0.8,
                        indicator: 'High candidate volume but low interview volume'
                    },
                    {
                        condition: (answers) => {
                            // High admin time might indicate manual handoff process
                            const adminTime = parseFloat(answers.admin_coordination_time) || 0;
                            return adminTime > 5;
                        },
                        confidence: 0.6,
                        indicator: 'High coordination time suggests manual handoff'
                    }
                ],
                impact: {
                    candidatesLost: (answers) => {
                        const sourced = parseFloat(answers.sourcing_candidates_per_week) || 0;
                        const scheduled = parseFloat(answers.scheduling_interviews_per_week) || 0;
                        return Math.max(0, sourced - scheduled);
                    },
                    timeWasted: (answers) => {
                        const gap = this.impact.candidatesLost(answers);
                        return gap * 0.5; // Assume 30 mins wasted per lost candidate
                    },
                    description: 'Candidates fall through the cracks, wasting sourcing effort'
                },
                rootCauses: [
                    'Manual handoff process between recruiters and coordinators',
                    'Lack of automated status updates',
                    'No integrated workflow between sourcing and scheduling tools',
                    'Communication gaps between teams'
                ],
                integratedSolution: {
                    name: 'End-to-End Candidate Flow Automation',
                    description: 'Seamless automation from candidate sourcing to interview scheduling',
                    components: [
                        {
                            tool: 'ATS with Auto-Routing',
                            purpose: 'Automatically route qualified candidates to scheduling',
                            examples: ['Greenhouse Auto-Advance', 'Lever Workflow Automation']
                        },
                        {
                            tool: 'Integrated Self-Scheduling',
                            purpose: 'Candidates receive scheduling link instantly upon qualification',
                            examples: ['Calendly + ATS Integration', 'Goodtime + Greenhouse']
                        },
                        {
                            tool: 'Real-Time Status Sync',
                            purpose: 'Keep all stakeholders updated automatically',
                            examples: ['Slack Notifications', 'Email Automation']
                        }
                    ],
                    expectedOutcome: '100% handoff completion, 0 candidates lost'
                }
            },

            {
                id: 'contracts_compliance_risk',
                name: 'Contract → Compliance Risk Gap',
                icon: '⚠️',
                description: 'Contracts lack upfront compliance checks, leading to audit issues later',
                involvedUnits: ['contracts', 'compliance'],
                detectionRules: [
                    {
                        condition: (answers) => {
                            const contractsPerMonth = parseFloat(answers.contracts_per_month) || 0;
                            const complianceTime = parseFloat(answers.compliance_weekly_time) || 0;

                            // High contract volume + high compliance time suggests reactive compliance
                            return contractsPerMonth > 10 && complianceTime > 8;
                        },
                        confidence: 0.75,
                        indicator: 'High contract volume with high compliance workload'
                    },
                    {
                        condition: (answers) => {
                            const auditIssues = answers.compliance_audit_frequency === 'Frequently';
                            return auditIssues;
                        },
                        confidence: 0.85,
                        indicator: 'Frequent audit issues suggest preventable compliance problems'
                    }
                ],
                impact: {
                    riskExposure: 'High',
                    timeWasted: (answers) => {
                        const complianceTime = parseFloat(answers.compliance_weekly_time) || 0;
                        return complianceTime * 0.75; // 75% could be prevented with upfront checks
                    },
                    description: 'Reactive compliance creates risk and wastes time fixing preventable issues'
                },
                rootCauses: [
                    'No compliance check integrated into contract drafting workflow',
                    'Legal review happens too late in the process',
                    'Lack of automated compliance scanning',
                    'Siloed teams - contracts and compliance don\'t collaborate upfront'
                ],
                integratedSolution: {
                    name: 'Pre-Signature Compliance Automation',
                    description: 'Automated compliance checks during contract creation',
                    components: [
                        {
                            tool: 'AI Contract Compliance Scanner',
                            purpose: 'Auto-flags non-compliant clauses before signature',
                            examples: ['Ironclad Compliance', 'LawGeex', 'Kira Systems']
                        },
                        {
                            tool: 'Compliant Clause Library',
                            purpose: 'Pre-approved clauses ensure compliance by default',
                            examples: ['ContractPodAi', 'Concord']
                        },
                        {
                            tool: 'Auto-Generated Audit Trail',
                            purpose: 'Every contract creates compliance documentation automatically',
                            examples: ['DocuSign Audit Trail', 'Adobe Sign Compliance']
                        }
                    ],
                    expectedOutcome: '-75% compliance audit time, 100% compliant contracts'
                }
            },

            {
                id: 'admin_data_quality_cascade',
                name: 'Admin Data Quality → Downstream Impact',
                icon: '📊',
                description: 'Poor data quality in admin operations cascades to all other functions',
                involvedUnits: ['admin', 'sourcing', 'scheduling', 'compliance'],
                detectionRules: [
                    {
                        condition: (answers) => {
                            const dataCleanupFreq = answers.admin_data_cleanup_frequency;
                            const dataCleanupTime = parseFloat(answers.admin_data_cleanup_time) || 0;

                            // Daily cleanup + high time = data quality problems
                            return dataCleanupFreq === 'Daily' && dataCleanupTime > 3;
                        },
                        confidence: 0.8,
                        indicator: 'Frequent data cleanup suggests ongoing quality issues'
                    },
                    {
                        condition: (answers) => {
                            // High data entry time might indicate errors
                            const dataEntryTime = parseFloat(answers.admin_data_entry_time) || 0;
                            return dataEntryTime > 10;
                        },
                        confidence: 0.65,
                        indicator: 'High manual data entry correlates with errors'
                    }
                ],
                impact: {
                    cascadeEffect: [
                        'Sourcing: Duplicate candidate records, incorrect statuses',
                        'Scheduling: Wrong contact info, missed interviews',
                        'Compliance: Incomplete records, audit failures',
                        'Reporting: Inaccurate metrics, bad decisions'
                    ],
                    timeWasted: (answers) => {
                        const cleanupTime = parseFloat(answers.admin_data_cleanup_time) || 0;
                        const dataEntryTime = parseFloat(answers.admin_data_entry_time) || 0;
                        return (cleanupTime + dataEntryTime) * 0.7; // 70% could be prevented
                    },
                    description: 'Data quality issues create ripple effects across all functions'
                },
                rootCauses: [
                    'Manual data entry prone to errors',
                    'No automated data validation at entry',
                    'Lack of system integration (data entered multiple times)',
                    'No single source of truth'
                ],
                integratedSolution: {
                    name: 'Automated Data Quality Pipeline',
                    description: 'Prevent data quality issues at the source',
                    components: [
                        {
                            tool: 'Automated Data Extraction',
                            purpose: 'Eliminate manual data entry',
                            examples: ['UiPath', 'Automation Anywhere', 'Octoparse']
                        },
                        {
                            tool: 'Real-Time Data Validation',
                            purpose: 'Catch errors at entry, not cleanup',
                            examples: ['Talend Data Quality', 'Trifacta']
                        },
                        {
                            tool: 'System Integration & Sync',
                            purpose: 'Single source of truth, auto-sync everywhere',
                            examples: ['Zapier', 'Workato', 'MuleSoft']
                        },
                        {
                            tool: 'AI Deduplication',
                            purpose: 'Automatically merge duplicates',
                            examples: ['Dedupe.io', 'DataLadder']
                        }
                    ],
                    expectedOutcome: '-70% data cleanup time, 95%+ data accuracy'
                }
            },

            {
                id: 'volume_coordination_breakdown',
                name: 'High Volume → Coordination Breakdown',
                icon: '💥',
                description: 'Increased hiring volume overwhelms manual coordination processes',
                involvedUnits: ['sourcing', 'scheduling', 'admin'],
                detectionRules: [
                    {
                        condition: (answers) => {
                            const activeRoles = answers.sourcing_active_roles;
                            const interviewsPerWeek = parseFloat(answers.scheduling_interviews_per_week) || 0;
                            const adminTime = parseFloat(answers.admin_coordination_time) || 0;

                            // High volume across all areas
                            return ['11-20', '20+'].includes(activeRoles) &&
                                   interviewsPerWeek > 20 &&
                                   adminTime > 8;
                        },
                        confidence: 0.85,
                        indicator: 'High volume across sourcing, scheduling, and admin'
                    },
                    {
                        condition: (answers) => {
                            const rescheduleRate = parseFloat(answers.scheduling_reschedule_rate) || 0;
                            return rescheduleRate > 30; // >30% reschedule rate suggests chaos
                        },
                        confidence: 0.75,
                        indicator: 'High reschedule rate indicates coordination breakdown'
                    }
                ],
                impact: {
                    bottleneck: 'Manual coordination becomes the limiting factor for growth',
                    timeWasted: (answers) => {
                        const adminTime = parseFloat(answers.admin_coordination_time) || 0;
                        const rescheduleTime = parseFloat(answers.scheduling_reschedule_time) || 0;
                        return adminTime + rescheduleTime;
                    },
                    description: 'Team drowning in coordination overhead, can\'t scale'
                },
                rootCauses: [
                    'Manual processes don\'t scale with volume',
                    'Too many tools, no integration',
                    'Communication overhead grows exponentially',
                    'No automation for routine coordination tasks'
                ],
                integratedSolution: {
                    name: 'High-Volume Coordination Automation',
                    description: 'Scale-ready automation across the entire recruiting workflow',
                    components: [
                        {
                            tool: 'Recruiting Workflow Automation Platform',
                            purpose: 'End-to-end process automation',
                            examples: ['Lever Nurture', 'Greenhouse Auto-Advance']
                        },
                        {
                            tool: 'AI Coordination Assistant',
                            purpose: 'Handles routine coordination automatically',
                            examples: ['Paradox Olivia', 'x.ai', 'Clara']
                        },
                        {
                            tool: 'Unified Communication Hub',
                            purpose: 'Centralize all stakeholder communication',
                            examples: ['Slack + Integrations', 'Microsoft Teams']
                        },
                        {
                            tool: 'Self-Service Candidate Portal',
                            purpose: 'Candidates handle their own scheduling/updates',
                            examples: ['Goodtime', 'Modern Hire']
                        }
                    ],
                    expectedOutcome: 'Handle 2-3x volume with same team size'
                }
            },

            {
                id: 'reporting_visibility_gap',
                name: 'Reporting → Visibility Gap',
                icon: '🔍',
                description: 'Manual reporting delays insights and decision-making',
                involvedUnits: ['admin', 'sourcing', 'scheduling', 'compliance'],
                detectionRules: [
                    {
                        condition: (answers) => {
                            const reportTime = parseFloat(answers.admin_report_generation_time) || 0;
                            return reportTime > 5; // >5 hours/week on reports
                        },
                        confidence: 0.75,
                        indicator: 'High time spent on manual reporting'
                    },
                    {
                        condition: (answers) => {
                            const reportFreq = answers.admin_report_frequency;
                            return reportFreq === 'Weekly' || reportFreq === 'Daily';
                        },
                        confidence: 0.6,
                        indicator: 'Frequent reporting needs suggest high demand for visibility'
                    }
                ],
                impact: {
                    delayedInsights: 'Decisions made on stale data',
                    timeWasted: (answers) => {
                        const reportTime = parseFloat(answers.admin_report_generation_time) || 0;
                        return reportTime * 0.8; // 80% could be automated
                    },
                    description: 'Manual reporting creates lag between data and action'
                },
                rootCauses: [
                    'Data scattered across multiple systems',
                    'Manual data aggregation and formatting',
                    'No real-time dashboards',
                    'Report creation is reactive, not proactive'
                ],
                integratedSolution: {
                    name: 'Real-Time Visibility Platform',
                    description: 'Automated reporting and always-on dashboards',
                    components: [
                        {
                            tool: 'Auto-Generated Reports',
                            purpose: 'Reports create themselves on schedule',
                            examples: ['Tableau', 'Power BI', 'Looker']
                        },
                        {
                            tool: 'Real-Time Dashboards',
                            purpose: 'Live metrics, no manual updates',
                            examples: ['Greenhouse Analytics', 'Lever Analytics']
                        },
                        {
                            tool: 'AI Insight Generation',
                            purpose: 'Surface trends and anomalies automatically',
                            examples: ['ThoughtSpot', 'Sisense']
                        },
                        {
                            tool: 'Integrated Data Warehouse',
                            purpose: 'Single source of truth for all metrics',
                            examples: ['Snowflake', 'BigQuery']
                        }
                    ],
                    expectedOutcome: '-80% reporting time, real-time insights'
                }
            }
        ];
    }

    /**
     * Detect cross-functional pain points from user answers
     */
    detectCrossFunctionalPains(answers) {
        const detectedPains = [];

        for (const pattern of this.crossFunctionalPatterns) {
            let totalConfidence = 0;
            let matchedRules = 0;
            const matchedIndicators = [];

            // Evaluate each detection rule
            for (const rule of pattern.detectionRules) {
                if (rule.condition(answers)) {
                    totalConfidence += rule.confidence;
                    matchedRules++;
                    matchedIndicators.push(rule.indicator);
                }
            }

            // Calculate average confidence
            const avgConfidence = matchedRules > 0 ? totalConfidence / matchedRules : 0;

            // If confidence exceeds threshold, we've detected this pain
            if (avgConfidence >= this.detectionThreshold) {
                // Calculate impact metrics
                const impactMetrics = {};
                if (pattern.impact.candidatesLost) {
                    impactMetrics.candidatesLost = pattern.impact.candidatesLost(answers);
                }
                if (pattern.impact.timeWasted) {
                    impactMetrics.timeWasted = pattern.impact.timeWasted(answers);
                }

                detectedPains.push({
                    ...pattern,
                    confidence: avgConfidence,
                    matchedIndicators,
                    impactMetrics,
                    severity: this.calculateSeverity(avgConfidence, impactMetrics)
                });
            }
        }

        // Sort by severity (highest first)
        detectedPains.sort((a, b) => b.severity - a.severity);

        return {
            detectedPains,
            totalIssues: detectedPains.length,
            highSeverity: detectedPains.filter(p => p.severity >= 0.8).length,
            mediumSeverity: detectedPains.filter(p => p.severity >= 0.6 && p.severity < 0.8).length,
            summary: this.generateSummary(detectedPains)
        };
    }

    /**
     * Calculate severity score
     */
    calculateSeverity(confidence, impactMetrics) {
        let severity = confidence;

        // Boost severity based on impact
        if (impactMetrics.candidatesLost && impactMetrics.candidatesLost > 10) {
            severity += 0.1;
        }
        if (impactMetrics.timeWasted && impactMetrics.timeWasted > 10) {
            severity += 0.1;
        }

        return Math.min(1.0, severity); // Cap at 1.0
    }

    /**
     * Generate summary insights
     */
    generateSummary(detectedPains) {
        if (detectedPains.length === 0) {
            return {
                type: 'success',
                message: 'No major cross-functional workflow issues detected. Your processes appear well-integrated.',
                icon: '✅'
            };
        }

        const totalTimeWasted = detectedPains.reduce((sum, pain) => {
            return sum + (pain.impactMetrics.timeWasted || 0);
        }, 0);

        const involvedUnits = new Set();
        detectedPains.forEach(pain => {
            pain.involvedUnits.forEach(unit => involvedUnits.add(unit));
        });

        return {
            type: 'critical',
            message: `${detectedPains.length} cross-functional workflow issue(s) detected affecting ${involvedUnits.size} business unit(s). Total time wasted: ~${Math.round(totalTimeWasted)} hours/week.`,
            icon: '🚨',
            recommendation: 'Addressing these systemic issues will have ripple effects across your entire operation.'
        };
    }

    /**
     * Render cross-functional pain detection HTML
     */
    renderCrossFunctionalPainDetection(detection) {
        if (!detection || detection.totalIssues === 0) {
            return `
                <div class="cross-functional-detection bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="text-4xl">✅</span>
                        <h3 class="text-xl font-bold text-green-900">Well-Integrated Workflow</h3>
                    </div>
                    <p class="text-green-800">
                        No major cross-functional workflow issues detected. Your processes appear well-integrated
                        between business units.
                    </p>
                </div>
            `;
        }

        const { detectedPains, summary } = detection;

        return `
            <div class="cross-functional-detection bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg p-6 mb-6">
                <div class="flex items-center gap-3 mb-6">
                    <span class="text-4xl">${summary.icon}</span>
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">Cross-Functional Workflow Issues Detected</h3>
                        <p class="text-sm text-gray-700">${summary.message}</p>
                    </div>
                </div>

                ${summary.recommendation ? `
                    <div class="bg-orange-100 border-l-4 border-orange-500 rounded p-4 mb-6">
                        <p class="text-orange-900 font-semibold">${summary.recommendation}</p>
                    </div>
                ` : ''}

                <div class="space-y-6">
                    ${detectedPains.map((pain, index) => this.renderPainCard(pain, index + 1)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render individual pain card
     */
    renderPainCard(pain, index) {
        const severityColor = pain.severity >= 0.8 ? 'red' : pain.severity >= 0.6 ? 'orange' : 'yellow';
        const severityLabel = pain.severity >= 0.8 ? 'High' : pain.severity >= 0.6 ? 'Medium' : 'Low';

        return `
            <div class="bg-white rounded-lg border-2 border-${severityColor}-300 p-6">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <span class="text-4xl">${pain.icon}</span>
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <h4 class="text-xl font-bold text-gray-900">${index}. ${pain.name}</h4>
                                <span class="px-2 py-1 bg-${severityColor}-100 text-${severityColor}-800 text-xs font-semibold rounded">
                                    ${severityLabel} Severity
                                </span>
                            </div>
                            <p class="text-gray-700">${pain.description}</p>
                            <div class="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                <span>Affects:</span>
                                ${pain.involvedUnits.map(unit => `
                                    <span class="px-2 py-1 bg-gray-100 rounded text-xs font-medium">${unit}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-${severityColor}-600">
                            ${Math.round(pain.confidence * 100)}%
                        </div>
                        <div class="text-xs text-gray-600">Confidence</div>
                    </div>
                </div>

                <!-- Detection Indicators -->
                <div class="bg-gray-50 rounded-lg p-4 mb-4">
                    <h5 class="font-semibold text-gray-900 mb-2 text-sm">Why We Detected This:</h5>
                    <ul class="space-y-1">
                        ${pain.matchedIndicators.map(indicator => `
                            <li class="flex items-start gap-2 text-sm text-gray-700">
                                <span class="text-${severityColor}-600">•</span>
                                <span>${indicator}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <!-- Impact Metrics -->
                ${pain.impactMetrics && Object.keys(pain.impactMetrics).length > 0 ? `
                    <div class="bg-${severityColor}-50 rounded-lg p-4 mb-4">
                        <h5 class="font-semibold text-${severityColor}-900 mb-2 text-sm">Impact:</h5>
                        <div class="grid md:grid-cols-2 gap-3">
                            ${pain.impactMetrics.candidatesLost ? `
                                <div>
                                    <div class="text-2xl font-bold text-${severityColor}-700">
                                        ${Math.round(pain.impactMetrics.candidatesLost)}
                                    </div>
                                    <div class="text-xs text-${severityColor}-700">Candidates lost/week</div>
                                </div>
                            ` : ''}
                            ${pain.impactMetrics.timeWasted ? `
                                <div>
                                    <div class="text-2xl font-bold text-${severityColor}-700">
                                        ${Math.round(pain.impactMetrics.timeWasted)}
                                    </div>
                                    <div class="text-xs text-${severityColor}-700">Hours wasted/week</div>
                                </div>
                            ` : ''}
                        </div>
                        <p class="text-sm text-${severityColor}-800 mt-2">${pain.impact.description}</p>
                        ${pain.impact.cascadeEffect ? `
                            <div class="mt-3">
                                <div class="text-xs font-semibold text-${severityColor}-900 mb-1">Cascade Effects:</div>
                                <ul class="space-y-1">
                                    ${pain.impact.cascadeEffect.map(effect => `
                                        <li class="text-xs text-${severityColor}-800">• ${effect}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}

                <!-- Root Causes -->
                <div class="mb-4">
                    <h5 class="font-semibold text-gray-900 mb-2 text-sm">Root Causes:</h5>
                    <ul class="space-y-1">
                        ${pain.rootCauses.map(cause => `
                            <li class="flex items-start gap-2 text-sm text-gray-700">
                                <span class="text-gray-400">→</span>
                                <span>${cause}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <!-- Integrated Solution -->
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <h5 class="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <span>💡</span>
                        <span>${pain.integratedSolution.name}</span>
                    </h5>
                    <p class="text-sm text-green-800 mb-3">${pain.integratedSolution.description}</p>
                    <div class="space-y-2">
                        ${pain.integratedSolution.components.map(component => `
                            <div class="bg-white rounded-lg p-3 border border-green-200">
                                <div class="font-semibold text-gray-900 text-sm">${component.tool}</div>
                                <div class="text-xs text-gray-600 mb-1">${component.purpose}</div>
                                <div class="text-xs text-green-700">
                                    Examples: ${component.examples.join(', ')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="mt-3 pt-3 border-t border-green-200">
                        <div class="flex items-center gap-2">
                            <span class="text-green-700 font-semibold text-sm">Expected Outcome:</span>
                            <span class="text-green-900 text-sm">${pain.integratedSolution.expectedOutcome}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Export cross-functional pain detection
     */
    exportDetection(detection) {
        return {
            ...detection,
            exportedAt: new Date().toISOString()
        };
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.CrossFunctionalPainDetector = CrossFunctionalPainDetector;
}
