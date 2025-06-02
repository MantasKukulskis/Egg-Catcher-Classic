import { Player } from './player.js';
import { Egg } from './egg.js';

const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-btn');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hud = document.getElementById('hud');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');

const gameOverScreen = document.createElement('div');

let player;
let eggs = [];
let score = 0;
let lives = 3;
let lastTime = 0;
let gameRunning = false;

let eggSpawnTimer = 0;
const eggSpawnInterval = 1500;

function resetGame() {
  score = 0;
  lives = 3;
  lastTime = 0;
  eggSpawnTimer = 0;
  eggs = [];
  player = new Player(ctx);
  updateScoreDisplay();
  updateLivesDisplay();
}

function spawnEgg() {
  const randomPos = Math.floor(Math.random() * 4);
  eggs.push(new Egg(ctx, randomPos));
}

function update(deltaTime) {
  eggSpawnTimer += deltaTime;
  if (eggSpawnTimer >= eggSpawnInterval) {
    spawnEgg();
    eggSpawnTimer = 0;
  }

  eggs.forEach((egg) => egg.update());

  for (let i = eggs.length - 1; i >= 0; i--) {
    const egg = eggs[i];
    const playerPos = player.positions[player.currentPos];

    // Pagavimas
    if (
      egg.targetPosIndex === player.currentPos &&
      egg.isCatchable(playerPos.x, playerPos.y, player.size)
    ) {
      eggs.splice(i, 1);
      score++;
      updateScoreDisplay();
      continue;
    }

    // Praleidimas
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

  // Foninis atspalvis
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.draw();
  eggs.forEach((egg) => egg.draw());
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

// Start
startButton.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  canvas.classList.remove('hidden');
  hud.classList.remove('hidden');

  resetGame();
  gameRunning = true;
  requestAnimationFrame(gameLoop);
});

// Klaviatūros valdymas
window.addEventListener('keydown', (e) => {
  if (gameRunning && player) {
    player.handleInput(e.key);
  }
});