import Phaser from 'phaser';
import { GridObject } from '../objects/gridObject';
import { ServerObject } from '../objects/serverObject';
import { ZombieObject } from '../objects/zombieObject';
import { EffectsObjects } from '../objects/effectsObject';
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

        this.server = new ServerObject(this, 100, 12, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        this.server.createServers();

        this.zombies = this.physics.add.group();
        this.zombieManager = new ZombieObject(this);
        this.zombieManager.createZombie();

        // Instanciar efectos visuales
        this.effects = new EffectsObjects(this);

        // --- COLISIÓN ZOMBIE-SERVER ---
        this.physics.add.collider(
            this.zombies,
            this.server.servers,
            (server, zombie) => {
                this.effects.bloodEmitter(zombie);
                this.effects.sparkEmitter(server);
                this.server.receiveDamage(this, server, Number(zombie.getData('damage')));
                zombie.destroy();
            },
            null,
            this
        );

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