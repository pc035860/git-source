(function (w, d) {
  d.addEventListener('DOMContentLoaded', function () {
    var iframes = d.getElementsByTagName('iframe');

    w.addEventListener('message', function (evt) {
      var msg = JSON.parse(evt.data),
          i, l = iframes.length;

      for (i = 0; i < l; i++) {
        if (iframes[i].src.indexOf('autogrow=' + msg.id) > 0) {
          iframes[i].height = msg.height;
          return;
        }
      }
    });

  }, false);
})(window, document);
