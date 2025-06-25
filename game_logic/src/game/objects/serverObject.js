// Clase para crear y gestionar los "servers" que las torretas defienden
export class ServerObject {
    constructor(scene, health = 50) {
        this.scene = scene;
        this.health = health;
        this.servers = [];
    }

    createServers() {
        if (!this.scene.gridCells || this.scene.gridCells.length === 0) return;
        this.servers = [];
        for (let i = 0; i < this.scene.gridCells.length; i++) {
            const colData = this.scene.gridCells[i];
            const serverY = 40; 
            const server = this.scene.add.image(colData.x, serverY, 'server');
            server.setDisplaySize(55, 55);
            server.setData('health', this.health);
            server.setDepth(2);
            server.setData('col', i);
            // Crear barra de vida
            const barBg = this.scene.add.graphics();
            barBg.fillStyle(0x222222, 1);
            barBg.fillRect(server.x - 27, server.y -37, 54, 8);
            barBg.setDepth(3);
            const bar = this.scene.add.graphics();
            bar.setDepth(4);
            this.drawHealthBar(bar, server.getData('health'));
            bar.x = server.x - 27;
            bar.y = server.y - 37;
            server.healthBar = bar;
            server.healthBarBg = barBg;
            this.servers.push(server);
        }
        this.scene.servers = this.servers;
    }

    drawHealthBar(bar, health) {
        bar.clear();
        const percent = Phaser.Math.Clamp(health / this.health, 0, 1);
        bar.fillStyle(0x00ff00, 1);
        bar.fillRect(0, 0, 54 * percent, 8);
        if (percent < 0.4) {
            bar.fillStyle(0xff0000, 1);
            bar.fillRect(54 * percent, 0, 54 * (1 - percent), 8);
        }
    }

    receiveDamage(server, amount) {
        let health = server.getData('health');
        health -= amount;
        server.setData('health', health);
        // Actualizar barra de vida
        if (server.healthBar) {
            this.drawHealthBar(server.healthBar, health);
        }
        if (health <= 0) {
            this.destroyServer(server);
        }
    }

    destroyServer(server) {
        if (server.healthBar) server.healthBar.destroy();
        if (server.healthBarBg) server.healthBarBg.destroy();
        server.destroy();
        this.servers = this.servers.filter(s => s !== server);
        this.scene.servers = this.servers;
    }
}
