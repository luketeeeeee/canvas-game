class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    canvasContext.save();
    canvasContext.globalAlpha = this.alpha;
    canvasContext.beginPath();
    canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    canvasContext.fillStyle = this.color;
    canvasContext.fill();
    canvasContext.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= frictionValue;
    this.velocity.y *= frictionValue;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha = this.alpha - 0.01;
  }
}