/**
 * Data Versioning System
 * Manages data schema versions and migrations
 * Ensures backward compatibility and safe schema evolution
 */

class DataVersioning {
    constructor() {
        this.currentVersion = '2.0.0';
        this.migrations = this.initializeMigrations();
        this.changelog = this.getChangelog();
    }

    /**
     * Get changelog from DataConstants or use default
     */
    getChangelog() {
        if (window.DataConstants && window.DataConstants.CHANGELOG) {
            return window.DataConstants.CHANGELOG;
        }

        return [
            {
                version: '2.0.0',
                date: '2025-12-30',
                changes: [
                    'Added multi-dimensional scoring',
                    'Normalized data structure',
                    'Added versioning system',
                    'Separated metadata from questions'
                ],
                breaking: true
            },
            {
                version: '1.0.0',
                date: '2024-12-01',
                changes: [
                    'Initial release',
                    'Basic question structure',
                    'Time savings calculations'
                ],
                breaking: false
            }
        ];
    }

    /**
     * Initialize migration functions
     */
    initializeMigrations() {
        return {
            '1.0.0_to_2.0.0': this.migrate_1_0_0_to_2_0_0.bind(this)
        };
    }

    /**
     * Check if data needs migration
     */
    needsMigration(data) {
        const dataVersion = this.getDataVersion(data);
        return this.compareVersions(dataVersion, this.currentVersion) < 0;
    }

    /**
     * Get version from data
     */
    getDataVersion(data) {
        // Check various possible version locations
        if (data.version) return data.version;
        if (data.schemaVersion) return data.schemaVersion;
        if (data.metadata && data.metadata.version) return data.metadata.version;

        // If no version found, assume oldest version
        return '1.0.0';
    }

    /**
     * Compare two version strings
     * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
     */
    compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);

        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const num1 = parts1[i] || 0;
            const num2 = parts2[i] || 0;

            if (num1 < num2) return -1;
            if (num1 > num2) return 1;
        }

        return 0;
    }

    /**
     * Migrate data to current version
     */
    migrateData(data) {
        const startVersion = this.getDataVersion(data);
        let migratedData = { ...data };
        let migrationLog = [];

        console.log(`📦 Starting migration from v${startVersion} to v${this.currentVersion}`);

        // If already at current version, no migration needed
        if (this.compareVersions(startVersion, this.currentVersion) === 0) {
            console.log('✅ Data is already at current version');
            return { data: migratedData, log: [] };
        }

        // Apply migrations in sequence
        const migrationPath = this.getMigrationPath(startVersion, this.currentVersion);

        migrationPath.forEach(migration => {
            console.log(`  🔄 Applying migration: ${migration}`);

            const migrationFn = this.migrations[migration];
            if (migrationFn) {
                try {
                    const result = migrationFn(migratedData);
                    migratedData = result.data;
                    migrationLog.push({
                        migration: migration,
                        success: true,
                        changes: result.changes
                    });
                    console.log(`  ✅ Migration ${migration} completed`);
                } catch (error) {
                    console.error(`  ❌ Migration ${migration} failed:`, error);
                    migrationLog.push({
                        migration: migration,
                        success: false,
                        error: error.message
                    });
                }
            } else {
                console.warn(`  ⚠️ Migration function not found: ${migration}`);
            }
        });

        // Update version
        migratedData.version = this.currentVersion;
        migratedData.migrationHistory = migrationLog;

        console.log(`✅ Migration complete. Data is now at v${this.currentVersion}`);

        return {
            data: migratedData,
            log: migrationLog
        };
    }

    /**
     * Get migration path between versions
     */
    getMigrationPath(fromVersion, toVersion) {
        // For now, simple path (only one migration available)
        if (fromVersion === '1.0.0' && toVersion === '2.0.0') {
            return ['1.0.0_to_2.0.0'];
        }

        return [];
    }

    /**
     * Migration: 1.0.0 → 2.0.0
     * Adds multi-dimensional scoring metadata, normalizes structure
     */
    migrate_1_0_0_to_2_0_0(data) {
        const changes = [];
        const newData = JSON.parse(JSON.stringify(data)); // Deep clone

        // Add version metadata
        newData.version = '2.0.0';
        newData.schemaVersion = '2.0.0';
        newData.migratedAt = new Date().toISOString();
        changes.push('Added version metadata');

        // Add multi-dimensional scoring metadata to options
        if (newData.businessUnits) {
            newData.businessUnits.forEach(bu => {
                if (bu.questions) {
                    bu.questions.forEach(question => {
                        if (question.options) {
                            question.options.forEach(option => {
                                // Add quality improvement metrics
                                if (!option.qualityImpact) {
                                    const aiSavings = option.savingsPct || 0;
                                    option.qualityImpact = {
                                        accuracy: aiSavings > 60 ? 25 : aiSavings > 30 ? 15 : 5,
                                        consistency: aiSavings > 60 ? 40 : aiSavings > 30 ? 25 : 10,
                                        biasReduction: aiSavings > 60 ? 30 : aiSavings > 30 ? 20 : 10
                                    };
                                }

                                // Add satisfaction impact metrics
                                if (!option.satisfactionImpact) {
                                    const hours = option.hours || 0;
                                    const aiSavings = option.savingsPct || 0;
                                    option.satisfactionImpact = {
                                        recruiter: hours > 5 && aiSavings > 50 ? 35 : hours > 2 ? 20 : 10,
                                        hiringManager: hours > 5 && aiSavings > 50 ? 20 : hours > 2 ? 10 : 5,
                                        candidate: hours > 5 && aiSavings > 50 ? 15 : hours > 2 ? 8 : 3
                                    };
                                }

                                // Add risk reduction metrics
                                if (!option.riskReduction) {
                                    const aiSavings = option.savingsPct || 0;
                                    const isCompliance = bu.id === 'compliance';
                                    const isContracts = bu.id === 'contracts';

                                    option.riskReduction = {
                                        compliance: isCompliance && aiSavings > 40 ? 40 : 10,
                                        dataSecurity: isCompliance && aiSavings > 40 ? 35 : 5,
                                        humanError: aiSavings > 50 ? 30 : aiSavings > 30 ? 20 : 10,
                                        processFailure: (isCompliance || isContracts) && aiSavings > 40 ? 25 : 15
                                    };
                                }
                            });
                        }
                    });
                }
            });
            changes.push('Added multi-dimensional scoring metadata to all options');
        }

        // Add changelog reference
        if (!newData.changelog) {
            newData.changelog = this.getChangelog();
            changes.push('Added changelog reference');
        }

        return {
            data: newData,
            changes: changes
        };
    }

    /**
     * Validate migrated data
     */
    validateMigratedData(data) {
        const errors = [];
        const warnings = [];

        // Check version
        if (!data.version) {
            errors.push('Missing version field');
        }

        // Check business units
        if (!data.businessUnits || !Array.isArray(data.businessUnits)) {
            errors.push('Missing or invalid businessUnits array');
        } else {
            // Check each business unit
            data.businessUnits.forEach((bu, buIndex) => {
                if (!bu.id) errors.push(`Business unit ${buIndex} missing id`);
                if (!bu.questions || !Array.isArray(bu.questions)) {
                    errors.push(`Business unit ${bu.id} missing questions array`);
                } else {
                    // Check each question
                    bu.questions.forEach((q, qIndex) => {
                        if (!q.id) errors.push(`Question ${qIndex} in ${bu.id} missing id`);
                        if (!q.options || !Array.isArray(q.options)) {
                            errors.push(`Question ${q.id} missing options array`);
                        } else {
                            // Check options have required fields
                            q.options.forEach((opt, optIndex) => {
                                if (!opt.value) {
                                    errors.push(`Option ${optIndex} in question ${q.id} missing value`);
                                }

                                // Check for multi-dimensional metadata (v2.0.0+)
                                if (this.compareVersions(data.version, '2.0.0') >= 0) {
                                    if (!opt.qualityImpact) {
                                        warnings.push(`Option ${opt.value} in ${q.id} missing qualityImpact`);
                                    }
                                    if (!opt.satisfactionImpact) {
                                        warnings.push(`Option ${opt.value} in ${q.id} missing satisfactionImpact`);
                                    }
                                    if (!opt.riskReduction) {
                                        warnings.push(`Option ${opt.value} in ${q.id} missing riskReduction`);
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings
        };
    }

    /**
     * Generate migration report
     */
    generateMigrationReport(migrationResult) {
        const { data, log } = migrationResult;

        let report = '\n' + '='.repeat(60) + '\n';
        report += '📦 DATA MIGRATION REPORT\n';
        report += '='.repeat(60) + '\n\n';

        report += `From Version: ${log.length > 0 ? log[0].migration.split('_to_')[0] : 'Unknown'}\n`;
        report += `To Version: ${data.version}\n`;
        report += `Migrated At: ${data.migratedAt || new Date().toISOString()}\n\n`;

        if (log.length > 0) {
            report += '🔄 Migrations Applied:\n';
            report += '─'.repeat(60) + '\n';
            log.forEach((entry, index) => {
                report += `${index + 1}. ${entry.migration}\n`;
                report += `   Status: ${entry.success ? '✅ Success' : '❌ Failed'}\n`;
                if (entry.changes) {
                    report += `   Changes:\n`;
                    entry.changes.forEach(change => {
                        report += `     • ${change}\n`;
                    });
                }
                if (entry.error) {
                    report += `   Error: ${entry.error}\n`;
                }
                report += '\n';
            });
        } else {
            report += '✅ No migrations needed (data already at current version)\n\n';
        }

        // Validation
        const validation = this.validateMigratedData(data);
        report += '\n📋 Validation Results:\n';
        report += '─'.repeat(60) + '\n';
        report += `Status: ${validation.isValid ? '✅ Valid' : '❌ Invalid'}\n`;

        if (validation.errors.length > 0) {
            report += `\n🔴 Errors (${validation.errors.length}):\n`;
            validation.errors.forEach((error, index) => {
                report += `  ${index + 1}. ${error}\n`;
            });
        }

        if (validation.warnings.length > 0) {
            report += `\n🟡 Warnings (${validation.warnings.length}):\n`;
            validation.warnings.forEach((warning, index) => {
                report += `  ${index + 1}. ${warning}\n`;
            });
        }

        if (validation.isValid && validation.warnings.length === 0) {
            report += '\n✅ All validation checks passed\n';
        }

        report += '\n' + '='.repeat(60) + '\n';

        return report;
    }

    /**
     * Log migration report to console
     */
    logMigrationReport(migrationResult) {
        console.log(this.generateMigrationReport(migrationResult));
    }

    /**
     * Get version info
     */
    getVersionInfo() {
        return {
            current: this.currentVersion,
            changelog: this.changelog,
            availableMigrations: Object.keys(this.migrations),
            lastUpdate: this.changelog[0]?.date || 'Unknown'
        };
    }

    /**
     * Check compatibility
     */
    isCompatible(dataVersion) {
        // Major version must match
        const dataMajor = parseInt(dataVersion.split('.')[0]);
        const currentMajor = parseInt(this.currentVersion.split('.')[0]);

        return dataMajor === currentMajor;
    }

    /**
     * Get breaking changes between versions
     */
    getBreakingChanges(fromVersion, toVersion) {
        const breakingChanges = [];

        this.changelog.forEach(entry => {
            if (entry.breaking &&
                this.compareVersions(entry.version, fromVersion) > 0 &&
                this.compareVersions(entry.version, toVersion) <= 0) {
                breakingChanges.push(entry);
            }
        });

        return breakingChanges;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.DataVersioning = DataVersioning;
}
