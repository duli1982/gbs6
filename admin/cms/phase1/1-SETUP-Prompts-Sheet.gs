/**
 * PHASE 1 - PROMPTS MANAGEMENT
 * Google Sheets Setup Script
 * ============================
 *
 * This script creates a Google Sheet to manage GBS Prompts
 *
 * HOW TO USE:
 * 1. Go to: https://script.google.com
 * 2. New Project
 * 3. Copy/paste this entire script
 * 4. Run: createPromptsSheet
 * 5. Authorize when asked
 * 6. Copy the Sheet ID from logs
 */

function createPromptsSheet() {
  // Create spreadsheet
  var spreadsheet = SpreadsheetApp.create('GBS Prompts - Admin CMS');

  // Create sheets
  var promptsSheet = spreadsheet.getActiveSheet();
  promptsSheet.setName('Prompts');

  var categoriesSheet = spreadsheet.insertSheet('Categories');
  var settingsSheet = spreadsheet.insertSheet('Settings');

  // ========================================
  // PROMPTS SHEET
  // ========================================
  var promptsHeaders = [
    'ID',
    'Category',
    'Subcategory',
    'Title',
    'Description',
    'Content',
    'Required Inputs',
    'Difficulty',
    'Estimated Time',
    'Quick Start Steps',
    'Quick Start Tips',
    'Expected Output',
    'Tags',
    'Status',
    'Last Updated',
    'Created Date'
  ];

  promptsSheet.getRange(1, 1, 1, promptsHeaders.length).setValues([promptsHeaders]);

  // Format headers
  var headerRange = promptsSheet.getRange(1, 1, 1, promptsHeaders.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4A90E2');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setHorizontalAlignment('center');

  // Set column widths
  promptsSheet.setColumnWidth(1, 80);   // ID
  promptsSheet.setColumnWidth(2, 150);  // Category
  promptsSheet.setColumnWidth(3, 200);  // Subcategory
  promptsSheet.setColumnWidth(4, 250);  // Title
  promptsSheet.setColumnWidth(5, 300);  // Description
  promptsSheet.setColumnWidth(6, 400);  // Content
  promptsSheet.setColumnWidth(7, 150);  // Required Inputs
  promptsSheet.setColumnWidth(8, 100);  // Difficulty
  promptsSheet.setColumnWidth(9, 120);  // Estimated Time
  promptsSheet.setColumnWidth(10, 300); // Quick Start Steps
  promptsSheet.setColumnWidth(11, 300); // Quick Start Tips
  promptsSheet.setColumnWidth(12, 300); // Expected Output
  promptsSheet.setColumnWidth(13, 150); // Tags
  promptsSheet.setColumnWidth(14, 100); // Status
  promptsSheet.setColumnWidth(15, 120); // Last Updated
  promptsSheet.setColumnWidth(16, 120); // Created Date

  // Freeze header
  promptsSheet.setFrozenRows(1);

  // Add data validation for Difficulty
  var difficultyRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Beginner', 'Intermediate', 'Advanced'], true)
    .setAllowInvalid(false)
    .build();
  promptsSheet.getRange('H2:H1000').setDataValidation(difficultyRule);

  // Add data validation for Status
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Active', 'Draft', 'Archived'], true)
    .setAllowInvalid(false)
    .build();
  promptsSheet.getRange('N2:N1000').setDataValidation(statusRule);

  // ========================================
  // CATEGORIES SHEET
  // ========================================
  var categoriesHeaders = ['Category', 'Subcategory', 'Icon', 'Description', 'Order'];
  categoriesSheet.getRange(1, 1, 1, categoriesHeaders.length).setValues([categoriesHeaders]);

  var catHeaderRange = categoriesSheet.getRange(1, 1, 1, categoriesHeaders.length);
  catHeaderRange.setFontWeight('bold');
  catHeaderRange.setBackground('#10B981');
  catHeaderRange.setFontColor('#FFFFFF');
  catHeaderRange.setHorizontalAlignment('center');

  categoriesSheet.setColumnWidth(1, 200);
  categoriesSheet.setColumnWidth(2, 250);
  categoriesSheet.setColumnWidth(3, 80);
  categoriesSheet.setColumnWidth(4, 300);
  categoriesSheet.setColumnWidth(5, 80);

  categoriesSheet.setFrozenRows(1);

  // Add sample categories
  var sampleCategories = [
    ['Recruitment', 'Understand the Role and Job Market', '🎯', 'Market analysis and role insights', 1],
    ['Recruitment', 'Write Job Descriptions', '📝', 'Create compelling job postings', 2],
    ['Sourcing Strategy', 'Boolean Search Strings', '🔍', 'Advanced search techniques', 1],
    ['Communication', 'Email Templates', '📧', 'Professional communication', 1],
    ['Data Analysis', 'Resume Screening', '📊', 'Candidate evaluation', 1]
  ];

  categoriesSheet.getRange(2, 1, sampleCategories.length, sampleCategories[0].length)
    .setValues(sampleCategories);

  // ========================================
  // SETTINGS SHEET
  // ========================================
  var settingsHeaders = ['Setting', 'Value', 'Description'];
  settingsSheet.getRange(1, 1, 1, settingsHeaders.length).setValues([settingsHeaders]);

  var setHeaderRange = settingsSheet.getRange(1, 1, 1, settingsHeaders.length);
  setHeaderRange.setFontWeight('bold');
  setHeaderRange.setBackground('#F59E0B');
  setHeaderRange.setFontColor('#FFFFFF');
  setHeaderRange.setHorizontalAlignment('center');

  settingsSheet.setColumnWidth(1, 200);
  settingsSheet.setColumnWidth(2, 300);
  settingsSheet.setColumnWidth(3, 400);

  settingsSheet.setFrozenRows(1);

  // Add settings
  var settings = [
    ['Admin Password', 'admin123', 'Password for admin panel (CHANGE THIS!)'],
    ['JSON Output URL', '', 'URL where JSON will be published'],
    ['Auto Generate ID', 'TRUE', 'Automatically generate prompt IDs'],
    ['Default Status', 'Active', 'Default status for new prompts'],
    ['Enable Drafts', 'TRUE', 'Allow draft prompts']
  ];

  settingsSheet.getRange(2, 1, settings.length, settings[0].length).setValues(settings);

  // ========================================
  // CREATE SAMPLE PROMPT
  // ========================================
  var samplePrompt = [[
    'recruitment-1',
    'Recruitment',
    'Understand the Role and Job Market',
    'Comprehensive Role Analysis',
    'Analyze roles comprehensively including responsibilities, skills, qualifications, and current market trends.',
    'Act as a Recruitment Specialist. Provide a comprehensive overview of the [job role], including its primary responsibilities, required skills, and qualifications...',
    'job role name',
    'Beginner',
    '5-10 minutes',
    '1. Replace [job role] with specific position\n2. Copy prompt to AI tool\n3. Review analysis\n4. Use for hiring decisions',
    '• Be specific with job titles\n• Add location for salary data\n• Save for future reference',
    'A detailed report covering job responsibilities, required skills, market demand, salary ranges, and growth prospects.',
    'recruitment, job analysis, market research',
    'Active',
    new Date(),
    new Date()
  ]];

  promptsSheet.getRange(2, 1, 1, samplePrompt[0].length).setValues(samplePrompt);

  // ========================================
  // SUCCESS MESSAGE
  // ========================================
  Logger.log('✅ GBS Prompts Sheet created successfully!');
  Logger.log('📊 Sheet Name: ' + spreadsheet.getName());
  Logger.log('🔗 URL: ' + spreadsheet.getUrl());
  Logger.log('📝 Sheet ID: ' + spreadsheet.getId());
  Logger.log('\n⚠️ IMPORTANT:');
  Logger.log('1. Copy the Sheet ID above');
  Logger.log('2. Change the Admin Password in Settings sheet');
  Logger.log('3. Use this ID in the Web App script');

  SpreadsheetApp.getUi().alert(
    '✅ Success!',
    'GBS Prompts Sheet created!\n\n' +
    'Sheet ID: ' + spreadsheet.getId() + '\n\n' +
    'IMPORTANT:\n' +
    '1. Copy this Sheet ID\n' +
    '2. Go to Settings sheet and change the password\n' +
    '3. Add your prompts to the Prompts sheet\n\n' +
    'Find the sheet in your Google Drive.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );

  return spreadsheet;
}

/**
 * Test function to verify sheet access
 */
function testPromptsSheetAccess() {
  var sheetId = 'YOUR_SHEET_ID_HERE'; // Replace with your sheet ID

  try {
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var promptsSheet = spreadsheet.getSheetByName('Prompts');

    if (promptsSheet) {
      Logger.log('✅ Prompts sheet found!');
      Logger.log('📊 Row count: ' + promptsSheet.getLastRow());
      Logger.log('📋 Headers: ' + promptsSheet.getRange(1, 1, 1, promptsSheet.getLastColumn()).getValues());
    } else {
      Logger.log('❌ Prompts sheet not found!');
    }
  } catch (e) {
    Logger.log('❌ Error: ' + e.message);
  }
}
