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
let level       = 1;
let lastTime    = 0;
let gameRunning = false;
let levelUpText = '';
let levelUpTimer = 0;


const bgImage   = new Image();
bgImage.src     = 'assets/images/farm.jpg';

const ladderImg = new Image();
ladderImg.src   = 'assets/images/ladder.png';


const rollingSound = new Audio('assets/sounds/rolling.wav');
const catchSound   = new Audio('assets/sounds/pick-up.wav');
const crackSound   = new Audio('assets/sounds/glass.mp3');
rollingSound.loop = true;


function resetGame() {
  score   = 0;
  lives   = 3;
  level   = 1;
  lastTime = 0;
  eggs    = [];

  player  = new Player(ctx);
  chicken = new Chicken(ctx, eggs);

  updateScoreDisplay();
  updateLivesDisplay();
  rollingSound.play();
}


function checkLevelUp() {
  const newLevel = Math.floor(score / 20) + 1;
  if (newLevel > level) {
    level = newLevel;
    chicken.increaseSpeed(0.2);
    chicken.setLevel(level); 
    levelUpText = `Lygis ${level}!`;
    levelUpTimer = 100;
  }
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
        catchSound.currentTime = 0;
        catchSound.play();
        checkLevelUp();
        continue;
      }

      if (egg.isOutOfBounds()) {
        egg.y = canvas.height - 30;
        egg.break();
        lives--;
        updateLivesDisplay();
        crackSound.currentTime = 0;
        crackSound.play();

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

  if (levelUpTimer > 0) {
    levelUpTimer--;
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

function drawLevelText() {
  if (levelUpTimer > 0) {
    ctx.fillStyle = 'yellow';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(levelUpText, canvas.width / 2, 100);
  }
}

function draw() {
  drawBackground();
  drawLadders();
  chicken.draw();
  player.draw();
  eggs.forEach(e => e.draw());
  drawLevelText();
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
  rollingSound.pause();
  rollingSound.currentTime = 0;

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