class Tour {
    constructor() {
        this.tourOverlay = document.querySelector('.tour-overlay');
        this.tourHighlight = document.querySelector('.tour-highlight');
        this.tourPopover = document.querySelector('.tour-popover');
        this.replayBtn = document.getElementById('replay-tour-btn');

        this.currentStep = -1;
        this.steps = [
            {
                selector: 'header h1',
                title: 'Welcome to the Learning Hub!',
                description: 'This is your central portal for AI training, tools, and resources. Let\'s take a quick 30-second tour of the key features.',
                placement: 'bottom'
            },
            {
                selector: '#global-search',
                title: 'Universal Search',
                description: 'Use this powerful search bar to find anything you need across all modules, from specific lessons to prompt examples.',
                placement: 'bottom'
            },
            {
                selector: 'a[href="/gbs-prompts/"]',
                title: 'GBS AI Prompts Library',
                description: 'Access a comprehensive library of expert-crafted prompts to accelerate your daily tasks and projects.',
                placement: 'top'
            },
            {
                selector: 'a[href="/daily-focus/"]',
                title: 'Daily Sourcing Focus',
                description: 'Sharpen your skills with this micro-coaching tool, offering daily actionable cards for talent sourcers.',
                placement: 'top'
            },
            {
                selector: '.hub-button, .back-to-hub-btn', // Generic selector for back button
                title: 'Return to Hub',
                description: 'Whenever you\'re in a sub-module, look for a "Back to Hub" button to easily return to this main page.',
                placement: 'bottom-start'
            },
            {
                selector: '#replay-tour-btn',
                title: 'Tour Complete!',
                description: 'You can retake this tour anytime by clicking this button. Enjoy exploring the Learning Hub!',
                placement: 'top'
            }
        ];
    }

    init() {
        this.tourPopover.querySelector('.tour-btn-next').addEventListener('click', () => this.nextStep());
        this.tourPopover.querySelector('.tour-btn-skip').addEventListener('click', () => this.endTour());
        this.tourOverlay.addEventListener('click', () => this.endTour());
        this.replayBtn.addEventListener('click', () => this.startTour(true));

        window.addEventListener('keydown', (e) => {
            if (!this.tourOverlay.classList.contains('active')) return;
            if (e.key === 'Escape') this.endTour();
            if (e.key === 'ArrowRight') this.nextStep();
            if (e.key === 'ArrowLeft') this.prevStep();
        });

        // Auto-start for first-time visitors
        if (!localStorage.getItem('gbsHubTourCompleted')) {
            setTimeout(() => this.startTour(), 500);
        }
    }

    startTour(force = false) {
        if (!force && localStorage.getItem('gbsHubTourCompleted')) return;

        this.currentStep = -1;
        this.tourOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.nextStep();
    }

    nextStep() {
        this.currentStep++;
        if (this.currentStep >= this.steps.length) {
            this.endTour();
            return;
        }
        this.showStep(this.currentStep);
    }

    prevStep() {
        this.currentStep--;
        if (this.currentStep < 0) {
            this.endTour();
            return;
        }
        this.showStep(this.currentStep);
    }

    showStep(index) {
        const step = this.steps[index];
        const targetElement = document.querySelector(step.selector);

        if (!targetElement) {
            // If element not found, try the next one or end tour
            this.nextStep();
            return;
        }

        // Update popover content
        this.tourPopover.querySelector('.tour-popover-title').textContent = step.title;
        this.tourPopover.querySelector('p').textContent = step.description;
        this.tourPopover.querySelector('.tour-progress').textContent = `${index + 1} / ${this.steps.length}`;

        const nextBtn = this.tourPopover.querySelector('.tour-btn-next');
        if (index === this.steps.length - 1) {
            nextBtn.textContent = 'Finish';
        } else {
            nextBtn.textContent = 'Next';
        }

        // Position highlight and popover
        const rect = targetElement.getBoundingClientRect();

        this.tourHighlight.style.width = `${rect.width + 8}px`;
        this.tourHighlight.style.height = `${rect.height + 8}px`;
        this.tourHighlight.style.top = `${rect.top - 4 + window.scrollY}px`;
        this.tourHighlight.style.left = `${rect.left - 4 + window.scrollX}px`;

        this.tourPopover.classList.add('active');
        this.positionPopover(targetElement, step.placement);

        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    positionPopover(target, placement) {
        const targetRect = target.getBoundingClientRect();
        const popoverRect = this.tourPopover.getBoundingClientRect();
        const arrow = this.tourPopover.querySelector('.tour-popover-arrow');
        let top, left;

        const offset = 12; // Distance between popover and highlight

        switch (placement) {
            case 'top':
                top = targetRect.top - popoverRect.height - offset;
                left = targetRect.left + (targetRect.width / 2) - (popoverRect.width / 2);
                break;
            case 'bottom':
                top = targetRect.bottom + offset;
                left = targetRect.left + (targetRect.width / 2) - (popoverRect.width / 2);
                break;
            case 'left':
                top = targetRect.top + (targetRect.height / 2) - (popoverRect.height / 2);
                left = targetRect.left - popoverRect.width - offset;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height / 2) - (popoverRect.height / 2);
                left = targetRect.right + offset;
                break;
             case 'bottom-start':
                top = targetRect.bottom + offset;
                left = targetRect.left;
                break;
        }

        // Adjust for screen boundaries
        if (left < 10) left = 10;
        if ((left + popoverRect.width) > window.innerWidth - 10) {
            left = window.innerWidth - popoverRect.width - 10;
        }
        if (top < 10) top = 10;
        if ((top + popoverRect.height) > window.innerHeight - 10) {
            top = window.innerHeight - popoverRect.height - 10;
        }

        this.tourPopover.style.top = `${top + window.scrollY}px`;
        this.tourPopover.style.left = `${left + window.scrollX}px`;
        this.tourPopover.dataset.placement = placement;
    }


    endTour() {
        this.tourOverlay.classList.remove('active');
        this.tourPopover.classList.remove('active');
        this.tourHighlight.style.width = '0'; // Hide highlight
        document.body.style.overflow = '';
        localStorage.setItem('gbsHubTourCompleted', 'true');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // A small delay to ensure all elements are rendered, especially from other scripts
    setTimeout(() => {
        const tour = new Tour();
        tour.init();
    }, 100);
});
