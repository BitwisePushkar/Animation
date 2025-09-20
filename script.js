const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 800;

let score = 1;
let gameFrame = 0;
ctx.font = "36px Georgia";
let canvasPosition = canvas.getBoundingClientRect();
const mouse = { x: canvas.width / 2, y: canvas.height / 2, click: false };
let gameOver = false;
const targetScore = 20;

canvas.addEventListener("pointerdown", (e) => {
  mouse.click = true;
  canvasPosition = canvas.getBoundingClientRect();
  mouse.x = e.clientX - canvasPosition.left;
  mouse.y = e.clientY - canvasPosition.top;
});
canvas.addEventListener("pointerup", () => (mouse.click = false));
canvas.addEventListener("pointermove", (e) => {
  canvasPosition = canvas.getBoundingClientRect();
  mouse.x = e.clientX - canvasPosition.left;
  mouse.y = e.clientY - canvasPosition.top;
});
window.addEventListener("resize", () => {
  canvasPosition = canvas.getBoundingClientRect();
});

// Image and audio assets
const playerLeft = new Image();
playerLeft.src = "astronautl.png";
const playerRight = new Image();
playerRight.src = "astronautr.png";

const asteroidImage = new Image();
asteroidImage.src = "bubble.png";

const bubblePop = new Audio("pop.ogg");

const SHEET_WIDTH = 4405;
const SHEET_HEIGHT = 1917;
const SHEET_COLS = 5;
const SHEET_ROWS = 3;
const FRAME_W = SHEET_WIDTH / SHEET_COLS;
const FRAME_H = SHEET_HEIGHT / SHEET_ROWS;

class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 50;
    this.frameX = 0;
    this.frameY = 0;
  }
  update() {
    this.x += (mouse.x - this.x) / 20;
    this.y += (mouse.y - this.y) / 20;
  }
  draw() {
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    const sheet = this.x >= mouse.x ? playerLeft : playerRight;

    const sx = this.frameX * FRAME_W;
    const sy = this.frameY * FRAME_H;
    const sw = FRAME_W;
    const sh = FRAME_H;
    const dw = sw / 2;
    const dh = sh / 2;
    const dx = -dw / 2;
    const dy = -dh / 2;

    ctx.drawImage(sheet, sx, sy, sw, sh, dx, dy, dw, dh);

    ctx.restore();
  }
}
const player = new Player();

const bubblesArray = [];
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = Math.random() * 22 + 28;
    this.speed = Math.random() * 3 + 1;
    this.counted = false;
  }
  update() {
    this.y -= this.speed;
  }
  draw() {
    ctx.drawImage(
      asteroidImage,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }
}

function checkCollision(c1, c2) {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const dist = Math.hypot(dx, dy);
  return dist < c1.radius + c2.radius;
}

function handleBubbles() {
  if (gameFrame % 50 === 0) {
    if (bubblesArray.length < 40) bubblesArray.push(new Bubble());
  }
  for (let i = 0; i < bubblesArray.length; i++) {
    const b = bubblesArray[i];
    b.update();
    b.draw();

    if (b.y < -b.radius * 2) {
      bubblesArray.splice(i, 1);
      i--;
      continue;
    }

    if (checkCollision(b, player) && !b.counted) {
      try {
        const s = bubblePop.cloneNode();
        s.play().catch(() => {});
      } catch (err) {
        try {
          bubblePop.currentTime = 0;
          bubblePop.play();
        } catch (e) {}
      }

      score++;
      b.counted = true;
      bubblesArray.splice(i, 1);
      i--;
      continue;
    }
  }
}

function animateSpriteFrames() {
  const FPS_TICK = 8;
  if (gameFrame % FPS_TICK === 0) {
    player.frameX++;
    if (player.frameX >= SHEET_COLS) {
      player.frameX = 0;
      player.frameY++;
      if (player.frameY >= SHEET_ROWS) player.frameY = 0;
    }
  }
}

function animate() {
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "60px Georgia";
    ctx.fillText("YOU WIN!", canvas.width / 2 - 150, canvas.height / 2);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  player.draw();
  handleBubbles();
  animateSpriteFrames();
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 20, 40);
  if (score >= targetScore) {
    gameOver = true;
  }
  gameFrame++;
  requestAnimationFrame(animate);
}

// ✅ New loader function: wait for all images to be ready
function loadAssetsAndStartGame() {
  let loadedImages = 0;
  const totalImages = 3;

  function checkIfAllLoaded() {
    loadedImages++;
    if (loadedImages === totalImages) {
      animate(); // ✅ Start game safely
    }
  }

  playerLeft.onload = checkIfAllLoaded;
  playerRight.onload = checkIfAllLoaded;
  asteroidImage.onload = checkIfAllLoaded;
}

// Start loading images
loadAssetsAndStartGame();
