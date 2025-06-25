// Clase para utilidades de efectos visuales
export class EffectsObjects {
    constructor(scene) {
        this.scene = scene;
    }

    handleZombieHit(bullet, zombie) {
        const emitter = bullet.getData('rocketEmitter');
        if (emitter) emitter.destroy();
        const damage = bullet.getData('damage') || 1;
        bullet.destroy();
        const health = zombie.getData('health') - damage;
        zombie.setData('health', health);

        // Mostrar daño flotante
        const damageText = this.scene.add.text(zombie.x + 20, zombie.y - 20, `-${damage}`,
            { font: '23px Arial', fill: '#ff0000', stroke: '#fff', strokeThickness: 3 })
            .setOrigin(0.5);
        this.scene.tweens.add({
            targets: damageText,
            x: damageText.x + 50,
            y: damageText.y - 70,
            alpha: 0,
            duration: 1500,
            ease: 'Cubic.easeOut',
            onComplete: () => damageText.destroy()
        });

        if (health <= 0) {
            this.scene.explosionEmitter.explode(80, zombie.x, zombie.y);
            zombie.destroy();
            this.scene.kills += 1;
            this.scene.killText.setText(`Zombies eliminados: ${this.scene.kills}`);
        } else {
            zombie.setTint(Phaser.Display.Color.GetColor(255, health * 25, 0));
            this.scene.explosionEmitter.explode(5, zombie.x, zombie.y);
        }
    }
}
