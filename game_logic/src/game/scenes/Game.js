import Phaser from 'phaser';

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#1c1f2b');
        this.physics.resume();
        this.createGrid();
        this.createTurrets();
        this.zombies = this.physics.add.group();
        this.createZombies();
        this.bullets = this.physics.add.group();

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
        const bullet = this.bullets.create(turret.x, turret.y, 'bullet');

        bullet.setDisplaySize(10, 20)
            .setTint(0xffff00)
            .setVelocityY(100)
            .setActive(true)
            .setVisible(true)
            .body.setAllowGravity(false);
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
            bullet.destroy();

            const health = zombie.getData('health') - 1;
            zombie.setData('health', health);

            if (health <= 0) {
                zombie.destroy();
            } else {
                zombie.setTint(Phaser.Display.Color.GetColor(255, health * 25, 0));
            }
        }, null, this);

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