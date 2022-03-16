const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const xCenterCoordinate = canvas.width / 2;
const yCenterCoordinate = canvas.height / 2;

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

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Enemy {
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

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

let animationId;

const playerXCoordinate = xCenterCoordinate;
const playerYCoordinate = yCenterCoordinate;
const player = new Player(playerXCoordinate, playerYCoordinate, 30, "blue");

const projectilesArray = [];
const enemiesArray = [];

function drawPlayerOnTheScreen() {
  player.draw();
}

function spawnEnemies() {
  setInterval(() => {
    const enemyRadius = Math.random() * (25 - 10) + 10;
    let xEnemyCoordinate;
    let yEnemyCoordinate;

    if (Math.random() < 0.5) {
      xEnemyCoordinate = Math.random() < 0.5 ?
        0 - enemyRadius : canvas.width + enemyRadius;
      yEnemyCoordinate = Math.random() * canvas.height;
    } else {
      xEnemyCoordinate = Math.random() * canvas.width;
      yEnemyCoordinate = Math.random() < 0.5 ?
        0 - enemyRadius : canvas.height + enemyRadius;
    }

    const enemyColor = 'green';

    const mousePositionGeneratedAngle = Math.atan2(
      yCenterCoordinate - yEnemyCoordinate,
      xCenterCoordinate - xEnemyCoordinate
    );

    const enemyVelocityAndDirection = {
      x: Math.cos(mousePositionGeneratedAngle),
      y: Math.sin(mousePositionGeneratedAngle)
    }

    enemiesArray.push(new Enemy(
      xEnemyCoordinate,
      yEnemyCoordinate,
      enemyRadius,
      enemyColor,
      enemyVelocityAndDirection
    ))
  }, 1000);
}

function animateElementsOnTheScreen() {
  animationId = requestAnimationFrame(animateElementsOnTheScreen);

  canvasContext.fillStyle = '#1a1721'

  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  drawPlayerOnTheScreen();

  projectilesArray.forEach((projectile, projectileIndex) => {
    projectile.update();

    if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
      setTimeout(() => {
        projectilesArray.splice(projectileIndex, 1);
      }, 0);
    }
  })

  enemiesArray.forEach((enemy, enemyIndex) => {
    enemy.update();

    const distanceBetweenEnemyAndPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (distanceBetweenEnemyAndPlayer - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
    }

    projectilesArray.forEach((projectile, projectileIndex) => {
      const distanceBetweenEnemyAndProjectile = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

      if (distanceBetweenEnemyAndProjectile - enemy.radius - projectile.radius < 1) {
        setTimeout(() => {
          enemiesArray.splice(enemyIndex, 1);
          projectilesArray.splice(projectileIndex, 1);
        }, 0);
      }
    })
  })
}

addEventListener('click', (event) => {
  console.log(projectilesArray);

  const mousePositionGeneratedAngle = Math.atan2(
    event.clientY - yCenterCoordinate,
    event.clientX - xCenterCoordinate
  );

  const projectileVelocityAndDirection = {
    x: Math.cos(mousePositionGeneratedAngle) * 2,
    y: Math.sin(mousePositionGeneratedAngle) * 2
  }

  projectilesArray.push(new Projectile(
    xCenterCoordinate,
    yCenterCoordinate,
    5,
    'red',
    projectileVelocityAndDirection))
})

spawnEnemies();
animateElementsOnTheScreen();