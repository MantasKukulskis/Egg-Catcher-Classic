export class Player {
  constructor(ctx) {
    this.ctx = ctx;

    
    this.positions = [
      { x: 170, y: 200 },  
      { x: 420, y: 200 },  
      { x: 170, y: 400 },  
      { x: 420, y: 400 },  
    ];

    this.row = 0;
    this.side = 0;

    this.size = 150;

    this.wolfLeft = new Image();
    this.wolfLeft.src = 'assets/images/wolf1.png';

    this.wolfRight = new Image();
    this.wolfRight.src = 'assets/images/wolf2.png';
  }

  get currentPos() {
    return this.row * 2 + this.side;
  }

  moveLeft() {
    this.side = 0;
  }

  moveRight() {
    this.side = 1;
  }

  moveUp() {
    this.row = 0;
  }

  moveDown() {
    this.row = 1;
  }

  handleInput(key) {
    switch (key.toLowerCase()) {
      case 'a':
        this.moveLeft();
        break;
      case 'd':
        this.moveRight();
        break;
      case 'w':
        this.moveUp();
        break;
      case 's':
        this.moveDown();
        break;
    }
  }

  draw() {
    const pos = this.positions[this.currentPos];
    const img = this.side === 0 ? this.wolfLeft : this.wolfRight;
    this.ctx.drawImage(img, pos.x, pos.y, this.size, this.size);
  }
}