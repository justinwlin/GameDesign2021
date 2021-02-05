let r, g, b;

function setup() {
  createCanvas(720, 400);
  // Pick colors randomly
  r = 255;
  g = 0;
  b = 0;
  
  var centerx = 360
  var centery = 200
  var indexText = 0
  var radius = 200
  var words=["Don't click", "stop!", "urgh", "why", "are", "you", "so", "annoying", "you must have something wrong in your head?", "i'll draw you a square?", "what about a circle?", "what about if i make them move?", "ok I give up", "you get nothing"]
}

function draw() {
  background(127);
  // Draw a circle
  strokeWeight(2);
  stroke(r, g, b);
  fill(r, g, b, 127);
  ellipse(centerx, centery, radius, radius);
  fill(255, 255, 255)

  textSize(30)
  text(words[indexText], centerx-300, centery+150);
  
  wordText = words[indexText]
  if(indexText == 0){
    
  } else if (indexText == 1){
    
  } else if (indexText == 2) {
    
  }
}

// When the user clicks the mouse
function mousePressed() {
  // Check if mouse is inside the circle
  let d = dist(mouseX, mouseY, 360, 200);
  if (d < 100) {
    // Pick new random color values
    r = random(255);
    g = random(255);
    b = random(255);
    indexText += 1
    indexText = indexText % words.length
  } else{
      alert('you miss clicking the circle hahaha')
  }
}
