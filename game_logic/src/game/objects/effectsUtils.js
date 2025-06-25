// Utilidades para efectos visuales
export function handleZombieHit(scene, bullet, zombie) {
    const emitter = bullet.getData('rocketEmitter');
    if (emitter) emitter.destroy();
    const damage = bullet.getData('damage') || 1;
    bullet.destroy();
    const health = zombie.getData('health') - damage;
    zombie.setData('health', health);

    // Mostrar daño flotante
    const damageText = scene.add.text(zombie.x + 20, zombie.y - 20, `-${damage}`,
        { font: '23px Arial', fill: '#ff0000', stroke: '#fff', strokeThickness: 3 })
        .setOrigin(0.5);
    scene.tweens.add({
        targets: damageText,
        x: damageText.x + 50,
        y: damageText.y - 70,
        alpha: 0,
        duration: 1500,
        ease: 'Cubic.easeOut',
        onComplete: () => damageText.destroy()
    });

    if (health <= 0) {
        scene.explosionEmitter.explode(80, zombie.x, zombie.y);
        zombie.destroy();
        scene.kills += 1;
        scene.killText.setText(`Zombies eliminados: ${scene.kills}`);
    } else {
        zombie.setTint(Phaser.Display.Color.GetColor(255, health * 25, 0));
        scene.explosionEmitter.explode(5, zombie.x, zombie.y);
    }
}
