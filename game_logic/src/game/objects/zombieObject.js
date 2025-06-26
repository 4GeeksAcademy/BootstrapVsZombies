export class ZombieObject {
    constructor(scene, health = 200) {
        this.scene = scene;
        this.health = health;
        this.zombies = scene.zombies;
    }

    createZombie(velocityY = -100, healht = 200) {
        const cols = this.scene.gridCells.length;
        const colWidth = this.scene.sys.game.config.width / cols;
        const zombieY = 600;
        const col = Phaser.Math.Between(0, cols - 1);
        const zombieX = col * colWidth + colWidth / 2;
        const zombie = this.scene.physics.add.image(zombieX, zombieY, 'zombie')
            .setDisplaySize(40, 40)
            .setCollideWorldBounds(true);
        zombie.body.setAllowGravity(false);
        zombie.setData('health', 200);
        zombie.setData('col', col);
        zombie.setData('damage', 30); // Daño que causa el zombie al colisionar
        this.zombies.add(zombie);
        zombie.setVelocityY(velocityY);

        // Crear barra de vida debajo del zombie
        const bar = this.scene.add.graphics();
        bar.setDepth(3);
        this.drawHealthBar(bar, zombie.getData('health'));
        bar.x = zombie.x - 20;
        bar.y = zombie.y + 25;
        zombie.healthBar = bar;

        // Hacer que la barra siga al zombie en cada frame
        zombie.update = () => {
            if (zombie.healthBar) {
                zombie.healthBar.x = zombie.x - 20;
                zombie.healthBar.y = zombie.y + 25;
            }
        };

        // Agregar a la lista de actualizables de la escena si existe
        if (!this.scene.zombieUpdatables) this.scene.zombieUpdatables = [];
        this.scene.zombieUpdatables.push(zombie);

        return zombie;
    }

    drawHealthBar(bar, health) {
        bar.clear();
        const percent = Phaser.Math.Clamp(health / this.health , 0, 1);
        // Barra verde (vida restante)
        bar.fillStyle(0x00ff00, 1);
        bar.fillRect(0, 0, 40 * percent, 5);
        // Barra roja (vida perdida)
        bar.fillStyle(0xff0000, 1);
        bar.fillRect(40 * percent, 0, 40 * (1 - percent), 5);
    }

    receiveDamage(zombie, amount) {
        let health = Number(zombie.getData('health'));
        health -= amount;
        zombie.setData('health', health);
        // Actualizar barra de vida
        if (zombie.healthBar) {
            this.drawHealthBar(zombie.healthBar, health);
        }
        if (health <= 0) {
            if (zombie.healthBar) zombie.healthBar.destroy();
            zombie.destroy();
        }
    }
}
