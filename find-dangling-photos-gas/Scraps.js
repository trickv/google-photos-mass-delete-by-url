
function getSomePhotoDefinitelyInAlbum() {
  var url = 'https://photoslibrary.googleapis.com/v1/mediaItems/AIZWZ9fdD6yfIl7FOrNf-rMttEnkH5-5tGfhpzqCvsdHco7n3_d0_n_z_wGRrqVjzHV4RGdIffnYW9m0s3TjdtjCj_JKlnaWFw'
  var photosService = getPhotosService();
  var response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: 'Bearer ' + photosService.getAccessToken()
    }
  });
  Logger.log(response);
  var myjson = JSON.parse(response);
  Logger.log(myjson);
  var x = 0;

  //allPhotoIdsInAllAlbums.find
  // success, this photo was found in the list, magic!
}



function listMediaItems() {
  var photosService = getPhotosService();
  var response = UrlFetchApp.fetch('https://photoslibrary.googleapis.com/v1/mediaItems', {
    headers: {
      Authorization: 'Bearer ' + photosService.getAccessToken()
    }
  });
  var foo = response.getContent();
  Logger.log(response);
}

// https://photoslibrary.googleapis.com/v1/albums
function listAlbumsSimple() {
  var photosService = getPhotosService();
  var response = UrlFetchApp.fetch('https://photoslibrary.googleapis.com/v1/albums', {
    headers: {
      Authorization: 'Bearer ' + photosService.getAccessToken()
    }
  });
  Logger.log(response);
}

//https://photoslibrary.googleapis.com/v1/mediaItems/media-item-id
function getExampleVideoInAlbum() {
  var photosService = getPhotosService();
  var response = UrlFetchApp.fetch('https://photoslibrary.googleapis.com/v1/mediaItems/AIZWZ9dgyVzABUJ3JoQTgsashV180PiGZd7XpeqltY3g5EsBz3e2POw6ZFXiZ1gkKCLRgfXLldwnv62PUOCRbdiUyTtYLCqVbg', {
    headers: {
      Authorization: 'Bearer ' + photosService.getAccessToken()
    }
  });
  Logger.log(response);
}



function logout() {
  var service = getPhotosService()
  service.reset();
}



function getPhotoDefinitelyInAlbum() {
  var url = 'https://photoslibrary.googleapis.com/v1/mediaItems/AIZWZ9fdD6yfIl7FOrNf-rMttEnkH5-5tGfhpzqCvsdHco7n3_d0_n_z_wGRrqVjzHV4RGdIffnYW9m0s3TjdtjCj_JKlnaWFw'
  var photosService = getPhotosService();
  var response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: 'Bearer ' + photosService.getAccessToken()
    }
  });
  Logger.log(response);
  var myjson = JSON.parse(response);
  Logger.log(myjson);
  var allPhotoIdsInAllAlbums = compilePhotosInAlbums();

  //allPhotoIdsInAllAlbums.find
  Logger.log(allPhotoIdsInAllAlbums.indexOf(myjson['id']))
  // success, this photo was found in the list, magic!
}

function createTrashAlbum() {
  // https://developers.google.com/photos/library/guides/manage-albums
  //var trashAlbumId = "AIZWZ9c6nYqUoN1ozNhmlPP2T4lRxyPmnk7QRikm_ALDNn6_lAZvkIckBARieumxIKkljNqDSn08"
  var url = "https://photoslibrary.googleapis.com/v1/albums"
  var photosService = getPhotosService();
  var data = {
    "album": {
      "title": "__delete_me2__"
    }
  };
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
  Logger.log(response)
  Logger.log(myjson)
}

function testAddSomePhotoToTrashAlbum() {
  var photoId = "AIZWZ9dEe04KEQu83dm7h6mGO3EdDkijO9c9etcSaP_Bl4WPfw4gMZViJDSHd7l6Ylg_N5PkzaN-nXrRBb_i3CNpMc_juoFOYA"
  addPhotosToTrashAlbum([photoId])
}

function addPhotosToTrashAlbum(mediaItemIds) {
  // https://photoslibrary.googleapis.com/v1/albums/{albumId}:batchAddMediaItems
  // https://developers.google.com/photos/library/reference/rest/v1/albums/batchAddMediaItems
  // var trashAlbumId = "AIZWZ9c6nYqUoN1ozNhmlPP2T4lRxyPmnk7QRikm_ALDNn6_lAZvkIckBARieumxIKkljNqDSn08" // user-created __delete me 1
  Logger.log("Adding to delete: " + mediaItemIds)
  var trashAlbumId = "AIZWZ9dl4LcUzqX1qwI03o31rS5mIpisZMkqdqgGCeMQBoiozs_bi3_26p-u1fXoCrYmxLcduq_2" // created from this app __delete_me2__
  var url = "https://photoslibrary.googleapis.com/v1/albums/" + trashAlbumId + ":batchAddMediaItems"
  var photosService = getPhotosService();
  var data = {
    "mediaItemIds": mediaItemIds
  };
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
  Logger.log(response)
  Logger.log(myjson)
}


function sampleAlbum() {
  // 3d printer album
  var albumId = "AIZWZ9ehhoHF2n38et6mWeVIzYuTQbJsjhypHpf4MQ4B2Qfa1P6OpvgKYcYKUQiNcBJa8HjmaxZ-"
  var url = "https://photos.google.com/lr/album/AIZWZ9ehhoHF2n38et6mWeVIzYuTQbJsjhypHpf4MQ4B2Qfa1P6OpvgKYcYKUQiNcBJa8HjmaxZ-"
  listPhotosInAlbum(albumId);
}

function longAlbum() {
  listPhotosInAlbum("AIZWZ9eXFcrDnoOsfgAgQ0CgKdIW4F1pc737tkHVzPRcDzT84cupCvpzi0Rhg9Ezq54MQ4QAGiQe");
}