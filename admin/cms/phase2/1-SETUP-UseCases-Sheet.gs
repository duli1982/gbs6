/**
 * PHASE 2 - USE CASES GOOGLE SHEET SETUP
 * ========================================
 *
 * Creates a Google Sheet to manage AI Success Stories / Use Cases
 *
 * SETUP:
 * 1. Go to: https://script.google.com
 * 2. Click: New Project
 * 3. Copy ALL code from this file
 * 4. Paste into the editor
 * 5. Click: Run > createUseCasesSheet
 * 6. Authorize when asked
 * 7. COPY the Sheet ID from logs
 *
 * WHAT IT CREATES:
 * - Use Cases sheet (main data)
 * - Categories sheet (category definitions)
 * - Settings sheet (admin password)
 */

function createUseCasesSheet() {
  // Create new spreadsheet
  var spreadsheet = SpreadsheetApp.create('GBS Use Cases - Admin CMS');
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ============================================
  // SHEET 1: USE CASES
  // ============================================
  var useCasesSheet = ss.getActiveSheet();
  useCasesSheet.setName('Use Cases');

  // Define headers with detailed field names
  var headers = [
    'ID',
    'Title',
    'Icon',
    'Category',
    'Difficulty',
    'Impact Stat',
    'Time Metric',
    'Time Metric Label',
    'Improvement Metric',
    'Improvement Metric Label',
    'Quality Metric',
    'Quality Metric Label',
    'Prerequisites',
    'Getting Started Step 1',
    'Getting Started Step 2',
    'Getting Started Step 3',
    'Common Pitfall 1 Title',
    'Common Pitfall 1 Description',
    'Common Pitfall 2 Title',
    'Common Pitfall 2 Description',
    'Example Section Title',
    'Example Section Content',
    'GBS Prompt Link',
    'Demo Type',
    'Status',
    'Order',
    'Last Updated',
    'Created Date'
  ];

  // Set headers
  useCasesSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format header row
  useCasesSheet.getRange(1, 1, 1, headers.length)
    .setBackground('#4A90E2')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Set column widths
  useCasesSheet.setColumnWidth(1, 120);  // ID
  useCasesSheet.setColumnWidth(2, 250);  // Title
  useCasesSheet.setColumnWidth(3, 80);   // Icon
  useCasesSheet.setColumnWidth(4, 150);  // Category
  useCasesSheet.setColumnWidth(5, 120);  // Difficulty
  useCasesSheet.setColumnWidth(6, 150);  // Impact Stat
  useCasesSheet.setColumnWidth(7, 150);  // Time Metric
  useCasesSheet.setColumnWidth(8, 150);  // Time Metric Label
  useCasesSheet.setColumnWidth(9, 150);  // Improvement Metric
  useCasesSheet.setColumnWidth(10, 150); // Improvement Metric Label
  useCasesSheet.setColumnWidth(11, 150); // Quality Metric
  useCasesSheet.setColumnWidth(12, 150); // Quality Metric Label
  useCasesSheet.setColumnWidth(13, 300); // Prerequisites
  useCasesSheet.setColumnWidth(14, 300); // Step 1
  useCasesSheet.setColumnWidth(15, 300); // Step 2
  useCasesSheet.setColumnWidth(16, 300); // Step 3
  useCasesSheet.setColumnWidth(17, 200); // Pitfall 1 Title
  useCasesSheet.setColumnWidth(18, 300); // Pitfall 1 Desc
  useCasesSheet.setColumnWidth(19, 200); // Pitfall 2 Title
  useCasesSheet.setColumnWidth(20, 300); // Pitfall 2 Desc
  useCasesSheet.setColumnWidth(21, 200); // Example Title
  useCasesSheet.setColumnWidth(22, 400); // Example Content
  useCasesSheet.setColumnWidth(23, 300); // GBS Link
  useCasesSheet.setColumnWidth(24, 150); // Demo Type
  useCasesSheet.setColumnWidth(25, 100); // Status
  useCasesSheet.setColumnWidth(26, 80);  // Order
  useCasesSheet.setColumnWidth(27, 150); // Last Updated
  useCasesSheet.setColumnWidth(28, 150); // Created Date

  // Add data validation
  var lastRow = useCasesSheet.getMaxRows();

  // Category dropdown
  var categoryRange = useCasesSheet.getRange(2, 4, lastRow - 1);
  var categoryRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Talent Sourcing', 'Content Creation', 'Data Analysis', 'Communication'], true)
    .setAllowInvalid(false)
    .build();
  categoryRange.setDataValidation(categoryRule);

  // Difficulty dropdown
  var difficultyRange = useCasesSheet.getRange(2, 5, lastRow - 1);
  var difficultyRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Beginner', 'Intermediate', 'Advanced'], true)
    .setAllowInvalid(false)
    .build();
  difficultyRange.setDataValidation(difficultyRule);

  // Status dropdown
  var statusRange = useCasesSheet.getRange(2, 25, lastRow - 1);
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Active', 'Draft', 'Archived'], true)
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(statusRule);

  // Add sample data
  var sampleData = [
    [
      'usecase-1',
      'AI-Powered Boolean Search Generation',
      '🔍',
      'Talent Sourcing',
      'Beginner',
      '75% Time Saved',
      '45min → 10min',
      'Search Creation',
      '+300%',
      'Search Variations',
      '+40%',
      'Quality Matches',
      '• Basic understanding of Boolean operators\n• Access to LinkedIn Recruiter or similar platform\n• Job requirements document',
      'Prepare your input: Gather job title, required skills, and experience level',
      'Use AI prompt: "Generate Boolean search for [job title] with [skills]"',
      'Test & refine: Run search on your platform and adjust based on results',
      'Over-complexity',
      'Don\'t add too many OR conditions - keep searches focused',
      'Platform differences',
      'Boolean syntax varies between LinkedIn, Indeed, etc.',
      'Real Example:',
      'Input: "Senior Java Developer with microservices experience"\nAI Output: (Java OR "Java Developer") AND (Senior OR "Sr." OR Lead) AND (microservices OR "micro services" OR "service oriented") AND -junior -intern',
      '../gbs-prompts/index.html#recruitment-1',
      'sourcing-demo',
      'Active',
      1,
      new Date(),
      new Date()
    ]
  ];

  useCasesSheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData);

  // Freeze header row
  useCasesSheet.setFrozenRows(1);

  // ============================================
  // SHEET 2: CATEGORIES
  // ============================================
  var categoriesSheet = ss.insertSheet('Categories');

  var catHeaders = ['Category', 'Badge Color', 'Card Color', 'Icon', 'Description'];
  categoriesSheet.getRange(1, 1, 1, catHeaders.length).setValues([catHeaders]);

  categoriesSheet.getRange(1, 1, 1, catHeaders.length)
    .setBackground('#4A90E2')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');

  categoriesSheet.setColumnWidth(1, 200);
  categoriesSheet.setColumnWidth(2, 150);
  categoriesSheet.setColumnWidth(3, 150);
  categoriesSheet.setColumnWidth(4, 100);
  categoriesSheet.setColumnWidth(5, 400);

  var categoryData = [
    ['Talent Sourcing', '#1976d2', 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', '🔍', 'AI-powered candidate sourcing and search strategies'],
    ['Content Creation', '#388e3c', 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)', '✍️', 'Creating job descriptions, outreach messages, and content'],
    ['Data Analysis', '#c2185b', 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)', '📊', 'Market research, analytics, and data-driven insights'],
    ['Communication', '#f57c00', 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)', '💬', 'Candidate outreach and communication strategies']
  ];

  categoriesSheet.getRange(2, 1, categoryData.length, categoryData[0].length).setValues(categoryData);

  // ============================================
  // SHEET 3: SETTINGS
  // ============================================
  var settingsSheet = ss.insertSheet('Settings');

  var settingsHeaders = ['Setting', 'Value', 'Description'];
  settingsSheet.getRange(1, 1, 1, settingsHeaders.length).setValues([settingsHeaders]);

  settingsSheet.getRange(1, 1, 1, settingsHeaders.length)
    .setBackground('#4A90E2')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');

  settingsSheet.setColumnWidth(1, 200);
  settingsSheet.setColumnWidth(2, 200);
  settingsSheet.setColumnWidth(3, 400);

  var settingsData = [
    ['Admin Password', 'admin123', 'Password for write operations (CHANGE THIS!)'],
    ['Max Featured', '6', 'Maximum number of featured use cases on homepage'],
    ['Default Status', 'Active', 'Default status for new use cases']
  ];

  settingsSheet.getRange(2, 1, settingsData.length, settingsData[0].length).setValues(settingsData);

  // Highlight password cell
  settingsSheet.getRange(2, 2)
    .setBackground('#fff3cd')
    .setNote('⚠️ CHANGE THIS PASSWORD! This protects your CMS from unauthorized changes.');

  // ============================================
  // FINAL TOUCHES
  // ============================================

  // Activate Use Cases sheet
  ss.setActiveSheet(useCasesSheet);

  // Get spreadsheet URL and ID
  var url = ss.getUrl();
  var id = ss.getId();

  // Log success message
  Logger.log('✅ Use Cases Sheet Created Successfully!');
  Logger.log('📊 Sheet Name: GBS Use Cases - Admin CMS');
  Logger.log('🔗 URL: ' + url);
  Logger.log('🆔 SHEET ID: ' + id);
  Logger.log('');
  Logger.log('⚠️ IMPORTANT: Copy the Sheet ID above!');
  Logger.log('You will need it for the Web App setup.');
  Logger.log('');
  Logger.log('📝 Next Steps:');
  Logger.log('1. Open the Settings sheet');
  Logger.log('2. CHANGE THE PASSWORD from "admin123" to something secure');
  Logger.log('3. Copy the Sheet ID');
  Logger.log('4. Proceed to setup the Web App (2-WEBAPP-UseCases-Manager.gs)');

  // Show success dialog
  var ui = SpreadsheetApp.getUi();
  ui.alert(
    '✅ Success!',
    'Use Cases Sheet created successfully!\n\n' +
    '📊 Sheet ID: ' + id + '\n\n' +
    'IMPORTANT:\n' +
    '1. Go to Settings sheet\n' +
    '2. CHANGE THE PASSWORD\n' +
    '3. Copy the Sheet ID\n' +
    '4. Proceed to Web App setup',
    ui.ButtonSet.OK
  );

  return spreadsheet;
}

/**
 * Helper function to create a new Use Cases sheet in existing spreadsheet
 */
function addUseCasesSheetToExisting() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Check if sheet already exists
  if (ss.getSheetByName('Use Cases')) {
    Logger.log('⚠️ Use Cases sheet already exists!');
    return;
  }

  // Run the main creation function but on existing spreadsheet
  createUseCasesSheet();
}
