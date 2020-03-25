const GameMenu = function () { };

GameMenu.prototype = {

    init: function () {
        this.titleText = game.make.text(game.world.centerX, 100, "Game Title", {
            font: 'bold 60pt TheMinion',
            fill: '#FDFFB5',
            align: 'center'
        });
        this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.titleText.anchor.set(0.5);
        this.optionCount = 1;
    },

    preload: function () {
        
    },

    create: function () {
        game.add.sprite(0, 0, 'menu-bg');
        game.add.existing(this.titleText);
        game.stage.disableVisibilityChange = true;
        
        this.addMenuOption('Start', function () {
            console.log('You clicked Start!');
        });
        this.addMenuOption('Options', function () {
            console.log('You clicked Options!');
        });
        this.addMenuOption('Credits', function () {
            console.log('You clicked Credits!');
        });
    },

    addMenuOption: function (text, callback) {
        var txt = game.add.text(30, (this.optionCount * 80) + 200, text, style.navitem.default);
        txt.inputEnabled = true;
        txt.events.onInputUp.add(callback);
        txt.events.onInputOver.add(function (target) {
            target.setStyle(style.navitem.hover);
        });
        txt.events.onInputOut.add(function (target) {
            target.setStyle(style.navitem.default);
        });
        this.optionCount++;
    },
};