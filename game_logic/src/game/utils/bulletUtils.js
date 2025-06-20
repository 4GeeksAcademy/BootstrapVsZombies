// Utilidades para balas y etiquetas
export function weightedRandomTag(tags, weights) {
    let sum = 0;
    const r = Math.random();
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (r < sum) return tags[i];
    }
    return tags[tags.length - 1];
}

export function fireBullet(scene, turret, htmlTags, tagDamage, tagWeights) {
    const tag = weightedRandomTag(htmlTags, tagWeights);
    const damage = tagDamage[tag];
    const bullet = scene.add.text(turret.x - 15, turret.y + 25, `<${tag}>`, {
        fontSize: '20px',
        color: '#ffff00',
    });
    scene.physics.add.existing(bullet);
    bullet.body.setAllowGravity(false);
    bullet.setData('tag', tag);
    bullet.setData('damage', damage);
    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.setData('velocityY', 100);
    scene.bullets.add(bullet);
    const rocketEmitter = scene.add.particles(18, -7, 'bullet', {
        speed: { min: 10, max: 30 },
        angle: { min: 260, max: 280 },
        scale: { start: 0.15, end: 0 },
        alpha: { start: 0.7, end: 0 },
        lifespan: 400,
        quantity: 1,
        frequency: 40,
        follow: bullet
    });
    bullet.setData('rocketEmitter', rocketEmitter);
}
