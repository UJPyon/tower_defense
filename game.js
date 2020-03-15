const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1200,
    height: 800,
    backgroundColor: 0x000000,
    // scene: [Scene1, Scene2],
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    },
    // pixelArt: true,
    // physics: {
    //     default: "arcade",
    //     arcade: {
    //         debug: false
    //     }
    // }
};

const game = new Phaser.Game(config);

const ENEMY_SPEED = 1/10000;
const GRID_SIZE = 50;

let graphics;
let path;

function preload() {
    this.load.atlas('sprites', 'assets/sprites/spritesheet.png', 'assets/sprites/spritesheet.json');
    this.load.image('bullet', 'assets/images/bullet.png');
};

function create() {

    // here we call our drawGrid method to create a grid
    graphics = this.add.graphics();
    drawGrid(graphics);

    path = this.add.path(175,0);
    path.lineTo(175, 475);
    path.lineTo(475, 475);
    path.lineTo(475, 225);
    path.lineTo(925, 225);
    path.lineTo(925, 800);

    graphics.lineStyle(3, 0xffffff, 1);
    path.draw(graphics);

    enemies = this.add.group({
        classType: Enemy,
        runChildUpdate: true
    });

    this.nextEnemy = 0;
};

function update(time, delta) {
    // if its time for the next enemy
    if (time > this.nextEnemy) {
        const enemy = enemies.get();
        if (enemy) {
            enemy.setActive(true);
            enemy.setVisible(true);

            // place the enemy at the start of the path
            enemy.startOnPath();
            this.nextEnemy = time + 2000;
        }
    }
};

const Enemy = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize: function Enemy(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy');
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    },
    startOnPath: function () {
        // set the t parameter at the start of the path
        this.follower.t = 0;

        // get x and y of the given t point
        path.getPoint(this.follower.t, this.follower.vec);

        // set the x and y of our enemy to the received from the previous step
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
    },

    update: function (time, delta) {
        // move the t point along the path, 0 is the start and 0 is the end
        this.follower.t += ENEMY_SPEED * delta;

        // get the new x and y coordinates in vec
        path.getPoint(this.follower.t, this.follower.vec);

        // update enemy x and y to the newly obtained x and y
        this.setPosition(this.follower.vec.x, this.follower.vec.y);

        // if we have reached the end of the path, remove the enemy
        if (this.follower.t >= 1) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
});

const Turret = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize: function Turret(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turret');
        this.nextTic = 0;
    },

    // turrets will be placed according to the grid
    place: function (i, j) {
        this.y = i * GRID_SIZE + GRID_SIZE/2;
        this.x = j * GRID_SIZE + GRID_SIZE/2;
        map[i][j] = 1;
    },
    update: function (time, delta) {
        // time to shoot
        if (time > this.nextTic) {
            this.nextTic = time + 1000;
        }
    }
});

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

