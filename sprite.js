'use strict';

( () => {
  class Sprite {
    constructor (p) {
      if (!p) {
        p = {};
      }
      this.angle = p.angle || 0.7;
      this.x = p.x || 400;
      this.y = p.y || 300;
      this.color = p.color || 'white';
      this.isDead = false;
    }
  }
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Sprite;
  } else {
    window.Validator = Sprite;
  }
})();
