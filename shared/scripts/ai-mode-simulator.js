/**
 * Google AI Mode Simulator
 * Handles typing animations, fan-out visualizations, and clipboard interactions.
 */

// Master prompt used by the "Copy Prefix" button
const MASTER_PROMPT = [
    'Act as a recruitment & sourcing strategist for EMEA pharma / life sciences.',
    "I'm a team lead at a global RPO.",
    'When I ask you about roles, companies or markets, always:',
    '',
    'Use fresh web data (last 30 days where possible),',
    'Show bullet-point insights,',
    'Add links to real job ads or sources,',
    'Highlight "so what?" for sourcing: channels, keywords, risks, and opportunities.'
].join('\n');

// Scenario copy for the simulator animation
const SCENARIOS = {
    snapshot: {
        prompt: 'Act as my sourcing partner. I need to fill a [ROLE TITLE] in [REGION]... Summarise core skills, list 10-15 job titles, suggested Boolean strings...',
        steps: ['Scanning live job ads...', 'Analyzing skills frequency...', 'Generating search strings...', 'Identifying market risks...']
    },
    competitor: {
        prompt: 'You are my talent intelligence analyst. Map main employers for [ROLE]... Show seniority levels, tech stack... End with 3 high-probability targets...',
        steps: ['Locating key employers...', 'Analyzing career pages...', 'Checking layoff/growth news...', 'Selecting top targets...']
    },
    salary: {
        prompt: 'Help me sanity-check compensation. What are typical salary ranges for [ROLE] with [X] years experience? Output low/mid/high ranges and how I should frame expectations...',
        steps: ['Aggregating salary data...', 'Checking local forums...', 'Calculating percentile ranges...', 'Drafting negotiation scripts...']
    },
    outreach: {
        prompt: 'Find 5-10 top-performing LinkedIn posts about [TOPIC] from last 60 days. Summarise the angle/hook and why people engage. Then generate 5 new post ideas...',
        steps: ['Scanning LinkedIn trends...', 'Analyzing engagement metrics...', 'Extracting viral hooks...', 'Generating new concepts...']
    },
    persona: {
        prompt: 'Build a candidate persona for [ROLE]. Use public data: blogs, Reddit, StackExchange. Summarise: What they care about, frustrations with recruiters, red flag phrases...',
        steps: ['Reading developer forums...', 'Identifying pain points...', 'Mapping motivators...', 'Listing recruiter anti-patterns...']
    },
    sourcing: {
        prompt: 'Find top [ROLE] in [LOCATION]. Break into sub-searches by specific skill sets and visualize a comparison chart...',
        steps: ['Fan-out: LinkedIn Search', 'Fan-out: GitHub Repos', 'Fan-out: Local Meetups', 'Synthesizing talent map...']
    }
};

function init() {
    initMasterPrompt();
    initSimulator();
    initPromptCards();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function initMasterPrompt() {
    const copyBtn = document.getElementById('copy-master-btn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => copyToClipboard(MASTER_PROMPT, copyBtn));
}

function initSimulator() {
    const inputDisplay = document.getElementById('ai-simulator-input');
    const fanOutDisplay = document.getElementById('fan-out-display');
    const chips = document.querySelectorAll('#simulator-chips button');
    if (!inputDisplay || !fanOutDisplay || !chips.length) return;

    let activeRunId = 0;

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            activeRunId += 1;
            const runId = activeRunId;
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const scenarioKey = chip.getAttribute('data-scenario');
            const scenario = scenarioKey ? SCENARIOS[scenarioKey] : null;
            if (!scenario) return;

            inputDisplay.textContent = '';
            inputDisplay.classList.add('typing-cursor');
            fanOutDisplay.innerHTML = '<div class="text-xs text-gray-400 uppercase tracking-widest text-center mb-4">AI Reasoning & Fan-Out</div><div class="flex flex-col gap-3"></div>';
            fanOutDisplay.classList.add('hidden');

            typeText(inputDisplay, scenario.prompt, 20, () => runId === activeRunId, () => {
                if (runId !== activeRunId) return;
                inputDisplay.classList.remove('typing-cursor');
                startFanOutAnimation(fanOutDisplay, scenario.steps, () => runId === activeRunId);
            });
        });
    });
}

function typeText(element, text, speed, isActive, callback) {
    let i = 0;
    function type() {
        if (typeof isActive === 'function' && !isActive()) return;
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i += 1;
            setTimeout(type, speed);
            return;
        }
        if (callback) callback();
    }
    type();
}

function startFanOutAnimation(container, steps, isActive) {
    container.classList.remove('hidden');
    const listContainer = container.querySelector('.flex');
    if (!listContainer) return;

    steps.forEach((step, index) => {
        setTimeout(() => {
            if (typeof isActive === 'function' && !isActive()) return;
            const node = document.createElement('div');
            node.className = 'fan-out-node bg-[#3c4043] p-3 rounded-lg border border-gray-600 text-sm text-gray-300 flex items-center shadow-lg';
            node.innerHTML = `
                <span class="mr-3 text-blue-400">›</span>
                <span>${step}</span>
                <span class="ml-auto text-green-400 text-xs">Done</span>
            `;
            listContainer.appendChild(node);
            void node.offsetWidth; // reflow for transition
            node.classList.add('visible');
        }, index * 800);
    });
}

function initPromptCards() {
    const copyBtns = document.querySelectorAll('.copy-prompt-btn');
    if (!copyBtns.length) return;

    copyBtns.forEach(btn => {
        btn.addEventListener('click', event => {
            const target = event.currentTarget;
            const prompt = target.getAttribute('data-prompt');
            if (!prompt) return;
            copyToClipboard(prompt, target);
        });
    });
}

async function copyToClipboard(text, button) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }

        const originalContent = button.innerHTML;
        const width = button.offsetWidth;

        button.style.width = `${width}px`;
        button.innerHTML = '<span class="mr-1">✅</span> Copied';
        button.classList.add('text-green-600', 'bg-green-50');

        if ('UINotifications' in window && typeof window.UINotifications.success === 'function') {
            window.UINotifications.success('Prompt copied to clipboard!');
        }

        setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove('text-green-600', 'bg-green-50');
            button.style.width = '';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        if ('UINotifications' in window && typeof window.UINotifications.error === 'function') {
            window.UINotifications.error('Failed to copy to clipboard');
        }
    }
}
