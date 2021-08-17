let a = 0;
let b = 90;
let s1Length = 185;
let s2Length = 200;
let margin = 10;
let h = 400;
let boxSize = h - 2 * margin;
let startX = boxSize / 2;
let startY = 0;
let points = [];
let resolution = 2;
let obstacles = [[100, 250, 50]];

function setup() {
    angleMode(DEGREES);
    createCanvas(2 * h, h);
    rect(height + margin, margin, boxSize, boxSize);
}

function draw() {
    noStroke()
    rect(0,0,height+margin-1,height)
    stroke(2)
    rect(margin, margin, boxSize, boxSize);
    for (let i = 0; i < obstacles.length; i++) {
        ellipse(
            margin + boxSize / 2 - obstacles[i][0],
            margin +  obstacles[i][1],
            obstacles[i][2] *2
        );
    }
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points[i].length; j++) {
            if (!points[j][i]) {
                rect(
                    height + margin + ((i * 5) / resolution / 180) * boxSize,
                    margin + ((j * 10) / resolution / 360) * boxSize,
                    boxSize / 36 / resolution
                );
            }
        }
    }

    if (points.length > 0) {
        // && width - margin - boxSize <mouseX&&mouseX < width - margin && margin <mouseY&&mouseY < height - margin)
        a = ((mouseY - margin - boxSize / 2) / boxSize) * 180;
        b = ((mouseX - height - margin - boxSize / 2) / boxSize) * 360;
        //ellipse(mouseX, mouseY, 10)
    }
    drawArms();
    // fill("#911")
    // ellipse(10 + 200 +  s1Length * sin(a) + s2Length * sin(b+a), 390 - s1Length * cos(a) - s2Length * cos(b+a), 10)
    // fill("#fff")
}

function generateCollision() {
    clear();
    rect(margin, margin, boxSize, boxSize);
    rect(height + margin, margin, boxSize, boxSize);
    for (a = -90; a < 90; a += 5 / resolution) {
        let row = [];
        for (b = -180; b < 180; b += 10 / resolution) {
            
            let p1 = createVector(
                margin +
                    boxSize / 2 +
                    s1Length * sin(a) +
                    s2Length * sin(b + a),
                margin + boxSize - s1Length * cos(a) - s2Length * cos(b + a)
            );
            let p2 = createVector(margin + boxSize / 2 + s1Length * sin(a) ,
            margin + boxSize - s1Length * cos(a));

            
            let p3 = createVector((p1.x+p2.x)/2,(p1.y+p2.y)/2)
            
            let collisionPoints = []
            collisionPoints.push(p1,p2,p3,createVector((p1.x+p3.x)/2,(p1.y+p3.y)/2),createVector((p3.x+p2.x)/2,(p3.y+p2.y)/2))

            let available =
                margin + boxSize-5 > p1.x &&
                p1.x > margin+5 &&
                p1.y > margin+5 &&
                p1.y < boxSize + margin-5

            for (let i = 0; i < obstacles.length; i++) {
                for (let j = 0; j < collisionPoints.length; j++) {
                    if((collisionPoints[j].x - obstacles[i][0]) ** 2 +
                    (collisionPoints[j].y - obstacles[i][1]) ** 2 <
                    obstacles[i][2] ** 2)
                    {
                        available = false;
                        break;
                    }
                }
            }

            row.push(available);
        }
        points.push(row);
    }
}

function drawArms() {
    push();
    translate(margin + boxSize / 2, margin + boxSize);
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
    ellipse(
        margin + boxSize / 2 + s1Length * sin(a) + s2Length * sin(b + a),
        margin + boxSize - s1Length * cos(a) - s2Length * cos(b + a),
        10,
        10
    );
    ellipse(margin + boxSize / 2 + s1Length * sin(a) ,
    margin + boxSize - s1Length * cos(a) ,10,10)
}

function orthogonalProjection(a, b, p) {
    d1 = p5.Vector.sub(b, a);
    d2 = p5.Vector.sub(p, a);
    l1 = d1.mag();

    dotp = constrain(d2.dot(d1.normalize()), 0, l1);

    return p5.Vector.add(a, d1.mult(dotp));
}
