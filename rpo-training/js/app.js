document.addEventListener('DOMContentLoaded', () => {
    const mainPage = document.getElementById('main-page');
    const sessionContainer = document.getElementById('session-container');
    const headerTitle = document.getElementById('header-title');
    const copyrightYear = document.getElementById('copyright-year');

    const moduleTitles = {
        'module-1': 'Module 1: Prompting & Writing - The C.R.E.A.T.E. Framework',
        'module-2': 'Module 2: Sourcing & Research',
        'module-3': 'Module 3: Data & Knowledge',
        'module-4': 'Module 4: Automation',
        'module-5': 'Module 5: Train the Trainer',
        'module-6': 'Module 6: Strategy & Governance',
        'module-7': 'Module 7: Measuring Impact'
    };

    const pageTitles = {
        'main-page': 'RPO AI Acceleration Program',
        'session-1-1-page': 'Session 1.1: Prompt Engineering 101',
        'session-1-2-page': 'Session 1.2: AI-Powered Email Lab',
        'session-1-3-page': 'Session 1.3: Success Spotlight & Clinic',
        'session-2-1-page': 'Session 2.1: AI for Advanced Sourcing',
        'session-2-2-page': 'Session 2.2: The Randstad AI Toolkit',
        'session-2-3-page': 'Session 2.3: Responsible AI & Showcase',
        'session-3-1-page': 'Session 3.1: Data Insights in Sheets',
        'session-3-2-page': 'Session 3.2: Building a Knowledge Base',
        'session-4-1-page': 'Session 4.1: Intro to Automation',
        'session-5-1-page': 'Session 5.1: Becoming an AI Champion',
        'session-5-2-page': 'Session 5.2: Capstone Project Showcase',
        'session-6-1-page': 'Session 6.1: Developing an AI Roadmap',
        'session-7-1-page': 'Session 7.1: The ROI of AI in Recruiting'
    };

    // Allow direct linking to module views using hash (e.g., #module-1)
    Object.entries(moduleTitles).forEach(([id, title]) => {
        pageTitles[id] = title;
    });

    function setRpoBreadcrumb(moduleId) {
        const ol = document.querySelector('.breadcrumb-nav ol');
        if (!ol) return;

        if (!moduleId) {
            ol.innerHTML = `
                <li class="breadcrumb-item">
                    <a href="../index.html" class="breadcrumb-link" aria-label="Go to Home">
                        <span class="breadcrumb-icon icon-home"></span>
                        <span>Home</span>
                    </a>
                </li>
                <li class="breadcrumb-separator" aria-hidden="true">></li>
                <li class="breadcrumb-item">
                    <span class="breadcrumb-current" aria-current="page">
                        <span class="breadcrumb-icon icon-folder"></span>
                        <span>RPO Training</span>
                    </span>
                </li>`;
            return;
        }

        const full = moduleTitles[moduleId] || moduleId;
        const short = (full.split(':')[0] || full).trim();

        ol.innerHTML = `
            <li class="breadcrumb-item">
                <a href="../index.html" class="breadcrumb-link" aria-label="Go to Home">
                    <span class="breadcrumb-icon icon-home"></span>
                    <span>Home</span>
                </a>
            </li>
            <li class="breadcrumb-separator" aria-hidden="true">></li>
            <li class="breadcrumb-item">
                <a href="/rpo-training/index.html" class="breadcrumb-link" aria-label="Go to RPO Training">
                    <span class="breadcrumb-icon icon-folder"></span>
                    <span>RPO Training</span>
                </a>
            </li>
            <li class="breadcrumb-separator" aria-hidden="true">></li>
            <li class="breadcrumb-item">
                <span class="breadcrumb-current" aria-current="page">
                    <span class="breadcrumb-icon icon-book"></span>
                    <span>${short}</span>
                </span>
            </li>`;
    }

    // Session descriptions for enhanced preview
    const sessionDescriptions = {
        'session-1-1-page': {
            description: 'Master the C.R.E.A.T.E. framework for crafting precise, effective AI prompts. Learn to transform simple questions into expert commands.',
            duration: '25 min',
            topics: ['Character & Role Setting', 'Request Structuring', 'Examples & Context', 'Output Formatting']
        },
        'session-1-2-page': {
            description: 'Hands-on email enhancement lab. Transform your recruitment emails with AI assistance and see real before/after examples.',
            duration: '30 min',
            topics: ['Email Templates', 'Personalization Techniques', 'Subject Line Optimization', 'Follow-up Strategies']
        },
        'session-1-3-page': {
            description: 'Success stories, troubleshooting clinic, and Q&A. Get help with your specific prompting challenges and see real-world applications.',
            duration: '20 min',
            topics: ['Success Case Studies', 'Common Mistakes', 'Troubleshooting Tips', 'Q&A Session']
        },
        'session-2-1-page': {
            description: 'Master advanced AI-powered sourcing techniques. Learn to find passive candidates, build complex Boolean searches, and leverage AI for talent discovery.',
            duration: '35 min',
            topics: ['Boolean Search Mastery', 'Passive Candidate Sourcing', 'AI Search Strategies', 'Platform Optimization']
        },
        'session-2-2-page': {
            description: 'Explore Randstad\'s proprietary AI toolkit and advanced sourcing technologies. Hands-on practice with cutting-edge recruitment tools.',
            duration: '30 min',
            topics: ['Randstad AI Tools', 'Advanced Analytics', 'Automation Features', 'Integration Workflows']
        },
        'session-2-3-page': {
            description: 'Learn responsible AI practices, bias mitigation, and showcase your sourcing projects. Ethical considerations and best practices.',
            duration: '25 min',
            topics: ['AI Ethics', 'Bias Prevention', 'Compliance Guidelines', 'Project Showcase']
        },
        'session-3-1-page': {
            description: 'Transform raw recruitment data into actionable insights using AI-powered analytics in Google Sheets. Learn to create dynamic dashboards and reports.',
            duration: '40 min',
            topics: ['Data Analysis Techniques', 'AI Formulas in Sheets', 'Dashboard Creation', 'Trend Identification']
        },
        'session-3-2-page': {
            description: 'Build an intelligent "CV Bot" knowledge base that can search, analyze, and extract insights from candidate documents and company data.',
            duration: '45 min',
            topics: ['Knowledge Base Design', 'Document Processing', 'AI Search Functions', 'Data Organization']
        },
        'session-4-1-page': {
            description: 'Build hands-free workflows that connect Gmail, AI, and Google Sheets. Learn to create automated recruitment processes that work 24/7.',
            duration: '50 min',
            topics: ['Workflow Design', 'Gmail Integration', 'AI Automation', 'Process Optimization', 'Error Handling']
        },
        'session-5-1-page': {
            description: 'Develop the skills to mentor colleagues and become an AI champion in your organization. Learn training methodologies and change management.',
            duration: '40 min',
            topics: ['Training Design', 'Adult Learning Principles', 'Change Management', 'Mentoring Skills', 'Knowledge Transfer']
        },
        'session-5-2-page': {
            description: 'Present your AI projects to leadership and stakeholders. Learn to build compelling business cases and demonstrate ROI effectively.',
            duration: '35 min',
            topics: ['Presentation Skills', 'Business Case Development', 'ROI Demonstration', 'Stakeholder Engagement', 'Project Showcase']
        },
        'session-6-1-page': {
            description: 'Develop a comprehensive AI roadmap for your RPO organization. Learn strategic planning, governance frameworks, and how to prioritize high-impact AI projects.',
            duration: '60 min',
            topics: ['Strategic Planning', 'AI Governance', 'Risk Management', 'Project Prioritization', 'Roadmap Development', 'Compliance Frameworks']
        },
        'session-7-1-page': {
            description: 'Master the art of measuring and demonstrating AI ROI in recruitment. Learn to define success metrics, build compelling business cases, and communicate value to stakeholders.',
            duration: '55 min',
            topics: ['ROI Calculation', 'KPI Development', 'Business Case Creation', 'Value Communication', 'Performance Analytics', 'Stakeholder Reporting']
        }
    };

    function showSessionMenu(moduleId) {
        const moduleNum = moduleId.split('-')[1];
        const sessions = Object.keys(pageTitles)
            .filter(key => key.startsWith(`session-${moduleNum}-`))
            .map(key => ({
                id: key,
                title: pageTitles[key],
                description: sessionDescriptions[key]
            }));

        let menuHtml = `
            <div class="content-section">
                <button onclick="navigateTo('main-page')" class="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    &larr; Back to All Modules
                </button>
                <h2 class="google-sans text-3xl font-bold text-gray-800">${moduleTitles[moduleId]}</h2>
                <p class="mt-2 text-lg text-gray-600">Select a session to begin.</p>
        `;

        // Add framework overview for Module 1
        if (moduleId === 'module-1') {
            menuHtml += `
                <div class="mt-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <h3 class="google-sans text-lg font-bold text-blue-800 mb-3">🎯 The C.R.E.A.T.E. Framework</h3>
                    <div class="grid md:grid-cols-6 gap-3 text-sm">
                        <div class="text-center">
                            <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">C</div>
                            <div class="font-semibold text-blue-800">Character</div>
                            <div class="text-blue-600">Set the role</div>
                        </div>
                        <div class="text-center">
                            <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">R</div>
                            <div class="font-semibold text-blue-800">Request</div>
                            <div class="text-blue-600">Clear task</div>
                        </div>
                        <div class="text-center">
                            <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">E</div>
                            <div class="font-semibold text-blue-800">Examples</div>
                            <div class="text-blue-600">Show context</div>
                        </div>
                        <div class="text-center">
                            <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">A</div>
                            <div class="font-semibold text-blue-800">Additions</div>
                            <div class="text-blue-600">Extra details</div>
                        </div>
                        <div class="text-center">
                            <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">T</div>
                            <div class="font-semibold text-blue-800">Type</div>
                            <div class="text-blue-600">Output format</div>
                        </div>
                        <div class="text-center">
                            <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">E</div>
                            <div class="font-semibold text-blue-800">Extras</div>
                            <div class="text-blue-600">Final touches</div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Add sourcing methodology overview for Module 2
        if (moduleId === 'module-2') {
            menuHtml += `
                <div class="mt-6 mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <h3 class="google-sans text-lg font-bold text-green-800 mb-3">🔍 AI-Powered Sourcing Methodology</h3>
                    <div class="grid md:grid-cols-4 gap-4 text-sm">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🎯</div>
                            <div class="font-semibold text-green-800">Identify</div>
                            <div class="text-green-600">Define target profiles and skill requirements</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🔍</div>
                            <div class="font-semibold text-green-800">Search</div>
                            <div class="text-green-600">Advanced Boolean and AI-powered discovery</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">📊</div>
                            <div class="font-semibold text-green-800">Analyze</div>
                            <div class="text-green-600">Evaluate candidates with AI insights</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🤝</div>
                            <div class="font-semibold text-green-800">Engage</div>
                            <div class="text-green-600">Personalized outreach and relationship building</div>
                        </div>
                    </div>
                    <div class="mt-4 bg-white rounded-lg p-4 border border-green-200">
                        <div class="flex items-center justify-center space-x-6 text-xs text-green-700">
                            <div class="flex items-center">
                                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                <span>LinkedIn Advanced Search</span>
                            </div>
                            <div class="flex items-center">
                                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                <span>Boolean Query Builder</span>
                            </div>
                            <div class="flex items-center">
                                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                <span>AI Profile Analysis</span>
                            </div>
                            <div class="flex items-center">
                                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                <span>Automated Outreach</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Add data methodology overview for Module 3
        if (moduleId === 'module-3') {
            menuHtml += `
                <div class="mt-6 mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
                    <h3 class="google-sans text-lg font-bold text-purple-800 mb-3">📊 Data-Driven Intelligence Framework</h3>
                    <div class="grid md:grid-cols-5 gap-3 text-sm">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">📥</div>
                            <div class="font-semibold text-purple-800">Collect</div>
                            <div class="text-purple-600">Gather recruitment data from multiple sources</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🔄</div>
                            <div class="font-semibold text-purple-800">Process</div>
                            <div class="text-purple-600">Clean and structure data with AI assistance</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">📈</div>
                            <div class="font-semibold text-purple-800">Analyze</div>
                            <div class="text-purple-600">Extract insights and identify patterns</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">📋</div>
                            <div class="font-semibold text-purple-800">Visualize</div>
                            <div class="text-purple-600">Create dashboards and reports</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🎯</div>
                            <div class="font-semibold text-purple-800">Act</div>
                            <div class="text-purple-600">Make data-driven recruitment decisions</div>
                        </div>
                    </div>
                    <div class="mt-4 grid md:grid-cols-2 gap-4">
                        <div class="bg-white rounded-lg p-4 border border-purple-200">
                            <h4 class="font-semibold text-purple-800 mb-2">📊 Analytics Tools</h4>
                            <div class="space-y-1 text-xs text-purple-700">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                    <span>Google Sheets AI Functions</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                    <span>Dynamic Dashboard Creation</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                    <span>Predictive Analytics</span>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg p-4 border border-purple-200">
                            <h4 class="font-semibold text-purple-800 mb-2">🤖 CV Bot Features</h4>
                            <div class="space-y-1 text-xs text-purple-700">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                    <span>Intelligent Document Search</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                    <span>Skill Extraction & Matching</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                    <span>Automated Candidate Ranking</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Add automation methodology overview for Module 4
        if (moduleId === 'module-4') {
            menuHtml += `
                <div class="mt-6 mb-8 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                    <h3 class="google-sans text-lg font-bold text-orange-800 mb-3">⚡ Intelligent Automation Framework</h3>
                    <div class="grid md:grid-cols-6 gap-3 text-sm">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🎯</div>
                            <div class="font-semibold text-orange-800">Trigger</div>
                            <div class="text-orange-600">Email, form, or schedule-based activation</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🔍</div>
                            <div class="font-semibold text-orange-800">Process</div>
                            <div class="text-orange-600">AI analyzes and extracts key information</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🤖</div>
                            <div class="font-semibold text-orange-800">Decide</div>
                            <div class="text-orange-600">Smart routing and decision logic</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">⚡</div>
                            <div class="font-semibold text-orange-800">Execute</div>
                            <div class="text-orange-600">Automated actions across platforms</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">📊</div>
                            <div class="font-semibold text-orange-800">Track</div>
                            <div class="text-orange-600">Monitor performance and outcomes</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🔄</div>
                            <div class="font-semibold text-orange-800">Optimize</div>
                            <div class="text-orange-600">Continuous improvement and learning</div>
                        </div>
                    </div>
                    <div class="mt-4 grid md:grid-cols-3 gap-4">
                        <div class="bg-white rounded-lg p-4 border border-orange-200">
                            <h4 class="font-semibold text-orange-800 mb-2">📧 Email Automation</h4>
                            <div class="space-y-1 text-xs text-orange-700">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                    <span>Auto-response Systems</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                    <span>Candidate Follow-ups</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                    <span>Interview Scheduling</span>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg p-4 border border-orange-200">
                            <h4 class="font-semibold text-orange-800 mb-2">📊 Data Workflows</h4>
                            <div class="space-y-1 text-xs text-orange-700">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                    <span>Candidate Data Entry</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                    <span>Report Generation</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                    <span>Status Updates</span>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg p-4 border border-orange-200">
                            <h4 class="font-semibold text-orange-800 mb-2">🔗 Integration Hub</h4>
                            <div class="space-y-1 text-xs text-orange-700">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                    <span>Gmail ↔ Sheets</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                    <span>AI ↔ Databases</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                    <span>Multi-platform Sync</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-3 border border-orange-300">
                        <div class="flex items-center justify-center">
                            <span class="text-orange-800 font-semibold text-sm mr-2">💡 Pro Tip:</span>
                            <span class="text-orange-700 text-sm">Start with simple email workflows, then gradually build complex multi-step automations</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Add train the trainer methodology overview for Module 5
        if (moduleId === 'module-5') {
            menuHtml += `
                <div class="mt-6 mb-8 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-6">
                    <h3 class="google-sans text-lg font-bold text-teal-800 mb-3">🎓 AI Champion Development Framework</h3>
                    <div class="grid md:grid-cols-5 gap-3 text-sm">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">📚</div>
                            <div class="font-semibold text-teal-800">Learn</div>
                            <div class="text-teal-600">Master advanced AI concepts and applications</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🛠️</div>
                            <div class="font-semibold text-teal-800">Practice</div>
                            <div class="text-teal-600">Build real projects and gain hands-on experience</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">👥</div>
                            <div class="font-semibold text-teal-800">Teach</div>
                            <div class="text-teal-600">Mentor colleagues and share knowledge</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">📊</div>
                            <div class="font-semibold text-teal-800">Present</div>
                            <div class="text-teal-600">Showcase results to leadership</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🚀</div>
                            <div class="font-semibold text-teal-800">Scale</div>
                            <div class="text-teal-600">Drive organization-wide AI adoption</div>
                        </div>
                    </div>
                    <div class="mt-4 grid md:grid-cols-2 gap-4">
                        <div class="bg-white rounded-lg p-4 border border-teal-200">
                            <h4 class="font-semibold text-teal-800 mb-2">🎯 Champion Skills</h4>
                            <div class="space-y-1 text-xs text-teal-700">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                                    <span>Training Design & Delivery</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                                    <span>Change Management</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                                    <span>Mentoring & Coaching</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                                    <span>Technical Troubleshooting</span>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg p-4 border border-teal-200">
                            <h4 class="font-semibold text-teal-800 mb-2">📈 Leadership Impact</h4>
                            <div class="space-y-1 text-xs text-teal-700">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                                    <span>Business Case Development</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                                    <span>ROI Measurement & Reporting</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                                    <span>Stakeholder Engagement</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                                    <span>Strategic Presentation Skills</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-lg p-3 border border-teal-300">
                        <div class="text-center">
                            <span class="text-teal-800 font-semibold text-sm mr-2">🏆 Champion Outcome:</span>
                            <span class="text-teal-700 text-sm">Become a recognized AI expert who drives transformation and mentors others</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Add strategy & governance methodology overview for Module 6
        if (moduleId === 'module-6') {
            menuHtml += `
                <div class="mt-6 mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                    <h3 class="google-sans text-lg font-bold text-indigo-800 mb-3">🎯 Strategic AI Governance Framework</h3>
                    <div class="grid md:grid-cols-6 gap-2 text-sm">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🔍</div>
                            <div class="font-semibold text-indigo-800">Assess</div>
                            <div class="text-indigo-600">Current state & readiness evaluation</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🎯</div>
                            <div class="font-semibold text-indigo-800">Vision</div>
                            <div class="text-indigo-600">Define AI strategy & objectives</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🗺️</div>
                            <div class="font-semibold text-indigo-800">Roadmap</div>
                            <div class="text-indigo-600">Prioritize initiatives & timeline</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">⚖️</div>
                            <div class="font-semibold text-indigo-800">Govern</div>
                            <div class="text-indigo-600">Establish policies & compliance</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🚀</div>
                            <div class="font-semibold text-indigo-800">Execute</div>
                            <div class="text-indigo-600">Implement & manage projects</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">📊</div>
                            <div class="font-semibold text-indigo-800">Monitor</div>
                            <div class="text-indigo-600">Track progress & optimize</div>
                        </div>
                    </div>
                    <div class="mt-4 grid md:grid-cols-3 gap-4">
                        <div class="bg-white rounded-lg p-4 border border-indigo-200">
                            <h4 class="font-semibold text-indigo-800 mb-2">📋 Strategic Planning</h4>
                            <div class="space-y-1 text-xs text-indigo-700">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    <span>AI Maturity Assessment</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    <span>Business Case Development</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    <span>Resource Planning</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    <span>Timeline & Milestones</span>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg p-4 border border-indigo-200">
                            <h4 class="font-semibold text-indigo-800 mb-2">⚖️ Governance & Risk</h4>
                            <div class="space-y-1 text-xs text-indigo-700">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    <span>AI Ethics Framework</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    <span>Data Privacy & Security</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    <span>Compliance Management</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    <span>Risk Mitigation</span>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg p-4 border border-indigo-200">
                            <h4 class="font-semibold text-indigo-800 mb-2">🎯 Implementation</h4>
                            <div class="space-y-1 text-xs text-indigo-700">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    <span>Project Prioritization</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    <span>Change Management</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    <span>Performance Metrics</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    <span>Continuous Improvement</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-3 border border-indigo-300">
                        <div class="text-center">
                            <span class="text-indigo-800 font-semibold text-sm mr-2">🏛️ Leadership Focus:</span>
                            <span class="text-indigo-700 text-sm">Build enterprise-grade AI strategy that drives sustainable competitive advantage</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Add measuring impact methodology overview for Module 7
        if (moduleId === 'module-7') {
            menuHtml += `
                <div class="mt-6 mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
                    <h3 class="google-sans text-lg font-bold text-emerald-800 mb-3">📊 AI Impact Measurement Framework</h3>
                    <div class="grid md:grid-cols-5 gap-3 text-sm">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🎯</div>
                            <div class="font-semibold text-emerald-800">Define</div>
                            <div class="text-emerald-600">Establish clear success metrics & KPIs</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">📏</div>
                            <div class="font-semibold text-emerald-800">Measure</div>
                            <div class="text-emerald-600">Collect baseline & performance data</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">💰</div>
                            <div class="font-semibold text-emerald-800">Calculate</div>
                            <div class="text-emerald-600">Determine ROI & business value</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">📈</div>
                            <div class="font-semibold text-emerald-800">Visualize</div>
                            <div class="text-emerald-600">Create compelling reports & dashboards</div>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg mx-auto mb-3">🎤</div>
                            <div class="font-semibold text-emerald-800">Present</div>
                            <div class="text-emerald-600">Communicate value to stakeholders</div>
                        </div>
                    </div>
                    <div class="mt-4 grid md:grid-cols-3 gap-4">
                        <div class="bg-white rounded-lg p-4 border border-emerald-200">
                            <h4 class="font-semibold text-emerald-800 mb-2">📊 Key Metrics</h4>
                            <div class="space-y-1 text-xs text-emerald-700">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                    <span>Time-to-Fill Reduction</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                    <span>Cost-per-Hire Savings</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                    <span>Quality of Hire Improvement</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                    <span>Productivity Gains</span>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg p-4 border border-emerald-200">
                            <h4 class="font-semibold text-emerald-800 mb-2">💰 ROI Calculation</h4>
                            <div class="space-y-1 text-xs text-emerald-700">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                    <span>Investment Tracking</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                    <span>Benefit Quantification</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                    <span>Payback Period Analysis</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                    <span>Net Present Value</span>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg p-4 border border-emerald-200">
                            <h4 class="font-semibold text-emerald-800 mb-2">📈 Business Impact</h4>
                            <div class="space-y-1 text-xs text-emerald-700">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                    <span>Executive Dashboards</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                    <span>Business Case Updates</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                    <span>Stakeholder Reports</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                    <span>Success Stories</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg p-3 border border-emerald-300">
                        <div class="text-center">
                            <span class="text-emerald-800 font-semibold text-sm mr-2">💎 Value Outcome:</span>
                            <span class="text-emerald-700 text-sm">Demonstrate measurable business impact and secure continued AI investment</span>
                        </div>
                    </div>
                </div>
            `;
        }

        menuHtml += '<ul class="mt-6 space-y-4">';

        sessions.forEach(session => {
            const desc = session.description;
            const file = session.id.replace('session-', '').replace('-page', '');
            const url = `/rpo-training/sessions/${file}.html`;
            menuHtml += `
                <li>
                    <a href="${url}" class="block bg-white p-6 rounded-lg shadow-md hover:bg-gray-50 transition border-l-4 border-blue-500" aria-label="Open ${session.title}">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="google-sans text-xl font-bold text-blue-700">${session.title}</h3>
                            ${desc ? `<span class="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">${desc.duration}</span>` : ''}
                        </div>
                        ${desc ? `
                            <p class="text-gray-600 mb-3">${desc.description}</p>
                            <div class="flex flex-wrap gap-2">
                                ${desc.topics.map(topic => `<span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">${topic}</span>`).join('')}
                            </div>
                        ` : ''}
                    </a>
                </li>
            `;
        });

        menuHtml += '</ul></div>';

        sessionContainer.innerHTML = menuHtml;
        sessionContainer.classList.add('active');
        mainPage.classList.remove('active');
        headerTitle.textContent = moduleTitles[moduleId] || 'Select a Session';
        window.scrollTo(0, 0);
    }

    function navigateTo(pageId) {
        // Store the scroll position if leaving the main page
        if (document.getElementById('main-page').classList.contains('active') && pageId !== 'main-page') {
            sessionStorage.setItem('mainPageScrollPosition', window.scrollY);
        }

        // This part seems to be for a different scroll position saving logic, removing it to avoid conflict
        if (pageId !== 'main-page') {
            sessionStorage.setItem('scrollPosition', window.scrollY);
        }

        // Hide all pages by default
        mainPage.classList.remove('active');
        sessionContainer.classList.remove('active');

        if (pageId === 'main-page') {
            mainPage.classList.add('active');
            sessionContainer.innerHTML = '';
            setRpoBreadcrumb(null);
            // Restore scroll position if returning to the main page
            const savedPosition = sessionStorage.getItem('mainPageScrollPosition');
            if (savedPosition) {
                window.scrollTo(0, parseInt(savedPosition, 10) - 100); // Added -100 for a little buffer above
                sessionStorage.removeItem('scrollPosition');
            }
        } else if (pageId.startsWith('module-')) {
            showSessionMenu(pageId);
            setRpoBreadcrumb(pageId);
        } else {
            const sessionPath = pageId.replace('session-', '').replace('-page', '');
            const filePath = `sessions/${sessionPath}.html`;

            fetch(filePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    sessionContainer.innerHTML = html;
                    sessionContainer.classList.add('active');
                    // Re-attach event listeners for any new buttons in the loaded content if necessary
                    const backButton = sessionContainer.querySelector('button');
                    // Store the current module ID before navigating to a session
                    const currentModuleId = sessionStorage.getItem('currentModuleId');
                    if (currentModuleId) {
                        sessionStorage.setItem('lastVisitedModule', currentModuleId);
                    }

                    if (backButton) {
                        backButton.onclick = () => {
                            const lastModule = sessionStorage.getItem('lastVisitedModule');
                            if (lastModule) {
                                navigateTo(lastModule);
                                sessionStorage.removeItem('lastVisitedModule'); // Clear after use
                            } else {
                                navigateTo('main-page');
                            }
                        };
                    }
                })
                .catch(error => {
                    console.error('Error fetching session content:', error);
                    sessionContainer.innerHTML = '<p class="text-red-500">Error loading content. Please try again later.</p>';
                    sessionContainer.classList.add('active');
                });
        }

        headerTitle.textContent = pageTitles[pageId] || pageTitles['main-page'];
        if (pageId !== 'main-page') {
            window.scrollTo(0, 0);
        }

        // Store the current module ID when navigating to a module session menu
        if (pageId.startsWith('module-')) {
            sessionStorage.setItem('currentModuleId', pageId);
        }

    }

    // Make navigateTo globally accessible
    window.navigateTo = navigateTo;

    // Set copyright year
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // Set up initial page view - check for URL anchor first
    const hash = window.location.hash.substring(1); // Remove the # symbol
    if (hash && Object.keys(pageTitles).includes(hash)) {
        navigateTo(hash);
    } else {
        navigateTo('main-page');
    }

    // --- Back to Top Button Logic ---
    const backToTopBtn = document.getElementById('back-to-top');

    // Show/hide back to top button based on scroll position
    function toggleBackToTopButton() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    // Smooth scroll to top function
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Event listeners for back to top
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }

    // Show/hide button on scroll
    window.addEventListener('scroll', toggleBackToTopButton);

    // Initial check on page load
    toggleBackToTopButton();
});
