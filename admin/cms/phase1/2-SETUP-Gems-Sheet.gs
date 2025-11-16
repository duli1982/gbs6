/**
 * PHASE 1 - GEMS COLLECTION MANAGEMENT
 * Google Sheets Setup Script
 * ============================
 *
 * This script creates a Google Sheet to manage Gemini Gems Collection
 *
 * HOW TO USE:
 * 1. Go to: https://script.google.com
 * 2. New Project
 * 3. Copy/paste this entire script
 * 4. Run: createGemsSheet
 * 5. Authorize when asked
 * 6. Copy the Sheet ID from logs
 */

function createGemsSheet() {
  // Create spreadsheet
  var spreadsheet = SpreadsheetApp.create('GBS Gems Collection - Admin CMS');

  // Create sheets
  var gemsSheet = spreadsheet.getActiveSheet();
  gemsSheet.setName('Gems');

  var categoriesSheet = spreadsheet.insertSheet('Categories');
  var settingsSheet = spreadsheet.insertSheet('Settings');

  // ========================================
  // GEMS SHEET
  // ========================================
  var gemsHeaders = [
    'ID',
    'Gem ID',
    'Title',
    'Description',
    'Category',
    'Use Case',
    'Instructions',
    'Example Input',
    'Example Output',
    'Tips',
    'Featured',
    'Order',
    'Status',
    'Created By',
    'Last Updated',
    'Created Date'
  ];

  gemsSheet.getRange(1, 1, 1, gemsHeaders.length).setValues([gemsHeaders]);

  // Format headers
  var headerRange = gemsSheet.getRange(1, 1, 1, gemsHeaders.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#9333EA');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setHorizontalAlignment('center');

  // Set column widths
  gemsSheet.setColumnWidth(1, 80);   // ID
  gemsSheet.setColumnWidth(2, 150);  // Gem ID
  gemsSheet.setColumnWidth(3, 250);  // Title
  gemsSheet.setColumnWidth(4, 350);  // Description
  gemsSheet.setColumnWidth(5, 150);  // Category
  gemsSheet.setColumnWidth(6, 200);  // Use Case
  gemsSheet.setColumnWidth(7, 300);  // Instructions
  gemsSheet.setColumnWidth(8, 250);  // Example Input
  gemsSheet.setColumnWidth(9, 250);  // Example Output
  gemsSheet.setColumnWidth(10, 250); // Tips
  gemsSheet.setColumnWidth(11, 80);  // Featured
  gemsSheet.setColumnWidth(12, 60);  // Order
  gemsSheet.setColumnWidth(13, 100); // Status
  gemsSheet.setColumnWidth(14, 120); // Created By
  gemsSheet.setColumnWidth(15, 120); // Last Updated
  gemsSheet.setColumnWidth(16, 120); // Created Date

  // Freeze header
  gemsSheet.setFrozenRows(1);

  // Add data validation for Featured
  var featuredRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Yes', 'No'], true)
    .setAllowInvalid(false)
    .build();
  gemsSheet.getRange('K2:K1000').setDataValidation(featuredRule);

  // Add data validation for Status
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Active', 'Draft', 'Archived'], true)
    .setAllowInvalid(false)
    .build();
  gemsSheet.getRange('M2:M1000').setDataValidation(statusRule);

  // ========================================
  // CATEGORIES SHEET
  // ========================================
  var categoriesHeaders = ['Category', 'Icon', 'Description', 'Color', 'Order'];
  categoriesSheet.getRange(1, 1, 1, categoriesHeaders.length).setValues([categoriesHeaders]);

  var catHeaderRange = categoriesSheet.getRange(1, 1, 1, categoriesHeaders.length);
  catHeaderRange.setFontWeight('bold');
  catHeaderRange.setBackground('#10B981');
  catHeaderRange.setFontColor('#FFFFFF');
  catHeaderRange.setHorizontalAlignment('center');

  categoriesSheet.setColumnWidth(1, 200);
  categoriesSheet.setColumnWidth(2, 80);
  categoriesSheet.setColumnWidth(3, 350);
  categoriesSheet.setColumnWidth(4, 100);
  categoriesSheet.setColumnWidth(5, 80);

  categoriesSheet.setFrozenRows(1);

  // Add sample categories
  var sampleCategories = [
    ['Recruitment', '👥', 'Recruitment and sourcing gems', '#3B82F6', 1],
    ['Communication', '💬', 'Email and communication gems', '#10B981', 2],
    ['Data Analysis', '📊', 'Data processing and analysis gems', '#8B5CF6', 3],
    ['Content Creation', '✍️', 'Content writing and creation gems', '#F59E0B', 4],
    ['Research', '🔍', 'Research and information gathering', '#EF4444', 5],
    ['Training', '📚', 'Learning and development gems', '#06B6D4', 6]
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
    ['Auto Generate ID', 'TRUE', 'Automatically generate gem IDs'],
    ['Default Status', 'Active', 'Default status for new gems'],
    ['Max Featured Gems', '6', 'Maximum number of featured gems to display']
  ];

  settingsSheet.getRange(2, 1, settings.length, settings[0].length).setValues(settings);

  // ========================================
  // CREATE SAMPLE GEM
  // ========================================
  var sampleGem = [[
    'gem-001',
    'ABC123DEF456',
    'Job Description Writer',
    'Creates professional, inclusive job descriptions optimized for your specific roles and company culture.',
    'Recruitment',
    'Writing compelling job postings',
    '1. Enter the job title\n2. Provide key responsibilities\n3. List required qualifications\n4. Add company culture notes',
    'Job Title: Senior Software Engineer\nResponsibilities: Lead development team, architect solutions...',
    'Professional job description with inclusive language, clear requirements, and SEO optimization.',
    'Be specific about must-have vs nice-to-have skills. Include salary range for transparency.',
    'Yes',
    1,
    'Active',
    'Admin',
    new Date(),
    new Date()
  ]];

  gemsSheet.getRange(2, 1, 1, sampleGem[0].length).setValues(sampleGem);

  // ========================================
  // SUCCESS MESSAGE
  // ========================================
  Logger.log('✅ GBS Gems Sheet created successfully!');
  Logger.log('📊 Sheet Name: ' + spreadsheet.getName());
  Logger.log('🔗 URL: ' + spreadsheet.getUrl());
  Logger.log('📝 Sheet ID: ' + spreadsheet.getId());
  Logger.log('\n⚠️ IMPORTANT:');
  Logger.log('1. Copy the Sheet ID above');
  Logger.log('2. Change the Admin Password in Settings sheet');
  Logger.log('3. Use this ID in the Web App script');

  SpreadsheetApp.getUi().alert(
    '✅ Success!',
    'GBS Gems Collection Sheet created!\n\n' +
    'Sheet ID: ' + spreadsheet.getId() + '\n\n' +
    'IMPORTANT:\n' +
    '1. Copy this Sheet ID\n' +
    '2. Go to Settings sheet and change the password\n' +
    '3. Add your gems to the Gems sheet\n\n' +
    'Find the sheet in your Google Drive.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );

  return spreadsheet;
}

/**
 * Test function to verify sheet access
 */
function testGemsSheetAccess() {
  var sheetId = 'YOUR_SHEET_ID_HERE'; // Replace with your sheet ID

  try {
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var gemsSheet = spreadsheet.getSheetByName('Gems');

    if (gemsSheet) {
      Logger.log('✅ Gems sheet found!');
      Logger.log('📊 Row count: ' + gemsSheet.getLastRow());
      Logger.log('📋 Headers: ' + gemsSheet.getRange(1, 1, 1, gemsSheet.getLastColumn()).getValues());
    } else {
      Logger.log('❌ Gems sheet not found!');
    }
  } catch (e) {
    Logger.log('❌ Error: ' + e.message);
  }
}
