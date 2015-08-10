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
var score = 0;
var labelScore;
var player;
var pipes = [];

function preload() {
    game.load.image("playerIMG", "../assets/burger2.gif");
game.load.audio("score", "../assets/point.ogg");
game.load.image("pipe","../assets/pipe.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // set the background colour of the scene
    game.stage.setBackgroundColor("#99CCFF");
    game.add.text(250, 20, "Welcome to my game", {font: "30px Segoe UI Semibold", fill: "#FFFFFF"});

        var burger = game.add.sprite(10, 270, "playerIMG");
        burger.scale.setTo(0.05, 0.05);


        var burger = game.add.sprite(10, 40, "playerIMG");
        burger.scale.setTo(0.05, 0.05);


        var burger = game.add.sprite(700, 40, "playerIMG");
        burger.scale.setTo(0.05, 0.05);

        var burger = game.add.sprite(700, 270, "playerIMG");
        burger.scale.setTo(0.05, 0.05);


    game.input
            .onDown
            .add(clickHandler);
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);
    alert(score);
    generatePipe();

labelScore = game.add.text(20, 20, "0");

   var burger = player = game.add.sprite(100, 200, "playerIMG");
    burger.scale.setTo(0.05, 0.05);
    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        .onDown.add(moveRight);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        .onDown.add(moveLeft);
    game.input.keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(moveUp);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(moveDown);
}
function clickHandler(event){
    alert("click!");
    alert("The position is: " + event.x + "," + event.y);
    var burger = game.add.sprite(event.x, event.y, "playerIMG");
    burger.scale.setTo(0.05, 0.05);
}
function spaceHandler(){
  game.sound.play("score");
}

function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());
}
function moveRight() {
    player.x = player.x + 10
}
function moveLeft() {
    player.x = player.x - 10
}
function moveUp() {
    player.y = player.y - 10
}
function moveDown() {
    player.y = player.y + 10
}

function generatePipe() {
        var gapStart = game.rnd.integerInRange(1, 5);
        for (var count=0; count<8; count=count+1) {
            if(count != gapStart && count != gapStart + 1) {
                addPipeBlock(40, count*50);
            }
        }
    }
function addPipeBlock(x, y) {
    // create a new pipe block
    var block = game.add.sprite(x,y,"pipe");
    // insert it in the 'pipes' array
    pipes.push(block);
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
}