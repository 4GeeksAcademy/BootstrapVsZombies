// Utilidades para la cuadrícula
export function createGrid(scene) {
    const cols = 12;
    const rowHeight = 64;
    const colWidth = scene.sys.game.config.width / cols;
    const defenseY = 100;
    scene.gridCells = [];
    for (let i = 0; i < cols; i++) {
        const x = i * colWidth + colWidth / 2;
        // Ya no se crea el rectángulo de celda
        // Solo se guarda la posición x de la columna
        scene.gridCells.push({ x, col: i });
        // Agrega el número de columna en la parte inferior
        const text = scene.add.text(x, scene.sys.game.config.height - 20, (i + 1).toString(), {
            font: '18px Arial',
            color: '#cccccc',
            align: 'center'
        });
        text.setOrigin(0.5, 0.5);
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
