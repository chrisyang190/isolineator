angular.module('app')
.service('isolineatorService', function($http, $window) {

  this.getAll = function(callback) {
    $http.get('/logs')
    .then(function({data}) {
      if(callback) {
        callback(data);
      }
    })
    .catch(function({err}) {
      console.log(err);
    });
  };

  this.searchLogs = function(query, callback) {
    var req = {};
    req.query = query;

    $http({
      method: 'POST',
      url: '/log', 
      data: JSON.stringify(req)
    })
    // $http.get('/log')
    .then(function(data) {
      console.log('success');
      if(callback) {
        callback(data);
      }
    })
    .catch(function(err) {
      console.log('error in searchLogs:', err);
    });
  };

  this.postStream = function(callback) {
  // var formData = new FormData();
  // formData.append('recording', recording, filename);

  $http({
    method: 'POST',
    url: '/testStream', 
  })
  .then(function(data) {
    console.log('data from success:', data);
    if (callback) {
      callback(data);
    }
  })
   .catch(function(err) {
     console.log('error in postRecording', err);
   });
  };

  this.stopStream = function(callback) {
    $http({
      method: 'POST',
      url: '/stopStream', 
    })
    .then(function(data) {
      console.log('voice streaming has stopped', data);
      if (callback) {
        callback(data);
      }
    })
     .catch(function(err) {
       console.log('error in postRecording', err);
     });
    };

  this.postRecording = function(filename, recording, date, callback) { 

    var formData = new FormData();
    formData.append('recording', recording, filename);

    console.log('get recording', formData.get('recording'));

    $http({
      method: 'POST',
      url: '/record', 
      data: formData,
      // contentType: 'multipart/form-data',
      contentType: false,
      transformRequest: angular.identity,
      processData: false,
      headers: {'Content-type': undefined}
    })
    .then(function(data) {
      // console.log('data from success:', data);
      if (callback) {
        callback(data);
      }
    })
     .catch(function(err) {
       console.log('error in postRecording', err);
     });

  };

});