// Importas bus reikalingas, kai susiesim su game.js
export class Player {
  constructor(ctx) {
    this.ctx = ctx;

    // 4 galimos pozicijos: 0 (LT), 1 (LB), 2 (RT), 3 (RB)
    this.positions = [
      { x: 150, y: 200 }, // top-left
      { x: 150, y: 400 }, // bottom-left
      { x: 550, y: 200 }, // top-right
      { x: 550, y: 400 }, // bottom-right
    ];

    this.currentPos = 0; // Pradžioje viršutinė kairė
    this.size = 50; // Plotis / aukštis (kvadratas, kaip placeholder)
  }

  moveTo(posIndex) {
    if (posIndex >= 0 && posIndex <= 3) {
      this.currentPos = posIndex;
    }
  }

  handleInput(key) {
    const keyMap = {
      'a': 0,
      's': 1,
      'k': 2,
      'l': 3,
      'arrowup': 0,
      'arrowdown': 1,
      'arrowright': 2,
      'arrowleft': 3,
    };

    const index = keyMap[key.toLowerCase()];
    if (index !== undefined) {
      this.moveTo(index);
    }
  }

  draw() {
    const pos = this.positions[this.currentPos];
    this.ctx.fillStyle = '#00ccff';
    this.ctx.fillRect(pos.x, pos.y, this.size, this.size);

    // Optional: draw a label
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '16px Arial';
    this.ctx.fillText('🐺', pos.x + 10, pos.y + 35);
  }
}