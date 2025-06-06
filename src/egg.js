export class Egg {
  constructor(ctx, pathIndex) {
    this.ctx = ctx;
    this.pathIndex = pathIndex;

    const chickenSize = 50;

    this.starts = [
      { x: 10 + chickenSize / 2, y: 130 + chickenSize },        
      { x: 600 + chickenSize / 2, y: 130 + chickenSize },       
      { x: 10 + chickenSize / 2, y: 330 + chickenSize + 5 },    
      { x: 600 + chickenSize / 2, y: 330 + chickenSize + 5 }     
    ];

    this.ends = [
      { x: 170 + 25, y: 200 + 25 },  
      { x: 420 + 25, y: 200 + 25 }, 
      { x: 170 + 25, y: 400 + 25 },  
      { x: 420 + 25, y: 400 + 25 }   
    ];

    this.brokenPosY = 530; 

    this.start = this.starts[pathIndex];
    this.end = this.ends[pathIndex];

    this.x = this.start.x;
    this.y = this.start.y;

    this.speed = (pathIndex === 0 || pathIndex === 2) ? 1.5 : 2;
    this.radius = 8;

    const dx = this.end.x - this.start.x;
    const dy = this.end.y - this.start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    this.vx = (dx / length) * this.speed;
    this.vy = (dy / length) * this.speed;

    this.state = 'normal';
    this.brokenTimer = 0;
    this.brokenDuration = 2000; 

    this.brokenImage = new Image();
    this.brokenImage.src = 'assets/images/egg.png';

    this.brokenSize = 50; 
  }

  update(deltaTime) {
    if (this.state === 'normal') {
      this.x += this.vx;
      this.y += this.vy;
    } else if (this.state === 'broken') {
      this.brokenTimer += deltaTime;
      
      if (this.y < this.brokenPosY) {
        this.y += 3;  
        if (this.y > this.brokenPosY) this.y = this.brokenPosY;
      }
    }
  }

  draw() {
    if (this.state === 'normal') {
      this.ctx.beginPath();
      this.ctx.fillStyle = '#fffacd';
      this.ctx.ellipse(this.x, this.y, this.radius, this.radius * 1.3, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#ccc';
      this.ctx.stroke();
    } else if (this.state === 'broken') {
    
      if (this.brokenImage.complete && this.brokenImage.naturalHeight !== 0) {
        this.ctx.drawImage(
          this.brokenImage,
          this.x - this.brokenSize / 2,
          this.y - this.brokenSize / 2,
          this.brokenSize,
          this.brokenSize
        );
      } else {
        
        this.ctx.beginPath();
        this.ctx.fillStyle = 'red';
        this.ctx.arc(this.x, this.y, this.brokenSize / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  isCatchable(playerX, playerY, size) {
    if (this.state !== 'normal') return false; 
    const dx = this.x - playerX;
    const dy = this.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + size / 2 + 2;
  }

  isOutOfBounds() {
    if (this.state !== 'normal') return false;
    const dx = this.x - this.end.x;
    const dy = this.y - this.end.y;
    return dx * dx + dy * dy < 4;
  }

  break() {
    this.state = 'broken';
    this.brokenTimer = 0;
    this.vx = 0;
    this.vy = 0;
  }
}