import { useRef, useState, useEffect } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './PhaserGame';
import { EventBus } from './game/EventBus';

function App() {
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

    // Estado para la jugabilidad de torretas
    const totalRows = 5; // Puedes ajustar el número de filas según el juego
    const [numTurrets, setNumTurrets] = useState(3);
    const [selectedRows, setSelectedRows] = useState([0, 1, 2]);

    useEffect(() => {
        EventBus.emit('turret-config', { numTurrets, selectedRows });
    }, [numTurrets, selectedRows]);

    const changeScene = () => {

        const scene = phaserRef.current.scene;

        if (scene) {
            scene.changeScene();
        }
    }

    const moveSprite = () => {

        const scene = phaserRef.current.scene;

        if (scene && scene.scene.key === 'MainMenu') {
            // Get the update logo position
            scene.moveLogo(({ x, y }) => {

                setSpritePosition({ x, y });

            });
        }
    }

    const addSprite = () => {

        const scene = phaserRef.current.scene;

        if (scene) {
            // Add more stars
            const x = Phaser.Math.Between(64, scene.scale.width - 64);
            const y = Phaser.Math.Between(64, scene.scale.height - 64);

            //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
            const star = scene.add.sprite(x, y, 'star');

            //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
            //  You could, of course, do this from within the Phaser Scene code, but this is just an example
            //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
            scene.add.tween({
                targets: star,
                duration: 500 + Math.random() * 1000,
                alpha: 0,
                yoyo: true,
                repeat: -1
            });
        }
    }

    // Manejar cambio en el número de torretas
    const handleNumTurretsChange = (e) => {
        const value = Math.max(1, Math.min(totalRows, parseInt(e.target.value) || 1));
        setNumTurrets(value);
        // Ajustar filas seleccionadas si es necesario
        setSelectedRows((prev) => {
            if (value > prev.length) {
                // Agregar filas por defecto
                const extra = Array.from({ length: value - prev.length }, (_, i) => {
                    let next = 0;
                    while (prev.includes(next)) next++;
                    return next;
                });
                return [...prev, ...extra].slice(0, totalRows);
            } else {
                return prev.slice(0, value);
            }
        });
    };

    // Manejar selección de filas
    const handleRowToggle = (row) => {
        setSelectedRows((prev) => {
            if (prev.includes(row)) {
                // No permitir menos de 1 fila
                if (prev.length === 1) return prev;
                return prev.filter(r => r !== row);
            } else {
                if (prev.length < numTurrets) {
                    return [...prev, row];
                } else {
                    // Reemplazar el primero
                    return [row, ...prev.slice(1)];
                }
            }
        });
    };

    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {

        setCanMoveSprite(scene.scene.key !== 'MainMenu');

    }

    return (
        <div id="app">
            {/* Controles de torretas */}

            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div>
                <div>
                    <button className="button" onClick={changeScene}>Reset Scene</button>
                </div>
                <div style={{ marginBottom: '1em', padding: '1em', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h3>Configuración de torretas</h3>
                    <label>
                        Número de torretas:
                        <input
                            type="number"
                            min={1}
                            max={totalRows}
                            value={numTurrets}
                            onChange={handleNumTurretsChange}
                            style={{ marginLeft: '0.5em', width: '3em' }}
                        />
                    </label>
                    <div style={{ marginTop: '0.5em' }}>
                        <span>Filas seleccionadas:</span>
                        {Array.from({ length: totalRows }, (_, i) => (
                            <label key={i} style={{ marginLeft: '1em' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(i)}
                                    disabled={
                                        !selectedRows.includes(i) && selectedRows.length >= numTurrets
                                    }
                                    onChange={() => handleRowToggle(i)}
                                />
                                Fila {i + 1}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
