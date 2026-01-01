/**
 * AI Skills Audit - Main Application Logic
 * Handles question flow, calculations, and results generation
 */

class AISkillsAudit {
    constructor() {
        this.questions = [];
        this.businessUnits = [];
        this.aiTools = {};
        this.answers = {};
        this.results = null;
        this.step = 'welcome';

        // DOM elements
        this.welcomeStep = document.getElementById('welcome-step');
        this.questionsStep = document.getElementById('questions-step');
        this.resultsStep = document.getElementById('results-step');
        this.startBtn = document.getElementById('start-btn');

        // Phase 3: Analytics and Conditional Logic
        this.analyticsTracker = window.AnalyticsTracker ? new window.AnalyticsTracker() : null;
        this.conditionalLogic = window.ConditionalLogicEngine ? new window.ConditionalLogicEngine() : null;

        // Calculation Transparency (Phase 1)
        this.transparencyEngine = window.CalculationTransparency ? new window.CalculationTransparency() : null;

        // Calculation Transparency Phase 2 (Interactive Features)
        this.transparencyPhase2 = window.CalculationTransparencyPhase2 ? new window.CalculationTransparencyPhase2() : null;

        // Calculation Transparency Phase 3 (Depth Features)
        this.transparencyPhase3 = window.CalculationTransparencyPhase3 ? new window.CalculationTransparencyPhase3() : null;

        // Calculation Transparency Phase 4 (Advanced Features)
        this.transparencyPhase4 = window.CalculationTransparencyPhase4 ? new window.CalculationTransparencyPhase4() : null;

        // Store globally for analytics dashboard access
        if (this.analyticsTracker) {
            window.analyticsTracker = this.analyticsTracker;
        }

        this.init();
    }

    async init() {
        try {
            await this.loadQuestions();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize audit:', error);
            this.showError('Failed to load questions. Please refresh the page.');
        }
    }

    async loadQuestions() {
        try {
            const questionsUrl = new URL('./questions-fixed.json', window.location.href);
            console.log('Loading questions from:', questionsUrl.toString());
            const response = await fetch(questionsUrl);
            console.log('Response status:', response.status);
             
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            let data = await response.json();
            console.log('Questions loaded successfully:', data);

            // Check version and migrate if needed
            if (window.DataVersioning) {
                const versioning = new window.DataVersioning();

                if (versioning.needsMigration(data)) {
                    console.log('🔄 Data migration needed');
                    const migrationResult = versioning.migrateData(data);
                    versioning.logMigrationReport(migrationResult);
                    data = migrationResult.data;
                } else {
                    const detectedVersion = versioning.getDataVersion(data);
                    if (detectedVersion) {
                        console.log(`✅ Data is at current version (v${detectedVersion})`);
                    } else {
                        console.log('✅ Data is unversioned; skipping migrations');
                    }
                }
            }

            // Validate schema if validator available
            if (window.SchemaValidator) {
                const validator = new window.SchemaValidator();
                const validationReport = validator.validateQuestions(data);
                validator.logReport();

                if (!validationReport.isValid) {
                    console.warn('⚠️ Data quality issues detected. Review validation report above.');
                }
            }

            this.questions = data.questions;
            this.businessUnits = data.businessUnits;
            this.aiTools = data.aiTools;
        } catch (error) {
            console.error('Error loading questions:', error);
            console.log('Falling back to embedded questions...');
            this.loadFallbackQuestions();
        }
    }

    loadFallbackQuestions() {
        // Fallback questions in case JSON fails to load
        this.businessUnits = [
            { id: "sourcing", label: "🔍 Talent Sourcing", description: "Finding and identifying potential candidates" },
            { id: "admin", label: "📋 Administrative Support", description: "Data entry, documentation, and process support" },
            { id: "scheduling", label: "📅 Interview Scheduling", description: "Coordinating interviews and calendar management" },
            { id: "compliance", label: "⚖️ Compliance & Legal", description: "Ensuring regulatory compliance and legal requirements" },
            { id: "contracts", label: "📄 Contract Creation", description: "Drafting and managing employment contracts" }
        ];

        this.questions = [
            {
                id: 'businessUnit',
                question: 'Which GBS EMEA business function best describes your role?',
                type: 'single',
                showIf: null,
                options: this.businessUnits.map(unit => ({
                    value: unit.id,
                    label: unit.label,
                    description: unit.description
                }))
            },
            {
                id: 'aiexperience',
                question: 'Current experience with AI tools?',
                type: 'single',
                showIf: null,
                options: [
                    { value: 'none', label: 'No experience yet', readiness: 'beginner' },
                    { value: 'explored', label: 'Explored a few tools', readiness: 'intermediate' },
                    { value: 'using', label: 'Using 1-2 AI tools regularly', readiness: 'advanced' },
                    { value: 'power', label: 'Power user of multiple AI tools', readiness: 'expert' }
                ]
            }
        ];

        this.aiTools = {
            sourcing: [
                { name: 'Profile Review & Screening', tools: ['Google Gemini for profile analysis', 'Microsoft Copilot for candidate evaluation'], priority: 'high' },
                { name: 'Boolean Search & Query Building', tools: ['Google Gemini for Boolean strings', 'Microsoft Copilot for search queries'], priority: 'high' }
            ],
            admin: [
                { name: 'Document Creation & Formatting', tools: ['Google Gemini for JD writing', 'Microsoft Copilot in Word'], priority: 'high' },
                { name: 'Data Cleanup & Hygiene', tools: ['Google Gemini for data analysis', 'Microsoft Copilot in Excel'], priority: 'high' }
            ],
            scheduling: [
                { name: 'Interview Scheduling Automation', tools: ['Google Gemini for scheduling logic', 'Microsoft Copilot for calendar management'], priority: 'critical' }
            ],
            compliance: [
                { name: 'Compliance Task Automation', tools: ['Google Gemini for compliance guidance', 'Microsoft Copilot for compliance checks'], priority: 'critical' }
            ],
            contracts: [
                { name: 'Contract Generation & Templates', tools: ['Google Gemini for contract drafting', 'Microsoft Copilot in Word'], priority: 'critical' }
            ]
        };

        console.log('Fallback questions loaded successfully');
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => {
            // Track assessment start
            if (this.analyticsTracker) {
                this.analyticsTracker.trackEvent('assessment_started', {
                    timestamp: Date.now()
                });
            }

            this.changeStep('questions');
            this.renderQuestion();
        });
    }

    changeStep(newStep) {
        this.step = newStep;
        this.welcomeStep.classList.toggle('hidden', this.step !== 'welcome');
        this.questionsStep.classList.toggle('hidden', this.step !== 'questions');
        this.resultsStep.classList.toggle('hidden', this.step !== 'results');
        window.scrollTo(0, 0);
    }

    getRelevantQuestions() {
        let relevant = this.questions.filter(q => {
            if (!q.showIf) return true;
            return this.answers.businessUnit === q.showIf;
        });

        // Apply conditional logic filtering if available
        if (this.conditionalLogic) {
            const filtered = this.conditionalLogic.filterQuestions(relevant, this.answers);
            this.skippedQuestions = filtered.skipped;
            relevant = filtered.questions;
            console.log(`Conditional logic applied: ${filtered.skipped.length} questions skipped`);
        }

        console.log(`Business Unit: ${this.answers.businessUnit}, Relevant Questions: ${relevant.length}`, relevant.map(q => q.id));
        return relevant;
    }

    renderQuestion() {
        const relevantQuestions = this.getRelevantQuestions();
        const currentQuestionIndex = relevantQuestions.findIndex(q => !this.answers[q.id]);

        if (currentQuestionIndex === -1) {
            // Track assessment completion
            if (this.analyticsTracker) {
                this.analyticsTracker.trackEvent('assessment_completed', {
                    totalQuestions: relevantQuestions.length,
                    answeredQuestions: Object.keys(this.answers).length
                });
            }

            this.calculateResults();
            return;
        }

        const currentQuestion = relevantQuestions[currentQuestionIndex];

        // Track question view
        if (this.analyticsTracker) {
            this.analyticsTracker.trackEvent('question_viewed', {
                questionId: currentQuestion.id,
                questionIndex: currentQuestionIndex
            });
        }

        const progress = (Object.keys(this.answers).filter(key =>
            relevantQuestions.find(q => q.id === key)).length / relevantQuestions.length) * 100;

        this.renderProgressBar(currentQuestionIndex + 1, relevantQuestions.length, progress);
        this.renderQuestionCard(currentQuestion, currentQuestionIndex, relevantQuestions);
    }

    renderProgressBar(current, total, progress) {
        // Minimal progress UI (no multi-stage panel)
        let progressHtml = `
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-indigo-600 h-2 rounded-full transition-all duration-300" style="width: ${progress}%"></div>
            </div>
        `;

        document.getElementById('progress-container').innerHTML = progressHtml;

        return;

        if (false) {
        // Render multi-stage progress if enhanced features are available
        let progressHtml = '';

        if (window.enhancedFeatures) {
            progressHtml = window.enhancedFeatures.renderMultiStageProgress();

            // Add time estimate and review button
            progressHtml += `
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center gap-4">
                        <span class="text-sm font-medium text-gray-600">Question ${current} of ${total}</span>
                        ${window.enhancedFeatures.renderTimeEstimate()}
                    </div>
                    <button id="review-answers-btn" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                        <span>📋</span>
                        <span>Review Answers</span>
                    </button>
                </div>
            `;

            // Check for milestones
            window.enhancedFeatures.checkMilestone(progress);
        } else {
            // Fallback to basic progress bar
            progressHtml = `
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-600">Question ${current} of ${total}</span>
                    <span class="text-sm font-medium text-indigo-600">${Math.round(progress)}% Complete</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-indigo-600 h-2 rounded-full transition-all duration-300" style="width: ${progress}%"></div>
                </div>
            `;
        }

        document.getElementById('progress-container').innerHTML = progressHtml;

        // Add event listener for review button if it exists
        const reviewBtn = document.getElementById('review-answers-btn');
        if (reviewBtn && window.enhancedFeatures) {
            reviewBtn.addEventListener('click', () => {
                if (!document.getElementById('review-panel')) {
                    window.enhancedFeatures.createReviewPanel();
                }
                window.enhancedFeatures.openReviewPanel();
            });
        }
        }
    }

    renderQuestionCard(question, currentIndex, relevantQuestions) {
        // Add context bridge if enhanced features available
        let questionHtml = '';

        if (window.enhancedFeatures && currentIndex > 0) {
            const previousQuestion = relevantQuestions[currentIndex - 1];
            questionHtml += window.enhancedFeatures.addContextBridge(previousQuestion, question);
        }

        questionHtml += `<h2 class="text-2xl font-bold text-gray-900 mb-8">${question.question}</h2>`;

        // Render options (minimal UI)
        if (question.type === 'checkbox') {
            questionHtml += this.renderCheckboxQuestion(question);
        } else {
            questionHtml += this.renderSingleChoiceQuestion(question);
        }

        // Add enhanced features if available
        if (window.enhancedFeatures) {
            questionHtml += window.enhancedFeatures.addQuestionPreview(currentIndex, relevantQuestions);
        }

        // Add button container with proper spacing
        questionHtml += `<div class="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">`;
        
        if (currentIndex > 0) {
            questionHtml += `<button id="back-btn" class="text-gray-600 hover:text-gray-900 font-medium transition-colors">← Back</button>`;
        } else {
            questionHtml += `<div></div>`;
        }
        
        if (question.type === 'checkbox') {
            questionHtml += `<button id="checkbox-continue" class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">Continue</button>`;
        } else {
            questionHtml += `<div></div>`;
        }
        
        questionHtml += `</div>`;

        document.getElementById('question-card').innerHTML = questionHtml;

        this.attachQuestionEventListeners(question, currentIndex, relevantQuestions);
    }

    renderCheckboxQuestion(question) {
        let html = `<div class="space-y-3">`;
        question.options.forEach(option => {
            const potentialHtml = option.aiPotential ?
                `<div class="text-sm text-gray-500 mt-1">AI Potential: ${option.aiPotential}</div>` : '';
            html += `
                <label class="checkbox-option flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 cursor-pointer">
                    <input type="checkbox" value="${option.value}" class="mr-4 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                    <div class="flex-1">
                        <span class="text-lg font-medium text-gray-900">${option.label}</span>
                        ${potentialHtml}
                    </div>
                </label>
            `;
        });
        html += `</div>`;
        return html;
    }

    renderSingleChoiceQuestion(question) {
        let html = `<div class="space-y-3">`;
        question.options.forEach(option => {
            const descriptionHtml = option.description ?
                `<div class="text-sm text-gray-500 mt-1">${option.description}</div>` : '';
            html += `
                <button data-value="${option.value}" class="question-option w-full text-left p-5 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <span class="text-lg font-medium text-gray-900 group-hover:text-indigo-900">${option.label}</span>
                            ${descriptionHtml}
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                </button>
            `;
        });
        html += `</div>`;
        return html;
    }

    attachQuestionEventListeners(question, currentIndex, relevantQuestions) {
        const hasEnhancedRenderer = Boolean(window.enhancedQuestionRenderer);

        if (question.type === 'checkbox') {
            document.getElementById('checkbox-continue').addEventListener('click', () => {
                let selectedValues = [];

                if (hasEnhancedRenderer) {
                    const checked = document.querySelectorAll('.enhanced-checkbox-option input[type="checkbox"]:checked');
                    selectedValues = Array.from(checked)
                        .map(inputEl => inputEl.closest('[data-option-value]')?.dataset?.optionValue)
                        .filter(Boolean);
                } else {
                    const checkedBoxes = document.querySelectorAll('.checkbox-option input:checked');
                    selectedValues = Array.from(checkedBoxes).map(cb => cb.value).filter(Boolean);
                }

                // Track answer
                if (this.analyticsTracker) {
                    this.analyticsTracker.trackEvent('question_answered', {
                        questionId: question.id,
                        answer: selectedValues
                    });
                }

                this.answers[question.id] = selectedValues;
                this.proceedToNext(currentIndex, relevantQuestions);
            });
        } else {
            if (hasEnhancedRenderer) {
                // Enhanced renderer uses [data-option-value] containers, not .question-option buttons.
                const optionEls = document.querySelectorAll('.enhanced-single-option[data-option-value] .option-container');
                optionEls.forEach(optionContainer => {
                    optionContainer.addEventListener('click', (e) => {
                        // Ignore clicks on internal controls (e.g. expand/collapse button)
                        if (e.target?.closest('.expand-details-btn')) return;

                        const wrapper = optionContainer.closest('[data-option-value]');
                        const value = wrapper?.dataset?.optionValue;
                        if (!value) return;

                        if (this.analyticsTracker) {
                            this.analyticsTracker.trackEvent('question_answered', {
                                questionId: question.id,
                                answer: value
                            });
                        }

                        this.answers[question.id] = value;
                        this.proceedToNext(currentIndex, relevantQuestions);
                    });
                });

                // Also allow selecting from the hover preview CTA button.
                const previewCtas = document.querySelectorAll('.enhanced-single-option[data-option-value] .hover-preview button');
                previewCtas.forEach(cta => {
                    cta.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const wrapper = cta.closest('[data-option-value]');
                        const value = wrapper?.dataset?.optionValue;
                        if (!value) return;

                        if (this.analyticsTracker) {
                            this.analyticsTracker.trackEvent('question_answered', {
                                questionId: question.id,
                                answer: value
                            });
                        }

                        this.answers[question.id] = value;
                        this.proceedToNext(currentIndex, relevantQuestions);
                    });
                });
            } else {
                document.querySelectorAll('.question-option').forEach(btn => {
                    btn.addEventListener('click', () => {
                        // Track answer
                        if (this.analyticsTracker) {
                            this.analyticsTracker.trackEvent('question_answered', {
                                questionId: question.id,
                                answer: btn.dataset.value
                            });
                        }

                        this.answers[question.id] = btn.dataset.value;
                        this.proceedToNext(currentIndex, relevantQuestions);
                    });
                });
            }
        }

        if (currentIndex > 0) {
            document.getElementById('back-btn').addEventListener('click', () => {
                const prevQuestion = relevantQuestions[currentIndex - 1];

                // Track answer change
                if (this.analyticsTracker && this.answers[prevQuestion.id]) {
                    this.analyticsTracker.trackEvent('answer_changed', {
                        questionId: prevQuestion.id
                    });
                }

                delete this.answers[prevQuestion.id];
                this.renderQuestion();
            });
        }
    }

    proceedToNext(currentIndex, relevantQuestions) {
        // Save progress if enhanced features available
        if (window.enhancedFeatures) {
            window.enhancedFeatures.saveProgress();
        }

        if (currentIndex === relevantQuestions.length - 1) {
            setTimeout(() => this.calculateResults(), 300);
        } else {
            this.renderQuestion();
        }
    }

    calculateResults() {
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

        // Generate explainable calculation if available
        if (window.CalculationExplainer) {
            const explainer = new window.CalculationExplainer();
            const allQuestions = this.questions;
            const explainedResult = explainer.calculateWithExplanation(this.answers, allQuestions);

            // Add explanation data to results
            this.results.explanation = explainedResult;
            this.results.confidence = explainedResult.confidence;
            this.results.calculationSteps = explainedResult.steps;
        }

        // Generate benchmarking comparison if available
        if (window.BenchmarkingData) {
            const benchmarking = new window.BenchmarkingData();
            const comparison = benchmarking.generateComparison({
                weekly: this.results.totalTimeSaved,
                monthly: this.results.monthlyTimeSaved,
                yearly: this.results.yearlyTimeSaved
            });

            // Add comparison data to results
            this.results.benchmarking = comparison;
            this.results.benchmarkInsights = benchmarking.getInsights(comparison);
        }

        // Generate multi-dimensional scoring if available
        if (window.MultiDimensionalScorer) {
            const scorer = new window.MultiDimensionalScorer();
            const multiDimResult = scorer.calculateAllDimensions(
                this.answers,
                this.questions,
                {
                    totalTimeSaved: this.results.totalTimeSaved,
                    monthlyTimeSaved: this.results.monthlyTimeSaved,
                    yearlyTimeSaved: this.results.yearlyTimeSaved
                }
            );

            // Add multi-dimensional scoring to results
            this.results.multiDimensional = multiDimResult;
            this.results.overallScore = multiDimResult.overallScore;
        }

        // Tier 1 Feature: Workflow Stage Mapping
        if (window.WorkflowStageMapper) {
            const workflowMapper = new window.WorkflowStageMapper();
            const workflowAnalysis = workflowMapper.analyzeWorkflow(businessUnit, this.answers);

            if (workflowAnalysis) {
                this.results.workflowAnalysis = workflowAnalysis;
                console.log(`📊 Workflow Analysis: ${workflowAnalysis.bottlenecks.length} bottleneck(s) detected`);
            }
        }

        // Tier 1 Feature: Role Archetype Detection
        if (window.RoleArchetypeDetector) {
            const archetypeDetector = new window.RoleArchetypeDetector();
            const archetypeDetection = archetypeDetector.detectArchetype(businessUnit, this.answers);

            if (archetypeDetection) {
                this.results.archetype = archetypeDetection;
                console.log(`🎯 Archetype Detected: ${archetypeDetection.primaryArchetype.name} (${archetypeDetection.primaryArchetype.matchPercentage}% match)`);
            }
        }

        // Tier 1 Feature: Cross-Functional Pain Detection
        if (window.CrossFunctionalPainDetector) {
            const painDetector = new window.CrossFunctionalPainDetector();
            const painDetection = painDetector.detectCrossFunctionalPains(this.answers);

            if (painDetection) {
                this.results.crossFunctionalPains = painDetection;
                console.log(`🔍 Cross-Functional Analysis: ${painDetection.totalIssues} issue(s) detected`);
            }
        }

        // Tier 1 Feature: Scenario-Based Analysis
        if (window.ScenarioBasedAnalyzer) {
            const scenarioAnalyzer = new window.ScenarioBasedAnalyzer();
            const scenarioAnalyses = [];

            // Check for scenario answers in the responses
            Object.keys(this.answers).forEach(key => {
                if (key.endsWith('_scenario')) {
                    const scenarioId = key;
                    const selectedOptions = this.answers[key];

                    if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
                        const analysis = scenarioAnalyzer.analyzeScenario(
                            businessUnit,
                            scenarioId,
                            selectedOptions
                        );

                        if (analysis) {
                            scenarioAnalyses.push(analysis);
                        }
                    }
                }
            });

            if (scenarioAnalyses.length > 0) {
                this.results.scenarioAnalyses = scenarioAnalyses;
                console.log(`📋 Scenario Analyses: ${scenarioAnalyses.length} scenario(s) analyzed`);
            }
        }

        // Tier 2 Feature: Pain Point Intensity Scoring
        if (window.PainIntensityScorer) {
            const painScorer = new window.PainIntensityScorer();
            const painAnalysis = painScorer.analyzePainIntensity(businessUnit, this.answers);

            if (painAnalysis) {
                this.results.painAnalysis = painAnalysis;
                console.log(`😤 Pain Analysis: Avg pain ${painAnalysis.avgPainLevel}/5, ${painAnalysis.criticalPains.length} critical point(s)`);
            }
        }

        // Tier 2 Feature: Role-Specific Success Metrics
        if (window.RoleSuccessMetrics) {
            const metricsTracker = new window.RoleSuccessMetrics();
            const successMetrics = metricsTracker.calculateMetrics(businessUnit, this.answers);

            if (successMetrics) {
                this.results.successMetrics = successMetrics;
                console.log(`📈 Success Metrics: ${successMetrics.metrics.length} KPI(s) tracked, avg +${successMetrics.summary.avgImprovement}% with AI`);
            }
        }

        // Tier 2 Feature: Comparative Role Analysis
        if (window.ComparativeRoleAnalyzer) {
            const comparativeAnalyzer = new window.ComparativeRoleAnalyzer();
            const comparativeAnalysis = comparativeAnalyzer.performComparativeAnalysis(
                businessUnit,
                this.answers,
                this.results.successMetrics
            );

            if (comparativeAnalysis) {
                this.results.comparativeAnalysis = comparativeAnalysis;
                console.log(`📊 Comparative Analysis: ${comparativeAnalysis.userPercentile}th percentile (${comparativeAnalysis.standing.label})`);
            }
        }

        // Tier 3 Feature: Industry-Specific Pain Points
        if (window.IndustryPainDetector) {
            const industryDetector = new window.IndustryPainDetector();
            const industryDetection = industryDetector.detectIndustry(this.answers);

            if (industryDetection.detected) {
                const industryPains = industryDetector.analyzeIndustryPains(businessUnit, industryDetection);
                if (industryPains) {
                    this.results.industryPains = industryPains;
                    console.log(`💼 Industry Detected: ${industryDetection.industryProfile.name} (${Math.round(industryDetection.confidence * 100)}% confidence), ${industryPains.painCount} pain(s)`);
                }
            } else {
                console.log(`💼 Industry Detection: No clear industry detected`);
            }
        }

        // Tier 3 Feature: Dynamic Role Profiling
        if (window.DynamicRoleProfiler) {
            const profiler = new window.DynamicRoleProfiler();
            const roleProfile = profiler.buildProfile(
                businessUnit,
                this.answers,
                this.results.successMetrics,
                this.results.painAnalysis
            );

            if (roleProfile) {
                this.results.roleProfile = roleProfile;
                console.log(`🧬 Role Profile: ${roleProfile.persona.details.name} (${Math.round(roleProfile.confidence * 100)}% confidence)`);
            }
        }

        // Tier 3 Feature: Role Evolution Tracking
        if (window.RoleEvolutionTracker) {
            const evolutionTracker = new window.RoleEvolutionTracker();
            const evolution = evolutionTracker.trackEvolution(
                businessUnit,
                this.results.roleProfile,
                this.results.painAnalysis
            );

            if (evolution && evolution.available) {
                this.results.evolution = evolution;
                console.log(`🚀 Evolution Tracking: ${evolution.businessUnit} role evolution mapped through 24 months`);
            }
        }

        // Generate Calculation Transparency Data
        if (this.transparencyEngine) {
            this.results.assumptionDisclosure = this.transparencyEngine.createAssumptionDisclosure(
                businessUnit,
                this.answers
            );
            console.log(`📋 Assumption Disclosure: ${this.results.assumptionDisclosure.totalAssumptions} assumptions documented`);
        }

        // Generate Phase 2 Interactive Transparency Features
        if (this.transparencyPhase2) {
            // Generate scenario comparison (conservative/realistic/optimistic)
            this.results.scenarioComparison = this.transparencyPhase2.generateScenarios(
                businessUnit,
                this.answers,
                this.results
            );
            console.log(`🎯 Scenario Comparison: Conservative (${this.results.scenarioComparison.conservative.weeklyTimeSaved}h) | Realistic (${this.results.scenarioComparison.realistic.weeklyTimeSaved}h) | Optimistic (${this.results.scenarioComparison.optimistic.weeklyTimeSaved}h)`);

            // Generate interactive assumption adjuster
            this.results.assumptionAdjuster = this.transparencyPhase2.createAssumptionAdjuster(
                businessUnit,
                this.results.assumptionDisclosure
            );
            console.log(`🎛️ Assumption Adjuster: ${this.results.assumptionAdjuster.adjustableAssumptions.length} interactive sliders created`);
        }

        // Generate Phase 3 Depth Features
        if (this.transparencyPhase3) {
            // Generate formula explainer with mathematical breakdowns
            this.results.formulaExplainer = this.transparencyPhase3.createFormulaExplainer(
                businessUnit,
                this.answers,
                this.results
            );
            console.log(`📐 Formula Explainer: ${this.results.formulaExplainer.totalFormulas} formulas documented`);

            // Generate personalization proof showing answer impact
            this.results.personalizationProof = this.transparencyPhase3.createPersonalizationProof(
                businessUnit,
                this.answers,
                this.results
            );
            console.log(`🎯 Personalization Proof: ${this.results.personalizationProof.answersAnalyzed} answers analyzed, ${(this.results.personalizationProof.personalizationScore * 100).toFixed(0)}% personalization score`);

            // Generate source citations library
            this.results.sourceCitations = this.transparencyPhase3.createSourceCitations(businessUnit);
            console.log(`📚 Source Citations: ${this.results.sourceCitations.totalCitations} research sources documented`);
        }

        // Generate Phase 4 Advanced Features (for power users)
        if (this.transparencyPhase4) {
            // Generate calculation audit trail with timestamped logs
            this.results.auditTrail = this.transparencyPhase4.createAuditTrail(
                businessUnit,
                this.answers,
                this.results
            );
            console.log(`🔍 Audit Trail: ${this.results.auditTrail.totalSteps} steps logged in ${this.results.auditTrail.durationMs}ms (ID: ${this.results.auditTrail.metadata.auditId})`);

            // Generate sensitivity analysis showing key assumptions
            this.results.sensitivityAnalysis = this.transparencyPhase4.createSensitivityAnalysis(
                businessUnit,
                this.results
            );
            console.log(`📊 Sensitivity Analysis: ${this.results.sensitivityAnalysis.assumptionsTested} assumptions tested, most sensitive = ${this.results.sensitivityAnalysis.topSensitiveAssumption}`);

            // Generate confidence intervals with range estimates
            this.results.confidenceIntervals = this.transparencyPhase4.createConfidenceIntervals(
                businessUnit,
                this.results
            );
            console.log(`📈 Confidence Intervals: 90% CI = ${this.results.confidenceIntervals.intervals[0].lowerBound}-${this.results.confidenceIntervals.intervals[0].upperBound} hrs/week`);
        }

        this.renderResults();
        this.changeStep('results');
    }

    calculateSourcingResults() {
        const profilesData = this.getAnswerData('sourcing_profiles_per_role');
        const booleanData = this.getAnswerData('sourcing_boolean_usage');
        const marketMapsData = this.getAnswerData('sourcing_market_maps');
        const outreachData = this.getAnswerData('sourcing_outreach_time');
        const atsBackfillData = this.getAnswerData('sourcing_ats_backfill');

        const profilesSavings = profilesData ? (profilesData.hours * profilesData.savingsPct / 100) : 0;
        const booleanSavings = booleanData ? (booleanData.hours * booleanData.savingsPct / 100) : 0;
        const marketMapsSavings = marketMapsData ? (marketMapsData.hours * marketMapsData.savingsPct / 100) : 0;
        const outreachSavings = outreachData ? (outreachData.hours * outreachData.savingsPct / 100) : 0;
        const atsBackfillSavings = atsBackfillData ? (atsBackfillData.hours * atsBackfillData.savingsPct / 100) : 0;

        const totalTimeSaved = profilesSavings + booleanSavings + marketMapsSavings + outreachSavings + atsBackfillSavings;

        const activities = this.aiTools.sourcing.map(tool => ({
            name: tool.name,
            hours: this.getHoursForActivity(tool.name, profilesData, booleanData, marketMapsData, outreachData, atsBackfillData),
            savings: this.getSavingsForActivity(tool.name, profilesSavings, booleanSavings, marketMapsSavings, outreachSavings, atsBackfillSavings),
            tools: tool.tools,
            priority: tool.priority
        }));

        return { totalTimeSaved, activities };
    }

    calculateAdminResults() {
        const docCreationData = this.getAnswerData('admin_doc_creation_time');
        const dataCleanupData = this.getAnswerData('admin_data_cleanup_frequency');
        const commsData = this.getAnswerData('admin_comms_time');
        const summariesData = this.getAnswerData('admin_weekly_summaries');
        const manualTransfersData = this.getAnswerData('admin_manual_transfers');

        const docCreationSavings = docCreationData ? (docCreationData.hours * docCreationData.savingsPct / 100) : 0;
        const dataCleanupSavings = dataCleanupData ? (dataCleanupData.hours * dataCleanupData.savingsPct / 100) : 0;
        const commsSavings = commsData ? (commsData.hours * commsData.savingsPct / 100) : 0;
        const summariesSavings = summariesData ? (summariesData.hours * summariesData.savingsPct / 100) : 0;
        const manualTransfersSavings = manualTransfersData ? (manualTransfersData.hours * manualTransfersData.savingsPct / 100) : 0;

        const totalTimeSaved = docCreationSavings + dataCleanupSavings + commsSavings + summariesSavings + manualTransfersSavings;

        const activities = this.aiTools.admin.map(tool => ({
            name: tool.name,
            hours: this.getAdminHoursForActivity(tool.name, docCreationData, dataCleanupData, commsData, summariesData, manualTransfersData),
            savings: this.getAdminSavingsForActivity(tool.name, docCreationSavings, dataCleanupSavings, commsSavings, summariesSavings, manualTransfersSavings),
            tools: tool.tools,
            priority: tool.priority
        }));

        return { totalTimeSaved, activities };
    }

    calculateSchedulingResults() {
        const interviewsData = this.getAnswerData('scheduling_interviews_per_week');
        const reschedulesData = this.getAnswerData('scheduling_reschedules_per_week');
        const availabilityData = this.getAnswerData('scheduling_availability_collection');
        const autoCommunicationsData = this.getAnswerData('scheduling_auto_communications');
        const complexityData = this.getAnswerData('scheduling_multi_panel_timezone');

        const baseHours = interviewsData?.hours || 0;
        const complexityMultiplier = complexityData?.complexity || 1.0;
        const schedulingBaseSavings = (baseHours * complexityMultiplier) * 0.6;

        const reschedulesSavings = reschedulesData ? (reschedulesData.hours * reschedulesData.savingsPct / 100) : 0;
        const availabilitySavings = availabilityData ? (availabilityData.hours * availabilityData.savingsPct / 100) : 0;
        const communicationsSavings = autoCommunicationsData ? (autoCommunicationsData.hours * autoCommunicationsData.savingsPct / 100) : 0;

        const totalTimeSaved = schedulingBaseSavings + reschedulesSavings + availabilitySavings + communicationsSavings;

        const activities = this.aiTools.scheduling.map(tool => ({
            name: tool.name,
            hours: this.getSchedulingHoursForActivity(tool.name, baseHours, complexityMultiplier, reschedulesData, availabilityData, autoCommunicationsData),
            savings: this.getSchedulingSavingsForActivity(tool.name, schedulingBaseSavings, reschedulesSavings, availabilitySavings, communicationsSavings),
            tools: tool.tools,
            priority: tool.priority
        }));

        return { totalTimeSaved, activities };
    }

    calculateComplianceResults() {
        const weeklyTimeData = this.getAnswerData('compliance_weekly_time');
        const policyDigestData = this.getAnswerData('compliance_policy_digest_frequency');
        const checklistsData = this.getAnswerData('compliance_standardized_checklists');
        const auditTrailData = this.getAnswerData('compliance_audit_trail_storage');
        const evidenceData = this.getAnswerData('compliance_evidence_completeness');
        const exceptionsData = this.getAnswerData('compliance_exceptions_per_month');
        const slaData = this.getAnswerData('compliance_sla_adherence');

        const weeklyTimeSavings = weeklyTimeData ? (weeklyTimeData.hours * weeklyTimeData.savingsPct / 100) : 0;
        const policyDigestSavings = policyDigestData ? (policyDigestData.hours * policyDigestData.savingsPct / 100) : 0;
        const checklistsSavings = checklistsData ? (2 * checklistsData.savingsPct / 100) : 0;
        const auditTrailSavings = auditTrailData ? (3 * auditTrailData.savingsPct / 100) : 0;
        const evidenceSavings = evidenceData ? (4 * evidenceData.savingsPct / 100) : 0;
        const exceptionsSavings = exceptionsData ? (exceptionsData.hours * 0.6) : 0;
        const slaSavings = slaData ? (2 * slaData.savingsPct / 100) : 0;

        const totalTimeSaved = weeklyTimeSavings + policyDigestSavings + checklistsSavings + auditTrailSavings + evidenceSavings + exceptionsSavings + slaSavings;

        const activities = this.aiTools.compliance.map(tool => ({
            name: tool.name,
            hours: this.getComplianceHoursForActivity(tool.name, weeklyTimeData, policyDigestData, exceptionsData),
            savings: this.getComplianceSavingsForActivity(tool.name, weeklyTimeSavings, policyDigestSavings, checklistsSavings, auditTrailSavings, evidenceSavings, exceptionsSavings),
            tools: tool.tools,
            priority: tool.priority
        }));

        return { totalTimeSaved, activities };
    }

    calculateContractsResults() {
        const volumeData = this.getAnswerData('contracts_per_month');
        const templateVariantsData = this.getAnswerData('contracts_template_variants');
        const legalRedlinesData = this.getAnswerData('contracts_legal_redlines');
        const turnaroundData = this.getAnswerData('contracts_turnaround_time');
        const draftLocationData = this.getAnswerData('contracts_draft_location');
        const correctionsData = this.getAnswerData('contracts_returned_corrections');
        const clauseLibraryData = this.getAnswerData('contracts_clause_library');

        const baseHours = volumeData?.hours || 0;
        const complexityMultiplier = templateVariantsData?.complexity || 1.0;
        const contractCreationSavings = (baseHours * complexityMultiplier) * 0.65;

        const redlinesSavings = legalRedlinesData ? (baseHours * 0.3 * legalRedlinesData.savingsPct / 100) : 0;
        const turnaroundSavings = turnaroundData ? (baseHours * 0.2 * turnaroundData.savingsPct / 100) : 0;
        const draftLocationSavings = draftLocationData ? (baseHours * 0.25 * draftLocationData.savingsPct / 100) : 0;
        const correctionsSavings = correctionsData ? (baseHours * 0.15 * correctionsData.savingsPct / 100) : 0;
        const clauseLibrarySavings = clauseLibraryData ? (baseHours * 0.2 * clauseLibraryData.savingsPct / 100) : 0;

        const totalTimeSaved = contractCreationSavings + redlinesSavings + turnaroundSavings + draftLocationSavings + correctionsSavings + clauseLibrarySavings;

        const activities = this.aiTools.contracts.map(tool => ({
            name: tool.name,
            hours: this.getContractsHoursForActivity(tool.name, baseHours, complexityMultiplier),
            savings: this.getContractsSavingsForActivity(tool.name, contractCreationSavings, redlinesSavings, draftLocationSavings, correctionsSavings, clauseLibrarySavings, turnaroundSavings),
            tools: tool.tools,
            priority: tool.priority
        }));

        return { totalTimeSaved, activities };
    }

    getAnswerData(questionId) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) return null;
        return question.options.find(o => o.value === this.answers[questionId]);
    }

    // Helper methods for activity calculations
    getHoursForActivity(activityName, ...dataObjects) {
        const mapping = {
            'Profile Review & Screening': dataObjects[0]?.hours || 0,
            'Boolean Search & Query Building': dataObjects[1]?.hours || 0,
            'Market Mapping & Company Research': dataObjects[2]?.hours || 0,
            'Outreach Personalization': dataObjects[3]?.hours || 0,
            'ATS Data Entry & Tagging': dataObjects[4]?.hours || 0
        };
        return mapping[activityName] || 0;
    }

    getSavingsForActivity(activityName, ...savings) {
        const mapping = {
            'Profile Review & Screening': savings[0] || 0,
            'Boolean Search & Query Building': savings[1] || 0,
            'Market Mapping & Company Research': savings[2] || 0,
            'Outreach Personalization': savings[3] || 0,
            'ATS Data Entry & Tagging': savings[4] || 0
        };
        return mapping[activityName] || 0;
    }

    getAdminHoursForActivity(activityName, ...dataObjects) {
        const mapping = {
            'Document Creation & Formatting': dataObjects[0]?.hours || 0,
            'Data Cleanup & Hygiene': dataObjects[1]?.hours || 0,
            'Communications & Reporting': dataObjects[2]?.hours || 0,
            'Weekly Summary Generation': dataObjects[3]?.hours || 0,
            'System Integration & Data Transfer': dataObjects[4]?.hours || 0
        };
        return mapping[activityName] || 0;
    }

    getAdminSavingsForActivity(activityName, ...savings) {
        const mapping = {
            'Document Creation & Formatting': savings[0] || 0,
            'Data Cleanup & Hygiene': savings[1] || 0,
            'Communications & Reporting': savings[2] || 0,
            'Weekly Summary Generation': savings[3] || 0,
            'System Integration & Data Transfer': savings[4] || 0
        };
        return mapping[activityName] || 0;
    }

    getSchedulingHoursForActivity(activityName, baseHours, complexityMultiplier, ...dataObjects) {
        const mapping = {
            'Interview Scheduling Automation': baseHours * complexityMultiplier,
            'Reschedule Management': dataObjects[0]?.hours || 0,
            'Availability Collection': dataObjects[1]?.hours || 0,
            'Communication Automation': dataObjects[2]?.hours || 0,
            'Timezone & Panel Coordination': 2
        };
        return mapping[activityName] || 0;
    }

    getSchedulingSavingsForActivity(activityName, ...savings) {
        const mapping = {
            'Interview Scheduling Automation': savings[0] || 0,
            'Reschedule Management': savings[1] || 0,
            'Availability Collection': savings[2] || 0,
            'Communication Automation': savings[3] || 0,
            'Timezone & Panel Coordination': 1.5
        };
        return mapping[activityName] || 0;
    }

    getComplianceHoursForActivity(activityName, weeklyTimeData, policyDigestData, exceptionsData) {
        const mapping = {
            'Compliance Task Automation': weeklyTimeData?.hours || 0,
            'Policy Change Monitoring': policyDigestData?.hours || 0,
            'Checklist & Process Standardization': 2,
            'Audit Trail Management': 3,
            'Evidence & Documentation': 4,
            'Exception Handling': exceptionsData?.hours || 0
        };
        return mapping[activityName] || 0;
    }

    getComplianceSavingsForActivity(activityName, ...savings) {
        const mapping = {
            'Compliance Task Automation': savings[0] || 0,
            'Policy Change Monitoring': savings[1] || 0,
            'Checklist & Process Standardization': savings[2] || 0,
            'Audit Trail Management': savings[3] || 0,
            'Evidence & Documentation': savings[4] || 0,
            'Exception Handling': savings[5] || 0
        };
        return mapping[activityName] || 0;
    }

    getContractsHoursForActivity(activityName, baseHours, complexityMultiplier) {
        const mapping = {
            'Contract Generation & Templates': baseHours * complexityMultiplier,
            'Legal Review & Redlining': baseHours * 0.3,
            'Draft Management & Workflow': baseHours * 0.25,
            'Quality Control & Corrections': baseHours * 0.15,
            'Clause Library Management': baseHours * 0.2,
            'Turnaround Time Optimization': baseHours * 0.2
        };
        return mapping[activityName] || 0;
    }

    getContractsSavingsForActivity(activityName, ...savings) {
        const mapping = {
            'Contract Generation & Templates': savings[0] || 0,
            'Legal Review & Redlining': savings[1] || 0,
            'Draft Management & Workflow': savings[2] || 0,
            'Quality Control & Corrections': savings[3] || 0,
            'Clause Library Management': savings[4] || 0,
            'Turnaround Time Optimization': savings[5] || 0
        };
        return mapping[activityName] || 0;
    }

    generateInsights(businessUnit) {
        const insights = {};

        switch (businessUnit) {
            case 'sourcing':
                insights.replyRate = this.answers.sourcing_reply_rate;
                insights.qualifiedSubmitRate = this.answers.sourcing_qualified_submit;
                insights.channelsUsed = this.answers.sourcing_channels || [];
                insights.roleComplexity = this.answers.sourcing_role_seniority;
                break;
            case 'admin':
                insights.templateUsage = this.answers.admin_template_usage;
                insights.cleanupFrequency = this.answers.admin_data_cleanup_frequency;
                insights.errorSources = this.answers.admin_error_sources || [];
                insights.toolsInUse = this.answers.admin_tools_in_use || [];
                insights.manualTransfers = this.answers.admin_manual_transfers;
                insights.summaryAutomation = this.answers.admin_weekly_summaries;
                break;
            case 'scheduling':
                insights.interviewsPerWeek = this.answers.scheduling_interviews_per_week;
                insights.multiPanelTimezone = this.answers.scheduling_multi_panel_timezone;
                insights.reschedulesPerWeek = this.answers.scheduling_reschedules_per_week;
                insights.availabilityMethod = this.answers.scheduling_availability_collection;
                insights.calendarIntegration = this.answers.scheduling_calendar_integration || [];
                insights.automationLevel = this.answers.scheduling_auto_communications;
                insights.timeToSchedule = this.answers.scheduling_time_to_schedule;
                insights.noshowRate = this.answers.scheduling_noshow_rate;
                insights.topBlockers = this.answers.scheduling_top_blockers || [];
                break;
            case 'compliance':
                insights.weeklyTime = this.answers.compliance_weekly_time;
                insights.policyDigestFrequency = this.answers.compliance_policy_digest_frequency;
                insights.standardizedChecklists = this.answers.compliance_standardized_checklists;
                insights.auditTrailStorage = this.answers.compliance_audit_trail_storage;
                insights.evidenceCompleteness = this.answers.compliance_evidence_completeness;
                insights.exceptionsPerMonth = this.answers.compliance_exceptions_per_month;
                insights.slaAdherence = this.answers.compliance_sla_adherence;
                insights.failurePoints = this.answers.compliance_failure_points || [];
                break;
            case 'contracts':
                insights.contractsPerMonth = this.answers.contracts_per_month;
                insights.templateVariants = this.answers.contracts_template_variants;
                insights.legalRedlinesPercent = this.answers.contracts_legal_redlines;
                insights.turnaroundTime = this.answers.contracts_turnaround_time;
                insights.draftLocation = this.answers.contracts_draft_location;
                insights.returnedCorrections = this.answers.contracts_returned_corrections;
                insights.clauseLibrary = this.answers.contracts_clause_library;
                insights.commonDelays = this.answers.contracts_common_delays || [];
                break;
        }

        return insights;
    }

    renderResults() {
        const businessUnitLabels = {
            'sourcing': '🔍 Talent Sourcing',
            'admin': '📋 Administrative Support',
            'scheduling': '📅 Interview Scheduling',
            'compliance': '⚖️ Compliance & Legal',
            'contracts': '📄 Contract Creation'
        };

        const businessUnitLabel = businessUnitLabels[this.results.businessUnit] || this.results.businessUnit;
        const insightsHtml = this.renderInsights(this.results.businessUnit, this.results.insights);
        const priorityClass = (p) => p === 'critical' ? 'bg-red-100 text-red-700' : p === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700';

        const resultsHtml = `
            <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div class="text-center mb-12">
                    <div class="inline-block p-4 bg-green-100 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <h1 class="text-4xl font-bold text-gray-900 mb-4">Your Personalized AI Roadmap</h1>
                    <p class="text-xl text-gray-600">Tailored for ${businessUnitLabel}</p>
                </div>
                
                ${insightsHtml}
                
                <div class="grid md:grid-cols-3 gap-6 mb-12">
                    <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-3 opacity-80">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <div class="text-3xl font-bold mb-1">${this.results.totalTimeSaved} hrs</div>
                        <div class="text-indigo-100">Saved per week</div>
                    </div>
                    <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-3 opacity-80">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                        <div class="text-3xl font-bold mb-1">${this.results.monthlyTimeSaved} hrs</div>
                        <div class="text-purple-100">Saved per month</div>
                    </div>
                    <div class="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-3 opacity-80">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                        <div class="text-3xl font-bold mb-1">${this.results.yearlyTimeSaved} hrs</div>
                        <div class="text-pink-100">Saved per year</div>
                    </div>
                </div>

                ${this.transparencyEngine && this.results.assumptionDisclosure ? `
                    ${this.transparencyEngine.renderAssumptionDisclosure(this.results.assumptionDisclosure)}
                ` : ''}

                ${this.transparencyPhase2 && this.results.scenarioComparison ? `
                    ${this.transparencyPhase2.renderScenarioComparison(this.results.scenarioComparison)}
                ` : ''}

                ${this.transparencyPhase2 && this.results.assumptionAdjuster ? `
                    ${this.transparencyPhase2.renderAssumptionAdjuster(this.results.assumptionAdjuster, this.results.totalTimeSaved)}
                ` : ''}

                ${this.transparencyPhase3 && this.results.formulaExplainer ? `
                    ${this.transparencyPhase3.renderFormulaExplainer(this.results.formulaExplainer)}
                ` : ''}

                ${this.transparencyPhase3 && this.results.personalizationProof ? `
                    ${this.transparencyPhase3.renderPersonalizationProof(this.results.personalizationProof)}
                ` : ''}

                ${this.transparencyPhase3 && this.results.sourceCitations ? `
                    ${this.transparencyPhase3.renderSourceCitations(this.results.sourceCitations)}
                ` : ''}

                ${this.transparencyPhase4 && this.results.auditTrail ? `
                    ${this.transparencyPhase4.renderAuditTrail(this.results.auditTrail)}
                ` : ''}

                ${this.transparencyPhase4 && this.results.sensitivityAnalysis ? `
                    ${this.transparencyPhase4.renderSensitivityAnalysis(this.results.sensitivityAnalysis)}
                ` : ''}

                ${this.transparencyPhase4 && this.results.confidenceIntervals ? `
                    ${this.transparencyPhase4.renderConfidenceIntervals(this.results.confidenceIntervals)}
                ` : ''}

                <div class="mb-12">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Your Top AI Opportunities for ${businessUnitLabel}</h2>
                    <div class="space-y-6">
                        ${this.results.recommendations.map((rec, idx) => `
                        <div class="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
                            <div class="flex items-start justify-between mb-4">
                                <div>
                                    <div class="flex items-center gap-3 mb-2">
                                        <span class="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full font-bold">${idx + 1}</span>
                                        <h3 class="text-xl font-bold text-gray-900">${rec.name}</h3>
                                    </div>
                                    <p class="text-gray-600">Currently: <span class="font-semibold">${rec.hours} hrs/week</span> → Save: <span class="font-semibold text-green-600">${rec.savings.toFixed(1)} hrs/week</span></p>
                                </div>
                                <span class="px-3 py-1 rounded-full text-xs font-semibold ${priorityClass(rec.priority)}">${rec.priority.toUpperCase()} PRIORITY</span>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-gray-700 mb-2">Recommended AI Tools:</p>
                                <div class="flex flex-wrap gap-2">${rec.tools.map(tool => `<span class="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">${tool}</span>`).join('')}</div>
                            </div>
                        </div>`).join('')}
                    </div>
                </div>
                
                <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mb-8">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Your 30-Day ${businessUnitLabel} AI Implementation Plan</h3>
                    <div class="space-y-4">
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-20 text-center">
                                <div class="inline-block px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-bold">Week 1</div>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-900">Research & Setup</p>
                                <p class="text-gray-600 text-sm">Try free trials of your top 2 recommended tools. Set up basic automation for ${this.results.businessUnit} workflows.</p>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-20 text-center">
                                <div class="inline-block px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-bold">Week 2</div>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-900">Pilot & Refine</p>
                                <p class="text-gray-600 text-sm">Apply AI tools to your daily ${this.results.businessUnit} tasks. Track time saved and adjust workflows.</p>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-20 text-center">
                                <div class="inline-block px-3 py-1 bg-pink-600 text-white rounded-full text-sm font-bold">Week 3</div>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-900">Scale Up</p>
                                <p class="text-gray-600 text-sm">Implement AI tools across all your ${this.results.businessUnit} processes. Build templates and automation.</p>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-20 text-center">
                                <div class="inline-block px-3 py-1 bg-green-600 text-white rounded-full text-sm font-bold">Week 4</div>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-900">Optimize & Measure</p>
                                <p class="text-gray-600 text-sm">Calculate actual time saved. Share best practices with your ${this.results.businessUnit} team.</p>
                            </div>
                        </div>
                    </div>
                </div>

                ${this.results.multiDimensional && window.MultiDimensionalScorer ? `
                    ${new window.MultiDimensionalScorer().renderScorecardHTML(this.results.multiDimensional)}
                ` : ''}

                ${this.results.benchmarking && window.BenchmarkingData ? `
                    ${new window.BenchmarkingData().renderComparisonHTML(this.results.benchmarking)}
                ` : ''}

                ${this.results.explanation && window.CalculationExplainer ? `
                    ${new window.CalculationExplainer().renderExplanationHTML(this.results.explanation)}
                ` : ''}

                ${this.conditionalLogic && this.skippedQuestions && this.skippedQuestions.length > 0 ? `
                    ${this.conditionalLogic.renderConditionalExplanation(this.skippedQuestions)}
                ` : ''}

                ${this.analyticsTracker && window.AnalyticsDashboard ? `
                    ${new window.AnalyticsDashboard(this.analyticsTracker).renderCompactWidget()}
                ` : ''}

                ${this.results.archetype && window.RoleArchetypeDetector ? `
                    ${new window.RoleArchetypeDetector().renderArchetypeCard(this.results.archetype)}
                ` : ''}

                ${this.results.workflowAnalysis && window.WorkflowStageMapper ? `
                    ${new window.WorkflowStageMapper().renderWorkflowVisualization(this.results.workflowAnalysis)}
                ` : ''}

                ${this.results.crossFunctionalPains && window.CrossFunctionalPainDetector ? `
                    ${new window.CrossFunctionalPainDetector().renderCrossFunctionalPainDetection(this.results.crossFunctionalPains)}
                ` : ''}

                ${this.results.scenarioAnalyses && window.ScenarioBasedAnalyzer && this.results.scenarioAnalyses.length > 0 ? `
                    ${this.results.scenarioAnalyses.map(analysis =>
                        new window.ScenarioBasedAnalyzer().renderScenarioAnalysis(analysis)
                    ).join('')}
                ` : ''}

                ${this.results.painAnalysis && window.PainIntensityScorer ? `
                    ${new window.PainIntensityScorer().renderPainAnalysis(this.results.painAnalysis)}
                ` : ''}

                ${this.results.successMetrics && window.RoleSuccessMetrics ? `
                    ${new window.RoleSuccessMetrics().renderSuccessMetrics(this.results.successMetrics)}
                ` : ''}

                ${this.results.comparativeAnalysis && window.ComparativeRoleAnalyzer ? `
                    ${new window.ComparativeRoleAnalyzer().renderComparativeAnalysis(this.results.comparativeAnalysis)}
                ` : ''}

                ${this.results.industryPains && window.IndustryPainDetector ? `
                    ${new window.IndustryPainDetector().renderIndustryPainAnalysis(this.results.industryPains)}
                ` : ''}

                ${this.results.roleProfile && window.DynamicRoleProfiler ? `
                    ${new window.DynamicRoleProfiler().renderProfile(this.results.roleProfile)}
                ` : ''}

                ${this.results.evolution && window.RoleEvolutionTracker ? `
                    ${new window.RoleEvolutionTracker().renderEvolutionTracking(this.results.evolution)}
                ` : ''}

                <div class="text-center space-y-4 mt-8">
                    <button id="download-pdf-btn" class="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download Your ${businessUnitLabel} Roadmap (PDF)
                    </button>
                    <div><button id="start-over-btn" class="text-gray-600 hover:text-gray-900 font-medium">Start Over</button></div>
                </div>
            </div>
        `;

        this.resultsStep.innerHTML = resultsHtml;

        document.getElementById('start-over-btn').addEventListener('click', () => {
            this.answers = {};
            this.results = null;
            this.changeStep('welcome');
        });

        document.getElementById('download-pdf-btn').addEventListener('click', () => {
            this.generatePDF();
        });
    }

    renderInsights(businessUnit, insights) {
        if (!insights) return '';

        switch (businessUnit) {
            case 'sourcing':
                return this.renderSourcingInsights(insights);
            case 'admin':
                return this.renderAdminInsights(insights);
            case 'scheduling':
                return this.renderSchedulingInsights(insights);
            case 'compliance':
                return this.renderComplianceInsights(insights);
            case 'contracts':
                return this.renderContractsInsights(insights);
            default:
                return '';
        }
    }

    renderSourcingInsights(insights) {
        return `
            <div class="bg-blue-50 rounded-xl p-6 mb-8">
                <h3 class="text-lg font-bold text-blue-900 mb-4">📊 Your Sourcing Performance Insights</h3>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="font-semibold text-blue-800">Current Reply Rate:</span>
                        <span class="text-blue-700"> ${insights.replyRate || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-blue-800">Qualified Submit Rate:</span>
                        <span class="text-blue-700"> ${insights.qualifiedSubmitRate || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-blue-800">Role Complexity:</span>
                        <span class="text-blue-700"> ${insights.roleComplexity || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-blue-800">Active Channels:</span>
                        <span class="text-blue-700"> ${insights.channelsUsed.length || 0} channels</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderAdminInsights(insights) {
        const errorSourcesText = insights.errorSources.length > 0 ? insights.errorSources.join(', ') : 'Not specified';
        const toolsText = insights.toolsInUse.length > 0 ? insights.toolsInUse.length + ' tools' : 'Not specified';

        return `
            <div class="bg-purple-50 rounded-xl p-6 mb-8">
                <h3 class="text-lg font-bold text-purple-900 mb-4">📋 Your Admin Workflow Insights</h3>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="font-semibold text-purple-800">Template Usage:</span>
                        <span class="text-purple-700"> ${insights.templateUsage || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-purple-800">Data Cleanup:</span>
                        <span class="text-purple-700"> ${insights.cleanupFrequency || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-purple-800">Manual Transfers:</span>
                        <span class="text-purple-700"> ${insights.manualTransfers || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-purple-800">Tools in Stack:</span>
                        <span class="text-purple-700"> ${toolsText}</span>
                    </div>
                    <div class="md:col-span-2">
                        <span class="font-semibold text-purple-800">Common Error Sources:</span>
                        <span class="text-purple-700"> ${errorSourcesText}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderSchedulingInsights(insights) {
        const blockersText = insights.topBlockers.length > 0 ? insights.topBlockers.join(', ') : 'Not specified';
        const calendarsText = insights.calendarIntegration.length > 0 ? insights.calendarIntegration.join(', ') : 'Not specified';

        return `
            <div class="bg-green-50 rounded-xl p-6 mb-8">
                <h3 class="text-lg font-bold text-green-900 mb-4">📅 Your Scheduling Performance Insights</h3>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="font-semibold text-green-800">Interviews/Week:</span>
                        <span class="text-green-700"> ${insights.interviewsPerWeek || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-green-800">Multi-panel/Timezone:</span>
                        <span class="text-green-700"> ${insights.multiPanelTimezone || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-green-800">Reschedules/Week:</span>
                        <span class="text-green-700"> ${insights.reschedulesPerWeek || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-green-800">Time-to-Schedule:</span>
                        <span class="text-green-700"> ${insights.timeToSchedule || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-green-800">No-show Rate:</span>
                        <span class="text-green-700"> ${insights.noshowRate || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-green-800">Calendar Integration:</span>
                        <span class="text-green-700"> ${calendarsText}</span>
                    </div>
                    <div class="md:col-span-2">
                        <span class="font-semibold text-green-800">Top Blockers:</span>
                        <span class="text-green-700"> ${blockersText}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderComplianceInsights(insights) {
        const failurePointsText = insights.failurePoints.length > 0 ? insights.failurePoints.join(', ') : 'Not specified';

        return `
            <div class="bg-amber-50 rounded-xl p-6 mb-8">
                <h3 class="text-lg font-bold text-amber-900 mb-4">⚖️ Your Compliance Performance Insights</h3>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="font-semibold text-amber-800">Weekly Compliance Time:</span>
                        <span class="text-amber-700"> ${insights.weeklyTime || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-amber-800">Policy Digest Frequency:</span>
                        <span class="text-amber-700"> ${insights.policyDigestFrequency || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-amber-800">Standardized Checklists:</span>
                        <span class="text-amber-700"> ${insights.standardizedChecklists || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-amber-800">Audit Trail Storage:</span>
                        <span class="text-amber-700"> ${insights.auditTrailStorage || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-amber-800">Evidence Completeness:</span>
                        <span class="text-amber-700"> ${insights.evidenceCompleteness || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-amber-800">SLA Adherence:</span>
                        <span class="text-amber-700"> ${insights.slaAdherence || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-amber-800">Exceptions/Month:</span>
                        <span class="text-amber-700"> ${insights.exceptionsPerMonth || 'Not specified'}</span>
                    </div>
                    <div class="md:col-span-1">
                        <span class="font-semibold text-amber-800">Common Failure Points:</span>
                        <span class="text-amber-700"> ${failurePointsText}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderContractsInsights(insights) {
        const delaysText = insights.commonDelays.length > 0 ? insights.commonDelays.join(', ') : 'Not specified';

        return `
            <div class="bg-blue-50 rounded-xl p-6 mb-8">
                <h3 class="text-lg font-bold text-blue-900 mb-4">📄 Your Contract Creation Performance Insights</h3>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="font-semibold text-blue-800">Contracts/Month:</span>
                        <span class="text-blue-700"> ${insights.contractsPerMonth || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-blue-800">Template Variants:</span>
                        <span class="text-blue-700"> ${insights.templateVariants || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-blue-800">Legal Redlines:</span>
                        <span class="text-blue-700"> ${insights.legalRedlinesPercent || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-blue-800">Turnaround Time:</span>
                        <span class="text-blue-700"> ${insights.turnaroundTime || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-blue-800">Draft Location:</span>
                        <span class="text-blue-700"> ${insights.draftLocation || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-blue-800">Returned for Corrections:</span>
                        <span class="text-blue-700"> ${insights.returnedCorrections || 'Not specified'}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-blue-800">Clause Library:</span>
                        <span class="text-blue-700"> ${insights.clauseLibrary || 'Not specified'}</span>
                    </div>
                    <div class="md:col-span-1">
                        <span class="font-semibold text-blue-800">Common Delays:</span>
                        <span class="text-blue-700"> ${delaysText}</span>
                    </div>
                </div>
            </div>
        `;
    }

    generatePDF() {
        // Create a comprehensive PDF report
        const businessUnitLabels = {
            'sourcing': '🔍 Talent Sourcing',
            'admin': '📋 Administrative Support',
            'scheduling': '📅 Interview Scheduling',
            'compliance': '⚖️ Compliance & Legal',
            'contracts': '📄 Contract Creation'
        };

        const businessUnitLabel = businessUnitLabels[this.results.businessUnit] || this.results.businessUnit;
        const currentDate = new Date().toLocaleDateString();

        // Generate PDF content as HTML (for print)
        const pdfContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>AI Skills Audit Report - ${businessUnitLabel}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
                    .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #4F46E5; padding-bottom: 20px; }
                    .header h1 { color: #4F46E5; margin-bottom: 10px; }
                    .metrics { display: flex; justify-content: space-around; margin: 30px 0; }
                    .metric { text-align: center; padding: 20px; background: #F8FAFC; border-radius: 8px; }
                    .metric-value { font-size: 24px; font-weight: bold; color: #4F46E5; }
                    .recommendations { margin: 30px 0; }
                    .recommendation { margin: 20px 0; padding: 15px; border-left: 4px solid #4F46E5; background: #F8FAFC; }
                    .tools { margin: 10px 0; }
                    .tool-tag { display: inline-block; background: #E0E7FF; color: #3730A3; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 12px; }
                    .implementation-plan { margin: 30px 0; }
                    .week { margin: 15px 0; padding: 15px; background: #F1F5F9; border-radius: 8px; }
                    .insights { margin: 30px 0; background: #FEF3C7; padding: 20px; border-radius: 8px; }
                    @media print { body { margin: 20px; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>AI Skills Audit Report</h1>
                    <h2>${businessUnitLabel}</h2>
                    <p>Generated on ${currentDate}</p>
                </div>

                <div class="metrics">
                    <div class="metric">
                        <div class="metric-value">${this.results.totalTimeSaved} hrs</div>
                        <div>Saved per week</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${this.results.monthlyTimeSaved} hrs</div>
                        <div>Saved per month</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${this.results.yearlyTimeSaved} hrs</div>
                        <div>Saved per year</div>
                    </div>
                </div>

                <div class="recommendations">
                    <h2>Your Top AI Opportunities</h2>
                    ${this.results.recommendations.map((rec, idx) => `
                        <div class="recommendation">
                            <h3>${idx + 1}. ${rec.name}</h3>
                            <p><strong>Current Time:</strong> ${rec.hours} hrs/week → <strong>Potential Savings:</strong> ${rec.savings.toFixed(1)} hrs/week</p>
                            <p><strong>Priority:</strong> ${rec.priority.toUpperCase()}</p>
                            <div class="tools">
                                <strong>Recommended AI Tools:</strong><br>
                                ${rec.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="implementation-plan">
                    <h2>30-Day Implementation Plan</h2>
                    <div class="week">
                        <h3>Week 1: Research & Setup</h3>
                        <p>Try free trials of your top 2 recommended tools. Set up basic automation for ${this.results.businessUnit} workflows.</p>
                    </div>
                    <div class="week">
                        <h3>Week 2: Pilot & Refine</h3>
                        <p>Apply AI tools to your daily ${this.results.businessUnit} tasks. Track time saved and adjust workflows.</p>
                    </div>
                    <div class="week">
                        <h3>Week 3: Scale Up</h3>
                        <p>Implement AI tools across all your ${this.results.businessUnit} processes. Build templates and automation.</p>
                    </div>
                    <div class="week">
                        <h3>Week 4: Optimize & Measure</h3>
                        <p>Calculate actual time saved. Share best practices with your ${this.results.businessUnit} team.</p>
                    </div>
                </div>

                ${this.generateInsightsPDF()}

                <div style="margin-top: 40px; text-align: center; color: #6B7280; font-size: 12px;">
                    <p>Generated by GBS EMEA AI Skills Audit</p>
                    <p>For more AI tools and training, visit the GBS Learning Hub</p>
                </div>
            </body>
            </html>
        `;

        // Create and download PDF
        const printWindow = window.open('', '_blank');
        printWindow.document.write(pdfContent);
        printWindow.document.close();
        
        // Wait for content to load, then trigger print
        setTimeout(() => {
            printWindow.print();
            // Close the window after printing (optional)
            setTimeout(() => {
                printWindow.close();
            }, 1000);
        }, 500);
    }

    generateInsightsPDF() {
        if (!this.results.insights) return '';

        const insights = this.results.insights;
        let insightsHtml = '<div class="insights"><h2>Your Performance Insights</h2>';

        switch (this.results.businessUnit) {
            case 'sourcing':
                insightsHtml += `
                    <p><strong>Current Reply Rate:</strong> ${insights.replyRate || 'Not specified'}</p>
                    <p><strong>Qualified Submit Rate:</strong> ${insights.qualifiedSubmitRate || 'Not specified'}</p>
                    <p><strong>Role Complexity:</strong> ${insights.roleComplexity || 'Not specified'}</p>
                    <p><strong>Active Channels:</strong> ${insights.channelsUsed.length || 0} channels</p>
                `;
                break;
            case 'admin':
                insightsHtml += `
                    <p><strong>Template Usage:</strong> ${insights.templateUsage || 'Not specified'}</p>
                    <p><strong>Data Cleanup Frequency:</strong> ${insights.cleanupFrequency || 'Not specified'}</p>
                    <p><strong>Manual Transfers:</strong> ${insights.manualTransfers || 'Not specified'}</p>
                    <p><strong>Tools in Stack:</strong> ${insights.toolsInUse.length || 0} tools</p>
                `;
                break;
            case 'scheduling':
                insightsHtml += `
                    <p><strong>Interviews per Week:</strong> ${insights.interviewsPerWeek || 'Not specified'}</p>
                    <p><strong>Multi-panel/Timezone:</strong> ${insights.multiPanelTimezone || 'Not specified'}</p>
                    <p><strong>Reschedules per Week:</strong> ${insights.reschedulesPerWeek || 'Not specified'}</p>
                    <p><strong>Time-to-Schedule:</strong> ${insights.timeToSchedule || 'Not specified'}</p>
                `;
                break;
            case 'compliance':
                insightsHtml += `
                    <p><strong>Weekly Compliance Time:</strong> ${insights.weeklyTime || 'Not specified'}</p>
                    <p><strong>Policy Digest Frequency:</strong> ${insights.policyDigestFrequency || 'Not specified'}</p>
                    <p><strong>SLA Adherence:</strong> ${insights.slaAdherence || 'Not specified'}</p>
                    <p><strong>Exceptions per Month:</strong> ${insights.exceptionsPerMonth || 'Not specified'}</p>
                `;
                break;
            case 'contracts':
                insightsHtml += `
                    <p><strong>Contracts per Month:</strong> ${insights.contractsPerMonth || 'Not specified'}</p>
                    <p><strong>Template Variants:</strong> ${insights.templateVariants || 'Not specified'}</p>
                    <p><strong>Legal Redlines:</strong> ${insights.legalRedlinesPercent || 'Not specified'}</p>
                    <p><strong>Turnaround Time:</strong> ${insights.turnaroundTime || 'Not specified'}</p>
                `;
                break;
        }

        insightsHtml += '</div>';
        return insightsHtml;
    }

    showError(message) {
        const errorHtml = `
            <div class="max-w-2xl mx-auto text-center py-12">
                <div class="text-red-600 mb-4">
                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
                <p class="text-gray-600 mb-6">${message}</p>
                <button onclick="location.reload()" class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Try Again
                </button>
            </div>
        `;
        document.querySelector('main').innerHTML = errorHtml;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // If the enhanced audit bundle is present, it will bootstrap its own instance.
    if (typeof EnhancedAISkillsAudit !== 'undefined' && typeof GeminiAuditEnhancer !== 'undefined') {
        return;
    }

    window.auditInstance = new AISkillsAudit();
});
