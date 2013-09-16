'use strict';

angular.module('GSApp')
  .controller('MainCtrl', [
          '$scope', '$stateParams', '$state', 'gsConst', '$log',
  function($scope,   $stateParams,   $state,   gsConst,   $log) {

    var _isEmptyObj = (function () {
      var emptyObj = {};
      return function (obj) {
        return angular.equals(obj, emptyObj);
      };
    }());

    $scope.$stateParams = $stateParams;
    $scope.$watch('$stateParams', function (params) {

      $log.info(params);

      if (!_isEmptyObj(params)) {
        $scope.sourcePath = $stateParams.sourcePath;

        var options = angular.copy(params);
        delete options.sourcePath;
        $scope.options = options;

        $scope.containerTheme = 'light';
        $scope.highlightTheme = 'default';
        if ($scope.options.theme in gsConst.THEME_MAP) {
          $scope.highlightTheme = $scope.options.theme;

          $scope.containerTheme = gsConst.THEME_MAP[$scope.options.theme];
        }
      }

    }, true);

    function _parseOptions(locationHash) {
      var c = 0,
          keyBuf = null,
          output = {};
      angular.forEach(locationHash.split(/\//), function (piece) {
        if (piece != '') {
          if (c % 2 === 0) {
            // key
            keyBuf = piece;
          }
          else if (keyBuf !== null) {
            // value
            output[keyBuf] = piece;
            keyBuf = null;
          }
          c++;
        }
      });
      return output;
    }
  }]);
