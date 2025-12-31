/**
 * Industry-Specific Pain Points Detector
 *
 * Detects user's industry and identifies industry-specific recruitment challenges
 * that differ from generic pain points. Provides tailored benchmarks and solutions.
 *
 * Features:
 * - Industry detection from answer patterns
 * - 6 major industries covered (Tech, Healthcare, Finance, Manufacturing, Consulting, Retail)
 * - Industry-specific pain points per business unit
 * - Regulatory and compliance nuances
 * - Industry benchmark comparisons
 * - Tailored AI solution recommendations
 */

class IndustryPainDetector {
    constructor() {
        this.industries = this.defineIndustries();
        this.industryPainPoints = this.defineIndustryPainPoints();
        this.industryBenchmarks = this.defineIndustryBenchmarks();
        this.industryRegulations = this.defineIndustryRegulations();
    }

    /**
     * Define industry profiles and detection signals
     */
    defineIndustries() {
        return {
            technology: {
                name: 'Technology/Software',
                icon: '💻',
                characteristics: {
                    fastPaced: true,
                    highVolume: true,
                    competitiveMarket: true,
                    remoteFriendly: true,
                    innovationFocused: true
                },
                detectionSignals: {
                    // Signals that indicate tech industry
                    keywords: ['software', 'tech', 'saas', 'cloud', 'data', 'ai', 'ml', 'devops', 'agile'],
                    volumeIndicators: {
                        sourcing_candidates_per_week: { min: 20 },
                        sourcing_active_roles: ['11-20', '20+']
                    },
                    painIndicators: {
                        highCompetition: true,
                        fastTurnaround: true,
                        skillsShortage: true
                    }
                }
            },

            healthcare: {
                name: 'Healthcare/Life Sciences',
                icon: '🏥',
                characteristics: {
                    highlyRegulated: true,
                    complianceHeavy: true,
                    credentialingComplex: true,
                    shiftBased: true,
                    criticalStaffing: true
                },
                detectionSignals: {
                    keywords: ['healthcare', 'hospital', 'medical', 'clinical', 'pharma', 'biotech', 'nurse', 'physician'],
                    volumeIndicators: {
                        compliance_policy_updates: ['Weekly', 'Daily'],
                        compliance_audit_prep_time: { min: 20 }
                    },
                    painIndicators: {
                        credentialing: true,
                        licensing: true,
                        shiftCoverage: true
                    }
                }
            },

            financial: {
                name: 'Financial Services',
                icon: '🏦',
                characteristics: {
                    highlyRegulated: true,
                    riskAverse: true,
                    complianceFirst: true,
                    backgroundChecksIntensive: true,
                    documentationHeavy: true
                },
                detectionSignals: {
                    keywords: ['bank', 'financial', 'finance', 'investment', 'insurance', 'fintech', 'trading', 'audit'],
                    volumeIndicators: {
                        compliance_audit_prep_time: { min: 30 },
                        contracts_approval_time: { min: 3 }
                    },
                    painIndicators: {
                        regulatory: true,
                        backgroundChecks: true,
                        documentation: true
                    }
                }
            },

            manufacturing: {
                name: 'Manufacturing/Industrial',
                icon: '🏭',
                characteristics: {
                    shiftBased: true,
                    highVolume: true,
                    safetyFocused: true,
                    seasonalFluctuation: true,
                    locationSpecific: true
                },
                detectionSignals: {
                    keywords: ['manufacturing', 'factory', 'production', 'assembly', 'industrial', 'warehouse', 'logistics'],
                    volumeIndicators: {
                        sourcing_candidates_per_week: { min: 30 },
                        scheduling_interviews_per_week: { min: 20 }
                    },
                    painIndicators: {
                        highVolume: true,
                        shiftScheduling: true,
                        safetyCompliance: true
                    }
                }
            },

            consulting: {
                name: 'Consulting/Professional Services',
                icon: '💼',
                characteristics: {
                    projectBased: true,
                    clientFacing: true,
                    rapidDeployment: true,
                    nichSkills: true,
                    premiumTalent: true
                },
                detectionSignals: {
                    keywords: ['consulting', 'advisory', 'professional services', 'audit', 'tax', 'strategy'],
                    volumeIndicators: {
                        sourcing_review_time: ['Very detailed', 'Extremely detailed'],
                        contracts_redline_cycles: { min: 3 }
                    },
                    painIndicators: {
                        nicheTalent: true,
                        projectStaffing: true,
                        rapidDeployment: true
                    }
                }
            },

            retail: {
                name: 'Retail/E-commerce',
                icon: '🛍️',
                characteristics: {
                    highVolume: true,
                    seasonalFluctuation: true,
                    highTurnover: true,
                    multiLocation: true,
                    customerFacing: true
                },
                detectionSignals: {
                    keywords: ['retail', 'store', 'ecommerce', 'sales', 'customer service', 'merchandising'],
                    volumeIndicators: {
                        sourcing_candidates_per_week: { min: 40 },
                        scheduling_interviews_per_week: { min: 30 }
                    },
                    painIndicators: {
                        highVolume: true,
                        highTurnover: true,
                        seasonal: true
                    }
                }
            }
        };
    }

    /**
     * Define industry-specific pain points by business unit
     */
    defineIndustryPainPoints() {
        return {
            technology: {
                sourcing: [
                    {
                        painPoint: 'Extreme talent competition for in-demand skills',
                        severity: 'critical',
                        frequency: 'daily',
                        description: 'Top engineers receive 10+ offers simultaneously. Speed and personalization critical.',
                        impact: 'Lose 60% of qualified candidates to faster competitors',
                        aiSolution: 'AI-powered instant response and personalized outreach at scale',
                        estimatedImprovement: '70% faster response time, 3x higher acceptance rate'
                    },
                    {
                        painPoint: 'Technical skills assessment complexity',
                        severity: 'high',
                        frequency: 'daily',
                        description: 'Screening for specialized skills (React, Kubernetes, ML) requires deep expertise',
                        impact: '70% of submitted candidates don\'t pass technical screens',
                        aiSolution: 'AI technical skill extraction and matching from GitHub/Stack Overflow',
                        estimatedImprovement: '85% reduction in unqualified submissions'
                    },
                    {
                        painPoint: 'Passive candidate sourcing time sink',
                        severity: 'high',
                        frequency: 'daily',
                        description: 'Most top engineers aren\'t actively looking, require extensive research and outreach',
                        impact: 'Spend 12+ hours per week on passive sourcing research',
                        aiSolution: 'AI-powered talent mapping and automated passive candidate engagement',
                        estimatedImprovement: '90% time reduction on research, 4x more passive engagement'
                    }
                ],

                scheduling: [
                    {
                        painPoint: 'Multi-timezone coordination for remote teams',
                        severity: 'medium',
                        frequency: 'daily',
                        description: 'Coordinating interviews across US, Europe, Asia timezones',
                        impact: 'Average 2-3 days delay per interview due to timezone complexity',
                        aiSolution: 'AI timezone optimizer with automatic best-time suggestions',
                        estimatedImprovement: '80% faster scheduling, eliminate timezone errors'
                    },
                    {
                        painPoint: 'Technical interview complexity',
                        severity: 'medium',
                        frequency: 'daily',
                        description: 'Coordinating multiple technical rounds (coding, system design, behavioral)',
                        impact: '5-7 day average time-to-offer due to multi-stage coordination',
                        aiSolution: 'AI interview orchestration with automatic sequencing and prep',
                        estimatedImprovement: '60% faster multi-stage coordination'
                    }
                ],

                compliance: [
                    {
                        painPoint: 'GDPR/data privacy compliance for global hiring',
                        severity: 'critical',
                        frequency: 'weekly',
                        description: 'Managing candidate data across jurisdictions with different privacy laws',
                        impact: 'Risk of €20M fines for GDPR violations',
                        aiSolution: 'AI compliance monitoring with automatic data retention policies',
                        estimatedImprovement: '99% compliance accuracy, zero violations'
                    },
                    {
                        painPoint: 'Equity/stock option documentation complexity',
                        severity: 'medium',
                        frequency: 'weekly',
                        description: 'Complex equity packages require specialized documentation and compliance',
                        impact: '8+ hours per offer letter with equity components',
                        aiSolution: 'AI equity documentation generator with SEC/legal compliance',
                        estimatedImprovement: '95% time reduction, legal-approved templates'
                    }
                ],

                contracts: [
                    {
                        painPoint: 'IP assignment and non-compete complexity',
                        severity: 'high',
                        frequency: 'weekly',
                        description: 'Every contract requires IP assignment clauses, varying by state/country',
                        impact: 'Average 6 redline cycles per contract for IP terms',
                        aiSolution: 'AI contract generator with jurisdiction-aware IP clauses',
                        estimatedImprovement: '75% reduction in redline cycles'
                    }
                ],

                admin: [
                    {
                        painPoint: 'Multiple ATS/tool integration overhead',
                        severity: 'medium',
                        frequency: 'daily',
                        description: 'Tech companies use 5-10 recruiting tools that don\'t integrate',
                        impact: '10+ hours/week on manual data sync across tools',
                        aiSolution: 'AI integration middleware with automatic data sync',
                        estimatedImprovement: '95% reduction in manual data entry'
                    }
                ]
            },

            healthcare: {
                sourcing: [
                    {
                        painPoint: 'Credential verification bottleneck',
                        severity: 'critical',
                        frequency: 'daily',
                        description: 'Verifying medical licenses, certifications, DEA numbers for every candidate',
                        impact: 'Average 5-7 days per candidate for credential verification',
                        aiSolution: 'AI credential verification with real-time license database checks',
                        estimatedImprovement: '90% time reduction, instant verification'
                    },
                    {
                        painPoint: 'Shift coverage urgency',
                        severity: 'critical',
                        frequency: 'daily',
                        description: 'Last-minute shift coverage needs (nurse call-outs, ER surges)',
                        impact: 'Unfilled shifts cost $2,500+ per shift in agency fees',
                        aiSolution: 'AI shift-matching with instant notifications to qualified staff',
                        estimatedImprovement: '80% reduction in agency usage, 95% shift fill rate'
                    }
                ],

                scheduling: [
                    {
                        painPoint: '24/7 shift scheduling complexity',
                        severity: 'critical',
                        frequency: 'daily',
                        description: 'Managing rotating shifts, on-call schedules, union rules, certifications',
                        impact: '20+ hours/week on shift scheduling, frequent errors',
                        aiSolution: 'AI shift optimizer with union rules and certification tracking',
                        estimatedImprovement: '85% time reduction, zero compliance errors'
                    }
                ],

                compliance: [
                    {
                        painPoint: 'HIPAA compliance for candidate data',
                        severity: 'critical',
                        frequency: 'daily',
                        description: 'All candidate communications must be HIPAA-compliant',
                        impact: 'Risk of $50K-$1.5M fines per violation',
                        aiSolution: 'AI HIPAA compliance monitor with automatic redaction',
                        estimatedImprovement: '100% HIPAA compliance, zero violations'
                    },
                    {
                        painPoint: 'Joint Commission audit preparation',
                        severity: 'critical',
                        frequency: 'quarterly',
                        description: 'Preparing 100+ documents for accreditation audits',
                        impact: '80+ hours per audit, risk of accreditation loss',
                        aiSolution: 'AI audit prep with automatic documentation assembly',
                        estimatedImprovement: '90% time reduction, zero findings'
                    }
                ],

                contracts: [
                    {
                        painPoint: 'Malpractice insurance verification',
                        severity: 'high',
                        frequency: 'weekly',
                        description: 'Verifying and tracking malpractice insurance for all clinical staff',
                        impact: 'Uninsured providers create $1M+ liability risk',
                        aiSolution: 'AI insurance tracking with automatic renewal alerts',
                        estimatedImprovement: '100% insurance coverage, zero gaps'
                    }
                ],

                admin: [
                    {
                        painPoint: 'Multiple credentialing database updates',
                        severity: 'high',
                        frequency: 'daily',
                        description: 'Updating credentials in ATS, hospital system, state databases',
                        impact: '15+ hours/week on duplicate data entry',
                        aiSolution: 'AI credential sync across all systems',
                        estimatedImprovement: '95% time reduction, real-time sync'
                    }
                ]
            },

            financial: {
                sourcing: [
                    {
                        painPoint: 'Background check intensity and timeline',
                        severity: 'critical',
                        frequency: 'daily',
                        description: 'FINRA, credit checks, criminal background for all financial roles',
                        impact: 'Average 14-21 days for background clearance, lose candidates',
                        aiSolution: 'AI background check orchestration with parallel processing',
                        estimatedImprovement: '60% faster clearance, reduce candidate drop-off'
                    }
                ],

                scheduling: [
                    {
                        painPoint: 'Client-facing interview coordination',
                        severity: 'medium',
                        frequency: 'weekly',
                        description: 'Coordinating interviews with client teams in different time zones',
                        impact: '3-4 day average delay for client interview scheduling',
                        aiSolution: 'AI multi-party scheduling with client preference learning',
                        estimatedImprovement: '70% faster client interview coordination'
                    }
                ],

                compliance: [
                    {
                        painPoint: 'SOX compliance for hiring documentation',
                        severity: 'critical',
                        frequency: 'daily',
                        description: 'All hiring decisions must be auditable for SOX compliance',
                        impact: 'Risk of $5M fines and executive liability',
                        aiSolution: 'AI SOX compliance tracker with automatic audit trails',
                        estimatedImprovement: '100% audit readiness, zero findings'
                    },
                    {
                        painPoint: 'FINRA registration and licensing tracking',
                        severity: 'critical',
                        frequency: 'weekly',
                        description: 'Tracking Series 7, 63, 65 licenses and renewals',
                        impact: 'Unlicensed employees create regulatory violations',
                        aiSolution: 'AI license tracking with automatic renewal workflows',
                        estimatedImprovement: '100% license compliance, zero lapses'
                    }
                ],

                contracts: [
                    {
                        painPoint: 'Non-disclosure and confidentiality complexity',
                        severity: 'high',
                        frequency: 'daily',
                        description: 'Every role requires specialized NDA and confidentiality clauses',
                        impact: 'Average 8 redline cycles per contract for confidentiality terms',
                        aiSolution: 'AI NDA generator with role-specific confidentiality templates',
                        estimatedImprovement: '80% reduction in redline cycles'
                    }
                ],

                admin: [
                    {
                        painPoint: 'Audit trail documentation requirements',
                        severity: 'high',
                        frequency: 'daily',
                        description: 'Every action must be documented for regulatory audits',
                        impact: '12+ hours/week on audit trail documentation',
                        aiSolution: 'AI automatic audit logging with regulatory formatting',
                        estimatedImprovement: '95% time reduction, perfect audit trails'
                    }
                ]
            },

            manufacturing: {
                sourcing: [
                    {
                        painPoint: 'High-volume hourly hiring',
                        severity: 'critical',
                        frequency: 'daily',
                        description: 'Hiring 50-100+ hourly workers per month for production',
                        impact: 'Production delays from understaffing cost $10K+ per day',
                        aiSolution: 'AI high-volume screening with instant qualification',
                        estimatedImprovement: '10x faster screening, 95% fill rate'
                    },
                    {
                        painPoint: 'Seasonal surge hiring',
                        severity: 'high',
                        frequency: 'quarterly',
                        description: 'Need to hire 200+ workers in 2-3 weeks for peak season',
                        impact: 'Miss production targets during peak season',
                        aiSolution: 'AI surge hiring with predictive staffing models',
                        estimatedImprovement: '80% faster surge hiring, predict needs 6 weeks ahead'
                    }
                ],

                scheduling: [
                    {
                        painPoint: 'Multi-shift coordination complexity',
                        severity: 'critical',
                        frequency: 'daily',
                        description: 'Managing 3-shift rotations, overtime rules, union constraints',
                        impact: '25+ hours/week on shift management, frequent errors',
                        aiSolution: 'AI shift optimizer with union rules and production needs',
                        estimatedImprovement: '90% time reduction, optimal shift coverage'
                    }
                ],

                compliance: [
                    {
                        painPoint: 'OSHA safety training tracking',
                        severity: 'critical',
                        frequency: 'weekly',
                        description: 'Tracking safety certifications, forklift licenses, PPE training',
                        impact: 'Risk of $140K OSHA fines per violation',
                        aiSolution: 'AI safety certification tracking with automatic training scheduling',
                        estimatedImprovement: '100% certification compliance, zero violations'
                    }
                ],

                contracts: [
                    {
                        painPoint: 'Union contract variations',
                        severity: 'high',
                        frequency: 'weekly',
                        description: 'Different union contracts by location and role',
                        impact: 'Average 5 redline cycles per contract for union terms',
                        aiSolution: 'AI union contract generator with location-aware terms',
                        estimatedImprovement: '75% reduction in contract errors'
                    }
                ],

                admin: [
                    {
                        painPoint: 'Multi-site data coordination',
                        severity: 'medium',
                        frequency: 'daily',
                        description: 'Coordinating hiring data across 10+ manufacturing sites',
                        impact: '15+ hours/week on cross-site data management',
                        aiSolution: 'AI multi-site data hub with automatic synchronization',
                        estimatedImprovement: '90% time reduction, real-time visibility'
                    }
                ]
            },

            consulting: {
                sourcing: [
                    {
                        painPoint: 'Niche skill matching for client projects',
                        severity: 'critical',
                        frequency: 'weekly',
                        description: 'Finding consultants with exact skill match for specialized projects',
                        impact: 'Project delays cost $50K+ per week in client penalties',
                        aiSolution: 'AI skill matching with project requirement extraction',
                        estimatedImprovement: '85% faster niche talent matching'
                    },
                    {
                        painPoint: 'Rapid deployment pressure',
                        severity: 'high',
                        frequency: 'weekly',
                        description: 'Client needs consultants on-site within 48-72 hours',
                        impact: 'Lose $200K+ projects to faster competitors',
                        aiSolution: 'AI instant-match with pre-vetted consultant pool',
                        estimatedImprovement: '90% faster deployment, 24-hour turnaround'
                    }
                ],

                scheduling: [
                    {
                        painPoint: 'Client-site interview complexity',
                        severity: 'medium',
                        frequency: 'weekly',
                        description: 'Coordinating on-site client interviews across multiple locations',
                        impact: '5+ day average time to client interview',
                        aiSolution: 'AI client scheduling with travel coordination',
                        estimatedImprovement: '70% faster client interview scheduling'
                    }
                ],

                compliance: [
                    {
                        painPoint: 'Client confidentiality and conflict checks',
                        severity: 'critical',
                        frequency: 'daily',
                        description: 'Ensuring consultants don\'t have conflicts with client competitors',
                        impact: 'Risk of $1M+ lawsuits for conflict violations',
                        aiSolution: 'AI conflict checker with automatic client screening',
                        estimatedImprovement: '100% conflict detection, zero violations'
                    }
                ],

                contracts: [
                    {
                        painPoint: 'Custom MSA and SOW complexity',
                        severity: 'high',
                        frequency: 'weekly',
                        description: 'Every client requires customized Master Service Agreement and Statement of Work',
                        impact: 'Average 10 redline cycles per client contract',
                        aiSolution: 'AI contract generator with client-specific term libraries',
                        estimatedImprovement: '80% reduction in contract negotiation time'
                    }
                ],

                admin: [
                    {
                        painPoint: 'Multi-client timesheet and billing coordination',
                        severity: 'medium',
                        frequency: 'daily',
                        description: 'Tracking consultant time across 20+ simultaneous client projects',
                        impact: '10+ hours/week on timesheet and billing coordination',
                        aiSolution: 'AI timesheet automation with client billing integration',
                        estimatedImprovement: '95% time reduction, accurate billing'
                    }
                ]
            },

            retail: {
                sourcing: [
                    {
                        painPoint: 'Extreme high-volume hiring',
                        severity: 'critical',
                        frequency: 'daily',
                        description: 'Hiring 100-500+ hourly workers per month across locations',
                        impact: 'Understaffing costs $50K+ per week in lost sales',
                        aiSolution: 'AI mass screening with instant application processing',
                        estimatedImprovement: '20x faster screening, 1-day time-to-hire'
                    },
                    {
                        painPoint: 'Holiday season surge hiring',
                        severity: 'critical',
                        frequency: 'annually',
                        description: 'Need to hire 1,000+ seasonal workers in 4-6 weeks',
                        impact: 'Miss holiday sales targets from understaffing',
                        aiSolution: 'AI surge hiring with predictive demand models',
                        estimatedImprovement: '90% faster surge hiring, 98% fill rate'
                    }
                ],

                scheduling: [
                    {
                        painPoint: 'Multi-location interview coordination',
                        severity: 'high',
                        frequency: 'daily',
                        description: 'Scheduling interviews across 50+ store locations',
                        impact: '30+ hours/week on cross-location scheduling',
                        aiSolution: 'AI location-based scheduling with store manager coordination',
                        estimatedImprovement: '85% time reduction, optimal location matching'
                    }
                ],

                compliance: [
                    {
                        painPoint: 'Multi-state labor law compliance',
                        severity: 'high',
                        frequency: 'daily',
                        description: 'Complying with different labor laws across 20+ states',
                        impact: 'Risk of $50K+ fines per state for violations',
                        aiSolution: 'AI labor law compliance with state-specific rules',
                        estimatedImprovement: '100% multi-state compliance, zero violations'
                    }
                ],

                contracts: [
                    {
                        painPoint: 'Seasonal worker contract variations',
                        severity: 'medium',
                        frequency: 'quarterly',
                        description: 'Different contract terms for seasonal vs permanent workers',
                        impact: '3+ hours per seasonal contract batch',
                        aiSolution: 'AI seasonal contract generator with automatic term selection',
                        estimatedImprovement: '90% faster seasonal contracting'
                    }
                ],

                admin: [
                    {
                        painPoint: 'High turnover data churn',
                        severity: 'high',
                        frequency: 'daily',
                        description: 'Constant onboarding and offboarding with 60%+ annual turnover',
                        impact: '20+ hours/week on turnover-related admin',
                        aiSolution: 'AI turnover automation with automatic offboarding',
                        estimatedImprovement: '85% time reduction, seamless transitions'
                    }
                ]
            }
        };
    }

    /**
     * Define industry-specific benchmarks
     */
    defineIndustryBenchmarks() {
        return {
            technology: {
                sourcing: {
                    timeToFill: { average: 35, best: 21, unit: 'days' },
                    candidatesPerRole: { average: 15, best: 25, unit: 'candidates' },
                    responseRate: { average: 25, best: 40, unit: '%' },
                    offerAcceptance: { average: 75, best: 90, unit: '%' }
                },
                scheduling: {
                    timeToFirstInterview: { average: 5, best: 2, unit: 'days' },
                    interviewsPerHire: { average: 4.5, best: 3.5, unit: 'interviews' }
                }
            },

            healthcare: {
                sourcing: {
                    timeToFill: { average: 45, best: 30, unit: 'days' },
                    credentialingTime: { average: 7, best: 2, unit: 'days' },
                    shiftFillRate: { average: 85, best: 98, unit: '%' }
                },
                scheduling: {
                    shiftCoverageRate: { average: 92, best: 99, unit: '%' },
                    scheduleChangeRate: { average: 25, best: 8, unit: '%' }
                }
            },

            financial: {
                sourcing: {
                    timeToFill: { average: 50, best: 35, unit: 'days' },
                    backgroundCheckTime: { average: 14, best: 7, unit: 'days' },
                    compliancePassRate: { average: 90, best: 99, unit: '%' }
                },
                compliance: {
                    auditFindingsPerYear: { average: 3, best: 0, unit: 'findings' },
                    documentationAccuracy: { average: 95, best: 99.9, unit: '%' }
                }
            },

            manufacturing: {
                sourcing: {
                    timeToFill: { average: 18, best: 5, unit: 'days' },
                    volumeHiringRate: { average: 80, best: 150, unit: 'hires/month' },
                    seasonalFillRate: { average: 85, best: 98, unit: '%' }
                },
                compliance: {
                    safetyComplianceRate: { average: 95, best: 100, unit: '%' },
                    certificationTrackingAccuracy: { average: 90, best: 100, unit: '%' }
                }
            },

            consulting: {
                sourcing: {
                    timeToFill: { average: 25, best: 10, unit: 'days' },
                    skillMatchAccuracy: { average: 70, best: 95, unit: '%' },
                    deploymentSpeed: { average: 5, best: 1, unit: 'days' }
                },
                contracts: {
                    contractNegotiationTime: { average: 12, best: 3, unit: 'days' },
                    redlineCycles: { average: 8, best: 2, unit: 'cycles' }
                }
            },

            retail: {
                sourcing: {
                    timeToFill: { average: 12, best: 2, unit: 'days' },
                    volumeHiringRate: { average: 120, best: 300, unit: 'hires/month' },
                    seasonalFillRate: { average: 80, best: 98, unit: '%' }
                },
                admin: {
                    turnoverRate: { average: 65, best: 35, unit: '%/year' },
                    onboardingTime: { average: 3, best: 1, unit: 'days' }
                }
            }
        };
    }

    /**
     * Define industry-specific regulations
     */
    defineIndustryRegulations() {
        return {
            technology: [
                { name: 'GDPR', description: 'EU data privacy for global hiring', severity: 'critical', fineRange: '€20M or 4% revenue' },
                { name: 'CCPA', description: 'California consumer privacy', severity: 'high', fineRange: '$7,500 per violation' },
                { name: 'Export Control (ITAR/EAR)', description: 'For defense tech companies', severity: 'critical', fineRange: '$1M+ per violation' }
            ],

            healthcare: [
                { name: 'HIPAA', description: 'Health information privacy', severity: 'critical', fineRange: '$50K-$1.5M per violation' },
                { name: 'Joint Commission', description: 'Healthcare accreditation standards', severity: 'critical', fineRange: 'Loss of accreditation' },
                { name: 'State Licensing Boards', description: 'Professional license verification', severity: 'critical', fineRange: '$50K+ fines, criminal liability' }
            ],

            financial: [
                { name: 'SOX', description: 'Financial reporting compliance', severity: 'critical', fineRange: '$5M fines, executive imprisonment' },
                { name: 'FINRA', description: 'Financial industry regulatory authority', severity: 'critical', fineRange: '$100K+ per violation' },
                { name: 'BSA/AML', description: 'Bank Secrecy Act anti-money laundering', severity: 'critical', fineRange: '$1M+ per violation' },
                { name: 'GLBA', description: 'Gramm-Leach-Bliley Act privacy', severity: 'high', fineRange: '$100K per violation' }
            ],

            manufacturing: [
                { name: 'OSHA', description: 'Occupational safety and health', severity: 'critical', fineRange: '$140K per violation' },
                { name: 'EPA', description: 'Environmental compliance', severity: 'high', fineRange: '$50K per day per violation' },
                { name: 'FLSA', description: 'Fair Labor Standards Act', severity: 'high', fineRange: '$10K+ per violation' }
            ],

            consulting: [
                { name: 'SOC 2', description: 'Service organization controls', severity: 'high', fineRange: 'Loss of client trust, contract termination' },
                { name: 'Professional Liability', description: 'E&O insurance requirements', severity: 'high', fineRange: '$1M+ lawsuits' },
                { name: 'Conflict of Interest Rules', description: 'Client confidentiality and conflicts', severity: 'critical', fineRange: '$5M+ lawsuits, disbarment' }
            ],

            retail: [
                { name: 'FLSA', description: 'Fair Labor Standards Act (overtime)', severity: 'critical', fineRange: '$10K+ per violation' },
                { name: 'State Labor Laws', description: 'Varying minimum wage, break rules', severity: 'high', fineRange: '$50K+ per state' },
                { name: 'EEOC', description: 'Equal employment opportunity', severity: 'high', fineRange: '$300K+ per case' }
            ]
        };
    }

    /**
     * Detect user's industry from answer patterns
     */
    detectIndustry(answers) {
        const scores = {};

        // Initialize scores
        Object.keys(this.industries).forEach(industryKey => {
            scores[industryKey] = {
                score: 0,
                confidence: 0,
                signals: []
            };
        });

        // Analyze answers for industry signals
        Object.keys(this.industries).forEach(industryKey => {
            const industry = this.industries[industryKey];
            const detectionSignals = industry.detectionSignals;

            // Check for keyword matches in text answers
            Object.values(answers).forEach(answer => {
                if (typeof answer === 'string') {
                    const lowerAnswer = answer.toLowerCase();
                    detectionSignals.keywords.forEach(keyword => {
                        if (lowerAnswer.includes(keyword)) {
                            scores[industryKey].score += 10;
                            scores[industryKey].signals.push(`Keyword match: "${keyword}"`);
                        }
                    });
                }
            });

            // Check volume indicators
            if (detectionSignals.volumeIndicators) {
                Object.keys(detectionSignals.volumeIndicators).forEach(questionKey => {
                    const indicator = detectionSignals.volumeIndicators[questionKey];
                    const userAnswer = answers[questionKey];

                    if (userAnswer) {
                        // Check if it's an array (multiple choice)
                        if (Array.isArray(indicator)) {
                            if (indicator.includes(userAnswer)) {
                                scores[industryKey].score += 5;
                                scores[industryKey].signals.push(`Volume indicator: ${questionKey}`);
                            }
                        }
                        // Check if it's a min/max range
                        else if (indicator.min || indicator.max) {
                            const numAnswer = parseFloat(userAnswer);
                            if (!isNaN(numAnswer)) {
                                if (indicator.min && numAnswer >= indicator.min) {
                                    scores[industryKey].score += 5;
                                    scores[industryKey].signals.push(`High volume: ${questionKey}`);
                                }
                                if (indicator.max && numAnswer <= indicator.max) {
                                    scores[industryKey].score += 5;
                                    scores[industryKey].signals.push(`Low volume: ${questionKey}`);
                                }
                            }
                        }
                    }
                });
            }
        });

        // Calculate confidence based on score and number of signals
        Object.keys(scores).forEach(industryKey => {
            const signalCount = scores[industryKey].signals.length;
            const rawScore = scores[industryKey].score;

            if (signalCount >= 3 && rawScore >= 20) {
                scores[industryKey].confidence = 0.9; // High confidence
            } else if (signalCount >= 2 && rawScore >= 15) {
                scores[industryKey].confidence = 0.7; // Medium confidence
            } else if (signalCount >= 1 && rawScore >= 10) {
                scores[industryKey].confidence = 0.5; // Low confidence
            } else {
                scores[industryKey].confidence = 0.2; // Very low confidence
            }
        });

        // Find top industry
        let topIndustry = null;
        let topScore = 0;

        Object.keys(scores).forEach(industryKey => {
            if (scores[industryKey].score > topScore) {
                topScore = scores[industryKey].score;
                topIndustry = industryKey;
            }
        });

        // If no clear industry detected, return null
        if (!topIndustry || scores[topIndustry].confidence < 0.5) {
            return {
                detected: false,
                industry: null,
                confidence: 0,
                message: 'Industry could not be reliably detected from answers. Showing generic pain points.',
                allScores: scores
            };
        }

        return {
            detected: true,
            industry: topIndustry,
            industryProfile: this.industries[topIndustry],
            confidence: scores[topIndustry].confidence,
            signals: scores[topIndustry].signals,
            allScores: scores
        };
    }

    /**
     * Analyze industry-specific pains for detected industry
     */
    analyzeIndustryPains(businessUnit, industryDetection) {
        if (!industryDetection.detected) {
            return null;
        }

        const industry = industryDetection.industry;
        const industryPains = this.industryPainPoints[industry];

        if (!industryPains || !industryPains[businessUnit]) {
            return null;
        }

        const painPoints = industryPains[businessUnit];
        const benchmarks = this.industryBenchmarks[industry][businessUnit] || {};
        const regulations = this.industryRegulations[industry] || [];

        return {
            industry: industryDetection.industryProfile,
            businessUnit,
            painPoints,
            painCount: painPoints.length,
            criticalPains: painPoints.filter(p => p.severity === 'critical').length,
            highPains: painPoints.filter(p => p.severity === 'high').length,
            benchmarks,
            regulations,
            confidence: industryDetection.confidence,
            detectionSignals: industryDetection.signals
        };
    }

    /**
     * Render industry pain analysis
     */
    renderIndustryPainAnalysis(analysis) {
        if (!analysis) {
            return '';
        }

        const { industry, businessUnit, painPoints, criticalPains, highPains, benchmarks, regulations, confidence } = analysis;

        const businessUnitLabels = {
            sourcing: 'Sourcing',
            scheduling: 'Scheduling',
            compliance: 'Compliance',
            contracts: 'Contracts',
            admin: 'Admin'
        };

        const severityIcons = {
            critical: '🔴🔴',
            high: '🔴',
            medium: '🟡',
            low: '🟢'
        };

        const severityLabels = {
            critical: 'CRITICAL',
            high: 'HIGH',
            medium: 'MEDIUM',
            low: 'LOW'
        };

        return `
            <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 shadow-lg border-2 border-purple-200 mb-8">
                <div class="flex items-start justify-between mb-6">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">
                            ${industry.icon} ${industry.name} Industry Pain Points
                        </h3>
                        <p class="text-gray-600">
                            ${businessUnitLabels[businessUnit]} challenges specific to ${industry.name}
                        </p>
                        <p class="text-sm text-purple-600 mt-2">
                            Detection Confidence: ${Math.round(confidence * 100)}%
                        </p>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold text-purple-600">${painPoints.length}</div>
                        <div class="text-sm text-gray-600">Industry-Specific Pains</div>
                        <div class="text-xs text-red-600 mt-1">${criticalPains} critical, ${highPains} high</div>
                    </div>
                </div>

                ${painPoints.map((pain, index) => `
                    <div class="bg-white rounded-lg p-6 mb-4 border-l-4 ${
                        pain.severity === 'critical' ? 'border-red-600' :
                        pain.severity === 'high' ? 'border-orange-500' :
                        pain.severity === 'medium' ? 'border-yellow-500' :
                        'border-green-500'
                    }">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex-grow">
                                <div class="flex items-center gap-3 mb-2">
                                    <span class="text-2xl">${severityIcons[pain.severity]}</span>
                                    <h4 class="text-lg font-bold text-gray-900">${index + 1}. ${pain.painPoint}</h4>
                                </div>
                                <div class="flex items-center gap-4 text-sm mb-3">
                                    <span class="px-3 py-1 rounded-full font-semibold ${
                                        pain.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                        pain.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                        pain.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                    }">
                                        ${severityLabels[pain.severity]} SEVERITY
                                    </span>
                                    <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
                                        Occurs: ${pain.frequency}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p class="text-sm font-semibold text-gray-700 mb-2">📋 Description:</p>
                                <p class="text-sm text-gray-600">${pain.description}</p>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-gray-700 mb-2">💥 Impact:</p>
                                <p class="text-sm text-red-600 font-medium">${pain.impact}</p>
                            </div>
                        </div>

                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                            <p class="text-sm font-semibold text-green-800 mb-2">✨ AI Solution:</p>
                            <p class="text-sm text-gray-700 mb-2">${pain.aiSolution}</p>
                            <p class="text-sm font-bold text-green-600">
                                💰 Estimated Improvement: ${pain.estimatedImprovement}
                            </p>
                        </div>
                    </div>
                `).join('')}

                ${Object.keys(benchmarks).length > 0 ? `
                    <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 mt-6 border border-blue-200">
                        <h4 class="text-lg font-bold text-gray-900 mb-4">
                            📊 ${industry.name} Industry Benchmarks (${businessUnitLabels[businessUnit]})
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${Object.keys(benchmarks).map(metric => {
                                const benchmark = benchmarks[metric];
                                return `
                                    <div class="bg-white rounded-lg p-4 border border-blue-100">
                                        <p class="text-sm font-semibold text-gray-700 mb-2 capitalize">
                                            ${metric.replace(/([A-Z])/g, ' $1').trim()}
                                        </p>
                                        <div class="flex items-baseline gap-2">
                                            <span class="text-2xl font-bold text-blue-600">${benchmark.average}</span>
                                            <span class="text-sm text-gray-500">${benchmark.unit} (avg)</span>
                                        </div>
                                        <div class="flex items-baseline gap-2 mt-1">
                                            <span class="text-lg font-semibold text-green-600">${benchmark.best}</span>
                                            <span class="text-sm text-gray-500">${benchmark.unit} (best-in-class)</span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}

                ${regulations.length > 0 ? `
                    <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 mt-6 border border-red-200">
                        <h4 class="text-lg font-bold text-gray-900 mb-4">
                            ⚠️ ${industry.name} Regulatory Requirements
                        </h4>
                        <div class="space-y-3">
                            ${regulations.map(reg => `
                                <div class="flex items-start gap-3 bg-white rounded-lg p-4 border border-red-100">
                                    <span class="text-2xl">${reg.severity === 'critical' ? '🔴' : '🟠'}</span>
                                    <div class="flex-grow">
                                        <p class="font-bold text-gray-900">${reg.name}</p>
                                        <p class="text-sm text-gray-600 mb-1">${reg.description}</p>
                                        <p class="text-xs font-semibold text-red-600">
                                            Penalty: ${reg.fineRange}
                                        </p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mt-6 border border-purple-200">
                    <h4 class="text-lg font-bold text-gray-900 mb-3">
                        💡 Key Takeaways for ${industry.name}
                    </h4>
                    <div class="space-y-2 text-sm text-gray-700">
                        <p>✓ You face <strong>${painPoints.length} industry-specific challenges</strong> beyond generic recruitment pain points</p>
                        <p>✓ <strong>${criticalPains} critical issues</strong> require immediate attention to avoid business impact</p>
                        <p>✓ AI solutions can address <strong>all ${painPoints.length} pain points</strong> with industry-specific automation</p>
                        ${regulations.length > 0 ? `<p>✓ Navigate <strong>${regulations.length} regulatory requirements</strong> specific to ${industry.name}</p>` : ''}
                        <p>✓ Industry benchmarks show clear path to <strong>best-in-class performance</strong></p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Export industry pain analysis
     */
    exportIndustryAnalysis(analysis) {
        if (!analysis) {
            return null;
        }

        return {
            industry: analysis.industry.name,
            industryIcon: analysis.industry.icon,
            businessUnit: analysis.businessUnit,
            confidence: analysis.confidence,
            detectionSignals: analysis.detectionSignals,
            painPoints: analysis.painPoints.map(pain => ({
                painPoint: pain.painPoint,
                severity: pain.severity,
                frequency: pain.frequency,
                description: pain.description,
                impact: pain.impact,
                aiSolution: pain.aiSolution,
                estimatedImprovement: pain.estimatedImprovement
            })),
            statistics: {
                totalPains: analysis.painCount,
                criticalPains: analysis.criticalPains,
                highPains: analysis.highPains
            },
            benchmarks: analysis.benchmarks,
            regulations: analysis.regulations
        };
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.IndustryPainDetector = IndustryPainDetector;
}
