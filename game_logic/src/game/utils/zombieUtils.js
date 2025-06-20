// Utilidades para zombies
export function createZombies(scene) {
    const cols = 12;
    const colWidth = scene.sys.game.config.width / cols;
    const zombieY = 700;
    const col = Phaser.Math.Between(0, cols - 1);
    const zombieX = col * colWidth + colWidth / 2;
    const zombie = scene.physics.add.image(zombieX, zombieY, 'zombie')
        .setDisplaySize(50, 50)
        .setCollideWorldBounds(true);
    zombie.body.setAllowGravity(false);
    zombie.setData('health', 10);
    zombie.setData('col', col);
    scene.zombies.add(zombie);
    zombie.setVelocityY(-20);
}
