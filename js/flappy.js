/* Global Variables & Constants */

// the jump velocity of the player - the larger the number the higher it jumps
var jump_height = 200;
// the initial height of the player
var initial_height = 270;
// the right margin of the player
var player_margin = 60;
// indicates whether the game is waiting for the player to fall after a pipe was hit
var player_falling = false;

// the height of pipe sprites
var pipe_size = 50;
// the height of end bit of pipe
var pipe_end_size = 12;
// the horizontal offset at which pipes are spawned
var pipe_offset = 900;
// the interval (in seconds) at which new pipe columns are spawned
var pipe_interval = 1.75;
// the number of pipe sprites that make up a pipe column
var number_of_pipes = 8;
// the bigger the number the quicker the player falls
var gravity = 400;

// the height of the game scene
var game_height = (pipe_size * number_of_pipes) + (2 * pipe_end_size);
// the width of the game scene
var game_width = 750;
// the horizontal speed in pixels at which pipes move per second
var game_speed = 200;
// a boolean indicating whether the game is on start screen
var game_startscreen = true;
// a boolean indicating whether the game is running or not
var game_playing = false;

// stores the current score
var score = 0;
// the frequency of score updates per second
var score_update_freq = 0.1;
// time it takes to pass through the first pipe
var time_offset = (pipe_size + pipe_offset - player_margin)/game_speed;
// keep track of game play time for scoring
var pipe_timer = -time_offset;


// font styles for the text
var big_style = { font: "30px Arial", fill: "#ffffff" };
var small_style = { font: "20px Arial", fill: "#ffffff" };

// variables which represent labels used to display text on the screen
var label_welcome;
var label_score;
var label_gameover;
var label_endscore;
var label_instructions;
var label_reset;

// the player sprite
var player;
// the group of pipe sprites
var pipes;

// the Game object used by the phaser.io library
var actions = { preload: preload, create: create, update: update };
var game = new Phaser.Game(game_width, game_height, Phaser.AUTO, 'game', actions);

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    // load the images located in the 'assets/' folder and assign names to them (e.g. 'pipe')
    game.load.image('background', '../assets/bg1.jpg');
    game.load.image('flappybird', '../assets/flappy-cropped.png');
    game.load.image('pipe-body', '../assets/pipe2-body.png');
    game.load.image('pipe-end', '../assets/pipe2-end.png');
    // load audio and sound effects
    game.load.audio('score', '../assets/point.ogg');

    game_width = document.querySelector("#game").offsetWidth
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // there are three physics engine. this is the basic one
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // set the background colour of the scene (Cambridge blue #98baac)
    game.stage.backgroundColor = '#98baac';
    game.add.image(0, 0, 'background');

    // load game audio
    game.add.audio('score');

    // create a sprite for the player and center on start screen
    player = game.add.sprite(game_width/2, game_height/2, 'flappybird');
    // player = game.add.sprite(player_margin, initial_height, 'jamesbond');

    // rotate the player slightly for uplifting visual effect
    game.add.tween(player).to({angle: -375}, 2000).start();

    // set the anchor to the middle of the sprite
    player.anchor.setTo(0.5, 0.5);

    // enable physics (gravity etc) for the player sprite
    game.physics.arcade.enable(player);

    // test whether the player sprite is still within the world bounds at each frame
    // and trigger the 'onOutOfBounds' event if not
    player.checkWorldBounds = true;

    // create a new group for the pipe sprites - this will allow us to easily manipulate all
    // pipes at once later on
    pipes = game.add.group();

    // initialise the labels for the score, instructions, and game over message
    label_welcome = game.add.text(game_width/2,game.height/4, "Welcome to CCA Flappy Bird!", big_style);
    label_welcome.anchor.set(0.5);

    label_score = game.add.text(20, 20, "", big_style);
    label_score.visible = false;

    label_gameover = game.add.text(game.width/2,game.height/3, "Game over!", big_style);
    label_gameover.anchor.set(0.5);
    label_gameover.visible = false;

    label_endscore = game.add.text(game.width/2,game.height/2, "", big_style);
    label_endscore.anchor.set(0.5);
    label_endscore.visible = false;

    label_instructions = game.add.text(game.width/2, game.height*2/3, "Tap or press [Space] to start", small_style);
    label_instructions.anchor.set(0.5);

    label_reset = game.add.text(game.width/2, game.height*2/3, "Tap or press [Space] for start screen", small_style);
    label_reset.anchor.set(0.5);
    label_reset.visible = false;

    // assign the 'game_play' function as an event handler to the space key
    var space_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space_key.onDown.add(game_play);
    // also allow mouse click and touch input for game play
    game.input.onDown.add(game_play);
}

/*
 * This function is called every time the game is reset.
 */
function game_reset() {
    // toggle the visibility of the labels
    label_welcome.visible = true;
    label_score.visible = false;
    label_gameover.visible = false;
    label_endscore.visible = false;
    label_instructions.visible = true;
    label_reset.visible = false;

    // pause player
    player.body.gravity.y = 0;

    // reset player to initial position on start screen
    player.reset(game_width/2, game_height/2);

    // rotate the player slightly for uplifting visual effect
    game.add.tween(player).to({angle: -375}, 2000).start();

    // change the state of the game
    game_startscreen = true;
}

/*
 * This function is called every time the game is started.
 */
function game_start() {
    // toggle the visibility of the labels
    label_welcome.visible = false;
    label_score.visible = true;
    label_gameover.visible = false;
    label_endscore.visible = false;
    label_instructions.visible = false;
    label_reset.visible = false;

    // reset the score counter
    score = 0;
    label_score.setText(score);

    // reset play time
    pipe_timer = -time_offset;

    // reset the player to its initial position - also resets the physics
    player.reset(player_margin, initial_height);

    // the bigger the number the quicker the player falls
    player.body.gravity.y = gravity;

    // set up timers for the pipe generation and score updates
    game.time.events.loop(pipe_interval * Phaser.Timer.SECOND, generate_pipes);
    game.time.events.loop(score_update_freq * Phaser.Timer.SECOND, update_score);

    // set up 'game_over' as an event handler for when the player sprite leaves the bounds of the screen
    player.events.onOutOfBounds.removeAll();
    player.events.onOutOfBounds.add(game_over);

    // change the state of the game
    game_startscreen = false;
    game_playing = true;
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    // check that we are not currently in a menu
    if(!game_playing)
        return;

    // check for overlap between the player sprite and any pipe - call the 'game_over' function
    // if there is an overlap
    game.physics.arcade.overlap(player, pipes, game_over);

    // reset the rotation of the player once it starts falling after a jump
    if(player.body.velocity.y >= 0) {
        game.add.tween(player).to({angle: 0}, 100).start();
    }
}

/*
 * Calculates the score and updates the score label. This function is called
 * with a frequency of score_update_freq.
 */
function update_score() {
    // update game play time [seconds]
    pipe_timer += score_update_freq;

    if(pipe_timer > 0) {
        // scoring based on game run time over pipe spawn time
        var score_new = Math.floor(pipe_timer/pipe_interval);
        // check if player passed through a pipe
        if(score_new-score == 1) {
            // play sound effect
            game.sound.play('score');
            // increase score display
            score++;
        }
    }

    label_score.setText(score);
    label_endscore.setText("Your score: "+score);
}

/*
 * This function serves as an event handler for when the space key is pressed. If the
 * game is running, then it will cause the player sprite to jump. If the game has not been started
 * or the game over screen is visible, then this will cause the game to be started.
 */
function game_play() {
    if(game_playing) {
        player_jump();
    } else if(game_startscreen) {
        game_start();
    } else if(!player_falling) {
        game_reset();
    }
}

/*
 * Sets the player sprite's vertical velocity to a negative value, which causes it to go up.
 */
function player_jump() {
    // the smaller the number the higher it jumps
    player.body.velocity.y = -1 * jump_height;
    // a bit of banter to rotate the player slightly as it jumps
    game.add.tween(player).to({angle: -15}, 100).start();
}

/*
 * Adds a single pipe sprite to the game at the specified coordinates.
 */
function add_pipe_part(x, y, pipe_part) {
    // create new pipe part in the 'pipes' group
    var pipe = pipes.create(x, y, pipe_part);

    // enable physics for the individual pipe part
    game.physics.arcade.enable(pipe);

    // set the pipe's horizontal velocity to a negative value, which causes it to go left.
    pipe.body.velocity.x = -1 * game_speed;
}


/*
 * This function serves as an event handler for the pipe generator.
 * It is called with frequency per second of score_update_freq.
 */
function generate_pipes() {
    // calculate a random position for the hole within the pipe
    var hole = Math.floor(Math.random()*(number_of_pipes-3))+1;

    // generate the pipes, except where the hole should be
    var i;

    for (i = 0; i < hole; i++) {
        add_pipe_part(pipe_offset, i * pipe_size, 'pipe-body');
    }
    add_pipe_part(pipe_offset-2, hole * pipe_size, 'pipe-end');

    add_pipe_part(pipe_offset-2, (hole+2) * pipe_size + pipe_end_size, 'pipe-end');
    for(i = hole + 2; i < number_of_pipes; i++){
        add_pipe_part(pipe_offset, i * pipe_size + (2*pipe_end_size), 'pipe-body');
    }

    // workshop hack
    //score++;
    //label_score.setText(score);
    //label_endscore.setText("Your score: "+score);
}

/*
 * This function is used as an event handler if the game is waiting for the player sprite to fall out of
 * the scene after a pipe has been hit.
 */
function player_fallen() {
    // we are no longer waiting for the player sprite to fall out of the scene
    player_falling = false;
    player.events.onOutOfBounds.removeAll();

    label_reset.visible = true;
}

/*
 * This function stops the game. It is called when the player sprite touches a pipe or leaves
 * the bounds of the scene.
 */
function game_over() {
    // workshop hack 1
    //location.reload();
    // workshop hack 2
    //game.paused = true;

    // check that the game hasn't been stopped already
    if(!game_playing)
        return;

    game_playing = false;

    // stop all events (generation of pipes, score updates)
    game.time.events.removeAll();

    // remove all pipes from the game
    pipes.destroy(true, true);

    // remove the event handler which checks if the player sprite has left the bounds of the scene
    player.events.onOutOfBounds.removeAll();

    // toggle the visibility of the game over/score labels
    label_score.visible = false;
    label_gameover.visible = true;
    label_endscore.visible = true;

    // if the player sprite is still within the bounds of the scene, we want to wait for it to fall out
    // before allowing the game to be restarted (this is purely for aesthetics)
    // otherwise, we don't wait
    if(game.world.bounds.contains(player.x, player.y)) {
        // change the game state to 'waiting for the player to fall out of the scene' and
        // set up an event handler which waits for this to occur
        player_falling = true;
        player.events.onOutOfBounds.add(player_fallen);
    } else {
        label_reset.visible = true;
    }

    $("#score").val(score);
    $("#greeting").show();
}

$.get("/score", function(data){
	var scores = JSON.parse(data);
    for (var i = 0; i < scores.length; i++) {
    	$("#scoreBoard").append("<li>" + scores[i].name + ": " + scores[i].score + "</li>");
    }
});

// jQuery("#greeting-form").on("submit", function(event_details) {
//     var greeting = "Hello ";
//     var name = jQuery("#fullName").val();
//     var greeting_message = greeting + name;
//     alert(greeting_message);
//     event_details.preventDefault();
//     var greeting = "Hello ";
//     var name = jQuery("#fullName").val();
//     var greeting_message = greeting + name;
//     jQuery("#greeting-form").hide();
//     jQuery("#greeting").append("<p>" + greeting_message + " (" + jQuery("#email").val() + "): " + jQuery("#score").val() + "</p>");
//     event_details.preventDefault();
// });

