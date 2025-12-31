/**
 * Role Evolution Tracking System
 *
 * Predicts how user's role will evolve with AI adoption over time.
 * Shows timeline-based progression, skills to develop/phase out,
 * workload changes, and new opportunities.
 *
 * Features:
 * - 4-stage timeline (current, 6mo, 12mo, 24mo)
 * - Skills evolution tracking (develop vs phase out)
 * - Workload transformation predictions
 * - New opportunity identification
 * - Career advancement pathways
 * - Risk mitigation for role disruption
 */

class RoleEvolutionTracker {
    constructor() {
        this.evolutionTimelines = this.defineEvolutionTimelines();
        this.skillsEvolution = this.defineSkillsEvolution();
        this.workloadTransformations = this.defineWorkloadTransformations();
        this.newOpportunities = this.defineNewOpportunities();
    }

    /**
     * Define evolution timelines by business unit
     */
    defineEvolutionTimelines() {
        return {
            sourcing: {
                businessUnit: 'Sourcing',
                icon: '🎯',

                current: {
                    phase: 'Manual-Heavy Sourcing',
                    timeAllocation: {
                        'Manual Resume Screening': 40,
                        'Boolean Search Creation': 20,
                        'Candidate Outreach': 20,
                        'Follow-up & Nurturing': 15,
                        'Strategic Work': 5
                    },
                    skillsUsed: ['Boolean search', 'Resume reading', 'Email writing', 'CRM management'],
                    painLevel: 'High',
                    valueAdd: 'Medium'
                },

                month6: {
                    phase: 'AI-Assisted Sourcing',
                    timeAllocation: {
                        'AI-Screened Resume Review': 15,
                        'AI-Generated Search Validation': 5,
                        'Candidate Relationship Building': 40,
                        'Strategic Talent Mapping': 30,
                        'Process Optimization': 10
                    },
                    skillsDeveloping: ['AI tool mastery', 'Relationship building', 'Talent mapping', 'Data analysis'],
                    skillsPhasing: ['Manual screening', 'Basic boolean', 'Repetitive outreach'],
                    transformation: '70% time freed from manual work, reinvested in relationships',
                    painLevel: 'Medium',
                    valueAdd: 'High'
                },

                month12: {
                    phase: 'Strategic Talent Advisor',
                    timeAllocation: {
                        'Talent Strategy & Planning': 35,
                        'Executive Candidate Engagement': 30,
                        'Market Intelligence': 20,
                        'Team Coaching on AI Tools': 10,
                        'AI Tool Optimization': 5
                    },
                    skillsDeveloping: ['Strategic thinking', 'Market analysis', 'Executive communication', 'Coaching'],
                    skillsPhasing: ['Tactical outreach', 'Manual data entry'],
                    transformation: 'Shifted from doer to strategist, 3x impact per requisition',
                    painLevel: 'Low',
                    valueAdd: 'Very High'
                },

                month24: {
                    phase: 'AI-Powered Talent Intelligence Leader',
                    timeAllocation: {
                        'Talent Intelligence & Forecasting': 40,
                        'Strategic Partnership Building': 30,
                        'Innovation & Process Design': 20,
                        'Thought Leadership': 10
                    },
                    skillsDeveloping: ['Predictive analytics', 'Strategic partnerships', 'Change management', 'Innovation'],
                    skillsEliminated: ['All manual screening', 'All tactical outreach'],
                    transformation: 'Became indispensable strategic partner, AI as force multiplier',
                    painLevel: 'Minimal',
                    valueAdd: 'Exceptional',
                    careerOpportunities: ['Head of Talent Acquisition', 'VP Talent Strategy', 'Talent Intelligence Consultant']
                }
            },

            scheduling: {
                businessUnit: 'Scheduling',
                icon: '📅',

                current: {
                    phase: 'Manual Coordination',
                    timeAllocation: {
                        'Email Back-and-Forth': 40,
                        'Calendar Tetris': 30,
                        'Reschedule Management': 20,
                        'Logistics Coordination': 10
                    },
                    skillsUsed: ['Email communication', 'Calendar management', 'Multi-tasking'],
                    painLevel: 'Very High',
                    valueAdd: 'Low'
                },

                month6: {
                    phase: 'AI-Automated Scheduling',
                    timeAllocation: {
                        'AI Scheduling Oversight': 15,
                        'Exception Handling': 20,
                        'Candidate Experience Enhancement': 35,
                        'Process Optimization': 20,
                        'Team Support': 10
                    },
                    skillsDeveloping: ['AI tool management', 'Exception handling', 'Candidate experience', 'Process design'],
                    skillsPhasing: ['Manual email coordination', 'Calendar juggling'],
                    transformation: '85% of scheduling automated, focus on experience',
                    painLevel: 'Low',
                    valueAdd: 'High'
                },

                month12: {
                    phase: 'Candidate Experience Specialist',
                    timeAllocation: {
                        'Candidate Journey Design': 40,
                        'White-Glove Service': 25,
                        'Experience Analytics': 20,
                        'Recruiter Enablement': 15
                    },
                    skillsDeveloping: ['Experience design', 'Analytics', 'Training', 'Innovation'],
                    skillsPhasing: ['Manual scheduling tasks'],
                    transformation: 'Scheduling is automated, became experience architect',
                    painLevel: 'Minimal',
                    valueAdd: 'Very High'
                },

                month24: {
                    phase: 'Talent Experience Strategist',
                    timeAllocation: {
                        'Experience Strategy': 45,
                        'Employer Brand Building': 30,
                        'Technology Innovation': 15,
                        'Industry Thought Leadership': 10
                    },
                    skillsDeveloping: ['Strategic design', 'Brand building', 'Public speaking', 'Innovation'],
                    skillsEliminated: ['All manual scheduling'],
                    transformation: 'Elevated to strategic role, 10x impact on employer brand',
                    painLevel: 'None',
                    valueAdd: 'Exceptional',
                    careerOpportunities: ['Director of Candidate Experience', 'Head of Employer Brand', 'Talent Experience Consultant']
                }
            },

            compliance: {
                businessUnit: 'Compliance',
                icon: '⚖️',

                current: {
                    phase: 'Reactive Compliance',
                    timeAllocation: {
                        'Audit Preparation': 40,
                        'Policy Documentation': 25,
                        'Issue Investigation': 20,
                        'Compliance Monitoring': 15
                    },
                    skillsUsed: ['Documentation', 'Investigation', 'Policy knowledge'],
                    painLevel: 'Very High',
                    valueAdd: 'Medium'
                },

                month6: {
                    phase: 'Proactive Compliance',
                    timeAllocation: {
                        'AI-Automated Monitoring': 10,
                        'Strategic Risk Assessment': 35,
                        'Compliance Strategy': 30,
                        'Stakeholder Education': 15,
                        'Process Design': 10
                    },
                    skillsDeveloping: ['Risk assessment', 'Strategic planning', 'Training', 'AI oversight'],
                    skillsPhasing: ['Manual documentation', 'Reactive investigation'],
                    transformation: '90% of monitoring automated, focus on prevention',
                    painLevel: 'Medium',
                    valueAdd: 'High'
                },

                month12: {
                    phase: 'Compliance Strategist',
                    timeAllocation: {
                        'Compliance Strategy & Planning': 40,
                        'Risk Forecasting': 25,
                        'Executive Advisory': 20,
                        'Innovation & Best Practices': 15
                    },
                    skillsDeveloping: ['Strategic advisory', 'Executive communication', 'Forecasting', 'Innovation'],
                    skillsPhasing: ['Manual audit prep', 'Documentation tasks'],
                    transformation: 'Shifted from reactive to predictive, trusted advisor',
                    painLevel: 'Low',
                    valueAdd: 'Very High'
                },

                month24: {
                    phase: 'Chief Compliance Intelligence Officer',
                    timeAllocation: {
                        'Predictive Compliance Intelligence': 45,
                        'Enterprise Risk Strategy': 30,
                        'Regulatory Innovation': 15,
                        'Industry Leadership': 10
                    },
                    skillsDeveloping: ['Predictive analytics', 'Enterprise strategy', 'Regulatory affairs', 'Thought leadership'],
                    skillsEliminated: ['All manual compliance tasks'],
                    transformation: 'AI prevents issues before they occur, strategic leader',
                    painLevel: 'None',
                    valueAdd: 'Exceptional',
                    careerOpportunities: ['VP Compliance', 'Chief Compliance Officer', 'Compliance Technology Consultant']
                }
            },

            contracts: {
                businessUnit: 'Contracts',
                icon: '📄',

                current: {
                    phase: 'Manual Contract Processing',
                    timeAllocation: {
                        'Contract Drafting': 35,
                        'Redline Management': 30,
                        'Approval Routing': 20,
                        'Document Management': 15
                    },
                    skillsUsed: ['Legal writing', 'Document management', 'Negotiation tracking'],
                    painLevel: 'High',
                    valueAdd: 'Medium'
                },

                month6: {
                    phase: 'AI-Assisted Contracting',
                    timeAllocation: {
                        'AI Contract Review': 15,
                        'Strategic Negotiation': 40,
                        'Relationship Management': 25,
                        'Process Optimization': 15,
                        'Risk Analysis': 5
                    },
                    skillsDeveloping: ['Negotiation strategy', 'Relationship building', 'Risk analysis', 'AI oversight'],
                    skillsPhasing: ['Manual drafting', 'Basic routing'],
                    transformation: '80% of drafting automated, focus on strategy',
                    painLevel: 'Medium',
                    valueAdd: 'High'
                },

                month12: {
                    phase: 'Contract Strategy Specialist',
                    timeAllocation: {
                        'Contract Strategy & Design': 40,
                        'High-Value Negotiations': 30,
                        'Risk Intelligence': 20,
                        'Stakeholder Advisory': 10
                    },
                    skillsDeveloping: ['Strategic design', 'Complex negotiation', 'Risk management', 'Advisory'],
                    skillsPhasing: ['Template management', 'Routine approvals'],
                    transformation: 'AI handles routine, you handle complex and strategic',
                    painLevel: 'Low',
                    valueAdd: 'Very High'
                },

                month24: {
                    phase: 'Strategic Deal Architect',
                    timeAllocation: {
                        'Deal Structure & Strategy': 45,
                        'Executive Negotiations': 30,
                        'Contract Innovation': 15,
                        'Thought Leadership': 10
                    },
                    skillsDeveloping: ['Deal architecture', 'Executive influence', 'Innovation', 'Industry expertise'],
                    skillsEliminated: ['All manual contract tasks'],
                    transformation: 'Became deal strategist, AI as execution engine',
                    painLevel: 'None',
                    valueAdd: 'Exceptional',
                    careerOpportunities: ['Director of Contracts', 'VP Legal Operations', 'Contract Strategy Consultant']
                }
            },

            admin: {
                businessUnit: 'Admin',
                icon: '⚙️',

                current: {
                    phase: 'Manual Data Management',
                    timeAllocation: {
                        'Data Entry': 45,
                        'Report Generation': 25,
                        'Data Cleanup': 20,
                        'System Coordination': 10
                    },
                    skillsUsed: ['Data entry', 'Excel', 'System knowledge'],
                    painLevel: 'Very High',
                    valueAdd: 'Low'
                },

                month6: {
                    phase: 'AI-Automated Operations',
                    timeAllocation: {
                        'AI Automation Oversight': 15,
                        'Data Quality Management': 30,
                        'Analytics & Insights': 30,
                        'Process Improvement': 15,
                        'Exception Handling': 10
                    },
                    skillsDeveloping: ['Data analytics', 'Quality management', 'Process design', 'AI oversight'],
                    skillsPhasing: ['Manual entry', 'Repetitive reporting'],
                    transformation: '95% of data entry automated, focus on insights',
                    painLevel: 'Low',
                    valueAdd: 'High'
                },

                month12: {
                    phase: 'Talent Intelligence Analyst',
                    timeAllocation: {
                        'Advanced Analytics': 40,
                        'Predictive Modeling': 25,
                        'Dashboard & Insights': 20,
                        'Stakeholder Consulting': 15
                    },
                    skillsDeveloping: ['Advanced analytics', 'Predictive modeling', 'Data visualization', 'Consulting'],
                    skillsPhasing: ['Manual reporting', 'Data cleanup'],
                    transformation: 'Transformed into insights provider, strategic value',
                    painLevel: 'Minimal',
                    valueAdd: 'Very High'
                },

                month24: {
                    phase: 'Talent Data Science Leader',
                    timeAllocation: {
                        'Predictive Analytics & AI': 45,
                        'Strategic Insights Delivery': 30,
                        'Data Science Innovation': 15,
                        'Executive Presentations': 10
                    },
                    skillsDeveloping: ['Data science', 'Machine learning', 'Executive communication', 'Innovation'],
                    skillsEliminated: ['All manual data work'],
                    transformation: 'Became data science leader, driving strategic decisions',
                    painLevel: 'None',
                    valueAdd: 'Exceptional',
                    careerOpportunities: ['Director of Talent Analytics', 'VP People Analytics', 'Talent Data Science Consultant']
                }
            }
        };
    }

    /**
     * Define skills evolution patterns
     */
    defineSkillsEvolution() {
        return {
            phasingOut: {
                category: 'Manual & Repetitive Skills',
                icon: '📉',
                examples: [
                    { skill: 'Manual resume screening', replacement: 'AI resume screening oversight' },
                    { skill: 'Basic boolean search', replacement: 'AI search optimization' },
                    { skill: 'Manual data entry', replacement: 'Data quality management' },
                    { skill: 'Email back-and-forth scheduling', replacement: 'AI scheduling oversight' },
                    { skill: 'Manual contract drafting', replacement: 'Contract strategy design' },
                    { skill: 'Repetitive compliance checks', replacement: 'Compliance strategy' }
                ]
            },

            developing: {
                category: 'Strategic & Human-Centric Skills',
                icon: '📈',
                examples: [
                    { skill: 'AI tool mastery & optimization', importance: 'critical', timeline: '0-6 months' },
                    { skill: 'Relationship building at scale', importance: 'high', timeline: '0-12 months' },
                    { skill: 'Strategic thinking & planning', importance: 'high', timeline: '6-18 months' },
                    { skill: 'Data analysis & interpretation', importance: 'high', timeline: '0-12 months' },
                    { skill: 'Executive communication', importance: 'medium', timeline: '12-24 months' },
                    { skill: 'Change management & coaching', importance: 'medium', timeline: '6-18 months' },
                    { skill: 'Process design & innovation', importance: 'high', timeline: '6-24 months' },
                    { skill: 'Predictive analytics', importance: 'medium', timeline: '12-24 months' }
                ]
            },

            emerging: {
                category: 'Future-Focused Skills',
                icon: '🚀',
                examples: [
                    { skill: 'AI prompt engineering for recruiting', importance: 'critical', horizon: 'Now' },
                    { skill: 'Talent intelligence & forecasting', importance: 'high', horizon: '1-2 years' },
                    { skill: 'Candidate experience design', importance: 'high', horizon: '1-2 years' },
                    { skill: 'Ethics in AI recruiting', importance: 'medium', horizon: '2-3 years' },
                    { skill: 'Talent marketplace design', importance: 'medium', horizon: '2-3 years' },
                    { skill: 'Cross-functional strategic partnerships', importance: 'high', horizon: '1-2 years' }
                ]
            }
        };
    }

    /**
     * Define workload transformations
     */
    defineWorkloadTransformations() {
        return {
            phases: [
                {
                    phase: 'Current State',
                    manualWork: 85,
                    aiAssistedWork: 10,
                    strategicWork: 5,
                    reactiveTasks: 70,
                    proactiveTasks: 30,
                    weeklyHours: 50,
                    burnoutRisk: 'High'
                },
                {
                    phase: '6 Months',
                    manualWork: 30,
                    aiAssistedWork: 40,
                    strategicWork: 30,
                    reactiveTasks: 40,
                    proactiveTasks: 60,
                    weeklyHours: 45,
                    burnoutRisk: 'Medium'
                },
                {
                    phase: '12 Months',
                    manualWork: 10,
                    aiAssistedWork: 30,
                    strategicWork: 60,
                    reactiveTasks: 20,
                    proactiveTasks: 80,
                    weeklyHours: 40,
                    burnoutRisk: 'Low'
                },
                {
                    phase: '24 Months',
                    manualWork: 5,
                    aiAssistedWork: 20,
                    strategicWork: 75,
                    reactiveTasks: 10,
                    proactiveTasks: 90,
                    weeklyHours: 40,
                    burnoutRisk: 'Minimal'
                }
            ]
        };
    }

    /**
     * Define new opportunities AI creates
     */
    defineNewOpportunities() {
        return [
            {
                opportunity: 'Become AI Implementation Champion',
                description: 'Lead AI adoption across your team or organization',
                timeframe: '0-6 months',
                value: 'Position yourself as innovation leader, visibility to executives',
                requirements: ['Early AI adoption', 'Document wins', 'Share learnings']
            },
            {
                opportunity: 'Scale Beyond Your Business Unit',
                description: 'Use freed time to support other teams or take on new req load',
                timeframe: '6-12 months',
                value: '50-100% more capacity without more hours, broader impact',
                requirements: ['Master AI tools', 'Optimize workflows', 'Build systems']
            },
            {
                opportunity: 'Transition to Strategic Role',
                description: 'Move from tactical execution to strategy and advisory',
                timeframe: '12-18 months',
                value: 'Higher-value work, increased influence, career advancement',
                requirements: ['Demonstrate strategic thinking', 'Build executive relationships', 'Deliver measurable impact']
            },
            {
                opportunity: 'Become Thought Leader',
                description: 'Share AI recruiting expertise through content, speaking, consulting',
                timeframe: '18-24 months',
                value: 'Industry recognition, consulting opportunities, career optionality',
                requirements: ['Document journey', 'Build portfolio', 'Network actively']
            },
            {
                opportunity: 'Launch Internal Consulting Practice',
                description: 'Help other teams/divisions adopt AI recruiting practices',
                timeframe: '12-24 months',
                value: 'Internal visibility, skill diversification, promotion potential',
                requirements: ['Proven AI success', 'Training skills', 'Process documentation']
            },
            {
                opportunity: 'Pivot to Talent Intelligence',
                description: 'Transition from execution to analytics and intelligence',
                timeframe: '12-24 months',
                value: 'New career path, higher compensation, future-proof role',
                requirements: ['Data analytics skills', 'AI tool mastery', 'Business acumen']
            }
        ];
    }

    /**
     * Track evolution for specific user
     */
    trackEvolution(businessUnit, profile, painAnalysis) {
        const timeline = this.evolutionTimelines[businessUnit];

        if (!timeline) {
            return {
                available: false,
                message: 'Evolution tracking not available for this business unit'
            };
        }

        // Customize timeline based on user profile
        const customizedTimeline = this.customizeTimeline(timeline, profile, painAnalysis);

        // Calculate transformation metrics
        const transformationMetrics = this.calculateTransformationMetrics(timeline);

        // Identify priority skills
        const prioritySkills = this.identifyPrioritySkills(timeline, profile);

        // Identify opportunities
        const opportunities = this.identifyOpportunities(profile);

        // Calculate risk and mitigation
        const riskMitigation = this.calculateRiskMitigation(profile);

        return {
            available: true,
            businessUnit: timeline.businessUnit,
            icon: timeline.icon,
            timeline: customizedTimeline,
            transformationMetrics,
            prioritySkills,
            opportunities,
            riskMitigation,
            workloadTransformation: this.workloadTransformations
        };
    }

    /**
     * Customize timeline based on user profile
     */
    customizeTimeline(timeline, profile) {
        // Adjust timelines based on AI maturity
        const aiLevel = profile.dimensions.aiMaturity.level;
        const volumeLevel = profile.dimensions.volumeLevel.level;

        let adjustedTimeline = {
            current: timeline.current,
            month6: timeline.month6,
            month12: timeline.month12,
            month24: timeline.month24
        };

        // If user already using AI, accelerate timeline
        if (aiLevel === 'using' || aiLevel === 'advanced') {
            adjustedTimeline.note = 'Timeline accelerated - you already use AI tools';
            adjustedTimeline.month6.note = 'You can reach this in 3 months';
            adjustedTimeline.month12.note = 'You can reach this in 6-9 months';
        }

        // If user has extreme volume, urgent timeline
        if (volumeLevel === 'extreme') {
            adjustedTimeline.urgency = 'critical';
            adjustedTimeline.note = 'URGENT: Your volume requires immediate AI adoption';
        }

        return adjustedTimeline;
    }

    /**
     * Calculate transformation metrics
     */
    calculateTransformationMetrics(timeline) {
        return {
            timeFreed: {
                month6: '60-70% of manual work eliminated',
                month12: '85% of manual work eliminated',
                month24: '95% of manual work eliminated'
            },
            valueIncrease: {
                month6: '2-3x impact per hour worked',
                month12: '5-7x impact per hour worked',
                month24: '10x+ impact per hour worked'
            },
            careerProgression: {
                month6: 'Recognized as AI early adopter',
                month12: 'Eligible for strategic role promotion',
                month24: 'Ready for director/VP level roles'
            }
        };
    }

    /**
     * Identify priority skills to develop
     */
    identifyPrioritySkills(timeline, profile) {
        const skills = this.skillsEvolution;
        const aiLevel = profile.dimensions.aiMaturity.level;

        // Priority depends on current AI maturity
        const priorities = [];

        if (aiLevel === 'none' || aiLevel === 'exploring') {
            priorities.push({
                skill: 'AI tool mastery & optimization',
                priority: 'CRITICAL',
                reason: 'Foundation for all other transformations',
                timeline: 'Start immediately'
            });
        }

        priorities.push({
            skill: 'Data analysis & interpretation',
            priority: 'HIGH',
            reason: 'Essential for proving AI ROI and strategic decisions',
            timeline: '0-6 months'
        });

        priorities.push({
            skill: 'Relationship building at scale',
            priority: 'HIGH',
            reason: 'As AI handles tasks, focus shifts to relationships',
            timeline: '0-12 months'
        });

        return {
            developNow: priorities,
            phaseOut: skills.phasingOut.examples,
            emerging: skills.emerging.examples
        };
    }

    /**
     * Identify opportunities for user
     */
    identifyOpportunities(profile) {
        const opportunities = this.newOpportunities;
        const aiLevel = profile.dimensions.aiMaturity.level;
        const efficiency = profile.dimensions.efficiencyLevel.level;

        // Filter opportunities based on profile
        const relevant = opportunities.filter(opp => {
            // AI Champions should be early adopters
            if (opp.opportunity.includes('AI Implementation')) {
                return aiLevel === 'exploring' || aiLevel === 'using';
            }

            // Strategic roles for efficient users
            if (opp.opportunity.includes('Strategic')) {
                return efficiency === 'efficient' || efficiency === 'elite';
            }

            return true;
        });

        return relevant.slice(0, 4); // Top 4 most relevant
    }

    /**
     * Calculate risk mitigation
     */
    calculateRiskMitigation(profile) {
        const risks = [];

        // Job displacement risk
        const aiLevel = profile.dimensions.aiMaturity.level;
        if (aiLevel === 'none') {
            risks.push({
                risk: 'Job Displacement Risk',
                severity: 'HIGH',
                description: 'Roles that don\'t adopt AI may become obsolete',
                mitigation: 'Start learning AI tools immediately - be the disruptor, not the disrupted',
                timeline: 'Urgent - start this month'
            });
        }

        // Burnout risk
        const volume = profile.dimensions.volumeLevel.level;
        if (volume === 'extreme') {
            risks.push({
                risk: 'Burnout Risk',
                severity: 'CRITICAL',
                description: 'Current workload is unsustainable',
                mitigation: 'AI automation can reduce hours by 60% within 6 months',
                timeline: 'Immediate - this is a crisis'
            });
        }

        // Career stagnation risk
        const workStyle = profile.dimensions.workStyle.level;
        if (workStyle === 'reactive') {
            risks.push({
                risk: 'Career Stagnation',
                severity: 'MEDIUM',
                description: 'Stuck in tactical work, no time for strategy',
                mitigation: 'AI frees 15+ hours/week for strategic work and skill development',
                timeline: '3-6 months to shift to strategic work'
            });
        }

        return risks;
    }

    /**
     * Render evolution tracking visualization
     */
    renderEvolutionTracking(evolution) {
        if (!evolution.available) {
            return '';
        }

        const { timeline, transformationMetrics, prioritySkills, opportunities, riskMitigation, workloadTransformation } = evolution;

        return `
            <div class="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 shadow-lg border-2 border-green-200 mb-8">
                <div class="flex items-start justify-between mb-6">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">
                            🚀 Your ${evolution.businessUnit} Role Evolution
                        </h3>
                        <p class="text-gray-600">
                            How your role transforms with AI adoption over 24 months
                        </p>
                        ${timeline.note ? `
                            <p class="text-sm font-semibold text-green-600 mt-2">
                                ${timeline.urgency === 'critical' ? '⚠️' : '💡'} ${timeline.note}
                            </p>
                        ` : ''}
                    </div>
                    <div class="text-4xl">${evolution.icon}</div>
                </div>

                <!-- Timeline Visualization -->
                <div class="space-y-6 mb-8">
                    ${this.renderTimelinePhase('Current State', timeline.current, 'gray', 0)}
                    ${this.renderTimelinePhase('6 Months', timeline.month6, 'blue', 1)}
                    ${this.renderTimelinePhase('12 Months', timeline.month12, 'purple', 2)}
                    ${this.renderTimelinePhase('24 Months', timeline.month24, 'green', 3)}
                </div>

                <!-- Transformation Metrics -->
                <div class="bg-white rounded-lg p-6 mb-6 border border-green-200">
                    <h4 class="text-lg font-bold text-gray-900 mb-4">📊 Transformation Metrics</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p class="text-xs font-semibold text-gray-600 mb-2">⏱️ Time Freed</p>
                            <div class="space-y-1 text-sm">
                                <p><span class="font-semibold text-blue-600">6mo:</span> ${transformationMetrics.timeFreed.month6}</p>
                                <p><span class="font-semibold text-purple-600">12mo:</span> ${transformationMetrics.timeFreed.month12}</p>
                                <p><span class="font-semibold text-green-600">24mo:</span> ${transformationMetrics.timeFreed.month24}</p>
                            </div>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-600 mb-2">💎 Value Increase</p>
                            <div class="space-y-1 text-sm">
                                <p><span class="font-semibold text-blue-600">6mo:</span> ${transformationMetrics.valueIncrease.month6}</p>
                                <p><span class="font-semibold text-purple-600">12mo:</span> ${transformationMetrics.valueIncrease.month12}</p>
                                <p><span class="font-semibold text-green-600">24mo:</span> ${transformationMetrics.valueIncrease.month24}</p>
                            </div>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-600 mb-2">🎯 Career Progression</p>
                            <div class="space-y-1 text-sm">
                                <p><span class="font-semibold text-blue-600">6mo:</span> ${transformationMetrics.careerProgression.month6}</p>
                                <p><span class="font-semibold text-purple-600">12mo:</span> ${transformationMetrics.careerProgression.month12}</p>
                                <p><span class="font-semibold text-green-600">24mo:</span> ${transformationMetrics.careerProgression.month24}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Priority Skills -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
                    <h4 class="text-lg font-bold text-gray-900 mb-4">📚 Skills Evolution</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p class="text-sm font-semibold text-green-700 mb-3">📈 Develop These Skills Now:</p>
                            <div class="space-y-3">
                                ${prioritySkills.developNow.map(skill => `
                                    <div class="bg-white rounded-lg p-3 border border-green-200">
                                        <p class="font-bold text-gray-900 text-sm">${skill.skill}</p>
                                        <p class="text-xs text-gray-600">${skill.reason}</p>
                                        <p class="text-xs font-semibold ${
                                            skill.priority === 'CRITICAL' ? 'text-red-600' :
                                            skill.priority === 'HIGH' ? 'text-orange-600' :
                                            'text-blue-600'
                                        } mt-1">
                                            ${skill.priority} - ${skill.timeline}
                                        </p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-gray-700 mb-3">📉 Phase Out These Skills:</p>
                            <div class="space-y-2">
                                ${prioritySkills.phaseOut.slice(0, 4).map(skill => `
                                    <div class="bg-white rounded-lg p-3 border border-gray-200">
                                        <p class="text-sm text-gray-700 line-through">${skill.skill}</p>
                                        <p class="text-xs text-green-600 mt-1">→ ${skill.replacement}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- New Opportunities -->
                <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6 border border-purple-200">
                    <h4 class="text-lg font-bold text-gray-900 mb-4">🌟 New Opportunities AI Creates</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${opportunities.map(opp => `
                            <div class="bg-white rounded-lg p-4 border border-purple-100">
                                <p class="font-bold text-gray-900 text-sm mb-2">${opp.opportunity}</p>
                                <p class="text-xs text-gray-600 mb-2">${opp.description}</p>
                                <p class="text-xs text-purple-600 font-semibold mb-2">
                                    ⏱️ ${opp.timeframe}
                                </p>
                                <p class="text-xs text-green-600">
                                    💰 Value: ${opp.value}
                                </p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Risk Mitigation -->
                ${riskMitigation.length > 0 ? `
                    <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
                        <h4 class="text-lg font-bold text-gray-900 mb-4">⚠️ Risk Mitigation</h4>
                        <div class="space-y-3">
                            ${riskMitigation.map(risk => `
                                <div class="bg-white rounded-lg p-4 border-l-4 ${
                                    risk.severity === 'CRITICAL' ? 'border-red-600' :
                                    risk.severity === 'HIGH' ? 'border-orange-500' :
                                    'border-yellow-500'
                                }">
                                    <div class="flex items-start justify-between mb-2">
                                        <p class="font-bold text-gray-900">${risk.risk}</p>
                                        <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                                            risk.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                                            risk.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }">
                                            ${risk.severity}
                                        </span>
                                    </div>
                                    <p class="text-sm text-gray-600 mb-2">${risk.description}</p>
                                    <div class="bg-green-50 rounded p-3 border border-green-200">
                                        <p class="text-sm font-semibold text-green-800 mb-1">✅ Mitigation:</p>
                                        <p class="text-sm text-gray-700">${risk.mitigation}</p>
                                        <p class="text-xs text-green-600 font-semibold mt-2">
                                            ⏱️ ${risk.timeline}
                                        </p>
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
     * Render timeline phase
     */
    renderTimelinePhase(label, phase, color, index) {
        const colorClasses = {
            gray: {
                border: 'border-gray-300',
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                badge: 'bg-gray-200 text-gray-800'
            },
            blue: {
                border: 'border-blue-300',
                bg: 'bg-blue-50',
                text: 'text-blue-800',
                badge: 'bg-blue-200 text-blue-800'
            },
            purple: {
                border: 'border-purple-300',
                bg: 'bg-purple-50',
                text: 'text-purple-800',
                badge: 'bg-purple-200 text-purple-800'
            },
            green: {
                border: 'border-green-300',
                bg: 'bg-green-50',
                text: 'text-green-800',
                badge: 'bg-green-200 text-green-800'
            }
        };

        const colors = colorClasses[color] || colorClasses.gray;

        return `
            <div class="bg-white rounded-lg p-6 border-l-4 ${colors.border}">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <span class="px-3 py-1 rounded-full text-sm font-bold ${colors.badge}">
                                ${label}
                            </span>
                            <h4 class="text-lg font-bold ${colors.text}">${phase.phase}</h4>
                        </div>
                        ${phase.transformation ? `
                            <p class="text-sm text-gray-600 italic">
                                💡 ${phase.transformation}
                            </p>
                        ` : ''}
                        ${phase.note ? `
                            <p class="text-xs text-green-600 font-semibold mt-2">
                                ${phase.note}
                            </p>
                        ` : ''}
                    </div>
                    <div class="text-right text-sm">
                        <p class="font-semibold text-gray-600">Pain: <span class="${
                            phase.painLevel === 'Very High' || phase.painLevel === 'High' ? 'text-red-600' :
                            phase.painLevel === 'Medium' ? 'text-yellow-600' :
                            'text-green-600'
                        }">${phase.painLevel}</span></p>
                        <p class="font-semibold text-gray-600">Value: <span class="${
                            phase.valueAdd === 'Exceptional' || phase.valueAdd === 'Very High' ? 'text-green-600' :
                            phase.valueAdd === 'High' ? 'text-blue-600' :
                            'text-gray-600'
                        }">${phase.valueAdd}</span></p>
                    </div>
                </div>

                ${phase.timeAllocation ? `
                    <div class="mb-4">
                        <p class="text-xs font-semibold text-gray-600 mb-2">⏱️ Time Allocation:</p>
                        <div class="space-y-1">
                            ${Object.keys(phase.timeAllocation).map(task => `
                                <div class="flex items-center gap-2">
                                    <div class="flex-grow bg-gray-100 rounded-full h-6 overflow-hidden">
                                        <div class="h-full ${colors.bg} flex items-center px-2 transition-all" style="width: ${phase.timeAllocation[task]}%">
                                            <span class="text-xs font-medium text-gray-700">${task}</span>
                                        </div>
                                    </div>
                                    <span class="text-xs font-semibold text-gray-600 w-12 text-right">${phase.timeAllocation[task]}%</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    ${phase.skillsDeveloping ? `
                        <div>
                            <p class="text-xs font-semibold text-green-600 mb-1">📈 Developing:</p>
                            <ul class="text-gray-700 space-y-1">
                                ${phase.skillsDeveloping.map(s => `<li>• ${s}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${phase.skillsUsed ? `
                        <div>
                            <p class="text-xs font-semibold text-gray-600 mb-1">🔧 Using:</p>
                            <ul class="text-gray-700 space-y-1">
                                ${phase.skillsUsed.map(s => `<li>• ${s}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${phase.skillsPhasing ? `
                        <div>
                            <p class="text-xs font-semibold text-gray-500 mb-1">📉 Phasing Out:</p>
                            <ul class="text-gray-600 space-y-1 line-through opacity-75">
                                ${phase.skillsPhasing.map(s => `<li>• ${s}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${phase.skillsEliminated ? `
                        <div>
                            <p class="text-xs font-semibold text-gray-400 mb-1">✅ Eliminated:</p>
                            <ul class="text-gray-500 space-y-1 line-through opacity-60">
                                ${phase.skillsEliminated.map(s => `<li>• ${s}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>

                ${phase.careerOpportunities ? `
                    <div class="mt-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-3 border border-yellow-200">
                        <p class="text-xs font-semibold text-gray-700 mb-2">🎯 Career Opportunities:</p>
                        <div class="flex flex-wrap gap-2">
                            ${phase.careerOpportunities.map(opp => `
                                <span class="px-3 py-1 rounded-full bg-white text-xs font-medium text-gray-700 border border-yellow-300">
                                    ${opp}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Export evolution data
     */
    exportEvolution(evolution) {
        if (!evolution.available) {
            return null;
        }

        return {
            businessUnit: evolution.businessUnit,
            timeline: evolution.timeline,
            transformationMetrics: evolution.transformationMetrics,
            prioritySkills: evolution.prioritySkills,
            opportunities: evolution.opportunities,
            riskMitigation: evolution.riskMitigation
        };
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.RoleEvolutionTracker = RoleEvolutionTracker;
}
