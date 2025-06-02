import { Player } from './player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let lives = 3;

const player = new Player(ctx);

// Input listener
window.addEventListener('keydown', (e) => {
  player.handleInput(e.key);
});

// Main game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  // future: update eggs, check collisions
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.draw();
}

gameLoop();