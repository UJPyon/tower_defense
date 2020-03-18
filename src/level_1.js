let graphics, path;

class Level1 extends Phaser.Scene {
    constructor() {
        super("playGame");
        this.nextEnemy = 0;
        this.graphics = null;
        this.path = null;
        this.enemies = null;
        this.turrets = null;
        this.bullets = null;
    }

    
    map = [
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

    preload() {
        this.load.atlas('sprites', 'assets/sprites/spritesheet.png', 'assets/sprites/spritesheet.json');
        this.load.image('bullet', 'assets/images/bullet.png');
    };
    
    create() {

        // here we call our drawGrid method to create a grid
        this.graphics = this.add.graphics();
        this.drawGrid(this.graphics);
    
        this.path = this.add.path(175,0);
        this.path.lineTo(175, 475);
        this.path.lineTo(475, 475);
        this.path.lineTo(475, 225);
        this.path.lineTo(925, 225);
        this.path.lineTo(925, 800);
    
        this.graphics.lineStyle(3, 0xffffff, 1);
        this.path.draw(this.graphics);
    
        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true
        });
    
        this.turrets = this.add.group({
            classType: Turret,
            runChildUpdate: true
        });
    
        this.input.on('pointerdown', placeTurret);
    
        this.bullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true
        });
    
        this.physics.add.overlap(this.enemies, this.bullets, damageEnemy);
    };
    
    update(time, delta) {
        // if it's time for the next enemy
        debugger
        if (time > this.nextEnemy) {
            debugger
            const enemy = this.enemies.get();
            enemy.startOnPath(this.path, this.enemies);
            this.nextEnemy = time + ENEMY_SPAWN_INTERVAL;
        }
        // if (enemy.hp <= 0 || enemy.follower.t >= 1) {
        //     enemy.setActive(false);
        //     enemy.setVisible(false);
        //     this.enemies.remove(enemy);
        // }
    };

    // removeEnemy(enemy) {
    //     if (enemy.follower.t >= 1) {
    //         enemy.setActive(false);
    //         enemy.setVisible(false);
    //         this.enemies.remove(enemy);
    //     }
    // };
    
    // ---------------------------------------------------------------
    // ------------------------- TEMP GRID ---------------------------
    // ---------------------------------------------------------------
    drawGrid(graphics) {
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
}