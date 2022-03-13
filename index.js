const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    canvasContext.beginPath();
    canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    canvasContext.fillStyle = this.color;
    canvasContext.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    canvasContext.beginPath();
    canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    canvasContext.fillStyle = this.color;
    canvasContext.fill();
  }
}

function createPlayer() {
  player.draw();
}

const playerXCoordinate = canvas.width / 2;
const playerYCoordinate = canvas.height / 2;
const player = new Player(playerXCoordinate, playerYCoordinate, 30, "blue");

createPlayer();

addEventListener('click', (event) => {
  const projectile = new Projectile(event.clientX, event.clientY)
})