/**
 * PHASE 2 - KNOWLEDGE CONTENT MANAGEMENT WEB APP
 * ================================================
 *
 * API endpoints for managing Videos and Articles
 */

// ============================================
// CONFIGURATION
// ============================================
var KNOWLEDGE_SHEET_ID = 'YOUR_KNOWLEDGE_SHEET_ID_HERE';
var VIDEOS_SHEET = 'Videos';
var ARTICLES_SHEET = 'Articles';
var SETTINGS_SHEET = 'Settings';

// ============================================
// MAIN ENDPOINTS
// ============================================

function doGet(e) {
  var action = e.parameter.action || 'test';

  try {
    switch (action) {
      case 'getVideos':
        return getVideos();
      case 'getArticles':
        return getArticles();
      case 'getAll':
        return getAll();
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
      case 'createVideo':
        return createVideo(data.video);
      case 'updateVideo':
        return updateVideo(data.id, data.video);
      case 'deleteVideo':
        return deleteVideo(data.id);
      case 'createArticle':
        return createArticle(data.article);
      case 'updateArticle':
        return updateArticle(data.id, data.article);
      case 'deleteArticle':
        return deleteArticle(data.id);
      default:
        return createJSONResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error);
    return createJSONResponse({ error: error.message }, 500);
  }
}

// ============================================
// READ OPERATIONS - VIDEOS
// ============================================

function getVideos() {
  var sheet = getSheet(VIDEOS_SHEET);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var videos = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0]) {
      var video = {};
      headers.forEach(function(header, index) {
        video[header] = row[index];
      });
      videos.push(video);
    }
  }

  return createJSONResponse({ videos: videos });
}

// ============================================
// READ OPERATIONS - ARTICLES
// ============================================

function getArticles() {
  var sheet = getSheet(ARTICLES_SHEET);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var articles = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0]) {
      var article = {};
      headers.forEach(function(header, index) {
        article[header] = row[index];
      });
      articles.push(article);
    }
  }

  return createJSONResponse({ articles: articles });
}

// ============================================
// READ OPERATIONS - COMBINED
// ============================================

function getAll() {
  var videosResponse = getVideos();
  var articlesResponse = getArticles();

  var videos = JSON.parse(videosResponse.getContent()).videos;
  var articles = JSON.parse(articlesResponse.getContent()).articles;

  return createJSONResponse({
    videos: videos,
    articles: articles
  });
}

// ============================================
// WRITE OPERATIONS - VIDEOS
// ============================================

function createVideo(videoData) {
  var sheet = getSheet(VIDEOS_SHEET);
  var lastRow = sheet.getLastRow();
  var newRow = lastRow + 1;

  if (!videoData.ID) {
    videoData.ID = generateID('video');
  }

  videoData['Last Updated'] = new Date();
  videoData['Created Date'] = new Date();

  if (!videoData.Status) {
    videoData.Status = 'Active';
  }

  if (!videoData.Order) {
    videoData.Order = lastRow;
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rowData = headers.map(function(header) {
    return videoData[header] || '';
  });

  sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);

  Logger.log('Created video: ' + videoData.ID);
  return createJSONResponse({
    success: true,
    message: 'Video created successfully',
    id: videoData.ID
  });
}

function updateVideo(id, videoData) {
  var sheet = getSheet(VIDEOS_SHEET);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');

  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      videoData['Last Updated'] = new Date();

      var rowData = headers.map(function(header) {
        return videoData[header] !== undefined ? videoData[header] : data[i][headers.indexOf(header)];
      });

      sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);

      Logger.log('Updated video: ' + id);
      return createJSONResponse({
        success: true,
        message: 'Video updated successfully'
      });
    }
  }

  return createJSONResponse({ error: 'Video not found' }, 404);
}

function deleteVideo(id) {
  var sheet = getSheet(VIDEOS_SHEET);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');

  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      sheet.deleteRow(i + 1);
      Logger.log('Deleted video: ' + id);
      return createJSONResponse({
        success: true,
        message: 'Video deleted successfully'
      });
    }
  }

  return createJSONResponse({ error: 'Video not found' }, 404);
}

// ============================================
// WRITE OPERATIONS - ARTICLES
// ============================================

function createArticle(articleData) {
  var sheet = getSheet(ARTICLES_SHEET);
  var lastRow = sheet.getLastRow();
  var newRow = lastRow + 1;

  if (!articleData.ID) {
    articleData.ID = generateID('article');
  }

  articleData['Last Updated'] = new Date();
  articleData['Created Date'] = new Date();

  if (!articleData.Status) {
    articleData.Status = 'Active';
  }

  if (!articleData.Order) {
    articleData.Order = lastRow;
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rowData = headers.map(function(header) {
    return articleData[header] || '';
  });

  sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);

  Logger.log('Created article: ' + articleData.ID);
  return createJSONResponse({
    success: true,
    message: 'Article created successfully',
    id: articleData.ID
  });
}

function updateArticle(id, articleData) {
  var sheet = getSheet(ARTICLES_SHEET);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');

  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      articleData['Last Updated'] = new Date();

      var rowData = headers.map(function(header) {
        return articleData[header] !== undefined ? articleData[header] : data[i][headers.indexOf(header)];
      });

      sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);

      Logger.log('Updated article: ' + id);
      return createJSONResponse({
        success: true,
        message: 'Article updated successfully'
      });
    }
  }

  return createJSONResponse({ error: 'Article not found' }, 404);
}

function deleteArticle(id) {
  var sheet = getSheet(ARTICLES_SHEET);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('ID');

  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      sheet.deleteRow(i + 1);
      Logger.log('Deleted article: ' + id);
      return createJSONResponse({
        success: true,
        message: 'Article deleted successfully'
      });
    }
  }

  return createJSONResponse({ error: 'Article not found' }, 404);
}

// ============================================
// JSON GENERATION
// ============================================

function generateJSON() {
  var videosSheet = getSheet(VIDEOS_SHEET);
  var videosData = videosSheet.getDataRange().getValues();
  var videoHeaders = videosData[0];

  var articlesSheet = getSheet(ARTICLES_SHEET);
  var articlesData = articlesSheet.getDataRange().getValues();
  var articleHeaders = articlesData[0];

  var content = {
    videos: {
      byCategory: {},
      all: []
    },
    articles: {
      byCategory: {},
      all: []
    }
  };

  // Process videos
  for (var i = 1; i < videosData.length; i++) {
    var row = videosData[i];
    if (!row[0] || row[videoHeaders.indexOf('Status')] !== 'Active') continue;

    var video = {
      id: row[videoHeaders.indexOf('ID')],
      title: row[videoHeaders.indexOf('Title')],
      duration: row[videoHeaders.indexOf('Duration')],
      driveUrl: row[videoHeaders.indexOf('Google Drive URL')],
      category: row[videoHeaders.indexOf('Category')],
      description: row[videoHeaders.indexOf('Description')],
      order: row[videoHeaders.indexOf('Order')] || 999
    };

    content.videos.all.push(video);

    if (!content.videos.byCategory[video.category]) {
      content.videos.byCategory[video.category] = [];
    }
    content.videos.byCategory[video.category].push(video);
  }

  // Process articles
  for (var i = 1; i < articlesData.length; i++) {
    var row = articlesData[i];
    if (!row[0] || row[articleHeaders.indexOf('Status')] !== 'Active') continue;

    var article = {
      id: row[articleHeaders.indexOf('ID')],
      category: row[articleHeaders.indexOf('Category')],
      title: row[articleHeaders.indexOf('Link Title')],
      url: row[articleHeaders.indexOf('Link URL')],
      description: row[articleHeaders.indexOf('Description')],
      order: row[articleHeaders.indexOf('Order')] || 999
    };

    content.articles.all.push(article);

    if (!content.articles.byCategory[article.category]) {
      content.articles.byCategory[article.category] = [];
    }
    content.articles.byCategory[article.category].push(article);
  }

  // Sort everything
  content.videos.all.sort(function(a, b) { return a.order - b.order; });
  content.articles.all.sort(function(a, b) { return a.order - b.order; });

  Object.keys(content.videos.byCategory).forEach(function(cat) {
    content.videos.byCategory[cat].sort(function(a, b) { return a.order - b.order; });
  });

  Object.keys(content.articles.byCategory).forEach(function(cat) {
    content.articles.byCategory[cat].sort(function(a, b) { return a.order - b.order; });
  });

  var json = JSON.stringify({ content: content }, null, 2);

  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getSheet(sheetName) {
  var spreadsheet = SpreadsheetApp.openById(KNOWLEDGE_SHEET_ID);
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

function generateID(prefix) {
  var timestamp = new Date().getTime();
  var random = Math.floor(Math.random() * 1000);
  return prefix + '-' + timestamp + '-' + random;
}

function createJSONResponse(data, statusCode) {
  statusCode = statusCode || 200;
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getTestPage() {
  var html = '<html><body>' +
    '<h1>GBS Knowledge Content Manager - Web App</h1>' +
    '<p>✅ Web App is running!</p>' +
    '<p>Sheet ID: ' + KNOWLEDGE_SHEET_ID + '</p>' +
    '<p>Current Time: ' + new Date() + '</p>' +
    '<h2>GET Endpoints:</h2>' +
    '<ul>' +
    '<li>?action=getVideos - Get all videos</li>' +
    '<li>?action=getArticles - Get all articles</li>' +
    '<li>?action=getAll - Get both</li>' +
    '<li>?action=generateJSON - Generate JSON</li>' +
    '</ul>' +
    '<h2>POST Endpoints (Password Required):</h2>' +
    '<ul>' +
    '<li>createVideo, updateVideo, deleteVideo</li>' +
    '<li>createArticle, updateArticle, deleteArticle</li>' +
    '</ul>' +
    '</body></html>';

  return HtmlService.createHtmlOutput(html);
}
