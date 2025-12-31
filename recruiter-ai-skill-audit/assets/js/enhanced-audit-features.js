/**
 * Enhanced AI Skills Audit Features
 * Extends the base AISkillsAudit class with GREAT UX features
 */

class EnhancedAuditFeatures {
    constructor(auditInstance) {
        this.audit = auditInstance;
        this.startTime = Date.now();
        this.questionStartTimes = {};
        this.averageQuestionTime = 15000; // 15 seconds default
        this.currentStage = null;
        this.stages = [
            { id: 'role', name: 'Role Info', icon: '📋', questions: [] },
            { id: 'workflow', name: 'Your Workflow', icon: '🔍', questions: [] },
            { id: 'pain_points', name: 'Pain Points', icon: '🎯', questions: [] },
            { id: 'readiness', name: 'AI Readiness', icon: '🤖', questions: [] }
        ];

        this.init();
    }

    init() {
        this.categorizeQuestions();
        this.setupEnhancements();
        this.loadProgress();
        this.setupKeyboardShortcuts();
        this.setupSwipeGestures();
    }

    setupEnhancements() {
        if (!this.audit) return;

        // Ensure progress persistence is wired even if the base audit changes.
        if (typeof this.audit.proceedToNext === 'function' && !this.audit.__enhancedProceedToNextWrapped) {
            const originalProceedToNext = this.audit.proceedToNext.bind(this.audit);
            this.audit.proceedToNext = (...args) => {
                try {
                    this.saveProgress();
                } catch (e) {
                    // Non-fatal: persistence should never break the audit flow
                }
                return originalProceedToNext(...args);
            };
            this.audit.__enhancedProceedToNextWrapped = true;
        }
    }

    /**
     * 1. PROGRESSIVE DISCLOSURE ENHANCEMENTS
     */

    categorizeQuestions() {
        // Categorize questions into stages for multi-stage progress
        const roleQuestions = ['businessUnit'];
        const readinessQuestions = ['aiexperience'];

        this.audit.questions.forEach(q => {
            if (roleQuestions.includes(q.id)) {
                this.stages[0].questions.push(q.id);
            } else if (readinessQuestions.includes(q.id)) {
                this.stages[3].questions.push(q.id);
            } else if (q.id.includes('boolean') || q.id.includes('channels') || q.id.includes('tools')) {
                this.stages[2].questions.push(q.id);
            } else {
                this.stages[1].questions.push(q.id);
            }
        });
    }

    addContextBridge(previousQuestion, currentQuestion) {
        const bridges = {
            'businessUnit': 'Great! Let\'s explore your daily workflow...',
            'sourcing_active_roles': 'Now let\'s understand your sourcing volume...',
            'admin_doc_creation_time': 'Let\'s look at how you create documents...',
            'scheduling_interviews_per_week': 'Tell us about your scheduling workflow...',
            'compliance_weekly_time': 'Let\'s assess your compliance tasks...',
            'contracts_per_month': 'Now about your contract creation process...'
        };

        const bridge = bridges[currentQuestion.id];
        if (bridge) {
            return `<div class="context-bridge slide-in-up">
                <p class="text-sm text-indigo-600 font-medium mb-4">
                    <span class="inline-block mr-2">💡</span>${bridge}
                </p>
            </div>`;
        }
        return '';
    }

    addQuestionPreview(currentIndex, questions) {
        const previewCount = Math.min(3, questions.length - currentIndex - 1);
        if (previewCount === 0) return '';

        let previewHtml = '<div class="question-preview mt-6 p-4 bg-gray-50 rounded-lg">';
        previewHtml += '<p class="text-xs font-semibold text-gray-500 mb-2">COMING UP:</p>';
        previewHtml += '<div class="space-y-1">';

        for (let i = 1; i <= previewCount; i++) {
            const nextQ = questions[currentIndex + i];
            if (nextQ) {
                const shortQuestion = nextQ.question.length > 50
                    ? nextQ.question.substring(0, 50) + '...'
                    : nextQ.question;
                previewHtml += `<p class="text-xs text-gray-400">↓ ${shortQuestion}</p>`;
            }
        }

        previewHtml += '</div></div>';
        return previewHtml;
    }

    addConfidenceSlider(questionId) {
        return `
            <div class="confidence-slider mt-6 p-4 bg-blue-50 rounded-lg">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    How confident are you in this estimate?
                </label>
                <input
                    type="range"
                    id="confidence-${questionId}"
                    min="1"
                    max="5"
                    value="3"
                    class="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    aria-label="Confidence level"
                />
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Rough guess</span>
                    <span>Very confident</span>
                </div>
            </div>
        `;
    }

    addContextualHelp(question) {
        const helpContent = {
            'sourcing_active_roles': {
                why: 'Understanding your volume helps us calculate realistic time savings',
                tip: 'Count the number of open requisitions you\'re actively working on',
                benchmark: 'Most sourcers handle 5-15 roles simultaneously'
            },
            'sourcing_profiles_per_role': {
                why: 'This shows your screening workload and automation potential',
                tip: 'Check your ATS metrics or estimate based on last week',
                benchmark: 'Top performers review 30-50 profiles per role'
            }
        };

        const help = helpContent[question.id];
        if (!help) return '';

        return `
            <div class="contextual-help mt-4 space-y-2">
                ${help.why ? `<div class="help-item flex gap-2">
                    <span class="help-tooltip">
                        <span class="help-icon">?</span>
                        <div class="help-content">
                            <strong>Why we ask:</strong> ${help.why}
                        </div>
                    </span>
                    <span class="text-xs text-gray-600">${help.why}</span>
                </div>` : ''}
                ${help.tip ? `<div class="help-item flex gap-2">
                    <span class="text-lg">💡</span>
                    <span class="text-xs text-gray-600"><strong>Tip:</strong> ${help.tip}</span>
                </div>` : ''}
                ${help.benchmark ? `<div class="help-item flex gap-2">
                    <span class="text-lg">👥</span>
                    <span class="text-xs text-gray-600"><strong>Benchmark:</strong> ${help.benchmark}</span>
                </div>` : ''}
            </div>
        `;
    }

    /**
     * 2. MULTI-STAGE PROGRESS VISUALIZATION
     */

    renderMultiStageProgress() {
        const currentStage = this.getCurrentStage();

        let html = '<div class="progress-stages">';

        this.stages.forEach((stage, index) => {
            const stageProgress = this.getStageProgress(stage);
            const isActive = stage.id === currentStage?.id;
            const isCompleted = stageProgress === 100;
            const stageClass = isCompleted ? 'completed' : isActive ? 'active' : 'upcoming';

            html += `
                <div class="progress-stage ${stageClass}">
                    <div class="stage-icon">${isCompleted ? '✓' : stage.icon}</div>
                    <div class="flex-1">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-sm font-medium">${stage.name}</span>
                            <span class="text-xs text-gray-500">${Math.round(stageProgress)}%</span>
                        </div>
                        <div class="stage-progress-bar">
                            <div class="stage-progress-fill" style="width: ${stageProgress}%"></div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    getCurrentStage() {
        const relevantQuestions = this.audit.getRelevantQuestions();
        const currentQuestionIndex = relevantQuestions.findIndex(q => !this.audit.answers[q.id]);

        if (currentQuestionIndex === -1) return this.stages[this.stages.length - 1];

        const currentQuestionId = relevantQuestions[currentQuestionIndex].id;

        for (const stage of this.stages) {
            if (stage.questions.includes(currentQuestionId)) {
                return stage;
            }
        }

        return this.stages[1]; // Default to workflow stage
    }

    getStageProgress(stage) {
        if (!stage.questions.length) return 0;

        const answeredInStage = stage.questions.filter(qId => this.audit.answers[qId]).length;
        return (answeredInStage / stage.questions.length) * 100;
    }

    /**
     * 3. TIME REMAINING ESTIMATE
     */

    estimateTimeRemaining() {
        const relevantQuestions = this.audit.getRelevantQuestions();
        const answeredCount = Object.keys(this.audit.answers).filter(key =>
            relevantQuestions.find(q => q.id === key)
        ).length;
        const remainingQuestions = relevantQuestions.length - answeredCount;

        // Update average time based on actual completion time
        if (answeredCount > 0) {
            const elapsedTime = Date.now() - this.startTime;
            this.averageQuestionTime = elapsedTime / answeredCount;
        }

        const estimatedMs = remainingQuestions * this.averageQuestionTime;
        const minutes = Math.ceil(estimatedMs / 60000);

        if (minutes < 1) return 'Less than 1 minute remaining';
        if (minutes === 1) return 'About 1 minute remaining';
        return `About ${minutes} minutes remaining`;
    }

    renderTimeEstimate() {
        return `
            <div class="time-estimate">
                <span class="time-estimate-icon">⏱️</span>
                <span>${this.estimateTimeRemaining()}</span>
            </div>
        `;
    }

    /**
     * 4. MILESTONE CELEBRATIONS
     */

    checkMilestone(progress) {
        const milestones = [25, 50, 75, 100];
        const currentMilestone = milestones.find(m =>
            progress >= m && progress < m + 5
        );

        if (currentMilestone && !this.celebratedMilestones?.includes(currentMilestone)) {
            this.celebrateMilestone(currentMilestone);
            this.celebratedMilestones = this.celebratedMilestones || [];
            this.celebratedMilestones.push(currentMilestone);
        }
    }

    celebrateMilestone(milestone) {
        const messages = {
            25: { emoji: '🎉', title: 'Great Progress!', text: 'You\'re 25% done' },
            50: { emoji: '💪', title: 'Halfway There!', text: 'Your insights are taking shape' },
            75: { emoji: '🚀', title: 'Almost Done!', text: 'Just a few more questions' },
            100: { emoji: '🎊', title: 'Amazing!', text: 'Generating your personalized roadmap...' }
        };

        const msg = messages[milestone];

        // Create celebration overlay
        const celebration = document.createElement('div');
        celebration.className = 'milestone-celebration';
        celebration.innerHTML = `
            <div class="text-6xl mb-4">${msg.emoji}</div>
            <h3>${msg.title}</h3>
            <p>${msg.text}</p>
        `;

        document.body.appendChild(celebration);

        // Add confetti
        if (milestone === 50 || milestone === 100) {
            this.createConfetti();
        }

        // Remove after 2 seconds
        setTimeout(() => {
            celebration.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => celebration.remove(), 300);
        }, 2000);

        // Save progress
        this.saveProgress();
    }

    createConfetti() {
        const colors = ['#4F46E5', '#7C4DFF', '#10B981', '#F59E0B', '#EF4444'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }
    }

    /**
     * 5. ANSWER REVIEW PANEL
     */

    createReviewPanel() {
        const panel = document.createElement('div');
        panel.id = 'review-panel';
        panel.className = 'review-panel';
        panel.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-gray-900">Your Answers</h3>
                <button id="close-review" class="text-gray-500 hover:text-gray-700">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div id="review-answers-list" class="space-y-2"></div>
        `;

        const overlay = document.createElement('div');
        overlay.id = 'review-overlay';
        overlay.className = 'review-panel-overlay';

        document.body.appendChild(overlay);
        document.body.appendChild(panel);

        // Event listeners
        document.getElementById('close-review').addEventListener('click', () => {
            this.closeReviewPanel();
        });

        overlay.addEventListener('click', () => {
            this.closeReviewPanel();
        });
    }

    openReviewPanel() {
        const panel = document.getElementById('review-panel');
        const overlay = document.getElementById('review-overlay');

        // Populate answers
        this.updateReviewPanel();

        // Show panel
        panel.classList.add('open');
        overlay.classList.add('visible');
    }

    closeReviewPanel() {
        const panel = document.getElementById('review-panel');
        const overlay = document.getElementById('review-overlay');

        panel.classList.remove('open');
        overlay.classList.remove('visible');
    }

    updateReviewPanel() {
        const listEl = document.getElementById('review-answers-list');
        if (!listEl) return;

        let html = '';
        let index = 1;

        for (const [questionId, answer] of Object.entries(this.audit.answers)) {
            const question = this.audit.questions.find(q => q.id === questionId);
            if (!question) continue;

            let answerText = answer;
            if (Array.isArray(answer)) {
                answerText = answer.join(', ');
            } else if (question.options) {
                const option = question.options.find(o => o.value === answer);
                answerText = option ? option.label : answer;
            }

            html += `
                <div class="review-answer-item" data-question-id="${questionId}">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <div class="text-xs font-semibold text-gray-500 mb-1">
                                ${index}. ${question.question}
                            </div>
                            <div class="text-sm font-medium text-gray-900">${answerText}</div>
                        </div>
                        <button class="edit-icon text-indigo-600 hover:text-indigo-800">
                            ✏️
                        </button>
                    </div>
                </div>
            `;
            index++;
        }

        listEl.innerHTML = html || '<p class="text-sm text-gray-500">No answers yet</p>';
    }

    /**
     * 6. PROGRESS PERSISTENCE
     */

    saveProgress() {
        const progress = {
            answers: this.audit.answers,
            timestamp: Date.now(),
            celebratedMilestones: this.celebratedMilestones || []
        };

        try {
            localStorage.setItem('aiAuditProgress', JSON.stringify(progress));
        } catch (e) {
            console.warn('Could not save progress:', e);
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('aiAuditProgress');
            if (saved) {
                const progress = JSON.parse(saved);

                // Check if saved less than 24 hours ago
                const age = Date.now() - progress.timestamp;
                if (age < 24 * 60 * 60 * 1000) {
                    this.audit.answers = progress.answers || {};
                    this.celebratedMilestones = progress.celebratedMilestones || [];
                    return true;
                }
            }
        } catch (e) {
            console.warn('Could not load progress:', e);
        }
        return false;
    }

    clearProgress() {
        try {
            localStorage.removeItem('aiAuditProgress');
        } catch (e) {
            console.warn('Could not clear progress:', e);
        }
    }

    /**
     * 7. KEYBOARD SHORTCUTS
     */

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger if typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch(e.key) {
                case 'ArrowRight':
                case 'Enter':
                    // Select first option (for single choice)
                    const firstOption = document.querySelector('.question-option');
                    if (firstOption) firstOption.click();
                    break;

                case 'ArrowLeft':
                    // Go back
                    const backBtn = document.getElementById('back-btn');
                    if (backBtn) backBtn.click();
                    break;

                case 'r':
                case 'R':
                    // Open review panel
                    if (!document.getElementById('review-panel')) {
                        this.createReviewPanel();
                    }
                    this.openReviewPanel();
                    break;

                case 'Escape':
                    // Close review panel
                    this.closeReviewPanel();
                    break;
            }
        });
    }

    /**
     * 8. SWIPE GESTURES (Mobile)
     */

    setupSwipeGestures() {
        let touchStartX = 0;
        let touchEndX = 0;

        const questionCard = document.getElementById('question-card');
        if (!questionCard) return;

        questionCard.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        questionCard.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) < swipeThreshold) return;

            if (diff > 0) {
                // Swiped left - go forward (do nothing, user should select option)
            } else {
                // Swiped right - go back
                const backBtn = document.getElementById('back-btn');
                if (backBtn) backBtn.click();
            }
        };

        this.handleSwipe = handleSwipe;
    }

    /**
     * 9. SMART TRANSITIONS
     */

    transitionToNextQuestion(exitDirection = 'left') {
        const card = document.getElementById('question-card');
        if (!card) return;

        // Exit animation
        card.classList.add(exitDirection === 'left' ? 'exit-left' : 'exit-right');

        setTimeout(() => {
            // Remove animation class
            card.classList.remove('exit-left', 'exit-right');

            // Render next question (this happens in the audit class)
            // Add entry animation
            card.classList.add('slide-in-right');
            setTimeout(() => {
                card.classList.remove('slide-in-right');
            }, 300);
        }, 300);
    }

    /**
     * 10. ENHANCED VISUAL FEEDBACK
     */

    addLoadingState(element, message = 'Loading...') {
        element.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12">
                <div class="spinner mb-4"></div>
                <p class="text-gray-600">${message}</p>
            </div>
        `;
    }

    addSuccessState(element, message) {
        element.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12">
                <div class="text-green-500 text-6xl mb-4">✓</div>
                <p class="text-gray-900 font-semibold">${message}</p>
            </div>
        `;
    }

    addErrorState(element, message) {
        element.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 shake">
                <div class="text-red-500 text-6xl mb-4">⚠️</div>
                <p class="text-gray-900 font-semibold">${message}</p>
                <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Try Again
                </button>
            </div>
        `;
    }
}

// Initialize enhanced features when audit is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for audit instance to be created
    setTimeout(() => {
        if (window.auditInstance) {
            window.enhancedFeatures = new EnhancedAuditFeatures(window.auditInstance);
        }
    }, 100);
});
