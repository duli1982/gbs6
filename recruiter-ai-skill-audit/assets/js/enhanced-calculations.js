/**
 * Enhanced Calculation Engine for AI Skills Audit
 * Implements sophisticated algorithms with context multipliers,
 * adoption readiness scoring, and confidence intervals
 */

class EnhancedCalculationEngine {
    constructor() {
        this.contextWeights = {
            complexity: 1.0,
            automation: 1.0,
            volume: 1.0,
            experience: 1.0
        };
    }

    /**
     * Enhanced savings calculation with context multipliers
     * Formula: savings = hours × (savingsPct / 100) × contextMultiplier × adoptionReadiness
     *
     * @param {number} hours - Time currently spent
     * @param {number} savingsPct - AI savings percentage (0-100)
     * @param {object} context - User context data
     * @returns {object} Enhanced savings with confidence intervals
     */
    calculateEnhancedSavings(hours, savingsPct, context = {}) {
        // Base calculation
        const baseSavings = hours * (savingsPct / 100);

        // Calculate multipliers
        const contextMultiplier = this.calculateContextMultiplier(context);
        const adoptionReadiness = this.calculateAdoptionReadiness(context);

        // Enhanced savings
        const enhancedSavings = baseSavings * contextMultiplier * adoptionReadiness;

        // Confidence interval
        const confidenceInterval = this.calculateConfidenceInterval(
            enhancedSavings,
            context,
            adoptionReadiness
        );

        return {
            baseSavings: Math.round(baseSavings * 10) / 10,
            enhancedSavings: Math.round(enhancedSavings * 10) / 10,
            contextMultiplier: Math.round(contextMultiplier * 100) / 100,
            adoptionReadiness: Math.round(adoptionReadiness * 100) / 100,
            confidenceInterval: {
                low: Math.round(confidenceInterval.low * 10) / 10,
                high: Math.round(confidenceInterval.high * 10) / 10,
                confidence: confidenceInterval.confidence
            },
            factors: {
                complexity: context.complexityFactor || 1.0,
                automation: context.automationFactor || 1.0,
                volume: context.volumeFactor || 1.0,
                experience: context.experienceFactor || 1.0
            }
        };
    }

    /**
     * Calculate context multiplier based on work characteristics
     * Higher complexity, lower automation, higher volume = higher multiplier
     */
    calculateContextMultiplier(context) {
        const {
            complexityFactor = 1.0,    // 0.7 (simple) to 1.3 (complex)
            automationFactor = 1.0,    // 1.3 (manual) to 0.7 (automated)
            volumeFactor = 1.0         // 0.8 (low volume) to 1.2 (high volume)
        } = context;

        // Weighted average of factors
        const multiplier = (
            complexityFactor * 0.4 +
            automationFactor * 0.35 +
            volumeFactor * 0.25
        );

        // Constrain to reasonable range (0.7 to 1.4)
        return Math.max(0.7, Math.min(1.4, multiplier));
    }

    /**
     * Calculate adoption readiness score
     * Based on AI experience, tool availability, and time constraints
     */
    calculateAdoptionReadiness(context) {
        const {
            aiExperience = 'none',           // none, explored, using, power
            toolAccess = 'full',             // limited, partial, full
            timeAvailability = 'moderate'    // minimal, moderate, ample
        } = context;

        // AI Experience factor (0.6 to 1.0)
        const experienceScores = {
            'none': 0.6,
            'explored': 0.75,
            'using': 0.9,
            'power': 1.0
        };

        // Tool access factor (0.7 to 1.0)
        const toolScores = {
            'limited': 0.7,
            'partial': 0.85,
            'full': 1.0
        };

        // Time availability factor (0.5 to 1.0)
        const timeScores = {
            'minimal': 0.5,
            'moderate': 0.75,
            'ample': 1.0
        };

        const experienceFactor = experienceScores[aiExperience] || 0.6;
        const toolFactor = toolScores[toolAccess] || 1.0;
        const timeFactor = timeScores[timeAvailability] || 0.75;

        // Weighted combination
        const readiness = (
            experienceFactor * 0.5 +
            toolFactor * 0.3 +
            timeFactor * 0.2
        );

        return Math.max(0.5, Math.min(1.0, readiness));
    }

    /**
     * Calculate confidence interval for savings prediction
     * Returns low/high range based on uncertainty factors
     */
    calculateConfidenceInterval(savings, context, adoptionReadiness) {
        // Base uncertainty from adoption readiness
        // Lower readiness = higher uncertainty
        const baseUncertainty = (1 - adoptionReadiness) * 0.3; // 0% to 30%

        // Additional uncertainty from context complexity
        const complexityUncertainty = context.complexityFactor
            ? Math.abs(context.complexityFactor - 1) * 0.1
            : 0.05;

        // Total uncertainty (10% to 40%)
        const totalUncertainty = Math.min(0.4, Math.max(0.1,
            baseUncertainty + complexityUncertainty
        ));

        // Calculate interval (using normal distribution approximation)
        // For 75% confidence, use ~1.15 standard deviations
        // For 90% confidence, use ~1.65 standard deviations
        const confidenceLevel = 0.75; // 75% confidence
        const zScore = 1.15;

        const margin = savings * totalUncertainty * zScore;

        return {
            low: Math.max(0, savings - margin),
            high: savings + margin,
            confidence: confidenceLevel * 100
        };
    }

    /**
     * Infer context from user answers
     * Analyzes patterns in answers to determine complexity, automation level, volume
     */
    inferContextFromAnswers(answers, businessUnit) {
        const context = {
            complexityFactor: 1.0,
            automationFactor: 1.0,
            volumeFactor: 1.0,
            aiExperience: answers.aiexperience || 'none',
            toolAccess: 'full',
            timeAvailability: 'moderate'
        };

        // Infer complexity based on business unit specific questions
        if (businessUnit === 'sourcing') {
            context.complexityFactor = this.inferSourcingComplexity(answers);
            context.volumeFactor = this.inferSourcingVolume(answers);
        } else if (businessUnit === 'admin') {
            context.complexityFactor = this.inferAdminComplexity(answers);
            context.automationFactor = this.inferAdminAutomation(answers);
        } else if (businessUnit === 'scheduling') {
            context.complexityFactor = this.inferSchedulingComplexity(answers);
            context.volumeFactor = this.inferSchedulingVolume(answers);
        } else if (businessUnit === 'compliance') {
            context.complexityFactor = this.inferComplianceComplexity(answers);
        } else if (businessUnit === 'contracts') {
            context.complexityFactor = this.inferContractsComplexity(answers);
        }

        // Infer tool access from tools in use
        context.toolAccess = this.inferToolAccess(answers);

        // Infer time availability from workload indicators
        context.timeAvailability = this.inferTimeAvailability(answers, businessUnit);

        return context;
    }

    // === SOURCING CONTEXT INFERENCE ===

    inferSourcingComplexity(answers) {
        // Check role seniority (higher seniority = higher complexity)
        const seniority = answers.sourcing_role_seniority;
        const complexityMap = {
            'high-volume': 0.8,    // Lower complexity
            'specialist': 1.0,     // Average
            'niche': 1.2,          // Higher complexity
            'executive': 1.3       // Highest complexity
        };
        return complexityMap[seniority] || 1.0;
    }

    inferSourcingVolume(answers) {
        // Check active roles per week
        const activeRoles = answers.sourcing_active_roles;
        const volumeMap = {
            '1-5': 0.8,
            '6-10': 1.0,
            '11-20': 1.1,
            '20+': 1.2
        };
        return volumeMap[activeRoles] || 1.0;
    }

    // === ADMIN CONTEXT INFERENCE ===

    inferAdminComplexity(answers) {
        // Check template usage (less templates = more complexity)
        const templateUsage = answers.admin_template_usage;
        const complexityMap = {
            '0-25': 1.3,      // Very manual = complex
            '26-50': 1.1,
            '51-75': 0.9,
            '76-100': 0.8     // Highly templated = less complex
        };
        return complexityMap[templateUsage] || 1.0;
    }

    inferAdminAutomation(answers) {
        // Check manual transfers (more manual = higher automation opportunity)
        const transfers = answers.admin_manual_transfers;
        const automationMap = {
            'yes_daily': 1.3,     // High manual work
            'yes_weekly': 1.2,
            'yes_monthly': 1.1,
            'no': 0.7             // Already automated
        };
        return automationMap[transfers] || 1.0;
    }

    // === SCHEDULING CONTEXT INFERENCE ===

    inferSchedulingComplexity(answers) {
        // Already has complexity multiplier from multi-panel question
        // But we can enhance it with other factors
        const multiPanel = answers.scheduling_multi_panel_timezone;
        const complexityMap = {
            '<25': 0.9,
            '25-50': 1.0,
            '51-75': 1.1,
            '>75': 1.2
        };
        return complexityMap[multiPanel] || 1.0;
    }

    inferSchedulingVolume(answers) {
        // Check interviews per week
        const interviews = answers.scheduling_interviews_per_week;
        const volumeMap = {
            '1-10': 0.8,
            '11-25': 1.0,
            '26-50': 1.1,
            '50+': 1.2
        };
        return volumeMap[interviews] || 1.0;
    }

    // === COMPLIANCE CONTEXT INFERENCE ===

    inferComplianceComplexity(answers) {
        // Check standardized checklists
        const checklists = answers.compliance_standardized_checklists;
        return checklists === 'no' ? 1.3 : 0.9;
    }

    // === CONTRACTS CONTEXT INFERENCE ===

    inferContractsComplexity(answers) {
        // Check legal redlines percentage
        const redlines = answers.contracts_legal_redlines;
        const complexityMap = {
            '<10': 0.8,
            '10-25': 1.0,
            '26-50': 1.2,
            '>50': 1.3
        };
        return complexityMap[redlines] || 1.0;
    }

    // === GENERAL INFERENCE HELPERS ===

    inferToolAccess(answers) {
        // Count how many modern tools they have access to
        const tools = answers.admin_tools_in_use || [];
        const modernTools = ['google_workspace', 'microsoft_365', 'powerbi'];

        if (Array.isArray(tools)) {
            const hasModernTools = tools.filter(t => modernTools.includes(t)).length;
            if (hasModernTools >= 2) return 'full';
            if (hasModernTools >= 1) return 'partial';
        }

        return 'limited';
    }

    inferTimeAvailability(answers, businessUnit) {
        // Infer from volume/workload indicators
        let workloadIndicator = 0;

        if (businessUnit === 'sourcing') {
            const roles = answers.sourcing_active_roles;
            workloadIndicator = roles === '20+' ? 2 : roles === '11-20' ? 1 : 0;
        } else if (businessUnit === 'scheduling') {
            const interviews = answers.scheduling_interviews_per_week;
            workloadIndicator = interviews === '50+' ? 2 : interviews === '26-50' ? 1 : 0;
        }

        // High workload = minimal time; low workload = ample time
        if (workloadIndicator >= 2) return 'minimal';
        if (workloadIndicator >= 1) return 'moderate';
        return 'ample';
    }

    /**
     * Format savings display with confidence interval
     */
    formatSavingsWithConfidence(enhancedResult) {
        const { enhancedSavings, confidenceInterval } = enhancedResult;

        return {
            primary: `${enhancedSavings} hrs/week`,
            range: `${confidenceInterval.low} - ${confidenceInterval.high} hrs/week`,
            confidence: `${confidenceInterval.confidence}% confidence`,
            display: `${enhancedSavings} hrs/week (${confidenceInterval.low}-${confidenceInterval.high} with ${confidenceInterval.confidence}% confidence)`
        };
    }

    /**
     * Generate explanation of calculation factors
     */
    generateExplanation(enhancedResult) {
        const { factors, contextMultiplier, adoptionReadiness } = enhancedResult;

        const explanations = [];

        // Context multiplier explanations
        if (contextMultiplier > 1.1) {
            if (factors.complexity > 1.1) {
                explanations.push('✨ Your work is complex - higher AI savings potential');
            }
            if (factors.automation > 1.1) {
                explanations.push('⚡ High manual work detected - great automation opportunity');
            }
            if (factors.volume > 1.1) {
                explanations.push('📈 High volume work - AI scales extremely well');
            }
        } else if (contextMultiplier < 0.9) {
            explanations.push('ℹ️ Some automation already in place - AI will enhance existing efficiency');
        }

        // Adoption readiness explanations
        if (adoptionReadiness < 0.7) {
            explanations.push('📚 New to AI - estimates are conservative. Actual savings may grow as you gain experience');
        } else if (adoptionReadiness > 0.9) {
            explanations.push('🚀 High AI readiness - you\'re positioned for rapid implementation');
        }

        return explanations;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedCalculationEngine;
}
