// ============================================================
const TITLE = "FireWork";
const AUTHOR = "Yutorehito_";
// ============================================================

let fireworks = []
let sky
async function setup() {
    createCanvas(400, 800);
    background(0)
    colorMode(HSL, 360, 100, 100, 100)

    for (let index = 0; index < 1; index++) {
        let startposy = random(-200, 0)
        fireworks.push(new Hanabi(
            startx = random(width),
            starty = startposy,
            firecolor = colorscheme(),
            fireheight = random(-50, 50) + height / 2,
            firenumber = 50 + random(-10, 10),
            firewidth = 500 + random(-200, 200),
            risingspeed = 5 + random(-0.05, 0.3) + abs(startposy) * 0.01
        )
        )
    }

    sky = createGraphics(width, height, P2D)
    for (let index = 0; index < 100; index++) {
        let posx = random(width)
        let posy = random(height)
        sky.strokeWeight(random(1, 2))
        sky.stroke(random(200, 255), random(200, 255), 200)
        sky.point(posx, posy)
    }

}

function colorscheme() {
    return color(10, 100, 100)
}


function draw() {
    frameRate(30)
    background(240, 100, 9, 1)
    translate(0, height);
    scale(1, -1);

    let nextfireworks = []
    for (let index = 0; index < fireworks.length; index++) {
        if (fireworks[index]) {
            let temp = fireworks[index].move()
            nextfireworks.push(...temp)
            fireworks[index].viz()
        }
    }
    if (frameCount % 30 == 1) {
        for (let index = 0; index < random(1, 5); index++) {
            let startposy = random(-200, 0)
            nextfireworks.push(
                new Hanabi(
                    startx = random(width),
                    starty = startposy,
                    firecolor = colorscheme(),
                    fireheight = random(-50, 300) + height / 2,
                    firenumber = 50,
                    firewidth = 300 + random(-100, 100) * (random() > 0.70 ? 5 : 1),
                    risingspeed = 10 + random(-0.05, 0.3) + abs(startposy) * 0.01
                )
            )
        }
    }
    fireworks = nextfireworks
    image(sky, 0, 0)
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Hanabi {
    constructor(
        startx,
        starty,
        firecolor,
        fireheight,
        firenumber,
        firewidth,
        risingspeed) {
        this.pos = createVector(startx, starty)
        this.firecolor = firecolor;
        this.fireheight = fireheight;
        this.firenumber = firenumber;
        this.firewidth = firewidth;
        this.risingspeed = createVector(0, risingspeed)
        this.fireballsize = random(0, 1)
        this.gravity = createVector(0, -0.05)
        this.wind = createVector(random(-1, 1) * 0.02, 0)
    }
    move() {
        angleMode(DEGREES)
        this.risingspeed.add(this.gravity)
        this.risingspeed.y = constrain(this.risingspeed.y, 1, 10000)
        this.risingspeed.add(this.wind)
        this.wind.mult(0.9)
        this.pos.add(this.risingspeed)
        if (this.pos.y >= this.fireheight) {
            let thisfire = random(["fire1", "fire2", "fire3", "fire4"])
            if (thisfire == "fire1") {
                return [new Sparkles(
                    this.pos,
                    this.firecolor,
                    this.firenumber * 2,
                    this.firewidth)]
            } else if (thisfire == "fire2") {
                return [new Sparkles_long(
                    this.pos,
                    this.firecolor,
                    this.firenumber,
                    this.firewidth)]
            } else if (thisfire == "fire3") {
                return [new Sparkles2(
                    this.pos,
                    this.firecolor,
                    this.firenumber,
                    this.firewidth)]
            } else if (thisfire == "fire4") {
                return [new Sparkles3(
                    this.pos,
                    this.firecolor,
                    this.firenumber,
                    this.firewidth)]
            }
        } else {
            return [this]
        }
    }
    viz() {
        fill(this.firecolor)
        noStroke()
        circle(this.pos.x, this.pos.y, this.fireballsize)
    }
}

class Sparkles {
    constructor(pos, mycolor, firenumber, firewidth) {
        this.pos = pos
        this.firecolor = mycolor
        this.firenumber = firenumber
        this.firechildren = []
        this.firechildrenSpeed = []
        this.firewidth = firewidth
        this.fireballsize = random(0.5, 1.0)
        this.speedmag = random(1, 5)
        angleMode(DEGREES)
        let oneangle = 360 / this.firenumber
        oneangle *= 3 //３周させる
        for (let index = 0; index < this.firenumber; index++) {
            let randomvec = p5.Vector.random2D()
            randomvec.setMag(random(5))
            this.firechildren.push(pos.copy().add(randomvec))
            let thisangle = oneangle * index
            let thisspeed = p5.Vector.fromAngle(radians(thisangle))
            thisspeed.setMag(this.speedmag + random(5))
            this.firechildrenSpeed.push(thisspeed)
        }
        this.gravity = createVector(0, -0.05)
        this.endoflife = false
    }
    move() {
        if (!this.endoflife) {
            for (let index = 0; index < this.firenumber; index++) {
                this.firechildrenSpeed[index].mult(0.97)
                this.firechildrenSpeed[index].add(this.gravity)
                this.firechildren[index].add(this.firechildrenSpeed[index])
            }
            if (this.pos.dist(this.firechildren[0]) >= this.firewidth) {
                this.endoflife = true
            }
            return [this]
        } else {
            return [NaN]
        }
    }
    viz() {
        let thish = hue(this.firecolor) + sin(frameCount * 5) * 30
        let thiss = saturation(this.firecolor)
        let thisl = lightness(this.firecolor)
        fill(color(thish, thiss, thisl))
        noStroke()
        this.fireballsize -= 0.01
        this.fireballsize = constrain(this.fireballsize, 0.1, 100)
        for (let index = 0; index < this.firenumber; index++) {
            circle(this.firechildren[index].x,
                this.firechildren[index].y,
                this.fireballsize
            )
        }
    }
}

class Sparkles_long extends Sparkles {
    constructor(pos, mycolor, firenumber, firewidth) {
        super(pos, mycolor, firenumber, firewidth)
        this.firechildren = []
        this.firechildrenSpeed = []
        this.fireballsize = random(0.5, 1.0)
        this.speedmag = random(1, 5)
        angleMode(DEGREES)
        let oneangle = 360 / this.firenumber
        oneangle *= 3 //３周させる
        for (let index = 0; index < this.firenumber; index++) {
            let randomvec = p5.Vector.random2D()
            randomvec.setMag(random(5))
            this.firechildren.push(pos.copy().add(randomvec))
            let thisangle = oneangle * index
            let thisspeed = p5.Vector.fromAngle(radians(thisangle))
            thisspeed.setMag(this.speedmag + random(5))
            this.firechildrenSpeed.push(thisspeed)
        }
        this.gravity = createVector(0, -0.05)
        this.endoflife = false
    }
    viz() {
        let thish = hue(this.firecolor) + sin(frameCount * 5) * 50
        let thiss = saturation(this.firecolor)
        let thisl = lightness(this.firecolor)
        stroke(color(thish, thiss, thisl))
        this.fireballsize -= 0.01
        this.fireballsize = constrain(this.fireballsize, 0.1, 100)
        strokeWeight(this.fireballsize)
        for (let index = 0; index < this.firenumber; index++) {
            let tempvec = this.firechildrenSpeed[index].copy()
            tempvec.add(this.firechildren[index])
            line(this.firechildren[index].x,
                this.firechildren[index].y,
                tempvec.x,
                tempvec.y
            )
        }
    }
}

class Sparkles2 extends Sparkles {
    constructor(pos, mycolor, firenumber, firewidth) {
        super(pos, mycolor, firenumber, firewidth)
        this.firechildren = []
        this.firechildrenSpeed = []
        this.fireballsize = random(1, 1.5)
        this.speedmag = random(1, 5)
        angleMode(DEGREES)
        let oneangle = 360 / this.firenumber
        oneangle *= 3 //３周させる
        for (let index = 0; index < this.firenumber; index++) {
            let randomvec = p5.Vector.random2D()
            randomvec.setMag(random(5))
            this.firechildren.push(pos.copy().add(randomvec))
            let thisangle = oneangle * index
            let thisspeed = p5.Vector.fromAngle(radians(thisangle))
            thisspeed.setMag(this.speedmag + random(5))
            this.firechildrenSpeed.push(thisspeed)
        }
        this.gravity = createVector(0, -0.05)
        this.endoflife = false
    }
    move() {
        if (!this.endoflife) {
            for (let index = 0; index < this.firenumber; index++) {
                this.firechildrenSpeed[index].mult(0.97)
                this.firechildrenSpeed[index].add(this.gravity)
                this.firechildren[index].add(this.firechildrenSpeed[index])
            }
            let spreading_distance = this.pos.dist(this.firechildren[0])
            if (spreading_distance >= this.firewidth) {
                this.endoflife = true
            } else if ((spreading_distance < this.firewidth / 100 * 70) && (spreading_distance >= this.firewidth / 100 * 68) && (spreading_distance > 100)) {
                let returninglist = [this]
                for (let index = 0; index < this.firechildren.length; index++) {
                    returninglist.push(
                        new Sparkles_long(
                            this.firechildren[index],
                            this.firecolor,
                            this.firenumber / 3,
                            this.firewidth / 300
                        )
                    )
                }
                return returninglist
                this.endoflife = true
            }
            return [this]
        } else {
            return [NaN]
        }
    }
    viz() {
        let thish = hue(this.firecolor) + sin(frameCount * 10) * 50
        let thiss = saturation(this.firecolor) + sin(frameCount * 10) * 10
        let thisl = lightness(this.firecolor)
        stroke(color(thish, thiss, thisl))
        this.fireballsize -= 0.01
        this.fireballsize = constrain(this.fireballsize, 0.1, 100)
        strokeWeight(this.fireballsize)
        for (let index = 0; index < this.firenumber; index++) {
            let tempvec = this.firechildrenSpeed[index].copy()
            tempvec.add(this.firechildren[index])
            line(this.firechildren[index].x,
                this.firechildren[index].y,
                tempvec.x,
                tempvec.y
            )
        }
    }
}

class Sparkles3 extends Sparkles {
    constructor(pos, mycolor, firenumber, firewidth) {
        super(pos, mycolor, firenumber, firewidth)
        this.firechildren = []
        this.firechildrenSpeed = []
        this.fireballsize = random(1, 2)
        this.speedmag = random(10, 20)
        angleMode(DEGREES)
        let oneangle = 360 / this.firenumber
        oneangle *= 3 //３周させる
        for (let index = 0; index < this.firenumber; index++) {
            let randomvec = p5.Vector.random2D()
            randomvec.setMag(5)
            this.firechildren.push(pos.copy().add(randomvec))
            let thisangle = oneangle * index
            let thisspeed = p5.Vector.fromAngle(radians(thisangle))
            thisspeed.setMag(this.speedmag)
            this.firechildrenSpeed.push(thisspeed)
        }
        this.gravity = createVector(0, -0.05)
        this.endoflife = false
    }
    move() {
        if (!this.endoflife) {
            for (let index = 0; index < this.firenumber; index++) {
                this.firechildrenSpeed[index].mult(0.90)
                this.firechildrenSpeed[index].add(this.gravity)
                this.firechildren[index].add(this.firechildrenSpeed[index])
            }
            let spreading_distance = this.pos.dist(this.firechildren[0])
            if (spreading_distance >= this.firewidth) {
                this.endoflife = true
            }
            return [this]
        } else {
            return [NaN]
        }
    }
}

function keyPressed() {
    if (key === 's' || key === 'S') {
        saveCanvas(`frameCount`, 'jpg');
    }
}
