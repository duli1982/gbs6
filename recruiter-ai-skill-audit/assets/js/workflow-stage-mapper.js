/**
 * Workflow Stage Mapper
 * Maps user's actual workflow stages and identifies bottlenecks
 * Provides stage-specific AI recommendations
 */

class WorkflowStageMapper {
    constructor() {
        this.workflowDefinitions = this.initializeWorkflowDefinitions();
        this.bottleneckThresholds = {
            highTime: 0.4, // 40% or more of total time
            highPain: 4,   // Pain level 4-5 out of 5
            combinedScore: 15 // Time * Pain score
        };
    }

    /**
     * Initialize workflow definitions for each business unit
     */
    initializeWorkflowDefinitions() {
        return {
            sourcing: {
                name: 'Sourcing Workflow',
                stages: [
                    {
                        id: 'job_intake',
                        name: 'Job Intake & Requirements Gathering',
                        description: 'Meeting with hiring managers, clarifying requirements, creating job descriptions',
                        typicalTime: { min: 1, max: 5, average: 2.5 },
                        aiOpportunities: [
                            'AI job description generator',
                            'Automated requirement extraction',
                            'Skills matching recommendations'
                        ]
                    },
                    {
                        id: 'boolean_search',
                        name: 'Boolean Search & Sourcing Strategy',
                        description: 'Creating search strings, researching target companies, planning sourcing approach',
                        typicalTime: { min: 2, max: 8, average: 4 },
                        aiOpportunities: [
                            'AI-powered boolean generator',
                            'Automated talent mapping',
                            'Competitive intelligence tools'
                        ]
                    },
                    {
                        id: 'profile_review',
                        name: 'Profile Review & Screening',
                        description: 'Reviewing resumes, screening for qualifications, shortlisting candidates',
                        typicalTime: { min: 5, max: 25, average: 12 },
                        aiOpportunities: [
                            'AI resume screeners',
                            'Automated skills matching',
                            'ML-powered ranking'
                        ]
                    },
                    {
                        id: 'outreach',
                        name: 'Candidate Outreach',
                        description: 'Crafting messages, sending InMails, making calls, managing responses',
                        typicalTime: { min: 3, max: 15, average: 8 },
                        aiOpportunities: [
                            'AI message personalization',
                            'Automated sequence campaigns',
                            'Response prediction'
                        ]
                    },
                    {
                        id: 'followup',
                        name: 'Follow-up & Nurturing',
                        description: 'Following up with candidates, maintaining relationships, pipeline management',
                        typicalTime: { min: 2, max: 10, average: 5 },
                        aiOpportunities: [
                            'Automated follow-up sequences',
                            'AI nurture campaigns',
                            'Engagement scoring'
                        ]
                    }
                ]
            },

            scheduling: {
                name: 'Interview Scheduling Workflow',
                stages: [
                    {
                        id: 'availability_collection',
                        name: 'Collecting Availability',
                        description: 'Gathering availability from candidates and interview panels',
                        typicalTime: { min: 2, max: 10, average: 5 },
                        aiOpportunities: [
                            'Self-scheduling links',
                            'AI calendar sync',
                            'Automated availability requests'
                        ]
                    },
                    {
                        id: 'scheduling_coordination',
                        name: 'Scheduling & Coordination',
                        description: 'Finding mutual times, booking rooms, sending invites',
                        typicalTime: { min: 3, max: 12, average: 6 },
                        aiOpportunities: [
                            'AI scheduling assistant',
                            'Automated time-finding',
                            'Smart room booking'
                        ]
                    },
                    {
                        id: 'confirmation_reminders',
                        name: 'Confirmations & Reminders',
                        description: 'Sending confirmations, pre-interview prep, reminder emails',
                        typicalTime: { min: 1, max: 5, average: 2 },
                        aiOpportunities: [
                            'Automated reminder sequences',
                            'Smart confirmation workflows',
                            'AI prep packet generation'
                        ]
                    },
                    {
                        id: 'reschedule_management',
                        name: 'Reschedule Management',
                        description: 'Handling cancellations, finding new times, re-coordinating',
                        typicalTime: { min: 2, max: 15, average: 6 },
                        aiOpportunities: [
                            'Instant reschedule links',
                            'AI conflict resolution',
                            'Automated re-coordination'
                        ]
                    },
                    {
                        id: 'logistics_support',
                        name: 'Logistics & Support',
                        description: 'Virtual meeting setup, technical support, day-of coordination',
                        typicalTime: { min: 1, max: 6, average: 3 },
                        aiOpportunities: [
                            'Automated meeting setup',
                            'AI tech check',
                            'Smart logistics automation'
                        ]
                    }
                ]
            },

            compliance: {
                name: 'Compliance Workflow',
                stages: [
                    {
                        id: 'policy_monitoring',
                        name: 'Policy Monitoring & Updates',
                        description: 'Tracking regulatory changes, updating policies, communicating changes',
                        typicalTime: { min: 2, max: 8, average: 4 },
                        aiOpportunities: [
                            'AI policy change alerts',
                            'Automated policy updates',
                            'Regulatory intelligence'
                        ]
                    },
                    {
                        id: 'audit_preparation',
                        name: 'Audit Preparation',
                        description: 'Gathering documentation, organizing records, creating audit trails',
                        typicalTime: { min: 3, max: 12, average: 6 },
                        aiOpportunities: [
                            'Auto-generated audit trails',
                            'AI documentation gathering',
                            'Smart record organization'
                        ]
                    },
                    {
                        id: 'issue_investigation',
                        name: 'Issue Investigation & Resolution',
                        description: 'Investigating violations, root cause analysis, remediation planning',
                        typicalTime: { min: 2, max: 10, average: 5 },
                        aiOpportunities: [
                            'AI anomaly detection',
                            'Automated root cause analysis',
                            'Smart remediation suggestions'
                        ]
                    },
                    {
                        id: 'reporting',
                        name: 'Compliance Reporting',
                        description: 'Creating compliance reports, dashboards, stakeholder updates',
                        typicalTime: { min: 2, max: 8, average: 4 },
                        aiOpportunities: [
                            'Auto-generated reports',
                            'AI compliance dashboards',
                            'Predictive compliance scoring'
                        ]
                    }
                ]
            },

            contracts: {
                name: 'Contract Management Workflow',
                stages: [
                    {
                        id: 'contract_drafting',
                        name: 'Contract Drafting',
                        description: 'Creating contracts from templates, customizing terms, initial drafts',
                        typicalTime: { min: 0.5, max: 3, average: 1 },
                        aiOpportunities: [
                            'AI contract generation',
                            'Smart template selection',
                            'Automated clause customization'
                        ]
                    },
                    {
                        id: 'legal_review',
                        name: 'Legal Review & Redlines',
                        description: 'Waiting for legal review, incorporating redlines, negotiating terms',
                        typicalTime: { min: 2, max: 20, average: 8 },
                        aiOpportunities: [
                            'AI legal risk scoring',
                            'Automated redline suggestions',
                            'Smart clause negotiation'
                        ]
                    },
                    {
                        id: 'approval_routing',
                        name: 'Approval Routing',
                        description: 'Routing for approvals, following up, tracking status',
                        typicalTime: { min: 1, max: 8, average: 3 },
                        aiOpportunities: [
                            'Automated approval workflows',
                            'AI approval prediction',
                            'Smart routing optimization'
                        ]
                    },
                    {
                        id: 'signature_collection',
                        name: 'Signature Collection',
                        description: 'Sending for e-signature, following up, tracking completion',
                        typicalTime: { min: 0.5, max: 5, average: 2 },
                        aiOpportunities: [
                            'Automated e-signature workflows',
                            'AI follow-up reminders',
                            'Smart completion tracking'
                        ]
                    },
                    {
                        id: 'contract_storage',
                        name: 'Contract Storage & Organization',
                        description: 'Filing contracts, tagging metadata, ensuring accessibility',
                        typicalTime: { min: 0.5, max: 3, average: 1 },
                        aiOpportunities: [
                            'Auto-filing and tagging',
                            'AI metadata extraction',
                            'Smart search and retrieval'
                        ]
                    }
                ]
            },

            admin: {
                name: 'Admin Operations Workflow',
                stages: [
                    {
                        id: 'data_entry',
                        name: 'Data Entry & Updates',
                        description: 'Manual data entry, updating records, maintaining accuracy',
                        typicalTime: { min: 2, max: 15, average: 8 },
                        aiOpportunities: [
                            'Automated data extraction',
                            'AI-powered data entry',
                            'Smart duplicate detection'
                        ]
                    },
                    {
                        id: 'report_generation',
                        name: 'Report Generation',
                        description: 'Creating reports, compiling data, formatting presentations',
                        typicalTime: { min: 2, max: 10, average: 5 },
                        aiOpportunities: [
                            'Auto-generated reports',
                            'AI data visualization',
                            'Smart insight generation'
                        ]
                    },
                    {
                        id: 'data_cleanup',
                        name: 'Data Cleanup & Maintenance',
                        description: 'Deduping records, fixing errors, maintaining data quality',
                        typicalTime: { min: 1, max: 8, average: 4 },
                        aiOpportunities: [
                            'AI deduplication',
                            'Automated data quality checks',
                            'Smart error correction'
                        ]
                    },
                    {
                        id: 'system_coordination',
                        name: 'System Coordination',
                        description: 'Moving data between systems, manual integrations, syncing',
                        typicalTime: { min: 2, max: 12, average: 6 },
                        aiOpportunities: [
                            'Automated system sync',
                            'AI-powered integrations',
                            'Smart data mapping'
                        ]
                    }
                ]
            }
        };
    }

    /**
     * Analyze workflow stages from user answers
     */
    analyzeWorkflow(businessUnit, answers) {
        const workflow = this.workflowDefinitions[businessUnit];
        if (!workflow) return null;

        const analyzedStages = workflow.stages.map(stage => {
            const stageData = this.extractStageData(stage, answers);
            const bottleneckScore = this.calculateBottleneckScore(stageData);
            const percentOfTotal = this.calculatePercentOfTotal(stageData, workflow.stages, answers);

            return {
                ...stage,
                timeSpent: stageData.timeSpent,
                painLevel: stageData.painLevel,
                bottleneckScore,
                percentOfTotal,
                isBottleneck: this.isBottleneck(bottleneckScore, percentOfTotal, stageData.painLevel)
            };
        });

        // Calculate totals
        const totalTime = analyzedStages.reduce((sum, s) => sum + (s.timeSpent || 0), 0);
        const avgPain = analyzedStages.reduce((sum, s) => sum + (s.painLevel || 0), 0) / analyzedStages.length;

        // Identify top bottlenecks
        const bottlenecks = analyzedStages
            .filter(s => s.isBottleneck)
            .sort((a, b) => b.bottleneckScore - a.bottleneckScore);

        return {
            businessUnit,
            workflowName: workflow.name,
            stages: analyzedStages,
            totalTime,
            avgPain,
            bottlenecks,
            analysis: this.generateWorkflowAnalysis(analyzedStages, bottlenecks, totalTime)
        };
    }

    /**
     * Extract stage-specific data from answers
     */
    extractStageData(stage, answers) {
        // Look for matching question IDs in answers
        const stageKey = `${stage.id}_time`;
        const painKey = `${stage.id}_pain`;

        return {
            timeSpent: answers[stageKey] || null,
            painLevel: answers[painKey] || null
        };
    }

    /**
     * Calculate bottleneck score (time * pain)
     */
    calculateBottleneckScore(stageData) {
        if (!stageData.timeSpent || !stageData.painLevel) return 0;
        return stageData.timeSpent * stageData.painLevel;
    }

    /**
     * Calculate percentage of total workflow time
     */
    calculatePercentOfTotal(stageData, allStages, answers) {
        if (!stageData.timeSpent) return 0;

        const totalTime = allStages.reduce((sum, stage) => {
            const stageKey = `${stage.id}_time`;
            return sum + (answers[stageKey] || 0);
        }, 0);

        return totalTime > 0 ? (stageData.timeSpent / totalTime) * 100 : 0;
    }

    /**
     * Determine if stage is a bottleneck
     */
    isBottleneck(bottleneckScore, percentOfTotal, painLevel) {
        return (
            percentOfTotal >= this.bottleneckThresholds.highTime * 100 ||
            painLevel >= this.bottleneckThresholds.highPain ||
            bottleneckScore >= this.bottleneckThresholds.combinedScore
        );
    }

    /**
     * Generate workflow analysis insights
     */
    generateWorkflowAnalysis(stages, bottlenecks, totalTime) {
        const insights = [];

        if (bottlenecks.length === 0) {
            insights.push({
                type: 'success',
                message: 'Your workflow is well-balanced with no major bottlenecks detected.',
                icon: '✅'
            });
        } else {
            const topBottleneck = bottlenecks[0];
            insights.push({
                type: 'critical',
                message: `${topBottleneck.name} is your #1 bottleneck, consuming ${Math.round(topBottleneck.percentOfTotal)}% of your time (${topBottleneck.timeSpent} hrs/week) with a pain level of ${topBottleneck.painLevel}/5.`,
                icon: '🔴',
                recommendations: topBottleneck.aiOpportunities
            });

            if (bottlenecks.length > 1) {
                insights.push({
                    type: 'warning',
                    message: `${bottlenecks.length - 1} additional bottleneck(s) detected. Addressing your top ${Math.min(3, bottlenecks.length)} bottlenecks could save significant time.`,
                    icon: '⚠️'
                });
            }
        }

        // Time concentration insight
        const topTimeConsumer = [...stages].sort((a, b) => (b.timeSpent || 0) - (a.timeSpent || 0))[0];
        if (topTimeConsumer && topTimeConsumer.percentOfTotal > 50) {
            insights.push({
                type: 'info',
                message: `${topTimeConsumer.name} consumes over 50% of your workflow time. This is a high-leverage automation opportunity.`,
                icon: '💡'
            });
        }

        return insights;
    }

    /**
     * Calculate potential time savings from addressing bottlenecks
     */
    calculatePotentialSavings(workflowAnalysis) {
        if (!workflowAnalysis.bottlenecks.length) {
            return {
                weekly: 0,
                monthly: 0,
                yearly: 0,
                details: []
            };
        }

        const savings = workflowAnalysis.bottlenecks.map(bottleneck => {
            // Assume AI can reduce bottleneck time by 60-80% on average
            const reductionRate = bottleneck.painLevel >= 4 ? 0.75 : 0.60;
            const weeklySavings = bottleneck.timeSpent * reductionRate;

            return {
                stage: bottleneck.name,
                currentTime: bottleneck.timeSpent,
                reductionRate: Math.round(reductionRate * 100),
                weeklySavings,
                monthlySavings: weeklySavings * 4,
                yearlySavings: weeklySavings * 52,
                topRecommendation: bottleneck.aiOpportunities[0]
            };
        });

        const totalWeekly = savings.reduce((sum, s) => sum + s.weeklySavings, 0);

        return {
            weekly: totalWeekly,
            monthly: totalWeekly * 4,
            yearly: totalWeekly * 52,
            details: savings
        };
    }

    /**
     * Render workflow visualization HTML
     */
    renderWorkflowVisualization(workflowAnalysis) {
        if (!workflowAnalysis) return '';

        const { workflowName, stages, totalTime, avgPain, analysis } = workflowAnalysis;
        const savings = this.calculatePotentialSavings(workflowAnalysis);

        return `
            <div class="workflow-visualization bg-white rounded-xl shadow-lg p-6 mb-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="text-3xl">🔄</div>
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">${workflowName} Analysis</h3>
                        <p class="text-sm text-gray-600">Total Time: ${totalTime} hrs/week | Avg Pain: ${avgPain.toFixed(1)}/5</p>
                    </div>
                </div>

                <!-- Workflow Stages -->
                <div class="space-y-3 mb-6">
                    ${stages.map((stage, index) => this.renderStageRow(stage, index + 1, totalTime)).join('')}
                </div>

                <!-- Analysis Insights -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
                    <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span>📊</span>
                        <span>Workflow Analysis</span>
                    </h4>
                    <div class="space-y-2">
                        ${analysis.map(insight => `
                            <div class="flex items-start gap-2">
                                <span class="text-lg">${insight.icon}</span>
                                <div class="flex-1">
                                    <p class="text-sm text-gray-800">${insight.message}</p>
                                    ${insight.recommendations ? `
                                        <div class="mt-2 ml-4">
                                            <p class="text-xs font-semibold text-indigo-700 mb-1">AI Solutions:</p>
                                            <ul class="text-xs text-indigo-600 space-y-1">
                                                ${insight.recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
                                            </ul>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Potential Savings -->
                ${savings.weekly > 0 ? `
                    <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                        <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span>💰</span>
                            <span>Potential Time Savings</span>
                        </h4>
                        <div class="grid md:grid-cols-3 gap-4 mb-4">
                            <div class="text-center">
                                <div class="text-3xl font-bold text-green-600">${Math.round(savings.weekly)}</div>
                                <div class="text-xs text-gray-600">Hours/Week</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-green-600">${Math.round(savings.monthly)}</div>
                                <div class="text-xs text-gray-600">Hours/Month</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-green-600">${Math.round(savings.yearly)}</div>
                                <div class="text-xs text-gray-600">Hours/Year</div>
                            </div>
                        </div>
                        <div class="space-y-2">
                            ${savings.details.map(detail => `
                                <div class="bg-white rounded-lg p-3 border border-green-200">
                                    <div class="flex justify-between items-start mb-2">
                                        <span class="font-medium text-gray-900 text-sm">${detail.stage}</span>
                                        <span class="text-green-600 font-bold text-sm">${Math.round(detail.weeklySavings)} hrs/week</span>
                                    </div>
                                    <div class="text-xs text-gray-600 mb-2">
                                        ${detail.currentTime} hrs → ${Math.round(detail.currentTime * (1 - detail.reductionRate / 100))} hrs
                                        (${detail.reductionRate}% reduction)
                                    </div>
                                    <div class="text-xs text-indigo-700 font-medium">
                                        💡 ${detail.topRecommendation}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render individual stage row
     */
    renderStageRow(stage, index, totalTime) {
        const timePercent = stage.timeSpent ? (stage.timeSpent / totalTime) * 100 : 0;
        const painColor = this.getPainLevelColor(stage.painLevel);
        const bottleneckBadge = stage.isBottleneck ? '<span class="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">BOTTLENECK</span>' : '';

        return `
            <div class="border rounded-lg p-4 ${stage.isBottleneck ? 'border-red-300 bg-red-50' : 'border-gray-200'}">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="font-semibold text-gray-900">${index}. ${stage.name}</span>
                            ${bottleneckBadge}
                        </div>
                        <p class="text-xs text-gray-600">${stage.description}</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-3">
                    <div>
                        <div class="text-xs text-gray-600 mb-1">Time Spent</div>
                        <div class="flex items-center gap-2">
                            <div class="flex-1 bg-gray-200 rounded-full h-2">
                                <div class="bg-indigo-600 h-2 rounded-full" style="width: ${timePercent}%"></div>
                            </div>
                            <span class="text-sm font-semibold text-gray-900">${stage.timeSpent || 0} hrs</span>
                        </div>
                        <div class="text-xs text-gray-500 mt-1">${Math.round(timePercent)}% of total time</div>
                    </div>
                    <div>
                        <div class="text-xs text-gray-600 mb-1">Pain Level</div>
                        <div class="flex items-center gap-2">
                            <div class="flex gap-1">
                                ${this.renderPainStars(stage.painLevel)}
                            </div>
                            <span class="text-sm font-semibold ${painColor}">${stage.painLevel || 0}/5</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render pain level stars
     */
    renderPainStars(painLevel) {
        if (!painLevel) return '☆☆☆☆☆';
        const filled = '★';
        const empty = '☆';
        return filled.repeat(painLevel) + empty.repeat(5 - painLevel);
    }

    /**
     * Get pain level color class
     */
    getPainLevelColor(painLevel) {
        if (!painLevel) return 'text-gray-400';
        if (painLevel >= 4) return 'text-red-600';
        if (painLevel >= 3) return 'text-orange-500';
        if (painLevel >= 2) return 'text-yellow-600';
        return 'text-green-600';
    }

    /**
     * Export workflow analysis
     */
    exportWorkflowAnalysis(workflowAnalysis) {
        return {
            ...workflowAnalysis,
            exportedAt: new Date().toISOString()
        };
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.WorkflowStageMapper = WorkflowStageMapper;
}
