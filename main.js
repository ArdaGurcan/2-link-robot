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

let open = [];
let close = [];

let goal = { x: 33, y: 7 };

class NodeStar {
    open = true
    x = 0;
    y = 0;
    f = 0;
    g = 0;
    h = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function setup() {
    open.push(new NodeStar(44,61))
    angleMode(DEGREES);
    createCanvas(2 * h, h);
    rect(height + margin, margin, boxSize, boxSize);
    generateCollision();
    frameRate(24)
}

function draw() {
    noStroke();
    clear()
    rect(0, 0, height + margin - 1, height);
    stroke(2);
    rect(margin, margin, boxSize, boxSize);
    for (let i = 0; i < obstacles.length; i++) {
        ellipse(
            margin + boxSize / 2 - obstacles[i][0],
            margin + obstacles[i][1],
            obstacles[i][2] * 2
        );
    }
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points[i].length; j++) {
            if (!points[j][i]) {
                fill(50, 50, 50,128);
                rect(
                    height + margin + ((i * 5) / resolution / 180) * boxSize,
                    margin + ((j * 10) / resolution / 360) * boxSize,
                    boxSize / 36 / resolution
                );
            } else {
                for (let k = 0; k < open.length; k++) {
                    if (i == open[k].y && j == open[k].x) {
                        fill(50, 200, 50,128);
                        rect(
                            height +
                                margin +
                                ((i * 5) / resolution / 180) * boxSize,
                            margin + ((j * 10) / resolution / 360) * boxSize,
                            boxSize / 36 / resolution
                        );
                    }
                }
                for (let k = 0; k < close.length; k++) {
                    if (i == close[k].y && j == close[k].x) {
                        fill(200, 50, 50,128);
                        rect(
                            height +
                                margin +
                                ((i * 5) / resolution / 180) * boxSize,
                            margin + ((j * 10) / resolution / 360) * boxSize,
                            boxSize / 36 / resolution
                        );
                    }
                }
                if (i == goal.y && j == goal.x) {
                    fill(50, 200, 50,128);
                    rect(
                        height +
                            margin +
                            ((i * 5) / resolution / 180) * boxSize,
                        margin + ((j * 10) / resolution / 360) * boxSize,
                        boxSize / 36 / resolution
                    );
                }
            }
        }
    }
    fill("#fff");
    // if (points.length > 0) {
    //     // && width - margin - boxSize <mouseX&&mouseX < width - margin && margin <mouseY&&mouseY < height - margin)
    //     a = ((mouseY - margin - boxSize / 2) / boxSize) * 180;
    //     b = ((mouseX - height - margin - boxSize / 2) / boxSize) * 360;
    //     //ellipse(mouseX, mouseY, 10)
    // }
    if(open.length >0)
        step()
    
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
            let p2 = createVector(
                margin + boxSize / 2 + s1Length * sin(a),
                margin + boxSize - s1Length * cos(a)
            );

            let p3 = createVector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);

            let collisionPoints = [];
            collisionPoints.push(
                p1,
                p2,
                p3,
                createVector((p1.x + p3.x) / 2, (p1.y + p3.y) / 2),
                createVector((p3.x + p2.x) / 2, (p3.y + p2.y) / 2)
            );

            let available =
                margin + boxSize - 5 > p1.x &&
                p1.x > margin + 5 &&
                p1.y > margin + 5 &&
                p1.y < boxSize + margin - 5;

            for (let i = 0; i < obstacles.length; i++) {
                for (let j = 0; j < collisionPoints.length; j++) {
                    if (
                        (collisionPoints[j].x - obstacles[i][0]) ** 2 +
                            (collisionPoints[j].y - obstacles[i][1]) ** 2 <
                        obstacles[i][2] ** 2
                    ) {
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
    ellipse(
        margin + boxSize / 2 + s1Length * sin(a),
        margin + boxSize - s1Length * cos(a),
        10,
        10
    );
}

function orthogonalProjection(a, b, p) {
    d1 = p5.Vector.sub(b, a);
    d2 = p5.Vector.sub(p, a);
    l1 = d1.mag();

    dotp = constrain(d2.dot(d1.normalize()), 0, l1);

    return p5.Vector.add(a, d1.mult(dotp));
}

function step() {
    if (open.length > 0) {
        // open.sort((a, b) => b.f - a.f);
        let q = open.reduce(function(res, obj) {
            return (obj.f < res.f) ? obj : res;
        });
        // console.log(open.length) 
        
            open = open.filter(item => item != q)

        // console.log(open.length)
        a = q.x * 2.5 -90
        b = q.y * 5-180
        
        let successors = [];

        if (q.x - 1 >= 0 && q.y - 1 >= 0)
            successors.push(new NodeStar(q.x - 1, q.y - 1));
        if (q.x - 1 >= 0) successors.push(new NodeStar(q.x - 1, q.y));
        if (q.x - 1 >= 0 && q.y + 1 < points.length)
            successors.push(new NodeStar(q.x - 1, q.y + 1));

        if (q.y - 1 >= 0) successors.push(new NodeStar(q.x, q.y - 1));
        if (q.y + 1 < points.length)
            successors.push(new NodeStar(q.x, q.y + 1));

        if (q.x + 1 < points.length && q.y - 1 >= 0)
            successors.push(new NodeStar(q.x + 1, q.y - 1));
        if (q.x + 1 < points.length)
            successors.push(new NodeStar(q.x + 1, q.y));
        if (q.x + 1 < points.length && q.y + 1 < points.length)
            successors.push(new NodeStar(q.x + 1, q.y + 1));

        for (let i = 0; i < successors.length; i++) {
            if (successors[i].x == goal.x && successors[i].y == goal.y) {
                open = [];
                break;
            }

            skip = false;
            if (!points[successors[i].x][successors[i].y]) {
                skip = true
            }
            
            for (let j = 0; j < close.length; j++) {
                if (
                    successors[i].x == close[j].x &&
                    successors[i].y == close[j].y 
                ) {
                    skip = true;
                    break
                }
            }
            if(!skip)
            {

                successors[i].g =
                    q.g +
                    ((q.x - successors[i].x) ** 2 +
                    (q.y - successors[i].y) ** 2);
                successors[i].h =
                    ((goal.x - successors[i].x) ** 2 +
                    (goal.y - successors[i].y) ** 2);
                successors[i].f = successors[i].g + successors[i].h;
            }

            if (!skip)
                for (let j = 0; j < open.length; j++) {
                    if (
                        successors[i].x == open[j].x &&
                        successors[i].y == open[j].y &&
                        successors[i].f > open[j].f
                    ) {
                        skip = true;
                        break
                    }
                }


            if (!skip) {
                let doAdd = true
                for (let k = open.length-1; k >=0 ; k--) {
                    if (successors[i].y == open[k].y && successors[i].x == open[k].x)
                    {
                        doAdd= false
                        break
                    }
                }
                if(doAdd)
                    open.push(successors[i]);
                // fill("#00ff44")
                // rect(height + margin + ((successors[i].y * 5) / resolution / 180) * boxSize,
                // margin + ((successors[i].x * 10) / resolution / 360) * boxSize,
                // boxSize / 36 / resolution);
                // fill("#fff")
            }

            // else{close.push(q)}

        }
        close.push(q);
    }
}
