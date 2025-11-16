/**
 * PHASE 2 - WORKSHOPS GOOGLE SHEET SETUP
 * ========================================
 *
 * Creates a Google Sheet to manage Interactive Workshops
 *
 * SETUP:
 * 1. Go to: https://script.google.com
 * 2. Click: New Project
 * 3. Copy ALL code from this file
 * 4. Paste into the editor
 * 5. Click: Run > createWorkshopsSheet
 * 6. Authorize when asked
 * 7. COPY the Sheet ID from logs
 */

function createWorkshopsSheet() {
  // Create new spreadsheet
  var spreadsheet = SpreadsheetApp.create('GBS Workshops - Admin CMS');
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ============================================
  // SHEET 1: WORKSHOPS
  // ============================================
  var workshopsSheet = ss.getActiveSheet();
  workshopsSheet.setName('Workshops');

  var headers = [
    'ID',
    'Title',
    'Icon',
    'Icon Color',
    'Date',
    'Time',
    'Timezone',
    'Duration',
    'Instructor',
    'Description',
    'Status',
    'Registration Link',
    'Max Participants',
    'Current Participants',
    'Order',
    'Last Updated',
    'Created Date'
  ];

  // Set headers
  workshopsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format header row
  workshopsSheet.getRange(1, 1, 1, headers.length)
    .setBackground('#4A90E2')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Set column widths
  workshopsSheet.setColumnWidth(1, 120);  // ID
  workshopsSheet.setColumnWidth(2, 300);  // Title
  workshopsSheet.setColumnWidth(3, 80);   // Icon
  workshopsSheet.setColumnWidth(4, 120);  // Icon Color
  workshopsSheet.setColumnWidth(5, 120);  // Date
  workshopsSheet.setColumnWidth(6, 100);  // Time
  workshopsSheet.setColumnWidth(7, 100);  // Timezone
  workshopsSheet.setColumnWidth(8, 100);  // Duration
  workshopsSheet.setColumnWidth(9, 200);  // Instructor
  workshopsSheet.setColumnWidth(10, 400); // Description
  workshopsSheet.setColumnWidth(11, 120); // Status
  workshopsSheet.setColumnWidth(12, 300); // Registration Link
  workshopsSheet.setColumnWidth(13, 120); // Max Participants
  workshopsSheet.setColumnWidth(14, 150); // Current Participants
  workshopsSheet.setColumnWidth(15, 80);  // Order
  workshopsSheet.setColumnWidth(16, 150); // Last Updated
  workshopsSheet.setColumnWidth(17, 150); // Created Date

  // Add data validation
  var lastRow = workshopsSheet.getMaxRows();

  // Icon Color dropdown (Tailwind colors)
  var iconColorRange = workshopsSheet.getRange(2, 4, lastRow - 1);
  var iconColorRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'bg-orange-100',
      'bg-yellow-100',
      'bg-blue-100',
      'bg-purple-100',
      'bg-green-100',
      'bg-pink-100',
      'bg-red-100',
      'bg-indigo-100'
    ], true)
    .setAllowInvalid(false)
    .build();
  iconColorRange.setDataValidation(iconColorRule);

  // Timezone dropdown
  var timezoneRange = workshopsSheet.getRange(2, 7, lastRow - 1);
  var timezoneRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['EST', 'PST', 'CST', 'GMT', 'CET', 'IST', 'JST'], true)
    .setAllowInvalid(false)
    .build();
  timezoneRange.setDataValidation(timezoneRule);

  // Status dropdown
  var statusRange = workshopsSheet.getRange(2, 11, lastRow - 1);
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Coming Soon', 'Open', 'Full', 'Completed', 'Cancelled'], true)
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(statusRule);

  // Add sample data
  var sampleData = [
    [
      'workshop-1',
      'AI-Powered Sourcing Masterclass',
      '🤖',
      'bg-orange-100',
      'July 15, 2024',
      '10:00 AM',
      'EST',
      '90 minutes',
      'Will be revealed',
      'Dive deep into advanced sourcing techniques using AI tools to find top-tier candidates faster.',
      'Coming Soon',
      '',
      50,
      0,
      1,
      new Date(),
      new Date()
    ],
    [
      'workshop-2',
      'Prompt Engineering for Recruiters',
      '✨',
      'bg-yellow-100',
      'July 22, 2024',
      '1:00 PM',
      'EST',
      '2 hours',
      'Will be revealed',
      'Learn the CREATE framework and craft powerful prompts that deliver precise results for any GBS task.',
      'Coming Soon',
      '',
      40,
      0,
      2,
      new Date(),
      new Date()
    ]
  ];

  workshopsSheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData);

  // Freeze header row
  workshopsSheet.setFrozenRows(1);

  // ============================================
  // SHEET 2: SETTINGS
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
    ['Default Duration', '90 minutes', 'Default workshop duration'],
    ['Default Max Participants', '50', 'Default maximum participants']
  ];

  settingsSheet.getRange(2, 1, settingsData.length, settingsData[0].length).setValues(settingsData);

  // Highlight password cell
  settingsSheet.getRange(2, 2)
    .setBackground('#fff3cd')
    .setNote('⚠️ CHANGE THIS PASSWORD!');

  // ============================================
  // FINAL TOUCHES
  // ============================================

  // Activate Workshops sheet
  ss.setActiveSheet(workshopsSheet);

  // Get spreadsheet URL and ID
  var url = ss.getUrl();
  var id = ss.getId();

  // Log success message
  Logger.log('✅ Workshops Sheet Created Successfully!');
  Logger.log('📊 Sheet Name: GBS Workshops - Admin CMS');
  Logger.log('🔗 URL: ' + url);
  Logger.log('🆔 SHEET ID: ' + id);
  Logger.log('');
  Logger.log('⚠️ IMPORTANT: Copy the Sheet ID above!');
  Logger.log('');
  Logger.log('📝 Next Steps:');
  Logger.log('1. CHANGE THE PASSWORD in Settings sheet');
  Logger.log('2. Copy the Sheet ID');
  Logger.log('3. Proceed to Web App setup (4-WEBAPP-Workshops-Manager.gs)');

  // Show success dialog
  var ui = SpreadsheetApp.getUi();
  ui.alert(
    '✅ Success!',
    'Workshops Sheet created successfully!\n\n' +
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
