// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY, color = "white") {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color; // NUEVO
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color; // CAMBIO
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Colisión con la parte superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX;
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, isPlayerControlled = false, color="white") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 5;
        this.color = color; // NUEVO
    }

    draw() {
        ctx.fillStyle = this.color; // CAMBIO
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    // Movimiento de la paleta automática (IA)
    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {

        // ====== 5 PELOTAS ======
        this.balls = [
            new Ball(400,300,10,4,4,"cyan"),
            new Ball(200,200,6,5,3,"orange"),
            new Ball(500,150,8,3,5,"blue"),
            new Ball(300,400,12,2,4,"gray"),
            new Ball(600,250,5,6,2,"white")
        ];

        // ====== PALETAS ======
        this.paddle1 = new Paddle(
            0,
            canvas.height / 2 - 100,
            10,
            200, // DOBLE DE ALTURA
            true,
            "green"
        );

        this.paddle2 = new Paddle(
            canvas.width - 10,
            canvas.height / 2 - 50,
            10,
            100,
            false,
            "red"
        );

        this.keys = {};
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // dibujar pelotas
        this.balls.forEach(ball => ball.draw());

        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {

        // mover todas las pelotas
        this.balls.forEach(ball => {

            ball.move();

            // Movimiento del jugador
            if (this.keys['ArrowUp']) {
                this.paddle1.move('up');
            }

            if (this.keys['ArrowDown']) {
                this.paddle1.move('down');
            }

            // IA usa la primera pelota
            this.paddle2.autoMove(this.balls[0]);

            // Colisión paddle1
            if (
                ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y &&
                ball.y <= this.paddle1.y + this.paddle1.height
            ) {
                ball.speedX = -ball.speedX;
            }

            // Colisión paddle2
            if (
                ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y &&
                ball.y <= this.paddle2.y + this.paddle2.height
            ) {
                ball.speedX = -ball.speedX;
            }

            // Reset si sale del campo
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
                ball.reset();
            }

        });

    }

    // Captura de teclas para el control de la paleta
    handleInput() {

        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });

    }

    run() {

        this.handleInput();

        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };

        gameLoop();

    }

}

// Crear instancia del juego y ejecutarlo
const game = new Game();
game.run();