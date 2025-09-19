const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 1;
let gameFrame = 0;
ctx.font = "50px Georgia";

let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false
};

canvas.addEventListener('mousedown', function (event) {
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener('mouseup', function () {
  mouse.click = false;
});

class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 50;
    this.angle = 0;     
    this.frameX = 0;   
    this.frameY = 0;    
    this.frame = 0;     
    this.spritewidth = 212;
    this.spriteheight = 297;
  }
  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    this.x -= dx / 30;  
    this.y -= dy / 30;
  }
  draw() {
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

const player = new Player();

const bubblesArray = [];
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 30;
    this.speed = Math.random() * 5 + 1;
    this.counted = false;
  }
  update() {
    this.y -= this.speed;
  }
  draw() {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }
}

const bubblePop = new Audio('bubbles-single2.wav');
bubblePop.load();

function playPop() {
  const sound = bubblePop.cloneNode();
  sound.play();
}


function checkCollision(c1, c2) {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < c1.radius + c2.radius;
}

function handleBubbles() {
  if (gameFrame % 50 === 0) {
    bubblesArray.push(new Bubble());
  }
  for (let i = 0; i < bubblesArray.length; i++) {
    const b = bubblesArray[i];
    b.update();
    b.draw();

    if (b.y < 0 - b.radius * 2) {
      bubblesArray.splice(i, 1);
      i--;
      continue;
    }

    if (checkCollision(b, player) && !b.counted) {
      playPop(); 
      score++;
      b.counted = true;
      bubblesArray.splice(i, 1);
      i--;
      continue;
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  player.draw();
  handleBubbles();

  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, 50);

  gameFrame++;
  requestAnimationFrame(animate);
}
animate();
