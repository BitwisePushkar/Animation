const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width =1200;
canvas.height =600;

let score = 0;
let gameFrame = 0;
ctx.font = "30px Georgia";

let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false
};

canvas.addEventListener("mousedown", function(event){
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener("mouseup", function(){
  mouse.click = false;
});

const playerLeft = new Image();
playerLeft.src = "astronautl.png";

const playerRight = new Image();
playerRight.src = "astronautr.png";

const bubblePop = new Audio("burstfire.mp3");

class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 40;
    this.spriteWidth = 881;
    this.spriteHeight = 639;
    this.frameX = 0;
    this.frameY = 0;
    this.angle = 0;
  }

  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    this.x -= dx / 20;
    this.y -= dy / 20;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);

    let sprite = (this.x >= mouse.x) ? playerLeft : playerRight;

    ctx.drawImage(
      sprite,
      this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
      this.spriteWidth, this.spriteHeight,                             
      -this.spriteWidth / 4, -this.spriteHeight / 4,                  
      this.spriteWidth / 2, this.spriteHeight / 2                     
    );
    ctx.restore();
  }
}

const player = new Player();

const bubblesArray = [];
class Bubble {
  constructor(){
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 30;
    this.speed = Math.random() * 3 + 1;
    this.counted = false;
  }
  update(){
    this.y -= this.speed;
  }
  draw(){
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }
}

function checkCollision(c1, c2){
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < c1.radius + c2.radius;
}

function handleBubbles(){
  if (gameFrame % 50 === 0){
    bubblesArray.push(new Bubble());
  }
  for (let i = 0; i < bubblesArray.length; i++){
    const b = bubblesArray[i];
    b.update();
    b.draw();

    if (b.y < 0 - b.radius * 2){
      bubblesArray.splice(i, 1);
      i--;
      continue;
    }

    if (checkCollision(b, player) && !b.counted){
      bubblePop.currentTime = 0;
      bubblePop.play();
      score++;
      b.counted = true;
      bubblesArray.splice(i, 1);
      i--;
    }
  }
}

function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  player.draw();
  handleBubbles();
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, 40);
  gameFrame++;
  requestAnimationFrame(animate);
}
animate();
