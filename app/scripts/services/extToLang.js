'use strict';

angular.module('gitSourceApp')
  .factory('extToLang', [function () {

    /**
     * Current available map: webby extensions only
     */
    var MAP = {
      js: 'javascript',
      html: 'xml',
      htm: 'xml',
      css: 'css',
      json: 'json',
      md: 'markdown'
    };

    return function extToLang(extension) {
      extension = extension.toLowerCase();

      return MAP[extension] || null;
    };

  }]);
