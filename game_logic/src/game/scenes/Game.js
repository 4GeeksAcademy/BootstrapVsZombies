import Phaser from 'phaser';

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
        // Lista de etiquetas HTML para "balas"
        this.htmlTags = ['p', 'h5', 'h4', 'h3', 'h2', 'h1'];
        // Daño correspondiente a cada tag
        this.tagDamage = {
            'p': 1,
            'h5': 2.5,
            'h4': 4,
            'h3': 5,
            'h2': 10,
            'h1': 15
        };
        // Probabilidades ponderadas (más probabilidad para menor daño)
        this.tagWeights = [0.9, 0.08, 0.01, 0.009, 0.0008, 0.0002];
    }

    create() {
        this.cameras.main.setBackgroundColor('#1c1f2b');
        this.physics.resume();
        this.createGrid();
        this.createTurrets();
        this.zombies = this.physics.add.group();
        this.createZombies();
        this.bullets = this.physics.add.group();

        this.explosionEmitter = this.add.particles(0, 0, 'bullet', {
            speed: { min: -200, max: 200 },
            lifespan: 300,
            scale: { start: 0.4, end: 0 },
            blendMode: 'ADD',
            gravityY: 200,
            quantity: 0,
            on: false
        });
        this.explosionEmitter.setDepth(10);

        this.kills = 0;
        this.killText = this.add.text(10, 20, 'Zombies eliminados: 0', {
            fontSize: '18px',
            fill: '#ffffff'
        });


        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.turrets.children.iterate((turret) => {
                    const turretCol = turret.getData('col');
                    const zombiesInCol = this.zombies.getChildren().filter(zombie => zombie.getData('col') === turretCol);

                    if (zombiesInCol.length > 0) {
                        this.fireBullet(turret);
                    }
                });
            },
            loop: true
        });


    }

    createGrid() {
        const cols = 12;
        const rowHeight = 64;
        const colWidth = this.sys.game.config.width / cols;
        const defenseY = 100;

        this.gridCells = [];

        // Dibujar celdas rectangulares (fila superior)
        for (let i = 0; i < cols; i++) {
            const x = i * colWidth + colWidth / 2;

            const cell = this.add.rectangle(x, defenseY, colWidth - 4, rowHeight - 4, 0x4db8ff, 0.2);
            cell.setStrokeStyle(2, 0xcccccc, 0.4);
            cell.setData('col', i);
            this.gridCells.push(cell);
        }

        // Dibujar líneas punteadas entre columnas
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0xcccccc, 0.3); // Gris claro, semi transparente

        for (let i = 1; i < cols; i++) {
            const x = i * colWidth;
            const dashLength = 8;
            const gapLength = 8;
            let y = 0;

            while (y < this.sys.game.config.height) {
                graphics.beginPath();
                graphics.moveTo(x, y);
                graphics.lineTo(x, y + dashLength);
                graphics.strokePath();
                y += dashLength + gapLength;
            }
        }
    }

    createTurrets() {
        const cols = 12;
        const colWidth = this.sys.game.config.width / cols;
        const turretY = 100;

        this.turrets = this.physics.add.group();

        for (let i = 0; i < cols; i++) {
            const x = i * colWidth + colWidth / 2;
            const turret = this.physics.add.image(x, turretY, 'turret').setDisplaySize(50, 50);

            turret.setImmovable(true);
            turret.setData('col', i);  // Para lógica futura (qué columna defiende)

            this.turrets.add(turret);
        }
    }

    fireBullet(turret) {
        // Elegir tag aleatorio según ponderación
        const tag = this.weightedRandomTag();
        const damage = this.tagDamage[tag];
        // Crear un texto que representa la bala con la etiqueta y daño
        const bullet = this.add.text(turret.x - 15, turret.y + 25, `<${tag}>`, {
            fontSize: '20px',
            color: '#ffff00',
        });
        // Habilitar física para el texto
        this.physics.add.existing(bullet);
        bullet.body.setAllowGravity(false);
        bullet.setData('tag', tag);
        bullet.setData('damage', damage);
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setData('velocityY', 100); // Guardar velocidad personalizada
        this.bullets.add(bullet);

        // Crear emitter de partículas tipo cohete para la bala
        const rocketEmitter = this.add.particles(18, -7, 'bullet', {
            speed: { min: 10, max: 30 },
            angle: { min: 260, max: 280 },
            scale: { start: 0.15, end: 0 },
            alpha: { start: 0.7, end: 0 },
            lifespan: 400,
            quantity: 1,
            frequency: 40,
            follow: bullet
        });
        bullet.setData('rocketEmitter', rocketEmitter);
    }

    weightedRandomTag() {
        // Elige un tag según las probabilidades definidas
        const weights = this.tagWeights;
        const tags = this.htmlTags;
        let sum = 0;
        const r = Math.random();
        for (let i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (r < sum) return tags[i];
        }
        return tags[tags.length - 1]; // fallback
    }

    createZombies() {
        const cols = 12;
        const colWidth = this.sys.game.config.width / cols;
        const zombieY = 700;
        const col = Phaser.Math.Between(0, cols - 1);
        const zombieX = col * colWidth + colWidth / 2;

        const zombie = this.physics.add.image(zombieX, zombieY, 'zombie')
            .setDisplaySize(50, 50)
            .setCollideWorldBounds(true);

        zombie.body.setAllowGravity(false);
        zombie.setData('health', 5);
        zombie.setData('col', col);

        this.zombies.add(zombie);

        zombie.setVelocityY(-20);
    }

    update() {
        this.zombies.children.iterate((zombie) => {
            if (zombie.y < 120) {
                zombie.destroy();
            }
        })

        this.physics.add.overlap(this.bullets, this.zombies, (bullet, zombie) => {
            // Destruir el emitter asociado
            const emitter = bullet.getData('rocketEmitter');
            if (emitter) emitter.destroy();
            const damage = bullet.getData('damage') || 1;
            bullet.destroy();

            const health = zombie.getData('health') - damage;
            zombie.setData('health', health);

            if (health <= 0) {
                this.explosionEmitter.explode(80, zombie.x, zombie.y);
                zombie.destroy();
                this.kills += 1;
                this.killText.setText(`Zombies eliminados: ${this.kills}`);
            } else {
                zombie.setTint(Phaser.Display.Color.GetColor(255, health * 25, 0));
                this.explosionEmitter.explode(5, zombie.x, zombie.y);
            }
        }, null, this);

        // Mover manualmente los textos-bala
        this.bullets.children.iterate((bullet) => {
            if (bullet && bullet.active) {
                const velocityY = bullet.getData('velocityY') || 0;
                bullet.y += velocityY * (this.game.loop.delta / 1000);
                // Destruir si sale de la pantalla
                if (bullet.y > this.sys.game.config.height) {
                    // Destruir el emitter asociado
                    const emitter = bullet.getData('rocketEmitter');
                    if (emitter) emitter.destroy();
                    bullet.destroy();
                }
            }
        });

        this.time.addEvent({
            delay: 3000,
            callback: () => {
                if (this.zombies.getChildren().length < 10) {
                    this.createZombies();
                }
            },
            loop: true
        });

    }


}