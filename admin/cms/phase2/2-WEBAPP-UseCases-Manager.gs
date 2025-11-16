/**
 * PHASE 2 - USE CASES MANAGEMENT WEB APP
 * ========================================
 *
 * This script provides API endpoints for managing Use Cases
 *
 * SETUP:
 * 1. Replace SHEET_ID with your Use Cases Sheet ID
 * 2. Deploy as Web App (Anyone can access)
 * 3. Copy Web App URL
 * 4. Use URL in admin panel
 */

// ============================================
// CONFIGURATION
// ============================================
var USECASES_SHEET_ID = 'YOUR_USECASES_SHEET_ID_HERE';
var SHEET_NAME = 'Use Cases';
var CATEGORIES_SHEET = 'Categories';
var SETTINGS_SHEET = 'Settings';

// ============================================
// MAIN ENDPOINTS
// ============================================

/**
 * Handle GET requests
 */
function doGet(e) {
  var action = e.parameter.action || 'test';

  try {
    switch (action) {
      case 'getAll':
        return getAllUseCases();
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
 * Handle POST requests
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
        return createUseCase(data.useCase);
      case 'update':
        return updateUseCase(data.id, data.useCase);
      case 'delete':
        return deleteUseCase(data.id);
      case 'reorder':
        return reorderUseCases(data.useCases);
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
 * Get all use cases
 */
function getAllUseCases() {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var useCases = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0]) { // If ID exists
      var useCase = {};
      headers.forEach(function(header, index) {
        useCase[header] = row[index];
      });
      useCases.push(useCase);
    }
  }

  return createJSONResponse({ useCases: useCases });
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
 * Create new use case
 */
function createUseCase(useCaseData) {
  var sheet = getSheet(SHEET_NAME);
  var lastRow = sheet.getLastRow();
  var newRow = lastRow + 1;

  // Generate ID if not provided
  if (!useCaseData.ID) {
    useCaseData.ID = generateUseCaseID();
  }

  // Set timestamps
  useCaseData['Last Updated'] = new Date();
  useCaseData['Created Date'] = new Date();

  // Set default status
  if (!useCaseData.Status) {
    useCaseData.Status = 'Active';
  }

  // Set default order
  if (!useCaseData.Order) {
    useCaseData.Order = lastRow;
  }

  // Get headers
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Create row data
  var rowData = headers.map(function(header) {
    return useCaseData[header] || '';
  });

  // Insert row
  sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);

  Logger.log('Created use case: ' + useCaseData.ID);
  return createJSONResponse({
    success: true,
    message: 'Use case created successfully',
    id: useCaseData.ID
  });
}

/**
 * Update existing use case
 */
function updateUseCase(id, useCaseData) {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');

  // Find the row
  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      // Update timestamp
      useCaseData['Last Updated'] = new Date();

      // Create updated row
      var rowData = headers.map(function(header) {
        return useCaseData[header] !== undefined ? useCaseData[header] : data[i][headers.indexOf(header)];
      });

      // Update row
      sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);

      Logger.log('Updated use case: ' + id);
      return createJSONResponse({
        success: true,
        message: 'Use case updated successfully'
      });
    }
  }

  return createJSONResponse({ error: 'Use case not found' }, 404);
}

/**
 * Delete use case
 */
function deleteUseCase(id) {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');

  // Find and delete the row
  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      sheet.deleteRow(i + 1);
      Logger.log('Deleted use case: ' + id);
      return createJSONResponse({
        success: true,
        message: 'Use case deleted successfully'
      });
    }
  }

  return createJSONResponse({ error: 'Use case not found' }, 404);
}

/**
 * Reorder use cases
 */
function reorderUseCases(useCases) {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');
  var orderCol = headers.indexOf('Order');

  useCases.forEach(function(useCase) {
    for (var i = 1; i < data.length; i++) {
      if (data[i][idCol] === useCase.id) {
        sheet.getRange(i + 1, orderCol + 1).setValue(useCase.order);
        break;
      }
    }
  });

  Logger.log('Reordered ' + useCases.length + ' use cases');
  return createJSONResponse({
    success: true,
    message: 'Use cases reordered successfully'
  });
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

  var useCases = {
    featured: [],
    byCategory: {},
    all: []
  };

  // Build structure
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0] || row[headers.indexOf('Status')] !== 'Active') continue;

    var useCase = {
      id: row[headers.indexOf('ID')],
      title: row[headers.indexOf('Title')],
      icon: row[headers.indexOf('Icon')],
      category: row[headers.indexOf('Category')],
      difficulty: row[headers.indexOf('Difficulty')],
      impactStat: row[headers.indexOf('Impact Stat')],
      metrics: {
        time: {
          value: row[headers.indexOf('Time Metric')],
          label: row[headers.indexOf('Time Metric Label')]
        },
        improvement: {
          value: row[headers.indexOf('Improvement Metric')],
          label: row[headers.indexOf('Improvement Metric Label')]
        },
        quality: {
          value: row[headers.indexOf('Quality Metric')],
          label: row[headers.indexOf('Quality Metric Label')]
        }
      },
      prerequisites: parseList(row[headers.indexOf('Prerequisites')]),
      gettingStarted: {
        steps: [
          row[headers.indexOf('Getting Started Step 1')],
          row[headers.indexOf('Getting Started Step 2')],
          row[headers.indexOf('Getting Started Step 3')]
        ].filter(Boolean)
      },
      commonPitfalls: [
        {
          title: row[headers.indexOf('Common Pitfall 1 Title')],
          description: row[headers.indexOf('Common Pitfall 1 Description')]
        },
        {
          title: row[headers.indexOf('Common Pitfall 2 Title')],
          description: row[headers.indexOf('Common Pitfall 2 Description')]
        }
      ].filter(function(p) { return p.title; }),
      example: {
        title: row[headers.indexOf('Example Section Title')],
        content: row[headers.indexOf('Example Section Content')]
      },
      gbsPromptLink: row[headers.indexOf('GBS Prompt Link')],
      demoType: row[headers.indexOf('Demo Type')],
      order: row[headers.indexOf('Order')] || 999
    };

    // Add to all
    useCases.all.push(useCase);

    // Add to category
    var category = useCase.category;
    if (!useCases.byCategory[category]) {
      useCases.byCategory[category] = [];
    }
    useCases.byCategory[category].push(useCase);
  }

  // Sort by order
  useCases.all.sort(function(a, b) { return a.order - b.order; });

  // Sort each category by order
  Object.keys(useCases.byCategory).forEach(function(category) {
    useCases.byCategory[category].sort(function(a, b) { return a.order - b.order; });
  });

  var json = JSON.stringify({ useCases: useCases }, null, 2);

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
  var spreadsheet = SpreadsheetApp.openById(USECASES_SHEET_ID);
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
 * Generate unique use case ID
 */
function generateUseCaseID() {
  var timestamp = new Date().getTime();
  var random = Math.floor(Math.random() * 1000);
  return 'usecase-' + timestamp + '-' + random;
}

/**
 * Parse list from string (newline or bullet separated)
 */
function parseList(str) {
  if (!str) return [];
  if (typeof str !== 'string') return [];

  // Remove bullet points and split by newlines
  var lines = str.split('\n')
    .map(function(s) {
      return s.trim().replace(/^[•\-\*]\s*/, '');
    })
    .filter(Boolean);

  return lines;
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
    '<h1>GBS Use Cases Manager - Web App</h1>' +
    '<p>✅ Web App is running!</p>' +
    '<p>Sheet ID: ' + USECASES_SHEET_ID + '</p>' +
    '<p>Current Time: ' + new Date() + '</p>' +
    '<h2>Available Endpoints:</h2>' +
    '<ul>' +
    '<li>?action=getAll - Get all use cases</li>' +
    '<li>?action=getCategories - Get all categories</li>' +
    '<li>?action=generateJSON - Generate JSON for website</li>' +
    '</ul>' +
    '<h2>POST Endpoints (Password Required):</h2>' +
    '<ul>' +
    '<li>create - Add new use case</li>' +
    '<li>update - Edit existing use case</li>' +
    '<li>delete - Remove use case</li>' +
    '<li>reorder - Change display order</li>' +
    '</ul>' +
    '</body></html>';

  return HtmlService.createHtmlOutput(html);
}
