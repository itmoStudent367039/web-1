class Graph {
  SIZE = 300;
  LINE_WIDTH = 1;
  TEXT_SIZE = 16;
  TEXT_MARGIN = 15;
  TEXT_LINE_HEIGHT = 3;
  COLOR_RED = "#D18189";
  COLOR_GREEN = "#87C67A";

  constructor() {
    this.canvas = document.getElementById("graph");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = `${this.TEXT_SIZE}px Soyuz Grotesk`;
  }

  redrawAll(r) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGraph(r);
    this.drawAxes();
    this.setPointerAtDot(3);
    this.setPointerAtDot(1);
  }

  drawAxes() {
    this.ctx.fillStyle = "black";
    this.drawArrow(-this.SIZE, this.SIZE / 2, this.SIZE, this.SIZE / 2);
    this.drawArrow(this.SIZE / 2, this.SIZE, this.SIZE / 2, 0);
  }

  drawGraph(r) {
    const totalPoints = 7;
    const pointInPixels = this.SIZE / totalPoints;
    this.ctx.fillStyle = "#81BECE";
    this.ctx.beginPath();
    this.ctx.moveTo(this.SIZE / 2, this.SIZE / 2);
    this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2 - r * pointInPixels);
    this.ctx.lineTo(
      this.SIZE / 2 - r * pointInPixels,
      this.SIZE / 2 - r * pointInPixels,
    );
    this.ctx.lineTo(this.SIZE / 2 - r * pointInPixels, this.SIZE / 2);
    this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(this.SIZE / 2, this.SIZE / 2);
    this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2 + (r / 2) * pointInPixels);
    this.ctx.lineTo(this.SIZE / 2 - r * pointInPixels, this.SIZE / 2);
    this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(
      this.SIZE / 2,
      this.SIZE / 2,
      r * pointInPixels,
      (Math.PI * 3) / 2,
      0,
    );
    this.ctx.moveTo(this.SIZE / 2, this.SIZE / 2);
    this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2 - r * pointInPixels);
    this.ctx.lineTo(this.SIZE / 2 + r * pointInPixels, this.SIZE / 2);
    this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2);
    this.ctx.fill();
  }

  setPointerAtDot(max_r = 3) {
    const totalPoints = 7;
    const pointInPixels = this.SIZE / totalPoints;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      `${max_r}`,
      this.SIZE / 2 + pointInPixels * max_r,
      this.SIZE / 2 - this.TEXT_MARGIN,
    );
    this.ctx.fillText(
      `${max_r}`,
      this.SIZE / 2 + this.TEXT_MARGIN,
      this.SIZE / 2 - pointInPixels * max_r,
    );

    this.ctx.beginPath();
    this.ctx.lineWidth = this.LINE_WIDTH;
    this.ctx.moveTo(
      this.SIZE / 2 + pointInPixels * max_r,
      this.SIZE / 2 + this.TEXT_LINE_HEIGHT,
    );
    this.ctx.lineTo(
      this.SIZE / 2 + pointInPixels * max_r,
      this.SIZE / 2 - this.TEXT_LINE_HEIGHT,
    );
    this.ctx.moveTo(
      this.SIZE / 2 + this.TEXT_LINE_HEIGHT,
      this.SIZE / 2 - pointInPixels * max_r,
    );
    this.ctx.lineTo(
      this.SIZE / 2 - this.TEXT_LINE_HEIGHT,
      this.SIZE / 2 - pointInPixels * max_r,
    );
    this.ctx.stroke();
  }

  drawArrow(fromX, fromY, toX, toY) {
    const headLength = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    this.ctx.beginPath();
    this.ctx.lineWidth = this.LINE_WIDTH;
    this.ctx.moveTo(fromX, fromY);
    this.ctx.lineTo(toX, toY);
    this.ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6),
    );
    this.ctx.moveTo(toX, toY);
    this.ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6),
    );
    this.ctx.stroke();
  }

  drawPoint(x, y, success) {
    if (success) {
      this.ctx.fillStyle = this.COLOR_GREEN;
    } else {
      this.ctx.fillStyle = this.COLOR_RED;
    }
    const totalPoints = 7;
    const pointInPixels = this.SIZE / totalPoints;
    this.ctx.beginPath();
    this.ctx.arc(
      this.SIZE / 2 + pointInPixels * x,
      this.SIZE / 2 - y * pointInPixels,
      3,
      0,
      Math.PI * 2,
    );
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.fillStyle = "black";
    this.ctx.lineWidth = 1;
    this.ctx.arc(
      this.SIZE / 2 + pointInPixels * x,
      this.SIZE / 2 - y * pointInPixels,
      3,
      0,
      Math.PI * 2,
    );
    this.ctx.stroke();
  }
}
