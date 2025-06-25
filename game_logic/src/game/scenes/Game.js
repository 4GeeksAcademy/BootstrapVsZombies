import Phaser from 'phaser';
import { GridObject } from '../objects/gridObject';
import { ServerObject } from '../objects/serverObject';
import { ZombieObject } from '../objects/zombieObject';
import { EventBus } from '../EventBus';

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#1c1f2b');
        this.physics.resume();

        this.grid = new GridObject(this, 12);
        this.grid.createGrid();

        this.server = new ServerObject(this);
        this.server.createServers();

        this.zombies = this.physics.add.group(); // Crea el grupo ANTES de usarlo
        this.zombieManager = new ZombieObject(this); // Instancia el manejador de zombies
        this.zombieManager.createZombie(); // Crea un zombie usando el grupo
    }

    update() {
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                if (this.zombies.getChildren().length < 10) {
                    this.zombieManager.createZombie();
                }
            },
            loop: true
        });
    }


}