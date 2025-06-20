// Utilidades para torretas
export function createTurrets(scene) {
    const cols = 12;
    const colWidth = scene.sys.game.config.width / cols;
    const turretY = 140;
    scene.turrets = scene.physics.add.group();
    for (let i = 0; i < cols; i++) {
        const x = i * colWidth + colWidth / 2;
        const turret = scene.physics.add.image(x, turretY, 'turret').setDisplaySize(50, 50);
        turret.setImmovable(true);
        turret.setData('col', i);
        scene.turrets.add(turret);
    }
}
