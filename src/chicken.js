import { Egg } from './egg.js';

export class Chicken {
  constructor(ctx, eggs) {
    this.ctx = ctx;
    this.eggs = eggs;

    this.positions = [
      { x: 20, y: 130, direction: 'right' },
      { x: 730, y: 130, direction: 'left' },
      { x: 20, y: 330, direction: 'right' },
      { x: 730, y: 330, direction: 'left' }
    ];

    this.imgLeft = new Image();
    this.imgLeft.src = 'assets/images/chicken1.png';

    this.imgRight = new Image();
    this.imgRight.src = 'assets/images/chicken2.png';

    this.imagesLoaded = {
      left: false,
      right: false
    };

    this.imgLeft.onload = () => { 
      this.imagesLoaded.left = true;
    };
    this.imgRight.onload = () => { 
      this.imagesLoaded.right = true;
    };

    this.spawnTimer = 0;
    this.spawnInterval = 2000;
    this.level = 1;
  }

  increaseSpeed(amount) {
    this.spawnInterval = Math.max(500, this.spawnInterval - amount * 100);
  }

  setLevel(level) {
    this.level = level;
  }

  update(deltaTime) {
    this.spawnTimer += deltaTime;

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;

      const maxEggs = Math.min(this.level, 3);  // 1–3 kiaušiniai
      const count = Math.floor(Math.random() * maxEggs) + 1;

      const availablePaths = [0, 1, 2, 3].sort(() => 0.5 - Math.random()).slice(0, count);

      availablePaths.forEach((pathIndex, i) => {
        setTimeout(() => {
          this.eggs.push(new Egg(this.ctx, pathIndex));
        }, i * 300); // 300 ms tarpai tarp kiaušinių
      });
    }
  }

  draw() {
    const size = 50;
    if (!this.imagesLoaded.left || !this.imagesLoaded.right) {
      return;
    }

    this.positions.forEach(pos => {
      const img = pos.direction === 'left' ? this.imgLeft : this.imgRight;
      this.ctx.drawImage(img, pos.x, pos.y, size, size);
    });

    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 4;

    // linijos nuo viščiukų iki žaidėjo
    this.ctx.beginPath();
    this.ctx.moveTo(this.positions[0].x + size / 2, this.positions[0].y + size);
    this.ctx.lineTo(170 + 25, 200 + 25);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.positions[1].x + size / 2, this.positions[1].y + size);
    this.ctx.lineTo(520 + 25, 200 + 25);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.positions[2].x + size / 2, this.positions[2].y + size + 5);
    this.ctx.lineTo(170 + 25, 400 + 25);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.positions[3].x + size / 2, this.positions[3].y + size + 5);
    this.ctx.lineTo(520 + 25, 400 + 25);
    this.ctx.stroke();
  }
}