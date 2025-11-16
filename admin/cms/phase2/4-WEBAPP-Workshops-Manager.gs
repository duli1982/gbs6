/**
 * PHASE 2 - WORKSHOPS MANAGEMENT WEB APP
 * ========================================
 *
 * API endpoints for managing Interactive Workshops
 */

// ============================================
// CONFIGURATION
// ============================================
var WORKSHOPS_SHEET_ID = 'YOUR_WORKSHOPS_SHEET_ID_HERE';
var SHEET_NAME = 'Workshops';
var SETTINGS_SHEET = 'Settings';

// ============================================
// MAIN ENDPOINTS
// ============================================

function doGet(e) {
  var action = e.parameter.action || 'test';

  try {
    switch (action) {
      case 'getAll':
        return getAllWorkshops();
      case 'getUpcoming':
        return getUpcomingWorkshops();
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

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var password = data.password;

    if (!verifyPassword(password)) {
      return createJSONResponse({ error: 'Invalid password' }, 401);
    }

    switch (action) {
      case 'create':
        return createWorkshop(data.workshop);
      case 'update':
        return updateWorkshop(data.id, data.workshop);
      case 'delete':
        return deleteWorkshop(data.id);
      case 'updateParticipants':
        return updateParticipants(data.id, data.participants);
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

function getAllWorkshops() {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var workshops = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0]) {
      var workshop = {};
      headers.forEach(function(header, index) {
        workshop[header] = row[index];
      });
      workshops.push(workshop);
    }
  }

  return createJSONResponse({ workshops: workshops });
}

function getUpcomingWorkshops() {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var workshops = [];
  var now = new Date();

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;

    var status = row[headers.indexOf('Status')];
    if (status === 'Coming Soon' || status === 'Open') {
      var workshop = {};
      headers.forEach(function(header, index) {
        workshop[header] = row[index];
      });
      workshops.push(workshop);
    }
  }

  return createJSONResponse({ workshops: workshops });
}

// ============================================
// WRITE OPERATIONS
// ============================================

function createWorkshop(workshopData) {
  var sheet = getSheet(SHEET_NAME);
  var lastRow = sheet.getLastRow();
  var newRow = lastRow + 1;

  if (!workshopData.ID) {
    workshopData.ID = generateWorkshopID();
  }

  workshopData['Last Updated'] = new Date();
  workshopData['Created Date'] = new Date();

  if (!workshopData.Status) {
    workshopData.Status = 'Coming Soon';
  }

  if (!workshopData.Order) {
    workshopData.Order = lastRow;
  }

  if (!workshopData['Current Participants']) {
    workshopData['Current Participants'] = 0;
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rowData = headers.map(function(header) {
    return workshopData[header] || '';
  });

  sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);

  Logger.log('Created workshop: ' + workshopData.ID);
  return createJSONResponse({
    success: true,
    message: 'Workshop created successfully',
    id: workshopData.ID
  });
}

function updateWorkshop(id, workshopData) {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');

  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      workshopData['Last Updated'] = new Date();

      var rowData = headers.map(function(header) {
        return workshopData[header] !== undefined ? workshopData[header] : data[i][headers.indexOf(header)];
      });

      sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);

      Logger.log('Updated workshop: ' + id);
      return createJSONResponse({
        success: true,
        message: 'Workshop updated successfully'
      });
    }
  }

  return createJSONResponse({ error: 'Workshop not found' }, 404);
}

function deleteWorkshop(id) {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');

  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      sheet.deleteRow(i + 1);
      Logger.log('Deleted workshop: ' + id);
      return createJSONResponse({
        success: true,
        message: 'Workshop deleted successfully'
      });
    }
  }

  return createJSONResponse({ error: 'Workshop not found' }, 404);
}

function updateParticipants(id, participants) {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');
  var participantsCol = headers.indexOf('Current Participants');
  var maxCol = headers.indexOf('Max Participants');
  var statusCol = headers.indexOf('Status');

  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      sheet.getRange(i + 1, participantsCol + 1).setValue(participants);

      // Auto-update status if full
      var maxParticipants = data[i][maxCol];
      if (participants >= maxParticipants) {
        sheet.getRange(i + 1, statusCol + 1).setValue('Full');
      } else if (data[i][statusCol] === 'Full') {
        sheet.getRange(i + 1, statusCol + 1).setValue('Open');
      }

      return createJSONResponse({
        success: true,
        message: 'Participants updated'
      });
    }
  }

  return createJSONResponse({ error: 'Workshop not found' }, 404);
}

// ============================================
// JSON GENERATION
// ============================================

function generateJSON() {
  var sheet = getSheet(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var workshops = {
    upcoming: [],
    past: [],
    all: []
  };

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;

    var workshop = {
      id: row[headers.indexOf('ID')],
      title: row[headers.indexOf('Title')],
      icon: row[headers.indexOf('Icon')],
      iconColor: row[headers.indexOf('Icon Color')],
      date: row[headers.indexOf('Date')],
      time: row[headers.indexOf('Time')],
      timezone: row[headers.indexOf('Timezone')],
      duration: row[headers.indexOf('Duration')],
      instructor: row[headers.indexOf('Instructor')],
      description: row[headers.indexOf('Description')],
      status: row[headers.indexOf('Status')],
      registrationLink: row[headers.indexOf('Registration Link')],
      maxParticipants: row[headers.indexOf('Max Participants')],
      currentParticipants: row[headers.indexOf('Current Participants')],
      order: row[headers.indexOf('Order')] || 999
    };

    workshops.all.push(workshop);

    if (workshop.status === 'Coming Soon' || workshop.status === 'Open' || workshop.status === 'Full') {
      workshops.upcoming.push(workshop);
    } else if (workshop.status === 'Completed') {
      workshops.past.push(workshop);
    }
  }

  // Sort by order
  workshops.all.sort(function(a, b) { return a.order - b.order; });
  workshops.upcoming.sort(function(a, b) { return a.order - b.order; });
  workshops.past.sort(function(a, b) { return a.order - b.order; });

  var json = JSON.stringify({ workshops: workshops }, null, 2);

  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getSheet(sheetName) {
  var spreadsheet = SpreadsheetApp.openById(WORKSHOPS_SHEET_ID);
  return spreadsheet.getSheetByName(sheetName);
}

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

function generateWorkshopID() {
  var timestamp = new Date().getTime();
  var random = Math.floor(Math.random() * 1000);
  return 'workshop-' + timestamp + '-' + random;
}

function createJSONResponse(data, statusCode) {
  statusCode = statusCode || 200;
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getTestPage() {
  var html = '<html><body>' +
    '<h1>GBS Workshops Manager - Web App</h1>' +
    '<p>✅ Web App is running!</p>' +
    '<p>Sheet ID: ' + WORKSHOPS_SHEET_ID + '</p>' +
    '<p>Current Time: ' + new Date() + '</p>' +
    '<h2>GET Endpoints:</h2>' +
    '<ul>' +
    '<li>?action=getAll - Get all workshops</li>' +
    '<li>?action=getUpcoming - Get upcoming workshops</li>' +
    '<li>?action=generateJSON - Generate JSON</li>' +
    '</ul>' +
    '<h2>POST Endpoints (Password Required):</h2>' +
    '<ul>' +
    '<li>create, update, delete, updateParticipants</li>' +
    '</ul>' +
    '</body></html>';

  return HtmlService.createHtmlOutput(html);
}
