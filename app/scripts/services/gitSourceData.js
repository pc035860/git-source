'use strict';

angular.module('gitSourceApp')
  .factory('gitSourceData', ['$http', '$q', '$log', function($http, $q, $log) {
    var SOURCE_CONFIG_NAME = 'git-source.json';

    return function (sourcePath) {
      var retData;

      return $http.get(sourcePath + SOURCE_CONFIG_NAME)
        .then(function (res) {
          retData = res.data;

          var promises = [];

          angular.forEach(retData.files, function (filename) {
            promises.push($http.get(sourcePath + filename));
          });

          return $q.all(promises);
        })
        .then(function (list) {
          var filenames = retData.files;
          // override with object
          retData.files = {};

          angular.forEach(filenames, function (filename, i) {
            retData.files[filename] ={
              filename: filename,
              content: list[i].data
            };
          });

          return retData;
        })
        .then(null, function (res) {
          return null;
        });
    };
  }]);
