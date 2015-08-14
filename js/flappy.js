// the Game object used by the phaser.io library
var stateActions = {preload: preload, create: create, update: update};
var score = -1;
var player;
var pipes = [];
var labelScore;
var pipeInterval = 1.75;
var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 650;
var jumpPower = 200;
var gapSize = 100;
var gapMargin = 50;
var blockHeight = 60;
var started = false;
var balloons = [];
var weight = [];
var mor = [];
var splashDisplay;
var openText;


$.get("/score", function(scores){
    //console.log("Data :",scores);
    var scores = JSON.parse(data);
    for (var i = 0; i < scores.length; i++) {
        $("#scoreBoard").append("<li>" + scores[i].name + ": " +
        scores[i].score + "</li>");

    }
});

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

function start() {
    started = true;
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);
    splashDisplay.destroy();
    game.physics.startSystem(Phaser.Physics.ARCADE);
// set the background colour of the scene
//game.stage.setBackgroundColor("#000000");
    var background = game.add.image(0, 0, "backgroundImg");
    background.width = 790;
    background.height = 400;


    openText = game.add.text(175, 20, "The Game is on!",
        {font: "50px Reprise Stamp ", fill: "#FFFFFF"});
    player = game.add.sprite(40, 200, "playerImg");
    player.width = 75;
    player.height = 70;
    game.physics.arcade.enable(player);
    player.anchor.setTo(0.5, 0.5);

    player.body.velocity.x = 0;
    player.body.gravity.y = gameGravity;
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);


// game.input.onDown.add(clickHandler);

//  game.input
//    .keyboard.addkey(Phaser.Keyboard.SPACEBAR)
//  .onDown.add(spaceHandler)
    labelScore = game.add.text(20, 60, "0",
        {font: "30px Arial", fill: "#FF0000"});

//alert(score);

    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        .onDown.add(moveRight);

    game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        .onDown.add(moveLeft);

    game.input.keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(moveUp);

    game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(moveDown);


    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
        // generatePipe);
        generate);


}
jQuery("#greeting-form").on("submit", function (event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var email = jQuery("#email").val();
    var score = jQuery("#score").val();
    var greeting_message = greeting + name + " (" + email + ")";
    var score_message = "Your score is: " + score;
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + "</p>" + "<p>" + score_message + "</p>");


});

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("playerImg", "../assets/Sherlock2.png");
    game.load.image("backgroundImg", "../assets/Wallpaper.jpg");
    game.load.image("pipe", "../assets/door.jpg");
    game.load.image("john", "../assets/John.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("balloons", "../assets/smokingp.jpg");
    game.load.image("weight", "../assets/mag.jpg");
    game.load.image("mor", "../assets/mor2.png");
    game.load.image("logo", "../assets/opening.png");
    game.load.audio("splash", "../assets/splashdisplay.mp3");
    game.load.audio("gameaudio", "../assets/gameWAV.wav");
}

function playerJump() {
    player.body.velocity.y = -200;
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {


    //var splashDisplay = game.add.image(0, 0, "logo");
    //splashDisplay.width = 790;
    //splashDisplay.height = 400;

    //splashDisplay = game.sound.play("splash");
    splashDisplay = game.add.image(0, 0, "logo");
    splashDisplay.width = 790;
    splashDisplay.height = 400;
    splashDisplay = game.add.text(250, 50, "Don't be an Anderson...", {fill:"white"});
    splashDisplay = game.add.text(100, 100, "Press ENTER to start, SPACEBAR to jump! ", {fill: "#006B8F"});
    splashDisplay = game.add.text(420, 150, "Beware of Moriarty!", {fill: "#006B8F"});

    game.input.keyboard
        .addKey(Phaser.Keyboard.ENTER)
        .onDown.add(start);

    game.sound.play("gameaudio");
}


function clickHandler(event) {
    game.add.sprite(event.x, event.y, "john");
}

function spaceHandler() {
    game.sound.play("score");
}

function changeScore(scoreChange) {
    score = score + scoreChange;
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
    // for(var count=0; count<8; count+=1){
    //   game.add.sprite(20, 50 * count, "pipe")
    // game.add.sprite(150, 50 * count, "pipe")
//}
// for(var count=2; count<10; count+=2) {
//    game.add.sprite(count * 50, 200, "pipe");
// }
// for(var count=0; count<8; count+=1) {
//    if(count !=4){
//        game.add.sprite(0, 50 * count, "pipe");
//   }
// }

    //function generatePipe() {
    //       var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    //for (var y = gapStart; y > 0; y -= blockHeight) {
    //  addPipeBlock(width, y - blockHeight);
    //}
    //for (var y = gapStart + gapSize; y < height; y += blockHeight) {
    //  addPipeBlock(width, y);

    //}
    //changeScore();
    // }
    // calculate a random position for the gap
    var gap = game.rnd.integerInRange(1, 5);
    // generate the pipes, except where the gap should be
    for (var count = 0; count < 8; count++) {
        if (count != gap && count != gap + 1 && count != gap+2) {
            addPipeBlock(780, count * 50);
        }
    }
    changeScore(1);
    openText.destroy()
}


function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x, y, "pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -200;
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
if(started)
{game.physics.arcade
            .overlap(player,
            pipes,
            gameOver);

        if(player.body.y <0) {
            gameOver();
        }
        if(player.body.y >400){
            gameOver();
        }
        player.rotation = Math.atan(player.body.velocity.y / 200);

    checkBonus(balloons, 1);
    checkBonus(weight, -1);

    game.physics.arcade.overlap(player, mor, gameOver);}
}

function checkBonus(bonusArray, scoreChange) {
    for(var i=bonusArray.length - 1; i>=0; i--){
        game.physics.arcade.overlap(player, bonusArray[i], function(){
            bonusArray[i].destroy();
            bonusArray.splice(i,1);
            changeScore(scoreChange);
        });
    }
}

function gameOver() {
    game.destroy();
    $("#greeting").show();
    $("#score").val(score.toString());
    gameGravity = 200;
}


function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;
}

function generateBalloons(){
    var bonus = game.add.sprite(width, height, "balloons");
    balloons.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y = -game.rnd.integerInRange(40, 70);
}

function generateWeight(){
    var bonus = game.add.sprite(width, 50, "weight");
    weight.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y = game.rnd.integerInRange(40, 70);
}

function generateMor(){
    var bonus = game.add.sprite(width, 50, "mor");
    mor.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y = game.rnd.integerInRange(40, 70);
}
function generate(){
    var diceRoll = game.rnd.integerInRange(1, 5);
    if(diceRoll==1) {
        generateBalloons();
    } else if(diceRoll==2) {
        generateWeight();
    }else if(diceRoll==3) {
        generateMor();
    } else {
        generatePipe();
    }

}

function playerJump() {
    player.body.velocity.y = -jumpPower
}
