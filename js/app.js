
// returns the distance between two objects
function dist(a, b) {
    return Math.sqrt((a.x - b.x)**2+(a.y - b.y)**2);
}

// returns x between min and max values
function clip(x, min, max) {
    return Math.min(Math.max(x,min), max);
}

// enemies our player must avoid
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

 class Player {

    constructor(enemies) {
        this.sprite = 'images/char-boy.png';
        this.spriteWidth = 101;
        this.spriteHeight = 171;
        this.horizontalStep = 101;
        this.verticalStep = 83;
        this.enemies = enemies;
        this.reset();
        this.win = false;
    }

    // resets the player to the original position
    reset() {
        this.x = 2.5 * this.spriteWidth;
        this.y = (5 * 83) +  (83 / 2);
    }

    // checks if the player has collided with an enemy
    hasCollided(threshold = 60) {
        for(const enemy of this.enemies) {
            if(dist(this, enemy) <= threshold){
                return true;
            }
        }
        return false;
    }

    // if the player has collided with an enemy reset the player
    update() {
        if(this.hasCollided()) {
            this.reset();
        }
    }

    // draws the player
    render() {
        const x = this.x - this.spriteWidth / 2;
        const y = this.y - this.spriteHeight / 2;
        ctx.drawImage(Resources.get(this.sprite), x, y);
    }

    // makes sure the player doesn't go outside the canvas
    clipPosition() {
        // min and max x values
        const minX = this.spriteWidth / 2;
        const maxX = 4.5 * this.spriteWidth;
        // min and max y values
        const minY = -83 / 2 + this.spriteHeight / 2;
        const maxY = (5 * 83)+(83 / 2);
        // keeps x and y between their min and max values
        this.x = clip(this.x, minX, maxX);
        this.y = clip(this.y, minY, maxY);

        if(this.y == minY) {
            this.win = true;
        }
    }

    // takes the pressed keys and moves the player accordingly
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
        // clips the player position not to go outside the canvas
        this.clipPosition();
    }

}

// winning star class
class Star {

    constructor(x, y) {
        this.sprite = 'images/Star.png';
        this.x = x;
        this.y = y;
        this.v = 150;
        this.spriteWidth = 101;
        this.spriteHeight = 171;
    }

    render() {
        const x = this.x - this.spriteWidth;
        const y = this.y - this.spriteHeight / 2;
        ctx.drawImage(Resources.get(this.sprite), x, y);
    }

    // makes sure the star stops in the middle of the canvas
    clipPosition() {
        // min and max x values
        const minX = this.spriteWidth / 2;
        const maxX = 3 * this.spriteWidth;
        // min and max y values
        const minY = -83 / 2 + this.spriteHeight / 2;
        const maxY = (3 * 83)+(83 / 2);
        // keeps x and y between their min and max values
        this.x = clip(this.x, minX, maxX);
        this.y = clip(this.y, minY, maxY);
    }

    update(dt) {

        this.y += this.v * dt;
        this.x += this.v * dt;
        this.clipPosition();
    }

}

// initialise enemies and player
const delta = 83 * 0.75;
const enemy1 = new Enemy( 1 * 83 + delta);
const enemy2 = new Enemy( 2 * 83 + delta);
const enemy3 = new Enemy( 3 * 83 + delta);
const allEnemies = [enemy1, enemy2, enemy3];

const player = new Player(allEnemies);

const star =  new Star(0,0);

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
