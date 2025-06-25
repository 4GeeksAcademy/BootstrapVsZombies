import { FONT_VT323 } from '../config/fonts';


export class GridObject {
    constructor(scene, cols) {
        this.scene = scene;
        this.cols = cols;
        this.colWidth = scene.sys.game.config.width / this.cols;
        this.gridCells = [];
    }

    createGrid() {
        for (let i = 0; i < this.cols; i++) {
            const x = i * this.colWidth + this.colWidth / 2;
            this.gridCells.push({ x, col: i });
            const text = this.scene.add.text(
                x,
                this.scene.sys.game.config.height - 20, (i + 1).toString(),
                FONT_VT323);
            text.setOrigin(0.5, 0.5);
        }

        const graphics = this.scene.add.graphics();
        graphics.lineStyle(1, 0xcccccc, 0.3);
        for (let i = 1; i < this.cols; i++) {
            const x = i * this.colWidth;
            const dashLength = 8;
            const gapLength = 8;
            let y = 0;
            while (y < this.scene.sys.game.config.height) {
                graphics.beginPath();
                graphics.moveTo(x, y);
                graphics.lineTo(x, y + dashLength);
                graphics.strokePath();
                y += dashLength + gapLength;
            }
        }
        // Guarda las celdas en la escena si se requiere compatibilidad
        this.scene.gridCells = this.gridCells;
    }
}
