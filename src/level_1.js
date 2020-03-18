let graphics, path, enemies, turrets, bullets, map;

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

        enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true
        });

        this.nextEnemy = 0;

        turrets = this.add.group({
            classType: Turret1,
            runChildUpdate: true
        });
        debugger
        this.input.on('pointerdown', placeTurret);

        bullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true
        });

        this.physics.add.overlap(enemies, bullets, damageEnemy);
    }

    update(time, delta) {
        // if its time for the next enemy
        if (time > this.nextEnemy) {
            const enemy = enemies.get();

            enemy.startOnPath();
            this.nextEnemy = time + ENEMY_SPAWN_INTERVAL;
        }
    };
}