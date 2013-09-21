'use strict';

angular.module('gitSourceApp')
  .controller('MainCtrl', [
          '$scope', '$stateParams', '$state', 'gsConst', '$log',
  function($scope,   $stateParams,   $state,   gsConst,   $log) {

    var DEFAULT_OPTIONS = {
      theme: 'default',
      edit: false,
      result: true
    };

    var _isEmptyObj = (function () {
      var emptyObj = {};
      return function (obj) {
        return angular.equals(obj, emptyObj);
      };
    }());

    $scope.$stateParams = $stateParams;
    $scope.$watch('$stateParams', function (params) {

      if (!_isEmptyObj(params)) {
        $scope.sourcePath = $stateParams.sourcePath;

        var options = angular.copy(params);
        delete options.sourcePath;

        $scope.options = {};
        angular.forEach(options, function(value, key){
          $scope.options[key] = (angular.isDefined(DEFAULT_OPTIONS[key]) && value === null) ?
            DEFAULT_OPTIONS[key] : value;
        });

        $scope.containerTheme = 'light';
        $scope.highlightTheme = 'default';
        if ($scope.options.theme in gsConst.THEME_MAP) {
          $scope.highlightTheme = $scope.options.theme;

          $scope.containerTheme = gsConst.THEME_MAP[$scope.options.theme];
        }
      }

    }, true);
  }]);
