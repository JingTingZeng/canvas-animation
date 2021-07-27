const config = {
  radius1: 100, //內圓半徑
  radius2: 3000, //外圓半徑
  distance: 100, // 內外圓距離
  velocity: 2, // 速度
  lineLength: 120, // 射線長度
  lineWidth: 4, // 射線寬度
  totalLine: 50 // 射線總數量
};

const canvas = document.getElementById('radiation');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const objList = [];

function getEdgeLength(a, b) {
  return Math.sqrt((a * a + b * b));
}

class RadiationLine {

  constructor() {
    this.angle = 2 * Math.PI * Math.random();
    let x = config.radius1 * config.distance / (config.radius2 - config.radius1);
    let c = getEdgeLength(x, config.radius1);
    this.sinTheta1 = config.radius1 / c;
    this.cosTheta1 = x / c;
    this.tick = Math.random() * 100;;
  }

  get position() {
    let edge = config.distance / this.cosTheta1 - (this.tick * config.velocity);
    let end_edge = config.distance / this.cosTheta1 - (this.tick * config.velocity) - config.lineLength;
    if (edge <= 0) {
      this.reset();
      edge = config.distance / this.cosTheta1 - (this.tick * config.velocity);
      end_edge = config.distance / this.cosTheta1 - (this.tick * config.velocity) - config.lineLength;
    }
    let twoD_edge = config.radius2 - (edge * this.sinTheta1);
    let end_twoD_edge = config.radius2 - (end_edge * this.sinTheta1);
    return [
      twoD_edge * Math.cos(this.angle), twoD_edge * Math.sin(this.angle),
      end_twoD_edge * Math.cos(this.angle), end_twoD_edge * Math.sin(this.angle),
    ]
  }

  reset() {
    this.angle = 2 * Math.PI * Math.random();
    this.tick = Math.random() * 10;
  }


  update() {
    this.tick++;
  }

}

update = () => {
  console.log('update');
  ctx.clearRect(canvas.width / 2 * -1, canvas.height / 2 * -1, canvas.width, canvas.height);


  objList.forEach(obj => {
    obj.update();
    if (obj.position[2] < (canvas.width / 2 * -1)
      || obj.position[2] > canvas.width / 2
      || obj.position[3] < (canvas.height / 2 * -1)
      || obj.position[3] > canvas.height / 2
    ) {
      obj.reset();

    }

    ctx.beginPath();
    ctx.moveTo(obj.position[0], obj.position[1]);
    ctx.lineTo(obj.position[2], obj.position[3]);
    ctx.closePath();
    ctx.stroke();

  })


  window.requestAnimationFrame(update);
}

draw = () => {
  const count = config.totalLine;
  ctx.save();
  ctx.strokeStyle = 'green';
  ctx.lineWidth = config.lineWidth;
  ctx.translate(canvas.width / 2, canvas.height / 2);

  for (let i = 0; i < count; i++) {
    let obj = new RadiationLine();
    objList.push(obj);
  }

  update();
}


draw();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
