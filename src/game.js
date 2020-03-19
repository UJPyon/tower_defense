const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1200,
    height: 800,
    backgroundColor: 0x000000,
    scene: [Level1],
    // scene: {
    //     key: 'main',
    //     preload: preload,
    //     create: create,
    //     update: update
    // },
    // pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    }
    
};

const ENEMY_1_SPEED = 1/5000;
const ENEMY_2_SPEED = 1/8000;
const GRID_SIZE = 50;
const BULLET_DAMAGE = 50;
const BULLET_SPEED = 1800;
const TOWER_1_RANGE = 175;
const RELOAD_TIME = 250;
const ENEMY_1_SPAWN_INTERVAL = 800;
const ENEMY_2_SPAWN_INTERVAL = 800;
const ENEMY_1_HP = 150;
const ENEMY_2_HP = 250;

const game = new Phaser.Game(config);

class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    create() {
        this.add.sprite(0, 0, 'background').setOrigin(0, 0);
        this.stateStatus = null;
        this._score = 0;
        this._time = 10;
        this._gamePaused = false;
        this._runOnce = false;

        this.buttonDummy = new Button(TDG.world.centerX, TDG.world.centerY, 'clickme', this.addPoints, this, 'static');
        this.buttonDummy.setOrigin(0.5, 0.5);
        this.buttonDummy.setAlpha(0);
        this.buttonDummy.setScale(0.1);
        this.tweens.add({ targets: this.buttonDummy, alpha: 1, duration: 500, ease: 'Linear' });
        this.tweens.add({ targets: this.buttonDummy, scale: 1, duration: 500, ease: 'Back' });

        this.initUI();
        this.currentTimer = this.time.addEvent({
            delay: 1000,
            callback: function () {
                this._time--;
                this.textTime.setText(TDG.text['gameplay-timeleft'] + this._time);
                if (!this._time) {
                    this._runOnce = false;
                    this.stateStatus = 'gameover';
                }
            },
            callbackScope: this,
            loop: true
        });

        this.input.keyboard.on('keydown', this.handleKey, this);
        this.cameras.main.fadeIn(250);
        this.stateStatus = 'playing';
    }
    update() {
        switch (this.stateStatus) {
            case 'paused': {
                if (!this._runOnce) {
                    this.statePaused();
                    this._runOnce = true;
                }
                break;
            }
            case 'gameover': {
                if (!this._runOnce) {
                    this.stateGameover();
                    this._runOnce = true;
                }
                break;
            }
            case 'playing': {
                this.statePlaying();
            }
            default: {
            }
        }
    }
    handleKey(e) {
        switch (e.code) {
            case 'Enter': {
                this.addPoints();
                break;
            }
            case 'KeyP': {
                this.managePause();
                break;
            }
            case 'KeyB': {
                this.stateBack();
                break;
            }
            case 'KeyT': {
                this.stateRestart();
                break;
            }
            default: { }
        }
    }
    managePause() {
        this._gamePaused = !this._gamePaused;
        this.currentTimer.paused = !this.currentTimer.paused;
        TDG.Sfx.play('click');
        if (this._gamePaused) {
            TDG.fadeOutIn(function (self) {
                self.buttonPause.input.enabled = false;
                self.buttonDummy.input.enabled = false;
                self.stateStatus = 'paused';
                self._runOnce = false;
            }, this);
            this.screenPausedBack.x = -this.screenPausedBack.width - 20;
            this.tweens.add({ targets: this.screenPausedBack, x: 100, duration: 500, delay: 250, ease: 'Back' });
            this.screenPausedContinue.x = TDG.world.width + this.screenPausedContinue.width + 20;
            this.tweens.add({ targets: this.screenPausedContinue, x: TDG.world.width - 100, duration: 500, delay: 250, ease: 'Back' });
        }
        else {
            TDG.fadeOutIn(function (self) {
                self.buttonPause.input.enabled = true;
                self.buttonDummy.input.enabled = true;
                self._stateStatus = 'playing';
                self._runOnce = false;
            }, this);
            this.screenPausedBack.x = 100;
            this.tweens.add({ targets: this.screenPausedBack, x: -this.screenPausedBack.width - 20, duration: 500, ease: 'Back' });
            this.screenPausedContinue.x = TDG.world.width - 100;
            this.tweens.add({ targets: this.screenPausedContinue, x: TDG.world.width + this.screenPausedContinue.width + 20, duration: 500, ease: 'Back' });
        }
    }
    statePlaying() {
        if (this._time === 0) {
            this._runOnce = false;
            this.stateStatus = 'gameover';
        }
    }
    statePaused() {
        this.screenPausedGroup.toggleVisible();
    }
    stateGameover() {
        this.currentTimer.paused = !this.currentTimer.paused;
        TDG.Storage.setHighscore('EPT-highscore', this._score);
        TDG.fadeOutIn(function (self) {
            self.screenGameoverGroup.toggleVisible();
            self.buttonPause.input.enabled = false;
            self.buttonDummy.input.enabled = false;
            self.screenGameoverScore.setText(TDG.text['gameplay-score'] + self._score);
            self.gameoverScoreTween();
        }, this);
        this.screenGameoverBack.x = -this.screenGameoverBack.width - 20;
        this.tweens.add({ targets: this.screenGameoverBack, x: 100, duration: 500, delay: 250, ease: 'Back' });
        this.screenGameoverRestart.x = TDG.world.width + this.screenGameoverRestart.width + 20;
        this.tweens.add({ targets: this.screenGameoverRestart, x: TDG.world.width - 100, duration: 500, delay: 250, ease: 'Back' });
    }
    initUI() {
        this.buttonPause = new Button(20, 20, 'button-pause', this.managePause, this);
        this.buttonPause.setOrigin(0, 0);

        var fontScore = { font: '38px ' + TDG.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 5 };
        var fontScoreWhite = { font: '38px ' + TDG.text['FONT'], fill: '#000', stroke: '#ffde00', strokeThickness: 5 };
        this.textScore = this.add.text(TDG.world.width - 30, 45, TDG.text['gameplay-score'] + this._score, fontScore);
        this.textScore.setOrigin(1, 0);

        this.textScore.y = -this.textScore.height - 20;
        this.tweens.add({ targets: this.textScore, y: 45, duration: 500, delay: 100, ease: 'Back' });

        this.textTime = this.add.text(30, TDG.world.height - 30, TDG.text['gameplay-timeleft'] + this._time, fontScore);
        this.textTime.setOrigin(0, 1);

        this.textTime.y = TDG.world.height + this.textTime.height + 30;
        this.tweens.add({ targets: this.textTime, y: TDG.world.height - 30, duration: 500, ease: 'Back' });

        this.buttonPause.y = -this.buttonPause.height - 20;
        this.tweens.add({ targets: this.buttonPause, y: 20, duration: 500, ease: 'Back' });

        var fontTitle = { font: '48px ' + TDG.text['FONT'], fill: '#000', stroke: '#ffde00', strokeThickness: 10 };

        this.screenPausedGroup = this.add.group();
        this.screenPausedBg = this.add.sprite(0, 0, 'overlay');
        this.screenPausedBg.setAlpha(0.95);
        this.screenPausedBg.setOrigin(0, 0);
        this.screenPausedText = this.add.text(TDG.world.centerX, 100, TDG.text['gameplay-paused'], fontTitle);
        this.screenPausedText.setOrigin(0.5, 0);
        this.screenPausedBack = new Button(100, TDG.world.height - 100, 'button-mainmenu', this.stateBack, this);
        this.screenPausedBack.setOrigin(0, 1);
        this.screenPausedContinue = new Button(TDG.world.width - 100, TDG.world.height - 100, 'button-continue', this.managePause, this);
        this.screenPausedContinue.setOrigin(1, 1);
        this.screenPausedGroup.add(this.screenPausedBg);
        this.screenPausedGroup.add(this.screenPausedText);
        this.screenPausedGroup.add(this.screenPausedBack);
        this.screenPausedGroup.add(this.screenPausedContinue);
        this.screenPausedGroup.toggleVisible();

        this.screenGameoverGroup = this.add.group();
        this.screenGameoverBg = this.add.sprite(0, 0, 'overlay');
        this.screenGameoverBg.setAlpha(0.95);
        this.screenGameoverBg.setOrigin(0, 0);
        this.screenGameoverText = this.add.text(TDG.world.centerX, 100, TDG.text['gameplay-gameover'], fontTitle);
        this.screenGameoverText.setOrigin(0.5, 0);
        this.screenGameoverBack = new Button(100, TDG.world.height - 100, 'button-mainmenu', this.stateBack, this);
        this.screenGameoverBack.setOrigin(0, 1);
        this.screenGameoverRestart = new Button(TDG.world.width - 100, TDG.world.height - 100, 'button-restart', this.stateRestart, this);
        this.screenGameoverRestart.setOrigin(1, 1);
        this.screenGameoverScore = this.add.text(TDG.world.centerX, 300, TDG.text['gameplay-score'] + this._score, fontScoreWhite);
        this.screenGameoverScore.setOrigin(0.5, 0.5);
        this.screenGameoverGroup.add(this.screenGameoverBg);
        this.screenGameoverGroup.add(this.screenGameoverText);
        this.screenGameoverGroup.add(this.screenGameoverBack);
        this.screenGameoverGroup.add(this.screenGameoverRestart);
        this.screenGameoverGroup.add(this.screenGameoverScore);
        this.screenGameoverGroup.toggleVisible();
    }
    addPoints() {
        this._score += 10;
        this.textScore.setText(TDG.text['gameplay-score'] + this._score);

        var randX = Phaser.Math.Between(200, TDG.world.width - 200);
        var randY = Phaser.Math.Between(200, TDG.world.height - 200);
        var pointsAdded = this.add.text(randX, randY, '+10', { font: '48px ' + TDG.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 10 });
        pointsAdded.setOrigin(0.5, 0.5);
        this.tweens.add({ targets: pointsAdded, alpha: 0, y: randY - 50, duration: 1000, ease: 'Linear' });

        this.cameras.main.shake(100, 0.01, true);
    }
    stateRestart() {
        TDG.Sfx.play('click');
        TDG.fadeOutScene('Game', this);
    }
    stateBack() {
        TDG.Sfx.play('click');
        TDG.fadeOutScene('MainMenu', this);
    }
    gameoverScoreTween() {
        this.screenGameoverScore.setText(TDG.text['gameplay-score'] + '0');
        if (this._score) {
            this.pointsTween = this.tweens.addCounter({
                from: 0, to: this._score, duration: 2000, delay: 250,
                onUpdateScope: this, onCompleteScope: this,
                onUpdate: function () {
                    this.screenGameoverScore.setText(TDG.text['gameplay-score'] + Math.floor(this.pointsTween.getValue()));
                },
                onComplete: function () {
                    var emitter = this.add.particles('particle').createEmitter({
                        x: this.screenGameoverScore.x + 30,
                        y: this.screenGameoverScore.y,
                        speed: { min: -600, max: 600 },
                        angle: { min: 0, max: 360 },
                        scale: { start: 0.5, end: 3 },
                        blendMode: 'ADD',
                        active: true,
                        lifespan: 2000,
                        gravityY: 1000,
                        quantity: 250
                    });
                    emitter.explode();
                }
            });
        }
    }
};

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
// ------------------ TEMP WAVE SPAWN FUNCTION -------------------
// ---------------------------------------------------------------
function spawnNextWave() {
    currentWave += 1;
    enemyCount = 0;
}