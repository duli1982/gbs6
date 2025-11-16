/**
 * PHASE 2 - KNOWLEDGE CONTENT GOOGLE SHEET SETUP
 * ================================================
 *
 * Creates a Google Sheet to manage Knowledge Content (Videos + Articles)
 *
 * SETUP:
 * 1. Go to: https://script.google.com
 * 2. Click: New Project
 * 3. Copy ALL code from this file
 * 4. Paste into the editor
 * 5. Click: Run > createKnowledgeContentSheet
 * 6. Authorize when asked
 * 7. COPY the Sheet ID from logs
 */

function createKnowledgeContentSheet() {
  // Create new spreadsheet
  var spreadsheet = SpreadsheetApp.create('GBS Knowledge Content - Admin CMS');
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ============================================
  // SHEET 1: VIDEOS
  // ============================================
  var videosSheet = ss.getActiveSheet();
  videosSheet.setName('Videos');

  var videoHeaders = [
    'ID',
    'Title',
    'Duration',
    'Google Drive URL',
    'Category',
    'Description',
    'Order',
    'Status',
    'Last Updated',
    'Created Date'
  ];

  // Set headers
  videosSheet.getRange(1, 1, 1, videoHeaders.length).setValues([videoHeaders]);

  // Format header row
  videosSheet.getRange(1, 1, 1, videoHeaders.length)
    .setBackground('#4A90E2')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Set column widths
  videosSheet.setColumnWidth(1, 120);  // ID
  videosSheet.setColumnWidth(2, 350);  // Title
  videosSheet.setColumnWidth(3, 100);  // Duration
  videosSheet.setColumnWidth(4, 500);  // Drive URL
  videosSheet.setColumnWidth(5, 150);  // Category
  videosSheet.setColumnWidth(6, 400);  // Description
  videosSheet.setColumnWidth(7, 80);   // Order
  videosSheet.setColumnWidth(8, 100);  // Status
  videosSheet.setColumnWidth(9, 150);  // Last Updated
  videosSheet.setColumnWidth(10, 150); // Created Date

  // Add data validation
  var lastRow = videosSheet.getMaxRows();

  // Category dropdown
  var categoryRange = videosSheet.getRange(2, 5, lastRow - 1);
  var categoryRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'Getting Started',
      'Gemini Basics',
      'Gmail',
      'Google Docs',
      'Google Sheets',
      'Google Drive',
      'Google Meet',
      'Google Chat',
      'Google Slides',
      'Advanced Features',
      'Other'
    ], true)
    .setAllowInvalid(false)
    .build();
  categoryRange.setDataValidation(categoryRule);

  // Status dropdown
  var statusRange = videosSheet.getRange(2, 8, lastRow - 1);
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Active', 'Draft', 'Archived'], true)
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(statusRule);

  // Add sample data
  var sampleVideos = [
    [
      'video-1',
      'Start using Gemini and general prompting',
      '7:20',
      'https://drive.google.com/file/d/1mfJbDJcXYyEQuZHm4CYMVuZrhKbGsbEo/preview',
      'Getting Started',
      'Learn the basics of Gemini and how to write effective prompts',
      1,
      'Active',
      new Date(),
      new Date()
    ],
    [
      'video-2',
      'Using Gemini App',
      '9:40',
      'https://drive.google.com/file/d/1TKwELbbQBWF8Famt6fbAUQma6POdw2Yz/preview',
      'Gemini Basics',
      'Comprehensive guide to using the Gemini application',
      2,
      'Active',
      new Date(),
      new Date()
    ]
  ];

  videosSheet.getRange(2, 1, sampleVideos.length, sampleVideos[0].length).setValues(sampleVideos);

  // Freeze header row
  videosSheet.setFrozenRows(1);

  // ============================================
  // SHEET 2: ARTICLES
  // ============================================
  var articlesSheet = ss.insertSheet('Articles');

  var articleHeaders = [
    'ID',
    'Category',
    'Link Title',
    'Link URL',
    'Description',
    'Order',
    'Status',
    'Last Updated',
    'Created Date'
  ];

  articlesSheet.getRange(1, 1, 1, articleHeaders.length).setValues([articleHeaders]);

  articlesSheet.getRange(1, 1, 1, articleHeaders.length)
    .setBackground('#4A90E2')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  articlesSheet.setColumnWidth(1, 120);  // ID
  articlesSheet.setColumnWidth(2, 200);  // Category
  articlesSheet.setColumnWidth(3, 400);  // Link Title
  articlesSheet.setColumnWidth(4, 500);  // Link URL
  articlesSheet.setColumnWidth(5, 400);  // Description
  articlesSheet.setColumnWidth(6, 80);   // Order
  articlesSheet.setColumnWidth(7, 100);  // Status
  articlesSheet.setColumnWidth(8, 150);  // Last Updated
  articlesSheet.setColumnWidth(9, 150);  // Created Date

  // Add data validation for articles
  var articleLastRow = articlesSheet.getMaxRows();

  // Category dropdown (same as videos)
  var articleCatRange = articlesSheet.getRange(2, 2, articleLastRow - 1);
  var articleCatRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'Side Panel',
      'Gmail',
      'Google Docs',
      'Google Drive',
      'Google Sheets',
      'Google Slides',
      'Google Meet',
      'Google Chat',
      'Other'
    ], true)
    .setAllowInvalid(false)
    .build();
  articleCatRange.setDataValidation(articleCatRule);

  // Status dropdown
  var articleStatusRange = articlesSheet.getRange(2, 7, articleLastRow - 1);
  var articleStatusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Active', 'Draft', 'Archived'], true)
    .setAllowInvalid(false)
    .build();
  articleStatusRange.setDataValidation(articleStatusRule);

  // Add sample data
  var sampleArticles = [
    [
      'article-1',
      'Side Panel',
      'Side Panel to collaborate with Gemini',
      'https://support.google.com/a/users/answer/15146419?hl=en&ref_topic=14438752&sjid=2189940629692612600-EU',
      'Learn how to use the Gemini side panel in Google Workspace',
      1,
      'Active',
      new Date(),
      new Date()
    ],
    [
      'article-2',
      'Gmail',
      'Draft emails with Gemini in Gmail',
      'https://support.google.com/mail/answer/13955415?hl=en&ref_topic=13955315&sjid=4621261918311636455-EU',
      'Use Gemini to draft professional emails quickly',
      1,
      'Active',
      new Date(),
      new Date()
    ],
    [
      'article-3',
      'Gmail',
      'Collaborate with Gemini in Gmail',
      'https://support.google.com/mail/answer/14355636?hl=en&co=GENIE.Platform%3DDesktop&sjid=4621261918311636455-EU&oco=0',
      'Advanced Gmail collaboration features with Gemini',
      2,
      'Active',
      new Date(),
      new Date()
    ]
  ];

  articlesSheet.getRange(2, 1, sampleArticles.length, sampleArticles[0].length).setValues(sampleArticles);

  articlesSheet.setFrozenRows(1);

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
    ['Default Video Status', 'Active', 'Default status for new videos'],
    ['Default Article Status', 'Active', 'Default status for new articles']
  ];

  settingsSheet.getRange(2, 1, settingsData.length, settingsData[0].length).setValues(settingsData);

  // Highlight password cell
  settingsSheet.getRange(2, 2)
    .setBackground('#fff3cd')
    .setNote('⚠️ CHANGE THIS PASSWORD!');

  // ============================================
  // FINAL TOUCHES
  // ============================================

  ss.setActiveSheet(videosSheet);

  var url = ss.getUrl();
  var id = ss.getId();

  Logger.log('✅ Knowledge Content Sheet Created Successfully!');
  Logger.log('📊 Sheet Name: GBS Knowledge Content - Admin CMS');
  Logger.log('🔗 URL: ' + url);
  Logger.log('🆔 SHEET ID: ' + id);
  Logger.log('');
  Logger.log('📝 Contains:');
  Logger.log('- Videos sheet (training videos)');
  Logger.log('- Articles sheet (help articles)');
  Logger.log('- Settings sheet');
  Logger.log('');
  Logger.log('⚠️ IMPORTANT:');
  Logger.log('1. CHANGE THE PASSWORD in Settings sheet');
  Logger.log('2. Copy the Sheet ID');
  Logger.log('3. Proceed to Web App setup');

  var ui = SpreadsheetApp.getUi();
  ui.alert(
    '✅ Success!',
    'Knowledge Content Sheet created!\n\n' +
    '📊 Sheet ID: ' + id + '\n\n' +
    'Contains:\n' +
    '• Videos sheet\n' +
    '• Articles sheet\n' +
    '• Settings sheet\n\n' +
    'IMPORTANT:\n' +
    '1. Go to Settings\n' +
    '2. CHANGE PASSWORD\n' +
    '3. Copy Sheet ID\n' +
    '4. Setup Web App',
    ui.ButtonSet.OK
  );

  return spreadsheet;
}
