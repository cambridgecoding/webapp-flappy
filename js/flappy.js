/**
 * Created by v3513 on 11/08/2015.
 */
var actions = { preload: preload, create: create, update: update };

var game = new Phaser.Game(790, 400, Phaser.AUTO, "game", actions);

var score = 0;

var labelScore;

var player;

var pipes = [];

var gapSize = 150;
var gapMargin = 50;
var blockHeight = 50;
var width = 790;
var height = 400;
var pipeEndHeight = 25;
var pipeEndExtraWidth = 10;



jQuery("#greeting-form").on("submit", function(event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + "</p>");
    event_details.preventDefault();
});


function preload() {

    game.load.image("playerIMG","../assets/burger2.gif");

    game.load.audio("score", "../assets/point.ogg");

    game.load.image("pipe","../assets/ketchupPipe.png");
    game.load.image("background", "../assets/frenchfriesbackground.jpg");
    game.load.image("pipeend", "../assets/pipe-end.png");
}


function create() {

    game.stage.setBackgroundColor("#F3D3A3");
    game.add.sprite(0,0, "background");



    labelScore = game.add.text(20, 0, "0",
        {font: "30px Arial", fill: "#FFFFFF"});


    var burger = player = game.add.sprite(80, 200, "playerIMG");
    burger.scale.setTo(0.05, 0.05);


    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.arcade.enable(player);

    player.body.gravity.y = 500;

    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);

    var pipeInterval = 1.75;
    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generatePipe);
    player.anchor.setTo(0.5, 0.5);
}


function update() {


    game.physics.arcade
        .overlap(player,
        pipes,
        gameOver);


    if(player.y < 0 || player.y > 400){
        gameOver();
    }

    player.rotation += 0.2;
}



function addPipeBlockD(x, y) {
    var xyKetchup = 0.05;
    var blockD = game.add.sprite(x,y,"pipe");

    blockD.scale.setTo(-xyKetchup,-xyKetchup);

    pipes.push(blockD);

    game.physics.arcade.enable(blockD);

    blockD.body.velocity.x = -200;
}

function addPipeBlockU(x, y) {
    var xyKetchup = 0.05;

    var blockU = game.add.sprite(x,y,"pipe");

    blockU.scale.setTo(xyKetchup,xyKetchup);
    pipes.push(blockU);

    game.physics.arcade.enable(blockU);

    blockU.body.velocity.x = -200;
}

function generatePipe() {
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    //addPipeEnd(width-(pipeEndExtraWidth/2), gapStart);
    for(var y=gapStart-pipeEndHeight; y>0 ; y-=blockHeight) {
        addPipeBlockD(width,y - blockHeight);
    }

    //addPipeEnd(width-(pipeEndExtraWidth/2), gapStart+gapSize-pipeEndHeight);
    for(var y=gapStart+gapSize+pipeEndHeight; y<height; y+=blockHeight) {
        addPipeBlockU(width,y);
    }

    //for(var y=gapStart; y > 0 ; y -= blockHeight){
    //    addPipeBlock(width,y - blockHeight);
    //}
    //
    //for(var y = gapStart + gapSize; y < height; y += blockHeight) {
    //    addPipeBlock(width, y);
    //}

    changeScore();
}

function playerJump() {

    player.body.velocity.y = -200;
}


function changeScore() {
    //increments global score variable by 1
    score++;
    // updates the score label
    labelScore.setText(score.toString());
}

function gameOver() {
    // stop the game (update() function no longer called)
  //  game.destroy();
   // game.paused = true;
    game.state.restart();
    $("#greeting").show();
score = 0;
}

function addPipeEnd(x,y) {
    var block = game.add.sprite(x,y,"pipeend");
    // insert it in the pipe array
    pipes.push(block);
    // enable physics engine for the block
    game.physics.arcade.enable(block);
    // set the block's horizontal velocity to a negative value
    // (negative x value for velocity means movement will be towards left)
    block.body.velocity.x = -200;
}