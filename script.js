const canvas=document.getElementById("canvas1");
const ctx=canvas.getContext('2d');
canvas.width=800;
canvas.height=500;

let score=1;
let gameFrame=0;
ctx.font="50px Georgia";

const mouse={
  X: canvas.width/2,
  Y: canvas.height/2,
  click: false
}

