'use strict';

angular.module('gitSourceApp')

  // ref: https://github.com/angular/code.angularjs.org/blob/master/1.1.5/docs/js/docs.js#L277
  .factory('openPlunker', ['formPostData', function (formPostData) {
    return function (files, description, tags) {
      var postData = [];

      description = description || '';
      tags = tags || [];

      angular.forEach(files, function (file) {
        postData.push({
          name: 'files[' + file.filename + ']',
          value: file.content
        });
      });

      angular.forEach(tags, function (tag) {
        postData.push({
          name: 'tags[]',
          value: tag
        });
      });

      postData.push({
        name: 'private',
        value: true
      });
      postData.push({
        name: 'description',
        value: description
      });

      formPostData('http://plnkr.co/edit/?p=preview', postData);
    };
  }]);
