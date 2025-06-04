export class Egg {
  constructor(ctx, pathIndex) {
    this.ctx = ctx;
    this.pathIndex = pathIndex;

    const chickenSize = 50;

    const starts = [
      { x: 10 + chickenSize / 2, y: 130 + chickenSize },         // top-left
      { x: 600 + chickenSize / 2, y: 130 + chickenSize },        // top-right
      { x: 10 + chickenSize / 2, y: 330 + chickenSize + 5 },     // bottom-left
      { x: 600 + chickenSize / 2, y: 330 + chickenSize + 5 }     // bottom-right
    ];

    const ends = [
      { x: 170 + 25, y: 200 + 25 },  // top-left vilkas
      { x: 420 + 25, y: 200 + 25 },  // top-right vilkas
      { x: 170 + 25, y: 400 + 25 },  // bottom-left vilkas
      { x: 420 + 25, y: 400 + 25 }   // bottom-right vilkas
    ];

    this.start = starts[pathIndex];
    this.end = ends[pathIndex];

    this.x = this.start.x;
    this.y = this.start.y;

    this.speed = (pathIndex === 0 || pathIndex === 2) ? 1.5 : 2;
    this.radius = 8;

    const dx = this.end.x - this.start.x;
    const dy = this.end.y - this.start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    this.vx = (dx / length) * this.speed;
    this.vy = (dy / length) * this.speed;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#fffacd';
    this.ctx.ellipse(this.x, this.y, this.radius, this.radius * 1.3, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = '#ccc';
    this.ctx.stroke();
  }

  isCatchable(playerX, playerY, size) {
    const dx = this.x - playerX;
    const dy = this.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + size / 2 + 2;
  }

  isOutOfBounds() {
    const dx = this.x - this.end.x;
    const dy = this.y - this.end.y;
    return dx * dx + dy * dy < 4;
  }
}
