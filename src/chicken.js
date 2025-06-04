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
    this.imgLeft.src = 'assets/images/chicken1.webp';

    this.imgRight = new Image();
    this.imgRight.src = 'assets/images/chicken2.webp';

    this.imagesLoaded = {
      left: false,
      right: false
    };

    this.imgLeft.onload = () => { 
      this.imagesLoaded.left = true;
      console.log('Left chicken image loaded');
    };
    this.imgRight.onload = () => { 
      this.imagesLoaded.right = true;
      console.log('Right chicken image loaded');
    };

    this.spawnTimer = 0;
    this.spawnInterval = 2000; // kiaušinis kas 2 sekundes
  }

  update(deltaTime) {
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      const pathIndex = Math.floor(Math.random() * this.positions.length);
      this.eggs.push(new Egg(this.ctx, pathIndex));
      this.spawnTimer = 0;
    }
  }

  draw() {
    const size = 50;
    if (!this.imagesLoaded.left || !this.imagesLoaded.right) {
      console.log('Waiting for chicken images to load...');
      return;
    }

    this.positions.forEach(pos => {
      console.log(`Drawing chicken at (${pos.x}, ${pos.y}) facing ${pos.direction}`);
      if (pos.direction === 'left') {
        this.ctx.drawImage(this.imgLeft, pos.x, pos.y, size, size);
      } else {
        this.ctx.drawImage(this.imgRight, pos.x, pos.y, size, size);
      }
    });

    // Piešiame trajektorijas
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 4;

    // Viršutinė kairė trajektorija
    this.ctx.beginPath();
    this.ctx.moveTo(this.positions[0].x + size / 2, this.positions[0].y + size);
    this.ctx.lineTo(170 + 25, 200 + 25);
    this.ctx.stroke();

    // Viršutinė dešinė trajektorija
    this.ctx.beginPath();
    this.ctx.moveTo(this.positions[1].x + size / 2, this.positions[1].y + size);
    this.ctx.lineTo(520 + 25, 200 + 25);
    this.ctx.stroke();

    // Apatinė kairė trajektorija
    this.ctx.beginPath();
    this.ctx.moveTo(this.positions[2].x + size / 2, this.positions[2].y);
    this.ctx.lineTo(170 + 25, 400 + 25);
    this.ctx.stroke();

    // Apatinė dešinė trajektorija
    this.ctx.beginPath();
    this.ctx.moveTo(this.positions[3].x + size / 2, this.positions[3].y);
    this.ctx.lineTo(520 + 25, 400 + 25);
    this.ctx.stroke();
  }
}