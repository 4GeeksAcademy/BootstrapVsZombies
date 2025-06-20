// Utilidad para crear los "servers" que las torretas defienden
export function createServers(scene) {
    if (!scene.gridCells || scene.gridCells.length === 0) return;
    scene.servers = [];
    for (let i = 0; i < scene.gridCells.length; i++) {
        const colData = scene.gridCells[i];
        // Renderiza el server en la posición x de la columna, con un y fijo
        const serverY = 70; // 100 es defenseY, 64 es rowHeight
        const server = scene.add.image(colData.x, serverY, 'server');
        server.setDisplaySize(70, 70);
        server.setDepth(2);
        server.setData('col', i);
        scene.servers.push(server);
    }
}
