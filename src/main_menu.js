class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    };

    preload() {
        this.load.atlas('sprites', 'assets/sprites/spritesheet.png', 'assets/sprites/spritesheet.json');
        this.load.image('bullet', 'assets/images/bullet.png');
    };

    create() {
        this.add.sprite(0, 0, 'background').setOrigin(0, 0);

        TDG.Storage.initUnset('EPT-highscore', 0);
        const highscore = TDG.Storage.get('EPT-highscore');

        const title = this.add.sprite(TDG.world.centerX, TDG.world.centerY - 50, 'title');
        title.setOrigin(0.5);

        this.input.keyboard.on('keydown', this.handleKey, this);

        this.tweens.add({ targets: title, angle: title.angle - 2, duration: 1000, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: title, angle: title.angle + 4, duration: 2000, ease: 'Sine.easeInOut', yoyo: 1, loop: -1, delay: 1000 });

        const buttonSettings = new Button(20, 20, 'button-settings', this.clickSettings, this);
        buttonSettings.setOrigin(0, 0);

        const buttonStart = new Button(TDG.world.width - 20, TDG.world.height - 20, 'button-start', this.clickStart, this);
        buttonStart.setOrigin(1, 1);

        const fontHighscore = { font: '38px ' + TDG.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 5 };
        const textHighscore = this.add.text(TDG.world.width - 30, 60, TDG.text['menu-highscore'] + highscore, fontHighscore);
        textHighscore.setOrigin(1, 0);

        buttonStart.x = TDG.world.width + buttonStart.width + 20;
        this.tweens.add({ targets: buttonStart, x: TDG.world.width - 20, duration: 500, ease: 'Back' });

        buttonSettings.y = -buttonSettings.height - 20;
        this.tweens.add({ targets: buttonSettings, y: 20, duration: 500, ease: 'Back' });

        textHighscore.y = -textHighscore.height - 30;
        this.tweens.add({ targets: textHighscore, y: 40, duration: 500, delay: 100, ease: 'Back' });

        this.cameras.main.fadeIn(250);
    };

    handleKey(e) {
        switch (e.code) {
            case 'KeyS': {
                this.clickSettings();
                break;
            }
            case 'Enter': {
                this.clickStart();
                break;
            }
            default: { }
        }
    };

    clickSettings() {
        TDG.Sfx.play('click');
        TDG.fadeOutScene('Settings', this);
    };

    clickStart() {
        TDG.Sfx.play('click');
        TDG.fadeOutScene('Story', this);
    };

}
