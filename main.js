let a = 0;
let b = 90;
let s1Length = 120;
let s2Length = 90;
let margin = 10;
let h = 400;
let boxSize = h  - 2 *margin
let startX = boxSize /2
let startY = 0
let points = []
let resolution = 2
let obstacles = [[250,250,50]]

function setup() {
    angleMode(DEGREES);
    createCanvas(2 * h, h);
}

function draw() {
    
    rect(margin, margin, boxSize, boxSize);
    rect(height + margin, margin, boxSize, boxSize);
    for (let i = 0; i < obstacles.length; i++) {
        ellipse(obstacles[i][0], obstacles[i][1], obstacles[i][2])
        
    }
    
    // drawArms()
    // fill("#911")
    // ellipse(10 + 200 +  s1Length * sin(a) + s2Length * sin(b+a), 390 - s1Length * cos(a) - s2Length * cos(b+a), 10)
    // fill("#fff")
}



function drawArms() {
    push();
    translate(margin + boxSize /2,margin +boxSize);
    ellipse(0, 0, 5);
    rotate(a);
    line(0, 0, 0, -s1Length);
    translate(0, -s1Length);
    ellipse(0, 0, 5);
    rotate(b);
    line(0, 0, 0, -s2Length);
    translate(0, -s2Length);
    ellipse(0, 0, 5);
    pop();
}
