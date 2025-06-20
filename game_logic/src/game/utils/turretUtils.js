// Utilidades para torretas
export function createTurrets(scene, config = {}) {
    const cols = 12;
    const colWidth = scene.sys.game.config.width / cols;
    const turretY = 140;
    scene.turrets = scene.physics.add.group();
    // Si config.cols está definido, solo renderizar en esas columnas
    const colsToRender = Array.isArray(config.cols) ? config.cols : Array.from({length: cols}, (_, i) => i);
    for (let i = 0; i < cols; i++) {
        if (!colsToRender.includes(i)) continue;
        const x = i * colWidth + colWidth / 2;
        const turret = scene.physics.add.image(x, turretY, 'turret').setDisplaySize(50, 50);
        turret.setImmovable(true);
        turret.setData('col', i);
        turret.setData('health', config.health || 100); 
        scene.turrets.add(turret);
    }
}
