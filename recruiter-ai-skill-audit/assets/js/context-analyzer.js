/**
 * Enhanced Context Analyzer for AI Skills Audit
 * Provides multi-layered context understanding beyond raw user answers
 */

class ContextAnalyzer {
    constructor() {
        this.behaviorTracker = new BehaviorTracker();
        this.startTime = Date.now();
    }

    /**
     * Generate comprehensive context from user answers and behavioral data
     */
    generateEnhancedContext(answers, businessUnit, questions) {
        return {
            // Explicit answers
            userAnswers: answers,
            businessUnit: businessUnit,

            // Derived insights
            painPoints: this.extractPainPoints(answers, businessUnit),
            workflowPatterns: this.analyzeWorkflowPatterns(answers, businessUnit),
            toolGaps: this.identifyToolGaps(answers, businessUnit),

            // Behavioral signals
            behaviorSignals: this.behaviorTracker.getSignals(),

            // Environmental context
            environmentalContext: this.inferEnvironmentalContext(answers, businessUnit),

            // Urgency and priority
            urgencyScore: this.calculateUrgencyScore(answers, businessUnit),

            // Readiness assessment
            readinessFactors: this.assessReadiness(answers)
        };
    }

    /**
     * Extract pain points from user answers
     * Identifies the biggest challenges and bottlenecks
     */
    extractPainPoints(answers, businessUnit) {
        const painPoints = [];

        // Common pain point patterns across all business units
        if (answers.aiexperience === 'none') {
            painPoints.push({
                category: 'knowledge_gap',
                severity: 'high',
                description: 'No AI experience - steep learning curve ahead',
                impact: 'May slow initial adoption',
                recommendation: 'Start with user-friendly tools and comprehensive training'
            });
        }

        // Business unit specific pain points
        switch (businessUnit) {
            case 'sourcing':
                painPoints.push(...this.extractSourcingPainPoints(answers));
                break;
            case 'admin':
                painPoints.push(...this.extractAdminPainPoints(answers));
                break;
            case 'scheduling':
                painPoints.push(...this.extractSchedulingPainPoints(answers));
                break;
            case 'compliance':
                painPoints.push(...this.extractCompliancePainPoints(answers));
                break;
            case 'contracts':
                painPoints.push(...this.extractContractsPainPoints(answers));
                break;
        }

        return painPoints.sort((a, b) => {
            const severityOrder = { high: 3, medium: 2, low: 1 };
            return severityOrder[b.severity] - severityOrder[a.severity];
        });
    }

    extractSourcingPainPoints(answers) {
        const painPoints = [];

        // Boolean search complexity
        if (answers.sourcing_boolean_time && parseFloat(answers.sourcing_boolean_time) >= 3) {
            painPoints.push({
                category: 'time_intensive',
                severity: 'high',
                description: `Spending ${answers.sourcing_boolean_time}+ hrs/week on Boolean searches`,
                impact: 'Significant time drain on strategic sourcing work',
                recommendation: 'AI can generate Boolean strings in seconds'
            });
        }

        // Candidate volume challenges
        if (answers.sourcing_active_roles && parseInt(answers.sourcing_active_roles) > 20) {
            painPoints.push({
                category: 'volume_overload',
                severity: 'high',
                description: `Managing ${answers.sourcing_active_roles}+ active roles simultaneously`,
                impact: 'Risk of candidate experience degradation',
                recommendation: 'AI-powered automation for high-volume sourcing'
            });
        }

        // Market mapping gaps
        if (answers.sourcing_market_maps_frequency === 'never' || answers.sourcing_market_maps_frequency === 'rarely') {
            painPoints.push({
                category: 'strategic_gap',
                severity: 'medium',
                description: 'Limited market mapping and competitor intelligence',
                impact: 'Missing strategic talent insights',
                recommendation: 'AI can automate market research and mapping'
            });
        }

        return painPoints;
    }

    extractAdminPainPoints(answers) {
        const painPoints = [];

        // Manual data transfers
        if (answers.admin_manual_transfers && answers.admin_manual_transfers.startsWith('yes')) {
            const frequency = answers.admin_manual_transfers.split('_')[1]; // daily, weekly, monthly
            painPoints.push({
                category: 'manual_work',
                severity: frequency === 'daily' ? 'high' : 'medium',
                description: `Manual data transfers ${frequency}`,
                impact: 'High error risk and time waste',
                recommendation: 'AI can automate data synchronization'
            });
        }

        // Low template usage
        if (answers.admin_template_usage === '0-25') {
            painPoints.push({
                category: 'efficiency_gap',
                severity: 'medium',
                description: 'Low template usage (0-25%) - recreating work',
                impact: 'Unnecessary duplication of effort',
                recommendation: 'AI can generate templates and standardize processes'
            });
        }

        // Data quality issues
        if (answers.admin_data_errors && answers.admin_data_errors.length > 0) {
            painPoints.push({
                category: 'quality_issue',
                severity: 'high',
                description: `${answers.admin_data_errors.length} types of data errors`,
                impact: 'Data integrity problems affecting decisions',
                recommendation: 'AI can validate and clean data automatically'
            });
        }

        return painPoints;
    }

    extractSchedulingPainPoints(answers) {
        const painPoints = [];

        // High coordination complexity
        if (answers.scheduling_multi_panel && parseInt(answers.scheduling_multi_panel) > 50) {
            painPoints.push({
                category: 'coordination_complexity',
                severity: 'high',
                description: `${answers.scheduling_multi_panel}% of interviews require multi-panel coordination`,
                impact: 'Massive time spent on calendar coordination',
                recommendation: 'AI scheduling assistants can handle complex coordination'
            });
        }

        // No-show problems
        if (answers.scheduling_no_shows && parseInt(answers.scheduling_no_shows) > 10) {
            painPoints.push({
                category: 'process_breakdown',
                severity: 'medium',
                description: `${answers.scheduling_no_shows}% no-show rate`,
                impact: 'Wasted interviewer time and poor candidate experience',
                recommendation: 'AI can send smart reminders and confirmations'
            });
        }

        // Calendar integration gaps
        if (answers.scheduling_calendar_systems && answers.scheduling_calendar_systems.includes('none')) {
            painPoints.push({
                category: 'integration_gap',
                severity: 'high',
                description: 'No calendar system integration',
                impact: 'Fully manual scheduling process',
                recommendation: 'Critical to integrate AI with calendar systems'
            });
        }

        return painPoints;
    }

    extractCompliancePainPoints(answers) {
        const painPoints = [];

        // Low checklist usage
        if (answers.compliance_checklist_frequency === 'never' || answers.compliance_checklist_frequency === 'rarely') {
            painPoints.push({
                category: 'compliance_risk',
                severity: 'high',
                description: 'Infrequent use of compliance checklists',
                impact: 'High risk of regulatory violations',
                recommendation: 'AI can enforce compliance workflows automatically'
            });
        }

        // Time-consuming audits
        if (answers.compliance_audit_prep_hours && parseFloat(answers.compliance_audit_prep_hours) >= 5) {
            painPoints.push({
                category: 'time_intensive',
                severity: 'high',
                description: `${answers.compliance_audit_prep_hours}+ hours for audit prep`,
                impact: 'Taking time away from strategic HR work',
                recommendation: 'AI can maintain audit-ready documentation continuously'
            });
        }

        return painPoints;
    }

    extractContractsPainPoints(answers) {
        const painPoints = [];

        // Manual contract creation
        if (answers.contracts_creation_method === 'manual' || answers.contracts_creation_method === 'copy_paste') {
            painPoints.push({
                category: 'manual_work',
                severity: 'high',
                description: 'Manual contract creation or copy-paste approach',
                impact: 'High error risk and slow turnaround',
                recommendation: 'AI can generate contracts from templates with smart clauses'
            });
        }

        // High legal review burden
        if (answers.contracts_legal_redlines && parseInt(answers.contracts_legal_redlines) > 30) {
            painPoints.push({
                category: 'process_bottleneck',
                severity: 'medium',
                description: `${answers.contracts_legal_redlines}% of contracts need legal redlines`,
                impact: 'Delays in hiring and onboarding',
                recommendation: 'AI can suggest pre-approved clause alternatives'
            });
        }

        return painPoints;
    }

    /**
     * Analyze workflow patterns to identify inefficiencies
     */
    analyzeWorkflowPatterns(answers, businessUnit) {
        const patterns = {
            automationLevel: 'low', // low, medium, high
            toolStackMaturity: 'basic', // basic, intermediate, advanced
            processStandardization: 'low', // low, medium, high
            collaborationComplexity: 'medium', // low, medium, high
            dataFlowEfficiency: 'low' // low, medium, high
        };

        // Analyze based on business unit
        switch (businessUnit) {
            case 'sourcing':
                patterns.automationLevel = this.assessSourcingAutomation(answers);
                patterns.toolStackMaturity = this.assessSourcingTools(answers);
                break;
            case 'admin':
                patterns.automationLevel = answers.admin_manual_transfers?.startsWith('yes') ? 'low' : 'medium';
                patterns.dataFlowEfficiency = answers.admin_manual_transfers?.includes('daily') ? 'low' : 'medium';
                break;
            case 'scheduling':
                patterns.collaborationComplexity = parseInt(answers.scheduling_multi_panel || 0) > 50 ? 'high' : 'medium';
                patterns.automationLevel = answers.scheduling_calendar_systems?.includes('none') ? 'low' : 'medium';
                break;
        }

        return patterns;
    }

    assessSourcingAutomation(answers) {
        const booleanTime = parseFloat(answers.sourcing_boolean_time || 0);
        const marketMaps = answers.sourcing_market_maps_frequency;

        if (booleanTime >= 5 && marketMaps === 'never') return 'low';
        if (booleanTime >= 3 && marketMaps === 'rarely') return 'medium';
        return 'high';
    }

    assessSourcingTools(answers) {
        const tools = answers.sourcing_tools || [];
        if (tools.includes('linkedin_recruiter') && tools.includes('ats')) return 'intermediate';
        if (tools.length >= 3) return 'advanced';
        return 'basic';
    }

    /**
     * Identify gaps in tool stack
     */
    identifyToolGaps(answers, businessUnit) {
        const gaps = [];

        // Common gaps
        if (answers.aiexperience === 'none') {
            gaps.push({
                category: 'ai_tools',
                severity: 'critical',
                missing: 'AI assistants (ChatGPT, Gemini, Copilot)',
                impact: 'Missing 50-70% potential time savings',
                priority: 'immediate'
            });
        }

        // Business unit specific gaps
        switch (businessUnit) {
            case 'sourcing':
                if (!answers.sourcing_tools?.includes('ai_sourcing')) {
                    gaps.push({
                        category: 'ai_sourcing',
                        severity: 'high',
                        missing: 'AI-powered sourcing tools (HireEZ, SeekOut)',
                        impact: 'Manual candidate discovery taking 10x longer',
                        priority: 'high'
                    });
                }
                break;

            case 'scheduling':
                if (answers.scheduling_calendar_systems?.includes('none')) {
                    gaps.push({
                        category: 'calendar_integration',
                        severity: 'critical',
                        missing: 'Calendar system integration',
                        impact: 'Fully manual scheduling - huge time waste',
                        priority: 'immediate'
                    });
                }
                if (!answers.scheduling_tools?.includes('ai_scheduling')) {
                    gaps.push({
                        category: 'ai_scheduling',
                        severity: 'high',
                        missing: 'AI scheduling assistants (Calendly, Clara, x.ai)',
                        impact: 'Missing automated coordination capabilities',
                        priority: 'high'
                    });
                }
                break;

            case 'admin':
                if (answers.admin_manual_transfers?.startsWith('yes')) {
                    gaps.push({
                        category: 'integration',
                        severity: 'high',
                        missing: 'System integration/automation (Zapier, Make)',
                        impact: 'Manual data transfers causing errors',
                        priority: 'high'
                    });
                }
                break;
        }

        return gaps.sort((a, b) => {
            const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return severityOrder[b.severity] - severityOrder[a.severity];
        });
    }

    /**
     * Infer environmental context from answers
     */
    inferEnvironmentalContext(answers, businessUnit) {
        return {
            teamSize: this.inferTeamSize(answers, businessUnit),
            workload: this.inferWorkload(answers, businessUnit),
            urgency: this.inferUrgency(answers, businessUnit),
            budget: this.inferBudget(answers),
            supportLevel: this.inferSupportLevel(answers)
        };
    }

    inferTeamSize(answers, businessUnit) {
        if (businessUnit === 'sourcing') {
            const activeRoles = parseInt(answers.sourcing_active_roles || 0);
            if (activeRoles > 30) return 'large_team';
            if (activeRoles > 10) return 'medium_team';
            return 'small_team_or_solo';
        }

        if (businessUnit === 'scheduling') {
            const interviewsPerWeek = parseInt(answers.scheduling_interviews_per_week || 0);
            if (interviewsPerWeek > 50) return 'large_team';
            if (interviewsPerWeek > 20) return 'medium_team';
            return 'small_team_or_solo';
        }

        return 'unknown';
    }

    inferWorkload(answers, businessUnit) {
        // Look for high volume indicators
        if (businessUnit === 'sourcing' && parseInt(answers.sourcing_active_roles || 0) > 20) {
            return 'very_high';
        }
        if (businessUnit === 'scheduling' && parseInt(answers.scheduling_interviews_per_week || 0) > 30) {
            return 'very_high';
        }
        if (businessUnit === 'admin' && answers.admin_manual_transfers === 'yes_daily') {
            return 'high';
        }

        return 'moderate';
    }

    inferUrgency(answers, businessUnit) {
        // High urgency if multiple pain points with high severity
        const painPoints = this.extractPainPoints(answers, businessUnit);
        const highSeverityCount = painPoints.filter(p => p.severity === 'high').length;

        if (highSeverityCount >= 3) return 'critical';
        if (highSeverityCount >= 2) return 'high';
        if (highSeverityCount >= 1) return 'medium';
        return 'low';
    }

    inferBudget(answers) {
        // Infer budget constraints from tool availability
        const currentTools = Object.values(answers)
            .filter(val => Array.isArray(val))
            .flat();

        if (currentTools.includes('linkedin_recruiter') || currentTools.includes('greenhouse') || currentTools.includes('workday')) {
            return 'enterprise'; // Has enterprise tools
        }

        if (currentTools.length > 5) {
            return 'moderate'; // Multiple tools
        }

        return 'limited'; // Few tools, may have budget constraints
    }

    inferSupportLevel(answers) {
        // Infer organizational support from AI experience
        if (answers.aiexperience === 'power') return 'high_support';
        if (answers.aiexperience === 'using') return 'moderate_support';
        if (answers.aiexperience === 'explored') return 'low_support';
        return 'no_support'; // none
    }

    /**
     * Calculate urgency score (0-100)
     */
    calculateUrgencyScore(answers, businessUnit) {
        const painPoints = this.extractPainPoints(answers, businessUnit);
        const toolGaps = this.identifyToolGaps(answers, businessUnit);

        let score = 0;

        // Pain point severity contribution (max 50 points)
        painPoints.forEach(pp => {
            if (pp.severity === 'high') score += 15;
            if (pp.severity === 'medium') score += 8;
            if (pp.severity === 'low') score += 3;
        });

        // Tool gap severity contribution (max 30 points)
        toolGaps.forEach(gap => {
            if (gap.severity === 'critical') score += 15;
            if (gap.severity === 'high') score += 10;
            if (gap.severity === 'medium') score += 5;
        });

        // Time pressure indicators (max 20 points)
        if (businessUnit === 'sourcing' && parseInt(answers.sourcing_active_roles || 0) > 30) {
            score += 20;
        } else if (businessUnit === 'scheduling' && parseInt(answers.scheduling_interviews_per_week || 0) > 50) {
            score += 20;
        } else if (answers.admin_manual_transfers === 'yes_daily') {
            score += 15;
        }

        return Math.min(100, score);
    }

    /**
     * Assess readiness for AI adoption
     */
    assessReadiness(answers) {
        return {
            technicalReadiness: this.assessTechnicalReadiness(answers),
            culturalReadiness: this.assessCulturalReadiness(answers),
            resourceReadiness: this.assessResourceReadiness(answers),
            changeReadiness: this.assessChangeReadiness(answers)
        };
    }

    assessTechnicalReadiness(answers) {
        const tools = Object.values(answers).filter(val => Array.isArray(val)).flat();
        const hasModernTools = tools.some(tool =>
            tool.includes('slack') || tool.includes('teams') || tool.includes('notion')
        );

        return {
            level: hasModernTools ? 'high' : 'medium',
            score: hasModernTools ? 85 : 60,
            rationale: hasModernTools
                ? 'Already using modern collaboration tools'
                : 'May need onboarding to modern tool ecosystem'
        };
    }

    assessCulturalReadiness(answers) {
        const aiExperience = answers.aiexperience;
        const scoreMap = {
            'power': { level: 'high', score: 95, rationale: 'Power user - ready to implement advanced AI' },
            'using': { level: 'high', score: 80, rationale: 'Active AI user - comfortable with AI tools' },
            'explored': { level: 'medium', score: 60, rationale: 'Familiar with AI - needs confidence building' },
            'none': { level: 'low', score: 30, rationale: 'New to AI - requires training and support' }
        };

        return scoreMap[aiExperience] || scoreMap['none'];
    }

    assessResourceReadiness(answers) {
        const budget = this.inferBudget(answers);
        const scoreMap = {
            'enterprise': { level: 'high', score: 90, rationale: 'Enterprise budget available' },
            'moderate': { level: 'medium', score: 65, rationale: 'Moderate budget - focus on ROI' },
            'limited': { level: 'low', score: 40, rationale: 'Limited budget - start with free tools' }
        };

        return scoreMap[budget] || scoreMap['limited'];
    }

    assessChangeReadiness(answers) {
        // Infer change readiness from urgency and current inefficiencies
        const urgency = this.calculateUrgencyScore(answers, answers.businessUnit);

        if (urgency >= 70) {
            return {
                level: 'high',
                score: 85,
                rationale: 'High pain points create strong motivation for change'
            };
        } else if (urgency >= 40) {
            return {
                level: 'medium',
                score: 60,
                rationale: 'Moderate pain - will adopt if implementation is easy'
            };
        } else {
            return {
                level: 'low',
                score: 35,
                rationale: 'Low urgency - needs compelling business case'
            };
        }
    }
}

/**
 * Behavioral Tracker
 * Tracks user behavior during assessment to infer engagement and hesitation
 */
class BehaviorTracker {
    constructor() {
        this.questionStartTimes = {};
        this.answerChanges = {};
        this.totalTime = 0;
        this.questionCount = 0;
    }

    startQuestion(questionId) {
        this.questionStartTimes[questionId] = Date.now();
    }

    endQuestion(questionId, answer) {
        if (this.questionStartTimes[questionId]) {
            const timeSpent = Date.now() - this.questionStartTimes[questionId];
            this.totalTime += timeSpent;
            this.questionCount++;

            // Track if answer was changed
            if (!this.answerChanges[questionId]) {
                this.answerChanges[questionId] = { count: 0, finalAnswer: answer };
            }
        }
    }

    trackAnswerChange(questionId, newAnswer) {
        if (!this.answerChanges[questionId]) {
            this.answerChanges[questionId] = { count: 0, finalAnswer: newAnswer };
        }
        this.answerChanges[questionId].count++;
        this.answerChanges[questionId].finalAnswer = newAnswer;
    }

    getSignals() {
        const avgTimePerQuestion = this.questionCount > 0 ? this.totalTime / this.questionCount : 0;
        const revisionRate = Object.keys(this.answerChanges).length / Math.max(1, this.questionCount);

        return {
            averageQuestionTime: Math.round(avgTimePerQuestion / 1000), // seconds
            totalAssessmentTime: Math.round(this.totalTime / 1000 / 60), // minutes
            revisionRate: Math.round(revisionRate * 100), // percentage
            revisionCount: Object.keys(this.answerChanges).length,
            engagementLevel: this.assessEngagement(avgTimePerQuestion, revisionRate)
        };
    }

    assessEngagement(avgTime, revisionRate) {
        // Very quick + no revisions = rushing
        if (avgTime < 5000 && revisionRate < 0.1) return 'rushing';

        // Long time + many revisions = thoughtful
        if (avgTime > 15000 && revisionRate > 0.2) return 'very_thoughtful';

        // Moderate time = engaged
        if (avgTime >= 5000 && avgTime <= 15000) return 'engaged';

        return 'normal';
    }
}
