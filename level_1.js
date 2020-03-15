class Level1 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        this.add.text(20, 20, "Test Playing Game", {
            font: "25px Arial",
            fill: "yellow",
        }) 
    }

    update() {

    }
}