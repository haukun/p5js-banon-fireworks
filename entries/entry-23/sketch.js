// ============================================================
const TITLE = "Fireworks 2 (2026 Version)";
const AUTHOR = "Acha";
// ============================================================

class Particle {
  constructor(position, x, y, size) {
    this.acceleration = createVector(0, 0.005)
    this.velocity = createVector(x, y)
    this.position = position.copy()
    this.size = size
    this.lifespan = size
  }

  run() {
    this.update()
    this.display()
  }

  update() {
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
    this.lifespan -= 1.5
  }

  display() {
    fill((frameCount + this.size) % 360, 90, this.lifespan, this.lifespan)
    circle(
      this.position.x,
      this.position.y,
      random(this.size - this.lifespan) / 50
    )
  }

  isDead() {
    return this.lifespan < 0
  }
}

class Firework {
  constructor(position, size) {
    this.origin = position.copy()
    this.particles = []
    this.size = size
  }

  addParticle() {
    for (let r = 0; r < TAU; r += 0.314) {
      this.particles.push(new Particle(this.origin, cos(r), sin(r), this.size))
    }
  }

  run() {
    this.particles = this.particles.filter((p) => !p.isDead())
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].run()
    }
  }
}

class Fireworks {
  constructor() {
    this.fireworks = []
  }

  initFireworks() {
    const MAX_NUMBER = random(8, 20)
    this.fireworks = []

    for (let i = 0; i < MAX_NUMBER; i++) {
      this.fireworks.push(
        new Firework(
          createVector(random(width), random(0, height / 2)),
          random(height / 4, height / 2)
        )
      )

      this.fireworks[i].addParticle()
    }
  }
}

let system = new Fireworks()

function setup() {
  createCanvas(400, 800)
  colorMode(HSB)
  noStroke()

  system = new Fireworks()
  system.initFireworks()
}

function draw() {
  background(0, 0.1)

  for (let i = 0; i < system.fireworks.length; i++) {
    system.fireworks[i].run()
  }
}
