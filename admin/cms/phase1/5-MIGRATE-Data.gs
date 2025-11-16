/**
 * PHASE 1 - DATA MIGRATION SCRIPT
 * =================================
 *
 * This script migrates existing prompts.json data into Google Sheets
 *
 * HOW TO USE:
 * 1. Copy your existing prompts.json content
 * 2. Paste it into the PROMPTS_JSON variable below
 * 3. Update PROMPTS_SHEET_ID with your sheet ID
 * 4. Run: migratePromptsToSheet()
 * 5. Check your Google Sheet for imported data
 */

// ============================================
// CONFIGURATION
// ============================================
var PROMPTS_SHEET_ID = 'YOUR_PROMPTS_SHEET_ID_HERE';

// ============================================
// PASTE YOUR PROMPTS.JSON CONTENT HERE
// ============================================
var PROMPTS_JSON = {
  // Paste your entire prompts.json content here
  // Example:
  // {
  //   "promptData": {
  //     "Recruitment": {
  //       "Understand the Role and Job Market": [
  //         { ... prompt data ... }
  //       ]
  //     }
  //   }
  // }
};

// ============================================
// MIGRATION FUNCTIONS
// ============================================

/**
 * Main migration function - Run this!
 */
function migratePromptsToSheet() {
  try {
    Logger.log('🚀 Starting migration...');

    // Open the sheet
    var spreadsheet = SpreadsheetApp.openById(PROMPTS_SHEET_ID);
    var promptsSheet = spreadsheet.getSheetByName('Prompts');

    if (!promptsSheet) {
      throw new Error('Prompts sheet not found! Make sure you created it first.');
    }

    // Get headers
    var headers = promptsSheet.getRange(1, 1, 1, promptsSheet.getLastColumn()).getValues()[0];

    // Parse JSON data
    var promptData = PROMPTS_JSON.promptData;

    if (!promptData) {
      throw new Error('Invalid JSON format! Make sure you pasted the complete prompts.json content.');
    }

    var rowsToAdd = [];
    var count = 0;

    // Iterate through categories and subcategories
    for (var category in promptData) {
      for (var subcategory in promptData[category]) {
        var prompts = promptData[category][subcategory];

        prompts.forEach(function(prompt) {
          count++;

          // Map JSON fields to Sheet columns
          var row = headers.map(function(header) {
            switch (header) {
              case 'ID':
                return prompt.id || 'prompt-' + count;
              case 'Category':
                return category;
              case 'Subcategory':
                return subcategory;
              case 'Title':
                return prompt.title || '';
              case 'Description':
                return prompt.description || '';
              case 'Content':
                return prompt.content || '';
              case 'Required Inputs':
                return Array.isArray(prompt.requiredInputs) ? prompt.requiredInputs.join(', ') : '';
              case 'Difficulty':
                return prompt.difficulty || 'Beginner';
              case 'Estimated Time':
                return prompt.estimatedTime || '';
              case 'Quick Start Steps':
                return prompt.quickStart && Array.isArray(prompt.quickStart.steps) ?
                  prompt.quickStart.steps.join('\n') : '';
              case 'Quick Start Tips':
                return prompt.quickStart && Array.isArray(prompt.quickStart.tips) ?
                  prompt.quickStart.tips.join('\n') : '';
              case 'Expected Output':
                return prompt.expectedOutput || '';
              case 'Tags':
                return Array.isArray(prompt.tags) ? prompt.tags.join(', ') : '';
              case 'Status':
                return 'Active'; // Default all to Active
              case 'Last Updated':
                return new Date();
              case 'Created Date':
                return new Date();
              default:
                return '';
            }
          });

          rowsToAdd.push(row);
        });
      }
    }

    // Add all rows to sheet
    if (rowsToAdd.length > 0) {
      var startRow = promptsSheet.getLastRow() + 1;
      promptsSheet.getRange(startRow, 1, rowsToAdd.length, rowsToAdd[0].length).setValues(rowsToAdd);

      Logger.log('✅ Migration completed successfully!');
      Logger.log('📊 Total prompts migrated: ' + rowsToAdd.length);
      Logger.log('🔗 Check your sheet: ' + spreadsheet.getUrl());

      SpreadsheetApp.getUi().alert(
        '✅ Migration Successful!',
        'Migrated ' + rowsToAdd.length + ' prompts to Google Sheet!\n\n' +
        'Check your Prompts sheet to verify the data.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );

    } else {
      Logger.log('⚠️ No prompts found in JSON data');
      SpreadsheetApp.getUi().alert('No prompts found to migrate!');
    }

  } catch (error) {
    Logger.log('❌ Error: ' + error.message);
    SpreadsheetApp.getUi().alert('Error', error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Alternative: Migrate from URL
 * If your prompts.json is hosted online, use this function
 */
function migrateFromURL() {
  var url = 'https://your-site.com/gbs-prompts/prompts.json'; // Replace with actual URL

  try {
    Logger.log('📥 Fetching data from URL...');

    var response = UrlFetchApp.fetch(url);
    var jsonData = JSON.parse(response.getContentText());

    Logger.log('✅ Data fetched successfully');

    // Use the same migration logic
    PROMPTS_JSON = jsonData;
    migratePromptsToSheet();

  } catch (error) {
    Logger.log('❌ Error fetching data: ' + error.message);
    SpreadsheetApp.getUi().alert('Error', 'Failed to fetch data from URL: ' + error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Clear all prompts (CAUTION!)
 * Use this if you want to start fresh
 */
function clearAllPrompts() {
  var confirmed = SpreadsheetApp.getUi().alert(
    '⚠️ WARNING',
    'This will delete ALL prompts from your sheet!\n\nAre you absolutely sure?',
    SpreadsheetApp.getUi().ButtonSet.YES_NO
  );

  if (confirmed === SpreadsheetApp.getUi().Button.YES) {
    try {
      var spreadsheet = SpreadsheetApp.openById(PROMPTS_SHEET_ID);
      var promptsSheet = spreadsheet.getSheetByName('Prompts');

      // Delete all rows except header
      var lastRow = promptsSheet.getLastRow();
      if (lastRow > 1) {
        promptsSheet.deleteRows(2, lastRow - 1);
      }

      Logger.log('✅ All prompts cleared');
      SpreadsheetApp.getUi().alert('All prompts have been deleted!');

    } catch (error) {
      Logger.log('❌ Error: ' + error.message);
      SpreadsheetApp.getUi().alert('Error', error.message, SpreadsheetApp.getUi().ButtonSet.OK);
    }
  }
}

/**
 * Test: View first prompt from JSON
 */
function testViewFirstPrompt() {
  try {
    var promptData = PROMPTS_JSON.promptData;

    for (var category in promptData) {
      for (var subcategory in promptData[category]) {
        var prompts = promptData[category][subcategory];
        var firstPrompt = prompts[0];

        Logger.log('📝 First Prompt Preview:');
        Logger.log('Category: ' + category);
        Logger.log('Subcategory: ' + subcategory);
        Logger.log('Title: ' + firstPrompt.title);
        Logger.log('Description: ' + firstPrompt.description);

        return; // Just show first one
      }
    }
  } catch (error) {
    Logger.log('❌ Error: ' + error.message);
  }
}

// ============================================
// GEMS MIGRATION (IF NEEDED)
// ============================================

var GEMS_SHEET_ID = 'YOUR_GEMS_SHEET_ID_HERE';

var GEMS_JSON = {
  // If you have existing gems data, paste it here
  // Format:
  // {
  //   "gems": {
  //     "featured": [...],
  //     "byCategory": { ... }
  //   }
  // }
};

/**
 * Migrate gems data (if you have existing gems to import)
 */
function migrateGemsToSheet() {
  try {
    Logger.log('🚀 Starting gems migration...');

    var spreadsheet = SpreadsheetApp.openById(GEMS_SHEET_ID);
    var gemsSheet = spreadsheet.getSheetByName('Gems');

    if (!gemsSheet) {
      throw new Error('Gems sheet not found!');
    }

    var headers = gemsSheet.getRange(1, 1, 1, gemsSheet.getLastColumn()).getValues()[0];
    var rowsToAdd = [];
    var count = 0;

    // Process gems from all categories
    var gemsData = GEMS_JSON.gems;

    if (!gemsData || !gemsData.byCategory) {
      throw new Error('Invalid gems JSON format!');
    }

    for (var category in gemsData.byCategory) {
      var gems = gemsData.byCategory[category];

      gems.forEach(function(gem) {
        count++;

        var row = headers.map(function(header) {
          switch (header) {
            case 'ID':
              return gem.id || 'gem-' + count;
            case 'Gem ID':
              return gem.gemId || '';
            case 'Title':
              return gem.title || '';
            case 'Description':
              return gem.description || '';
            case 'Category':
              return category;
            case 'Use Case':
              return gem.useCase || '';
            case 'Instructions':
              return Array.isArray(gem.instructions) ? gem.instructions.join('\n') : '';
            case 'Example Input':
              return gem.exampleInput || '';
            case 'Example Output':
              return gem.exampleOutput || '';
            case 'Tips':
              return Array.isArray(gem.tips) ? gem.tips.join('\n') : '';
            case 'Featured':
              return gem.featured ? 'Yes' : 'No';
            case 'Order':
              return gem.order || count;
            case 'Status':
              return 'Active';
            case 'Created By':
              return 'Admin';
            case 'Last Updated':
              return new Date();
            case 'Created Date':
              return new Date();
            default:
              return '';
          }
        });

        rowsToAdd.push(row);
      });
    }

    if (rowsToAdd.length > 0) {
      var startRow = gemsSheet.getLastRow() + 1;
      gemsSheet.getRange(startRow, 1, rowsToAdd.length, rowsToAdd[0].length).setValues(rowsToAdd);

      Logger.log('✅ Gems migration completed!');
      Logger.log('📊 Total gems migrated: ' + rowsToAdd.length);

      SpreadsheetApp.getUi().alert(
        '✅ Success!',
        'Migrated ' + rowsToAdd.length + ' gems to Google Sheet!',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    }

  } catch (error) {
    Logger.log('❌ Error: ' + error.message);
    SpreadsheetApp.getUi().alert('Error', error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

// ============================================
// HELPER: Export current sheet to JSON format
// ============================================

/**
 * Export current Google Sheet data back to JSON format
 * Use this to verify your data or create backups
 */
function exportPromptsToJSON() {
  try {
    var spreadsheet = SpreadsheetApp.openById(PROMPTS_SHEET_ID);
    var promptsSheet = spreadsheet.getSheetByName('Prompts');

    var data = promptsSheet.getDataRange().getValues();
    var headers = data[0];

    var promptData = {};

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0] || row[headers.indexOf('Status')] !== 'Active') continue;

      var category = row[headers.indexOf('Category')];
      var subcategory = row[headers.indexOf('Subcategory')];

      if (!promptData[category]) {
        promptData[category] = {};
      }
      if (!promptData[category][subcategory]) {
        promptData[category][subcategory] = [];
      }

      var prompt = {
        id: row[headers.indexOf('ID')],
        title: row[headers.indexOf('Title')],
        description: row[headers.indexOf('Description')],
        content: row[headers.indexOf('Content')],
        requiredInputs: parseArray(row[headers.indexOf('Required Inputs')]),
        difficulty: row[headers.indexOf('Difficulty')],
        estimatedTime: row[headers.indexOf('Estimated Time')],
        quickStart: {
          steps: parseArray(row[headers.indexOf('Quick Start Steps')]),
          tips: parseArray(row[headers.indexOf('Quick Start Tips')])
        },
        expectedOutput: row[headers.indexOf('Expected Output')]
      };

      promptData[category][subcategory].push(prompt);
    }

    var json = JSON.stringify({ promptData: promptData }, null, 2);
    Logger.log(json);

    SpreadsheetApp.getUi().alert(
      'JSON Export',
      'Check the logs (View > Logs) for the JSON output.\n\nCopy it and save as prompts.json',
      SpreadsheetApp.getUi().ButtonSet.OK
    );

  } catch (error) {
    Logger.log('❌ Error: ' + error.message);
  }
}

function parseArray(str) {
  if (!str) return [];
  if (typeof str !== 'string') return [];

  if (str.includes('\n')) {
    return str.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
  }

  if (str.includes(',')) {
    return str.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
  }

  return [str.trim()];
}
