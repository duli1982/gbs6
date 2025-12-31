/**
 * Scenario-Based Analyzer
 * Presents real-world scenarios and analyzes user responses
 * Provides context-specific insights and time savings calculations
 */

class ScenarioBasedAnalyzer {
    constructor() {
        this.scenarios = this.initializeScenarios();
    }

    /**
     * Initialize scenario definitions for each business unit
     */
    initializeScenarios() {
        return {
            sourcing: {
                rush_req_scenario: {
                    id: 'rush_req_scenario',
                    name: 'Rush Requisition Scenario',
                    icon: '⏰',
                    scenario: `
                        <div class="scenario-box">
                            <div class="scenario-header">
                                <span class="text-2xl">⏰</span>
                                <strong>Scenario: Urgent Requisition</strong>
                            </div>
                            <p class="scenario-description">
                                It's Monday 9am. Your hiring manager sends an urgent request: "Need 5 qualified
                                candidates by end of week for a critical role. Can you help?"
                            </p>
                            <p class="scenario-question">
                                What does your current process look like? <strong>(Select all that apply)</strong>
                            </p>
                        </div>
                    `,
                    options: [
                        {
                            id: 'manual_boolean',
                            label: 'I manually create boolean search strings',
                            timeImpact: 2, // hours
                            painLevel: 3,
                            category: 'manual'
                        },
                        {
                            id: 'manual_review',
                            label: 'I manually review each resume (200-300 profiles)',
                            timeImpact: 8,
                            painLevel: 5,
                            category: 'manual'
                        },
                        {
                            id: 'manual_outreach',
                            label: 'I craft personalized messages for each candidate',
                            timeImpact: 3,
                            painLevel: 4,
                            category: 'manual'
                        },
                        {
                            id: 'wait_responses',
                            label: 'I wait days for responses (low response rate ~10%)',
                            timeImpact: 0, // waiting time, not active work
                            painLevel: 5,
                            category: 'blocker'
                        },
                        {
                            id: 'weekend_work',
                            label: 'I work evenings/weekends to meet deadline',
                            timeImpact: 5,
                            painLevel: 5,
                            category: 'stress'
                        },
                        {
                            id: 'ai_boolean',
                            label: 'AI generates my search strings instantly',
                            timeImpact: 0.1,
                            painLevel: 1,
                            category: 'automated'
                        },
                        {
                            id: 'ai_screening',
                            label: 'AI screens and ranks candidates automatically',
                            timeImpact: 0.5,
                            painLevel: 1,
                            category: 'automated'
                        },
                        {
                            id: 'ai_outreach',
                            label: 'AI personalizes outreach at scale',
                            timeImpact: 0.3,
                            painLevel: 1,
                            category: 'automated'
                        }
                    ],
                    analysis: {
                        getCurrentState: (selectedOptions) => {
                            const hasManual = selectedOptions.some(opt => opt.category === 'manual');
                            const hasAutomated = selectedOptions.some(opt => opt.category === 'automated');
                            const hasStress = selectedOptions.some(opt => opt.category === 'stress');

                            if (hasAutomated && !hasManual) {
                                return {
                                    state: 'optimized',
                                    message: 'You\'re already using AI automation effectively!',
                                    icon: '✅'
                                };
                            } else if (hasManual && !hasAutomated) {
                                return {
                                    state: 'manual',
                                    message: 'Your process is entirely manual - massive automation opportunity',
                                    icon: '🔴'
                                };
                            } else {
                                return {
                                    state: 'hybrid',
                                    message: 'You\'re using some automation but still have manual steps',
                                    icon: '🟡'
                                };
                            }
                        },
                        calculateTimeImpact: (selectedOptions) => {
                            const currentTime = selectedOptions.reduce((sum, opt) => sum + opt.timeImpact, 0);
                            const manualTime = selectedOptions
                                .filter(opt => opt.category === 'manual' || opt.category === 'stress')
                                .reduce((sum, opt) => sum + opt.timeImpact, 0);
                            const automatedTime = selectedOptions
                                .filter(opt => opt.category === 'automated')
                                .reduce((sum, opt) => sum + opt.timeImpact, 0);

                            // Calculate potential with full automation
                            const potentialTime = 1; // With AI: ~1 hour total
                            const savings = currentTime - potentialTime;

                            return {
                                currentTime,
                                potentialTime,
                                savings,
                                savingsPercentage: currentTime > 0 ? Math.round((savings / currentTime) * 100) : 0,
                                frequency: 'Weekly occurrence = 52x/year'
                            };
                        }
                    }
                }
            },

            scheduling: {
                reschedule_chaos_scenario: {
                    id: 'reschedule_chaos_scenario',
                    name: 'Reschedule Chaos Scenario',
                    icon: '📅',
                    scenario: `
                        <div class="scenario-box">
                            <div class="scenario-header">
                                <span class="text-2xl">📅</span>
                                <strong>Scenario: Interview Reschedule Cascade</strong>
                            </div>
                            <p class="scenario-description">
                                It's Tuesday afternoon. You've scheduled a panel interview for tomorrow with
                                4 interviewers. One interviewer just emailed: "Emergency came up, I can't make
                                it tomorrow. Can we reschedule?"
                            </p>
                            <p class="scenario-question">
                                What happens next? <strong>(Select all that apply)</strong>
                            </p>
                        </div>
                    `,
                    options: [
                        {
                            id: 'email_back_forth',
                            label: 'Email back-and-forth with all 4 interviewers to find new time',
                            timeImpact: 1.5,
                            painLevel: 5,
                            category: 'manual'
                        },
                        {
                            id: 'check_calendars',
                            label: 'Manually check each person\'s calendar for availability',
                            timeImpact: 0.5,
                            painLevel: 4,
                            category: 'manual'
                        },
                        {
                            id: 'apologize_candidate',
                            label: 'Apologize to candidate and explain the delay',
                            timeImpact: 0.2,
                            painLevel: 3,
                            category: 'manual'
                        },
                        {
                            id: 'update_systems',
                            label: 'Manually update ATS, send new calendar invites, update rooms',
                            timeImpact: 0.5,
                            painLevel: 3,
                            category: 'manual'
                        },
                        {
                            id: 'send_reminders',
                            label: 'Send new confirmation emails and reminders to everyone',
                            timeImpact: 0.3,
                            painLevel: 2,
                            category: 'manual'
                        },
                        {
                            id: 'stress_anxiety',
                            label: 'Stress about candidate experience and potential no-show',
                            timeImpact: 0,
                            painLevel: 5,
                            category: 'stress'
                        },
                        {
                            id: 'ai_finds_time',
                            label: 'AI instantly finds new time that works for everyone',
                            timeImpact: 0.1,
                            painLevel: 1,
                            category: 'automated'
                        },
                        {
                            id: 'auto_reschedule_link',
                            label: 'Automated reschedule link sent to candidate with new options',
                            timeImpact: 0.05,
                            painLevel: 1,
                            category: 'automated'
                        },
                        {
                            id: 'auto_updates',
                            label: 'System auto-updates calendar invites, rooms, and sends confirmations',
                            timeImpact: 0.02,
                            painLevel: 1,
                            category: 'automated'
                        }
                    ],
                    analysis: {
                        getCurrentState: (selectedOptions) => {
                            const manualCount = selectedOptions.filter(opt => opt.category === 'manual').length;
                            const automatedCount = selectedOptions.filter(opt => opt.category === 'automated').length;

                            if (manualCount >= 4) {
                                return {
                                    state: 'chaotic',
                                    message: 'Your reschedule process is highly manual and time-consuming',
                                    icon: '🔥'
                                };
                            } else if (automatedCount >= 2) {
                                return {
                                    state: 'smooth',
                                    message: 'You have good automation for reschedules',
                                    icon: '✅'
                                };
                            } else {
                                return {
                                    state: 'struggling',
                                    message: 'Rescheduling is painful but you\'re managing',
                                    icon: '😓'
                                };
                            }
                        },
                        calculateTimeImpact: (selectedOptions) => {
                            const currentTime = selectedOptions.reduce((sum, opt) => sum + opt.timeImpact, 0);
                            const potentialTime = 0.17; // With AI: ~10 minutes total
                            const savings = currentTime - potentialTime;

                            return {
                                currentTime,
                                potentialTime,
                                savings,
                                savingsPercentage: currentTime > 0 ? Math.round((savings / currentTime) * 100) : 0,
                                frequency: 'If this happens 2x/week = 104x/year',
                                extraImpact: 'Better candidate experience = higher offer acceptance'
                            };
                        }
                    }
                }
            },

            contracts: {
                friday_rush_contract_scenario: {
                    id: 'friday_rush_contract_scenario',
                    name: 'Friday Rush Contract Scenario',
                    icon: '⏱️',
                    scenario: `
                        <div class="scenario-box">
                            <div class="scenario-header">
                                <span class="text-2xl">⏱️</span>
                                <strong>Scenario: Friday 4:45pm Rush Contract</strong>
                            </div>
                            <p class="scenario-description">
                                It's Friday 4:45pm. Hiring manager emails: "Need this contractor to start Monday.
                                Contract must be signed today. Can you help?"
                            </p>
                            <p class="scenario-question">
                                What happens next? <strong>(Select all that apply)</strong>
                            </p>
                        </div>
                    `,
                    options: [
                        {
                            id: 'drop_everything',
                            label: 'I drop everything to draft the contract manually',
                            timeImpact: 0.5,
                            painLevel: 5,
                            category: 'manual'
                        },
                        {
                            id: 'wait_legal',
                            label: 'I wait for legal review (2-4 hours, might not happen until Monday)',
                            timeImpact: 3,
                            painLevel: 5,
                            category: 'blocker'
                        },
                        {
                            id: 'manual_routing',
                            label: 'I manually route for signatures (multiple emails, follow-ups)',
                            timeImpact: 0.25,
                            painLevel: 4,
                            category: 'manual'
                        },
                        {
                            id: 'weekend_followup',
                            label: 'I send follow-up emails throughout weekend',
                            timeImpact: 0.5,
                            painLevel: 5,
                            category: 'stress'
                        },
                        {
                            id: 'hope_monday',
                            label: 'I hope it gets signed by Monday (50/50 chance)',
                            timeImpact: 0,
                            painLevel: 5,
                            category: 'stress'
                        },
                        {
                            id: 'ai_contract_gen',
                            label: 'Contract auto-generates from requisition (30 seconds)',
                            timeImpact: 0.01,
                            painLevel: 1,
                            category: 'automated'
                        },
                        {
                            id: 'ai_legal_check',
                            label: 'AI legal risk check (2 minutes)',
                            timeImpact: 0.03,
                            painLevel: 1,
                            category: 'automated'
                        },
                        {
                            id: 'auto_esignature',
                            label: 'Auto-routes for e-signature with reminders (instant)',
                            timeImpact: 0.01,
                            painLevel: 1,
                            category: 'automated'
                        },
                        {
                            id: 'done_in_minutes',
                            label: 'Entire process done in ~3 minutes, no weekend work',
                            timeImpact: 0.05,
                            painLevel: 1,
                            category: 'automated'
                        }
                    ],
                    analysis: {
                        getCurrentState: (selectedOptions) => {
                            const hasWeekendWork = selectedOptions.some(opt => opt.category === 'stress');
                            const hasAutomated = selectedOptions.some(opt => opt.category === 'automated');

                            if (hasWeekendWork && !hasAutomated) {
                                return {
                                    state: 'emergency_mode',
                                    message: 'Rush contracts create high-stress, weekend-impacting situations',
                                    icon: '🚨'
                                };
                            } else if (hasAutomated) {
                                return {
                                    state: 'handled',
                                    message: 'You can handle rush contracts without stress',
                                    icon: '✅'
                                };
                            } else {
                                return {
                                    state: 'reactive',
                                    message: 'Rush contracts are painful but manageable',
                                    icon: '😰'
                                };
                            }
                        },
                        calculateTimeImpact: (selectedOptions) => {
                            const currentTime = selectedOptions.reduce((sum, opt) => sum + opt.timeImpact, 0);
                            const potentialTime = 0.05; // With AI: ~3 minutes
                            const savings = currentTime - potentialTime;

                            return {
                                currentTime,
                                potentialTime,
                                savings,
                                savingsPercentage: currentTime > 0 ? Math.round((savings / currentTime) * 100) : 0,
                                frequency: 'If this happens weekly = 52x/year',
                                extraImpact: 'No weekend work = priceless',
                                yearlyImpact: `${Math.round(savings * 52)} hours saved/year + work-life balance`
                            };
                        }
                    }
                }
            },

            compliance: {
                surprise_audit_scenario: {
                    id: 'surprise_audit_scenario',
                    name: 'Surprise Audit Scenario',
                    icon: '📋',
                    scenario: `
                        <div class="scenario-box">
                            <div class="scenario-header">
                                <span class="text-2xl">📋</span>
                                <strong>Scenario: Surprise Compliance Audit</strong>
                            </div>
                            <p class="scenario-description">
                                Monday morning: "Audit starts Wednesday. Need documentation for all hires in Q4
                                (150 candidates). Can you pull together compliance records?"
                            </p>
                            <p class="scenario-question">
                                What's your process? <strong>(Select all that apply)</strong>
                            </p>
                        </div>
                    `,
                    options: [
                        {
                            id: 'manual_gather',
                            label: 'I manually gather documents from multiple systems',
                            timeImpact: 8,
                            painLevel: 5,
                            category: 'manual'
                        },
                        {
                            id: 'verify_complete',
                            label: 'I manually verify each record is complete (missing docs common)',
                            timeImpact: 6,
                            painLevel: 5,
                            category: 'manual'
                        },
                        {
                            id: 'chase_missing',
                            label: 'I chase down missing documentation from hiring managers',
                            timeImpact: 4,
                            painLevel: 4,
                            category: 'manual'
                        },
                        {
                            id: 'weekend_prep',
                            label: 'I work the weekend to prepare for Wednesday',
                            timeImpact: 12,
                            painLevel: 5,
                            category: 'stress'
                        },
                        {
                            id: 'find_issues',
                            label: 'Auditors find issues I missed (non-compliant records)',
                            timeImpact: 0,
                            painLevel: 5,
                            category: 'blocker'
                        },
                        {
                            id: 'auto_trail',
                            label: 'Automated audit trail exists for every hire',
                            timeImpact: 0,
                            painLevel: 1,
                            category: 'automated'
                        },
                        {
                            id: 'ai_compliance_check',
                            label: 'AI pre-checks all records for compliance (100% coverage)',
                            timeImpact: 0.5,
                            painLevel: 1,
                            category: 'automated'
                        },
                        {
                            id: 'one_click_report',
                            label: 'One-click audit report generation (2 hours → 2 minutes)',
                            timeImpact: 0.03,
                            painLevel: 1,
                            category: 'automated'
                        },
                        {
                            id: 'always_ready',
                            label: 'Always audit-ready, no scrambling needed',
                            timeImpact: 0.5,
                            painLevel: 1,
                            category: 'automated'
                        }
                    ],
                    analysis: {
                        getCurrentState: (selectedOptions) => {
                            const manualHours = selectedOptions
                                .filter(opt => opt.category === 'manual' || opt.category === 'stress')
                                .reduce((sum, opt) => sum + opt.timeImpact, 0);

                            if (manualHours > 15) {
                                return {
                                    state: 'firefighting',
                                    message: 'Audits trigger panic mode - completely reactive',
                                    icon: '🔥'
                                };
                            } else if (manualHours < 2) {
                                return {
                                    state: 'audit_ready',
                                    message: 'You\'re always audit-ready - proactive compliance',
                                    icon: '✅'
                                };
                            } else {
                                return {
                                    state: 'reactive',
                                    message: 'Audits are stressful but you get through them',
                                    icon: '😓'
                                };
                            }
                        },
                        calculateTimeImpact: (selectedOptions) => {
                            const currentTime = selectedOptions.reduce((sum, opt) => sum + opt.timeImpact, 0);
                            const potentialTime = 1; // With AI: ~1 hour to review pre-generated report
                            const savings = currentTime - potentialTime;

                            return {
                                currentTime,
                                potentialTime,
                                savings,
                                savingsPercentage: currentTime > 0 ? Math.round((savings / currentTime) * 100) : 0,
                                frequency: 'Quarterly audits = 4x/year',
                                extraImpact: 'Zero audit findings = reduced risk',
                                yearlyImpact: `${Math.round(savings * 4)} hours saved/year + compliance peace of mind`
                            };
                        }
                    }
                }
            },

            admin: {
                data_emergency_scenario: {
                    id: 'data_emergency_scenario',
                    name: 'Data Emergency Scenario',
                    icon: '💥',
                    scenario: `
                        <div class="scenario-box">
                            <div class="scenario-header">
                                <span class="text-2xl">💥</span>
                                <strong>Scenario: Critical Report Request</strong>
                            </div>
                            <p class="scenario-description">
                                Tuesday 3pm: Your VP emails "Need hiring metrics for board meeting tomorrow morning.
                                Can you send by 8am? Need: time-to-fill, source breakdown, cost-per-hire, offer
                                acceptance rate - for last 6 months."
                            </p>
                            <p class="scenario-question">
                                What's your process? <strong>(Select all that apply)</strong>
                            </p>
                        </div>
                    `,
                    options: [
                        {
                            id: 'export_systems',
                            label: 'I export data from 3-4 different systems',
                            timeImpact: 2,
                            painLevel: 4,
                            category: 'manual'
                        },
                        {
                            id: 'clean_data',
                            label: 'I clean data (duplicates, errors, missing fields)',
                            timeImpact: 3,
                            painLevel: 5,
                            category: 'manual'
                        },
                        {
                            id: 'manual_calculations',
                            label: 'I manually calculate metrics in Excel',
                            timeImpact: 2,
                            painLevel: 4,
                            category: 'manual'
                        },
                        {
                            id: 'create_charts',
                            label: 'I create charts and format presentation',
                            timeImpact: 1.5,
                            painLevel: 3,
                            category: 'manual'
                        },
                        {
                            id: 'evening_work',
                            label: 'I work late into the evening (past 10pm)',
                            timeImpact: 3,
                            painLevel: 5,
                            category: 'stress'
                        },
                        {
                            id: 'worry_accuracy',
                            label: 'I worry about data accuracy (no time to double-check)',
                            timeImpact: 0,
                            painLevel: 5,
                            category: 'stress'
                        },
                        {
                            id: 'integrated_data',
                            label: 'All data already integrated in data warehouse',
                            timeImpact: 0,
                            painLevel: 1,
                            category: 'automated'
                        },
                        {
                            id: 'auto_metrics',
                            label: 'Metrics auto-calculated in real-time dashboards',
                            timeImpact: 0,
                            painLevel: 1,
                            category: 'automated'
                        },
                        {
                            id: 'one_click_report',
                            label: 'One-click report generation with filters',
                            timeImpact: 0.1,
                            painLevel: 1,
                            category: 'automated'
                        },
                        {
                            id: 'done_in_minutes',
                            label: 'Report ready in 10 minutes, leave work on time',
                            timeImpact: 0.17,
                            painLevel: 1,
                            category: 'automated'
                        }
                    ],
                    analysis: {
                        getCurrentState: (selectedOptions) => {
                            const emergencyMode = selectedOptions.some(opt => opt.category === 'stress');
                            const automated = selectedOptions.some(opt => opt.category === 'automated');

                            if (emergencyMode && !automated) {
                                return {
                                    state: 'emergency',
                                    message: 'Ad-hoc reports trigger evening/weekend emergency mode',
                                    icon: '🚨'
                                };
                            } else if (automated) {
                                return {
                                    state: 'self_service',
                                    message: 'Stakeholders can get their own reports instantly',
                                    icon: '✅'
                                };
                            } else {
                                return {
                                    state: 'reactive',
                                    message: 'Reports are time-consuming but doable',
                                    icon: '😓'
                                };
                            }
                        },
                        calculateTimeImpact: (selectedOptions) => {
                            const currentTime = selectedOptions.reduce((sum, opt) => sum + opt.timeImpact, 0);
                            const potentialTime = 0.17; // With AI: ~10 minutes
                            const savings = currentTime - potentialTime;

                            return {
                                currentTime,
                                potentialTime,
                                savings,
                                savingsPercentage: currentTime > 0 ? Math.round((savings / currentTime) * 100) : 0,
                                frequency: 'If this happens 2x/month = 24x/year',
                                extraImpact: 'Stakeholder self-service = no more ad-hoc requests',
                                yearlyImpact: `${Math.round(savings * 24)} hours saved/year + predictable schedule`
                            };
                        }
                    }
                }
            }
        };
    }

    /**
     * Analyze scenario responses
     */
    analyzeScenario(businessUnit, scenarioId, selectedOptionIds) {
        const scenarios = this.scenarios[businessUnit];
        if (!scenarios) return null;

        const scenario = scenarios[scenarioId];
        if (!scenario) return null;

        // Get full option objects for selected IDs
        const selectedOptions = scenario.options.filter(opt => selectedOptionIds.includes(opt.id));

        // Run analysis
        const currentState = scenario.analysis.getCurrentState(selectedOptions);
        const timeImpact = scenario.analysis.calculateTimeImpact(selectedOptions);

        // Calculate pain score
        const avgPain = selectedOptions.reduce((sum, opt) => sum + opt.painLevel, 0) / selectedOptions.length;

        return {
            scenario: {
                id: scenario.id,
                name: scenario.name,
                icon: scenario.icon
            },
            currentState,
            timeImpact,
            avgPainLevel: Math.round(avgPain * 10) / 10,
            selectedOptions,
            recommendations: this.generateRecommendations(selectedOptions, currentState, timeImpact)
        };
    }

    /**
     * Generate recommendations based on scenario analysis
     */
    generateRecommendations(selectedOptions, currentState, timeImpact) {
        const recommendations = [];

        // Check if user has any automated options selected
        const hasAutomation = selectedOptions.some(opt => opt.category === 'automated');
        const hasManual = selectedOptions.some(opt => opt.category === 'manual');
        const hasStress = selectedOptions.some(opt => opt.category === 'stress');

        if (!hasAutomation && hasManual) {
            recommendations.push({
                priority: 'high',
                type: 'automation',
                message: 'Implement end-to-end automation to eliminate manual steps',
                impact: `Save ${Math.round(timeImpact.savings)} hours per occurrence`
            });
        }

        if (hasStress) {
            recommendations.push({
                priority: 'high',
                type: 'work_life_balance',
                message: 'Reduce weekend/evening work through preventive automation',
                impact: 'Improve work-life balance and reduce burnout risk'
            });
        }

        if (timeImpact.savingsPercentage > 80) {
            recommendations.push({
                priority: 'critical',
                type: 'efficiency',
                message: `You could reduce time spent by ${timeImpact.savingsPercentage}% with the right tools`,
                impact: `${timeImpact.savings} hours → ${timeImpact.potentialTime} hours`
            });
        }

        return recommendations;
    }

    /**
     * Render scenario analysis results
     */
    renderScenarioAnalysis(analysis) {
        if (!analysis) return '';

        const { scenario, currentState, timeImpact, avgPainLevel, recommendations } = analysis;

        const stateColor = {
            'optimized': 'green',
            'smooth': 'green',
            'handled': 'green',
            'audit_ready': 'green',
            'self_service': 'green',
            'hybrid': 'yellow',
            'struggling': 'yellow',
            'reactive': 'orange',
            'manual': 'red',
            'chaotic': 'red',
            'emergency_mode': 'red',
            'firefighting': 'red',
            'emergency': 'red'
        }[currentState.state] || 'gray';

        return `
            <div class="scenario-analysis bg-white rounded-xl shadow-lg p-6 mb-6">
                <div class="flex items-center gap-3 mb-6">
                    <span class="text-4xl">${scenario.icon}</span>
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">${scenario.name} - Analysis</h3>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="px-3 py-1 bg-${stateColor}-100 text-${stateColor}-800 text-sm font-semibold rounded-full flex items-center gap-2">
                                <span>${currentState.icon}</span>
                                <span>${currentState.message}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Time Impact -->
                <div class="grid md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-red-50 rounded-lg p-4 border border-red-200">
                        <div class="text-sm text-red-700 mb-1">Current Process</div>
                        <div class="text-3xl font-bold text-red-600">${timeImpact.currentTime.toFixed(1)}h</div>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div class="text-sm text-green-700 mb-1">With AI Automation</div>
                        <div class="text-3xl font-bold text-green-600">${timeImpact.potentialTime.toFixed(1)}h</div>
                    </div>
                    <div class="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <div class="text-sm text-indigo-700 mb-1">Time Saved</div>
                        <div class="text-3xl font-bold text-indigo-600">${timeImpact.savings.toFixed(1)}h</div>
                        <div class="text-xs text-indigo-600 mt-1">${timeImpact.savingsPercentage}% reduction</div>
                    </div>
                </div>

                ${timeImpact.frequency ? `
                    <div class="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                        <div class="flex items-start gap-2">
                            <span class="text-blue-600 font-semibold text-sm">Frequency:</span>
                            <span class="text-blue-900 text-sm">${timeImpact.frequency}</span>
                        </div>
                        ${timeImpact.yearlyImpact ? `
                            <div class="flex items-start gap-2 mt-2">
                                <span class="text-blue-600 font-semibold text-sm">Annual Impact:</span>
                                <span class="text-blue-900 text-sm">${timeImpact.yearlyImpact}</span>
                            </div>
                        ` : ''}
                        ${timeImpact.extraImpact ? `
                            <div class="flex items-start gap-2 mt-2">
                                <span class="text-blue-600 font-semibold text-sm">Extra Benefit:</span>
                                <span class="text-blue-900 text-sm">${timeImpact.extraImpact}</span>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}

                <!-- Pain Level -->
                <div class="mb-6">
                    <div class="text-sm text-gray-600 mb-2">Average Pain Level</div>
                    <div class="flex items-center gap-3">
                        <div class="flex-1 bg-gray-200 rounded-full h-3">
                            <div class="bg-gradient-to-r from-yellow-400 to-red-600 h-3 rounded-full"
                                 style="width: ${(avgPainLevel / 5) * 100}%"></div>
                        </div>
                        <span class="font-bold text-gray-900">${avgPainLevel}/5</span>
                    </div>
                </div>

                <!-- Recommendations -->
                ${recommendations && recommendations.length > 0 ? `
                    <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                        <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span>💡</span>
                            <span>Recommendations</span>
                        </h4>
                        <div class="space-y-3">
                            ${recommendations.map(rec => `
                                <div class="bg-white rounded-lg p-3 border-l-4 border-${rec.priority === 'critical' || rec.priority === 'high' ? 'red' : 'yellow'}-500">
                                    <div class="flex items-start justify-between mb-1">
                                        <span class="font-semibold text-gray-900 text-sm">${rec.message}</span>
                                        <span class="px-2 py-1 bg-${rec.priority === 'critical' || rec.priority === 'high' ? 'red' : 'yellow'}-100 text-${rec.priority === 'critical' || rec.priority === 'high' ? 'red' : 'yellow'}-800 text-xs font-semibold rounded uppercase">
                                            ${rec.priority}
                                        </span>
                                    </div>
                                    <div class="text-sm text-gray-600">${rec.impact}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Export scenario analysis
     */
    exportAnalysis(analysis) {
        return {
            ...analysis,
            exportedAt: new Date().toISOString()
        };
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ScenarioBasedAnalyzer = ScenarioBasedAnalyzer;
}
