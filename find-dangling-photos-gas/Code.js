// stolen auth from: https://github.com/googleworkspace/apps-script-oauth2

// web client 2


function writeAlbumStats() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("album stats");
  sheet.clear()
  sheet.appendRow(['title', 'albumIndex', 'album id', 'count', 'estimated size'])
  //sheet.appendRow([myjson['albums'][i]['title'], albumCount, myjson['albums'][i]['id'], photosInAlbum.length])
  var photosService = getPhotosService();
  var pageToken = null;
  var albumCount = 0;
  var photoCount = 0;
  var allPhotoIdsInAllAlbums = new Array();
  while (true) {
    //Logger.log("page");
    var url = 'https://photoslibrary.googleapis.com/v1/albums'
    if (pageToken != null) {
      url += "?pageToken=" + pageToken;
      //Logger.log("album level page token:" + pageToken);
    }
    var response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'Bearer ' + photosService.getAccessToken()
      }
    });
    //Logger.log(response);
    var albums = new Array();
    var myjson = JSON.parse(response);
    if (myjson['nextPageToken']) {
      pageToken = myjson['nextPageToken'];
    } else {
      break;
    }
    var i;
    var length = myjson['albums'].length;
    for (i = 0; i < myjson['albums'].length; i++) {
      Logger.log("Album: " + myjson['albums'][i]['title'] + " (" + albumCount + ") (id: " + myjson['albums'][i]['id'] + " )");
      albumCount++;
      photoCount += parseInt(myjson['albums'][i]['mediaItemsCount']);
      //var photosInAlbum = listPhotosInAlbum(myjson['albums'][i]['id']);
      sheet.appendRow([myjson['albums'][i]['title'], albumCount, myjson['albums'][i]['id'], myjson['albums'][i]['mediaItemsCount'], myjson['albums'][i]['mediaItemsCount']*3])
    }
  }
  Logger.log("photos in albums count " + photoCount);
  Logger.log("album count " + albumCount)
}


function selectStuffToDelete() {
  // no sense looking at stuff before 2021-June because prior to this date, all Google Photos was free :)
  var photosService = getPhotosService();
  var pageToken = null;
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("live");
  sheet.clear()
  sheet.appendRow(['in album?', 'id', 'productUrl', 'creationTime'])
  var allPhotoIdsInAllAlbums = compilePhotosInAlbums();
  while (true) {
    var url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search'
    var data = {
      "pageSize": "100",
      "orderBy": "MediaMetadata.creation_time desc",
      "filters": {
        "dateFilter": {
          "ranges": [
            {
              "startDate": {
                "year": 2022,
                "month": 1,
                "day": 1
              },
              "endDate": {
                "year": 2025,
                "month": 1,
                "day": 31
              }
            }
          ]
        }
      }
    }
    if (pageToken != null) {
      data['pageToken'] = pageToken;
    }
    var options = {
      "method" : "POST",
      "contentType" : "application/json",
      "headers" : {
          Authorization: 'Bearer ' + photosService.getAccessToken()
        },
      "payload" : JSON.stringify(data)
    };
    
    var response = UrlFetchApp.fetch(url, options);
    var myjson = JSON.parse(response);

    for (i = 0; i < myjson['mediaItems'].length; i++) {
      var inAlbum = allPhotoIdsInAllAlbums.indexOf(myjson['mediaItems'][i].id) >= 0
      if (!inAlbum) {
        sheet.appendRow([inAlbum, myjson['mediaItems'][i].id, myjson['mediaItems'][i].productUrl, myjson['mediaItems'][i]['mediaMetadata']['creationTime']])
      }
      /*if (!inAlbum) {
        addPhotosToTrashAlbum([myjson['mediaItems'][i].id])
      }*/
    }
    if (myjson['nextPageToken']) {
      pageToken = myjson['nextPageToken'];
      Logger.log("listPhotosdryrun pageToken: " + pageToken);
    } else {
      Logger.log("listPhotosdryrun: no more pages");
      break;
    }
  }
}

function listPhotosInAlbum(albumId) {
  var photosService = getPhotosService();
  var pageToken = null;
  var allPhotosInAlbum = new Array();
  while (true) {
    var url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search'
    var data = {
      "pageSize": "100",
      "albumId": albumId
    };
    if (pageToken != null) {
      data['pageToken'] = pageToken;
    }
    var options = {
      "method" : "POST",
      "contentType" : "application/json",
      "headers" : {
          Authorization: 'Bearer ' + photosService.getAccessToken()
        },
      "payload" : JSON.stringify(data)
    };
    
    var response = UrlFetchApp.fetch(url, options);
    var myjson = JSON.parse(response);

    var length = myjson['mediaItems'].length;
    for (i = 0; i < myjson['mediaItems'].length; i++) {
      allPhotosInAlbum.push(myjson['mediaItems'][i]['id']);
    }
    if (myjson['nextPageToken']) {
      pageToken = myjson['nextPageToken'];
      //Logger.log("listPhotosInAlbum pageToken: " + pageToken);
    } else {
      //Logger.log("no more pages");
      pageToken
      break;
    }
  }
  //Logger.log(allPhotosInAlbum);
  return(allPhotosInAlbum);
}

function compilePhotosInAlbums() {
  var allPhotoIdsInAllAlbums = loadDataFromCache("allPhotoIdsInAllAlbums");
  if (allPhotoIdsInAllAlbums != null) {
    return(allPhotoIdsInAllAlbums);
  }
  var photosService = getPhotosService();
  var pageToken = null;
  var albumCount = 0;
  var photoCount = 0;
  var allPhotoIdsInAllAlbums = new Array();
  while (true) {
    //Logger.log("page");
    var url = 'https://photoslibrary.googleapis.com/v1/albums'
    if (pageToken != null) {
      url += "?pageToken=" + pageToken;
      //Logger.log("album level page token:" + pageToken);
    }
    var response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'Bearer ' + photosService.getAccessToken()
      }
    });
    //Logger.log(response);
    var albums = new Array();
    var myjson = JSON.parse(response);
    if (myjson['nextPageToken']) {
      pageToken = myjson['nextPageToken'];
    } else {
      break;
    }
    var i;
    var length = myjson['albums'].length;
    for (i = 0; i < myjson['albums'].length; i++) {
      Logger.log("Album: " + myjson['albums'][i]['title'] + " (" + albumCount + ") (id: " + myjson['albums'][i]['id'] + " )");
      albumCount++;
      photoCount += parseInt(myjson['albums'][i]['mediaItemsCount']);
      allPhotoIdsInAllAlbums += listPhotosInAlbum(myjson['albums'][i]['id']);
    }
  }
  Logger.log("photos in albums count " + photoCount);
  Logger.log("album count " + albumCount)
  saveDataToCache("allPhotoIdsInAllAlbums", allPhotoIdsInAllAlbums)
  return(allPhotoIdsInAllAlbums);
}




function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .createMenu('Custom Menu')
    .addItem('Show Auth Sidebar', 'showSidebar')
    .addItem('selectStuffToDelete', 'selectStuffToDelete')
    .addItem('Crunch Album Stats', 'writeAlbumStats')
    .addToUi();
}