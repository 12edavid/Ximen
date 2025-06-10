let y = document.getElementById('yes');
        let n = document.getElementById('no');
        let print = document.getElementById('print');
        let audioPlayer = document.getElementById('audioPlayer');
        let audioPlayer1 = document.getElementById('audioPlayer1');
        let canvas = document.getElementById('birthday');
        let ctx = canvas.getContext("2d");
        const title = document.querySelector('.title');

        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function clicker(button) {
            document.querySelector('.button-container').style.display = 'none';
            // Display the title
            title.style.display = 'none';
            if (button === y) {
                print.innerHTML = ' Gracias... cuidaré tu corazón como un fuego sagrado.❤';
                audioPlayer.play();
                audioPlayer1.pause();
            } else if (button === n) {
                print.innerHTML = 'Mi corazón ha sido hecho trizas por la helada de tu respuesta! ';
                audioPlayer1.play();
                audioPlayer.pause();
            }
        }

        let celebrationActive = false;
        let animationFrame;

        y.addEventListener('click', () => {
            clicker(y);
            if (!celebrationActive) {
                celebrationActive = true;
                celebrate();
                
            }
        });

        n.addEventListener('click', () => {
            clicker(n);
            // Stop celebration
            celebrationActive = false;
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        function celebrate() {
            const PI2 = Math.PI * 2;
            const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

            class Firework {
                constructor(x, y, targetX, targetY, shade, offsprings) {
                    this.dead = false;
                    this.offsprings = offsprings;
                    this.x = x;
                    this.y = y;
                    this.targetX = targetX;
                    this.targetY = targetY;
                    this.shade = shade;
                    this.history = [];
                }

                update(delta) {
                    if (this.dead) return;

                    let xDiff = this.targetX - this.x;
                    let yDiff = this.targetY - this.y;
                    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
                        this.x += xDiff * 2 * delta;
                        this.y += yDiff * 2 * delta;

                        this.history.push({
                            x: this.x,
                            y: this.y
                        });

                        if (this.history.length > 20) this.history.shift();
                    } else {
                        if (this.offsprings && !this.madeChilds) {
                            let babies = this.offsprings / 2;
                            for (let i = 0; i < babies; i++) {
                                let targetX = this.x + this.offsprings * Math.cos((PI2 * i) / babies);
                                let targetY = this.y + this.offsprings * Math.sin((PI2 * i) / babies);
                                fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0));
                            }
                        }
                        this.madeChilds = true;
                        this.history.shift();
                    }

                    if (this.history.length === 0) this.dead = true;
                    else if (this.offsprings) {
                        for (let i = 0; i < this.history.length; i++) {
                            let point = this.history[i];
                            ctx.beginPath();
                            ctx.fillStyle = `hsl(${this.shade},100%,${i}%)`;
                            ctx.arc(point.x, point.y, 1, 0, PI2, false);
                            ctx.fill();
                        }
                    } else {
                        ctx.beginPath();
                        ctx.fillStyle = `hsl(${this.shade},100%,50%)`;
                        ctx.arc(this.x, this.y, 1, 0, PI2, false);
                        ctx.fill();
                    }
                }
            }

            let fireworks = [];
            let counter = 0;

            function update(delta) {
                ctx.globalCompositeOperation = "hard-light";
                ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.globalCompositeOperation = "lighter";
                fireworks.forEach(firework => firework.update(delta));

                counter += delta * 3;
                if (counter >= 1) {
                    fireworks.push(new Firework(
                        random(canvas.width * 0.25, canvas.width * 0.75),
                        canvas.height,
                        random(0, canvas.width),
                        random(0, canvas.height * 0.5),
                        random(0, 360),
                        random(30, 110)
                    ));
                    counter = 0;
                }

                fireworks = fireworks.filter(firework => !firework.dead);

                if (celebrationActive) {
                    animationFrame = requestAnimationFrame(() => update(1 / 60));
                }
            }

            update(1 / 60);
        }