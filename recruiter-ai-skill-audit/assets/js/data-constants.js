/**
 * Data Constants
 * Centralized configuration constants for the AI Skills Assessment
 * Single source of truth for business units, priorities, etc.
 */

const DataConstants = {
    /**
     * Schema version for data structure
     */
    SCHEMA_VERSION: '2.0.0',

    /**
     * Business units
     */
    BUSINESS_UNITS: [
        {
            id: 'sourcing',
            label: '🔍 Talent Sourcing',
            description: 'Finding and identifying potential candidates',
            color: '#4F46E5' // indigo
        },
        {
            id: 'admin',
            label: '📋 Administrative Support',
            description: 'Data entry, documentation, and process support',
            color: '#7C3AED' // purple
        },
        {
            id: 'scheduling',
            label: '📅 Interview Scheduling',
            description: 'Coordinating interviews and calendar management',
            color: '#EC4899' // pink
        },
        {
            id: 'compliance',
            label: '⚖️ Compliance & Legal',
            description: 'Ensuring regulatory compliance and legal requirements',
            color: '#10B981' // green
        },
        {
            id: 'contracts',
            label: '📄 Contract Creation',
            description: 'Drafting and managing employment contracts',
            color: '#F59E0B' // amber
        }
    ],

    /**
     * Priority levels
     */
    PRIORITIES: [
        { id: 'critical', label: 'Critical', emoji: '🔴', color: '#EF4444', weight: 4 },
        { id: 'high', label: 'High', emoji: '🟠', color: '#F97316', weight: 3 },
        { id: 'medium', label: 'Medium', emoji: '🟡', color: '#EAB308', weight: 2 },
        { id: 'low', label: 'Low', emoji: '🟢', color: '#10B981', weight: 1 }
    ],

    /**
     * Difficulty levels (1-10 scale)
     */
    DIFFICULTY_LEVELS: {
        MIN: 1,
        MAX: 10,
        EASY: { min: 1, max: 3, label: 'Easy' },
        MODERATE: { min: 4, max: 6, label: 'Moderate' },
        HARD: { min: 7, max: 8, label: 'Hard' },
        EXPERT: { min: 9, max: 10, label: 'Expert' }
    },

    /**
     * Experience levels
     */
    EXPERIENCE_LEVELS: [
        { id: 'beginner', label: 'Beginner', multiplier: 0.7, minHours: 5, maxHours: 15 },
        { id: 'intermediate', label: 'Intermediate', multiplier: 1.0, minHours: 15, maxHours: 30 },
        { id: 'advanced', label: 'Advanced', multiplier: 1.2, minHours: 30, maxHours: 50 },
        { id: 'expert', label: 'Expert', multiplier: 1.5, minHours: 40, maxHours: 70 }
    ],

    /**
     * Time periods
     */
    TIME_PERIODS: {
        HOURS_PER_WEEK: 40,
        WEEKS_PER_MONTH: 4.33,
        WEEKS_PER_YEAR: 52,
        WORKING_DAYS_PER_WEEK: 5,
        MAX_HOURS_PER_WEEK: 168
    },

    /**
     * AI Savings ranges
     */
    AI_SAVINGS: {
        MIN: 0,
        MAX: 100,
        LOW: { min: 0, max: 30, label: 'Low automation potential' },
        MEDIUM: { min: 31, max: 60, label: 'Medium automation potential' },
        HIGH: { min: 61, max: 80, label: 'High automation potential' },
        VERY_HIGH: { min: 81, max: 100, label: 'Very high automation potential' }
    },

    /**
     * Question types
     */
    QUESTION_TYPES: [
        { id: 'single', label: 'Single Choice', icon: '◉' },
        { id: 'checkbox', label: 'Multiple Choice', icon: '☑' },
        { id: 'multi', label: 'Multi-Select', icon: '☑️' }
    ],

    /**
     * Validation rules
     */
    VALIDATION: {
        QUESTION_ID_PATTERN: /^[a-z_]+$/,
        QUESTION_TEXT_MIN_LENGTH: 10,
        QUESTION_TEXT_MAX_LENGTH: 500,
        OPTIONS_MIN: 2,
        OPTIONS_MAX: 10,
        OPTION_TEXT_MIN_LENGTH: 1,
        OPTION_TEXT_MAX_LENGTH: 200
    },

    /**
     * Multi-dimensional scoring metrics
     */
    SCORING_DIMENSIONS: {
        TIME_SAVED: {
            id: 'time_saved',
            label: 'Time Saved',
            icon: '⏱️',
            unit: 'hours/week',
            weight: 0.40, // 40% of total score
            color: '#4F46E5'
        },
        COST_SAVED: {
            id: 'cost_saved',
            label: 'Cost Saved',
            icon: '💰',
            unit: '$/year',
            weight: 0.25, // 25% of total score
            color: '#10B981'
        },
        QUALITY_IMPROVEMENT: {
            id: 'quality_improvement',
            label: 'Quality Improvement',
            icon: '📈',
            unit: '% increase',
            weight: 0.20, // 20% of total score
            color: '#7C3AED'
        },
        SATISFACTION_IMPACT: {
            id: 'satisfaction_impact',
            label: 'Satisfaction Impact',
            icon: '😊',
            unit: '% increase',
            weight: 0.10, // 10% of total score
            color: '#EC4899'
        },
        RISK_REDUCTION: {
            id: 'risk_reduction',
            label: 'Risk Reduction',
            icon: '🛡️',
            unit: 'risk level',
            weight: 0.05, // 5% of total score
            color: '#F59E0B'
        }
    },

    /**
     * Cost calculation defaults
     */
    COST_DEFAULTS: {
        HOURLY_RATE_USD: 45, // Average fully-loaded cost per hour
        CURRENCY: 'USD',
        CURRENCY_SYMBOL: '$'
    },

    /**
     * Quality metrics
     */
    QUALITY_METRICS: {
        ACCURACY: { label: 'Accuracy', max: 100 },
        CONSISTENCY: { label: 'Consistency', max: 100 },
        BIAS_REDUCTION: { label: 'Bias Reduction', max: 100 },
        ERROR_RATE: { label: 'Error Rate Reduction', max: 100 }
    },

    /**
     * Risk levels
     */
    RISK_LEVELS: {
        CRITICAL: { id: 'critical', label: 'Critical Risk', value: 5, color: '#EF4444' },
        HIGH: { id: 'high', label: 'High Risk', value: 4, color: '#F97316' },
        MEDIUM: { id: 'medium', label: 'Medium Risk', value: 3, color: '#EAB308' },
        LOW: { id: 'low', label: 'Low Risk', value: 2, color: '#10B981' },
        MINIMAL: { id: 'minimal', label: 'Minimal Risk', value: 1, color: '#6366F1' }
    },

    /**
     * Recommended AI Tools by category
     */
    AI_TOOLS: {
        GENERAL: ['Google Gemini', 'Microsoft Copilot', 'ChatGPT'],
        SOURCING: ['LinkedIn Recruiter', 'SeekOut', 'HireEZ', 'Gem'],
        ADMIN: ['Grammarly', 'Notion AI', 'Airtable'],
        SCHEDULING: ['Calendly', 'x.ai', 'Clara'],
        COMPLIANCE: ['Drata', 'Vanta', 'Scrut'],
        CONTRACTS: ['DocuSign', 'PandaDoc', 'Ironclad']
    },

    /**
     * Data version changelog
     */
    CHANGELOG: [
        {
            version: '2.0.0',
            date: '2025-12-30',
            changes: [
                'Added multi-dimensional scoring',
                'Normalized data structure',
                'Added versioning system',
                'Separated metadata from questions'
            ],
            breaking: true
        },
        {
            version: '1.0.0',
            date: '2024-12-01',
            changes: [
                'Initial release',
                'Basic question structure',
                'Time savings calculations'
            ],
            breaking: false
        }
    ],

    /**
     * Helper functions
     */
    helpers: {
        /**
         * Get business unit by ID
         */
        getBusinessUnit(id) {
            return DataConstants.BUSINESS_UNITS.find(bu => bu.id === id);
        },

        /**
         * Get priority by ID
         */
        getPriority(id) {
            return DataConstants.PRIORITIES.find(p => p.id === id);
        },

        /**
         * Get experience level by ID
         */
        getExperienceLevel(id) {
            return DataConstants.EXPERIENCE_LEVELS.find(e => e.id === id);
        },

        /**
         * Get question type by ID
         */
        getQuestionType(id) {
            return DataConstants.QUESTION_TYPES.find(qt => qt.id === id);
        },

        /**
         * Get difficulty level label
         */
        getDifficultyLabel(value) {
            if (value <= 3) return DataConstants.DIFFICULTY_LEVELS.EASY.label;
            if (value <= 6) return DataConstants.DIFFICULTY_LEVELS.MODERATE.label;
            if (value <= 8) return DataConstants.DIFFICULTY_LEVELS.HARD.label;
            return DataConstants.DIFFICULTY_LEVELS.EXPERT.label;
        },

        /**
         * Get AI savings label
         */
        getAISavingsLabel(percentage) {
            if (percentage <= 30) return DataConstants.AI_SAVINGS.LOW.label;
            if (percentage <= 60) return DataConstants.AI_SAVINGS.MEDIUM.label;
            if (percentage <= 80) return DataConstants.AI_SAVINGS.HIGH.label;
            return DataConstants.AI_SAVINGS.VERY_HIGH.label;
        },

        /**
         * Validate question ID format
         */
        isValidQuestionId(id) {
            return DataConstants.VALIDATION.QUESTION_ID_PATTERN.test(id);
        },

        /**
         * Calculate cost from hours
         */
        calculateCost(hours, period = 'yearly') {
            const hourlyRate = DataConstants.COST_DEFAULTS.HOURLY_RATE_USD;
            const multiplier = period === 'yearly' ? DataConstants.TIME_PERIODS.WEEKS_PER_YEAR :
                              period === 'monthly' ? DataConstants.TIME_PERIODS.WEEKS_PER_MONTH : 1;
            return hours * multiplier * hourlyRate;
        },

        /**
         * Format currency
         */
        formatCurrency(amount) {
            return `${DataConstants.COST_DEFAULTS.CURRENCY_SYMBOL}${amount.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            })}`;
        },

        /**
         * Get scoring dimension by ID
         */
        getScoringDimension(id) {
            return Object.values(DataConstants.SCORING_DIMENSIONS).find(d => d.id === id);
        }
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.DataConstants = DataConstants;
}

// Also export as module if supported
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataConstants;
}
