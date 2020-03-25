class Level2 extends Phaser.Scene {
    constructor() {
        super("playGame");
        map = [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0],
            [ 0, 0, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 0, 0,-1, 0, 0, 0, 0, 0],
            [ 0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0,-1, 0, 0, 0, 0, 0],
            [ 0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0,-1, 0, 0, 0, 0, 0],
            [ 0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1,-1,-1, 0, 0, 0, 0, 0],
            [ 0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0]
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

        path = this.add.path(0, 175);
        path.lineTo(925, 175);
        path.lineTo(925, 475);
        path.lineTo(775, 475);
        path.lineTo(775, 325);
        path.lineTo(175, 325);
        path.lineTo(175, 625);
        path.lineTo(1025, 625);
        path.lineTo(1025, 800);

        graphics.lineStyle(3, 0xffffff, 1);
        path.draw(graphics);

        enemies_1 = this.physics.add.group({
            classType: Enemy1,
            runChildUpdate: true
        });

        this.nextEnemy = 0;

        turrets = this.add.group({
            classType: Turret1,
            runChildUpdate: true
        });

        this.input.on('pointerdown', placeTurret);

        bullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true
        });

        this.physics.add.overlap(enemies_1, bullets, damageEnemy);
    }

    update(time, delta) {
        // if its time for the next enemy
        if (time > this.nextEnemy) {
            const enemy = enemies_1.get();

            enemy.startOnPath();
            this.nextEnemy = time + ENEMY_SPAWN_INTERVAL;
        }
    };
}