var canvas = document.querySelector('canvas')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');

var scoreBoard = document.getElementById('scoreboard')

var difficulty = 10;
var numTargets = 100;
var numLives = 5;

if(window.innerWidth < 800){
  var maxRadius = 60;
  var radChange = 0.9;
}else {
  var maxRadius = 75;
  var radChange = 0.4;
}

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
          document.getElementById('redCover').style.display = 'block'
          setTimeout(function(){
            document.getElementById('redCover').style.display = 'none'
          }, 70)
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
  y: undefined,
  clicked: false
}



function animate() {
  requestAnimationFrame(animate); //requests to repeat animate function
  c.clearRect(0,0,innerWidth,innerHeight); // clear frame so that new frame can be drawn
  window.addEventListener('click', function(e){
    mouse.x = e.x;
    mouse.y = e.y;
    mouse.clicked = true;
  })
  if((pointCount + missedCount) == numTargets ||  numLives == missedCount){
    loadAgainOr()
    cancelAnimationFrame(animate)
  }else{
    if(mouse.clicked == true){
      clickCount += 1;
      mouse.clicked = false;
    }
    if(circleArray.length < numTargets){
      if(frameCount < difficulty){
        frameCount += 1;
      }else{
        if(Math.floor(Math.random() * 15) == 0){
          let radius = 25;
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
    clickAccuracy = pointCount / (pointCount + clickCount + missedCount) * 100 || 0;
    scoreBoard.innerHTML = `${pointCount} points from ${clickCount} clicks. Missed ${missedCount} circles, ${numLives-missedCount} lives left.`
  }
  console.log(pointCount, clickCount, missedCount)
  mouse.x = undefined;
  mouse.y = undefined;
}

animate()

function loadAgainOr(){
  let num = clickCount
  document.getElementById('cover').style.display = 'block';
  document.getElementById('modal').style.display = 'block';
  document.getElementById('accStat').innerHTML = `Accuracy: ${clickAccuracy.toFixed(2)}%`
  document.getElementById('cliStat').innerHTML = `Clicked Targets: ${pointCount}`
  document.getElementById('misStat').innerHTML = `Missed Targets: ${missedCount}`
  document.getElementById('wasteStat').innerHTML = `Offtarget Clicks: ${num-pointCount}`
}

let replay = document.getElementById('replay')
replay.addEventListener('click', function(e){
  location.reload();
})
