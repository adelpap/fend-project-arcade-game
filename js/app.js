
// returns the distance between two objects
function dist(a, b) {
    return Math.sqrt((a.x - b.x)**2+(a.y - b.y)**2);
}

// forces x to be in the min/max range
function clip(x, min, max) {
    return Math.min(Math.max(x, min), max);
}

// retuns a number in the range [min, max)
function sampleInRange(min, max) {
  return min + Math.random() * (max - min);
}

const spriteWidth = 101;
const spriteHeight = 171;
const tileHeight = 83;
const boardWidth = 5 * spriteWidth;
const boardHeight = 5 * tileHeight + spriteHeight;

// enemies the player must avoid
class Enemy {

    constructor(y) {
        this.sprite = 'images/enemy-bug.png';

        // velocity at which the enemy traverses the board
        this.minimumVelocity = 40;
        this.maximumVelocity = 160;
        this.v = sampleInRange(this.minimumVelocity, this.maximumVelocity);

        // x and y is the position of the enemy on the board, and parametrizes the centre of the
        // corresponding sprite.
        // randomly picks an initial x position for the enemy from a range
        // the range is wider than the board because we want the enemies to slowly appear/dissapear
        // in and out of the screen
        this.x = sampleInRange(0, boardWidth + spriteWidth) - spriteWidth / 2;
        this.y = y;
    }

    // updates the enemy's position
    // and resets it when the enemy reaches the rightmost limit (board width + half the enemy image)
    update(dt) {
        this.x += this.v * dt;
        if(this.x > boardWidth + spriteWidth / 2) {
            this.x = -spriteWidth / 2;
            this.v = sampleInRange(this.minimumVelocity, this.maximumVelocity);
        }
    }

    // draws the enemy with the center of the enemy's sprite at the x, y coordinates
    render() {
        const x = this.x - spriteWidth / 2;
        const y = this.y - spriteHeight / 2;
        ctx.drawImage(Resources.get(this.sprite), x, y);
    }
};

class Player {
    // the player needs to know the enemies' positions on the board, so we pass them to the player constructor
    constructor(enemies) {
        //the player can have different player images
        this.sprites = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'
        ];
        this.horizontalStep = spriteWidth;
        this.verticalStep = tileHeight;
        this.enemies = enemies;
        this.reset();
        this.win = false;
    }

    // resets the player to the original position at the bottom of the board and randomly chooses a player image
    reset() {
        // x and y is the position of the enemy on the board, and parametrizes the centre of the
        // corresponding sprite.
        this.x = boardWidth / 2;
        this.y = spriteHeight / 2 + 4.5 * tileHeight;
        this.sprite = this.sprites[Math.floor(sampleInRange(0, 5))];
    }

    // the player collides with an enemy if their distance is smaller than the threshold (60 pixels by default)
    hasCollided(threshold = 60) {
        for(const enemy of this.enemies) {
            if(dist(this, enemy) < threshold){
                return true;
            }
        }
        return false;
    }

    // if the player has collided with an enemy we reset it
    update() {
        if(this.hasCollided()) {
            this.reset();
        }
    }

    // draws the player with the center of the player's sprite at the x, y coordinates
    render() {
        const x = this.x - spriteWidth / 2;
        const y = this.y - spriteHeight / 2;
        ctx.drawImage(Resources.get(this.sprite), x, y);
    }

    // makes sure the player doesn't go outside the board
    clipPosition() {
        const minX = spriteWidth / 2;
        const maxX = minX + 4 * spriteWidth;
        this.x = clip(this.x, minX, maxX);
        const minY = spriteHeight / 2 - tileHeight / 2;
        const maxY = minY + 5 * tileHeight
        this.y = clip(this.y, minY, maxY);
        // the player wins the game when they reach the top of the canvas (minY)
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
        // clips the player position so they don't go outside the board
        this.clipPosition();
    }

}

// star class, to be drawn over the board, circling around the player character, when the player wins.
class Star {

    constructor(theta, player) {
        this.sprite = 'images/Star.png';
        this.spriteWidth = 101;
        this.spriteHeight = 171;

        // x and y is the position of the enemy on the board, and parametrizes the centre of the
        // corresponding sprite.
        // Initially the star is rendered outside the canvas
        this.x = -this.spriteWidth;
        this.y = -this.spriteHeight;

        // the star moves following a spiral, which we parameterize in polar coordinates (r, theta)
        // we need to track time - used to update r via a smooth exponential decay - and theta.
        this.t = 0;
        this.theta = theta;
        this.radialTau = 2;
        this.angularVelocity = 2 * Math.PI / 2;

        this.player = player;
    }

    // draws the star with the center of the star's sprite at the x, y coordinates
    render() {
        const x = this.x - this.spriteWidth / 2;
        const y = this.y - this.spriteHeight / 2;
        ctx.drawImage(Resources.get(this.sprite), x, y);
    }

    // updates the position of the star so that it moves along a spiral
    // it first updates the position in polar coordinates and then converts them to cartesian coordinates
    // the angle theta changes at a constant rate, whilst the radius smoothly goes from a max value to a min value
    // with an exponential decay
    update(dt) {
        this.t += this.radialTau * dt;
        this.theta += this.angularVelocity * dt;
        const maxRadius = boardWidth / 2;
        const minRadius = 80;
        const radius = minRadius + (maxRadius-minRadius) * Math.exp(-this.t);
        this.x = radius * Math.cos(this.theta) + player.x;
        this.y = radius * Math.sin(this.theta) + player.y;
    }

}

// instantiate enemies, player and stars
const sprite_offset = (spriteHeight / 2 - tileHeight / 2) * 1.45;
const enemy1 = new Enemy(1 * tileHeight + sprite_offset);
const enemy2 = new Enemy(2 * tileHeight + sprite_offset);
const enemy3 = new Enemy(3 * tileHeight + sprite_offset);
const allEnemies = [enemy1, enemy2, enemy3];

const player = new Player(allEnemies);

const delta_init_theta = Math.PI / 2;
const star1 = new Star(1 * delta_init_theta, player);
const star2 = new Star(2 * delta_init_theta, player);
const star3 = new Star(3 * delta_init_theta, player);
const star4 = new Star(4 * delta_init_theta, player);
const allStars = [star1, star2, star3, star4];

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
