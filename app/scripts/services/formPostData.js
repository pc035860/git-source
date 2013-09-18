'use strict';

angular.module('gitSourceApp')

  // ref: https://github.com/angular/code.angularjs.org/blob/master/1.1.5/docs/js/docs.js#L263
  .factory('formPostData', ['$document', function ($document) {
    return function(url, fields) {
      var form = angular.element('<form style="display: none;" method="post" action="' + url + '" target="_blank"></form>');
      angular.forEach(fields, function(field) {
        var name = field.name,
            value = field.value;

        var input = angular.element('<input type="hidden" name="' +  name + '">');
        input.attr('value', value);
        form.append(input);
      });
      $document.find('body').append(form);
      form[0].submit();
      form.remove();
    };
  }]);
