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