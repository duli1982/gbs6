/**
 * Pain Point Intensity Scorer
 * Quantifies pain intensity across different workflow aspects
 * Prioritizes recommendations based on pain × frequency
 */

class PainIntensityScorer {
    constructor() {
        this.painLevels = this.initializePainLevels();
        this.painPoints = this.initializePainPoints();
    }

    /**
     * Initialize pain level definitions (1-5 scale)
     */
    initializePainLevels() {
        return {
            1: {
                label: 'Minor Annoyance',
                icon: '😊',
                color: 'green',
                description: 'Barely noticeable, easy to work around',
                urgency: 'low',
                multiplier: 1.0
            },
            2: {
                label: 'Noticeable Friction',
                icon: '🙂',
                color: 'blue',
                description: 'Slows you down but manageable',
                urgency: 'low',
                multiplier: 1.2
            },
            3: {
                label: 'Significant Bottleneck',
                icon: '😐',
                color: 'yellow',
                description: 'Regularly frustrating, impacts productivity',
                urgency: 'medium',
                multiplier: 1.5
            },
            4: {
                label: 'Major Time Sink',
                icon: '😤',
                color: 'orange',
                description: 'Consumes excessive time, very frustrating',
                urgency: 'high',
                multiplier: 2.0
            },
            5: {
                label: 'Critical Workflow Blocker',
                icon: '😫',
                color: 'red',
                description: 'Overwhelming, prevents effective work',
                urgency: 'critical',
                multiplier: 3.0
            }
        };
    }

    /**
     * Initialize pain point definitions for each business unit
     */
    initializePainPoints() {
        return {
            sourcing: {
                resume_screening: {
                    id: 'resume_screening',
                    name: 'Resume Screening & Review',
                    question: 'How painful is manually reviewing resumes for you?',
                    contextExamples: [
                        { level: 1, example: '1-2 resumes/day, straightforward roles' },
                        { level: 2, example: '5-10 resumes/day, some complexity' },
                        { level: 3, example: '20-30 resumes/day, time-consuming' },
                        { level: 4, example: '50+ resumes/day, overwhelming volume' },
                        { level: 5, example: '100+ resumes/day, impossible to keep up' }
                    ],
                    causes: {
                        1: 'Low volume, clear requirements',
                        2: 'Moderate volume or some ambiguity',
                        3: 'High volume or complex requirements',
                        4: 'Very high volume and/or urgent deadlines',
                        5: 'Extreme volume with unrealistic expectations'
                    },
                    aiSolutions: {
                        3: ['AI resume screeners', 'Skills matching automation'],
                        4: ['Bulk screening tools', 'ML-powered ranking', 'Auto-reject unqualified'],
                        5: ['Full automation pipeline', 'AI pre-screening + human review', 'Predictive candidate scoring']
                    }
                },
                boolean_search: {
                    id: 'boolean_search',
                    name: 'Boolean Search Creation',
                    question: 'How painful is creating effective boolean search strings?',
                    contextExamples: [
                        { level: 1, example: 'Simple searches, common skills' },
                        { level: 2, example: '15-30 minutes per search' },
                        { level: 3, example: '30-60 minutes, complex combinations' },
                        { level: 4, example: '1-2 hours, trial and error' },
                        { level: 5, example: 'Hours wasted, poor results' }
                    ],
                    aiSolutions: {
                        3: ['AI boolean generators', 'Search optimization tools'],
                        4: ['Advanced boolean AI', 'Semantic search'],
                        5: ['Full AI-powered talent intelligence', 'Natural language search']
                    }
                },
                candidate_engagement: {
                    id: 'candidate_engagement',
                    name: 'Candidate Outreach & Engagement',
                    question: 'How painful is managing candidate outreach and follow-ups?',
                    contextExamples: [
                        { level: 1, example: '5-10 candidates, high response rate' },
                        { level: 2, example: '20-30 candidates, decent responses' },
                        { level: 3, example: '50+ candidates, lots of follow-ups' },
                        { level: 4, example: '100+ candidates, low response rate' },
                        { level: 5, example: 'Hundreds of candidates, drowning in follow-ups' }
                    ],
                    aiSolutions: {
                        3: ['Outreach templates', 'Automated follow-up sequences'],
                        4: ['AI personalization', 'Multi-channel campaigns', 'Engagement scoring'],
                        5: ['Full automation', 'AI conversation management', 'Predictive engagement']
                    }
                }
            },

            scheduling: {
                reschedules: {
                    id: 'reschedules',
                    name: 'Reschedule Management',
                    question: 'How painful are reschedules for you?',
                    contextExamples: [
                        { level: 1, example: '1-2 reschedules/week, easy to fix' },
                        { level: 2, example: '3-5 reschedules/week, takes effort' },
                        { level: 3, example: '6-10 reschedules/week, slows you down' },
                        { level: 4, example: '11-15 reschedules/week, very frustrating' },
                        { level: 5, example: '15+ reschedules/week, overwhelming chaos' }
                    ],
                    causes: {
                        1: 'Rare occurrence, easy coordination',
                        2: 'Some panel conflicts',
                        3: 'Frequent conflicts, manual coordination',
                        4: 'Constant conflicts, hiring manager unavailability',
                        5: 'Systematic coordination breakdown'
                    },
                    aiSolutions: {
                        3: ['Self-scheduling links', 'Automated rescheduling'],
                        4: ['AI scheduling assistant', 'Instant reschedule options', 'Panel coordination automation'],
                        5: ['Full scheduling automation', 'AI conflict resolution', 'Predictive scheduling']
                    }
                },
                calendar_coordination: {
                    id: 'calendar_coordination',
                    name: 'Multi-Party Calendar Coordination',
                    question: 'How painful is coordinating calendars across panels?',
                    contextExamples: [
                        { level: 1, example: '2-3 people, usually available' },
                        { level: 2, example: '4-5 people, some back-and-forth' },
                        { level: 3, example: '6-8 people, lots of emails' },
                        { level: 4, example: '8+ people, days to find time' },
                        { level: 5, example: 'Large panels, timezone chaos, never-ending emails' }
                    ],
                    aiSolutions: {
                        3: ['Group scheduling tools', 'Availability polling'],
                        4: ['AI time-finding', 'Instant panel coordination', 'Timezone optimization'],
                        5: ['Full automation', 'AI panel optimization', 'Self-service scheduling']
                    }
                }
            },

            compliance: {
                audit_prep: {
                    id: 'audit_prep',
                    name: 'Audit Preparation',
                    question: 'How painful is preparing for compliance audits?',
                    contextExamples: [
                        { level: 1, example: '1-2 hours, well-organized records' },
                        { level: 2, example: '4-6 hours, some scrambling' },
                        { level: 3, example: '8-12 hours, lots of hunting for docs' },
                        { level: 4, example: '15-20 hours, weekend work' },
                        { level: 5, example: '20+ hours, panic mode, missing docs' }
                    ],
                    aiSolutions: {
                        3: ['Auto-generated audit trails', 'Document automation'],
                        4: ['AI audit readiness', 'Compliance dashboards', 'Gap detection'],
                        5: ['Always-audit-ready system', 'Real-time compliance monitoring', 'Predictive issue detection']
                    }
                },
                policy_updates: {
                    id: 'policy_updates',
                    name: 'Tracking Policy Changes',
                    question: 'How painful is staying current with policy updates?',
                    contextExamples: [
                        { level: 1, example: 'Occasional updates, clear guidance' },
                        { level: 2, example: 'Monthly updates, manageable' },
                        { level: 3, example: 'Weekly updates, hard to track' },
                        { level: 4, example: 'Constant changes, overwhelming' },
                        { level: 5, example: 'Can\'t keep up, compliance risk' }
                    ],
                    aiSolutions: {
                        3: ['Policy change alerts', 'Compliance tracking'],
                        4: ['AI policy monitoring', 'Impact analysis', 'Auto-updates'],
                        5: ['Full regulatory intelligence', 'Predictive compliance', 'Auto-remediation']
                    }
                }
            },

            contracts: {
                legal_review: {
                    id: 'legal_review',
                    name: 'Legal Review Wait Time',
                    question: 'How painful are legal review delays?',
                    contextExamples: [
                        { level: 1, example: 'Same-day turnaround' },
                        { level: 2, example: '1-2 day wait' },
                        { level: 3, example: '3-5 days, slows deals' },
                        { level: 4, example: '1-2 weeks, deals at risk' },
                        { level: 5, example: 'Weeks, deals fall through' }
                    ],
                    aiSolutions: {
                        3: ['Pre-approved clause library', 'AI risk scoring'],
                        4: ['AI contract review', 'Automated redlines', 'Risk detection'],
                        5: ['Full AI legal review', 'Instant approvals', 'Predictive negotiation']
                    }
                },
                redline_management: {
                    id: 'redline_management',
                    name: 'Redline & Negotiation Cycles',
                    question: 'How painful are redline cycles?',
                    contextExamples: [
                        { level: 1, example: '1 round, minor changes' },
                        { level: 2, example: '2-3 rounds, manageable' },
                        { level: 3, example: '4-5 rounds, time-consuming' },
                        { level: 4, example: '6+ rounds, very frustrating' },
                        { level: 5, example: '10+ rounds, never-ending' }
                    ],
                    aiSolutions: {
                        3: ['Redline tracking', 'Version control'],
                        4: ['AI clause suggestions', 'Negotiation intelligence', 'Auto-compromise'],
                        5: ['Full AI negotiation', 'Predictive concessions', 'Smart escalation']
                    }
                }
            },

            admin: {
                data_quality: {
                    id: 'data_quality',
                    name: 'Data Quality & Cleanup',
                    question: 'How painful is maintaining data quality?',
                    contextExamples: [
                        { level: 1, example: 'Occasional cleanup, mostly clean' },
                        { level: 2, example: 'Weekly cleanup, some duplicates' },
                        { level: 3, example: 'Daily cleanup, many errors' },
                        { level: 4, example: 'Constant cleanup, never-ending errors' },
                        { level: 5, example: 'Data chaos, can\'t keep up' }
                    ],
                    aiSolutions: {
                        3: ['Auto-deduplication', 'Data validation'],
                        4: ['AI data quality', 'Real-time validation', 'Auto-correction'],
                        5: ['Full data quality automation', 'Predictive error prevention', 'Self-healing data']
                    }
                },
                manual_reporting: {
                    id: 'manual_reporting',
                    name: 'Manual Report Creation',
                    question: 'How painful is creating reports manually?',
                    contextExamples: [
                        { level: 1, example: '30 minutes, simple reports' },
                        { level: 2, example: '1-2 hours, some complexity' },
                        { level: 3, example: '3-5 hours, lots of data wrangling' },
                        { level: 4, example: '6-8 hours, very complex' },
                        { level: 5, example: '10+ hours, weekend work' }
                    ],
                    aiSolutions: {
                        3: ['Report templates', 'Basic automation'],
                        4: ['Auto-generated reports', 'AI insights', 'Self-service dashboards'],
                        5: ['Full automation', 'Predictive analytics', 'AI-generated insights']
                    }
                }
            }
        };
    }

    /**
     * Analyze pain intensity from user answers
     */
    analyzePainIntensity(businessUnit, answers) {
        const painPoints = this.painPoints[businessUnit];
        if (!painPoints) return null;

        const analyzedPains = [];
        let totalPainScore = 0;
        let maxPainScore = 0;

        for (const [key, painPoint] of Object.entries(painPoints)) {
            const painAnswerKey = `${painPoint.id}_pain`;
            const frequencyAnswerKey = `${painPoint.id}_frequency`;

            const painLevel = parseInt(answers[painAnswerKey]) || null;
            const frequency = answers[frequencyAnswerKey] || null;

            if (painLevel) {
                const painLevelData = this.painLevels[painLevel];
                const priorityScore = this.calculatePriorityScore(painLevel, frequency);

                analyzedPains.push({
                    ...painPoint,
                    painLevel,
                    painLevelData,
                    frequency,
                    priorityScore,
                    recommendations: this.getRecommendations(painPoint, painLevel)
                });

                totalPainScore += painLevel;
                maxPainScore += 5;
            }
        }

        // Sort by priority score (highest pain × frequency first)
        analyzedPains.sort((a, b) => b.priorityScore - a.priorityScore);

        const avgPainLevel = analyzedPains.length > 0
            ? totalPainScore / analyzedPains.length
            : 0;

        const painPercentage = maxPainScore > 0
            ? (totalPainScore / maxPainScore) * 100
            : 0;

        return {
            businessUnit,
            painPoints: analyzedPains,
            avgPainLevel: Math.round(avgPainLevel * 10) / 10,
            totalPainScore,
            painPercentage: Math.round(painPercentage),
            criticalPains: analyzedPains.filter(p => p.painLevel >= 4),
            moderatePains: analyzedPains.filter(p => p.painLevel === 3),
            minorPains: analyzedPains.filter(p => p.painLevel <= 2),
            topPriority: analyzedPains[0] || null
        };
    }

    /**
     * Calculate priority score (pain × frequency multiplier)
     */
    calculatePriorityScore(painLevel, frequency) {
        const painMultiplier = this.painLevels[painLevel]?.multiplier || 1.0;

        const frequencyMultipliers = {
            'hourly': 40,
            'daily': 20,
            'weekly': 5,
            'monthly': 1,
            'quarterly': 0.25,
            'rarely': 0.1
        };

        const freqMultiplier = frequencyMultipliers[frequency?.toLowerCase()] || 1;

        return painLevel * painMultiplier * freqMultiplier;
    }

    /**
     * Get AI recommendations based on pain level
     */
    getRecommendations(painPoint, painLevel) {
        const solutions = painPoint.aiSolutions;

        // Get solutions for this pain level and higher levels
        const relevantSolutions = [];
        for (let level = painLevel; level >= 3; level--) {
            if (solutions[level]) {
                relevantSolutions.push(...solutions[level]);
            }
        }

        return [...new Set(relevantSolutions)]; // Remove duplicates
    }

    /**
     * Render pain intensity analysis HTML
     */
    renderPainAnalysis(analysis) {
        if (!analysis || !analysis.painPoints || analysis.painPoints.length === 0) {
            return '';
        }

        const { painPoints, avgPainLevel, painPercentage, criticalPains, topPriority } = analysis;

        return `
            <div class="pain-intensity-analysis bg-white rounded-xl shadow-lg p-6 mb-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="text-3xl">😤</div>
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">Pain Point Analysis</h3>
                        <p class="text-sm text-gray-600">
                            Avg Pain Level: ${avgPainLevel}/5 | Overall Pain: ${painPercentage}%
                        </p>
                    </div>
                </div>

                ${criticalPains.length > 0 ? `
                    <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                        <h4 class="font-semibold text-red-900 mb-2 flex items-center gap-2">
                            <span>🚨</span>
                            <span>${criticalPains.length} Critical Pain Point${criticalPains.length === 1 ? '' : 's'} Detected</span>
                        </h4>
                        <p class="text-sm text-red-800">
                            These high-intensity pain points are consuming excessive time and energy.
                            Addressing them will have immediate, significant impact.
                        </p>
                    </div>
                ` : ''}

                ${topPriority ? `
                    <div class="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl p-6 mb-6">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="text-2xl">${topPriority.painLevelData.icon}</span>
                                    <h4 class="text-xl font-bold text-gray-900">Top Priority</h4>
                                    <span class="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full uppercase">
                                        ${topPriority.painLevelData.urgency}
                                    </span>
                                </div>
                                <h5 class="text-lg font-semibold text-gray-900">${topPriority.name}</h5>
                            </div>
                            <div class="text-right">
                                <div class="text-3xl font-bold text-${topPriority.painLevelData.color}-600">
                                    ${topPriority.painLevel}/5
                                </div>
                                <div class="text-xs text-gray-600">Pain Level</div>
                            </div>
                        </div>

                        <div class="mb-4">
                            <div class="text-sm text-gray-700 mb-2">
                                <strong>Your situation:</strong> ${topPriority.painLevelData.description}
                            </div>
                            ${topPriority.frequency ? `
                                <div class="text-sm text-gray-700">
                                    <strong>Frequency:</strong> ${topPriority.frequency}
                                </div>
                            ` : ''}
                        </div>

                        ${topPriority.recommendations && topPriority.recommendations.length > 0 ? `
                            <div class="bg-white rounded-lg p-4 border border-orange-200">
                                <h6 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <span>💡</span>
                                    <span>Immediate Solutions</span>
                                </h6>
                                <ul class="space-y-1">
                                    ${topPriority.recommendations.map(rec => `
                                        <li class="flex items-start gap-2 text-sm text-gray-700">
                                            <span class="text-orange-600">•</span>
                                            <span>${rec}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}

                <!-- All Pain Points -->
                <div class="space-y-4">
                    <h4 class="font-semibold text-gray-900">All Pain Points (Priority Order)</h4>
                    ${painPoints.map((pain, index) => this.renderPainCard(pain, index + 1)).join('')}
                </div>

                <!-- Pain Summary -->
                <div class="mt-6 grid md:grid-cols-3 gap-4">
                    <div class="bg-red-50 rounded-lg p-4 border border-red-200">
                        <div class="text-2xl font-bold text-red-600">${criticalPains.length}</div>
                        <div class="text-sm text-red-800">Critical (Level 4-5)</div>
                    </div>
                    <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div class="text-2xl font-bold text-yellow-600">${analysis.moderatePains.length}</div>
                        <div class="text-sm text-yellow-800">Moderate (Level 3)</div>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div class="text-2xl font-bold text-green-600">${analysis.minorPains.length}</div>
                        <div class="text-sm text-green-800">Minor (Level 1-2)</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render individual pain point card
     */
    renderPainCard(pain, index) {
        const colorClass = {
            'red': 'border-red-300 bg-red-50',
            'orange': 'border-orange-300 bg-orange-50',
            'yellow': 'border-yellow-300 bg-yellow-50',
            'blue': 'border-blue-300 bg-blue-50',
            'green': 'border-green-300 bg-green-50'
        }[pain.painLevelData.color] || 'border-gray-300 bg-gray-50';

        return `
            <div class="border-2 ${colorClass} rounded-lg p-4">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">${pain.painLevelData.icon}</span>
                        <div>
                            <div class="font-semibold text-gray-900">${index}. ${pain.name}</div>
                            <div class="text-xs text-gray-600">${pain.painLevelData.label}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-xl font-bold text-${pain.painLevelData.color}-600">${pain.painLevel}/5</div>
                        ${pain.frequency ? `
                            <div class="text-xs text-gray-600">${pain.frequency}</div>
                        ` : ''}
                    </div>
                </div>

                <div class="flex items-center gap-2 mb-3">
                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                        <div class="bg-${pain.painLevelData.color}-600 h-2 rounded-full"
                             style="width: ${(pain.painLevel / 5) * 100}%"></div>
                    </div>
                    <span class="text-xs font-semibold text-gray-600">
                        Priority: ${Math.round(pain.priorityScore)}
                    </span>
                </div>

                ${pain.recommendations && pain.recommendations.length > 0 ? `
                    <details class="text-sm">
                        <summary class="cursor-pointer text-${pain.painLevelData.color}-700 font-medium hover:text-${pain.painLevelData.color}-900">
                            View ${pain.recommendations.length} recommended solution${pain.recommendations.length === 1 ? '' : 's'}
                        </summary>
                        <ul class="mt-2 space-y-1 ml-4">
                            ${pain.recommendations.map(rec => `
                                <li class="text-${pain.painLevelData.color}-700">• ${rec}</li>
                            `).join('')}
                        </ul>
                    </details>
                ` : ''}
            </div>
        `;
    }

    /**
     * Export pain analysis
     */
    exportPainAnalysis(analysis) {
        return {
            ...analysis,
            exportedAt: new Date().toISOString()
        };
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.PainIntensityScorer = PainIntensityScorer;
}
