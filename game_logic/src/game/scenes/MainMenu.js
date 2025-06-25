import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { FONT_VT323 } from '../config/fonts';

export class MainMenu extends Scene {
    logoTween;

    constructor() {
        super('MainMenu');
    }

    create() {
        // Agrega la imagen de fondo y la ajusta al tamaño de la escena
        const bg = this.add.image(0, 0, 'background').setOrigin(0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;

        this.add.text(512, 500, '4Geeks', FONT_VT323).setDepth(100).setOrigin(0.5);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene() {
        this.scene.start('Game');
    }


}
