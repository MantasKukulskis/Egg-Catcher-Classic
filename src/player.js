export class Player {
  constructor(ctx) {
    this.ctx = ctx;

    this.positions = [
      { x: 150, y: 200 }, // 0 - top-left
      { x: 550, y: 200 }, // 1 - top-right
      { x: 150, y: 400 }, // 2 - bottom-left
      { x: 550, y: 400 }, // 3 - bottom-right
    ];

    this.row = 0;  // 0 = top, 1 = bottom
    this.side = 0; // 0 = left, 1 = right

    this.size = 50;
  }

  get currentPos() {
    // Viršutinės eilės pozicijos 0 ir 1, apatines 2 ir 3
    // currentPos = row * 2 + side
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
    this.ctx.fillStyle = '#00ccff';
    this.ctx.fillRect(pos.x, pos.y, this.size, this.size);

    this.ctx.fillStyle = '#fff';
    this.ctx.font = '16px Arial';
    this.ctx.fillText('🐺', pos.x + 15, pos.y + 35);
  }
}