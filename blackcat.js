var SPACE = SPACE || {};
window.startGame = function () {
  SPACE.blackcat = {
    randomPosition: function (excludePosition) {
      var position = excludePosition;
      while (position === excludePosition) {
        var i = parseInt(Math.random() * 20 + 1, 0);
        if (i <= 5) {
          position = 'LEFT';
        } else if (i <= 10) {
          position = 'TOP';
        } else if (i <= 15) {
          position = 'RIGHT';
        } else if (i <= 20) {
          position = 'BOTTOM';
        }
      }
      return position;
    },
    getMaxAvailablePosition: function (position) {
      var max = ('TOP' === position || 'BOTTOM' === position) ? window.innerWidth
        : window.innerHeight;
      return max;
    },
    define2dPoint: function (position , value) {
      var point2d = { x: 0,  y: 0 };
      if (position === 'TOP') {
        point2d = { x: value,  y: 0 };
      }
      if (position === 'BOTTOM') {
        point2d = { x: value,  y: window.innerHeight };
      }
      if (position === 'LEFT') {
        point2d = { x: 0,  y: value };
      }
      if (position === 'RIGHT') {
        point2d = { x: window.innerWidth,  y: value };
      }
      return point2d;
    },
    prepareStartPosition: function () {
      var position = this.randomPosition(null);
      var max = this.getMaxAvailablePosition(position);
      var endPosition = this.randomPosition(position);
      var maxEnd = this.getMaxAvailablePosition(endPosition);
      return {
        startPosition: position,
        startPoint: this.define2dPoint(position , (Math.random() * max + 1)),
        endPosition: endPosition,
        endPoint: this.define2dPoint(endPosition , (Math.random() * maxEnd + 1))
      };
    },
    prepareInterval: function (points) {
      var blackcat = document.getElementById('blackcat');

      var xCurrent = points.startPoint.x;
      var xDestination = points.endPoint.x;
      var speedX = xDestination - xCurrent > 0 ? 3 : -3;

      var yCurrent = points.startPoint.y;
      var yDestination = points.endPoint.y;
      var speedY = yDestination - yCurrent > 0 ? 3 : -3;
      blackcat.style.left = xCurrent;
      blackcat.style.top = yCurrent;
      blackcat.style.display = 'block';

      SPACE.blackcat.points = points;
      this.interval = setInterval(
        function () {
          var xCurrent = points.startPoint.x;
          var xDestination = points.endPoint.x;
          var yCurrent = points.startPoint.y;
          var yDestination = points.endPoint.y;

          if ((xCurrent < 0 || xCurrent > window.innerWidth) ||
            (yCurrent < 0 || yCurrent > window.innerHeight)) {
            SPACE.blackcat.stopCat(true);
            return;
          }

          xCurrent += speedX;
          points.startPoint.x = xCurrent;
          blackcat.style.left = xCurrent + 'px';

          yCurrent += speedY;
          points.startPoint.y = yCurrent;
          blackcat.style.top = yCurrent + 'px';
        }, 20);
    },
    interval: null,
    points: null,
    runCatRun: function () {
      var points = this.prepareStartPosition();
      this.prepareInterval(points);
    },
    stopCat: function (shouldRestart) {
      clearInterval(this.interval);
      this.interval = null;
      blackcat.style.display = 'none';
      if (shouldRestart) {
        SPACE.blackcat.runCatRun();
      }
    }
  };

  var btnCat = document.getElementById('btnCat');
  btnCat.onclick = function (e) {
    if (SPACE.blackcat.interval == null) {
      SPACE.blackcat.runCatRun();
      btnCat.textContent = 'Stop BlackCat';
    }else {
      SPACE.blackcat.stopCat();
      btnCat.textContent = 'Start BlackCat';
    }
  };
};

if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', startGame, false);
} else {
  window.attachEvent('onload', startGame);
}
