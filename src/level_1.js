let graphics, path, enemies1, enemies2, turrets, bullets, map;
let enemyCount = 0;

class Level1 extends Phaser.Scene {
    constructor() {
        super("playGame");
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
    };

    preload() {
        this.load.atlas('sprites', 'assets/sprites/spritesheet.png', 'assets/sprites/spritesheet.json');
        this.load.image('bullet', 'assets/images/bullet.png');
    };

    create() {
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

        enemies1 = this.physics.add.group({
            classType: Enemy1,
            runChildUpdate: true
        });

        enemies2 = this.physics.add.group({
            classType: Enemy2,
            runChildUpdate: true
        });

        this.nextEnemy1 = 0;
        this.nextEnemy2 = 0;

        turrets = this.add.group({
            classType: Turret1,
            runChildUpdate: true
        });

        this.input.on('pointerdown', placeTurret);

        bullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true
        });

        this.physics.add.overlap(enemies1, bullets, damageEnemy);
        this.physics.add.overlap(enemies2, bullets, damageEnemy);
    }

    update(time, delta) {
        // if its time for the next enemy
        if (time > this.nextEnemy1 && enemyCount < 30) {
            const enemy1 = enemies1.get();

            enemy1.startOnPath();
            this.nextEnemy1 = time + ENEMY_1_SPAWN_INTERVAL;
            
            enemyCount += 1;
        }

        if (time > this.nextEnemy2 && enemyCount < 30) {
            const enemy2 = enemies2.get();

            enemy2.startOnPath();
            this.nextEnemy2 = time + ENEMY_2_SPAWN_INTERVAL;
            
            enemyCount += 1;
        }

        // while (enemyCount < 30) {
        //     this.spawnWave1(time);
        //     this.spawnWave2(time);
        // }
    };
}