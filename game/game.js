const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1200,
    height: 800,
    backgroundColor: 0x000000,
    scene: [Level1],
    // scene: {
    //     key: 'main',
    //     preload: preload,
    //     create: create,
    //     update: update
    // },
    // pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    }
};

const ENEMY_1_SPEED = 1/5000;
const ENEMY_2_SPEED = 1/8000;
const GRID_SIZE = 50;
const BULLET_DAMAGE = 50;
const BULLET_SPEED = 1800;
const TOWER_1_RANGE = 175;
const RELOAD_TIME = 250;
const ENEMY_1_SPAWN_INTERVAL = 800;
const ENEMY_2_SPAWN_INTERVAL = 800;
const ENEMY_1_HP = 150;
const ENEMY_2_HP = 250;

const game = new Phaser.Game(config);

// ---------------------------------------------------------------
// ------------------------- TEMP GRID ---------------------------
// ---------------------------------------------------------------
function drawGrid(graphics) {
    graphics.lineStyle(1, 0x0000ff, 0.8);
    for (let i = 0; i < 16; i++) {
        graphics.moveTo(0, i * GRID_SIZE);
        graphics.lineTo(1200, i * GRID_SIZE);
    }
    for (let j = 0; j < 24; j++) {
        graphics.moveTo(j * GRID_SIZE, 0);
        graphics.lineTo(j * GRID_SIZE, 800);
    }
    graphics.strokePath();
};

// ---------------------------------------------------------------
// ------------------ TEMP WAVE SPAWN FUNCTION -------------------
// ---------------------------------------------------------------
function spawnNextWave() {
    currentWave += 1;
    enemyCount = 0;
}