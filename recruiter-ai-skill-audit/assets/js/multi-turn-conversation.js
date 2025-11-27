/**
 * Multi-Turn AI Conversation System
 * Enables conversational refinement of recommendations through follow-up questions
 */

class MultiTurnConversation {
    constructor(geminiEnhancer) {
        this.geminiEnhancer = geminiEnhancer;
        this.conversationHistory = [];
        this.clarificationAnswers = {};
        this.currentTurn = 0;
    }

    /**
     * Main conversational flow
     * Step 1: Initial insights → Step 2: Clarifying questions → Step 3: Refined recommendations
     */
    async conductConversation(enhancedContext, results) {
        try {
            // Turn 1: Generate initial insights
            const initialInsights = await this.generateInitialInsights(enhancedContext, results);
            this.conversationHistory.push({
                turn: 1,
                type: 'initial_insights',
                content: initialInsights
            });

            // Turn 2: Generate clarifying questions
            const clarifyingQuestions = await this.generateClarifyingQuestions(
                enhancedContext,
                initialInsights
            );
            this.conversationHistory.push({
                turn: 2,
                type: 'clarifying_questions',
                content: clarifyingQuestions
            });

            // Return questions for user to answer
            return {
                initialInsights,
                clarifyingQuestions,
                conversationId: this.generateConversationId()
            };

        } catch (error) {
            console.error('Multi-turn conversation error:', error);
            return null;
        }
    }

    /**
     * Process user's clarification responses and generate refined recommendations
     */
    async refineWithClarifications(clarificationAnswers) {
        this.clarificationAnswers = clarificationAnswers;

        try {
            // Turn 3: Generate refined recommendations based on clarifications
            const refinedRecommendations = await this.generateRefinedRecommendations(
                this.conversationHistory,
                clarificationAnswers
            );

            this.conversationHistory.push({
                turn: 3,
                type: 'refined_recommendations',
                content: refinedRecommendations
            });

            return refinedRecommendations;

        } catch (error) {
            console.error('Refinement error:', error);
            return null;
        }
    }

    /**
     * Step 1: Generate initial insights from enhanced context
     */
    async generateInitialInsights(enhancedContext, results) {
        const prompt = this.buildInitialInsightsPrompt(enhancedContext, results);

        try {
            const response = await this.geminiEnhancer.callGemini(prompt);

            return {
                keyFindings: this.extractKeyFindings(response),
                topOpportunities: this.extractOpportunities(response),
                riskFactors: this.extractRiskFactors(response),
                rawResponse: response
            };

        } catch (error) {
            console.error('Initial insights generation failed:', error);
            return this.generateFallbackInsights(enhancedContext);
        }
    }

    buildInitialInsightsPrompt(enhancedContext, results) {
        const { painPoints, toolGaps, workflowPatterns, environmentalContext } = enhancedContext;

        return `You are an AI adoption expert analyzing a recruiter's workflow assessment.

**User Context:**
- Business Unit: ${results.businessUnit}
- Current AI Experience: ${enhancedContext.userAnswers.aiexperience}
- Potential Time Savings: ${results.totalTimeSaved} hrs/week
- Urgency Score: ${enhancedContext.urgencyScore}/100

**Top Pain Points:**
${painPoints.slice(0, 3).map((pp, i) => `${i + 1}. [${pp.severity.toUpperCase()}] ${pp.description}`).join('\n')}

**Critical Tool Gaps:**
${toolGaps.slice(0, 3).map((gap, i) => `${i + 1}. ${gap.missing} - ${gap.impact}`).join('\n')}

**Workflow Analysis:**
- Automation Level: ${workflowPatterns.automationLevel}
- Tool Stack Maturity: ${workflowPatterns.toolStackMaturity}
- Process Standardization: ${workflowPatterns.processStandardization}

**Environmental Factors:**
- Team Size: ${environmentalContext.teamSize}
- Workload: ${environmentalContext.workload}
- Budget: ${environmentalContext.budget}

Based on this analysis, provide:

1. **Key Findings**: 3-5 critical insights about their current state
2. **Top Opportunities**: 3 specific AI implementation opportunities with highest ROI
3. **Risk Factors**: 2-3 potential challenges or blockers to watch for

Format as JSON:
{
  "keyFindings": ["finding1", "finding2", ...],
  "topOpportunities": [
    {"opportunity": "...", "impact": "...", "effort": "low/medium/high"},
    ...
  ],
  "riskFactors": [
    {"risk": "...", "mitigation": "..."},
    ...
  ]
}`;
    }

    /**
     * Step 2: Generate clarifying questions based on initial insights
     */
    async generateClarifyingQuestions(enhancedContext, initialInsights) {
        const prompt = this.buildClarifyingQuestionsPrompt(enhancedContext, initialInsights);

        try {
            const response = await this.geminiEnhancer.callGemini(prompt);
            return this.parseClarifyingQuestions(response);

        } catch (error) {
            console.error('Clarifying questions generation failed:', error);
            return this.generateFallbackQuestions(enhancedContext);
        }
    }

    buildClarifyingQuestionsPrompt(enhancedContext, initialInsights) {
        return `You are helping refine AI adoption recommendations for a recruiter.

**Initial Insights:**
${JSON.stringify(initialInsights, null, 2)}

**User Profile:**
- Business Unit: ${enhancedContext.userAnswers.businessUnit}
- AI Experience: ${enhancedContext.userAnswers.aiexperience}
- Urgency: ${enhancedContext.urgencyScore}/100

Generate 3-5 clarifying questions to better understand:
1. Their specific implementation preferences
2. Constraints or concerns not captured in the assessment
3. Priority trade-offs (speed vs. thoroughness, cost vs. features, etc.)
4. Team dynamics and adoption readiness

Format as JSON:
{
  "questions": [
    {
      "id": "clarify_1",
      "question": "Question text?",
      "type": "single_choice|multiple_choice|text",
      "options": ["Option 1", "Option 2", ...], // for choice questions
      "purpose": "Why we're asking this",
      "impactsDecision": "What this helps us decide"
    },
    ...
  ]
}

Keep questions concise and actionable. Focus on questions that will significantly impact the recommendations.`;
    }

    parseClarifyingQuestions(response) {
        try {
            // Try to extract JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return parsed.questions || [];
            }
        } catch (e) {
            console.error('Failed to parse clarifying questions:', e);
        }

        return [];
    }

    /**
     * Step 3: Generate refined recommendations based on clarifications
     */
    async generateRefinedRecommendations(conversationHistory, clarificationAnswers) {
        const prompt = this.buildRefinementPrompt(conversationHistory, clarificationAnswers);

        try {
            const response = await this.geminiEnhancer.callGemini(prompt);
            return this.parseRefinedRecommendations(response);

        } catch (error) {
            console.error('Refined recommendations generation failed:', error);
            return null;
        }
    }

    buildRefinementPrompt(conversationHistory, clarificationAnswers) {
        const initialInsights = conversationHistory.find(h => h.type === 'initial_insights')?.content;
        const questions = conversationHistory.find(h => h.type === 'clarifying_questions')?.content;

        return `You are refining AI adoption recommendations based on follow-up conversation.

**Initial Insights:**
${JSON.stringify(initialInsights, null, 2)}

**Clarifying Questions & User Answers:**
${JSON.stringify({
            questions: questions,
            answers: clarificationAnswers
        }, null, 2)}

Based on the additional context from user's clarifications, provide refined recommendations:

1. **Adjusted Implementation Plan**: Modified based on user's preferences and constraints
2. **Specific Tool Recommendations**: Exact tools to use (not just categories)
3. **Week-by-Week Action Items**: Concrete steps for next 4 weeks
4. **Success Metrics**: How to measure progress
5. **Risk Mitigation**: Specific strategies for identified concerns

Format as JSON:
{
  "implementationPlan": {
    "approach": "aggressive|moderate|conservative",
    "rationale": "Why this approach fits their situation",
    "timeline": "realistic timeline"
  },
  "toolRecommendations": [
    {
      "tool": "Specific tool name",
      "category": "sourcing|admin|scheduling|etc",
      "reason": "Why this specific tool",
      "cost": "free|budget|enterprise",
      "setupTime": "hours",
      "learningCurve": "easy|moderate|steep"
    },
    ...
  ],
  "weekByWeekPlan": {
    "week1": {
      "focus": "Main objective",
      "tasks": ["task1", "task2", ...],
      "deliverable": "What to have done by end of week"
    },
    "week2": {...},
    "week3": {...},
    "week4": {...}
  },
  "successMetrics": [
    {"metric": "...", "target": "...", "howToMeasure": "..."},
    ...
  ],
  "riskMitigation": [
    {"risk": "...", "strategy": "...", "fallback": "..."},
    ...
  ]
}

Be specific and actionable. Provide exact tool names, not just categories.`;
    }

    parseRefinedRecommendations(response) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.error('Failed to parse refined recommendations:', e);
        }

        return null;
    }

    /**
     * Fallback methods if AI calls fail
     */
    generateFallbackInsights(enhancedContext) {
        const { painPoints, toolGaps } = enhancedContext;

        return {
            keyFindings: painPoints.slice(0, 3).map(pp => pp.description),
            topOpportunities: toolGaps.slice(0, 3).map(gap => ({
                opportunity: `Implement ${gap.missing}`,
                impact: gap.impact,
                effort: gap.priority === 'immediate' ? 'high' : 'medium'
            })),
            riskFactors: [
                {
                    risk: 'Learning curve for new tools',
                    mitigation: 'Start with user-friendly AI tools and comprehensive training'
                }
            ]
        };
    }

    generateFallbackQuestions(enhancedContext) {
        const questions = [
            {
                id: 'clarify_timeline',
                question: 'How quickly do you need to see results?',
                type: 'single_choice',
                options: [
                    'This week - urgent pain points',
                    'This month - steady improvement',
                    'This quarter - strategic transformation'
                ],
                purpose: 'Determine implementation pace',
                impactsDecision: 'Quick wins vs. comprehensive transformation approach'
            },
            {
                id: 'clarify_budget',
                question: 'What\'s your budget for AI tools?',
                type: 'single_choice',
                options: [
                    'Free tools only',
                    'Up to $100/month',
                    'Up to $500/month',
                    'Enterprise budget available'
                ],
                purpose: 'Understand tool selection constraints',
                impactsDecision: 'Which specific tools to recommend'
            },
            {
                id: 'clarify_support',
                question: 'What support do you have for AI adoption?',
                type: 'single_choice',
                options: [
                    'Just me - self-directed',
                    'Team support - we\'ll learn together',
                    'Management backing - budget and time allocated',
                    'Full IT support - integration help available'
                ],
                purpose: 'Assess organizational support',
                impactsDecision: 'Complexity of recommended solutions'
            }
        ];

        // Add business unit specific questions
        if (enhancedContext.userAnswers.businessUnit === 'sourcing') {
            questions.push({
                id: 'clarify_sourcing_priority',
                question: 'What sourcing task takes most of your time?',
                type: 'single_choice',
                options: [
                    'Finding candidates (search/sourcing)',
                    'Evaluating candidates (screening/qualification)',
                    'Engaging candidates (outreach/follow-up)',
                    'Managing pipeline (tracking/organization)'
                ],
                purpose: 'Identify highest ROI activity',
                impactsDecision: 'Which AI tool to implement first'
            });
        }

        return questions;
    }

    /**
     * Helper methods
     */
    extractKeyFindings(response) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return parsed.keyFindings || [];
            }
        } catch (e) {
            console.error('Failed to extract key findings:', e);
        }
        return [];
    }

    extractOpportunities(response) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return parsed.topOpportunities || [];
            }
        } catch (e) {
            console.error('Failed to extract opportunities:', e);
        }
        return [];
    }

    extractRiskFactors(response) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return parsed.riskFactors || [];
            }
        } catch (e) {
            console.error('Failed to extract risk factors:', e);
        }
        return [];
    }

    generateConversationId() {
        return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Export conversation for analysis
     */
    exportConversation() {
        return {
            conversationId: this.generateConversationId(),
            timestamp: new Date().toISOString(),
            history: this.conversationHistory,
            clarifications: this.clarificationAnswers
        };
    }
}

/**
 * Clarification UI Handler
 * Manages the display and collection of clarifying questions
 */
class ClarificationUI {
    constructor(container) {
        this.container = container;
        this.answers = {};
        this.onComplete = null;
    }

    /**
     * Display clarifying questions to user
     */
    displayQuestions(questions, onComplete) {
        this.onComplete = onComplete;

        const html = `
            <div class="clarification-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="p-8">
                        <div class="text-center mb-6">
                            <div class="inline-block p-3 bg-purple-100 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-purple-600">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                            </div>
                            <h2 class="text-2xl font-bold text-gray-900 mb-2">Just a Few Quick Questions</h2>
                            <p class="text-gray-600">Help us refine your personalized recommendations</p>
                        </div>

                        <div class="space-y-6" id="clarifying-questions-container">
                            ${questions.map((q, idx) => this.renderQuestion(q, idx)).join('')}
                        </div>

                        <div class="mt-8 flex justify-between">
                            <button id="skip-clarifications-btn" class="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium">
                                Skip for Now
                            </button>
                            <button id="submit-clarifications-btn" class="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                                Refine My Recommendations
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.container.insertAdjacentHTML('beforeend', html);
        this.attachEventListeners(questions);
    }

    renderQuestion(question, index) {
        const { id, question: text, type, options, purpose } = question;

        if (type === 'single_choice') {
            return `
                <div class="clarification-question">
                    <div class="mb-3">
                        <h3 class="font-semibold text-gray-900 mb-1">${index + 1}. ${text}</h3>
                        <p class="text-sm text-gray-500">${purpose}</p>
                    </div>
                    <div class="space-y-2">
                        ${options.map((option, optIdx) => `
                            <label class="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
                                <input type="radio" name="${id}" value="${option}" class="mr-3 text-purple-600">
                                <span class="text-gray-700">${option}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (type === 'multiple_choice') {
            return `
                <div class="clarification-question">
                    <div class="mb-3">
                        <h3 class="font-semibold text-gray-900 mb-1">${index + 1}. ${text}</h3>
                        <p class="text-sm text-gray-500">${purpose}</p>
                    </div>
                    <div class="space-y-2">
                        ${options.map((option, optIdx) => `
                            <label class="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
                                <input type="checkbox" name="${id}" value="${option}" class="mr-3 text-purple-600">
                                <span class="text-gray-700">${option}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="clarification-question">
                    <div class="mb-3">
                        <h3 class="font-semibold text-gray-900 mb-1">${index + 1}. ${text}</h3>
                        <p class="text-sm text-gray-500">${purpose}</p>
                    </div>
                    <textarea name="${id}" rows="3" class="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none" placeholder="Your answer..."></textarea>
                </div>
            `;
        }
    }

    attachEventListeners(questions) {
        // Submit clarifications
        document.getElementById('submit-clarifications-btn').addEventListener('click', () => {
            const answers = this.collectAnswers(questions);
            this.close();
            if (this.onComplete) this.onComplete(answers);
        });

        // Skip clarifications
        document.getElementById('skip-clarifications-btn').addEventListener('click', () => {
            this.close();
            if (this.onComplete) this.onComplete({});
        });
    }

    collectAnswers(questions) {
        const answers = {};

        questions.forEach(q => {
            if (q.type === 'single_choice') {
                const selected = document.querySelector(`input[name="${q.id}"]:checked`);
                if (selected) answers[q.id] = selected.value;
            } else if (q.type === 'multiple_choice') {
                const selected = Array.from(document.querySelectorAll(`input[name="${q.id}"]:checked`));
                answers[q.id] = selected.map(s => s.value);
            } else {
                const textarea = document.querySelector(`textarea[name="${q.id}"]`);
                if (textarea) answers[q.id] = textarea.value;
            }
        });

        return answers;
    }

    close() {
        const modal = document.querySelector('.clarification-modal');
        if (modal) modal.remove();
    }
}
