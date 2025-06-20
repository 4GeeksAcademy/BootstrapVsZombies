// Utilidades para la cuadrícula
export function createGrid(scene) {
    const cols = 12;
    const rowHeight = 64;
    const colWidth = scene.sys.game.config.width / cols;
    const defenseY = 100;
    scene.gridCells = [];
    for (let i = 0; i < cols; i++) {
        const x = i * colWidth + colWidth / 2;
        const cell = scene.add.rectangle(x, defenseY, colWidth - 4, rowHeight - 4, 0x4db8ff, 0.2);
        cell.setStrokeStyle(2, 0xcccccc, 0.4);
        cell.setData('col', i);
        scene.gridCells.push(cell);
    }
    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0xcccccc, 0.3);
    for (let i = 1; i < cols; i++) {
        const x = i * colWidth;
        const dashLength = 8;
        const gapLength = 8;
        let y = 0;
        while (y < scene.sys.game.config.height) {
            graphics.beginPath();
            graphics.moveTo(x, y);
            graphics.lineTo(x, y + dashLength);
            graphics.strokePath();
            y += dashLength + gapLength;
        }
    }
}
