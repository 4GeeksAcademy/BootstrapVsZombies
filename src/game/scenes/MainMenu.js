import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { FONT_VT323 } from '../config/fonts';

export class MainMenu extends Scene {
    logoTween;

    constructor() {
        super('MainMenu');
    }

    create() {

        const bg = this.add.image(0, 0, 'background').setOrigin(0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;

        this.add.text(512, 500, '4Geeks', FONT_VT323).setDepth(100).setOrigin(0.5);

        EventBus.emit('current-scene-ready', this);
        
        console.log("MainMenu: ", this.registry.get('user'))

    }

    changeScene() {
        this.scene.start('Game');
    }


}
