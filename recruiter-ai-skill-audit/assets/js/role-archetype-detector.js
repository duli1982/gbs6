/**
 * Role Archetype Detector
 * Identifies user's role archetype within their business unit
 * Provides archetype-specific recommendations and insights
 */

class RoleArchetypeDetector {
    constructor() {
        this.archetypes = this.initializeArchetypes();
        this.matchThreshold = 0.6; // 60% match required
    }

    /**
     * Initialize archetype definitions for each business unit
     */
    initializeArchetypes() {
        return {
            sourcing: [
                {
                    id: 'volume_hunter',
                    name: 'The Volume Hunter',
                    icon: '🎯',
                    description: 'High-volume recruiter focused on speed and efficiency',
                    characteristics: [
                        '20+ active roles simultaneously',
                        'Speed prioritized over deep research',
                        'High candidate throughput',
                        'Emphasis on metrics and numbers'
                    ],
                    signals: {
                        sourcing_active_roles: ['11-20', '20+'],
                        profile_review_time: { min: 10, max: 100 }, // High volume = high time
                        sourcing_pain_points: ['screening', 'volume']
                    },
                    strengths: [
                        'Excellent at managing multiple requisitions',
                        'Strong pipeline management',
                        'Efficient workflow optimization'
                    ],
                    challenges: [
                        'May sacrifice quality for quantity',
                        'Burnout risk from high volume',
                        'Less time for relationship building'
                    ],
                    aiRecommendations: [
                        {
                            tool: 'Bulk Resume Screeners',
                            why: 'Process hundreds of profiles in minutes',
                            examples: ['HireVue', 'Paradox', 'SeekOut']
                        },
                        {
                            tool: 'ATS Automation',
                            why: 'Streamline candidate pipeline management',
                            examples: ['Greenhouse Auto-Advance', 'Lever Nurture']
                        },
                        {
                            tool: 'Automated Outreach Sequences',
                            why: 'Scale personalized outreach',
                            examples: ['Gem', 'Hiretual Sequences']
                        }
                    ],
                    notRecommended: [
                        {
                            tool: 'Manual Talent Mapping',
                            why: 'Too time-intensive for your volume'
                        },
                        {
                            tool: 'Deep Research Tools',
                            why: 'Better suited for niche specialists'
                        }
                    ]
                },
                {
                    id: 'niche_specialist',
                    name: 'The Niche Specialist',
                    icon: '🔬',
                    description: 'Expert recruiter for hard-to-fill, specialized roles',
                    characteristics: [
                        '1-5 highly specialized roles',
                        'Deep research and market knowledge',
                        'Quality over quantity approach',
                        'Long search cycles (90+ days typical)'
                    ],
                    signals: {
                        sourcing_active_roles: ['1-5'],
                        boolean_search_time: { min: 5, max: 100 }, // High research time
                        sourcing_specialization: ['executive', 'technical', 'niche']
                    },
                    strengths: [
                        'Deep market knowledge and intelligence',
                        'Strong candidate relationships',
                        'High-quality placements'
                    ],
                    challenges: [
                        'Time-consuming research phases',
                        'Limited candidate pools',
                        'Pressure to fill difficult roles'
                    ],
                    aiRecommendations: [
                        {
                            tool: 'AI Talent Intelligence',
                            why: 'Surface hidden passive candidates',
                            examples: ['LinkedIn Talent Insights', 'Eightfold AI']
                        },
                        {
                            tool: 'Advanced Boolean Generators',
                            why: 'Create sophisticated search strings',
                            examples: ['SeekOut Boolean Builder', 'Amazing Hiring']
                        },
                        {
                            tool: 'Competitive Intelligence',
                            why: 'Map talent at competitor companies',
                            examples: ['HG Insights', 'Reveal']
                        }
                    ],
                    notRecommended: [
                        {
                            tool: 'Bulk Screening Tools',
                            why: 'Your low volume doesn\'t justify automation'
                        }
                    ]
                },
                {
                    id: 'relationship_builder',
                    name: 'The Relationship Builder',
                    icon: '🤝',
                    description: 'Focus on long-term candidate relationships and engagement',
                    characteristics: [
                        'Medium volume (6-10 roles)',
                        'High engagement, nurture-focused',
                        'Strong candidate experience emphasis',
                        'Pipeline development over immediate fills'
                    ],
                    signals: {
                        sourcing_active_roles: ['6-10'],
                        followup_time: { min: 5, max: 100 }, // High follow-up investment
                        sourcing_approach: ['relationship', 'nurture', 'engagement']
                    },
                    strengths: [
                        'Exceptional candidate experience',
                        'Strong talent community building',
                        'High offer acceptance rates'
                    ],
                    challenges: [
                        'Time-intensive relationship management',
                        'Balancing nurture with urgency',
                        'Scaling personalization'
                    ],
                    aiRecommendations: [
                        {
                            tool: 'CRM & Nurture Automation',
                            why: 'Maintain relationships at scale',
                            examples: ['Gem', 'Beamery', 'SmashFly']
                        },
                        {
                            tool: 'AI Message Personalization',
                            why: 'Personalize outreach without manual effort',
                            examples: ['Phenom', 'Paradox']
                        },
                        {
                            tool: 'Engagement Scoring',
                            why: 'Prioritize high-interest candidates',
                            examples: ['Eightfold', 'Beamery']
                        }
                    ],
                    notRecommended: []
                },
                {
                    id: 'research_analyst',
                    name: 'The Research Analyst',
                    icon: '📊',
                    description: 'Data-driven recruiter focused on market intelligence',
                    characteristics: [
                        'Low volume but high complexity',
                        'Executive or leadership roles',
                        'Heavy emphasis on market mapping',
                        'Strategic talent planning'
                    ],
                    signals: {
                        sourcing_active_roles: ['1-5'],
                        boolean_search_time: { min: 8, max: 100 },
                        sourcing_focus: ['executive', 'leadership', 'strategy']
                    },
                    strengths: [
                        'Exceptional market knowledge',
                        'Strategic talent mapping',
                        'Data-driven decision making'
                    ],
                    challenges: [
                        'Time-consuming research',
                        'Information overload',
                        'Balancing analysis with action'
                    ],
                    aiRecommendations: [
                        {
                            tool: 'Market Mapping AI',
                            why: 'Automate organizational charts and talent mapping',
                            examples: ['Draup', 'Talent Neuron']
                        },
                        {
                            tool: 'Competitive Intelligence',
                            why: 'Real-time market insights',
                            examples: ['HG Insights', 'ZoomInfo']
                        },
                        {
                            tool: 'Talent Analytics',
                            why: 'Predictive hiring intelligence',
                            examples: ['LinkedIn Talent Insights', 'Eightfold']
                        }
                    ],
                    notRecommended: [
                        {
                            tool: 'High-volume automation',
                            why: 'Doesn\'t match your strategic focus'
                        }
                    ]
                }
            ],

            scheduling: [
                {
                    id: 'high_volume_coordinator',
                    name: 'The High-Volume Coordinator',
                    icon: '⚡',
                    description: 'Managing 20+ interviews weekly with speed and efficiency',
                    characteristics: [
                        '20+ interviews per week',
                        'Multiple requisitions simultaneously',
                        'Speed is critical',
                        'High reschedule volume'
                    ],
                    signals: {
                        scheduling_interviews_per_week: ['16-25', '25+'],
                        reschedule_pain: { min: 4, max: 5 }
                    },
                    aiRecommendations: [
                        {
                            tool: 'Full Scheduling Automation',
                            why: 'Eliminate manual coordination entirely',
                            examples: ['Calendly Enterprise', 'Goodtime', 'Interview Schedule']
                        },
                        {
                            tool: 'AI Scheduling Assistant',
                            why: 'Find optimal times across panels instantly',
                            examples: ['x.ai', 'Clara', 'Clockwise']
                        }
                    ]
                },
                {
                    id: 'white_glove_coordinator',
                    name: 'The White-Glove Coordinator',
                    icon: '✨',
                    description: 'Executive and VIP candidate scheduling with high touch',
                    characteristics: [
                        'Low volume (1-10 interviews)',
                        'High-touch, personalized service',
                        'Executive or senior roles',
                        'Complex multi-stage processes'
                    ],
                    signals: {
                        scheduling_interviews_per_week: ['1-5', '6-10'],
                        scheduling_complexity: ['high', 'executive']
                    },
                    aiRecommendations: [
                        {
                            tool: 'Smart Scheduling with Personal Touch',
                            why: 'Automation with customization options',
                            examples: ['Calendly Premium', 'Goodtime Hire']
                        },
                        {
                            tool: 'VIP Candidate Experience',
                            why: 'Elevated candidate journey tools',
                            examples: ['Phenom', 'Modern Hire']
                        }
                    ]
                }
            ],

            compliance: [
                {
                    id: 'firefighter',
                    name: 'The Firefighter',
                    icon: '🚒',
                    description: 'Reactive compliance management with constant issue resolution',
                    characteristics: [
                        '10+ hours/week on compliance',
                        'Frequent audit findings',
                        'Reactive approach',
                        'High-stress workload'
                    ],
                    signals: {
                        compliance_weekly_time: ['10+ hours'],
                        compliance_approach: ['reactive', 'issue-driven']
                    },
                    aiRecommendations: [
                        {
                            tool: 'Proactive Compliance Monitoring',
                            why: 'Catch issues before they become problems',
                            examples: ['Workday Compliance', 'ADP Compliance']
                        },
                        {
                            tool: 'Automated Audit Trails',
                            why: 'Always audit-ready',
                            examples: ['Greenhouse Compliance', 'iCIMS Compliance']
                        }
                    ]
                },
                {
                    id: 'strategic_guardian',
                    name: 'The Strategic Guardian',
                    icon: '🛡️',
                    description: 'Proactive compliance strategy and prevention',
                    characteristics: [
                        'Moderate time investment (5-10 hours)',
                        'Preventive approach',
                        'Strategic planning',
                        'Few audit issues'
                    ],
                    signals: {
                        compliance_weekly_time: ['5-10 hours'],
                        compliance_approach: ['proactive', 'strategic']
                    },
                    aiRecommendations: [
                        {
                            tool: 'Predictive Compliance Analytics',
                            why: 'Anticipate future compliance risks',
                            examples: ['Eightfold Compliance', 'Workday Analytics']
                        }
                    ]
                }
            ],

            contracts: [
                {
                    id: 'deal_closer',
                    name: 'The Deal Closer',
                    icon: '💼',
                    description: 'High-volume contract processing with speed focus',
                    characteristics: [
                        '20+ contracts per month',
                        'Speed is priority',
                        'Standardized contracts',
                        'Minimal customization'
                    ],
                    signals: {
                        contracts_per_month: ['16-20', '20+'],
                        contract_complexity: ['standard', 'template-based']
                    },
                    aiRecommendations: [
                        {
                            tool: 'Contract Auto-Generation',
                            why: 'Generate contracts in seconds',
                            examples: ['DocuSign Gen', 'PandaDoc', 'Ironclad']
                        },
                        {
                            tool: 'Bulk E-Signature',
                            why: 'Process multiple contracts simultaneously',
                            examples: ['DocuSign', 'Adobe Sign']
                        }
                    ]
                },
                {
                    id: 'negotiation_expert',
                    name: 'The Negotiation Expert',
                    icon: '⚖️',
                    description: 'Complex contract negotiations with heavy customization',
                    characteristics: [
                        'Low-medium volume (1-15 contracts)',
                        'Heavy redlines and negotiations',
                        'Custom terms common',
                        'Legal review intensive'
                    ],
                    signals: {
                        contracts_per_month: ['1-5', '6-10'],
                        legal_review_time: { min: 5, max: 100 }
                    },
                    aiRecommendations: [
                        {
                            tool: 'AI Contract Review',
                            why: 'Identify risks and suggest clauses',
                            examples: ['Ironclad', 'LawGeex', 'Kira Systems']
                        },
                        {
                            tool: 'Smart Redline Management',
                            why: 'Track and manage negotiation changes',
                            examples: ['Concord', 'ContractPodAi']
                        }
                    ]
                }
            ],

            admin: [
                {
                    id: 'data_wrangler',
                    name: 'The Data Wrangler',
                    icon: '🗂️',
                    description: 'Heavy data entry and system coordination workload',
                    characteristics: [
                        '10+ hours/week on data entry',
                        'Multiple system coordination',
                        'Manual data movement',
                        'High error risk'
                    ],
                    signals: {
                        data_entry_time: { min: 10, max: 100 },
                        system_coordination_time: { min: 5, max: 100 }
                    },
                    aiRecommendations: [
                        {
                            tool: 'Automated Data Entry',
                            why: 'Eliminate manual typing',
                            examples: ['UiPath', 'Automation Anywhere']
                        },
                        {
                            tool: 'System Integration AI',
                            why: 'Auto-sync between systems',
                            examples: ['Zapier', 'Workato', 'Tray.io']
                        }
                    ]
                },
                {
                    id: 'insights_generator',
                    name: 'The Insights Generator',
                    icon: '📈',
                    description: 'Focus on reporting and analytics delivery',
                    characteristics: [
                        '5+ hours/week on reports',
                        'Data visualization emphasis',
                        'Stakeholder reporting',
                        'Insight generation'
                    ],
                    signals: {
                        report_generation_time: { min: 5, max: 100 }
                    },
                    aiRecommendations: [
                        {
                            tool: 'Auto-Generated Reports',
                            why: 'Create reports in minutes, not hours',
                            examples: ['Tableau', 'Power BI', 'Looker']
                        },
                        {
                            tool: 'AI Insight Generation',
                            why: 'Automatically surface trends and anomalies',
                            examples: ['ThoughtSpot', 'Sisense']
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Detect user's archetype based on answers
     */
    detectArchetype(businessUnit, answers) {
        const archetypes = this.archetypes[businessUnit];
        if (!archetypes) return null;

        // Score each archetype
        const scoredArchetypes = archetypes.map(archetype => {
            const score = this.calculateArchetypeScore(archetype, answers);
            return {
                ...archetype,
                score,
                matchPercentage: Math.round(score * 100)
            };
        });

        // Sort by score
        scoredArchetypes.sort((a, b) => b.score - a.score);

        // Get best match
        const bestMatch = scoredArchetypes[0];
        const isStrongMatch = bestMatch.score >= this.matchThreshold;

        return {
            primaryArchetype: bestMatch,
            isStrongMatch,
            alternativeArchetypes: scoredArchetypes.slice(1, 3),
            allScores: scoredArchetypes
        };
    }

    /**
     * Calculate how well answers match an archetype
     */
    calculateArchetypeScore(archetype, answers) {
        const signals = archetype.signals;
        if (!signals) return 0;

        let matchCount = 0;
        let totalSignals = 0;

        for (const [key, expectedValue] of Object.entries(signals)) {
            totalSignals++;
            const userValue = answers[key];

            if (!userValue) continue;

            // Check if it's an array match (exact value in array)
            if (Array.isArray(expectedValue)) {
                if (expectedValue.includes(userValue)) {
                    matchCount++;
                }
            }
            // Check if it's a range match
            else if (expectedValue.min !== undefined && expectedValue.max !== undefined) {
                const numValue = parseFloat(userValue);
                if (numValue >= expectedValue.min && numValue <= expectedValue.max) {
                    matchCount++;
                }
            }
            // Check if it's a string match (contains keyword)
            else if (typeof expectedValue === 'string') {
                if (userValue.toLowerCase().includes(expectedValue.toLowerCase())) {
                    matchCount++;
                }
            }
        }

        return totalSignals > 0 ? matchCount / totalSignals : 0;
    }

    /**
     * Render archetype card HTML
     */
    renderArchetypeCard(archetypeDetection) {
        if (!archetypeDetection || !archetypeDetection.primaryArchetype) return '';

        const { primaryArchetype, isStrongMatch, alternativeArchetypes } = archetypeDetection;

        return `
            <div class="archetype-card bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-6">
                <div class="flex items-start gap-4 mb-6">
                    <div class="text-6xl">${primaryArchetype.icon}</div>
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <h3 class="text-2xl font-bold text-gray-900">${primaryArchetype.name}</h3>
                            <div class="px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full">
                                ${primaryArchetype.matchPercentage}% Match
                            </div>
                        </div>
                        <p class="text-gray-700 mb-4">${primaryArchetype.description}</p>
                        ${!isStrongMatch ? `
                            <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded text-sm">
                                <strong>Note:</strong> This is your closest match, but the confidence is moderate.
                                You may blend characteristics from multiple archetypes.
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Characteristics -->
                <div class="mb-6">
                    <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span>✨</span>
                        <span>Your Characteristics</span>
                    </h4>
                    <div class="grid md:grid-cols-2 gap-2">
                        ${primaryArchetype.characteristics.map(char => `
                            <div class="flex items-start gap-2 text-sm text-gray-700">
                                <span class="text-indigo-600">•</span>
                                <span>${char}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Strengths & Challenges -->
                <div class="grid md:grid-cols-2 gap-4 mb-6">
                    <div class="bg-white rounded-lg p-4">
                        <h5 class="font-semibold text-green-700 mb-2 flex items-center gap-2">
                            <span>💪</span>
                            <span>Your Strengths</span>
                        </h5>
                        <ul class="space-y-1 text-sm text-gray-700">
                            ${primaryArchetype.strengths.map(strength => `
                                <li class="flex items-start gap-2">
                                    <span class="text-green-600">✓</span>
                                    <span>${strength}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="bg-white rounded-lg p-4">
                        <h5 class="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                            <span>⚠️</span>
                            <span>Your Challenges</span>
                        </h5>
                        <ul class="space-y-1 text-sm text-gray-700">
                            ${primaryArchetype.challenges.map(challenge => `
                                <li class="flex items-start gap-2">
                                    <span class="text-orange-600">→</span>
                                    <span>${challenge}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>

                <!-- AI Recommendations -->
                <div class="bg-white rounded-lg p-4 mb-4">
                    <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span>🤖</span>
                        <span>AI Tools for ${primaryArchetype.name}s</span>
                    </h4>
                    <div class="space-y-3">
                        ${primaryArchetype.aiRecommendations.map(rec => `
                            <div class="border-l-4 border-indigo-500 pl-4">
                                <div class="font-semibold text-gray-900">${rec.tool}</div>
                                <div class="text-sm text-gray-600 mb-1">${rec.why}</div>
                                <div class="text-xs text-indigo-600">
                                    Examples: ${rec.examples.join(', ')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${primaryArchetype.notRecommended && primaryArchetype.notRecommended.length > 0 ? `
                    <div class="bg-red-50 rounded-lg p-4 border border-red-200">
                        <h5 class="font-semibold text-red-800 mb-2 flex items-center gap-2">
                            <span>❌</span>
                            <span>Not Recommended for You</span>
                        </h5>
                        <div class="space-y-2">
                            ${primaryArchetype.notRecommended.map(rec => `
                                <div class="text-sm">
                                    <span class="font-medium text-red-900">${rec.tool}:</span>
                                    <span class="text-red-700"> ${rec.why}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${alternativeArchetypes && alternativeArchetypes.length > 0 ? `
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <details class="cursor-pointer">
                            <summary class="font-semibold text-gray-700 text-sm">
                                See Alternative Archetypes (${alternativeArchetypes.length})
                            </summary>
                            <div class="mt-3 space-y-2">
                                ${alternativeArchetypes.map(alt => `
                                    <div class="bg-gray-50 rounded p-3">
                                        <div class="flex items-center gap-2 mb-1">
                                            <span class="text-2xl">${alt.icon}</span>
                                            <span class="font-semibold text-gray-900">${alt.name}</span>
                                            <span class="text-xs text-gray-600">(${alt.matchPercentage}% match)</span>
                                        </div>
                                        <p class="text-sm text-gray-600">${alt.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </details>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Export archetype detection
     */
    exportArchetypeDetection(archetypeDetection) {
        return {
            ...archetypeDetection,
            exportedAt: new Date().toISOString()
        };
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.RoleArchetypeDetector = RoleArchetypeDetector;
}
