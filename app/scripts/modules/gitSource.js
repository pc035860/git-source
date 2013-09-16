/*jshint undef:true*/
/*global angular*/
angular.module('gitSource', ['ngSelect', 'hljs'])

.factory('_gitSourceData', ['$http', '$q', '$log', function($http, $q, $log) {
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
}])

// ref: https://github.com/angular/code.angularjs.org/blob/master/1.1.5/docs/js/docs.js#L263
.factory('_formPostData', ['$document', function ($document) {
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
}])

// ref: https://github.com/angular/code.angularjs.org/blob/master/1.1.5/docs/js/docs.js#L277
.factory('_openPlunker', ['_formPostData', function (_formPostData) {
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

    _formPostData('http://plnkr.co/edit/?p=preview', postData);
  };
}])

.directive('gitSource', [
         '_gitSourceData', '_openPlunker', '$q', '$log',
function (_gitSourceData,   _openPlunker,   $q,   $log) {
  return {
    restrict: 'EA',
    scope: {
      sourcePath: "@gitSource",
      config: "=gitSourceOptions"
    },
    templateUrl: 'views/git-source-template.html',
    link: function(scope, iElm, iAttrs) {
      var _sourceData = null,
          _config = null,
          // first highlight flag
          _highlighted = false;

      scope.fileIndex = null;
      scope.files = [];

      scope.model = {
        currentFilename: null,
        specifiedFileContent: null
      };

      scope.editOnPlunker = function () {
        _openPlunker(_sourceData.files, _sourceData.description, _sourceData.tags);
      };

      scope.onHighlight = function () {
        _highlighted = true;

        _digestConfig(_config);
      };

      scope.$watch('sourcePath', function (newPath, oldPath) {
        if (angular.isString(newPath) && newPath) {
          if (newPath.charAt(0) === '.') {
            newPath = newPath.substr(1);
          }
          else if (newPath.charAt(0) !== '/') {
            newPath = '/' + newPath;
          }

          if (newPath.substr(-1) !== '/') {
            newPath += '/';
          }

          $log.info(newPath);

          scope.fileIndex = {};
          scope.model.currentFilename = null;
          scope.files.length = 0;

          _gitSourceData(newPath)
          .then(function (data) {
            angular.forEach(data.files, function (fileInfo, name) {
              var obj = {
                name: name,
                content: fileInfo.content
              };
              scope.files.push(obj);
              scope.fileIndex[name] = obj;
            });

            scope.model.currentFilename = scope.files[0].name;

            // save plunk data
            _sourceData = data;
          });
        }
      });

      scope.$watch('config', function (config) {
        if (angular.isDefined(config) && angular.isObject(config)) {
          _config = angular.copy(config);

          // process config

          angular.forEach(_config, function (k, v) {
            switch (v) {
              case 'result':
                _config[v] = scope.$eval(k);
                break;
            }
          });

          if (_highlighted) {
            _digestConfig(_config);
          }
        }
      }, true);

      function _digestConfig(config) {
        if (!config) {
          return;
        }

        if (config.fontsize) {
          iElm.find('pre').css('font-size', config.fontsize + 'px');
        }

        scope.model.specifiedFileContent = null;
        if (config.file && config.file in scope.fileIndex) {
          scope.model.specifiedFileContent = scope.fileIndex[config.file].content;

          if (config.line) {
            var buf = config.line.split('-'),
                fromLine, toLine;

            if (buf.length < 2) {
              fromLine = toLine = Math.max(1, parseInt(buf[0], 10));
            }
            else {
              fromLine = buf[0];
              toLine = buf[1];
            }

            var lines = scope.model.specifiedFileContent.match(/^.*$/mg);
            if (lines) {
              scope.model.specifiedFileContent = lines.slice(fromLine - 1, toLine).join('\n');
            }
          }
        }
      }
    }
  };
}]);
