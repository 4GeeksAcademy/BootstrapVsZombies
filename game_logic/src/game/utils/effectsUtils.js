// Utilidades para efectos visuales
export function handleZombieHit(scene, bullet, zombie) {
    const emitter = bullet.getData('rocketEmitter');
    if (emitter) emitter.destroy();
    const damage = bullet.getData('damage') || 1;
    bullet.destroy();
    const health = zombie.getData('health') - damage;
    zombie.setData('health', health);
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
