document.addEventListener('DOMContentLoaded', function(e) {
    console.log("ready");

    var ball = {},
    	screenWidth = window.innerWidth,
    	screenHeight = window.innerHeight;

    ball.radius = 10;
    ball.vx = 10 * (Math.random() * 2 - 1);
    ball.vy = 10 * (Math.random() * 2 - 1);
    ball.x = screenWidth / 2;
    ball.y = screenHeight / 2;
    ball.color = "red";

    ball.dom = document.createElement('DIV');
    ball.dom.id = "ball";
    ball.dom.style.backgroundColor = ball.color;
    ball.dom.style.width = ball.dom.style.height = (ball.radius * 2) + 'px';
    ball.dom.style.borderRadius = ball.radius + "px";
    ball.dom.style.position = "absolute";

    document.body.appendChild(ball.dom);

    function animate() {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x > (screenWidth - ball.radius)) {
            ball.x = screenWidth - ball.radius;
            ball.vx *= -1;
        }
        if (ball.x < ball.radius) {
            ball.x = ball.radius;
            ball.vx *= -1;
        }
        if (ball.y > (screenHeight - ball.radius)) {
            ball.y = screenHeight - ball.radius;
            ball.vy *= -1;
        }
        if (ball.y < ball.radius) {
            ball.y = ball.radius;
            ball.vy *= -1;
        }

        ball.dom.style.top = (ball.y - ball.radius) + "px";
        ball.dom.style.left = (ball.x - ball.radius) + "px";

        window.requestAnimationFrame(animate);
    }

    window.requestAnimationFrame(function() {
    	animate();
    });

}, false);
