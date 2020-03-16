const Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,

    initialize: function Bullet(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

        this.dx = 0;
        this.dy = 0;
        this.lifespan = 0;
        this.speed = Phaser.Math.GetSpeed(600, 1);
    },
    
    fire: function (x, y, angle) {
        this.setActive(true);
        this.setVisible(true);

        // bullets fire from the middle of the screen to the given x/y
        this.setPosition(x,y);

        // this will rotate the bullets as they are fired, but for now commented out b/c bullets are round
        // this.setRotation(angle);

        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);

        this.lifespan = 300;
    },

    update: function (time, delta) {
        this.lifespan -= delta;
        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);

        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
});

function addBullet(x, y, angle) {
    const bullet = bullets.get();
    if (bullet) {
        bullet.fire(x, y, angle);
    }
}

function damageEnemy(enemy, bullet) {
    // only if both enemy and bullet are alive
    if (enemy.active === true && bullet.active === true) {
        // we remove the bullet right away
        bullet.setActive(false);
        bullet.setVisible(false);

        // decrease the enemy hp with BULLET_DAMAGE
        enemy.receiveDamage(BULLET_DAMAGE);
    }
};