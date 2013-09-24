'use strict';

angular.module('gitSourceApp')
  .factory('popoutWindow', function () {

    return function popoutWindow(url) {
      var name = 'gitsource_popout',
          width = 980,
          height = screen.availHeight * 0.85,
          params = {
            menubar: 'no', scrollbars: 'no', resizable: 'no',
            width: width, height: height,
            'top': (screen.availHeight-height)/2, left: (screen.availWidth-width)/2
          },
          l = [], k, v,
          target;

      for( var k in params ){
        v = params[k];
        l.push( k + '=' + v );
      }

      target = window.open(url, name, l.join(','));

      try {
        if (!target.opener) {
          target.opener = self;
        }
      } catch(e) {}

      if (window.focus) {
        target.focus();
      }
      return target;
    }

  });
