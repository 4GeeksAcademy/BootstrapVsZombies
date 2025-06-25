export class ZombieObject {
    constructor(scene) {
        this.scene = scene;
        this.zombies = scene.zombies;
    }

    createZombie() {
        const cols = 12;
        const colWidth = this.scene.sys.game.config.width / cols;
        const zombieY = 700;
        const col = Phaser.Math.Between(0, cols - 1);
        const zombieX = col * colWidth + colWidth / 2;
        const zombie = this.scene.physics.add.image(zombieX, zombieY, 'zombie')
            .setDisplaySize(50, 50)
            .setCollideWorldBounds(true);
        zombie.body.setAllowGravity(false);
        zombie.setData('health', 15);
        zombie.setData('col', col);
        zombie.setData('damage', 30); // Daño que causa el zombie al colisionar
        this.zombies.add(zombie);
        zombie.setVelocityY(-20);
        return zombie;
    }

    hacerDanio(zombie, cantidad) {
        // El zombie hace daño a otro objeto (por ejemplo, al jugador)
        // Aquí solo retornamos el daño que puede causar el zombie
        return zombie.getData('damage') * cantidad;
    }

    recibirDanio(zombie, cantidad) {
        // El zombie recibe daño y se actualiza su salud
        let salud = zombie.getData('health');
        salud -= cantidad;
        zombie.setData('health', salud);
        if (salud <= 0) {
            zombie.destroy();
        }
        return salud;
    }
}
