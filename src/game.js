import { Player } from './player.js';
import { Egg } from './egg.js';
import { Chicken } from './chicken.js';

const startScreen   = document.getElementById('start-screen');
const startButton   = document.getElementById('start-btn');
const canvas        = document.getElementById('gameCanvas');
const ctx           = canvas.getContext('2d');
const hud           = document.getElementById('hud');
const scoreEl       = document.getElementById('score');
const livesEl       = document.getElementById('lives');

const gameOverScreen = document.createElement('div');

let player, chicken;
let eggs        = [];
let score       = 0;
let lives       = 3;
let lastTime    = 0;
let gameRunning = false;

const bgImage   = new Image();
bgImage.src     = 'assets/images/farm.jpg';

const ladderImg = new Image();
ladderImg.src   = 'assets/images/ladder.png';

function resetGame() {
  score   = 0;
  lives   = 3;
  lastTime = 0;
  eggs    = [];

  player  = new Player(ctx);
  chicken = new Chicken(ctx, eggs);

  updateScoreDisplay();
  updateLivesDisplay();
}

function update(deltaTime) {
  chicken.update(deltaTime);
  eggs.forEach(e => e.update(deltaTime));

  for (let i = eggs.length - 1; i >= 0; i--) {
    const egg = eggs[i];
    const pos = player.positions[player.currentPos];

    if (egg.state === 'normal') {
      if (egg.isCatchable(pos.x, pos.y, player.size) && egg.pathIndex === player.currentPos) {
        eggs.splice(i, 1);
        score++;
        updateScoreDisplay();
        continue;
      }

      if (egg.isOutOfBounds()) {
        egg.y = canvas.height - 30;
        egg.break();
        lives--;
        updateLivesDisplay();
        if (lives <= 0) {
          endGame();
          return;
        }
      }
    } else if (egg.state === 'broken') {
      if (egg.brokenTimer >= egg.brokenDuration) {
        eggs.splice(i, 1);
      }
    }
  }
}

function drawBackground() {
  if (bgImage.complete && bgImage.naturalHeight) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawLadders() {
  if (!ladderImg.complete || !ladderImg.naturalHeight) return;

  const width  = 90;
  const height = 250;
  const yOff   = 245;

  const leftX  = 230 + 25;
  const rightX = 450 + 25;

  ctx.drawImage(ladderImg, leftX - width / 2, yOff, width, height);
  ctx.drawImage(ladderImg, rightX - width / 2, yOff, width, height);
}

function draw() {
  drawBackground();
  drawLadders();

  chicken.draw();
  player.draw();
  eggs.forEach(e => e.draw());
}

function gameLoop(ts) {
  if (!gameRunning) return;
  const dt = ts - lastTime;
  lastTime = ts;

  update(dt);
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
    </div>`;
  document.body.appendChild(gameOverScreen);
  gameOverScreen.classList.add('overlay');
  document.getElementById('restart-btn').onclick = () => {
    document.body.removeChild(gameOverScreen);
    resetGame();
    gameRunning = true;
    requestAnimationFrame(gameLoop);
  };
}

startButton.onclick = () => {
  startScreen.classList.add('hidden');
  canvas.classList.remove('hidden');
  hud.classList.remove('hidden');
  resetGame();
  gameRunning = true;
  requestAnimationFrame(gameLoop);
};

window.addEventListener('keydown', e => {
  if (gameRunning && player) player.handleInput(e.key);
});