'use strict';

angular.module('gitSourceApp')
  .directive('gitSource', [
           'gitSourceData', 'openPlunker', '$q', '$log', 'sendAutogrowMsg', '$timeout', 'extToLang', '$localStorage', 'popoutWindow',
  function (gitSourceData,   openPlunker,   $q,   $log,   sendAutogrowMsg,   $timeout,   extToLang,   $localStorage,   popoutWindow) {
    return {
      restrict: 'EA',
      scope: {
        sourcePath: "@gitSource",
        config: "=gitSourceOptions"
      },
      templateUrl: 'git-source-template.html',
      link: function(scope, iElm, iAttrs) {
        var RESULT_FILE_NAME = '?RESULT?';

        var _sourceData = null,
            _config = null,
            // first highlight flag
            _highlighted = false;

        scope.$localStorage = $localStorage;

        scope.RESULT_FILE_NAME = RESULT_FILE_NAME;

        scope.fileIndex = null;
        scope.files = [];

        scope.model = {
          currentFilename: null,
          specifiedFileContent: null,
          focused: false
        };

        scope.popoutResult = function () {
          popoutWindow(scope.resultPath);
        };

        scope.editOnPlunker = function () {
          openPlunker(_sourceData.files, _sourceData.description, _sourceData.tags);
        };

        scope.onHighlight = function () {
          _highlighted = true;

          _digestConfig(_config);

          if (_config.autogrow) {
            sendAutogrowMsg(_config.autogrow);
          }
        };

        scope.$watch('$localStorage.popout', function (val) {
          if (val && scope.model.currentFilename === RESULT_FILE_NAME && scope.model.focused) {
            scope.popoutResult();
          }
        });

        scope.$watch('model.currentFilename', function (name) {
          if (name === RESULT_FILE_NAME && _config.autogrow) {
            $timeout(function () {
              sendAutogrowMsg(_config.autogrow);
            });
          }
        }, true);

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

            scope.resultPath = newPath;

            scope.fileIndex = {};
            scope.model.currentFilename = null;
            scope.files.length = 0;

            gitSourceData(newPath)
            .then(function (data) {
              angular.forEach(data.files, function (fileInfo, name) {
                var ext = name.substr(name.lastIndexOf('.') + 1),
                    obj = {
                      name: name,
                      content: fileInfo.content,
                      lang: extToLang(ext) || ''
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
