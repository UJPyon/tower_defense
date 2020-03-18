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

const ENEMY_SPEED = 1/10000;
const GRID_SIZE = 50;
const BULLET_DAMAGE = 50;
const BULLET_SPEED = 1200;
const TOWER_1_RANGE = 200;
const RELOAD_TIME = 750;
const ENEMY_SPAWN_INTERVAL = 800;
const ENEMY_HP = 150;
let enemies = 

const map = [
    [0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0,-1, 0, 0, 0, 0, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 0, 0, 0, 0, 0],
    [0, 0, 0,-1, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0],
    [0, 0, 0,-1, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0],
    [0, 0, 0,-1, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0],
    [0, 0, 0,-1, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0],
    [0, 0, 0,-1,-1,-1,-1,-1,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0]
];

const game = new Phaser.Game(config);

// The below 2 variables are only for dev purposes to visually see the grid and travel path of enemies, comment out for final version
// let graphics;
// let path;

// function preload() {
//     this.load.atlas('sprites', 'assets/sprites/spritesheet.png', 'assets/sprites/spritesheet.json');
//     this.load.image('bullet', 'assets/images/bullet.png');
// };

// function create() {

//     // here we call our drawGrid method to create a grid
//     graphics = this.add.graphics();
//     drawGrid(graphics);

//     path = this.add.path(175,0);
//     path.lineTo(175, 475);
//     path.lineTo(475, 475);
//     path.lineTo(475, 225);
//     path.lineTo(925, 225);
//     path.lineTo(925, 800);

//     graphics.lineStyle(3, 0xffffff, 1);
//     path.draw(graphics);

//     enemies = this.physics.add.group({
//         classType: Enemy,
//         runChildUpdate: true
//     });

//     this.nextEnemy = 0;

//     turrets = this.add.group({
//         classType: Turret,
//         runChildUpdate: true
//     });

//     this.input.on('pointerdown', placeTurret);

//     bullets = this.physics.add.group({
//         classType: Bullet,
//         runChildUpdate: true
//     });

//     this.physics.add.overlap(enemies, bullets, damageEnemy);
// };

// function update(time, delta) {
//     // if its time for the next enemy
//     if (time > this.nextEnemy) {
//         const enemy = enemies.get();
//     //     const enemy = enemies.get();
//     //     if (enemy) {
//     //         enemy.setActive(true);
//     //         enemy.setVisible(true);

//     //         // place the enemy at the start of the path
//     //         enemy.startOnPath();
//     //         this.nextEnemy = time + ENEMY_SPAWN_INTERVAL;
//     //     }
//         enemy.startOnPath();
//         this.nextEnemy = time + ENEMY_SPAWN_INTERVAL;
//     }
// };

// ---------------------------------------------------------------
// ------------------------- TEMP GRID ---------------------------
// ---------------------------------------------------------------
// function drawGrid(graphics) {
//     graphics.lineStyle(1, 0x0000ff, 0.8);
//     for (let i = 0; i < 16; i++) {
//         graphics.moveTo(0, i * GRID_SIZE);
//         graphics.lineTo(1200, i * GRID_SIZE);
//     }
//     for (let j = 0; j < 24; j++) {
//         graphics.moveTo(j * GRID_SIZE, 0);
//         graphics.lineTo(j * GRID_SIZE, 800);
//     }
//     graphics.strokePath();
// };