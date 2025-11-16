/**
 * PHASE 1 - GEMS COLLECTION MANAGEMENT WEB APP
 * =============================================
 *
 * This script provides API endpoints for managing Gemini Gems Collection
 *
 * SETUP:
 * 1. Replace SHEET_ID with your Gems Sheet ID
 * 2. Deploy as Web App (Anyone can access)
 * 3. Copy Web App URL
 * 4. Use URL in admin panel
 */

// ============================================
// CONFIGURATION
// ============================================
var GEMS_SHEET_ID = 'YOUR_GEMS_SHEET_ID_HERE';
var SHEET_NAME = 'Gems';
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
        return getAllGems();
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
        return createGem(data.gem);
      case 'update':
        return updateGem(data.id, data.gem);
      case 'delete':
        return deleteGem(data.id);
      case 'reorder':
        return reorderGems(data.gems);
      case 'toggleFeatured':
        return toggleFeatured(data.id);
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
 * Get all gems
 */
function getAllGems() {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var gems = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0]) { // If ID exists
      var gem = {};
      headers.forEach(function(header, index) {
        gem[header] = row[index];
      });
      gems.push(gem);
    }
  }

  return createJSONResponse({ gems: gems });
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
 * Create new gem
 */
function createGem(gemData) {
  var sheet = getSheet(SHEET_NAME);
  var lastRow = sheet.getLastRow();
  var newRow = lastRow + 1;

  // Generate ID if not provided
  if (!gemData.ID) {
    gemData.ID = generateGemID();
  }

  // Set timestamps
  gemData['Last Updated'] = new Date();
  gemData['Created Date'] = new Date();

  // Set default status
  if (!gemData.Status) {
    gemData.Status = 'Active';
  }

  // Set default featured
  if (!gemData.Featured) {
    gemData.Featured = 'No';
  }

  // Set default order
  if (!gemData.Order) {
    gemData.Order = lastRow;
  }

  // Set created by
  if (!gemData['Created By']) {
    gemData['Created By'] = 'Admin';
  }

  // Get headers
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Create row data
  var rowData = headers.map(function(header) {
    return gemData[header] || '';
  });

  // Insert row
  sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);

  Logger.log('Created gem: ' + gemData.ID);
  return createJSONResponse({
    success: true,
    message: 'Gem created successfully',
    id: gemData.ID
  });
}

/**
 * Update existing gem
 */
function updateGem(id, gemData) {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');

  // Find the row
  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      // Update timestamp
      gemData['Last Updated'] = new Date();

      // Create updated row
      var rowData = headers.map(function(header) {
        return gemData[header] !== undefined ? gemData[header] : data[i][headers.indexOf(header)];
      });

      // Update row
      sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);

      Logger.log('Updated gem: ' + id);
      return createJSONResponse({
        success: true,
        message: 'Gem updated successfully'
      });
    }
  }

  return createJSONResponse({ error: 'Gem not found' }, 404);
}

/**
 * Delete gem
 */
function deleteGem(id) {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');

  // Find and delete the row
  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      sheet.deleteRow(i + 1);
      Logger.log('Deleted gem: ' + id);
      return createJSONResponse({
        success: true,
        message: 'Gem deleted successfully'
      });
    }
  }

  return createJSONResponse({ error: 'Gem not found' }, 404);
}

/**
 * Toggle featured status
 */
function toggleFeatured(id) {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');
  var featuredCol = headers.indexOf('Featured');

  // Find the row
  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      var currentStatus = data[i][featuredCol];
      var newStatus = currentStatus === 'Yes' ? 'No' : 'Yes';

      sheet.getRange(i + 1, featuredCol + 1).setValue(newStatus);

      // Update timestamp
      var lastUpdatedCol = headers.indexOf('Last Updated');
      sheet.getRange(i + 1, lastUpdatedCol + 1).setValue(new Date());

      Logger.log('Toggled featured for gem: ' + id + ' to ' + newStatus);
      return createJSONResponse({
        success: true,
        message: 'Featured status updated',
        featured: newStatus
      });
    }
  }

  return createJSONResponse({ error: 'Gem not found' }, 404);
}

/**
 * Reorder gems (update Order column)
 */
function reorderGems(gems) {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');
  var orderCol = headers.indexOf('Order');

  gems.forEach(function(gem) {
    for (var i = 1; i < data.length; i++) {
      if (data[i][idCol] === gem.id) {
        sheet.getRange(i + 1, orderCol + 1).setValue(gem.order);
        break;
      }
    }
  });

  Logger.log('Reordered ' + gems.length + ' gems');
  return createJSONResponse({
    success: true,
    message: 'Gems reordered successfully'
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

  var gems = {
    featured: [],
    byCategory: {}
  };

  // Build structure
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0] || row[headers.indexOf('Status')] !== 'Active') continue;

    var gem = {
      id: row[headers.indexOf('ID')],
      gemId: row[headers.indexOf('Gem ID')],
      title: row[headers.indexOf('Title')],
      description: row[headers.indexOf('Description')],
      category: row[headers.indexOf('Category')],
      useCase: row[headers.indexOf('Use Case')],
      instructions: parseArray(row[headers.indexOf('Instructions')]),
      exampleInput: row[headers.indexOf('Example Input')],
      exampleOutput: row[headers.indexOf('Example Output')],
      tips: parseArray(row[headers.indexOf('Tips')]),
      featured: row[headers.indexOf('Featured')] === 'Yes',
      order: row[headers.indexOf('Order')] || 999
    };

    // Add to featured array
    if (gem.featured) {
      gems.featured.push(gem);
    }

    // Add to category
    var category = gem.category;
    if (!gems.byCategory[category]) {
      gems.byCategory[category] = [];
    }
    gems.byCategory[category].push(gem);
  }

  // Sort featured by order
  gems.featured.sort(function(a, b) { return a.order - b.order; });

  // Sort each category by order
  Object.keys(gems.byCategory).forEach(function(category) {
    gems.byCategory[category].sort(function(a, b) { return a.order - b.order; });
  });

  var json = JSON.stringify({ gems: gems }, null, 2);

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
  var spreadsheet = SpreadsheetApp.openById(GEMS_SHEET_ID);
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
 * Generate unique gem ID
 */
function generateGemID() {
  var timestamp = new Date().getTime();
  var random = Math.floor(Math.random() * 1000);
  return 'gem-' + timestamp + '-' + random;
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
    '<h1>GBS Gems Manager - Web App</h1>' +
    '<p>✅ Web App is running!</p>' +
    '<p>Sheet ID: ' + GEMS_SHEET_ID + '</p>' +
    '<p>Current Time: ' + new Date() + '</p>' +
    '<h2>Available Endpoints:</h2>' +
    '<ul>' +
    '<li>?action=getAll - Get all gems</li>' +
    '<li>?action=getCategories - Get all categories</li>' +
    '<li>?action=generateJSON - Generate JSON for website</li>' +
    '</ul>' +
    '<h2>POST Endpoints (Password Required):</h2>' +
    '<ul>' +
    '<li>create - Add new gem</li>' +
    '<li>update - Edit existing gem</li>' +
    '<li>delete - Remove gem</li>' +
    '<li>toggleFeatured - Toggle featured status</li>' +
    '<li>reorder - Change display order</li>' +
    '</ul>' +
    '</body></html>';

  return HtmlService.createHtmlOutput(html);
}
