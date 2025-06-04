import { Player } from './player.js';
import { Egg } from './egg.js';
import { Chicken } from './chicken.js';

const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-btn');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hud = document.getElementById('hud');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');

const gameOverScreen = document.createElement('div');

let player;
let chicken;
let eggs = [];
let score = 0;
let lives = 3;
let lastTime = 0;
let gameRunning = false;

function resetGame() {
  score = 0;
  lives = 3;
  lastTime = 0;
  eggs = [];
  player = new Player(ctx);
  chicken = new Chicken(ctx, eggs);

  updateScoreDisplay();
  updateLivesDisplay();
}

function update(deltaTime) {
  chicken.update(deltaTime);

  eggs.forEach(egg => egg.update());

  for (let i = eggs.length - 1; i >= 0; i--) {
    const egg = eggs[i];
    const playerPos = player.positions[player.currentPos];

    if (egg.isCatchable(playerPos.x, playerPos.y, player.size) && egg.pathIndex === player.currentPos) {
      eggs.splice(i, 1);
      score++;
      updateScoreDisplay();
      continue;
    }

    if (egg.isOutOfBounds()) {
      eggs.splice(i, 1);
      lives--;
      updateLivesDisplay();
      if (lives <= 0) {
        endGame();
        return;
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  chicken.draw();
  player.draw();
  eggs.forEach(egg => egg.draw());
}

function gameLoop(timestamp) {
  if (!gameRunning) return;

  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  update(deltaTime);
  draw();

  requestAnimationFrame(gameLoop);
}

function updateScoreDisplay() {
  if (scoreEl) scoreEl.textContent = score;
}

function updateLivesDisplay() {
  if (livesEl) livesEl.textContent = lives;
}

function endGame() {
  gameRunning = false;

  gameOverScreen.innerHTML = `
    <div id="game-over">
      <h2>Game Over</h2>
      <p>Your score: ${score}</p>
      <button id="restart-btn">Restart</button>
    </div>
  `;
  document.body.appendChild(gameOverScreen);
  gameOverScreen.classList.add('overlay');

  const restartButton = document.getElementById('restart-btn');
  restartButton.addEventListener('click', () => {
    document.body.removeChild(gameOverScreen);
    resetGame();
    gameRunning = true;
    requestAnimationFrame(gameLoop);
  });
}

startButton.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  canvas.classList.remove('hidden');
  hud.classList.remove('hidden');

  resetGame();
  gameRunning = true;
  requestAnimationFrame(gameLoop);
});

window.addEventListener('keydown', (e) => {
  if (gameRunning && player) {
    player.handleInput(e.key);
  }
});