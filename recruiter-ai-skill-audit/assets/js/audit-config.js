/**
 * Configuration for Enhanced AI Skills Audit
 * Manages feature flags, API settings, and customization options
 */

const AuditConfig = {
    // Feature flags
    features: {
        geminiEnhancement: true,
        personalizedPrompts: true,
        riskAssessment: true,
        adaptiveRoadmap: true,
        benchmarking: true,
        progressTracking: true,
        teamSharing: true,
        enhancedPDF: true
    },

    // API configuration
    api: {
        geminiEndpoint: '/api/generate-gem.js',
        retryAttempts: 3,
        retryDelay: 1000,
        timeout: 30000,
        cacheEnabled: true,
        cacheDuration: 3600000 // 1 hour
    },

    // UI configuration
    ui: {
        showLoadingProgress: true,
        animationDuration: 300,
        notificationDuration: 3000,
        autoSaveInterval: 30000, // 30 seconds
        maxPromptLibraryItems: 10
    },

    // Business unit specific settings
    businessUnits: {
        sourcing: {
            priorityMetrics: ['reply_rate', 'qualified_submit', 'boolean_usage'],
            quickWinThreshold: 2, // hours per week
            complexityFactors: ['role_seniority', 'active_roles'],
            benchmarkTargets: {
                replyRate: { good: 25, excellent: 35 },
                qualifiedSubmit: { good: 40, excellent: 60 }
            }
        },
        admin: {
            priorityMetrics: ['template_usage', 'manual_transfers', 'error_sources'],
            quickWinThreshold: 3,
            complexityFactors: ['tools_in_use', 'cleanup_frequency'],
            benchmarkTargets: {
                templateUsage: { good: 75, excellent: 90 },
                automation: { good: 60, excellent: 85 }
            }
        },
        scheduling: {
            priorityMetrics: ['availability_collection', 'auto_communications', 'time_to_schedule'],
            quickWinThreshold: 4,
            complexityFactors: ['interviews_per_week', 'multi_panel_timezone'],
            benchmarkTargets: {
                timeToSchedule: { good: '24-48', excellent: '0-4' },
                noshowRate: { good: 10, excellent: 5 }
            }
        },
        compliance: {
            priorityMetrics: ['standardized_checklists', 'sla_adherence', 'audit_trail_storage'],
            quickWinThreshold: 2,
            complexityFactors: ['exceptions_per_month', 'policy_digest_frequency'],
            benchmarkTargets: {
                slaAdherence: { good: 90, excellent: 98 },
                evidenceCompleteness: { good: 80, excellent: 95 }
            }
        },
        contracts: {
            priorityMetrics: ['returned_corrections', 'turnaround_time', 'clause_library'],
            quickWinThreshold: 3,
            complexityFactors: ['contracts_per_month', 'template_variants'],
            benchmarkTargets: {
                returnedCorrections: { good: 5, excellent: 2 },
                turnaroundTime: { good: '3-5days', excellent: '1-2days' }
            }
        }
    },

    // Prompt templates for different scenarios
    promptTemplates: {
        insights: {
            conservative: 'Provide practical, low-risk AI recommendations',
            aggressive: 'Suggest cutting-edge AI solutions with high impact',
            balanced: 'Balance innovation with practical implementation'
        },
        riskAssessment: {
            detailed: 'Comprehensive risk analysis with mitigation strategies',
            summary: 'High-level risk overview with key factors',
            actionable: 'Focus on specific actions to reduce risk'
        },
        roadmap: {
            beginner: 'Step-by-step guidance with detailed explanations',
            intermediate: 'Structured plan with moderate complexity',
            advanced: 'Flexible framework for experienced users'
        }
    },

    // Success metrics and KPIs
    successMetrics: {
        adoption: {
            week1: 'Tool setup and first use',
            week2: 'Daily integration achieved',
            week3: 'Workflow optimization complete',
            week4: 'Measurable time savings documented'
        },
        timeSavings: {
            minimum: 2, // hours per week
            target: 8,
            stretch: 15
        },
        qualityImprovement: {
            metrics: ['accuracy', 'consistency', 'speed', 'satisfaction'],
            measurementMethods: ['self-assessment', 'peer-review', 'manager-feedback']
        }
    },

    // Industry benchmarks (updated regularly)
    industryBenchmarks: {
        sourcing: {
            averageTimeSavings: 12.5,
            topPerformerSavings: 22.0,
            adoptionRate: 0.68,
            commonTools: ['LinkedIn Recruiter AI', 'ChatGPT', 'Boolean generators']
        },
        admin: {
            averageTimeSavings: 8.3,
            topPerformerSavings: 16.5,
            adoptionRate: 0.45,
            commonTools: ['Microsoft Copilot', 'ChatGPT', 'Automation tools']
        },
        scheduling: {
            averageTimeSavings: 6.7,
            topPerformerSavings: 14.2,
            adoptionRate: 0.52,
            commonTools: ['Calendly', 'Microsoft Bookings', 'AI assistants']
        },
        compliance: {
            averageTimeSavings: 5.4,
            topPerformerSavings: 11.8,
            adoptionRate: 0.38,
            commonTools: ['Compliance AI', 'Document automation', 'Workflow tools']
        },
        contracts: {
            averageTimeSavings: 9.1,
            topPerformerSavings: 18.6,
            adoptionRate: 0.41,
            commonTools: ['Contract AI', 'Legal tech', 'Template automation']
        }
    },

    // Personalization settings
    personalization: {
        learningStyles: {
            visual: 'Prefer diagrams, charts, and visual guides',
            auditory: 'Learn best through explanations and discussions',
            kinesthetic: 'Hands-on practice and experimentation',
            reading: 'Detailed written instructions and documentation'
        },
        timeCommitments: {
            minimal: '1-2 hours per week',
            moderate: '3-5 hours per week',
            intensive: '6+ hours per week'
        },
        riskTolerance: {
            conservative: 'Prefer proven, low-risk solutions',
            moderate: 'Balance innovation with stability',
            aggressive: 'Willing to try cutting-edge solutions'
        }
    },

    // Error handling and fallbacks
    fallbacks: {
        geminiUnavailable: {
            useStaticInsights: true,
            showFallbackMessage: true,
            retryAfterMinutes: 5
        },
        networkIssues: {
            enableOfflineMode: true,
            cacheResults: true,
            showRetryOptions: true
        },
        dataCorruption: {
            validateInputs: true,
            sanitizeOutputs: true,
            logErrors: true
        }
    },

    // Analytics and tracking
    analytics: {
        trackUserJourney: true,
        measureEngagement: true,
        collectFeedback: true,
        anonymizeData: true,
        events: {
            auditStarted: 'audit_started',
            questionAnswered: 'question_answered',
            resultsGenerated: 'results_generated',
            enhancementCompleted: 'enhancement_completed',
            actionTaken: 'action_taken',
            progressSaved: 'progress_saved'
        }
    },

    // Accessibility and internationalization
    accessibility: {
        highContrast: false,
        largeText: false,
        screenReaderOptimized: true,
        keyboardNavigation: true
    },

    internationalization: {
        defaultLanguage: 'en',
        supportedLanguages: ['en', 'es', 'fr', 'de'],
        dateFormat: 'MM/DD/YYYY',
        numberFormat: 'en-US'
    }
};

// Utility functions for configuration management
const ConfigManager = {
    /**
     * Get configuration value with fallback
     */
    get(path, fallback = null) {
        const keys = path.split('.');
        let value = AuditConfig;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return fallback;
            }
        }
        
        return value;
    },

    /**
     * Check if feature is enabled
     */
    isFeatureEnabled(featureName) {
        return this.get(`features.${featureName}`, false);
    },

    /**
     * Get business unit specific configuration
     */
    getBusinessUnitConfig(businessUnit, configType) {
        return this.get(`businessUnits.${businessUnit}.${configType}`, {});
    },

    /**
     * Get benchmark data for business unit
     */
    getBenchmarks(businessUnit) {
        return this.get(`industryBenchmarks.${businessUnit}`, {});
    },

    /**
     * Update configuration at runtime
     */
    set(path, value) {
        const keys = path.split('.');
        let obj = AuditConfig;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in obj) || typeof obj[key] !== 'object') {
                obj[key] = {};
            }
            obj = obj[key];
        }
        
        obj[keys[keys.length - 1]] = value;
    },

    /**
     * Load user preferences from localStorage
     */
    loadUserPreferences() {
        try {
            const prefs = localStorage.getItem('audit_user_preferences');
            if (prefs) {
                const userPrefs = JSON.parse(prefs);
                // Merge user preferences with default config
                Object.keys(userPrefs).forEach(key => {
                    if (key in AuditConfig) {
                        AuditConfig[key] = { ...AuditConfig[key], ...userPrefs[key] };
                    }
                });
            }
        } catch (error) {
            console.warn('Failed to load user preferences:', error);
        }
    },

    /**
     * Save user preferences to localStorage
     */
    saveUserPreferences(preferences) {
        try {
            localStorage.setItem('audit_user_preferences', JSON.stringify(preferences));
        } catch (error) {
            console.warn('Failed to save user preferences:', error);
        }
    }
};

// Initialize configuration
ConfigManager.loadUserPreferences();

// Export for global use
window.AuditConfig = AuditConfig;
window.ConfigManager = ConfigManager;