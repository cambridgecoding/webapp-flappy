// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {


}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // set the background colour of the scene
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {

}