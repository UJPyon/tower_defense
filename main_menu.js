class MainMenu extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        this.load.atlas('sprites', 'assets/sprites/spritesheet.png', 'assets/sprites/spritesheet.json');
        this.load.image('bullet', 'assets/images/bullet.png');
    }

    create() {
        
    }

}