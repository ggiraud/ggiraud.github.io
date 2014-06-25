var screenWidth = window.innerWidth,
    screenHeight = window.innerHeight;

console.log(screenWidth, screenHeight);

function Ball(radius, color) {
    var speed = 20;
    this.radius = radius;
    this.color = color;
    this.vx = speed * (Math.random() * 2 - 1);
    this.vy = speed * (Math.random() * 2 - 1);
    this.x = screenWidth / 2;
    this.y = screenHeight / 2;
}

Ball.prototype.insert = function() {
    this.dom = document.createElement('DIV');
    this.dom.id = "ball";
    this.dom.style.backgroundColor = this.color;
    this.dom.style.width = this.dom.style.height = (this.radius * 2) + 'px';
    this.dom.style.borderRadius = this.radius + "px";
    this.dom.style.position = "absolute";

    document.body.appendChild(this.dom);
};

Ball.prototype.move = function() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x > (screenWidth - this.radius)) {
        this.x = screenWidth - this.radius;
        this.vx *= -1;
    }
    if (this.x < this.radius) {
        this.x = this.radius;
        this.vx *= -1;
    }
    if (this.y > (screenHeight - this.radius)) {
        this.y = screenHeight - this.radius;
        this.vy *= -1;
    }
    if (this.y < this.radius) {
        this.y = this.radius;
        this.vy *= -1;
    }
};

Ball.prototype.display = function() {
    this.dom.style.top = (this.y - this.radius) + "px";
    this.dom.style.left = (this.x - this.radius) + "px";
};


document.addEventListener('DOMContentLoaded', function(e) {
    console.log("ready");

    var balls = [];

    for (var i = 0; i < 100; i++) {
        balls[i] = new Ball(10, "red");
        balls[i].insert();
    }

    function draw() {
        for (var i = 0; i < 100; i++) {
            balls[i].move();
            balls[i].display();
        }
        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);

}, false);
