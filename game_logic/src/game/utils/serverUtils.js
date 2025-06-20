// Utilidad para crear los "servers" que las torretas defienden
export function createServers(scene) {
    if (!scene.gridCells || scene.gridCells.length === 0) return;
    scene.servers = [];
    for (let i = 0; i < scene.gridCells.length; i++) {
        const cell = scene.gridCells[i];
        // Ubica el server justo encima de la torreta (ajusta el offset si es necesario)
        const serverY = cell.y - cell.height / 2 - 24; // 24px encima de la celda
        const server = scene.add.image(cell.x, serverY, 'server');
        server.setDisplaySize(70, 70)
        server.setDepth(2);
        server.setData('col', i);
        scene.servers.push(server);
    }
}
