
function dist(a, b) {
    return Math.sqrt((a.x - b.x)**2+(a.y - b.y)**2);
}

// Enemies our player must avoid
class Enemy {

    static minimumVelocity = 40;
    static maximumVelocity = 160;
    static sampleVelocity() {
        // We want a random number between min_v and max_v, so we sample a number x in [0, 1]
        // and compute min_v + x * (max_v - min_v)
        return Enemy.minimumVelocity + Math.random() * (Enemy.maximumVelocity - Enemy.minimumVelocity);
    }

    constructor(y) {
        this.y = y;
        this.sprite = 'images/enemy-bug.png';
        this.spriteWidth = 101;
        this.spriteHeight = 171;
        this.reset();
    }

    update(dt) {
        this.x += this.v * dt;
        if(this.x > 5.5 * this.spriteWidth) {
            this.reset();
        }
    }

    render() {
        const x = this.x - this.spriteWidth / 2;
        const y = this.y - this.spriteHeight / 2;
        ctx.drawImage(Resources.get(this.sprite), x, y);
    }

    reset() {
        this.x = -this.spriteWidth / 2;
        this.v = Enemy.sampleVelocity();
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
//Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
//};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {

    constructor(enemies) {
        this.sprite = 'images/char-boy.png';
        this.spriteWidth = 101;
        this.spriteHeight = 171;
        this.horizontalStep = 101;
        this.verticalStep = 83;
        this.enemies = enemies;
        this.reset();
    }

    reset() {
        this.x = 2.5 * this.spriteWidth;
        this.y = (5*83)+(83/2);
    }

    hasCollided(threshold = 60) {
        for(const enemy of this.enemies) {
            if(dist(this, enemy) <= threshold){
                return true;
            }
        }
        return false;
    }

    update(dt) {
        if(this.hasCollided()) {
            this.reset();
        }
    }

    render() {
        const x = this.x - this.spriteWidth / 2
        const y = this.y - this.spriteHeight / 2
        ctx.drawImage(Resources.get(this.sprite), x, y);
    }

    clipPosition() {
        let clip = (x, min, max) => Math.min(Math.max(x, min), max);
        const minX = this.spriteWidth / 2;
        const maxX = 4.5 * this.spriteWidth;
        const minY = -83/2 + this.spriteHeight / 2;
        const maxY = (5*83)+(83/2);
        this.x = clip(this.x, minX, maxX);
        this.y = clip(this.y, minY, maxY);
    }

    handleInput(direction) {

        switch(direction) {
            case 'left':
                this.x -= this.horizontalStep;
                break;
            case 'up':
                this.y -= this.verticalStep;
                break;
            case 'right':
                this.x += this.horizontalStep;
                break;
            case 'down':
                this.y += this.verticalStep;
                break;
        }

        this.clipPosition()
    }

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const delta = 83 * 0.75;
const enemy1 = new Enemy( 1 * 83 + delta);
const enemy2 = new Enemy( 2 * 83 + delta);
const enemy3 = new Enemy( 3 * 83 + delta);
const allEnemies = [enemy1, enemy2, enemy3];

const player = new Player(allEnemies);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
