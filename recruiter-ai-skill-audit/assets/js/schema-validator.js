/**
 * Schema Validation System
 * Validates question data structure and metadata integrity
 * Provides clear error messages for data quality issues
 */

class SchemaValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.validationReport = null;
    }

    /**
     * Define schema rules for questions
     */
    getQuestionSchema() {
        return {
            id: {
                type: 'string',
                required: true,
                pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                errorMsg: 'Question ID must start with a letter and contain only letters, numbers, and underscores'
            },
            question: {
                type: 'string',
                required: true,
                minLength: 10,
                maxLength: 500,
                errorMsg: 'Question text must be 10-500 characters'
            },
            type: {
                type: 'enum',
                required: true,
                values: ['checkbox', 'single', 'multi'],
                errorMsg: 'Type must be checkbox, single, or multi'
            },
            businessUnit: {
                type: 'enum',
                required: true,
                values: ['sourcing', 'admin', 'scheduling', 'compliance', 'contracts'],
                errorMsg: 'Invalid business unit'
            },
            options: {
                type: 'array',
                required: true,
                minLength: 2,
                maxLength: 10,
                errorMsg: 'Must have 2-10 options'
            }
        };
    }

    /**
     * Define schema rules for legacy (showIf-based) questions
     */
    getLegacyQuestionSchema() {
        return {
            id: {
                type: 'string',
                required: true,
                pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                errorMsg: 'Question ID must start with a letter and contain only letters, numbers, and underscores'
            },
            question: {
                type: 'string',
                required: true,
                minLength: 10,
                maxLength: 500,
                errorMsg: 'Question text must be 10-500 characters'
            },
            type: {
                type: 'enum',
                required: true,
                values: ['checkbox', 'single', 'multi'],
                errorMsg: 'Type must be checkbox, single, or multi'
            },
            showIf: {
                type: 'enum',
                required: false,
                values: ['', 'sourcing', 'admin', 'scheduling', 'compliance', 'contracts'],
                errorMsg: 'Invalid showIf business unit'
            },
            options: {
                type: 'array',
                required: true,
                minLength: 2,
                maxLength: 10,
                errorMsg: 'Must have 2-10 options'
            }
        };
    }

    /**
     * Define schema rules for options
     */
    getOptionSchema() {
        return {
            value: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 200,
                errorMsg: 'Option value must be 1-200 characters'
            },
            label: {
                type: 'string',
                required: false,
                minLength: 1,
                maxLength: 200,
                errorMsg: 'Option label must be 1-200 characters'
            },
            hours: {
                type: 'number',
                required: false,
                min: 0,
                max: 168, // Max hours in a week
                errorMsg: 'Hours must be between 0 and 168'
            },
            savingsPct: {
                type: 'number',
                required: false,
                min: 0,
                max: 100,
                errorMsg: 'Savings percentage must be 0-100'
            },
            multiplier: {
                type: 'number',
                required: false,
                min: 0.1,
                max: 5.0,
                errorMsg: 'Multiplier must be between 0.1 and 5.0'
            }
        };
    }

    detectSchema(questionsData) {
        if (!questionsData || typeof questionsData !== 'object') return 'unknown';

        const businessUnits = questionsData.businessUnits;
        const questions = questionsData.questions;

        const isV2 =
            Array.isArray(businessUnits) &&
            businessUnits.some(bu => bu && typeof bu === 'object' && Array.isArray(bu.questions));

        if (isV2) return 'v2';

        const isLegacy =
            Array.isArray(businessUnits) &&
            Array.isArray(questions) &&
            (businessUnits.some(bu => bu && typeof bu === 'object' && 'id' in bu && 'label' in bu) ||
                questions.some(q => q && typeof q === 'object' && 'showIf' in q));

        if (isLegacy) return 'legacy';

        return 'unknown';
    }

    /**
     * Validate a single field against schema rules
     */
    validateField(fieldName, value, schema, path = '') {
        const rules = schema[fieldName];
        if (!rules) return true;

        const fullPath = path ? `${path}.${fieldName}` : fieldName;

        // Check required
        if (rules.required && (value === undefined || value === null || value === '')) {
            this.errors.push({
                path: fullPath,
                field: fieldName,
                message: `${fieldName} is required. ${rules.errorMsg}`,
                severity: 'error'
            });
            return false;
        }

        // If not required and empty, skip other validations
        if (!rules.required && (value === undefined || value === null || value === '')) {
            return true;
        }

        // Check type
        if (rules.type === 'string' && typeof value !== 'string') {
            this.errors.push({
                path: fullPath,
                field: fieldName,
                message: `${fieldName} must be a string. ${rules.errorMsg}`,
                severity: 'error'
            });
            return false;
        }

        if (rules.type === 'number' && typeof value !== 'number') {
            this.errors.push({
                path: fullPath,
                field: fieldName,
                message: `${fieldName} must be a number. ${rules.errorMsg}`,
                severity: 'error'
            });
            return false;
        }

        if (rules.type === 'array' && !Array.isArray(value)) {
            this.errors.push({
                path: fullPath,
                field: fieldName,
                message: `${fieldName} must be an array. ${rules.errorMsg}`,
                severity: 'error'
            });
            return false;
        }

        // Check enum values
        if (rules.type === 'enum' && !rules.values.includes(value)) {
            this.errors.push({
                path: fullPath,
                field: fieldName,
                message: `${fieldName} must be one of: ${rules.values.join(', ')}. Got: ${value}`,
                severity: 'error'
            });
            return false;
        }

        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            this.errors.push({
                path: fullPath,
                field: fieldName,
                message: `${fieldName} format is invalid. ${rules.errorMsg}`,
                severity: 'error'
            });
            return false;
        }

        // Check string length
        if (rules.type === 'string') {
            if (rules.minLength && value.length < rules.minLength) {
                this.errors.push({
                    path: fullPath,
                    field: fieldName,
                    message: `${fieldName} must be at least ${rules.minLength} characters. ${rules.errorMsg}`,
                    severity: 'error'
                });
                return false;
            }
            if (rules.maxLength && value.length > rules.maxLength) {
                this.errors.push({
                    path: fullPath,
                    field: fieldName,
                    message: `${fieldName} must be at most ${rules.maxLength} characters. ${rules.errorMsg}`,
                    severity: 'error'
                });
                return false;
            }
        }

        // Check number range
        if (rules.type === 'number') {
            if (rules.min !== undefined && value < rules.min) {
                this.errors.push({
                    path: fullPath,
                    field: fieldName,
                    message: `${fieldName} must be at least ${rules.min}. ${rules.errorMsg}`,
                    severity: 'error'
                });
                return false;
            }
            if (rules.max !== undefined && value > rules.max) {
                this.errors.push({
                    path: fullPath,
                    field: fieldName,
                    message: `${fieldName} must be at most ${rules.max}. ${rules.errorMsg}`,
                    severity: 'error'
                });
                return false;
            }
        }

        // Check array length
        if (rules.type === 'array') {
            if (rules.minLength && value.length < rules.minLength) {
                this.errors.push({
                    path: fullPath,
                    field: fieldName,
                    message: `${fieldName} must have at least ${rules.minLength} items. ${rules.errorMsg}`,
                    severity: 'error'
                });
                return false;
            }
            if (rules.maxLength && value.length > rules.maxLength) {
                this.warnings.push({
                    path: fullPath,
                    field: fieldName,
                    message: `${fieldName} has ${value.length} items (max recommended: ${rules.maxLength}). This may impact UX.`,
                    severity: 'warning'
                });
            }
        }

        return true;
    }

    /**
     * Validate a single option
     */
    validateOption(option, index, questionId) {
        const schema = this.getOptionSchema();
        const path = `questions[${questionId}].options[${index}]`;
        let isValid = true;

        for (const field in schema) {
            if (!this.validateField(field, option[field], schema, path)) {
                isValid = false;
            }
        }

        // Additional validation: Check for empty or whitespace-only values
        if (option.value && option.value.trim() === '') {
            this.errors.push({
                path: path,
                field: 'value',
                message: 'Option value cannot be empty or whitespace only',
                severity: 'error'
            });
            isValid = false;
        }

        return isValid;
    }

    /**
     * Validate a single question
     */
    validateQuestion(question, index) {
        const schema = this.getQuestionSchema();
        const path = `questions[${index}]`;
        let isValid = true;

        // Validate question fields
        for (const field in schema) {
            if (!this.validateField(field, question[field], schema, path)) {
                isValid = false;
            }
        }

        // Validate options if present
        if (question.options && Array.isArray(question.options)) {
            question.options.forEach((option, optIndex) => {
                if (!this.validateOption(option, optIndex, question.id)) {
                    isValid = false;
                }
            });

            // Check for duplicate option values
            const optionValues = question.options.map(opt => opt.value?.toLowerCase().trim());
            const duplicates = optionValues.filter((value, index) => optionValues.indexOf(value) !== index);
            if (duplicates.length > 0) {
                this.warnings.push({
                    path: `${path}.options`,
                    field: 'options',
                    message: `Duplicate option values found: ${[...new Set(duplicates)].join(', ')}`,
                    severity: 'warning'
                });
            }
        }

        return isValid;
    }

    validateLegacyQuestion(question, index) {
        const schema = this.getLegacyQuestionSchema();
        const path = `questions[${index}]`;
        let isValid = true;

        // Validate question fields
        for (const field in schema) {
            if (!this.validateField(field, question[field], schema, path)) {
                isValid = false;
            }
        }

        // Validate options if present
        if (question.options && Array.isArray(question.options)) {
            question.options.forEach((option, optIndex) => {
                if (!this.validateOption(option, optIndex, question.id)) {
                    isValid = false;
                }
            });
        }

        return isValid;
    }

    /**
     * Validate entire questions dataset
     */
    validateQuestions(questionsData) {
        this.errors = [];
        this.warnings = [];

        if (!questionsData) {
            this.errors.push({
                path: 'root',
                field: 'questionsData',
                message: 'Questions data is null or undefined',
                severity: 'error'
            });
            return this.generateReport();
        }

        const schemaType = this.detectSchema(questionsData);
        let questionCount = 0;
        let optionCount = 0;

        if (schemaType === 'v2') {
            if (!questionsData.businessUnits || !Array.isArray(questionsData.businessUnits)) {
                this.errors.push({
                    path: 'root',
                    field: 'businessUnits',
                    message: 'businessUnits must be an array',
                    severity: 'error'
                });
                return this.generateReport();
            }

            // Validate each business unit (v2: nested questions)
            questionsData.businessUnits.forEach((bu, buIndex) => {
                if (!bu.name) {
                    this.errors.push({
                        path: `businessUnits[${buIndex}]`,
                        field: 'name',
                        message: 'Business unit name is required',
                        severity: 'error'
                    });
                }

                if (!bu.questions || !Array.isArray(bu.questions)) {
                    this.errors.push({
                        path: `businessUnits[${buIndex}]`,
                        field: 'questions',
                        message: 'Business unit must have questions array',
                        severity: 'error'
                    });
                    return;
                }

                bu.questions.forEach((question, qIndex) => {
                    this.validateQuestion(question, qIndex);
                    questionCount++;
                    if (question.options) optionCount += question.options.length;
                });
            });
        } else if (schemaType === 'legacy') {
            if (!questionsData.businessUnits || !Array.isArray(questionsData.businessUnits)) {
                this.errors.push({
                    path: 'root',
                    field: 'businessUnits',
                    message: 'businessUnits must be an array',
                    severity: 'error'
                });
                return this.generateReport();
            }

            if (!questionsData.questions || !Array.isArray(questionsData.questions)) {
                this.errors.push({
                    path: 'root',
                    field: 'questions',
                    message: 'questions must be an array',
                    severity: 'error'
                });
                return this.generateReport();
            }

            // Validate business units (legacy: id/label/description)
            questionsData.businessUnits.forEach((bu, buIndex) => {
                if (!bu.id) {
                    this.errors.push({
                        path: `businessUnits[${buIndex}]`,
                        field: 'id',
                        message: 'Business unit id is required',
                        severity: 'error'
                    });
                }
                if (!bu.label) {
                    this.errors.push({
                        path: `businessUnits[${buIndex}]`,
                        field: 'label',
                        message: 'Business unit label is required',
                        severity: 'error'
                    });
                }
            });

            // Validate each question (legacy: showIf-based)
            questionsData.questions.forEach((question, qIndex) => {
                this.validateLegacyQuestion(question, qIndex);
                questionCount++;
                if (question.options) optionCount += question.options.length;
            });
        } else {
            this.errors.push({
                path: 'root',
                field: 'questionsData',
                message: 'Unknown questions data schema (expected legacy or v2 structure)',
                severity: 'error'
            });
            return this.generateReport();
        }

        this.validationReport = this.generateReport();
        this.validationReport.statistics = {
            totalBusinessUnits: Array.isArray(questionsData.businessUnits) ? questionsData.businessUnits.length : 0,
            totalQuestions: questionCount,
            totalOptions: optionCount,
            avgOptionsPerQuestion: questionCount > 0 ? (optionCount / questionCount).toFixed(1) : 0
        };

        return this.validationReport;
    }

    /**
     * Generate validation report
     */
    generateReport() {
        const hasErrors = this.errors.length > 0;
        const hasWarnings = this.warnings.length > 0;

        return {
            isValid: !hasErrors,
            hasWarnings: hasWarnings,
            errors: this.errors,
            warnings: this.warnings,
            errorCount: this.errors.length,
            warningCount: this.warnings.length,
            summary: hasErrors
                ? `Validation failed with ${this.errors.length} error(s) and ${this.warnings.length} warning(s)`
                : hasWarnings
                    ? `Validation passed with ${this.warnings.length} warning(s)`
                    : 'All validation checks passed',
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Get formatted error messages for console
     */
    getFormattedErrors() {
        if (this.errors.length === 0 && this.warnings.length === 0) {
            return '✅ No validation issues found';
        }

        let output = '';

        if (this.errors.length > 0) {
            output += `\n🔴 ERRORS (${this.errors.length}):\n`;
            output += '━'.repeat(50) + '\n';
            this.errors.forEach((error, index) => {
                output += `${index + 1}. [${error.path}]\n`;
                output += `   ${error.message}\n\n`;
            });
        }

        if (this.warnings.length > 0) {
            output += `\n🟡 WARNINGS (${this.warnings.length}):\n`;
            output += '━'.repeat(50) + '\n';
            this.warnings.forEach((warning, index) => {
                output += `${index + 1}. [${warning.path}]\n`;
                output += `   ${warning.message}\n\n`;
            });
        }

        return output;
    }

    /**
     * Log validation report to console
     */
    logReport() {
        if (!this.validationReport) {
            console.warn('No validation report available. Run validateQuestions() first.');
            return;
        }

        console.log('\n' + '='.repeat(60));
        console.log('📋 SCHEMA VALIDATION REPORT');
        console.log('='.repeat(60));

        if (this.validationReport.statistics) {
            console.log('\n📊 Statistics:');
            console.log(`   Business Units: ${this.validationReport.statistics.totalBusinessUnits}`);
            console.log(`   Questions: ${this.validationReport.statistics.totalQuestions}`);
            console.log(`   Options: ${this.validationReport.statistics.totalOptions}`);
            console.log(`   Avg Options/Question: ${this.validationReport.statistics.avgOptionsPerQuestion}`);
        }

        console.log(`\n${this.validationReport.isValid ? '✅' : '❌'} ${this.validationReport.summary}`);

        if (this.errors.length > 0 || this.warnings.length > 0) {
            console.log(this.getFormattedErrors());
        }

        console.log('='.repeat(60) + '\n');
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.SchemaValidator = SchemaValidator;
}
