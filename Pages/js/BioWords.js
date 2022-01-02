

let flock;
let input;

function setup() {

  let parent = document.getElementById("bwHolder");

  let cnv = createCanvas(parent.offsetWidth, parent.offsetHeight);
  cnv.parent(parent);

  flock = new Flock();
  input = createInput('');
  input.position(width / 2 - 100 ,height / 2);
  input.size(200);
  input.parent(parent);

  console.log(width);
  console.log(height);
  
  let  button = createButton('Generate');
  button.position(width / 2 - 25 ,height / 2 + 20);
  button.mousePressed(addBioword);
  button.parent(parent);
}

function draw() {
  background(0);
  flock.run();
}

function addBioword(){
  
  const val = input.value();
  let words = split(val,' ');
  
  words.forEach(function(word){
    console.log(word)
    flock.addBoid(new Boid(width / 2,height / 2,word.toUpperCase()));
  })
  
}

function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}

Flock.prototype.run = function() {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

function Boid(x, y,genome) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  this.r = 35;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
  this.genome = genome;
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  let sep = this.separate(boids);   // Separation
  let ali = this.align(boids);      // Alignment
  let coh = this.cohesion(boids);   // Cohesion
  // Arbitrarily weight these forces
  sep.mult(1.5);
  ali.mult(1.0);
  coh.mult(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

Boid.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  let theta = this.velocity.heading() + radians(90);
  
  //fill(127);
  stroke(200);
  
  push();
  translate(this.position.x, this.position.y);
  ellipseMode(CENTER);
  noFill();

  // outer layer
  ellipse(0,0,this.r,this.r);
  
  for(let i = 0; i < this.genome.length; i++){
    if(this.genome[i] == 'A'){
        //fill(255);
        ellipse(0,0,10,10);
      }else if(this.genome[i] == 'B'){
        line(0,0,20,20);
      }else if(this.genome[i] == 'C'){
        line(0,0,-20,-20);
      }else if(this.genome[i] == 'D'){
        //front
        rotate(2*PI);
        line(0,0,30,30);
      }else if(this.genome[i] == 'E'){
        //Left
        rotate(PI/2);
        line(0,0,-30,-30);
      }else if(this.genome[i] == 'F'){
        //Right
        rotate(3*PI/2);
        line(0,0,-30,-30);
      }else if(this.genome[i] == 'G'){
        //fill(255);
        ellipse(10,20,5,5);
        ellipse(20,10,5,5);
      }else if(this.genome[i] == 'H'){
        rotate(radians(30));
        line(0,0,30,30);
      }else if(this.genome[i] == 'I'){
        rotate(radians(60));
        line(0,0,30,30);
      }else if(this.genome[i] == 'K'){
        rotate(radians(120));
        line(0,0,30,30);
      }else if(this.genome[i] == 'L'){ 
        rotate(radians(150));
        line(0,0,30,30); 
      }else if(this.genome[i] == 'M'){
        rotate(radians(150));
        line(0,0,30,30);
      }else if(this.genome[i] == 'N'){
        rotate(radians(210));
        line(0,0,30,30);
      }else if(this.genome[i] == 'O'){
        rotate(radians(240));
        line(0,0,30,30);
      }else if(this.genome[i] == 'P'){
        rotate(radians(300));
        line(0,0,30,30); 
      }else if(this.genome[i] == 'Q'){
        rotate(radians(330));
        line(0,0,30,30); 
      }else if(this.genome[i] == 'R'){
        //fill(255);
        ellipse(-10,-20,5,5);
        ellipse(-20,-10,5,5);
      }else if(this.genome[i] == 'S'){
        let x = 50 * cos(theta);
        let y = 50 * sin(theta);
        ellipse(x, y, 10, 10);
        theta += 0.01;
      }else if(this.genome[i] == 'T'){
        rotate(radians(180));
        let x = 50 * cos(theta);
        let y = 50 * sin(theta);
        ellipse(x, y, 5, 5);
        theta -= 0.01;
      }else if(this.genome[i] == 'U'){ 
        let x = 20 * sin(theta);
        let y = 20 * cos(theta);
        ellipse(x, y, 16, 16);
        theta += 0.01;
      }else if(this.genome[i] == 'V'){
        let x = 20 * sin(theta);
        let y = 20 * cos(theta);
        rotate(radians(90));
        line(40+x,40+y,10,10);
        theta += 0.01;
      }else if(this.genome[i] == 'W'){ 
        let x = 20 * sin(theta);
        let y = 20 * cos(theta);
        rotate(radians(180));
        line(40+x,40+y,10,10);
        theta += 0.01;
      }else if(this.genome[i] == 'X'){
        let x = 20 * sin(theta);
        let y = 20 * cos(theta);
        rotate(radians(270));
        line(40+x,40+y,10,10);
        theta += 0.01;
      }else if(this.genome[i] == 'Y'){ 
        rotate(radians(90));
        let x = 50 * cos(theta);
        let y = 50 * sin(theta);
        ellipse(x, y, 15, 15);
        theta -= 0.01;
      }else if(this.genome[i] == 'Z'){
        rotate(radians(270));
        let x = 50 * cos(theta);
        let y = 50 * sin(theta);
        ellipse(x, y, 15, 15);
        theta -= 0.01;
      }else{
        rotate(radians(270));
        let x = 50 * cos(theta);
        let y = 50 * sin(theta);
        ellipse(x, y, 15, 15);
        theta -= 0.01;
      }
    
  }
  
  pop();
  



}

// Wraparound
Boid.prototype.borders = function() {
  if (this.position.x < -this.r)  this.position.x = width + this.r;
  if (this.position.y < -this.r)  this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  let desiredseparation = 40.0;
  let steer = createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    let sameDNA = this.genome === boids[i].genome;
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0,0);
  let count = 0;
  
  for (let i = 0; i < boids.length; i++) {
    let sameDNA = this.genome === boids[i].genome; 
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist) && sameDNA) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let sameDNA = this.genome === boids[i].genome;
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist) && sameDNA) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0, 0);
  }
}


