// written by ChatGPT! https://chatgpt.com/share/67a24e52-1ef8-800e-88db-faf13674e0c6

function saveDataToCache(key, value) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Cache");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Cache"); // Create if missing
  }

  var jsonString = JSON.stringify(value);
  var chunkSize = 49000; // Slightly below the 50,000 limit
  var chunks = [];

  // Split JSON string into chunks
  for (var i = 0; i < jsonString.length; i += chunkSize) {
    chunks.push(jsonString.substring(i, i + chunkSize));
  }

  var data = sheet.getRange("A:A").getValues(); // Get all keys in column A
  var row = data.findIndex(row => row[0] === key) + 1; // Find row index

  if (row === 0) {
    row = sheet.getLastRow() + 1; // Append new row if key doesn't exist
  }

  sheet.getRange(row, 1).setValue(key); // Store key in column A
  sheet.getRange(row, 2, 1, chunks.length).setValues([chunks]); // Store chunks in columns B, C, D...
}

function loadDataFromCache(key) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Cache");
  if (!sheet) {
    Logger.log("Cache sheet not found");
    return null;
  }

  var data = sheet.getRange("A:ZZ").getValues(); // Read all key-value pairs (up to 25 columns)
  var row = data.findIndex(row => row[0] === key);

  if (row === -1) {
    Logger.log("Key not found in cache");
    return null;
  }

  try {
    // Reassemble JSON string from multiple columns (ignoring empty columns)
    var jsonString = data[row].slice(1).filter(Boolean).join("");

    return JSON.parse(jsonString); // Parse JSON back to object
  } catch (e) {
    Logger.log("Error parsing JSON: " + e);
    return null;
  }
}
