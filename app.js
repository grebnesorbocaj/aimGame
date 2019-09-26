var canvas = document.querySelector('canvas')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');

var difficulty = 10;
var numTargets = 100;

function Circle(x, y, radius, radChange){
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.radChange = radChange;
  this.clicked = false;
  this.ignore = false;

  let rCo = Math.floor(Math.random() * 256);
  let bCo = Math.floor(Math.random() * 256);
  let gCo = Math.floor(Math.random() * 256);

  this.draw = function(){
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.strokeStyle = `rgba(${rCo}, ${bCo}, ${gCo}, 0.5)`;
    c.fillStyle = `rgba(${rCo}, ${bCo}, ${gCo}, 0.5)`;
    c.stroke();
    c.fill();
  }

  this.update = function () {
    if(this.ignore == false){
      if(this.radius > (Math.sqrt((this.x-mouse.x)**2 + (this.y-mouse.y)**2))){
        this.clicked = true;
        this.ignore = true;
        pointCount += 1;
        mouse.x = undefined;
        mouse.y = undefined;
      }
      if(this.radius > 60){
        this.radChange = -this.radChange;
      }
      if(this.clicked == true || this.radius < 5 + this.radChange){
        this.radius = 0;
        this.radChange = 0;
        this.ignore = true;
        if(this.clicked == false) {
          missedCount += 1;
        }
      }

      this.radius += this.radChange;
      this.draw()

    }
  }
}

var circleArray = []
var clickCount = 0;
var pointCount = 0;
var clickAccuracy;
var missedCount = 0;
var frameCount = 0;

var mouse = {
  x: undefined,
  y: undefined
}

window.addEventListener('click', function(e){
  mouse.x = e.x;
  mouse.y = e.y;
})




function animate() {
  requestAnimationFrame(animate); //requests to repeat animate function
  c.clearRect(0,0,innerWidth,innerHeight); // clear frame so that new frame can be drawn
  if((pointCount + missedCount) == numTargets){
    loadAgainOr()
    cancelAnimationFrame(animate)
  }else{
    if(circleArray.length < numTargets){
      if(frameCount < difficulty){
        frameCount += 1;
      }else{
        if(Math.floor(Math.random() * 15) == 0){
          let radius = 25;
          let radChange = 0.9;
          let x = Math.random() * (innerWidth - radius * 2) + radius;
          let y = Math.random() * (innerHeight - radius * 2) + radius;
          circleArray.push(new Circle(x,y,radius,radChange));
          frameCount = 0;
        }
      }
    }
    for(let jol = 0; jol < circleArray.length; jol++){
      circleArray[jol].update()
    }
    clickAccuracy = pointCount / (missedCount + clickCount) * 100 || 0;
  }
  if(mouse.x !== undefined){
    clickCount += 1;
  }
  mouse.x = undefined;
  mouse.y = undefined;
}

animate()

function loadAgainOr(){
  document.getElementById('cover').style.display = 'block';
  document.getElementById('modal').style.display = 'block';
  document.getElementById('accStat').innerHTML = `Accuracy: ${clickAccuracy.toFixed(2)}%`
  document.getElementById('cliStat').innerHTML = `Clicked Targets: ${pointCount}`
  document.getElementById('misStat').innerHTML = `Missed Targets: ${missedCount}`
  document.getElementById('wasteStat').innerHTML = `Wasted Clicks: ${clickCount - pointCount}`
}

let replay = document.getElementById('replay')
replay.addEventListener('touchstart', function(e){
  location.reload();
})
