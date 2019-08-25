# Classic Arcade Game Clone Project

Clone of the classic arcade game frogger for FEND.


## How to play the game

The game can be played on the browser.

The player's objective is to reach the water at the top of the screen avoiding any enemies. If an enemy touches the player then the game restarts.

The player can move with the Up / Down / Right / Left arrows and cannot move outside the tiles. The enemies move independently with various velocities on the stone tiles.

## Usage

The project consists of these files:

`engine.js` - This file provides the game loop functionality (update entities and render), draws the initial game board on the screen, and then calls the update and render methods on the player and enemy objects. It uses the canvas API to draw the objects.

`resources.js` - An image loading utility.

`app.js` - This file implements the Enemy, Player and Star classes and their functionality.