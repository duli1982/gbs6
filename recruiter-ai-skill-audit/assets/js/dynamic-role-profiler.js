/**
 * Dynamic Role Profiling Engine
 *
 * Builds comprehensive role profile ("Role DNA") from all user answers,
 * going beyond just business unit to create multi-dimensional persona.
 *
 * Features:
 * - 8 profile dimensions (volume, AI maturity, pain profile, efficiency, etc.)
 * - Dynamic persona generation
 * - Profile-based recommendation tailoring
 * - Evolution prediction with AI adoption
 * - Comparative positioning vs typical peers
 */

class DynamicRoleProfiler {
    constructor() {
        this.dimensions = this.defineProfileDimensions();
        this.personas = this.definePersonas();
        this.evolutionPaths = this.defineEvolutionPaths();
    }

    /**
     * Define 8 core profile dimensions
     */
    defineProfileDimensions() {
        return {
            volumeLevel: {
                name: 'Volume Level',
                icon: '📊',
                description: 'How much work you handle',
                levels: {
                    low: {
                        label: 'Low Volume',
                        icon: '🔹',
                        description: 'Handling a manageable workload with time for deep work',
                        characteristics: ['Few concurrent projects', 'Time for detailed work', 'Quality over quantity']
                    },
                    medium: {
                        label: 'Medium Volume',
                        icon: '🔸',
                        description: 'Balancing multiple priorities with steady workload',
                        characteristics: ['Multiple concurrent projects', 'Balanced quality and speed', 'Some deadline pressure']
                    },
                    high: {
                        label: 'High Volume',
                        icon: '🔶',
                        description: 'Managing heavy workload with constant prioritization',
                        characteristics: ['Many concurrent projects', 'Speed critical', 'Frequent context switching']
                    },
                    extreme: {
                        label: 'Extreme Volume',
                        icon: '🔥',
                        description: 'Overwhelmed with work, need major efficiency gains',
                        characteristics: ['Overwhelming workload', 'Can\'t keep up', 'Burning out', 'Need automation urgently']
                    }
                }
            },

            aiMaturity: {
                name: 'AI Maturity',
                icon: '🤖',
                description: 'Your current AI adoption level',
                levels: {
                    none: {
                        label: 'No AI Usage',
                        icon: '⚪',
                        description: 'Entirely manual processes, no AI tools',
                        characteristics: ['All manual work', 'Not using AI', 'Traditional methods']
                    },
                    exploring: {
                        label: 'Exploring AI',
                        icon: '🟡',
                        description: 'Aware of AI, testing tools, not yet adopted',
                        characteristics: ['Researching tools', 'Testing options', 'Not yet committed']
                    },
                    using: {
                        label: 'Using AI Tools',
                        icon: '🟢',
                        description: 'Actively using 1-2 AI tools for specific tasks',
                        characteristics: ['1-2 tools adopted', 'Specific use cases', 'Seeing value']
                    },
                    advanced: {
                        label: 'Advanced AI User',
                        icon: '🟣',
                        description: 'Power user with multiple AI tools and custom workflows',
                        characteristics: ['Multiple tools integrated', 'Custom workflows', 'Maximizing AI value']
                    }
                }
            },

            painProfile: {
                name: 'Pain Profile',
                icon: '😤',
                description: 'What type of pain dominates your work',
                levels: {
                    manual: {
                        label: 'Manual Labor Heavy',
                        icon: '⌨️',
                        description: 'Dominated by repetitive, manual tasks',
                        characteristics: ['Data entry', 'Copy-paste work', 'Repetitive tasks', 'Automatable work']
                    },
                    coordination: {
                        label: 'Coordination Heavy',
                        icon: '🔄',
                        description: 'Dominated by coordination and communication',
                        characteristics: ['Meeting scheduling', 'Multi-party coordination', 'Email back-and-forth']
                    },
                    analytical: {
                        label: 'Analysis Heavy',
                        icon: '🔍',
                        description: 'Dominated by complex analysis and decision-making',
                        characteristics: ['Complex matching', 'Data analysis', 'Strategic decisions']
                    },
                    compliance: {
                        label: 'Compliance Heavy',
                        icon: '⚖️',
                        description: 'Dominated by regulatory and compliance work',
                        characteristics: ['Documentation', 'Audit prep', 'Policy compliance', 'Risk management']
                    }
                }
            },

            efficiencyLevel: {
                name: 'Efficiency Level',
                icon: '⚡',
                description: 'Your current performance vs benchmarks',
                levels: {
                    struggling: {
                        label: 'Struggling',
                        icon: '📉',
                        description: 'Below average efficiency, need major improvements',
                        percentile: 25,
                        characteristics: ['Below benchmarks', 'Falling behind', 'Need help urgently']
                    },
                    average: {
                        label: 'Average',
                        icon: '➡️',
                        description: 'Meeting basic expectations, room for improvement',
                        percentile: 50,
                        characteristics: ['Meeting standards', 'Getting work done', 'Can improve']
                    },
                    efficient: {
                        label: 'Efficient',
                        icon: '⭐',
                        description: 'Above average efficiency, performing well',
                        percentile: 75,
                        characteristics: ['Above benchmarks', 'Strong performer', 'Effective workflows']
                    },
                    elite: {
                        label: 'Elite',
                        icon: '🏆',
                        description: 'Top-tier efficiency, best-in-class performance',
                        percentile: 90,
                        characteristics: ['Best-in-class', 'Maximizing efficiency', 'Role model']
                    }
                }
            },

            collaborationStyle: {
                name: 'Collaboration Style',
                icon: '👥',
                description: 'How you work with others',
                levels: {
                    solo: {
                        label: 'Solo Contributor',
                        icon: '👤',
                        description: 'Work independently, minimal collaboration',
                        characteristics: ['Work alone', 'Own your pipeline', 'Minimal handoffs']
                    },
                    teamBased: {
                        label: 'Team-Based',
                        icon: '👥',
                        description: 'Work closely with direct team members',
                        characteristics: ['Team collaboration', 'Regular handoffs', 'Shared workflows']
                    },
                    crossFunctional: {
                        label: 'Cross-Functional',
                        icon: '🔗',
                        description: 'Work across multiple teams and departments',
                        characteristics: ['Multiple stakeholders', 'Cross-team coordination', 'Complex dependencies']
                    },
                    clientFacing: {
                        label: 'Client-Facing',
                        icon: '🤝',
                        description: 'Regular interaction with external clients/candidates',
                        characteristics: ['External coordination', 'Client management', 'White-glove service']
                    }
                }
            },

            workStyle: {
                name: 'Work Style',
                icon: '🎯',
                description: 'How you approach your work',
                levels: {
                    reactive: {
                        label: 'Reactive',
                        icon: '🔥',
                        description: 'Constantly responding to urgent requests',
                        characteristics: ['Firefighting mode', 'Urgent requests', 'No planning time', 'Reactive']
                    },
                    tactical: {
                        label: 'Tactical',
                        icon: '🎯',
                        description: 'Executing planned work with some urgency',
                        characteristics: ['Planned execution', 'Some urgency', 'Focused on delivery']
                    },
                    proactive: {
                        label: 'Proactive',
                        icon: '🚀',
                        description: 'Anticipating needs and planning ahead',
                        characteristics: ['Anticipate needs', 'Plan ahead', 'Prevent issues']
                    },
                    strategic: {
                        label: 'Strategic',
                        icon: '♟️',
                        description: 'Focused on long-term optimization and innovation',
                        characteristics: ['Long-term thinking', 'Process improvement', 'Innovation focused']
                    }
                }
            },

            timeConstraint: {
                name: 'Time Constraint',
                icon: '⏰',
                description: 'How constrained are you by time',
                levels: {
                    relaxed: {
                        label: 'Relaxed Timeline',
                        icon: '🟢',
                        description: 'Sufficient time, can prioritize quality',
                        characteristics: ['Adequate time', 'Quality focus possible', 'No rush']
                    },
                    normal: {
                        label: 'Normal Pressure',
                        icon: '🟡',
                        description: 'Standard deadlines, balanced pace',
                        characteristics: ['Standard deadlines', 'Balanced pace', 'Manageable']
                    },
                    tight: {
                        label: 'Tight Deadlines',
                        icon: '🟠',
                        description: 'Frequent deadline pressure, speed critical',
                        characteristics: ['Tight timelines', 'Speed critical', 'Constant pressure']
                    },
                    critical: {
                        label: 'Critical Urgency',
                        icon: '🔴',
                        description: 'Everything is urgent, impossible timelines',
                        characteristics: ['Everything urgent', 'Impossible timelines', 'Constant crisis']
                    }
                }
            },

            qualityFocus: {
                name: 'Quality vs Speed',
                icon: '⚖️',
                description: 'What you optimize for',
                levels: {
                    qualityFirst: {
                        label: 'Quality First',
                        icon: '💎',
                        description: 'Prioritize quality over speed',
                        characteristics: ['Quality over speed', 'Detailed work', 'Thorough approach']
                    },
                    balanced: {
                        label: 'Balanced',
                        icon: '⚖️',
                        description: 'Balance quality and speed',
                        characteristics: ['Balance both', 'Good enough quality', 'Reasonable speed']
                    },
                    speedFirst: {
                        label: 'Speed First',
                        icon: '⚡',
                        description: 'Prioritize speed over perfection',
                        characteristics: ['Speed critical', 'Good enough', 'Move fast']
                    },
                    volume: {
                        label: 'Volume Focused',
                        icon: '📈',
                        description: 'Maximize throughput above all',
                        characteristics: ['Maximize volume', 'Process as many as possible', 'Efficiency critical']
                    }
                }
            }
        };
    }

    /**
     * Define common personas (combinations of dimensions)
     */
    definePersonas() {
        return {
            firefighter: {
                name: 'The Firefighter',
                icon: '🚒',
                description: 'Constantly putting out fires, overwhelmed with urgent requests',
                typicalProfile: {
                    volumeLevel: 'extreme',
                    workStyle: 'reactive',
                    timeConstraint: 'critical',
                    aiMaturity: 'none'
                },
                painPoints: ['Constant urgency', 'No time to plan', 'Always behind', 'Burning out'],
                aiRecommendation: 'URGENT: Implement automation immediately to get out of crisis mode',
                priority: 'critical'
            },

            volumeHunter: {
                name: 'The Volume Hunter',
                icon: '🎯',
                description: 'High-volume recruiter optimizing for throughput',
                typicalProfile: {
                    volumeLevel: 'high',
                    qualityFocus: 'volume',
                    workStyle: 'tactical',
                    efficiencyLevel: 'efficient'
                },
                painPoints: ['Manual screening bottleneck', 'Can\'t scale further', 'Quality vs quantity trade-offs'],
                aiRecommendation: 'Focus on AI tools that maximize screening speed and volume',
                priority: 'high'
            },

            qualitySpecialist: {
                name: 'The Quality Specialist',
                icon: '💎',
                description: 'Detail-oriented recruiter focusing on perfect matches',
                typicalProfile: {
                    volumeLevel: 'low',
                    qualityFocus: 'qualityFirst',
                    workStyle: 'proactive',
                    efficiencyLevel: 'efficient'
                },
                painPoints: ['Time-intensive research', 'Deep analysis takes too long', 'Can\'t take on more reqs'],
                aiRecommendation: 'Use AI to augment research while maintaining quality standards',
                priority: 'medium'
            },

            coordinator: {
                name: 'The Coordinator',
                icon: '🔄',
                description: 'Juggling schedules and managing complex coordination',
                typicalProfile: {
                    painProfile: 'coordination',
                    collaborationStyle: 'crossFunctional',
                    workStyle: 'reactive',
                    volumeLevel: 'high'
                },
                painPoints: ['Email ping-pong', 'Scheduling conflicts', 'Reschedule cascades', 'Context switching'],
                aiRecommendation: 'Implement scheduling automation to eliminate coordination overhead',
                priority: 'high'
            },

            complianceGuardian: {
                name: 'The Compliance Guardian',
                icon: '⚖️',
                description: 'Ensuring all work meets regulatory requirements',
                typicalProfile: {
                    painProfile: 'compliance',
                    qualityFocus: 'qualityFirst',
                    timeConstraint: 'tight',
                    workStyle: 'tactical'
                },
                painPoints: ['Audit preparation stress', 'Policy tracking burden', 'Documentation overhead', 'Risk of violations'],
                aiRecommendation: 'Use AI for compliance monitoring and audit-ready documentation',
                priority: 'critical'
            },

            strategist: {
                name: 'The Strategist',
                icon: '♟️',
                description: 'Focused on long-term talent strategy and optimization',
                typicalProfile: {
                    workStyle: 'strategic',
                    efficiencyLevel: 'elite',
                    aiMaturity: 'advanced',
                    volumeLevel: 'medium'
                },
                painPoints: ['Not enough time for strategy', 'Data analysis time-consuming', 'Hard to prove ROI'],
                aiRecommendation: 'Use AI for data analysis and reporting to free up strategic time',
                priority: 'medium'
            },

            manualLaborer: {
                name: 'The Manual Laborer',
                icon: '⌨️',
                description: 'Bogged down by repetitive, manual tasks',
                typicalProfile: {
                    painProfile: 'manual',
                    aiMaturity: 'none',
                    efficiencyLevel: 'struggling',
                    volumeLevel: 'medium'
                },
                painPoints: ['Copy-paste work', 'Data entry burden', 'Repetitive tasks', 'No automation'],
                aiRecommendation: 'Immediate quick wins from automating repetitive tasks',
                priority: 'high'
            },

            balanced: {
                name: 'The Balanced Professional',
                icon: '⚖️',
                description: 'Managing a balanced workload with good efficiency',
                typicalProfile: {
                    volumeLevel: 'medium',
                    efficiencyLevel: 'efficient',
                    workStyle: 'tactical',
                    qualityFocus: 'balanced'
                },
                painPoints: ['Want to take on more', 'Some manual work', 'Could be more efficient'],
                aiRecommendation: 'Incremental AI adoption to scale without adding hours',
                priority: 'medium'
            }
        };
    }

    /**
     * Define evolution paths (how profiles change with AI adoption)
     */
    defineEvolutionPaths() {
        return {
            firefighter: {
                withAI: {
                    persona: 'tactical',
                    changes: {
                        workStyle: 'reactive → tactical',
                        timeConstraint: 'critical → normal',
                        volumeLevel: 'extreme → high',
                        efficiencyLevel: 'struggling → efficient'
                    },
                    timeline: '3-6 months with AI automation',
                    description: 'Escape crisis mode, regain control of your day'
                }
            },
            volumeHunter: {
                withAI: {
                    persona: 'strategist',
                    changes: {
                        volumeLevel: 'high → extreme (without extra hours)',
                        efficiencyLevel: 'efficient → elite',
                        workStyle: 'tactical → proactive',
                        qualityFocus: 'volume → balanced'
                    },
                    timeline: '6-12 months with AI adoption',
                    description: '3x your volume while improving quality'
                }
            },
            qualitySpecialist: {
                withAI: {
                    persona: 'balanced',
                    changes: {
                        volumeLevel: 'low → medium',
                        efficiencyLevel: 'efficient → elite',
                        timeConstraint: 'tight → normal',
                        workStyle: 'proactive → strategic'
                    },
                    timeline: '6-12 months with AI adoption',
                    description: 'Maintain quality while doubling volume'
                }
            },
            coordinator: {
                withAI: {
                    persona: 'balanced',
                    changes: {
                        painProfile: 'coordination → analytical',
                        workStyle: 'reactive → tactical',
                        volumeLevel: 'high → medium',
                        timeConstraint: 'tight → normal'
                    },
                    timeline: '3-6 months with scheduling AI',
                    description: 'Eliminate 90% of coordination overhead'
                }
            },
            complianceGuardian: {
                withAI: {
                    persona: 'strategist',
                    changes: {
                        timeConstraint: 'tight → relaxed',
                        efficiencyLevel: 'average → elite',
                        workStyle: 'tactical → proactive',
                        painProfile: 'compliance → analytical'
                    },
                    timeline: '6-12 months with compliance AI',
                    description: '95% time reduction on compliance work'
                }
            },
            manualLaborer: {
                withAI: {
                    persona: 'balanced',
                    changes: {
                        painProfile: 'manual → analytical',
                        efficiencyLevel: 'struggling → efficient',
                        aiMaturity: 'none → using',
                        volumeLevel: 'medium → high'
                    },
                    timeline: '1-3 months with basic automation',
                    description: 'Quick wins from automating repetitive work'
                }
            }
        };
    }

    /**
     * Build dynamic profile from user answers
     */
    buildProfile(businessUnit, answers, successMetrics, painAnalysis) {
        const profile = {
            dimensions: {},
            scores: {},
            persona: null,
            confidence: 0
        };

        // Analyze each dimension
        profile.dimensions.volumeLevel = this.analyzeVolumeLevel(businessUnit, answers);
        profile.dimensions.aiMaturity = this.analyzeAIMaturity(answers);
        profile.dimensions.painProfile = this.analyzePainProfile(painAnalysis);
        profile.dimensions.efficiencyLevel = this.analyzeEfficiencyLevel(successMetrics);
        profile.dimensions.collaborationStyle = this.analyzeCollaborationStyle(businessUnit, answers);
        profile.dimensions.workStyle = this.analyzeWorkStyle(answers);
        profile.dimensions.timeConstraint = this.analyzeTimeConstraint(answers);
        profile.dimensions.qualityFocus = this.analyzeQualityFocus(answers);

        // Match to persona
        profile.persona = this.matchPersona(profile.dimensions);

        // Calculate confidence
        profile.confidence = this.calculateProfileConfidence(profile.dimensions);

        // Generate evolution path
        profile.evolution = this.predictEvolution(profile.persona, profile.dimensions);

        // Generate insights
        profile.insights = this.generateProfileInsights(profile);

        return profile;
    }

    /**
     * Analyze volume level from answers
     */
    analyzeVolumeLevel(businessUnit, answers) {
        const volumeIndicators = {
            sourcing: {
                key: 'sourcing_candidates_per_week',
                thresholds: { low: 10, medium: 20, high: 40, extreme: 60 }
            },
            scheduling: {
                key: 'scheduling_interviews_per_week',
                thresholds: { low: 5, medium: 15, high: 30, extreme: 50 }
            },
            compliance: {
                key: 'compliance_audit_prep_time',
                thresholds: { low: 10, medium: 20, high: 40, extreme: 60 }
            },
            contracts: {
                key: 'contracts_per_month',
                thresholds: { low: 5, medium: 15, high: 30, extreme: 50 }
            },
            admin: {
                key: 'admin_data_entry_time',
                thresholds: { low: 5, medium: 10, high: 20, extreme: 30 }
            }
        };

        const indicator = volumeIndicators[businessUnit];
        if (!indicator) return { level: 'medium', confidence: 0.5 };

        const value = parseFloat(answers[indicator.key]) || 0;
        const thresholds = indicator.thresholds;

        let level = 'low';
        if (value >= thresholds.extreme) level = 'extreme';
        else if (value >= thresholds.high) level = 'high';
        else if (value >= thresholds.medium) level = 'medium';

        return {
            level,
            value,
            confidence: 0.9,
            indicator: indicator.key
        };
    }

    /**
     * Analyze AI maturity from answers
     */
    analyzeAIMaturity(answers) {
        // Look for AI adoption signals in answers
        let aiToolCount = 0;
        let exploringSignals = 0;

        Object.keys(answers).forEach(key => {
            const answer = answers[key];
            if (typeof answer === 'string') {
                const lower = answer.toLowerCase();
                if (lower.includes('ai') || lower.includes('automation') || lower.includes('chatgpt') ||
                    lower.includes('copilot') || lower.includes('claude')) {
                    aiToolCount++;
                }
                if (lower.includes('exploring') || lower.includes('testing') || lower.includes('researching')) {
                    exploringSignals++;
                }
            }
        });

        let level = 'none';
        if (aiToolCount >= 3) level = 'advanced';
        else if (aiToolCount >= 1) level = 'using';
        else if (exploringSignals >= 1) level = 'exploring';

        return {
            level,
            toolCount: aiToolCount,
            confidence: 0.7
        };
    }

    /**
     * Analyze pain profile from pain analysis
     */
    analyzePainProfile(painAnalysis) {
        if (!painAnalysis || !painAnalysis.painPoints) {
            return { level: 'manual', confidence: 0.5 };
        }

        const categoryCount = {};
        painAnalysis.painPoints.forEach(pain => {
            const category = pain.category || 'manual';
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        // Map categories to pain profiles
        const categoryMapping = {
            'Manual/Repetitive Tasks': 'manual',
            'Coordination Challenges': 'coordination',
            'Time-Consuming Processes': 'analytical',
            'Quality/Accuracy Issues': 'analytical',
            'System/Tool Limitations': 'manual'
        };

        let dominantProfile = 'manual';
        let maxCount = 0;

        Object.keys(categoryCount).forEach(category => {
            if (categoryCount[category] > maxCount) {
                maxCount = categoryCount[category];
                dominantProfile = categoryMapping[category] || 'manual';
            }
        });

        return {
            level: dominantProfile,
            distribution: categoryCount,
            confidence: 0.8
        };
    }

    /**
     * Analyze efficiency level from success metrics
     */
    analyzeEfficiencyLevel(successMetrics) {
        if (!successMetrics || !successMetrics.metrics) {
            return { level: 'average', confidence: 0.5 };
        }

        const standings = successMetrics.metrics.map(m => m.standing);
        const standingScores = {
            'Below Average': 1,
            'Average': 2,
            'Above Average': 3,
            'High Performer': 4,
            'Elite': 5
        };

        const avgStanding = standings.reduce((sum, s) => sum + (standingScores[s] || 2), 0) / standings.length;

        let level = 'average';
        if (avgStanding >= 4.5) level = 'elite';
        else if (avgStanding >= 3.5) level = 'efficient';
        else if (avgStanding < 2) level = 'struggling';

        return {
            level,
            avgStanding,
            confidence: 0.9
        };
    }

    /**
     * Analyze collaboration style
     */
    analyzeCollaborationStyle(businessUnit, answers) {
        // Different business units have different collaboration patterns
        const patterns = {
            sourcing: 'solo',
            scheduling: 'crossFunctional',
            compliance: 'teamBased',
            contracts: 'crossFunctional',
            admin: 'teamBased'
        };

        return {
            level: patterns[businessUnit] || 'teamBased',
            confidence: 0.7
        };
    }

    /**
     * Analyze work style
     */
    analyzeWorkStyle(answers) {
        // Look for urgency signals
        let urgencySignals = 0;
        let planningSignals = 0;

        Object.values(answers).forEach(answer => {
            if (typeof answer === 'string') {
                const lower = answer.toLowerCase();
                if (lower.includes('urgent') || lower.includes('rush') || lower.includes('emergency') ||
                    lower.includes('last-minute') || lower.includes('fire')) {
                    urgencySignals++;
                }
                if (lower.includes('plan') || lower.includes('strategy') || lower.includes('proactive') ||
                    lower.includes('anticipate')) {
                    planningSignals++;
                }
            }
        });

        let level = 'tactical';
        if (urgencySignals >= 3) level = 'reactive';
        else if (planningSignals >= 3) level = 'strategic';
        else if (planningSignals >= 1) level = 'proactive';

        return {
            level,
            urgencySignals,
            planningSignals,
            confidence: 0.7
        };
    }

    /**
     * Analyze time constraint
     */
    analyzeTimeConstraint(answers) {
        // Look at pain levels and frequency
        let highPainCount = 0;
        let dailyFrequency = 0;

        Object.keys(answers).forEach(key => {
            if (key.includes('pain') && answers[key] >= 4) {
                highPainCount++;
            }
            if (key.includes('frequency') && answers[key] === 'daily') {
                dailyFrequency++;
            }
        });

        let level = 'normal';
        if (highPainCount >= 3 && dailyFrequency >= 3) level = 'critical';
        else if (highPainCount >= 2 || dailyFrequency >= 2) level = 'tight';
        else if (highPainCount === 0) level = 'relaxed';

        return {
            level,
            highPainCount,
            dailyFrequency,
            confidence: 0.7
        };
    }

    /**
     * Analyze quality vs speed focus
     */
    analyzeQualityFocus(answers) {
        const volumeLevel = this.analyzeVolumeLevel('sourcing', answers);

        let level = 'balanced';
        if (volumeLevel.level === 'extreme' || volumeLevel.level === 'high') {
            level = 'volume';
        } else if (volumeLevel.level === 'low') {
            level = 'qualityFirst';
        }

        return {
            level,
            confidence: 0.6
        };
    }

    /**
     * Match profile to persona
     */
    matchPersona(dimensions) {
        const scores = {};

        Object.keys(this.personas).forEach(personaKey => {
            const persona = this.personas[personaKey];
            const typicalProfile = persona.typicalProfile;

            let matchScore = 0;
            let totalDimensions = 0;

            Object.keys(typicalProfile).forEach(dimension => {
                totalDimensions++;
                if (dimensions[dimension] && dimensions[dimension].level === typicalProfile[dimension]) {
                    matchScore++;
                }
            });

            scores[personaKey] = totalDimensions > 0 ? matchScore / totalDimensions : 0;
        });

        // Find best match
        let bestPersona = 'balanced';
        let bestScore = 0;

        Object.keys(scores).forEach(personaKey => {
            if (scores[personaKey] > bestScore) {
                bestScore = scores[personaKey];
                bestPersona = personaKey;
            }
        });

        return {
            primary: bestPersona,
            confidence: bestScore,
            allScores: scores,
            details: this.personas[bestPersona]
        };
    }

    /**
     * Calculate profile confidence
     */
    calculateProfileConfidence(dimensions) {
        const confidences = Object.values(dimensions).map(d => d.confidence || 0.5);
        return confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
    }

    /**
     * Predict evolution with AI adoption
     */
    predictEvolution(persona, dimensions) {
        const personaKey = persona.primary;
        const evolutionPath = this.evolutionPaths[personaKey];

        if (!evolutionPath) {
            return {
                available: false,
                message: 'Evolution path not defined for this persona'
            };
        }

        return {
            available: true,
            currentPersona: personaKey,
            futurePersona: evolutionPath.withAI.persona,
            changes: evolutionPath.withAI.changes,
            timeline: evolutionPath.withAI.timeline,
            description: evolutionPath.withAI.description
        };
    }

    /**
     * Generate profile insights
     */
    generateProfileInsights(profile) {
        const insights = [];

        // Volume insight
        const volume = profile.dimensions.volumeLevel;
        if (volume.level === 'extreme') {
            insights.push({
                type: 'warning',
                icon: '⚠️',
                message: 'Your workload is unsustainable. AI automation is critical to avoid burnout.',
                priority: 'critical'
            });
        } else if (volume.level === 'high') {
            insights.push({
                type: 'info',
                icon: '📊',
                message: 'You\'re handling high volume. AI can help you scale without adding hours.',
                priority: 'high'
            });
        }

        // AI maturity insight
        const ai = profile.dimensions.aiMaturity;
        if (ai.level === 'none') {
            insights.push({
                type: 'opportunity',
                icon: '🚀',
                message: 'You\'re not using AI yet. Huge opportunity for quick wins and efficiency gains.',
                priority: 'high'
            });
        } else if (ai.level === 'advanced') {
            insights.push({
                type: 'success',
                icon: '🌟',
                message: 'You\'re an AI power user! Focus on optimizing your AI workflows.',
                priority: 'medium'
            });
        }

        // Efficiency insight
        const efficiency = profile.dimensions.efficiencyLevel;
        if (efficiency.level === 'struggling') {
            insights.push({
                type: 'warning',
                icon: '📉',
                message: 'You\'re below benchmarks. AI automation can bring you up to average quickly.',
                priority: 'high'
            });
        } else if (efficiency.level === 'elite') {
            insights.push({
                type: 'success',
                icon: '🏆',
                message: 'You\'re performing at elite level! AI can help you maintain this while scaling.',
                priority: 'low'
            });
        }

        // Work style insight
        const workStyle = profile.dimensions.workStyle;
        if (workStyle.level === 'reactive') {
            insights.push({
                type: 'warning',
                icon: '🔥',
                message: 'You\'re in firefighting mode. AI automation can help you escape this cycle.',
                priority: 'critical'
            });
        }

        return insights;
    }

    /**
     * Render dynamic profile
     */
    renderProfile(profile) {
        const persona = profile.persona.details;
        const dimensions = profile.dimensions;

        return `
            <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 shadow-lg border-2 border-blue-200 mb-8">
                <div class="flex items-start justify-between mb-6">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">
                            🧬 Your Role DNA Profile
                        </h3>
                        <p class="text-gray-600">
                            Multi-dimensional analysis of your work profile
                        </p>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl mb-1">${persona.icon}</div>
                        <div class="text-sm font-semibold text-blue-600">
                            Confidence: ${Math.round(profile.confidence * 100)}%
                        </div>
                    </div>
                </div>

                <div class="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-6 mb-6 border-2 border-indigo-300">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="text-4xl">${persona.icon}</span>
                        <div>
                            <h4 class="text-xl font-bold text-gray-900">${persona.name}</h4>
                            <p class="text-sm text-gray-700">${persona.description}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        <div>
                            <p class="text-xs font-semibold text-gray-600 mb-2">Common Pain Points:</p>
                            <ul class="text-sm text-gray-700 space-y-1">
                                ${persona.painPoints.map(p => `<li>• ${p}</li>`).join('')}
                            </ul>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-600 mb-2">AI Strategy:</p>
                            <p class="text-sm font-bold text-indigo-700">${persona.aiRecommendation}</p>
                            <p class="text-xs text-gray-600 mt-2">
                                Priority: <span class="font-semibold ${
                                    persona.priority === 'critical' ? 'text-red-600' :
                                    persona.priority === 'high' ? 'text-orange-600' :
                                    'text-blue-600'
                                }">${persona.priority.toUpperCase()}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <h4 class="text-lg font-bold text-gray-900 mb-4">📊 Your 8-Dimension Profile</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    ${Object.keys(dimensions).map(dimKey => {
                        const dim = dimensions[dimKey];
                        const dimDef = this.dimensions[dimKey];
                        const level = dimDef.levels[dim.level];

                        return `
                            <div class="bg-white rounded-lg p-4 border border-gray-200">
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="text-xl">${dimDef.icon}</span>
                                    <span class="font-semibold text-gray-900 text-sm">${dimDef.name}</span>
                                </div>
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-lg">${level.icon}</span>
                                    <span class="font-bold text-gray-800">${level.label}</span>
                                </div>
                                <p class="text-xs text-gray-600">${level.description}</p>
                            </div>
                        `;
                    }).join('')}
                </div>

                ${profile.insights && profile.insights.length > 0 ? `
                    <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200 mb-6">
                        <h4 class="text-lg font-bold text-gray-900 mb-4">💡 Key Insights About Your Profile</h4>
                        <div class="space-y-3">
                            ${profile.insights.map(insight => `
                                <div class="flex items-start gap-3 bg-white rounded-lg p-4 border ${
                                    insight.type === 'warning' ? 'border-red-200' :
                                    insight.type === 'opportunity' ? 'border-green-200' :
                                    insight.type === 'success' ? 'border-blue-200' :
                                    'border-gray-200'
                                }">
                                    <span class="text-2xl">${insight.icon}</span>
                                    <div class="flex-grow">
                                        <p class="text-sm text-gray-800">${insight.message}</p>
                                        <p class="text-xs text-gray-500 mt-1">
                                            Priority: <span class="font-semibold">${insight.priority.toUpperCase()}</span>
                                        </p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${profile.evolution && profile.evolution.available ? `
                    <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 border border-green-200">
                        <h4 class="text-lg font-bold text-gray-900 mb-3">
                            🚀 Your Evolution Path with AI
                        </h4>
                        <p class="text-sm text-gray-700 mb-4">${profile.evolution.description}</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            ${Object.keys(profile.evolution.changes).map(change => `
                                <div class="bg-white rounded-lg p-3 border border-green-100">
                                    <p class="text-xs font-semibold text-gray-600 mb-1 capitalize">
                                        ${change.replace(/([A-Z])/g, ' $1').trim()}
                                    </p>
                                    <p class="text-sm font-bold text-green-700">
                                        ${profile.evolution.changes[change]}
                                    </p>
                                </div>
                            `).join('')}
                        </div>
                        <p class="text-sm font-semibold text-green-600">
                            ⏱️ Timeline: ${profile.evolution.timeline}
                        </p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Export profile data
     */
    exportProfile(profile) {
        return {
            persona: {
                name: profile.persona.details.name,
                icon: profile.persona.details.icon,
                description: profile.persona.details.description,
                confidence: profile.persona.confidence
            },
            dimensions: Object.keys(profile.dimensions).reduce((acc, key) => {
                acc[key] = {
                    level: profile.dimensions[key].level,
                    confidence: profile.dimensions[key].confidence
                };
                return acc;
            }, {}),
            insights: profile.insights,
            evolution: profile.evolution,
            overallConfidence: profile.confidence
        };
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.DynamicRoleProfiler = DynamicRoleProfiler;
}
