'use strict';

angular.module('gitSourceApp')
  .factory('$interval', ['$timeout', function ($timeout) {
    /**
     * setInterval implementation with $timeout
     * @param  {function} intCallback called by every ms
     * @param  {number}   ms          interval ms
     * @return {function}             interval stopper
     */
    return function $interval (intCallback, ms) {
      var itrIndex = 0,
          timeoutPromise,
          stopFlag = false,
          loop = function () {
            timeoutPromise = $timeout(function () {
              if (angular.isFunction(intCallback)) {
                intCallback(itrIndex++);
              }
              if (!stopFlag) {
                loop();
              }
            }, ms);
          };

      loop();

      return function () {
        stopFlag = true;
        return $timeout.cancel(timeoutPromise);
      };
    };
  }]);
