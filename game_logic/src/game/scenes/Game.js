import Phaser from 'phaser';
import { createGrid } from '../utils/gridUtils';
import { createTurrets } from '../utils/turretUtils';
import { fireBullet } from '../utils/bulletUtils';
import { createZombies } from '../utils/zombieUtils';
import { handleZombieHit } from '../utils/effectsUtils';

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
        // Lista de etiquetas HTML para "balas"
        this.htmlTags = ['p', 'h5', 'h4', 'h3', 'h2', 'h1'];
        // Daño correspondiente a cada tag
        this.tagDamage = {
            'p': 1,
            'h5': 2.5,
            'h4': 4,
            'h3': 5,
            'h2': 10,
            'h1': 15
        };
        // Probabilidades ponderadas (más probabilidad para menor daño)
        this.tagWeights = [0.6, 0.12, 0.08, 0.8, 0.07, 0.05];
    }

    create() {
        this.cameras.main.setBackgroundColor('#1c1f2b');
        this.physics.resume();
        createGrid(this);
        createTurrets(this);
        this.zombies = this.physics.add.group();
        createZombies(this);
        this.bullets = this.physics.add.group();

        this.explosionEmitter = this.add.particles(0, 0, 'bullet', {
            speed: { min: -200, max: 200 },
            lifespan: 300,
            scale: { start: 0.4, end: 0 },
            blendMode: 'ADD',
            gravityY: 200,
            quantity: 0,
            on: false
        });
        this.explosionEmitter.setDepth(10);

        this.kills = 0;
        this.killText = this.add.text(10, 20, 'Zombies eliminados: 0', {
            fontSize: '18px',
            fill: '#ffffff'
        });


        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.turrets.children.iterate((turret) => {
                    const turretCol = turret.getData('col');
                    const zombiesInCol = this.zombies.getChildren().filter(zombie => zombie.getData('col') === turretCol);
                    if (zombiesInCol.length > 0) {
                        fireBullet(this, turret, this.htmlTags, this.tagDamage, this.tagWeights);
                    }
                });
            },
            loop: true
        });


    }

    update() {
        this.zombies.children.iterate((zombie) => {
            if (zombie.y < 120) {
                zombie.destroy();
            }
        })
        this.physics.add.overlap(this.bullets, this.zombies, (bullet, zombie) => {
            handleZombieHit(this, bullet, zombie);
        }, null, this);
        // Mover manualmente los textos-bala
        this.bullets.children.iterate((bullet) => {
            if (bullet && bullet.active) {
                const velocityY = bullet.getData('velocityY') || 0;
                bullet.y += velocityY * (this.game.loop.delta / 1000);
                // Destruir si sale de la pantalla
                if (bullet.y > this.sys.game.config.height) {
                    const emitter = bullet.getData('rocketEmitter');
                    if (emitter) emitter.destroy();
                    bullet.destroy();
                }
            }
        });
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                if (this.zombies.getChildren().length < 10) {
                    createZombies(this);
                }
            },
            loop: true
        });
    }


}