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

            turret.setImmovable(true); // No reacciona a colisiones
            turret.setData('col', i);  // Para lógica futura (qué columna defiende)

            this.turrets.add(turret);
        }
    }

    createZombies() {        
        const cols = 12;
        const colWidth = this.sys.game.config.width / cols;
        const zombieY = 700;
        const zombieX = 5 * colWidth + colWidth / 2;

        const zombie = this.physics.add.image(zombieX, zombieY, 'zombie')
            .setDisplaySize(50, 50)
            .setCollideWorldBounds(true);

        zombie.body.setAllowGravity(false);
        zombie.setTint(0x00ff00);

        this.zombies.add(zombie);

        zombie.setVelocityY(-40); 
    }

    update() {
        console.log('Update loop activo');
        this.zombies.children.iterate((zombie) => {
            if (zombie.y < 120) {
                zombie.destroy();
            }
        })
    }


}