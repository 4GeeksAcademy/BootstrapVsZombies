import Phaser from 'phaser';
import { GridObject } from '../objects/gridObject';
import { ServerObject } from '../objects/serverObject';
import { ZombieObject } from '../objects/zombieObject';
import { EffectsObjects } from '../objects/effectsObject';
import { TurretObject } from '../objects/turretObject';
import { EventBus } from '../EventBus';
import { BulletObject } from '../objects/bulletObject';

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#1c1f2b');
        this.physics.resume();

        this.grid = new GridObject(this, 8);
        this.grid.createGrid();

        this.server = new ServerObject(this, 100, 8, [1, 2, 3, 4, 5, 6, 7, 8]);
        this.server.createServers();

        this.zombies = this.physics.add.group();
        this.zombieManager = new ZombieObject(this);
        this.zombieManager.createZombie();

        this.turret = new TurretObject(this, 100, 8, [1, 2, 3, 4, 5, 6, 7, 8])
        this.turret.createTurrets();

        this.bulletManager = new BulletObject(this);

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
        // --- COLISIÓN ZOMBIE-TURRET ---
        this.physics.add.collider(
            this.zombies,
            this.turret.turrets,
            (turret, zombie) => {
                this.effects.bloodEmitter(zombie, 0, -15);
                this.effects.explosionFireEmitter(turret);
                this.turret.receiveDamage(this, turret, Number(zombie.getData('damage')));
                zombie.destroy();
            },
            null,
            this
        );

        // --- DISPARO AUTOMÁTICO DE TORRETAS ---
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.turret.turrets.forEach((turret) => {
                    const turretCol = turret.getData('col');
                    const zombiesInCol = this.zombies.getChildren().filter(zombie => zombie.getData('col') === turretCol);
                    if (zombiesInCol.length > 0) {
                        this.bulletManager.fireBullet(turret);
                    }
                });
            },
            loop: true
        });

        // --- COLISIÓN BALA-ZOMBIE ---
        this.physics.add.overlap(this.bulletManager.bullets, this.zombies, (bullet, zombie) => {
            const damage = bullet.getData('damage') || 10;
            this.zombieManager.receiveDamage(zombie, damage);
            this.effects.bloodEmitter(zombie, 0, -10);
            const emitter = bullet.getData('rocketEmitter');
            if (emitter) emitter.destroy();
            bullet.destroy();
        }, null, this);
    }

    update() {

        this.time.addEvent({
            delay: 3000,
            callback: () => {
                if (this.zombies.getChildren().length < 10) {
                    this.zombieManager.createZombie(-100);
                }
            },
            loop: true
        });
        // Mover y destruir balas fuera de pantalla
        this.bulletManager.bullets.children.iterate((bullet) => {
            if (bullet && bullet.active) {
                if (bullet.y > this.sys.game.config.height) {
                    const emitter = bullet.getData('rocketEmitter');
                    if (emitter) emitter.destroy();
                    bullet.destroy();
                }
            }
        });
    }


}