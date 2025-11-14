/**
 * Gemini AI Enhancement Layer for Skills Audit
 * Provides dynamic insights, personalized recommendations, and intelligent analysis
 */

class GeminiAuditEnhancer {
    constructor() {
        this.apiEndpoint = '/api/gemini-audit.js';
        this.cache = new Map();
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    /**
     * Generate comprehensive AI-powered insights for audit results
     */
    async generatePersonalizedInsights(auditResults, userAnswers) {
        const cacheKey = this.generateCacheKey(auditResults, userAnswers);
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const insights = await this.callGeminiWithRetry({
                prompt: this.buildInsightsPrompt(auditResults, userAnswers),
                temperature: 0.7,
                maxTokens: 2000
            });

            const parsedInsights = this.parseInsightsResponse(insights);
            this.cache.set(cacheKey, parsedInsights);
            
            return parsedInsights;
        } catch (error) {
            console.error('Failed to generate personalized insights:', error);
            return this.getFallbackInsights(auditResults);
        }
    }

    /**
     * Generate personalized AI prompt library based on user's role and pain points
     */
    async generatePersonalizedPrompts(businessUnit, painPoints, currentTools, timeConstraints) {
        try {
            const promptLibrary = await this.callGeminiWithRetry({
                prompt: this.buildPromptLibraryPrompt(businessUnit, painPoints, currentTools, timeConstraints),
                temperature: 0.8,
                maxTokens: 1500
            });

            return this.parsePromptLibraryResponse(promptLibrary);
        } catch (error) {
            console.error('Failed to generate prompt library:', error);
            return this.getFallbackPrompts(businessUnit);
        }
    }

    /**
     * Generate risk assessment and success prediction
     */
    async generateRiskAssessment(auditResults, userAnswers) {
        try {
            const assessment = await this.callGeminiWithRetry({
                prompt: this.buildRiskAssessmentPrompt(auditResults, userAnswers),
                temperature: 0.6,
                maxTokens: 1000
            });

            return this.parseRiskAssessmentResponse(assessment);
        } catch (error) {
            console.error('Failed to generate risk assessment:', error);
            return this.getFallbackRiskAssessment();
        }
    }

    /**
     * Generate adaptive implementation roadmap
     */
    async generateAdaptiveRoadmap(auditResults, userAnswers, userPreferences = {}) {
        try {
            const roadmap = await this.callGeminiWithRetry({
                prompt: this.buildRoadmapPrompt(auditResults, userAnswers, userPreferences),
                temperature: 0.7,
                maxTokens: 1800
            });

            return this.parseRoadmapResponse(roadmap);
        } catch (error) {
            console.error('Failed to generate adaptive roadmap:', error);
            return this.getFallbackRoadmap(auditResults);
        }
    }

    /**
     * Generate industry benchmarking insights
     */
    async generateBenchmarkingInsights(auditResults, userAnswers) {
        try {
            const benchmarks = await this.callGeminiWithRetry({
                prompt: this.buildBenchmarkingPrompt(auditResults, userAnswers),
                temperature: 0.5,
                maxTokens: 1200
            });

            return this.parseBenchmarkingResponse(benchmarks);
        } catch (error) {
            console.error('Failed to generate benchmarking insights:', error);
            return this.getFallbackBenchmarks();
        }
    }

    // ==================== PROMPT BUILDERS ====================

    buildInsightsPrompt(auditResults, userAnswers) {
        const businessUnit = auditResults.businessUnit;
        const totalTime = auditResults.totalTimeSaved;
        const painPoints = this.extractPainPoints(userAnswers, businessUnit);
        const currentEfficiency = this.calculateCurrentEfficiency(userAnswers, businessUnit);

        return `You are an AI transformation consultant analyzing a ${businessUnit} professional's workflow.

AUDIT RESULTS:
- Role: ${businessUnit}
- Potential weekly time savings: ${totalTime} hours
- Current efficiency level: ${currentEfficiency}
- Key pain points: ${painPoints.join(', ')}
- AI experience: ${userAnswers.aiexperience || 'not specified'}

DETAILED WORKFLOW DATA:
${this.formatWorkflowData(userAnswers, businessUnit)}

Generate a comprehensive analysis with:

1. **QUICK WINS** (3 specific actions implementable this week):
   - Action name
   - Expected time savings
   - Implementation difficulty (1-5)
   - Specific tools/prompts to use

2. **HIDDEN OPPORTUNITIES** (2-3 non-obvious improvements):
   - Workflow bottlenecks they might not see
   - Cross-functional AI applications
   - Automation possibilities

3. **SUCCESS PREDICTORS** (factors that will determine their success):
   - Strengths to leverage
   - Potential obstacles
   - Recommended preparation steps

4. **PERSONALIZED INSIGHTS** (specific to their situation):
   - Why their current approach isn't optimal
   - Industry-specific AI trends relevant to them
   - Competitive advantages they could gain

Format as JSON with clear, actionable recommendations. Be specific and practical.`;
    }

    buildPromptLibraryPrompt(businessUnit, painPoints, currentTools, timeConstraints) {
        return `Create a personalized AI prompt library for a ${businessUnit} professional.

CONTEXT:
- Role: ${businessUnit}
- Main challenges: ${painPoints.join(', ')}
- Current tools: ${currentTools.join(', ')}
- Time constraints: ${timeConstraints}

Generate 8-10 ready-to-use AI prompts that directly address their workflow challenges:

1. **DAILY WORKFLOW PROMPTS** (4-5 prompts for routine tasks)
2. **PROBLEM-SOLVING PROMPTS** (2-3 prompts for complex challenges)
3. **QUALITY IMPROVEMENT PROMPTS** (2-3 prompts for enhancing output)

For each prompt:
- Clear, specific instruction
- Placeholder variables in [BRACKETS]
- Expected output description
- Best use case scenario
- Estimated time savings

Focus on prompts that:
- Solve their specific pain points
- Work with their current tools
- Provide immediate value
- Are easy to customize

Format as JSON with categories and detailed prompt objects.`;
    }

    buildRiskAssessmentPrompt(auditResults, userAnswers) {
        const businessUnit = auditResults.businessUnit;
        const aiExperience = userAnswers.aiexperience || 'none';
        const toolsInUse = this.extractCurrentTools(userAnswers, businessUnit);

        return `Assess AI adoption risk and success probability for this ${businessUnit} professional.

PROFILE:
- Role: ${businessUnit}
- AI experience: ${aiExperience}
- Current tools: ${toolsInUse.join(', ')}
- Potential savings: ${auditResults.totalTimeSaved} hrs/week
- Workflow complexity: ${this.assessWorkflowComplexity(userAnswers, businessUnit)}

ASSESSMENT CRITERIA:
1. **Technical Readiness** (current tool proficiency, learning curve)
2. **Change Management** (workflow disruption, adoption barriers)
3. **Organizational Support** (team dynamics, management buy-in)
4. **Time Investment** (setup time vs. available bandwidth)

Generate:
1. **Success Probability** (percentage with confidence interval)
2. **Risk Factors** (top 3 potential obstacles)
3. **Mitigation Strategies** (specific actions to reduce risk)
4. **Success Indicators** (metrics to track progress)
5. **Recommended Timeline** (realistic implementation pace)

Provide specific, actionable insights based on their profile.`;
    }

    buildRoadmapPrompt(auditResults, userAnswers, userPreferences) {
        const businessUnit = auditResults.businessUnit;
        const availableTime = userPreferences.weeklyTimeCommitment || '2-3 hours';
        const learningStyle = userPreferences.learningStyle || 'hands-on';

        return `Create an adaptive 30-day AI implementation roadmap for a ${businessUnit} professional.

CONSTRAINTS:
- Available time: ${availableTime} per week
- Learning style: ${learningStyle}
- AI experience: ${userAnswers.aiexperience || 'beginner'}
- Priority focus: ${this.extractTopPriority(auditResults)}

ROADMAP REQUIREMENTS:
- Realistic time commitments
- Progressive skill building
- Quick wins in first week
- Measurable milestones
- Flexibility for setbacks

Generate 4 weekly phases:

WEEK 1: Foundation & Quick Wins
- 3-4 specific tasks
- Expected time investment
- Success metrics
- Troubleshooting tips

WEEK 2: Skill Development
- Building on week 1
- New tools/techniques
- Practice exercises
- Progress checkpoints

WEEK 3: Integration & Scaling
- Workflow integration
- Advanced techniques
- Team collaboration
- Optimization opportunities

WEEK 4: Mastery & Measurement
- Advanced applications
- Results measurement
- Continuous improvement
- Next steps planning

For each week, include:
- Daily/task breakdown
- Time estimates
- Difficulty ratings
- Success criteria
- Backup plans for common issues

Format as detailed JSON structure.`;
    }

    buildBenchmarkingPrompt(auditResults, userAnswers) {
        const businessUnit = auditResults.businessUnit;
        const currentMetrics = this.extractCurrentMetrics(userAnswers, businessUnit);

        return `Provide industry benchmarking analysis for this ${businessUnit} professional.

CURRENT PERFORMANCE:
${JSON.stringify(currentMetrics, null, 2)}

BENCHMARKING ANALYSIS:
1. **Industry Standards** (typical performance ranges for ${businessUnit})
2. **Peer Comparison** (how they rank vs. similar professionals)
3. **Best-in-Class** (top 10% performance benchmarks)
4. **Improvement Potential** (realistic targets based on their profile)

Generate insights on:
- Where they excel vs. industry average
- Biggest improvement opportunities
- Realistic performance targets
- Timeline to reach benchmarks
- Success stories from similar profiles

Provide specific percentiles, metrics, and actionable comparisons.`;
    }

    // ==================== RESPONSE PARSERS ====================

    parseInsightsResponse(response) {
        try {
            const parsed = JSON.parse(response);
            return {
                quickWins: parsed.quickWins || [],
                hiddenOpportunities: parsed.hiddenOpportunities || [],
                successPredictors: parsed.successPredictors || {},
                personalizedInsights: parsed.personalizedInsights || {}
            };
        } catch (error) {
            console.error('Failed to parse insights response:', error);
            return this.getFallbackInsights();
        }
    }

    parsePromptLibraryResponse(response) {
        try {
            const parsed = JSON.parse(response);
            return {
                dailyWorkflow: parsed.dailyWorkflow || [],
                problemSolving: parsed.problemSolving || [],
                qualityImprovement: parsed.qualityImprovement || []
            };
        } catch (error) {
            console.error('Failed to parse prompt library response:', error);
            return this.getFallbackPrompts();
        }
    }

    parseRiskAssessmentResponse(response) {
        try {
            const parsed = JSON.parse(response);
            return {
                successProbability: parsed.successProbability || 75,
                confidenceInterval: parsed.confidenceInterval || [65, 85],
                riskFactors: parsed.riskFactors || [],
                mitigationStrategies: parsed.mitigationStrategies || [],
                successIndicators: parsed.successIndicators || [],
                recommendedTimeline: parsed.recommendedTimeline || '4 weeks'
            };
        } catch (error) {
            console.error('Failed to parse risk assessment response:', error);
            return this.getFallbackRiskAssessment();
        }
    }

    parseRoadmapResponse(response) {
        try {
            const parsed = JSON.parse(response);
            return {
                week1: parsed.week1 || {},
                week2: parsed.week2 || {},
                week3: parsed.week3 || {},
                week4: parsed.week4 || {}
            };
        } catch (error) {
            console.error('Failed to parse roadmap response:', error);
            return this.getFallbackRoadmap();
        }
    }

    parseBenchmarkingResponse(response) {
        try {
            const parsed = JSON.parse(response);
            return {
                industryStandards: parsed.industryStandards || {},
                peerComparison: parsed.peerComparison || {},
                bestInClass: parsed.bestInClass || {},
                improvementPotential: parsed.improvementPotential || {}
            };
        } catch (error) {
            console.error('Failed to parse benchmarking response:', error);
            return this.getFallbackBenchmarks();
        }
    }

    // ==================== UTILITY METHODS ====================

    async callGeminiWithRetry(payload) {
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await fetch(this.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data.text || data.response;
            } catch (error) {
                console.warn(`Gemini API attempt ${attempt} failed:`, error);
                
                if (attempt === this.retryAttempts) {
                    throw error;
                }
                
                await this.delay(this.retryDelay * attempt);
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateCacheKey(auditResults, userAnswers) {
        const keyData = {
            businessUnit: auditResults.businessUnit,
            totalTimeSaved: auditResults.totalTimeSaved,
            aiExperience: userAnswers.aiexperience,
            // Add key answer fields that affect recommendations
            ...this.extractKeyAnswers(userAnswers, auditResults.businessUnit)
        };
        
        return btoa(JSON.stringify(keyData));
    }

    extractPainPoints(userAnswers, businessUnit) {
        const painPoints = [];
        
        switch (businessUnit) {
            case 'sourcing':
                if (userAnswers.sourcing_reply_rate === '0-10') painPoints.push('low reply rates');
                if (userAnswers.sourcing_boolean_usage === '1' || userAnswers.sourcing_boolean_usage === '2') {
                    painPoints.push('limited Boolean search skills');
                }
                if (userAnswers.sourcing_qualified_submit === '0-20') painPoints.push('low qualification rates');
                break;
                
            case 'admin':
                if (userAnswers.admin_template_usage === '0-25') painPoints.push('manual document creation');
                if (userAnswers.admin_error_sources?.includes('duplicates')) painPoints.push('data quality issues');
                if (userAnswers.admin_manual_transfers !== 'no') painPoints.push('manual data transfers');
                break;
                
            case 'scheduling':
                if (userAnswers.scheduling_availability_collection === 'email_pingpong') {
                    painPoints.push('inefficient availability collection');
                }
                if (userAnswers.scheduling_auto_communications === 'no') painPoints.push('manual communications');
                break;
                
            case 'compliance':
                if (userAnswers.compliance_standardized_checklists === 'no') painPoints.push('inconsistent processes');
                if (userAnswers.compliance_audit_trail_storage === 'email_threads') painPoints.push('poor documentation');
                break;
                
            case 'contracts':
                if (userAnswers.contracts_returned_corrections === '>10') painPoints.push('high error rates');
                if (userAnswers.contracts_clause_library === 'no') painPoints.push('lack of standardization');
                break;
        }
        
        return painPoints.length > 0 ? painPoints : ['workflow inefficiencies', 'time management challenges'];
    }

    calculateCurrentEfficiency(userAnswers, businessUnit) {
        // Calculate efficiency score based on role-specific metrics
        let score = 50; // baseline
        
        switch (businessUnit) {
            case 'sourcing':
                if (userAnswers.sourcing_reply_rate === '30+') score += 20;
                else if (userAnswers.sourcing_reply_rate === '21-30') score += 10;
                
                if (userAnswers.sourcing_qualified_submit === '60+') score += 20;
                else if (userAnswers.sourcing_qualified_submit === '41-60') score += 10;
                break;
                
            case 'admin':
                if (userAnswers.admin_template_usage === '76-100') score += 15;
                if (userAnswers.admin_manual_transfers === 'no') score += 15;
                break;
        }
        
        return Math.min(100, Math.max(0, score));
    }

    formatWorkflowData(userAnswers, businessUnit) {
        const relevantAnswers = Object.entries(userAnswers)
            .filter(([key]) => key.startsWith(businessUnit) || key === 'aiexperience')
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
            
        return relevantAnswers;
    }

    extractCurrentTools(userAnswers, businessUnit) {
        const tools = [];
        
        if (businessUnit === 'admin' && userAnswers.admin_tools_in_use) {
            return Array.isArray(userAnswers.admin_tools_in_use) 
                ? userAnswers.admin_tools_in_use 
                : [userAnswers.admin_tools_in_use];
        }
        
        if (businessUnit === 'scheduling' && userAnswers.scheduling_calendar_integration) {
            return Array.isArray(userAnswers.scheduling_calendar_integration)
                ? userAnswers.scheduling_calendar_integration
                : [userAnswers.scheduling_calendar_integration];
        }
        
        return ['Standard office tools'];
    }

    assessWorkflowComplexity(userAnswers, businessUnit) {
        let complexity = 'medium';
        
        switch (businessUnit) {
            case 'sourcing':
                if (userAnswers.sourcing_role_seniority === 'executive') complexity = 'high';
                else if (userAnswers.sourcing_role_seniority === 'high-volume') complexity = 'low';
                break;
                
            case 'scheduling':
                if (userAnswers.scheduling_multi_panel_timezone === '>75') complexity = 'high';
                else if (userAnswers.scheduling_multi_panel_timezone === '<25') complexity = 'low';
                break;
        }
        
        return complexity;
    }

    extractTopPriority(auditResults) {
        if (auditResults.recommendations && auditResults.recommendations.length > 0) {
            return auditResults.recommendations[0].name;
        }
        return 'workflow optimization';
    }

    extractCurrentMetrics(userAnswers, businessUnit) {
        const metrics = {};
        
        switch (businessUnit) {
            case 'sourcing':
                metrics.replyRate = userAnswers.sourcing_reply_rate;
                metrics.qualifiedSubmitRate = userAnswers.sourcing_qualified_submit;
                metrics.activeRoles = userAnswers.sourcing_active_roles;
                break;
                
            case 'scheduling':
                metrics.interviewsPerWeek = userAnswers.scheduling_interviews_per_week;
                metrics.timeToSchedule = userAnswers.scheduling_time_to_schedule;
                metrics.noshowRate = userAnswers.scheduling_noshow_rate;
                break;
        }
        
        return metrics;
    }

    extractKeyAnswers(userAnswers, businessUnit) {
        const keyFields = {
            sourcing: ['sourcing_reply_rate', 'sourcing_qualified_submit', 'sourcing_boolean_usage'],
            admin: ['admin_template_usage', 'admin_manual_transfers', 'admin_error_sources'],
            scheduling: ['scheduling_availability_collection', 'scheduling_auto_communications'],
            compliance: ['compliance_standardized_checklists', 'compliance_sla_adherence'],
            contracts: ['contracts_returned_corrections', 'contracts_turnaround_time']
        };
        
        const relevantFields = keyFields[businessUnit] || [];
        const keyAnswers = {};
        
        relevantFields.forEach(field => {
            if (userAnswers[field]) {
                keyAnswers[field] = userAnswers[field];
            }
        });
        
        return keyAnswers;
    }

    // ==================== FALLBACK METHODS ====================

    getFallbackInsights(auditResults) {
        return {
            quickWins: [
                {
                    action: 'Set up AI writing assistant',
                    timeSavings: '2-3 hours/week',
                    difficulty: 2,
                    tools: ['Google Gemini', 'Microsoft Copilot']
                }
            ],
            hiddenOpportunities: [
                {
                    opportunity: 'Automate routine communications',
                    description: 'Use AI to draft emails and status updates'
                }
            ],
            successPredictors: {
                strengths: ['Existing tool familiarity'],
                obstacles: ['Time for initial setup'],
                preparation: ['Block 2 hours for setup']
            },
            personalizedInsights: {
                efficiency: 'Focus on high-impact, low-effort improvements first',
                competitive: 'AI adoption will differentiate you from peers'
            }
        };
    }

    getFallbackPrompts(businessUnit) {
        const prompts = {
            sourcing: {
                dailyWorkflow: [
                    {
                        name: 'Boolean Search Generator',
                        prompt: 'Create a Boolean search string for [ROLE] with skills [SKILLS] excluding companies [COMPANIES]',
                        timeSavings: '30 minutes',
                        useCase: 'Daily candidate sourcing'
                    }
                ]
            },
            admin: {
                dailyWorkflow: [
                    {
                        name: 'Status Email Template',
                        prompt: 'Write a professional status update email for [PROJECT] highlighting [ACHIEVEMENTS] and next steps [NEXT_STEPS]',
                        timeSavings: '15 minutes',
                        useCase: 'Weekly reporting'
                    }
                ]
            }
        };
        
        return prompts[businessUnit] || prompts.admin;
    }

    getFallbackRiskAssessment() {
        return {
            successProbability: 75,
            confidenceInterval: [65, 85],
            riskFactors: [
                'Time constraints for initial setup',
                'Learning curve for new tools',
                'Workflow integration challenges'
            ],
            mitigationStrategies: [
                'Start with one tool at a time',
                'Block dedicated learning time',
                'Find an AI mentor or buddy'
            ],
            successIndicators: [
                'Consistent daily AI tool usage',
                'Measurable time savings',
                'Improved output quality'
            ],
            recommendedTimeline: '4-6 weeks'
        };
    }

    getFallbackRoadmap(auditResults) {
        return {
            week1: {
                title: 'Foundation & Setup',
                tasks: ['Set up primary AI tool', 'Complete basic training', 'Try first automation'],
                timeCommitment: '3-4 hours',
                successMetrics: ['Tool account created', 'First successful AI interaction']
            },
            week2: {
                title: 'Daily Integration',
                tasks: ['Use AI for routine tasks', 'Build custom prompts', 'Track time savings'],
                timeCommitment: '2-3 hours',
                successMetrics: ['Daily AI usage', 'Documented time savings']
            },
            week3: {
                title: 'Workflow Optimization',
                tasks: ['Integrate with existing tools', 'Share with team', 'Refine processes'],
                timeCommitment: '2-3 hours',
                successMetrics: ['Seamless workflow integration', 'Team adoption']
            },
            week4: {
                title: 'Mastery & Scaling',
                tasks: ['Advanced techniques', 'Measure ROI', 'Plan next phase'],
                timeCommitment: '2 hours',
                successMetrics: ['Quantified benefits', 'Expansion plan']
            }
        };
    }

    getFallbackBenchmarks() {
        return {
            industryStandards: {
                efficiency: 'Industry average efficiency: 65%',
                adoption: 'AI adoption rate: 35%'
            },
            peerComparison: {
                ranking: 'Above average potential',
                percentile: '70th percentile'
            },
            bestInClass: {
                target: 'Top performers save 25+ hours/week',
                timeline: '6-12 months to reach'
            },
            improvementPotential: {
                realistic: '15-20 hours/week savings',
                timeline: '3-6 months'
            }
        };
    }
}

// Export for use in main audit application
window.GeminiAuditEnhancer = GeminiAuditEnhancer;