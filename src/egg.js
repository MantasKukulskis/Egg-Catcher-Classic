export class Egg {
  constructor(ctx, pathIndex) {
    this.ctx = ctx;
    this.pathIndex = pathIndex;

    this.start = this.getStartPoint(pathIndex);
    this.end = this.getEndPoint(pathIndex);

    this.x = this.start.x;
    this.y = this.start.y;

    this.speed = 2;
    this.radius = 12;

    // Skaičiuoti judėjimo kryptį
    const dx = this.end.x - this.start.x;
    const dy = this.end.y - this.start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    this.vx = (dx / length) * this.speed;
    this.vy = (dy / length) * this.speed;

    this.targetPosIndex = pathIndex;
  }

 getStartPoint(index) {
  switch (index) {
    case 0: return { x: 0, y: 150 };       // kairė - viršutinė trajektorija
    case 1: return { x: 800, y: 150 };     // dešinė - viršutinė trajektorija
    case 2: return { x: 0, y: 350 };       // kairė - apatinė trajektorija
    case 3: return { x: 800, y: 350 };     // dešinė - apatinė trajektorija
    default: return { x: 0, y: 0 };
  }
}

getEndPoint(index) {
  switch (index) {
    case 0: return { x: 150, y: 200 };     // top-left
    case 1: return { x: 550, y: 200 };     // top-right
    case 2: return { x: 150, y: 400 };     // bottom-left
    case 3: return { x: 550, y: 400 };     // bottom-right
    default: return { x: 0, y: 0 };
  }
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

  // Naujas metodas: ar pasiekė tikslą ir turi būti pagautas
isCatchable(playerX, playerY, size) {
  const dx = this.x - (playerX + size / 2);
  const dy = this.y - (playerY + size / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < this.radius + size / 2 + 10; // leidžiamas atstumas pagauti
}

 isOutOfBounds() {
  const dx = this.x - this.end.x;
  const dy = this.y - this.end.y;
  return dx * dx + dy * dy < 4; // buvo this.speed * this.speed, bet tai per daug
}
}