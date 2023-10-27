let song
let fft
let particles = []
let img

function preload() {
   song=loadSound("audio/sample-visualisation.mp3")
  img = loadImage("assets/background4.jpg")
    
}
function setup() {
    createCanvas(windowWidth,windowHeight);
    angleMode(DEGREES)
    imageMode(CENTER)
    rectMode(CENTER)
    fft = new p5.FFT(0.8, 512)
    noLoop()
}

function draw() {
    background(0)

    fft.analyze()
    amp = fft.getEnergy(20, 300)
   
    push()
    translate(width/2, height/2)
    image(img, 0, 0, width, height)
    pop()

    //调整自定义形状的位置
    translate(width/2, height)
    stroke(random(180,200), 140, random(0,212))    
    strokeWeight(3)
    noFill()

    var wave = fft.waveform()
   
    for(var t = -1; t <= 1; t += 2) {
        beginShape()
        for(var i = 0; i <= 180; i += 0.5) {
            var index = floor(map(i,0,180,0,wave.length-1))
            var r = map(wave[index], -1, 1, 90, 750)
            var x = r * sin(i) * t
            var y = r * cos(i)
            vertex(x,y)
        }
        endShape()
    }
  
  //设置粒子
    var p = new Particle()
    particles.push(p)

    for(var i = particles.length - 1; i >= 0; i--) {
        if(!particles[i].edges()) {
            particles[i].update(amp > 150)
            particles[i].show()
        } else {
            particles.splice(i, 1)
        }
        
    }

}
//设置按键
function mouseClicked() {
    if(song.isPlaying()) {
        song.pause()
        noLoop()
    } else {
        song.play()
        loop()
    }
}

//粒子效果
class Particle{
    constructor() {
        this.pos = p5.Vector.random2D().mult(450)
        this.vel = createVector(0,0)
        this.acc = this.pos.copy().mult(random(0.001, 0.00001))

        this.w = random(3, 7)
        this.color = [random(180,200), 140, random(0,212)]
    }
    update(cond) {
        this.vel.add(this.acc)
        this.pos.add(this.vel)
        if(cond) {
            this.pos.add(this.vel)
            this.pos.add(this.vel)
            this.pos.add(this.vel)
        }
    }
    edges() {
        if(this.pos.x < -width/2 || this.pos.x > width/2 || this.pos.y < -height || this.pos.y > height) {
            return true
        } else {
            return false
        }
    }
    show() {
        noStroke()
        fill(this.color)
        ellipse(this.pos.x, this.pos.y, this.w)
    }
}
