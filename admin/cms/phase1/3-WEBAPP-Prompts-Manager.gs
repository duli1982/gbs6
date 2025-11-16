/**
 * PHASE 1 - PROMPTS MANAGEMENT WEB APP
 * ====================================
 *
 * This script provides API endpoints for managing GBS Prompts
 *
 * SETUP:
 * 1. Replace SHEET_ID with your Prompts Sheet ID
 * 2. Deploy as Web App (Anyone can access)
 * 3. Copy Web App URL
 * 4. Use URL in admin panel
 */

// ============================================
// CONFIGURATION
 // ============================================
var PROMPTS_SHEET_ID = 'YOUR_PROMPTS_SHEET_ID_HERE';
var SHEET_NAME = 'Prompts';
var CATEGORIES_SHEET = 'Categories';
var SETTINGS_SHEET = 'Settings';

// ============================================
// MAIN ENDPOINTS
// ============================================

/**
 * Handle GET requests - Returns JSON data or HTML test page
 */
function doGet(e) {
  var action = e.parameter.action || 'test';

  try {
    switch (action) {
      case 'getAll':
        return getAll Prompts();
      case 'getCategories':
        return getCategories();
      case 'generateJSON':
        return generateJSON();
      case 'test':
        return getTestPage();
      default:
        return createJSONResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    Logger.log('Error in doGet: ' + error);
    return createJSONResponse({ error: error.message }, 500);
  }
}

/**
 * Handle POST requests - CRUD operations
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var password = data.password;

    // Verify password for write operations
    if (!verifyPassword(password)) {
      return createJSONResponse({ error: 'Invalid password' }, 401);
    }

    switch (action) {
      case 'create':
        return createPrompt(data.prompt);
      case 'update':
        return updatePrompt(data.id, data.prompt);
      case 'delete':
        return deletePrompt(data.id);
      case 'reorder':
        return reorderPrompts(data.prompts);
      default:
        return createJSONResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error);
    return createJSONResponse({ error: error.message }, 500);
  }
}

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Get all prompts
 */
function getAllPrompts() {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var prompts = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0]) { // If ID exists
      var prompt = {};
      headers.forEach(function(header, index) {
        prompt[header] = row[index];
      });
      prompts.push(prompt);
    }
  }

  return createJSONResponse({ prompts: prompts });
}

/**
 * Get all categories
 */
function getCategories() {
  var sheet = getSheet(CATEGORIES_SHEET);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var categories = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0]) {
      var category = {};
      headers.forEach(function(header, index) {
        category[header] = row[index];
      });
      categories.push(category);
    }
  }

  return createJSONResponse({ categories: categories });
}

// ============================================
// WRITE OPERATIONS
// ============================================

/**
 * Create new prompt
 */
function createPrompt(promptData) {
  var sheet = getSheet(SHEET_NAME);
  var lastRow = sheet.getLastRow();
  var newRow = lastRow + 1;

  // Generate ID if not provided
  if (!promptData.ID) {
    promptData.ID = generatePromptID();
  }

  // Set timestamps
  promptData['Last Updated'] = new Date();
  promptData['Created Date'] = new Date();

  // Set default status
  if (!promptData.Status) {
    promptData.Status = 'Active';
  }

  // Get headers
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Create row data
  var rowData = headers.map(function(header) {
    return promptData[header] || '';
  });

  // Insert row
  sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);

  Logger.log('Created prompt: ' + promptData.ID);
  return createJSONResponse({
    success: true,
    message: 'Prompt created successfully',
    id: promptData.ID
  });
}

/**
 * Update existing prompt
 */
function updatePrompt(id, promptData) {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');

  // Find the row
  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      // Update timestamp
      promptData['Last Updated'] = new Date();

      // Create updated row
      var rowData = headers.map(function(header) {
        return promptData[header] !== undefined ? promptData[header] : data[i][headers.indexOf(header)];
      });

      // Update row
      sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);

      Logger.log('Updated prompt: ' + id);
      return createJSONResponse({
        success: true,
        message: 'Prompt updated successfully'
      });
    }
  }

  return createJSONResponse({ error: 'Prompt not found' }, 404);
}

/**
 * Delete prompt
 */
function deletePrompt(id) {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');

  // Find and delete the row
  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      sheet.deleteRow(i + 1);
      Logger.log('Deleted prompt: ' + id);
      return createJSONResponse({
        success: true,
        message: 'Prompt deleted successfully'
      });
    }
  }

  return createJSONResponse({ error: 'Prompt not found' }, 404);
}

// ============================================
// JSON GENERATION
// ============================================

/**
 * Generate JSON file in proper format for website
 */
function generateJSON() {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var promptData = {};

  // Build nested structure: Category > Subcategory > [Prompts]
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0] || row[headers.indexOf('Status')] !== 'Active') continue;

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
      expectedOutput: row[headers.indexOf('Expected Output')],
      category: row[headers.indexOf('Category')],
      subcategory: row[headers.indexOf('Subcategory')]
    };

    var category = prompt.category;
    var subcategory = prompt.subcategory;

    if (!promptData[category]) {
      promptData[category] = {};
    }
    if (!promptData[category][subcategory]) {
      promptData[category][subcategory] = [];
    }

    // Remove category and subcategory from prompt object
    delete prompt.category;
    delete prompt.subcategory;

    promptData[category][subcategory].push(prompt);
  }

  var json = JSON.stringify({ promptData: promptData }, null, 2);

  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get sheet by name
 */
function getSheet(sheetName) {
  var spreadsheet = SpreadsheetApp.openById(PROMPTS_SHEET_ID);
  return spreadsheet.getSheetByName(sheetName);
}

/**
 * Verify admin password
 */
function verifyPassword(password) {
  var settingsSheet = getSheet(SETTINGS_SHEET);
  var data = settingsSheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === 'Admin Password') {
      return data[i][1] === password;
    }
  }

  return false;
}

/**
 * Generate unique prompt ID
 */
function generatePromptID() {
  var timestamp = new Date().getTime();
  var random = Math.floor(Math.random() * 1000);
  return 'prompt-' + timestamp + '-' + random;
}

/**
 * Parse array from string (newline or comma separated)
 */
function parseArray(str) {
  if (!str) return [];
  if (typeof str !== 'string') return [];

  // Try newline first
  if (str.includes('\n')) {
    return str.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
  }

  // Try comma
  if (str.includes(',')) {
    return str.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
  }

  // Single item
  return [str.trim()];
}

/**
 * Create JSON response
 */
function createJSONResponse(data, statusCode) {
  statusCode = statusCode || 200;

  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);

  return output;
}

/**
 * Test page
 */
function getTestPage() {
  var html = '<html><body>' +
    '<h1>GBS Prompts Manager - Web App</h1>' +
    '<p>✅ Web App is running!</p>' +
    '<p>Sheet ID: ' + PROMPTS_SHEET_ID + '</p>' +
    '<p>Current Time: ' + new Date() + '</p>' +
    '<h2>Available Endpoints:</h2>' +
    '<ul>' +
    '<li>?action=getAll - Get all prompts</li>' +
    '<li>?action=getCategories - Get all categories</li>' +
    '<li>?action=generateJSON - Generate JSON for website</li>' +
    '</ul>' +
    '</body></html>';

  return HtmlService.createHtmlOutput(html);
}
