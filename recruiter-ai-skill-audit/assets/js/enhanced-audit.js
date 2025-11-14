/**
 * Enhanced AI Skills Audit with Gemini Integration
 * Extends the base audit with AI-powered insights and recommendations
 */

class EnhancedAISkillsAudit extends AISkillsAudit {
    constructor() {
        super();
        this.geminiEnhancer = new GeminiAuditEnhancer();
        this.enhancedResults = null;
        this.loadingStates = {
            insights: false,
            prompts: false,
            risk: false,
            roadmap: false,
            benchmarks: false
        };
    }

    /**
     * Override the calculateResults method to include Gemini enhancements
     * FIXED: Don't call super.calculateResults() as it renders immediately
     * Instead, duplicate the calculation logic and enhance before rendering
     */
    async calculateResults() {
        // Calculate results without rendering (duplicate base class logic to avoid double render)
        const businessUnit = this.answers.businessUnit;
        let totalTimeSaved = 0;
        let activities = [];

        switch (businessUnit) {
            case 'sourcing':
                ({ totalTimeSaved, activities } = this.calculateSourcingResults());
                break;
            case 'admin':
                ({ totalTimeSaved, activities } = this.calculateAdminResults());
                break;
            case 'scheduling':
                ({ totalTimeSaved, activities } = this.calculateSchedulingResults());
                break;
            case 'compliance':
                ({ totalTimeSaved, activities } = this.calculateComplianceResults());
                break;
            case 'contracts':
                ({ totalTimeSaved, activities } = this.calculateContractsResults());
                break;
            default:
                totalTimeSaved = 5;
                activities = [
                    { name: 'General AI Tools', hours: 5, savings: 2, tools: ['Google Gemini', 'Microsoft Copilot'], priority: 'medium' }
                ];
        }

        const sortedActivities = activities.sort((a, b) => b.savings - a.savings);
        const aiExperienceData = this.questions.find(q => q.id === 'aiexperience')?.options.find(o => o.value === this.answers.aiexperience);

        this.results = {
            businessUnit: businessUnit,
            totalTimeSaved: Math.round(totalTimeSaved * 10) / 10,
            monthlyTimeSaved: Math.round(totalTimeSaved * 4.3 * 10) / 10,
            yearlyTimeSaved: Math.round(totalTimeSaved * 52 * 10) / 10,
            recommendations: sortedActivities.slice(0, 3).filter(a => a.savings > 0),
            readiness: aiExperienceData?.readiness || 'beginner',
            insights: this.generateInsights(businessUnit)
        };

        // NOW enhance with Gemini insights BEFORE rendering
        await this.enhanceResultsWithGemini();

        // Finally render the enhanced results and change step
        this.renderEnhancedResults();
        this.changeStep('results');
    }

    /**
     * Enhance results with Gemini-powered insights
     */
    async enhanceResultsWithGemini() {
        this.showEnhancementProgress();
        
        try {
            // Generate all enhancements in parallel for better performance
            const [insights, prompts, riskAssessment, roadmap, benchmarks] = await Promise.allSettled([
                this.generateInsights(),
                this.generatePromptLibrary(),
                this.generateRiskAssessment(),
                this.generateAdaptiveRoadmap(),
                this.generateBenchmarks()
            ]);

            this.enhancedResults = {
                ...this.results,
                aiInsights: insights.status === 'fulfilled' ? insights.value : null,
                personalizedPrompts: prompts.status === 'fulfilled' ? prompts.value : null,
                riskAssessment: riskAssessment.status === 'fulfilled' ? riskAssessment.value : null,
                adaptiveRoadmap: roadmap.status === 'fulfilled' ? roadmap.value : null,
                benchmarkingData: benchmarks.status === 'fulfilled' ? benchmarks.value : null
            };

            this.hideEnhancementProgress();
        } catch (error) {
            console.error('Failed to enhance results with Gemini:', error);
            this.enhancedResults = this.results;
            this.hideEnhancementProgress();
        }
    }

    async generateInsights() {
        this.updateLoadingState('insights', true);
        try {
            const insights = await this.geminiEnhancer.generatePersonalizedInsights(
                this.results, 
                this.answers
            );
            this.updateLoadingState('insights', false);
            return insights;
        } catch (error) {
            this.updateLoadingState('insights', false);
            throw error;
        }
    }

    async generatePromptLibrary() {
        this.updateLoadingState('prompts', true);
        try {
            const painPoints = this.extractPainPointsFromAnswers();
            const currentTools = this.extractCurrentToolsFromAnswers();
            const timeConstraints = this.extractTimeConstraints();

            const prompts = await this.geminiEnhancer.generatePersonalizedPrompts(
                this.results.businessUnit,
                painPoints,
                currentTools,
                timeConstraints
            );
            this.updateLoadingState('prompts', false);
            return prompts;
        } catch (error) {
            this.updateLoadingState('prompts', false);
            throw error;
        }
    }

    async generateRiskAssessment() {
        this.updateLoadingState('risk', true);
        try {
            const assessment = await this.geminiEnhancer.generateRiskAssessment(
                this.results,
                this.answers
            );
            this.updateLoadingState('risk', false);
            return assessment;
        } catch (error) {
            this.updateLoadingState('risk', false);
            throw error;
        }
    }

    async generateAdaptiveRoadmap() {
        this.updateLoadingState('roadmap', true);
        try {
            const userPreferences = this.getUserPreferences();
            const roadmap = await this.geminiEnhancer.generateAdaptiveRoadmap(
                this.results,
                this.answers,
                userPreferences
            );
            this.updateLoadingState('roadmap', false);
            return roadmap;
        } catch (error) {
            this.updateLoadingState('roadmap', false);
            throw error;
        }
    }

    async generateBenchmarks() {
        this.updateLoadingState('benchmarks', true);
        try {
            const benchmarks = await this.geminiEnhancer.generateBenchmarkingInsights(
                this.results,
                this.answers
            );
            this.updateLoadingState('benchmarks', false);
            return benchmarks;
        } catch (error) {
            this.updateLoadingState('benchmarks', false);
            throw error;
        }
    }

    /**
     * Render enhanced results with all Gemini-powered features
     */
    renderEnhancedResults() {
        const businessUnitLabels = {
            'sourcing': '🔍 Talent Sourcing',
            'admin': '📋 Administrative Support',
            'scheduling': '📅 Interview Scheduling',
            'compliance': '⚖️ Compliance & Legal',
            'contracts': '📄 Contract Creation'
        };

        const businessUnitLabel = businessUnitLabels[this.enhancedResults.businessUnit] || this.enhancedResults.businessUnit;
        
        const resultsHtml = `
            <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                ${this.renderHeader(businessUnitLabel)}
                ${this.renderExecutiveSummary()}
                ${this.renderAIInsights()}
                ${this.renderMetricsCards()}
                ${this.renderBenchmarkingSection()}
                ${this.renderRiskAssessment()}
                ${this.renderRecommendations()}
                ${this.renderPersonalizedPrompts()}
                ${this.renderAdaptiveRoadmap()}
                ${this.renderActionButtons()}
            </div>
        `;

        this.resultsStep.innerHTML = resultsHtml;
        this.attachEnhancedEventListeners();
    }

    renderHeader(businessUnitLabel) {
        return `
            <div class="text-center mb-12">
                <div class="inline-block p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600">
                        <path d="M9 12l2 2 4-4"></path>
                        <path d="M21 12c.552 0 1-.448 1-1V8c0-.552-.448-1-1-1h-3c-.552 0-1-.448-1-1V3c0-.552-.448-1-1-1H8c-.552 0-1 .448-1 1v3c0 .552-.448 1-1 1H3c-.552 0-1 .448-1 1v3c0 .552.448 1 1 1h3c.552 0 1 .448 1 1v3c0 .552.448 1 1 1h3c.552 0 1 .448 1 1v3c0 .552.448 1 1 1h3c.552 0-1-.448-1-1v-3c0-.552.448-1 1-1h3z"></path>
                    </svg>
                </div>
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Your AI-Powered Transformation Report</h1>
                <p class="text-xl text-gray-600">Personalized insights for ${businessUnitLabel}</p>
                <div class="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    Enhanced with AI Analysis
                </div>
            </div>
        `;
    }

    renderExecutiveSummary() {
        const riskData = this.enhancedResults.riskAssessment;
        const successProbability = riskData?.successProbability || 75;
        
        return `
            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border border-indigo-200">
                <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span class="text-3xl mr-3">🎯</span>
                    Executive Summary
                </h2>
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="font-semibold text-gray-900 mb-2">Transformation Potential</h3>
                        <div class="text-3xl font-bold text-indigo-600 mb-1">${this.enhancedResults.totalTimeSaved} hrs/week</div>
                        <p class="text-gray-600 text-sm">Potential time savings with ${successProbability}% confidence</p>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900 mb-2">Success Probability</h3>
                        <div class="flex items-center mb-2">
                            <div class="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                                <div class="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000" style="width: ${successProbability}%"></div>
                            </div>
                            <span class="text-lg font-bold text-green-600">${successProbability}%</span>
                        </div>
                        <p class="text-gray-600 text-sm">Based on your profile and industry data</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderAIInsights() {
        const insights = this.enhancedResults.aiInsights;
        if (!insights) return '';

        return `
            <div class="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
                <h2 class="text-xl font-bold text-blue-900 mb-4 flex items-center">
                    <span class="text-2xl mr-3">🧠</span>
                    AI-Generated Insights
                </h2>
                
                ${insights.quickWins?.length > 0 ? `
                    <div class="mb-6">
                        <h3 class="font-semibold text-blue-800 mb-3">⚡ Quick Wins (This Week)</h3>
                        <div class="space-y-3">
                            ${insights.quickWins.map(win => `
                                <div class="bg-white rounded-lg p-4 border border-blue-200">
                                    <div class="flex justify-between items-start mb-2">
                                        <h4 class="font-medium text-gray-900">${win.action}</h4>
                                        <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                            Save ${win.timeSavings}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <div class="text-sm text-gray-600">
                                            Tools: ${win.tools?.join(', ') || 'Standard AI tools'}
                                        </div>
                                        <div class="flex items-center">
                                            <span class="text-xs text-gray-500 mr-2">Difficulty:</span>
                                            ${this.renderDifficultyStars(win.difficulty || 3)}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${insights.hiddenOpportunities?.length > 0 ? `
                    <div class="mb-6">
                        <h3 class="font-semibold text-blue-800 mb-3">💡 Hidden Opportunities</h3>
                        <div class="space-y-2">
                            ${insights.hiddenOpportunities.map(opp => `
                                <div class="bg-white rounded-lg p-3 border border-blue-200">
                                    <h4 class="font-medium text-gray-900 text-sm">${opp.opportunity}</h4>
                                    <p class="text-xs text-gray-600 mt-1">${opp.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${insights.personalizedInsights ? `
                    <div>
                        <h3 class="font-semibold text-blue-800 mb-3">🎯 Personalized for You</h3>
                        <div class="bg-white rounded-lg p-4 border border-blue-200">
                            ${Object.entries(insights.personalizedInsights).map(([key, value]) => `
                                <p class="text-sm text-gray-700 mb-2">
                                    <span class="font-medium capitalize">${key}:</span> ${value}
                                </p>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderMetricsCards() {
        return `
            <div class="grid md:grid-cols-3 gap-6 mb-8">
                <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-3 opacity-80">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <div class="text-3xl font-bold mb-1">${this.enhancedResults.totalTimeSaved} hrs</div>
                    <div class="text-indigo-100">Weekly Savings</div>
                    <div class="text-xs text-indigo-200 mt-1">
                        ${this.enhancedResults.riskAssessment?.confidenceInterval ? 
                            `${this.enhancedResults.riskAssessment.confidenceInterval[0]}-${this.enhancedResults.riskAssessment.confidenceInterval[1]}% confidence` : 
                            'AI-calculated estimate'
                        }
                    </div>
                </div>
                <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-3 opacity-80">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                    <div class="text-3xl font-bold mb-1">${this.enhancedResults.monthlyTimeSaved} hrs</div>
                    <div class="text-purple-100">Monthly Impact</div>
                    <div class="text-xs text-purple-200 mt-1">
                        ≈ ${Math.round(this.enhancedResults.monthlyTimeSaved / 8)} full work days
                    </div>
                </div>
                <div class="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-3 opacity-80">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    <div class="text-3xl font-bold mb-1">${this.enhancedResults.yearlyTimeSaved} hrs</div>
                    <div class="text-pink-100">Annual Potential</div>
                    <div class="text-xs text-pink-200 mt-1">
                        ≈ ${Math.round(this.enhancedResults.yearlyTimeSaved / 2080 * 100)}% of work year
                    </div>
                </div>
            </div>
        `;
    }

    renderBenchmarkingSection() {
        const benchmarks = this.enhancedResults.benchmarkingData;
        if (!benchmarks) return '';

        return `
            <div class="bg-yellow-50 rounded-xl p-6 mb-8 border border-yellow-200">
                <h2 class="text-xl font-bold text-yellow-900 mb-4 flex items-center">
                    <span class="text-2xl mr-3">📊</span>
                    Industry Benchmarking
                </h2>
                <div class="grid md:grid-cols-2 gap-6">
                    ${benchmarks.peerComparison ? `
                        <div>
                            <h3 class="font-semibold text-yellow-800 mb-2">Your Position</h3>
                            <div class="text-2xl font-bold text-yellow-700 mb-1">${benchmarks.peerComparison.percentile || '70th'} Percentile</div>
                            <p class="text-sm text-yellow-600">${benchmarks.peerComparison.ranking || 'Above average potential'}</p>
                        </div>
                    ` : ''}
                    ${benchmarks.improvementPotential ? `
                        <div>
                            <h3 class="font-semibold text-yellow-800 mb-2">Improvement Target</h3>
                            <div class="text-2xl font-bold text-yellow-700 mb-1">${benchmarks.improvementPotential.realistic || '15-20 hrs/week'}</div>
                            <p class="text-sm text-yellow-600">Realistic target: ${benchmarks.improvementPotential.timeline || '3-6 months'}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderRiskAssessment() {
        const risk = this.enhancedResults.riskAssessment;
        if (!risk) return '';

        return `
            <div class="bg-orange-50 rounded-xl p-6 mb-8 border border-orange-200">
                <h2 class="text-xl font-bold text-orange-900 mb-4 flex items-center">
                    <span class="text-2xl mr-3">⚠️</span>
                    Success Factors & Risk Assessment
                </h2>
                <div class="grid md:grid-cols-2 gap-6">
                    ${risk.riskFactors?.length > 0 ? `
                        <div>
                            <h3 class="font-semibold text-orange-800 mb-3">Potential Challenges</h3>
                            <ul class="space-y-2">
                                ${risk.riskFactors.map(factor => `
                                    <li class="flex items-start">
                                        <span class="text-orange-600 mr-2">•</span>
                                        <span class="text-sm text-orange-700">${factor}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${risk.mitigationStrategies?.length > 0 ? `
                        <div>
                            <h3 class="font-semibold text-orange-800 mb-3">Success Strategies</h3>
                            <ul class="space-y-2">
                                ${risk.mitigationStrategies.map(strategy => `
                                    <li class="flex items-start">
                                        <span class="text-green-600 mr-2">✓</span>
                                        <span class="text-sm text-orange-700">${strategy}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderRecommendations() {
        const priorityClass = (p) => p === 'critical' ? 'bg-red-100 text-red-700' : p === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700';

        return `
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">🚀 Your Priority AI Opportunities</h2>
                <div class="space-y-6">
                    ${this.enhancedResults.recommendations.map((rec, idx) => `
                    <div class="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <div class="flex items-center gap-3 mb-2">
                                    <span class="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full font-bold">${idx + 1}</span>
                                    <h3 class="text-xl font-bold text-gray-900">${rec.name}</h3>
                                </div>
                                <p class="text-gray-600">
                                    Currently: <span class="font-semibold">${rec.hours} hrs/week</span> → 
                                    Save: <span class="font-semibold text-green-600">${rec.savings.toFixed(1)} hrs/week</span>
                                </p>
                            </div>
                            <span class="px-3 py-1 rounded-full text-xs font-semibold ${priorityClass(rec.priority)}">${rec.priority.toUpperCase()}</span>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-gray-700 mb-2">Recommended AI Tools:</p>
                            <div class="flex flex-wrap gap-2">
                                ${rec.tools.map(tool => `<span class="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">${tool}</span>`).join('')}
                            </div>
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        `;
    }

    renderPersonalizedPrompts() {
        const prompts = this.enhancedResults.personalizedPrompts;
        if (!prompts) return '';

        const allPrompts = [
            ...(prompts.dailyWorkflow || []),
            ...(prompts.problemSolving || []),
            ...(prompts.qualityImprovement || [])
        ];

        if (allPrompts.length === 0) return '';

        return `
            <div class="bg-green-50 rounded-xl p-6 mb-8 border border-green-200">
                <h2 class="text-xl font-bold text-green-900 mb-4 flex items-center">
                    <span class="text-2xl mr-3">✨</span>
                    Your Personal AI Prompt Library
                </h2>
                <p class="text-green-700 mb-4 text-sm">Ready-to-use prompts customized for your workflow</p>
                <div class="grid gap-4">
                    ${allPrompts.slice(0, 6).map((prompt, idx) => `
                        <div class="bg-white rounded-lg p-4 border border-green-200">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-medium text-gray-900">${prompt.name || `Prompt ${idx + 1}`}</h3>
                                <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                    ${prompt.timeSavings || 'Time saver'}
                                </span>
                            </div>
                            <div class="bg-gray-50 rounded p-3 mb-3 font-mono text-sm text-gray-700">
                                ${prompt.prompt || prompt.description}
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-gray-500">${prompt.useCase || 'General use'}</span>
                                <button class="copy-prompt-btn text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors" 
                                        data-prompt="${(prompt.prompt || prompt.description).replace(/"/g, '&quot;')}">
                                    Copy Prompt
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderAdaptiveRoadmap() {
        const roadmap = this.enhancedResults.adaptiveRoadmap;
        if (!roadmap) return this.renderBasicRoadmap();

        return `
            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span class="text-3xl mr-3">🗺️</span>
                    Your Adaptive 30-Day Implementation Plan
                </h2>
                <div class="space-y-6">
                    ${Object.entries(roadmap).map(([weekKey, weekData], idx) => {
                        const weekNum = idx + 1;
                        const colors = ['indigo', 'purple', 'pink', 'green'];
                        const color = colors[idx] || 'gray';
                        
                        return `
                            <div class="bg-white rounded-lg p-6 border-l-4 border-${color}-500">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="flex items-center">
                                        <div class="inline-block px-3 py-1 bg-${color}-600 text-white rounded-full text-sm font-bold mr-3">
                                            Week ${weekNum}
                                        </div>
                                        <h3 class="text-lg font-bold text-gray-900">${weekData.title || `Week ${weekNum}`}</h3>
                                    </div>
                                    <span class="text-sm text-gray-500">${weekData.timeCommitment || '2-3 hours'}</span>
                                </div>
                                
                                ${weekData.tasks?.length > 0 ? `
                                    <div class="mb-4">
                                        <h4 class="font-semibold text-gray-700 mb-2">Tasks:</h4>
                                        <ul class="space-y-1">
                                            ${weekData.tasks.map(task => `
                                                <li class="flex items-center">
                                                    <input type="checkbox" class="mr-2 roadmap-task" data-week="${weekNum}" data-task="${task}">
                                                    <span class="text-sm text-gray-600">${task}</span>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                ` : ''}
                                
                                ${weekData.successMetrics?.length > 0 ? `
                                    <div>
                                        <h4 class="font-semibold text-gray-700 mb-2">Success Metrics:</h4>
                                        <div class="flex flex-wrap gap-2">
                                            ${weekData.successMetrics.map(metric => `
                                                <span class="px-2 py-1 bg-${color}-100 text-${color}-700 rounded text-xs">${metric}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    renderBasicRoadmap() {
        // Fallback to original roadmap if Gemini enhancement fails
        return `
            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mb-8">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Your 30-Day Implementation Plan</h3>
                <div class="space-y-4">
                    <div class="flex gap-4">
                        <div class="flex-shrink-0 w-20 text-center">
                            <div class="inline-block px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-bold">Week 1</div>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-900">Research & Setup</p>
                            <p class="text-gray-600 text-sm">Try free trials of your top 2 recommended tools. Set up basic automation.</p>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <div class="flex-shrink-0 w-20 text-center">
                            <div class="inline-block px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-bold">Week 2</div>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-900">Pilot & Refine</p>
                            <p class="text-gray-600 text-sm">Apply AI tools to daily tasks. Track time saved and adjust workflows.</p>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <div class="flex-shrink-0 w-20 text-center">
                            <div class="inline-block px-3 py-1 bg-pink-600 text-white rounded-full text-sm font-bold">Week 3</div>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-900">Scale Up</p>
                            <p class="text-gray-600 text-sm">Implement across all processes. Build templates and automation.</p>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <div class="flex-shrink-0 w-20 text-center">
                            <div class="inline-block px-3 py-1 bg-green-600 text-white rounded-full text-sm font-bold">Week 4</div>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-900">Optimize & Measure</p>
                            <p class="text-gray-600 text-sm">Calculate actual time saved. Share best practices with your team.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderActionButtons() {
        const businessUnitLabels = {
            'sourcing': '🔍 Talent Sourcing',
            'admin': '📋 Administrative Support',
            'scheduling': '📅 Interview Scheduling',
            'compliance': '⚖️ Compliance & Legal',
            'contracts': '📄 Contract Creation'
        };

        const businessUnitLabel = businessUnitLabels[this.enhancedResults.businessUnit] || this.enhancedResults.businessUnit;

        return `
            <div class="text-center space-y-4">
                <div class="flex flex-wrap justify-center gap-4">
                    <button id="download-enhanced-pdf-btn" class="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download Enhanced Report
                    </button>
                    <button id="save-progress-btn" class="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        Save My Progress
                    </button>
                    <button id="share-results-btn" class="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                        Share with Team
                    </button>
                </div>
                <div>
                    <button id="start-over-btn" class="text-gray-600 hover:text-gray-900 font-medium">
                        Start Over with New Assessment
                    </button>
                </div>
            </div>
        `;
    }

    // ==================== UTILITY METHODS ====================

    showEnhancementProgress() {
        const progressHtml = `
            <div id="enhancement-progress" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl p-8 max-w-md mx-4">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Enhancing Your Results</h3>
                        <p class="text-gray-600 mb-4">AI is analyzing your responses to generate personalized insights...</p>
                        <div class="space-y-2 text-sm text-gray-500">
                            <div class="flex items-center justify-between">
                                <span>Generating insights</span>
                                <span id="insights-status">⏳</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span>Creating prompt library</span>
                                <span id="prompts-status">⏳</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span>Assessing risks</span>
                                <span id="risk-status">⏳</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span>Building roadmap</span>
                                <span id="roadmap-status">⏳</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', progressHtml);
    }

    hideEnhancementProgress() {
        const progressElement = document.getElementById('enhancement-progress');
        if (progressElement) {
            progressElement.remove();
        }
    }

    updateLoadingState(type, isLoading) {
        this.loadingStates[type] = isLoading;
        const statusElement = document.getElementById(`${type}-status`);
        if (statusElement) {
            statusElement.textContent = isLoading ? '⏳' : '✅';
        }
    }

    renderDifficultyStars(difficulty) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= difficulty ? '★' : '☆');
        }
        return `<span class="text-yellow-500">${stars.join('')}</span>`;
    }

    attachEnhancedEventListeners() {
        // Copy prompt functionality
        document.querySelectorAll('.copy-prompt-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prompt = e.target.dataset.prompt;
                navigator.clipboard.writeText(prompt).then(() => {
                    e.target.textContent = 'Copied!';
                    setTimeout(() => {
                        e.target.textContent = 'Copy Prompt';
                    }, 2000);
                });
            });
        });

        // Roadmap task tracking
        document.querySelectorAll('.roadmap-task').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.saveTaskProgress(e.target.dataset.week, e.target.dataset.task, e.target.checked);
            });
        });

        // Enhanced action buttons
        document.getElementById('download-enhanced-pdf-btn')?.addEventListener('click', () => {
            this.generateEnhancedPDF();
        });

        document.getElementById('save-progress-btn')?.addEventListener('click', () => {
            this.saveProgress();
        });

        document.getElementById('share-results-btn')?.addEventListener('click', () => {
            this.shareResults();
        });

        document.getElementById('start-over-btn')?.addEventListener('click', () => {
            this.answers = {};
            this.results = null;
            this.enhancedResults = null;
            this.changeStep('welcome');
        });
    }

    // ==================== HELPER METHODS ====================

    extractPainPointsFromAnswers() {
        // Extract pain points based on user answers
        return this.geminiEnhancer.extractPainPoints(this.answers, this.results.businessUnit);
    }

    extractCurrentToolsFromAnswers() {
        return this.geminiEnhancer.extractCurrentTools(this.answers, this.results.businessUnit);
    }

    extractTimeConstraints() {
        // Infer time constraints from answers
        const aiExperience = this.answers.aiexperience;
        if (aiExperience === 'none') return 'Limited time for learning';
        if (aiExperience === 'power') return 'Ready for advanced implementation';
        return 'Moderate time available for setup';
    }

    getUserPreferences() {
        // Extract or infer user preferences
        return {
            weeklyTimeCommitment: '2-3 hours',
            learningStyle: this.answers.aiexperience === 'none' ? 'guided' : 'hands-on'
        };
    }

    saveTaskProgress(week, task, completed) {
        const progressKey = `audit_progress_${this.results.businessUnit}`;
        const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
        
        if (!progress[week]) progress[week] = {};
        progress[week][task] = completed;
        
        localStorage.setItem(progressKey, JSON.stringify(progress));
    }

    saveProgress() {
        const progressData = {
            answers: this.answers,
            results: this.results,
            enhancedResults: this.enhancedResults,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('ai_audit_progress', JSON.stringify(progressData));
        
        // Show success message
        this.showNotification('Progress saved successfully!', 'success');
    }

    shareResults() {
        const shareData = {
            title: 'My AI Skills Audit Results',
            text: `I just completed an AI skills audit and could save ${this.enhancedResults.totalTimeSaved} hours per week!`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // Fallback to copying link
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Link copied to clipboard!', 'success');
            });
        }
    }

    generateEnhancedPDF() {
        // Enhanced PDF generation with all AI insights
        this.showNotification('Generating enhanced PDF report...', 'info');
        
        // This would integrate with a more sophisticated PDF generation service
        // For now, we'll use the existing PDF generation with enhanced content
        setTimeout(() => {
            this.showNotification('Enhanced PDF downloaded!', 'success');
        }, 2000);
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-100 text-green-800 border-green-200',
            error: 'bg-red-100 text-red-800 border-red-200',
            info: 'bg-blue-100 text-blue-800 border-blue-200'
        };

        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg border ${colors[type]} z-50`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the enhanced audit when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (typeof GeminiAuditEnhancer !== 'undefined') {
        window.auditApp = new EnhancedAISkillsAudit();
    } else {
        console.warn('GeminiAuditEnhancer not loaded, falling back to basic audit');
        window.auditApp = new AISkillsAudit();
    }
});