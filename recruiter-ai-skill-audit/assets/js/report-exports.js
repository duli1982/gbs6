/**
 * Report Export System
 * Handles PDF, Excel, and Presentation exports
 */

class ReportExportSystem {
    constructor(results, enhancedContext, enhancedResults) {
        this.results = results;
        this.enhancedContext = enhancedContext;
        this.enhancedResults = enhancedResults;
    }

    /**
     * Export comprehensive PDF report
     */
    async exportPDF(reportType = 'full') {
        const businessUnitLabels = {
            'sourcing': '🔍 Talent Sourcing',
            'admin': '📋 Administrative Support',
            'scheduling': '📅 Interview Scheduling',
            'compliance': '⚖️ Compliance & Legal',
            'contracts': '📄 Contract Creation'
        };

        const businessUnitLabel = businessUnitLabels[this.results.businessUnit] || this.results.businessUnit;
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        let pdfContent = '';

        switch (reportType) {
            case 'executive':
                pdfContent = this.generateExecutiveSummaryPDF(businessUnitLabel, currentDate);
                break;
            case 'full':
                pdfContent = this.generateFullReportPDF(businessUnitLabel, currentDate);
                break;
            case 'checklist':
                pdfContent = this.generateImplementationChecklistPDF(businessUnitLabel, currentDate);
                break;
            default:
                pdfContent = this.generateFullReportPDF(businessUnitLabel, currentDate);
        }

        // Create and trigger print
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(pdfContent);
            printWindow.document.close();

            printWindow.onload = function() {
                setTimeout(() => {
                    printWindow.focus();
                    printWindow.print();
                }, 250);
            };
        } else {
            alert('Please allow popups to download the PDF report.');
        }
    }

    /**
     * Generate Executive Summary PDF (1 page)
     */
    generateExecutiveSummaryPDF(businessUnitLabel, currentDate) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>AI Skills Audit - Executive Summary</title>
                <style>
                    @page { margin: 0.5in; size: letter; }
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        color: #333;
                        line-height: 1.4;
                        font-size: 11pt;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        border-bottom: 3px solid #4F46E5;
                    }
                    .header h1 { color: #4F46E5; margin: 0 0 5px 0; font-size: 24pt; }
                    .header h2 { color: #666; margin: 0; font-size: 16pt; font-weight: normal; }
                    .header .date { color: #999; font-size: 9pt; margin-top: 5px; }

                    .summary-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 15px;
                        margin: 20px 0;
                    }
                    .summary-box {
                        text-align: center;
                        padding: 15px;
                        background: #F9FAFB;
                        border-radius: 8px;
                        border: 2px solid #E5E7EB;
                    }
                    .summary-value { font-size: 28pt; font-weight: bold; color: #4F46E5; margin: 5px 0; }
                    .summary-label { font-size: 9pt; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }

                    .key-findings {
                        margin: 20px 0;
                        padding: 15px;
                        background: #EFF6FF;
                        border-left: 4px solid #3B82F6;
                    }
                    .key-findings h3 { margin: 0 0 10px 0; color: #1E40AF; font-size: 13pt; }
                    .key-findings ul { margin: 0; padding-left: 20px; }
                    .key-findings li { margin: 5px 0; font-size: 10pt; }

                    .top-opportunities {
                        margin: 20px 0;
                    }
                    .top-opportunities h3 { margin: 0 0 10px 0; font-size: 13pt; }
                    .opportunity {
                        margin: 10px 0;
                        padding: 10px;
                        border-left: 4px solid #059669;
                        background: #F0FDF4;
                    }
                    .opportunity-title { font-weight: 600; font-size: 11pt; margin-bottom: 5px; }
                    .opportunity-details { font-size: 9pt; color: #666; }

                    .footer {
                        margin-top: 20px;
                        padding-top: 15px;
                        text-align: center;
                        color: #6B7280;
                        font-size: 8pt;
                        border-top: 1px solid #E5E7EB;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>AI-Powered Transformation</h1>
                    <h2>Executive Summary - ${businessUnitLabel}</h2>
                    <div class="date">${currentDate}</div>
                </div>

                <div class="summary-grid">
                    <div class="summary-box">
                        <div class="summary-value">${this.results.totalTimeSaved}</div>
                        <div class="summary-label">Hours Saved/Week</div>
                    </div>
                    <div class="summary-box">
                        <div class="summary-value">${this.results.monthlyTimeSaved}</div>
                        <div class="summary-label">Hours Saved/Month</div>
                    </div>
                    <div class="summary-box">
                        <div class="summary-value">${Math.round(this.results.yearlyTimeSaved / 8)}</div>
                        <div class="summary-label">Work Days Saved/Year</div>
                    </div>
                </div>

                <div class="key-findings">
                    <h3>📊 Key Findings</h3>
                    <ul>
                        ${this.enhancedContext.painPoints.slice(0, 5).map(pp => `
                            <li><strong>${pp.category}:</strong> ${pp.description}</li>
                        `).join('')}
                    </ul>
                </div>

                <div class="top-opportunities">
                    <h3>🚀 Top 3 AI Opportunities</h3>
                    ${this.results.recommendations.slice(0, 3).map((rec, idx) => `
                        <div class="opportunity">
                            <div class="opportunity-title">${idx + 1}. ${rec.name}</div>
                            <div class="opportunity-details">
                                Save ${rec.savings.toFixed(1)} hrs/week • Priority: ${rec.priority.toUpperCase()} •
                                Tools: ${rec.tools.join(', ')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="footer">
                    <p><strong>Generated by GBS EMEA AI Skills Audit</strong></p>
                    <p>Report Date: ${currentDate}</p>
                </div>
            </body>
            </html>
        `;
    }

    /**
     * Generate Full Report PDF (5-10 pages)
     */
    generateFullReportPDF(businessUnitLabel, currentDate) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>AI Skills Audit - Full Report</title>
                <style>
                    @page { margin: 0.75in; }
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        color: #333;
                        line-height: 1.6;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 3px solid #4F46E5;
                        padding-bottom: 20px;
                    }
                    .header h1 { color: #4F46E5; margin-bottom: 10px; font-size: 28px; }
                    .header h2 { color: #666; margin: 5px 0; font-size: 20px; font-weight: normal; }

                    .section { margin: 30px 0; page-break-inside: avoid; }
                    .section-title {
                        font-size: 20px;
                        font-weight: bold;
                        color: #4F46E5;
                        margin-bottom: 15px;
                        border-bottom: 2px solid #E5E7EB;
                        padding-bottom: 8px;
                    }

                    .metrics-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 15px;
                        margin: 20px 0;
                    }
                    .metric-box {
                        text-align: center;
                        padding: 20px;
                        background: #F9FAFB;
                        border-radius: 8px;
                        border: 1px solid #E5E7EB;
                    }
                    .metric-value { font-size: 32px; font-weight: bold; color: #4F46E5; }
                    .metric-label { font-size: 12px; color: #666; text-transform: uppercase; }

                    .pain-points {
                        margin: 20px 0;
                    }
                    .pain-point {
                        margin: 10px 0;
                        padding: 12px;
                        border-left: 4px solid #EF4444;
                        background: #FEF2F2;
                    }
                    .pain-point-title { font-weight: 600; margin-bottom: 5px; }

                    .recommendations {
                        margin: 20px 0;
                    }
                    .recommendation {
                        margin: 15px 0;
                        padding: 15px;
                        border-left: 4px solid #4F46E5;
                        background: #F9FAFB;
                        page-break-inside: avoid;
                    }
                    .recommendation h4 { margin: 0 0 10px 0; color: #1F2937; }
                    .tools { margin: 10px 0; }
                    .tool-tag {
                        display: inline-block;
                        background: #E0E7FF;
                        color: #3730A3;
                        padding: 4px 10px;
                        margin: 3px;
                        border-radius: 4px;
                        font-size: 11px;
                    }

                    .readiness-factors {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 15px;
                        margin: 20px 0;
                    }
                    .readiness-box {
                        padding: 15px;
                        background: #FEF3C7;
                        border-radius: 8px;
                        border: 1px solid #FDE68A;
                    }
                    .readiness-score { font-size: 24px; font-weight: bold; color: #92400E; }

                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        text-align: center;
                        color: #6B7280;
                        font-size: 12px;
                        border-top: 1px solid #E5E7EB;
                    }

                    @media print {
                        .page-break { page-break-after: always; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>AI-Powered Transformation Report</h1>
                    <h2>${businessUnitLabel}</h2>
                    <div class="date">Generated on ${currentDate}</div>
                </div>

                <div class="section">
                    <div class="section-title">Executive Summary</div>
                    <div class="metrics-grid">
                        <div class="metric-box">
                            <div class="metric-value">${this.results.totalTimeSaved}</div>
                            <div class="metric-label">Hours Saved/Week</div>
                        </div>
                        <div class="metric-box">
                            <div class="metric-value">${this.results.monthlyTimeSaved}</div>
                            <div class="metric-label">Hours Saved/Month</div>
                        </div>
                        <div class="metric-box">
                            <div class="metric-value">${this.results.yearlyTimeSaved}</div>
                            <div class="metric-label">Hours Saved/Year</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Pain Points Analysis</div>
                    <div class="pain-points">
                        ${this.enhancedContext.painPoints.map(pp => `
                            <div class="pain-point">
                                <div class="pain-point-title">
                                    <strong>[${pp.severity.toUpperCase()}]</strong> ${pp.description}
                                </div>
                                <div style="font-size: 12px; color: #666; margin-top: 5px;">
                                    <strong>Impact:</strong> ${pp.impact}<br>
                                    <strong>Recommendation:</strong> ${pp.recommendation}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="section page-break">
                    <div class="section-title">Your Top AI Opportunities</div>
                    <div class="recommendations">
                        ${this.results.recommendations.map((rec, idx) => `
                            <div class="recommendation">
                                <h4>${idx + 1}. ${rec.name}</h4>
                                <div style="margin: 10px 0;">
                                    <strong>Current Time:</strong> ${rec.hours} hrs/week →
                                    <strong style="color: #059669;">Potential Savings:</strong> ${rec.savings.toFixed(1)} hrs/week
                                    (${((rec.savings / rec.hours) * 100).toFixed(0)}% reduction)
                                </div>
                                <div><strong>Priority:</strong> ${rec.priority.toUpperCase()}</div>
                                ${rec.confidenceInterval ? `
                                    <div style="font-size: 12px; color: #666; margin-top: 5px;">
                                        Confidence Range: ${rec.confidenceInterval.low.toFixed(1)}-${rec.confidenceInterval.high.toFixed(1)} hrs/week
                                        (${rec.confidenceInterval.confidence}% confidence)
                                    </div>
                                ` : ''}
                                <div class="tools">
                                    <strong>Recommended Tools:</strong><br>
                                    ${rec.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Readiness Assessment</div>
                    <div class="readiness-factors">
                        ${Object.entries(this.enhancedContext.readinessFactors).map(([factor, data]) => `
                            <div class="readiness-box">
                                <h4 style="margin: 0 0 10px 0; color: #92400E;">${factor.replace(/([A-Z])/g, ' $1').trim()}</h4>
                                <div class="readiness-score">${data.score}/100</div>
                                <div style="font-size: 12px; color: #78350F; margin-top: 8px;">
                                    Level: ${data.level.toUpperCase()}<br>
                                    ${data.rationale}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Tool Gaps</div>
                    <div>
                        ${this.enhancedContext.toolGaps.map(gap => `
                            <div style="margin: 10px 0; padding: 12px; background: #FFFBEB; border-left: 4px solid #F59E0B;">
                                <div style="font-weight: 600; margin-bottom: 5px;">
                                    [${gap.severity.toUpperCase()}] ${gap.missing}
                                </div>
                                <div style="font-size: 12px; color: #666;">
                                    <strong>Impact:</strong> ${gap.impact}<br>
                                    <strong>Priority:</strong> ${gap.priority}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="footer">
                    <p><strong>Generated by GBS EMEA AI Skills Audit</strong></p>
                    <p>For more AI tools and training, visit the GBS Learning Hub</p>
                    <p style="margin-top: 10px;">Report Date: ${currentDate}</p>
                </div>
            </body>
            </html>
        `;
    }

    /**
     * Generate Implementation Checklist PDF
     */
    generateImplementationChecklistPDF(businessUnitLabel, currentDate) {
        const weeks = [
            { week: 1, focus: 'Setup & Training', tasks: [
                'Sign up for recommended AI tools',
                'Complete basic training tutorials',
                'Set up integrations with existing systems'
            ]},
            { week: 2, focus: 'Pilot Testing', tasks: [
                'Start with highest ROI opportunity',
                'Test on small sample of work',
                'Track time saved vs. current process'
            ]},
            { week: 3, focus: 'Scale Up', tasks: [
                'Implement across all similar tasks',
                'Create templates and workflows',
                'Train team members if applicable'
            ]},
            { week: 4, focus: 'Measure & Optimize', tasks: [
                'Calculate actual time savings',
                'Identify optimization opportunities',
                'Share best practices'
            ]}
        ];

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>AI Implementation Checklist</title>
                <style>
                    @page { margin: 0.75in; }
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        color: #333;
                        line-height: 1.6;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 3px solid #4F46E5;
                        padding-bottom: 20px;
                    }
                    h1 { color: #4F46E5; margin-bottom: 10px; }

                    .checklist-section {
                        margin: 25px 0;
                        padding: 20px;
                        background: #F9FAFB;
                        border-radius: 8px;
                        page-break-inside: avoid;
                    }
                    .checklist-section h2 {
                        color: #1F2937;
                        margin: 0 0 15px 0;
                        font-size: 20px;
                    }
                    .task {
                        margin: 12px 0;
                        padding-left: 30px;
                        position: relative;
                    }
                    .task::before {
                        content: '☐';
                        position: absolute;
                        left: 0;
                        font-size: 18px;
                        color: #4F46E5;
                    }

                    .notes-section {
                        margin-top: 20px;
                        padding: 15px;
                        border: 2px dashed #D1D5DB;
                        min-height: 100px;
                    }
                    .notes-section h3 { margin: 0 0 10px 0; color: #6B7280; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>30-Day AI Implementation Checklist</h1>
                    <div>${businessUnitLabel}</div>
                    <div style="color: #666; font-size: 14px; margin-top: 10px;">${currentDate}</div>
                </div>

                ${weeks.map(week => `
                    <div class="checklist-section">
                        <h2>Week ${week.week}: ${week.focus}</h2>
                        ${week.tasks.map(task => `<div class="task">${task}</div>`).join('')}
                        <div class="notes-section">
                            <h3>NOTES:</h3>
                        </div>
                    </div>
                `).join('')}

                <div class="checklist-section" style="background: #DBEAFE; border-left: 4px solid #3B82F6;">
                    <h2>Success Metrics to Track</h2>
                    <div class="task">Hours saved per week</div>
                    <div class="task">Tools successfully implemented</div>
                    <div class="task">Team members trained</div>
                    <div class="task">Quality of output (maintained or improved)</div>
                    <div class="task">User satisfaction score</div>
                </div>
            </body>
            </html>
        `;
    }

    /**
     * Export to Excel
     */
    exportExcel() {
        // Generate CSV data (simpler than true Excel, but compatible)
        const csvData = this.generateCSVData();
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `AI_Skills_Audit_${this.results.businessUnit}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Export to Google Sheets
     */
    exportGoogleSheets() {
        // Generate CSV data optimized for Google Sheets
        const csvData = this.generateCSVData();
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `AI_Skills_Audit_${this.results.businessUnit}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show instructions modal for Google Sheets import
        setTimeout(() => {
            this.showGoogleSheetsInstructions();
        }, 500);
    }

    /**
     * Show Google Sheets import instructions
     */
    showGoogleSheetsInstructions() {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 10000;';

        modal.innerHTML = `
            <div style="background: white; border-radius: 16px; padding: 32px; max-width: 600px; margin: 20px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="display: inline-block; padding: 16px; background: #34A853; border-radius: 50%; margin-bottom: 16px;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                    </div>
                    <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">CSV Downloaded!</h2>
                </div>

                <div style="background: #F0F9FF; border-left: 4px solid #3B82F6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                    <h3 style="font-size: 16px; font-weight: 600; color: #1E40AF; margin: 0 0 12px 0;">📋 Import to Google Sheets:</h3>
                    <ol style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
                        <li>Open <a href="https://sheets.google.com" target="_blank" style="color: #3B82F6; text-decoration: underline;">Google Sheets</a></li>
                        <li>Click <strong>File → Import</strong></li>
                        <li>Select <strong>Upload</strong> tab</li>
                        <li>Choose the downloaded CSV file</li>
                        <li>Select <strong>Replace spreadsheet</strong> or <strong>Insert new sheet(s)</strong></li>
                        <li>Click <strong>Import data</strong></li>
                    </ol>
                </div>

                <div style="background: #ECFDF5; border-left: 4px solid #10B981; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                    <h3 style="font-size: 14px; font-weight: 600; color: #065F46; margin: 0 0 8px 0;">💡 Pro Tip:</h3>
                    <p style="margin: 0; color: #374151; font-size: 14px;">After importing, you can share the Google Sheet with your team, create charts, and collaborate in real-time!</p>
                </div>

                <div style="text-align: center;">
                    <button id="open-google-sheets-btn" style="background: #34A853; color: white; border: none; padding: 12px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin-right: 12px;">
                        Open Google Sheets
                    </button>
                    <button id="close-modal-btn" style="background: #6B7280; color: white; border: none; padding: 12px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('open-google-sheets-btn').addEventListener('click', () => {
            window.open('https://sheets.google.com', '_blank');
            document.body.removeChild(modal);
        });

        document.getElementById('close-modal-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    /**
     * Generate CSV data
     */
    generateCSVData() {
        let csv = 'AI Skills Audit Report\n\n';

        // Summary section
        csv += 'SUMMARY\n';
        csv += `Business Unit,${this.results.businessUnit}\n`;
        csv += `Weekly Time Saved,${this.results.totalTimeSaved} hours\n`;
        csv += `Monthly Time Saved,${this.results.monthlyTimeSaved} hours\n`;
        csv += `Annual Time Saved,${this.results.yearlyTimeSaved} hours\n`;
        csv += `Context Multiplier,${this.results.contextMultiplier}\n`;
        csv += `Adoption Readiness,${(this.results.adoptionReadiness * 100).toFixed(0)}%\n`;
        csv += '\n';

        // Recommendations section
        csv += 'RECOMMENDATIONS\n';
        csv += 'Priority,Activity,Current Hours/Week,Time Saved/Week,ROI %,Tools\n';
        this.results.recommendations.forEach(rec => {
            csv += `${rec.priority},${rec.name},${rec.hours},${rec.savings.toFixed(1)},${((rec.savings / rec.hours) * 100).toFixed(0)}%,"${rec.tools.join('; ')}"\n`;
        });
        csv += '\n';

        // Pain Points section
        csv += 'PAIN POINTS\n';
        csv += 'Severity,Category,Description,Impact,Recommendation\n';
        this.enhancedContext.painPoints.forEach(pp => {
            csv += `${pp.severity},${pp.category},"${pp.description}","${pp.impact}","${pp.recommendation}"\n`;
        });
        csv += '\n';

        // Tool Gaps section
        csv += 'TOOL GAPS\n';
        csv += 'Severity,Category,Missing Tool,Impact,Priority\n';
        this.enhancedContext.toolGaps.forEach(gap => {
            csv += `${gap.severity},${gap.category},"${gap.missing}","${gap.impact}",${gap.priority}\n`;
        });

        return csv;
    }

    /**
     * Generate shareable presentation link
     */
    async generateShareableLink() {
        // Create a unique ID for this report
        const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Save report data to localStorage for sharing
        const reportData = {
            id: reportId,
            timestamp: new Date().toISOString(),
            results: this.results,
            enhancedContext: this.enhancedContext,
            enhancedResults: this.enhancedResults
        };

        localStorage.setItem(`shared_${reportId}`, JSON.stringify(reportData));

        // Generate shareable URL (in production, this would be a proper API endpoint)
        const shareUrl = `${window.location.origin}${window.location.pathname}?report=${reportId}`;

        return {
            url: shareUrl,
            reportId: reportId
        };
    }

    /**
     * Create presentation mode HTML
     */
    async createPresentationMode() {
        const shareData = await this.generateShareableLink();

        const presentationHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>AI Skills Audit - Presentation</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    .slide {
                        display: none;
                        min-height: 100vh;
                        padding: 60px;
                    }
                    .slide.active {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                    .slide-number {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        font-size: 14px;
                        color: #666;
                    }
                </style>
            </head>
            <body class="bg-gradient-to-br from-indigo-50 to-purple-50">
                <!-- Slide 1: Title -->
                <div class="slide active">
                    <div class="text-center">
                        <h1 class="text-6xl font-bold text-indigo-600 mb-4">AI-Powered Transformation</h1>
                        <h2 class="text-3xl text-gray-700">${this.results.businessUnit}</h2>
                        <div class="mt-12 text-2xl text-gray-600">Weekly Time Savings: <span class="font-bold text-green-600">${this.results.totalTimeSaved} hours</span></div>
                    </div>
                </div>

                <!-- Slide 2: Impact Summary -->
                <div class="slide">
                    <h2 class="text-4xl font-bold text-gray-900 mb-12">Impact Summary</h2>
                    <div class="grid grid-cols-3 gap-8">
                        <div class="bg-white rounded-xl p-8 shadow-lg text-center">
                            <div class="text-5xl font-bold text-indigo-600">${this.results.totalTimeSaved}</div>
                            <div class="text-gray-600 mt-2">Hours/Week</div>
                        </div>
                        <div class="bg-white rounded-xl p-8 shadow-lg text-center">
                            <div class="text-5xl font-bold text-purple-600">${this.results.monthlyTimeSaved}</div>
                            <div class="text-gray-600 mt-2">Hours/Month</div>
                        </div>
                        <div class="bg-white rounded-xl p-8 shadow-lg text-center">
                            <div class="text-5xl font-bold text-pink-600">${Math.round(this.results.yearlyTimeSaved / 8)}</div>
                            <div class="text-gray-600 mt-2">Work Days/Year</div>
                        </div>
                    </div>
                </div>

                <!-- Slide 3-5: Top 3 Recommendations -->
                ${this.results.recommendations.slice(0, 3).map((rec, idx) => `
                    <div class="slide">
                        <h2 class="text-4xl font-bold text-gray-900 mb-8">Opportunity #${idx + 1}: ${rec.name}</h2>
                        <div class="grid grid-cols-2 gap-8">
                            <div>
                                <h3 class="text-2xl font-semibold text-gray-700 mb-4">Current State</h3>
                                <div class="text-5xl font-bold text-red-600">${rec.hours} hrs/week</div>
                            </div>
                            <div>
                                <h3 class="text-2xl font-semibold text-gray-700 mb-4">With AI</h3>
                                <div class="text-5xl font-bold text-green-600">${(rec.hours - rec.savings).toFixed(1)} hrs/week</div>
                            </div>
                        </div>
                        <div class="mt-12 bg-white rounded-xl p-8 shadow-lg">
                            <h3 class="text-xl font-semibold mb-4">Recommended Tools:</h3>
                            <div class="flex flex-wrap gap-4">
                                ${rec.tools.map(tool => `
                                    <span class="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg text-lg font-medium">${tool}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}

                <!-- Navigation Controls -->
                <div class="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
                    <button onclick="prevSlide()" class="px-6 py-3 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
                        ← Previous
                    </button>
                    <button onclick="nextSlide()" class="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors">
                        Next →
                    </button>
                </div>

                <div class="slide-number">Slide <span id="current-slide">1</span> / <span id="total-slides">5</span></div>

                <script>
                    let currentSlide = 0;
                    const slides = document.querySelectorAll('.slide');
                    const totalSlides = slides.length;

                    document.getElementById('total-slides').textContent = totalSlides;

                    function showSlide(n) {
                        if (n >= totalSlides) n = 0;
                        if (n < 0) n = totalSlides - 1;

                        slides.forEach(slide => slide.classList.remove('active'));
                        slides[n].classList.add('active');

                        currentSlide = n;
                        document.getElementById('current-slide').textContent = n + 1;
                    }

                    function nextSlide() {
                        showSlide(currentSlide + 1);
                    }

                    function prevSlide() {
                        showSlide(currentSlide - 1);
                    }

                    // Keyboard navigation
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'ArrowRight') nextSlide();
                        if (e.key === 'ArrowLeft') prevSlide();
                    });
                </script>
            </body>
            </html>
        `;

        // Open in new window
        const presentationWindow = window.open('', '_blank');
        if (presentationWindow) {
            presentationWindow.document.write(presentationHTML);
            presentationWindow.document.close();
        } else {
            alert('Please allow popups to open presentation mode.');
        }

        return shareData;
    }
}
