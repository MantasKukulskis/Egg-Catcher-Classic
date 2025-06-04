export class Player {
  constructor(ctx) {
    this.ctx = ctx;

    this.positions = [
      { x: 150, y: 200 }, // 0 - top-left
      { x: 400, y: 200 }, // 1 - top-right
      { x: 150, y: 400 }, // 2 - bottom-left
      { x: 400, y: 400 }, // 3 - bottom-right
    ];

    this.row = 0;
    this.side = 0;

    this.size = 150; // padidink, jei paveikslėlis didesnis

    // Įkeliam paveikslėlius
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

    // Piešiam paveikslėlį
    this.ctx.drawImage(img, pos.x, pos.y, this.size, this.size);
  }
}