export class ZombieObject {
    constructor(scene) {
        this.scene = scene;
        this.zombies = scene.zombies;
    }

    createZombie(velocityY = -100) {
        const cols = this.scene.gridCells.length;
        const colWidth = this.scene.sys.game.config.width / cols;
        const zombieY = 600;
        const col = Phaser.Math.Between(0, cols - 1);
        const zombieX = col * colWidth + colWidth / 2;
        const zombie = this.scene.physics.add.image(zombieX, zombieY, 'zombie')
            .setDisplaySize(40, 40)
            .setCollideWorldBounds(true);
        zombie.body.setAllowGravity(false);
        zombie.setData('health', 15);
        zombie.setData('col', col);
        zombie.setData('damage', 30); // Daño que causa el zombie al colisionar
        this.zombies.add(zombie);
        zombie.setVelocityY(velocityY);
        return zombie;
    }

    receiveDamage(zombie, amount) {
        let health = Number(zombie.getData('health'));
        health -= amount;
        zombie.setData('health', health);
        if (health <= 0) {
            zombie.destroy();
        }
    }
}
