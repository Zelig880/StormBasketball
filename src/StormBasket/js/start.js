// Create a new Phaser game object with a single state that has 3 functions
var game = new Phaser.Game(500, 500, Phaser.AUTO, 'area', {
    preload: preload,
    create: create,
    update: update
});

var cursors;
var score = 0;
var scoreText;
var isNewBasketball = true;
var ballIsShot = false;
var counterStarted = false;
var accelerationCounterStarted = false;
var accelerationState = "increase";
var angleCounterStarted = false;
var angleState = "increase";
var counter = 60;
var acceleration = 0;
var multiplierX = 1;
var multiplierY = 1;
var MAX_ACCELERATION = 500;
var MIN_ACCELERATION = 0;

var MIN_MULTIPLIER = 0;
var MAX_MULTIPLIER = 200;
 
// Called first
function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('basketball', 'assets/basketball.png');
    game.load.image('ring', 'assets/basketRing.png');
    game.load.image('ringSide', 'assets/ringSide.png');
    game.load.image('scoreBar', 'assets/scoreBar.png');
    game.load.image('backboard', 'assets/backboard.png');
    game.load.spritesheet('player', 'assets/BasktBallPlayer.gif', 80, 255);
    game.load.spritesheet('basketballSprite', 'assets/basketballSprite.png', 60, 150);
}

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.image(0, 0, 'sky');
    
    // The player and its settings
    player = game.add.sprite(0, 245, 'player');
    basketball = game.add.sprite(25, 250, 'basketball');
    setBasketballSprite();
    // basketballSprite = game.add.sprite(25, 245, 'basketballSprite');
    // basketballSprite.animations.add('shootBall', [0,1,2,3]);

    ring = game.add.sprite(403,252, 'ring');
    backboard = game.add.sprite(468,150, 'backboard');
    leftSideRing = game.add.sprite(404, 252, 'ringSide');
    rightSideRing = game.add.sprite(471, 252, 'ringSide');

    scoreBar = game.add.sprite(420, 265, 'scoreBar');
    accelerationText = game.add.text(25, 50, "Acceleration: 0", { fontSize: '24px', fill: 'red' });
    angleText = game.add.text(25, 75, "Angle: 0", { fontSize: '24px', fill: 'green' });
    scoreText = game.add.text(16, 25, 'Points: 0', { fontSize: '32px', fill: '#ffffff' });    
    counterText = game.add.text(200, 25, 'Seconds: 60', { font: "32px", fill: "#ffffff" });
    extraSecondsText = game.add.text(375, 25, "+5 Sec", { fontSize: '32px', fill: 'red' });
    extraSecondsText.visible = false;

	this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);



    basketball.visible = false;

    //  We need to enable physics on the player
    game.physics.arcade.enable([basketball, leftSideRing, rightSideRing, scoreBar, backboard]);
    game.physics.arcade.gravity.y = 250;

    player.animations.add('shoot', [0,1,2,3,4,5,0]);
    
    leftSideRing.body.setCircle(6);
    rightSideRing.body.setCircle(6);
    //basketball.body.setCircle(26);

    basketball.body.allowGravity = false;
    basketball.body.collideWorldBounds = false;
    backboard.body.immovable = true;
    backboard.body.allowGravity = false;
    leftSideRing.body.immovable = true;
    leftSideRing.body.allowGravity = false;
    rightSideRing.body.immovable = true;
    rightSideRing.body.allowGravity = false;

    scoreBar.body.allowGravity = false;
    scoreBar.body.immovable = true;


    cursors = game.input.keyboard.createCursorKeys();
    cursors.down.onDown.add(actionShootBall, this);

    cursors.left.onDown.add(triggerAccelerationCounter, this);
    cursors.right.onDown.add(triggerAngleCounter, this);

    
    reset = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    reset.onDown.add(resetStage, this);

    game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
    game.time.events.loop(100, accelerationCounter, this);
    game.time.events.loop(50, angleCounter, this);
}

function setBasketballSprite(){
    basketballSprite = game.add.sprite(25, 245, 'basketballSprite');
    basketballSprite.animations.add('shootBall', [0,1,2,3]);
    
}
 
function update() {    
    
	game.physics.arcade.collide(basketball, leftSideRing);
	game.physics.arcade.collide(basketball, rightSideRing);
	game.physics.arcade.collide(basketball, backboard);
	game.physics.arcade.overlap(basketball, scoreBar, addScore);

}

function actionShootBall(){
    counterStarted = true;
    ballIsShot = true;
    player.animations.play("shoot", 10, false);
    basketballSprite.animations.play("shootBall", 10, false).onComplete.add(shootBall);
    resetTimer = game.time.events.add(Phaser.Timer.SECOND * 5, resetStage, this);
}

function resetStage(){
    var moveBall = game.add.tween(basketball).to( { x: 25, y:250 }, 1, Phaser.Easing.Linear.None, true);
    basketball.visible = false;
    basketball.body.allowGravity = false;
    basketball.body.immovable = true;
    basketball.body.velocity.set(0, 0);
    basketball.body.bounce.set(0);

    if(resetTimer){
        game.time.events.remove(resetTimer);
    }

    setBasketballSprite();
    isNewBasketball = true;
    ballIsShot = false;
}

function addScore(a,b){
    if(!isNewBasketball) return;
    score += 2;
    scoreText.text = 'Points: ' + score;
    isNewBasketball = false;

    counter += 5;
    extraSecondsText.visible = true;
    secondsTween = game.add.tween(extraSecondsText).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
    secondsTween.onComplete.addOnce(
        function(){
            extraSecondsText.visible = false;
            extraSecondsText.alpha = 1
        }
    );
}

function shootBall(){

    basketballSprite.destroy();
    basketball.visible = true;
    basketball.body.allowGravity = true;
    basketball.body.immovable = false;

    var shootValues = calculateShootValues();
    console.log(shootValues);
    basketball.body.velocity.set(shootValues.x, shootValues.y);
    basketball.body.bounce.set(0.4);
}

function calculateShootValues(){
    var velocityX = (multiplierX / 100) * acceleration;
    var velocityY = ((multiplierY / 100) * acceleration) * -1;

    //resetAllValues
    multiplierY = MAX_MULTIPLIER;
    multiplierX = MIN_MULTIPLIER;
    acceleration = MIN_ACCELERATION;
    accelerationState = "increase";
    angleState = "increase";

    accelerationText.setText('Acceleration: ' + acceleration);
    angleText.setText('MultiplierX: ' + multiplierX + "; MultiplierY:" + multiplierY);

    return { 
        x: velocityX, 
        y: velocityY
    }
}

function updateCounter(){

    if(!counterStarted) return;
    counterText.setText('Seconds: ' + counter);
    counter--;

    if(counter <= 0){
        transictionToGameOver();
    }
}
//ACCELLERATIONS
function accelerationCounter(){
    if(!accelerationCounterStarted) return;

    if(accelerationState === "increase"){
        acceleration += 50;
    }else{
        acceleration -= 50;
    }

    if(acceleration === MAX_ACCELERATION){
        accelerationState ="decrease";
    }else if(acceleration === MIN_ACCELERATION){
        accelerationState = "increase";
    }

    accelerationText.setText('Acceleration: ' + acceleration);
}

function triggerAccelerationCounter(){
    if(accelerationCounterStarted){
        accelerationCounterStarted = false;
    }else{
        accelerationCounterStarted = true;
        acceleration = MIN_ACCELERATION;
    }
}

//ANGLE
function angleCounter(){
    if(!angleCounterStarted) return;

    if(angleState === "increase"){
        multiplierX += 5;
        multiplierY -= 5;
    }else{
        multiplierX -= 5;
        multiplierY += 5;
    }

    if(multiplierX === MAX_MULTIPLIER){
        angleState = "decrease";
    }else if(multiplierX === MIN_MULTIPLIER){
        angleState = "increase";
    }

    angleText.setText('MultiplierX: ' + multiplierX + "; MultiplierY:" + multiplierY);
}

function triggerAngleCounter(){
    if(angleCounterStarted){
        angleCounterStarted = false;
    }else{
        angleCounterStarted = true;
        multiplierY = MAX_MULTIPLIER;
        multiplierX = MIN_MULTIPLIER;
    }
}

function transictionToGameOver(){
    
        game.state.start('GameOver');

}
