/**
 * such code is intended t be strictly fun and experimental.
 * autor: Sombriks
 * since 2012
 */

const random = (n) => Math.random() * n;

import { Sprite } from './sprite.js';

window.toskeiraspace = () => {
  let c = document.getElementById('c');
  class Player {
    constructor (score, pangle, initialClick, initialMove) {
      this.score = score;
      this.pangle = pangle;
      this.click = initialClick;
      this.move = initialMove;
      this.target = null;
    }

    draw (ctx) {
      ctx.fillStyle = 'White';
      ctx.fillText(`score: ${this.score},`, 10, 10);
    }
  }

  let player = new Player(0, 1, { x: 400, y: 300 }, { x: 400, y: 300 });

  class Rock extends Sprite {
    constructor (p) {
      super(p);
      this.x = random(800);
      this.y = random(600);
      this.width = 5;
      this.points = [ {
        x: -5 + random(-2),
        y: 5 + random(3)
      }, {
        x: 5 + random(2),
        y: 5 + random(4)
      }, {
        x: 5 + random(2),
        y: -5 + random(-3)
      }, {
        x: 2 + random(2),
        y: -5 + random(-3)
      }, {
        x: -5 + random(-2.6),
        y: -5 + random(-2)
      }, {
        x: -5 + random(2),
        y: 5 + random(2)
      } ];
      this.angle = Math.random();
      this.step = () => {
        this.angle += 0.01;
      };
      this.draw = (ctx) => {
        ctx.strokeStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        let i = this.points.length;
        while (i-- > 0) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.stroke();
      };
      this.mouseover = (player) => {
        let x = player.move.x - this.x;
        let y = player.move.y - this.y;
        return Math.sqrt(x * x + y * y) < 15;
      };
    }

  }

  class Bullet extends Sprite {
    constructor (p) {
      super(p);
      this.dx = p.dx;
      this.dy = p.dy;
      this.range = 400;
      this.target = p.target;
      this.speed = 1.7;
      this.step = () => {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);

        let stopped = false;
        // it will not float forever...
        if (stopped || this.range < 0) {
          this.isDead = true;
          if (stopped) {
            this.target.isDead = true;
          }
        }
        this.range--;
      };
      this.draw = (ctx) => {
        ctx.strokeStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 4, 0, Math.PI * 2, false);
        ctx.stroke();
      };
      this.checkColision = (arrObject) => {
        let bulletColisionRangeX1 = this.x - 30;
        let bulletColisionRangeY1 = this.y - 30;

        let insideX = (objX) => {
          return (bulletColisionRangeX1 <= objX && objX <= (bulletColisionRangeX1 + 60));
        };

        let insideY = (objY) => {
          return (bulletColisionRangeY1 <= objY && objY <= (bulletColisionRangeY1 + 60));
        };

        return arrObject.forEach((element) => {
          if (insideX(element.x) && insideY(element.y)) {
            if ((element.x - element.width) <= (this.x + 2) && (this.x - 2) <= (element.x + element.width) && (element.y - element.width) <= (this.y + 2) && (this.y - 2) <= (element.y + element.width)) {
              this.isDead = true;
              element.isDead = true;
            }
          }
        });
      };
    }
  }

  class Ship extends Sprite {
    constructor (p) {
      super(p);

      this.openFire = false;
      this.draw = (ctx) => {
        ctx.strokeStyle = 'LimeGreen'; // little hack
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -15);
        ctx.lineTo(10, 5);
        ctx.lineTo(-10, 5);
        ctx.lineTo(0, -15);
        ctx.stroke();
      };

      this.step = () => {
        // rotate
        let x = player.move.x - this.x;
        let y = player.move.y - this.y;
        this.originalAngle = Math.atan2(y, x);
        this.angle = this.originalAngle + Math.PI / 2;

        let k = Math.abs(this.angle).toFixed(1);
        let w = Math.abs(player.pangle).toFixed(1);
        if (k === w) {
          player.score += 2;
          player.pangle = random(1).toFixed(1);
        }

        // move (and shoot something maybe)
        x = player.click.x - this.x;
        y = player.click.y - this.y;
        let d = Math.sqrt(x * x + y * y);
        if (d) {
          this.x += (x > 15 ? 0.7 : x < -15 ? -0.7 : 0);
          this.y += (y > 15 ? 0.7 : y < -15 ? -0.7 : 0);
        }
        if (this.openFire && player.target) {
          this.openFire = false;
          bullets.push(makeBullet(this.x, this.y, this.originalAngle, player.target.x, player.target.y, player.target));
        }
      };
    }
  }

  let bullets = [];
  let asteroids = [];
  let ship = new Ship();

  let makeBullet = (sx, sy, sa, px, py, tgt) => {
    return new Bullet({
      x: sx,
      y: sy,
      dx: px,
      dy: py,
      color: 'cyan',
      angle: sa,
      target: tgt
    });
  };

  let makeRock = () => {
    return new Rock();
  };

  let makeAsteroids = () => {
    let i = 30;
    while (i--) {
      asteroids.push(makeRock());
    }
  };

  makeAsteroids();

  let step = () => {
    // cleanup first
    let i = bullets.length;
    let b2 = [];
    while (i--) {
      if (!bullets[i].isDead) {
        b2.push(bullets[i]);
      }
    }
    bullets = b2;
    i = asteroids.length;
    b2 = [];
    while (i--) {
      if (!asteroids[i].isDead) {
        b2.push(asteroids[i]);
      } else {
        player.score += 10;
      }
    }
    asteroids = b2;
    player.target = null;
    // simulation step
    i = bullets.length;
    while (i--) {
      bullets[i].step();
    }
    i = asteroids.length;
    while (i--) {
      if (asteroids[i].mouseover(player)) {
        player.target = asteroids[i];
      }
      asteroids[i].step();
    }
    ship.step();
  };

  let draw = ctx => {
    // we always wipe the screen
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.save();
    player.draw(ctx); // HUD
    ship.draw(ctx);
    ctx.restore();
    let i = asteroids.length;
    while (i--) {
      ctx.save();
      asteroids[i].draw(ctx);
      ctx.restore();
    }
    i = bullets.length;
    while (i--) {
      ctx.save();
      bullets[i].checkColision(asteroids, ctx);
      bullets[i].draw(ctx);
      ctx.restore();
    }
  };

  let click = e => {
    if (player.target) { // shoot instead change destination
      ship.openFire = true;
    } else {
      player.click.x = e.clientX - c.offsetLeft;
      player.click.y = e.clientY - c.offsetTop;
    }
  };

  c.onclick = click;

  let move = e => {
    player.move.x = e.clientX - c.offsetLeft;
    player.move.y = e.clientY - c.offsetTop;
  };

  c.onmousemove = move;

  let ctx = c.getContext('2d');
  function mainLoop () {
    step();
    draw(ctx);
    setTimeout(mainLoop, 5);
  }
  mainLoop();
};

if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', window.toskeiraspace, false);
} else {
  window.attachEvent('onload', window.toskeiraspace);
}
