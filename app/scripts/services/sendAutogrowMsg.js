'use strict';

angular.module('gitSourceApp')
  .factory('sendAutogrowMsg', [
           '$window', '$location', '$document', '$log', '$interval',
  function ($window,   $location,   $document,   $log,   $interval) {

    var MSG_INTERVAL = 100,
        REPEAT_THRESHOLD = 10;

    var _stop;

    return function (autogrowId) {
      (_stop || angular.noop)();

      var _repeatCounter = 0,
          _lastValue = -1,
          func = function () {

            var resultElm = $document.find('iframe')[0],
                codeElm = $document.find('code')[0],
                target = codeElm || resultElm,
                msg = {
                  id: autogrowId,
                  height: target.scrollHeight + (target.offsetTop || target.parentElement.offsetTop)
                },
                msgStr = JSON.stringify(msg);

            if (msg.height === 0) {
              return;
            }

            if (msgStr === _lastValue) {
              _repeatCounter++;

              if (_repeatCounter >= REPEAT_THRESHOLD) {
                _stop();
                return;
              }
            }
            else if (msgStr > _lastValue) {
              _repeatCounter = 0;
              _lastValue = msgStr;
            }

            $window.parent.postMessage(msgStr, '*');

          };

      _stop = $interval(func, MSG_INTERVAL);

      func();
    };

  }]);