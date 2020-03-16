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
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    }
};

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

const ENEMY_SPEED = 1/10000;
const GRID_SIZE = 50;
const BULLET_DAMAGE = 50;
const TOWER_1_RANGE = 400;
const BULLET_TIME = 750;

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

    enemies = this.physics.add.group({
        classType: Enemy,
        runChildUpdate: true
    });

    this.nextEnemy = 0;

    turrets = this.add.group({
        classType: Turret,
        runChildUpdate: true
    });

    this.input.on('pointerdown', placeTurret);

    bullets = this.physics.add.group({
        classType: Bullet,
        runChildUpdate: true
    });

    this.physics.add.overlap(enemies, bullets, damageEnemy);
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

// ---------------------------------------------------------------
// ------------------------ ENEMY LOGIC --------------------------
// ---------------------------------------------------------------
const Enemy = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,

    initialize: function Enemy(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy');
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.hp = 100;
    },

    startOnPath: function () {
        // set the t parameter at the start of the path
        this.follower.t = 0;

        // get x and y of the given t point
        path.getPoint(this.follower.t, this.follower.vec);

        // set the x and y of our enemy to the received from the previous step
        this.setPosition(this.follower.vec.x, this.follower.vec.y);

    },

    receiveDamage: function(damage) {
        this.hp -= damage;

        // if hp drops below 0 we deactivate this enemy
        if (this.hp <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
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

// ---------------------------------------------------------------
// ----------------------- TURRET LOGIC --------------------------
// ---------------------------------------------------------------

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

    fire: function() {
        const enemy = getEnemy(this.x, this.y, TOWER_1_RANGE);
        if (enemy) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
            addBullet(this.x, this.y, angle);
            this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        }
    },

    update: function (time, delta) {
        // time to shoot
        if (time > this.nextTic) {
            this.fire();
            this.nextTic = time + BULLET_TIME;
        }
    }
});

// checks if grid spot is valid, then adds a visible turret at that coordinate when mouse is clicked
function placeTurret(pointer) {
    let i = Math.floor(pointer.y/GRID_SIZE);
    let j = Math.floor(pointer.x/GRID_SIZE);
    if (canPlaceTurret(i, j)) {
        const turret = turrets.get();
        if (turret) {
            turret.setActive(true);
            turret.setVisible(true);
            turret.place(i, j);
        }
    }
};

// returns boolean of whether turret can be placed at a grid spot
function canPlaceTurret(i, j) {
    return map[i][j] === 0;
} ;

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
// ----------------------- TURRET BULLET -------------------------
// ---------------------------------------------------------------
const Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,

    initialize: function Bullet(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

        this.dx = 0;
        this.dy = 0;
        this.lifespan = 0;
        this.speed = Phaser.Math.GetSpeed(600, 1);
    },
    
    fire: function (x, y, angle) {
        this.setActive(true);
        this.setVisible(true);

        // bullets fire from the middle of the screen to the given x/y
        this.setPosition(x,y);

        // this will rotate the bullets as they are fired, but for now commented out b/c bullets are round
        // this.setRotation(angle);

        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);

        this.lifespan = 300;
    },

    update: function (time, delta) {
        this.lifespan -= delta;
        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);

        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
});

function addBullet(x, y, angle) {
    const bullet = bullets.get();
    if (bullet) {
        bullet.fire(x, y, angle);
    }
}

// in the getEnemy function, we iterate through the children of the enemies group and test if the child is active, and then if the distance is less than the third parameter
// this function will use the Phaser.Math.Distance.Between to calculate the distance between two points
function getEnemy(x, y, distance) {
    const enemyUnits = enemies.getChildren();
    for (let i = 0; i < enemyUnits.length; i++) {
        if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance) {
            return enemyUnits[i];
        }
        return false;
    }
};

function damageEnemy(enemy, bullet) {
    // only if both enemy and bullet are alive
    if (enemy.active === true && bullet.active === true) {
        // we remove the bullet right away
        bullet.setActive(false);
        bullet.setVisible(false);

        // decrease the enemy hp with BULLET_DAMAGE
        enemy.receiveDamage(BULLET_DAMAGE);
    }
};