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

    path = this.add.path(200,0);
    path.lineTo(200, 500);
    path.lineTo(450, 500);
    path.lineTo(450, 200);
    path.lineTo(900, 200);
    path.lineTo(900, 800);

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

function drawGrid(graphics) {
    graphics.lineStyle(1, 0x0000ff, 0.8);
    for (let i = 0; i < 8; i++) {
        graphics.moveTo(0, i * 64);
        graphics.lineTo(1200, i * 64);
    }
    for (let j = 0; j < 10; j++) {
        graphics.moveTo(j * 64, 0);
        graphics.lineTo(j * 64, 800);
    }
    graphics.strokePath();
};

