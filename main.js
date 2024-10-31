//定义彩球计数

const para = document.querySelector('p');
let count = 0;

// 设置画布

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数

function random(min,max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

// 生成随机颜色值的函数

function randomColor() {
  const color = 'rgb(' +
                random(0, 255) + ',' +
                random(0, 255) + ',' +
                random(0, 255) + ')';
  return color;
}

//定义Shape构造器
function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
  }
  
// 定义 Ball 构造器，继承自 Shape
  
function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
  }
  
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// 定义彩球绘制函数

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// 定义彩球更新函数

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// 定义碰撞检测函数

Ball.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
        
      if (distance < this.size + balls[j].size && balls[j].exists) {
        balls[j].color = this.color = randomColor();
      }
    }
  }
};

//定义恶魔圈EvilCricle构造器，继承自Shape

function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, 20, 20, exists);
    this.color = 'white';
    this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

//定义EvilCircle绘制函数

EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    //设置绘制圆形的填充颜色为白色
    ctx.strokeStyle = this.color;
    //设置绘制圆形的边框宽度为3
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    //绘制路径边框
    ctx.stroke();
  };

//定义EvilCricle边缘检测函数

EvilCircle.prototype.checkBounds = function() {
    if((this.x + this.size) >= width) { //当恶魔圈到达画布右侧边缘时，向左反弹
      this.x -= this.size;
    }
    if((this.x - this.size) <= 0) { //当恶魔圈到达画布左侧边缘时，向右反弹
      this.x += this.size;
    }
    if((this.y + this.size) >= height) {    //当恶魔圈到达画布底部边缘时，向上反弹
      this.y -= this.size;
    }
    if((this.y - this.size) <= 0) {     //当恶魔圈到达画布顶部边缘时，向下反弹
      this.y += this.size;
    }
}

//定义EvilCricle移动函数

EvilCircle.prototype.setControls = function() {
    window.onkeydown = e => {
      switch(e.key) {
        case 'a':
          this.x -= this.velX;
          break;
        case 'd':
          this.x += this.velX;
          break;
        case 'w':
          this.y -= this.velY;
          break;
        case 's':
          this.y += this.velY;
          break;
      }
    };
  };

//定义EvilCricle与Ball碰撞检测函数

EvilCircle.prototype.collisionDetect = function() {
    for(let j = 0; j < balls.length; j++) {
      if(balls[j].exists) { //当彩球存在时，进行碰撞检测
        //计算恶魔圈与彩球之间的距离
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        //当恶魔圈与彩球碰撞时，彩球消失
        if (distance < this.size + balls[j].size) {
            balls[j].exists = false;
            count--;
            para.textContent = '剩余彩球数：' + count;
          }
      }
    }
}

// 定义一个数组，生成并保存所有的球

const balls = [];

while(balls.length < 25) {
  const size = random(10,20);
  let ball = new Ball(
    // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    true,
    randomColor(),
    size
  );
  balls.push(ball);
  count++;
  para.textContent = '剩余彩球数：' + count;
}

// 定义一个循环来不停地播放

let evil = new EvilCircle(random(0, width), random(0, height), true);
evil.setControls();

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; //设置填充颜色为黑色，透明度为0.25
  ctx.fillRect(0,0,width,height); //在画布上绘制一个填充的矩形，以实现背景的平滑过渡效果
  //遍历彩球数组，如果彩球存在，则绘制彩球、更新彩球位置、检测彩球碰撞
  for(let i = 0; i < balls.length; i++) { 
    if(balls[i].exists) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
     }
    }
  //绘制恶魔圈、检测恶魔圈边缘、检测恶魔圈与彩球的碰撞
  evil.draw();
  evil.checkBounds();
  evil.collisionDetect();
  
  //递归调用loop函数，实现动画效果
  requestAnimationFrame(loop);
}

loop();