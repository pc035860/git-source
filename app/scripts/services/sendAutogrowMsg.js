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
          _lastHeight = -1,
          func = function () {

            var resultElm = $document.find('iframe')[0],
                codeElm = $document.find('code')[0],
                target = codeElm || resultElm,
                msg = {
                  id: autogrowId,
                  height: target.scrollHeight + (target.offsetTop || target.parentElement.offsetTop)
                };

            if (msg.height === 0) {
              return;
            }

            if (msg.height === _lastHeight) {
              $log.debug('counter add', autogrowId, _repeatCounter, msg.height);
              _repeatCounter++;

              if (_repeatCounter >= REPEAT_THRESHOLD) {
                _stop();
                return;
              }
            }
            else if (msg.height > _lastHeight) {
              $log.debug('repeat counter renewal', autogrowId, msg.height, '>', _lastHeight);

              _repeatCounter = 0;
              _lastHeight = msg.height;

            }

            $window.parent.postMessage(JSON.stringify(msg), '*');

          };

      _stop = $interval(func, MSG_INTERVAL);

      func();
    };

  }]);
