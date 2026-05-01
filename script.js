const total = 5;
let popped = new Set();
const hint = document.getElementById('hint');
const overlay = document.getElementById('message-overlay');
const balloonIds = ['balloon1', 'balloon2', 'balloon3', 'balloon4', 'balloon5'];

document.addEventListener('click', function () {
  // find next unpopped balloon
  const next = balloonIds.find(id => !popped.has(id));
  if (!next) return;

  popped.add(next);
  document.getElementById(next).classList.add('popped');

  const remaining = total - popped.size;
  if (remaining > 0) {
    hint.textContent = remaining + ' left!';
  } else {
    hint.style.display = 'none';
    setTimeout(() => {
      overlay.classList.add('show');
      startConfetti();
    }, 400);
  }
});

let p5Instance;
let confetti = [];

function startConfetti() {
  p5Instance = new p5(function (p) {
    p.setup = function () {
      let canvas = p.createCanvas(p.windowWidth, p.windowHeight);

      let c = canvas.elt;
      c.style.position = 'fixed';
      c.style.top = '0';
      c.style.left = '0';
      c.style.zIndex = '9999';
      c.style.pointerEvents = 'none';
      document.body.appendChild(c);

      p.rectMode(p.CENTER);

      for (let i = 0; i < 300; i++) {
        let col = p.color(p.random(100, 255), p.random(100, 255), p.random(100, 255), p.random(120, 240));
        confetti[i] = new Confetto(p, p.random(p.width), p.random(0, 30), p.random(10, 20), col);
      }
    };

    p.draw = function () {
      p.clear();
      for (let c of confetti) {
        c.move();
        c.display();
      }
    };
  });
}

class Confetto {
  constructor(p, _x, _y, _s, _c) {
    this.p = p;
    this.x = _x;
    this.y = _y;
    this.size = _s;
    this.color = _c;
    this.shape = Math.round(p.random(0, 1));
    this.speed = p.random(0.5, 2);
    this.time = p.random(1, 100);
    this.amp = p.random(2, 30);
  }

  display() {
    let p = this.p;
    p.push();
    p.noStroke();
    p.fill(this.color);
    p.translate(this.x, this.y);
    p.translate(this.amp * p.cos(this.time), this.amp * p.sin(this.time));
    p.rotate(this.time);
    p.scale(p.cos(this.time), p.sin(this.time));
    if (this.shape == 1) {
      p.ellipse(0, 0, this.size);
    } else {
      p.rect(0, 0, this.size, this.size / 2);
    }
    p.pop();
  }

  move() {
    let p = this.p;
    this.y += this.speed;
    this.speed += 0.005;
    this.time += 0.05;
    if (this.y > p.height) {
      this.y = 0;
      this.speed = p.random(0.5, 2);
    }
  }
}