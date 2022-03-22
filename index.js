const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreElement = document.querySelector('#scoreElement');
const startGameButton = document.querySelector('#startGameButton');
const modalElement = document.querySelector('#modalElement');
const gameOverScreenScore = document.querySelector('#gameOverScreenScore');

const xCenterCoordinate = canvas.width / 2;
const yCenterCoordinate = canvas.height / 2;

const frictionValue = 0.98;

let animationId;
let score = 0;

const playerXCoordinate = xCenterCoordinate;
const playerYCoordinate = yCenterCoordinate;

let player = new Player(playerXCoordinate, playerYCoordinate, 20, "white");
let projectilesArray = [];
let enemiesArray = [];
let particlesArray = [];

function init() {
  player = new Player(playerXCoordinate, playerYCoordinate, 20, "white");
  projectilesArray = [];
  enemiesArray = [];
  particlesArray = [];

  score = 0;
  scoreElement.innerHTML = score;
  gameOverScreenScore.innerHTML = score;
}

function drawPlayerOnTheScreen() {
  player.draw();
}

function spawnEnemies() {
  setInterval(() => {
    const enemyRadius = Math.random() * (30 - 10) + 10;
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

    const enemyColor = `hsl(${Math.random() * 360}, 50%, 50%)`;

    const mousePositionGeneratedAngle = Math.atan2(
      yCenterCoordinate - yEnemyCoordinate,
      xCenterCoordinate - xEnemyCoordinate
    );

    const enemyVelocityAndDirection = {
      x: Math.cos(mousePositionGeneratedAngle) * 1.25,
      y: Math.sin(mousePositionGeneratedAngle) * 1.25
    }

    enemiesArray.push(new Enemy(
      xEnemyCoordinate,
      yEnemyCoordinate,
      enemyRadius,
      enemyColor,
      enemyVelocityAndDirection
    ))
  }, 700);
}

function animateElementsOnTheScreen() {
  animationId = requestAnimationFrame(animateElementsOnTheScreen);

  canvasContext.fillStyle = 'rgba(0, 0, 0, 0.15)'

  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  drawPlayerOnTheScreen();

  particlesArray.forEach((particle, particleIndex) => {
    if (particle.alpha <= 0) {
      particlesArray.splice(particleIndex, 1);
    } else {
      particle.update();
    }
  })

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

      modalElement.style.display = 'flex';
      gameOverScreenScore.innerHTML = score;
    }

    projectilesArray.forEach((projectile, projectileIndex) => {
      const distanceBetweenEnemyAndProjectile = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

      if (distanceBetweenEnemyAndProjectile - enemy.radius - projectile.radius < 1) {
        for (let i = 0; i < enemy.radius * 2; i++) {
          particlesArray.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 5),
                y: (Math.random() - 0.5) * (Math.random() * 5)
              }
            )
          )
        }

        if (enemy.radius - 10 > 5) {
          score += 100;
          scoreElement.innerHTML = score;

          gsap.to(enemy, {
            radius: enemy.radius - 10
          })

          setTimeout(() => {
            projectilesArray.splice(projectileIndex, 1);
          }, 0);
        } else {
          score += 250;
          scoreElement.innerHTML = score;

          setTimeout(() => {
            enemiesArray.splice(enemyIndex, 1);
            projectilesArray.splice(projectileIndex, 1);
          }, 0);
        }
      }
    })
  })
}

addEventListener('click', (event) => {
  const mousePositionGeneratedAngle = Math.atan2(
    event.clientY - yCenterCoordinate,
    event.clientX - xCenterCoordinate
  );

  const projectileVelocityAndDirection = {
    x: Math.cos(mousePositionGeneratedAngle) * 5,
    y: Math.sin(mousePositionGeneratedAngle) * 5
  }

  projectilesArray.push(new Projectile(
    xCenterCoordinate,
    yCenterCoordinate,
    5,
    'white',
    projectileVelocityAndDirection))
})

startGameButton.addEventListener('click', () => {
  init();

  animateElementsOnTheScreen();
  spawnEnemies();

  modalElement.style.display = 'none';
})