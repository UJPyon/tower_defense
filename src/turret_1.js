const Turret1 = new Phaser.Class({
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
        const circle = new Phaser.Geom.Circle(this.x, this.y, TOWER_1_RANGE);
        graphics.strokeCircleShape(circle);
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
            this.nextTic = time + RELOAD_TIME;
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

// in the getEnemy function, we iterate through the children of the enemies group and test if the child is active, and then if the distance is less than the third parameter
// this function will use the Phaser.Math.Distance.Between to calculate the distance between two points
function getEnemy(x, y, distance) {
    const enemyUnits = enemies1.getChildren().concat(enemies2.getChildren());
    for (let i = 0; i < enemyUnits.length; i++) {
        if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance) {
            return enemyUnits[i];
        }
    }
    return false;
};

