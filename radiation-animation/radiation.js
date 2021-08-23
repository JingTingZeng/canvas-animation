const config = {
  radius1: 70, //內圓半徑
  radius2: 1000, //外圓半徑
  distance: 200, // 內外圓距離
  velocity: 4, // 速度
  lineLength: 200, // 射線長度
  lineWidth: 13, // 射線寬度
  totalLine: 15 // 射線總數量
};

const canvas = document.getElementById('radiation');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const raysList = [];

// utils function
const getEdgeLength = (a, b) => Math.sqrt((a * a + b * b));
const fadeInOut = (t, a) => {
  const range = Math.abs(((t + a / 2) % a) - a / 2);
  return range <= a * 0.2 ? range / (a * 0.2) : 1;
};
const createGrowingLine = (x1, y1, x2, y2, startWidth, endWidth) => {
  const directionVectorX = x2 - x1;
  const directionVectorY = y2 - y1;
  const perpendicularVectorAngle = Math.atan2(directionVectorY, directionVectorX) + Math.PI / 2;
  const path = new Path2D();
  path.arc(x1, y1, startWidth / 2, perpendicularVectorAngle, perpendicularVectorAngle + Math.PI);
  path.arc(x2, y2, endWidth / 2, perpendicularVectorAngle + Math.PI, perpendicularVectorAngle);
  path.closePath();
  return path;
}

class Ray {

  constructor() {
    this.angle = 2 * Math.PI * Math.random();
    let x = config.radius1 * config.distance / (config.radius2 - config.radius1);
    let c = getEdgeLength(x, config.radius1);
    this.sinTheta1 = config.radius1 / c;
    this.cosTheta1 = x / c;
    this.initTick = Math.random() * 10;
    this.tick = this.initTick;
    this.totalTick = Math.ceil((config.distance / this.cosTheta1) / config.velocity);
    this.lineLength = Math.random() * config.lineLength;
  }

  get startPosition() {
    let edge = config.distance / this.cosTheta1 - (this.initTick * config.velocity);
    let twoD_edge = config.radius2 - (edge * this.sinTheta1);
    return [twoD_edge * Math.cos(this.angle), twoD_edge * Math.sin(this.angle)];
  }

  get endPosition() {
    let end_edge = config.distance / this.cosTheta1 - (this.tick * config.velocity) - this.lineLength;
    let end_twoD_edge = config.radius2 - (end_edge * this.sinTheta1);

    return [end_twoD_edge * Math.cos(this.angle), end_twoD_edge * Math.sin(this.angle)];
  }

  reset() {
    this.angle = 2 * Math.PI * Math.random();
    this.tick = Math.random() * 100;
    this.lineLength = Math.random() * config.lineLength;
  }

  update() {
    this.tick++;
  }

  draw(ctx) {
    ctx.beginPath();
    const alpha = fadeInOut(this.tick, this.totalTick);
    const gradient = ctx.createLinearGradient(this.startPosition[0], this.startPosition[1], this.endPosition[0], this.endPosition[1]);
    gradient.addColorStop(0, `hsla(0, 100%, 100%, 0)`);
    gradient.addColorStop(0.2, `hsla(0, 100%, 100%, ${alpha})`);
    gradient.addColorStop(1, `hsla(0, 100%, 100%, 0)`);
    ctx.fillStyle = gradient;
    const path = createGrowingLine(this.startPosition[0], this.startPosition[1], this.endPosition[0], this.endPosition[1], 3, config.lineWidth);
    ctx.fill(path);
  }

}

render = () => {
  // 1. clear
  ctx.clearRect(canvas.width / 2 * -1, canvas.height / 2 * -1, canvas.width, canvas.height);

  // 2. draw background
  ctx.fillStyle = "#00A8A9";
  ctx.fillRect(canvas.width / 2 * -1, canvas.height / 2 * -1, canvas.width, canvas.height);

  // 3. draw raysList
  raysList.forEach(ray => {
    ray.update();
    if (ray.tick > ray.totalTick) ray.reset();
    ray.draw(ctx);
  })

  window.requestAnimationFrame(render);
}

init = () => {
  ctx.translate(canvas.width / 2, canvas.height / 2);
  const count = config.totalLine;
  for (let i = 0; i < count; i++) {
    let ray = new Ray();
    raysList.push(ray);
  }

  render();
}

init();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.translate(canvas.width / 2, canvas.height / 2);
});