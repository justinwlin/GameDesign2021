let r, g, b;

let x = 100,
  y = 100,
  angle1 = 0.0,
  segLength = 100,
  angle = 0;

let pointsArray = []; //PointsArray is to hold all the circles
let counter = 0; // Counter is used in the code to limit the # of spawning circles
let squareSize = 10;
let isSquareCursor = true;
let winTime;
let timerHasStarted = false;

function setup() {
  createCanvas(720, 400);
  // Pick colors randomly
  r = 255;
  g = 0;
  b = 0;
  centerx = 360;
  centery = 200;
  indexText = 0;
  words = ["Please don't click", "Urgh", "Stop!", "Homey, why are you so annoying?", "Fine, do you want a lollypop?", "Okay **stop** play with these instead", "Right now, why not just give up?", "5 head required to win", "So did you read the title?"];
}

function draw() {
  background(127);
  // Draw a circle
  strokeWeight(2);
  stroke(r, g, b);
  fill(r, g, b, 127);
  ellipse(centerx, centery, 200, 200);
  fill(255, 255, 255);

  textSize(30);
  text(words[indexText], centerx - 300, centery + 150);

  sentence = words[indexText];
  if (sentence == "Fine, do you want a lollypop?") {
    lollypop();
  } else if (sentence == "Okay **stop** play with these instead") {
    runStars();
  }
  console.log(winTime, millis())
  
  if (millis() > winTime && timerHasStarted){
      alert("you won!"); 
      winTime = winTime + 5000; 
      timerHasStarted = false;
    }
}

// When the user clicks the mouse
function mousePressed() {  
  // Check if mouse is inside the circle
  let d = dist(mouseX, mouseY, 360, 200);
  if (d < 100) {
    timerHasStarted = true;
    winTime = millis() + 5000;
    // Pick new random color values
    r = 255;
    g = 255;
    b = 255;
    indexText += 1;
    indexText = indexText % words.length;
  } else {
    alert('you miss clicking the circle hahaha');
  }
}

function mouseReleased() {
  timerHasStarted = false;
  r = random(255);
  g = random(255);
  b = random(255);
}

// ================================
// =================================
// JUNK CODE TO SPAM BELOW
// ================================
// =================================
// ================================

//=================================
// Lollypop
//=================================

function lollypop() {
  dx = mouseX - x;
  dy = mouseY - y;
  angle1 = atan2(dy, dx);
  x = mouseX - cos(angle1) * segLength;
  y = mouseY - sin(angle1) * segLength;
  segment(x, y, angle1);
  ellipse(x, y, 100, 100);
}

function segment(x, y, a) {
  push();
  translate(x, y);
  rotate(a);
  line(0, 0, segLength, 0);
  pop();
}

//=================================
//Spawn Stars Algorithm
//=================================

function runStars() {
  fill(10, 10, 0);
  //=================
  //Updating Loop 
  //=================
  pointsArray.forEach(item => {
    item.update(mouseX, mouseY);
    item.show();
    randomNum = random(10);
    if (randomNum < 2) {
      item.applyForce(createVector(random(20), random(20)));
    }
  });
  pushStarsToArray();
  //=================================
  //Square following the cursor
  //=================================
  fill(0, 0, 0);
  noStroke();
  if (isSquareCursor) {
    rectMode(RADIUS);
    square(mouseX, mouseY, squareSize);
  } else {
    circle(mouseX, mouseY, squareSize);
  }
}

function pushStarsToArray() {
  test = spawnStar();
  if (counter < 10) {
    counter += 1;
    pointsArray.push(test);
  } else {
    let sliceStarting = int(random(300));
    pointsArray = pointsArray.slice(sliceStarting, 600);
    counter -= abs(pointsArray.length - 600);
  }
}


function spawnStar() {
  let x = random(width);
  let y = random(height);
  nPoint = new Star(x, y, 1, random(60));
  return nPoint;

}

class Star {
  constructor(x, y, r, maxSize = 50) {
    //setting initial x and y for further reference in code
    //if i try to get it from the this.pos it can be a floating point that is constantly changing
    this.origX = x;
    this.origY = y;

    //Setting initial vector quantities
    this.pos = createVector(random(x), random(y));
    this.target = createVector(x, y);
    this.vel = createVector(); //Velocity is 0
    this.acc = createVector(); //Acceleration starts at 0

    this.diameter = r; //Radius to determine size
    this.maxspeed = 10; //Used for magnitude of the vector
    this.maxforce = 2; //maximum force to apply
    this.fleeDistance = 300;
    this.maxSize = maxSize; //max size that is default 50, but in the code is randomized
    this.growing = true; //controlling whether the circle is still growing or not
  }

  update(mouseX, mouseY) {
    //Updates position based on velocity / acceleration
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    //Zeroes out the acceleration so that it isn't constantly building up
    this.acc.mult(0);
    let seek = this.seekTarget(createVector(mouseX, mouseY));
    seek.mult(2);

    let scatter = this.scatter(createVector(mouseX, mouseY));
    scatter.mult(10);

    this.applyForce(scatter);
    this.applyForce(seek);
  }

  //Drawing triangle
  show() {
    stroke(255);
    strokeWeight(3);
    fill(0, random(0, 255), random(200, 255));
    rectMode(CENTER);
    triangle(66 + this.pos.x, 10 + this.pos.y, 111 + this.pos.x, 84 + this.pos.y, 18 + this.pos.x, 84 + this.pos.y);
    triangle(17 + this.pos.x, 32 + this.pos.y, 109 + this.pos.x, 32 + this.pos.y, 61 + this.pos.x, 107 + this.pos.y);
  }

  applyForce(force, mult) {
    this.acc.add(force);
  }

  //seeking to go home target
  seekTarget(target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    var speed = this.maxspeed;
    // if (d < 100) {
    //   speed = map(d, 0, 100, 0, this.maxspeed);
    // }
    desired.setMag(speed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  }

  scatter(target) {
    /*
    Target is a mouse vector which we subtract from the position
    
    if the d or magnitude is below the flee distance we set the magnitude to the maxspeed and multiple it by -1 to have it reverse direction
    
    we then return that vector
    
    if the d is above the flee distance, meaning that it is out the range of the influence of the mouse, then we just return a vector of 0
    */
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    if (d < this.fleeDistance) {
      desired.setMag(this.maxspeed);
      desired.mult(-1);
      var steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }
}
