export class Egg {
  constructor(ctx, pathIndex) {
    this.ctx = ctx;
    this.pathIndex = pathIndex;

    this.start = this.getStartPoint(pathIndex);
    this.end = this.getEndPoint(pathIndex);

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

getStartPoint(index) {
  const chickenSize = 50;
  switch (index) {
    case 0: return { x: 20 + chickenSize / 2, y: 130 + chickenSize };     // top-left
    case 1: return { x: 650 + chickenSize / 2, y: 130 + chickenSize };    // top-right
    case 2: return { x: 20 + chickenSize / 2, y: 330 };                    // bottom-left
    case 3: return { x: 650 + chickenSize / 2, y: 330 };                   // bottom-right
    default: return { x: 0, y: 0 };
  }
}

getEndPoint(index) {
  switch (index) {
    case 0: return { x: 150, y: 200 };  // top-left vilkas
    case 1: return { x: 400, y: 200 };  // top-right vilkas
    case 2: return { x: 150, y: 400 };  // bottom-left vilkas
    case 3: return { x: 400, y: 400 };  // bottom-right vilkas
    default: return { x: 0, y: 0 };
  }
}

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.start.x, this.start.y);
    this.ctx.lineTo(this.x, this.y);
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

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