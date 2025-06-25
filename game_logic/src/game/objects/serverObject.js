// Clase para crear y gestionar los "servers" que las torretas defienden
export class ServerObject {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.config = config;
        this.servers = [];
    }

    createServers() {
        if (!this.scene.gridCells || this.scene.gridCells.length === 0) return;
        this.servers = [];
        for (let i = 0; i < this.scene.gridCells.length; i++) {
            const colData = this.scene.gridCells[i];
            const serverY = 30; 
            const server = this.scene.add.image(colData.x, serverY, 'server');
            server.setDisplaySize(55, 55);
            server.setData('health', this.config.health || 50);
            server.setDepth(2);
            server.setData('col', i);
            this.servers.push(server);
        }
        this.scene.servers = this.servers;
    }
}
