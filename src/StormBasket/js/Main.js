
const MAX_ACCELERATION = 500;
const MIN_ACCELERATION = 0;
const MIN_MULTIPLIER = 0;
const MAX_MULTIPLIER = 200;
const DEBUG = false;
const states = [
    "ready",
    "power",
    "angle",
    "shoot"
    ];
var _score = 0;
var _currentState = 0;

class Main extends Phaser.State {

    create() {
        //GLOBAL VARIABLES
        this.cursors;
        this.scoreText;
        this.isNewBasketball = true;
        this.counterStarted = false;
        this.accelerationCounterStarted = false;
        this.accelerationState = "increase";
        this.angleCounterStarted = false;
        this.angleState = "increase";
        this.counter = 30;
        this.acceleration = 0;
        this.multiplierX = 1;
        this.multiplierY = 1;

        //Static Images
        this.add.image(0, 0, 'sky');
        this.ring = this.add.sprite(403,252, 'ring');

        //Actionable Items
        this.player = this.add.sprite(0, 345, 'player');
        this.basketball = this.add.sprite(25, 350, 'basketball');
        this.progressBar = this.add.sprite(15, 15, 'progress');
        this.setBasketballSprite();    
        this.angleCircle = this.add.graphics(25, 510);
        this.angleCircle.lineStyle(5,0xffd900);
        this.angleCircle.arc(0, 0, 135, this.math.degToRad(270), this.math.degToRad(0), false);
        this.smallBasketball = this.add.sprite(20, 370, 'smallBasketball');

        //Static Images with Collision
        this.backboard = this.add.sprite(468,150, 'backboard');
        this.leftSideRing = this.add.sprite(404, 252, 'ringSide');
        this.rightSideRing = this.add.sprite(471, 252, 'ringSide');
        this.scoreBar = this.add.sprite(420, 265, 'scoreBar');

        //Text Initialisation
        if(DEBUG) this.accelerationText = this.add.text(50, 50, "Acceleration: 0", { fontSize: '24px', fill: 'red' });
        if(DEBUG) this.angleText = this.add.text(50, 75, "Angle: 0", { fontSize: '24px', fill: 'green' });
        
        this.scoreText = this.add.text(50, 15, 'Points: 0', { fontSize: '32px', fill: '#ffffff' });    
        this.counterText = this.add.text(200, 15, 'Seconds: 30', { font: "32px", fill: "#ffffff" });
        this.extraSecondsText = this.add.text(375, 15, "+5 Sec", { fontSize: '32px', fill: 'red' });
    
        //SET VISIBILITY AND ANIMATIONS
        this.basketball.visible = false;
        this.extraSecondsText.visible = false;
        this.player.animations.add('shoot', [0,1,2,3,4,5,0]);
        this.progressBar.animations.add('progress', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0])
        this.world.bringToTop(this.ring);

        //PHYSICS
        this.physics.arcade.enable(
            [this.basketball, 
            this.leftSideRing, 
            this.rightSideRing, 
            this.scoreBar, 
            this.backboard]
            );
        this.physics.arcade.gravity.y = 350;
        this.basketball.body.allowGravity = false;
        this.basketball.body.collideWorldBounds = false;
        this.backboard.body.immovable = true;
        this.backboard.body.allowGravity = false;
        this.leftSideRing.body.immovable = true;
        this.leftSideRing.body.allowGravity = false;
        this.rightSideRing.body.immovable = true;
        this.rightSideRing.body.allowGravity = false;
        this.scoreBar.body.allowGravity = false;
        this.scoreBar.body.immovable = true;


        //KEYBOARD ACTIONS
        this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.reset = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
        //KEYBOARD ACTIONS
        this.cursors.down.onDown.add(this.actionStateAndUpdateStateValue, this);
        this.cursors.left.onDown.add(this.actionStateAndUpdateStateValue, this);
        this.cursors.right.onDown.add(this.actionStateAndUpdateStateValue, this);
        this.reset.onDown.add(this.resetStage, this);

        //LOOP EVENTS
        this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
        this.time.events.loop(50, this.accelerationCounter, this);
        this.time.events.loop(50, this.angleCounter, this);


    }

    update() {
        
        this.physics.arcade.collide(this.basketball, this.leftSideRing);
        this.physics.arcade.collide(this.basketball, this.rightSideRing);
        this.physics.arcade.collide(this.basketball, this.backboard);
        this.physics.arcade.overlap(this.basketball, this.scoreBar, this.addScore, null, this);

    }

    actionStateAndUpdateStateValue(){
        if(states[_currentState] === 'shoot') return;
        if(_currentState < states.length){

            switch (states[_currentState]) {
                case "ready":
                    this.triggerAccelerationCounter();
                    break;
            
                case "power":
                    this.triggerAccelerationCounter();
                    this.triggerAngleCounter();
                    break;                
                case "angle":
                    this.triggerAngleCounter();
                    this.actionShootBall();
                    break;          
            }
            _currentState++;
        }
    }

    setBasketballSprite(){
        
        this.basketballSprite = this.add.sprite(25, 345, 'basketballSprite');
        this.basketballSprite.animations.add('shootBall', [0,1,2,3]);
    }

    actionShootBall(){

        this.counterStarted = true;
        _currentState = 3;//ball shot
        this.player.animations.play("shoot", 10, false);
        this.basketballSprite.animations.play("shootBall", 10, false).onComplete.add(this.shootBall, this);
        this.resetTimer = this.time.events.add(Phaser.Timer.SECOND * 5, this.resetStage, this);
    }

    resetStage(){
        this.add.tween(this.basketball).to( { x: 25, y:350 }, 1, Phaser.Easing.Linear.None, true);
        this.basketball.visible = false;
        this.basketball.body.allowGravity = false;
        this.basketball.body.immovable = true;
        this.basketball.body.velocity.set(0, 0);
        this.basketball.body.bounce.set(0);

        if(this.resetTimer){
            this.time.events.remove(this.resetTimer);
        }

        this.setBasketballSprite();
        this.isNewBasketball = true;
        _currentState = 0;
    }
    
    addScore(){
        if(!this.isNewBasketball) return;
        _score+= 2;
        this.scoreText.text = 'Points: ' + _score;
        this.isNewBasketball = false;

        this.counter += 5;
        this.extraSecondsText.visible = true;
        this.secondsTween = this.add.tween(this.extraSecondsText).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
        this.secondsTween.onComplete.addOnce(
            function(){
                this.extraSecondsText.visible = false;
                this.extraSecondsText.alpha = 1
            }, this
        );
    }

    shootBall(){

        this.basketballSprite.destroy();
        this.basketball.visible = true;
        this.basketball.body.allowGravity = true;
        this.basketball.body.immovable = false;

        let shootValues = this.calculateShootValues();
        this.basketball.body.velocity.set(shootValues.x, shootValues.y);
        this.basketball.body.bounce.set(0.4);
    }

    calculateShootValues(){
        let velocityX = (this.multiplierX / 100) * this.acceleration;
        let velocityY = ((this.multiplierY / 100) * this.acceleration) * -1;

        //resetAllValues
        this.multiplierY = MAX_MULTIPLIER;
        this.multiplierX = MIN_MULTIPLIER;
        this.acceleration = MIN_ACCELERATION;
        this.accelerationState = "increase";
        this.angleState = "increase";

        if(DEBUG) this.accelerationText.setText('Acceleration: ' + this.acceleration);
        if(DEBUG) this.angleText.setText('MultiplierX: ' + this.multiplierX + "; MultiplierY:" + this.multiplierY);

        return { 
            x: velocityX, 
            y: velocityY
        }
    }

    updateCounter(){
        if(!this.counterStarted) return;
        this.counterText.setText('Seconds: ' + this.counter);
        this.counter--;

        if(this.counter <= 0){
            this.transictionToGameOver();
        }
    }

    accelerationCounter(){
        if(!this.accelerationCounterStarted) return;

        let accelerationUnit = (MAX_ACCELERATION - MIN_ACCELERATION) / 10;

        if(this.accelerationState === "increase"){
            this.acceleration += accelerationUnit;
        }else{
            this.acceleration -= accelerationUnit;
        }

        if(this.acceleration === MAX_ACCELERATION){
            this.accelerationState ="decrease";
        }else if(this.acceleration === MIN_ACCELERATION){
            this.accelerationState = "increase";
        }

        if(DEBUG) this.accelerationText.setText('Acceleration: ' + this.acceleration);
        this.progressBar.animations.play("progress", 40, true);
    }

    triggerAccelerationCounter(){

        if(this.accelerationCounterStarted){
            this.accelerationCounterStarted = false;
            this.progressBar.animations.stop(false);
        }else{
            this.accelerationCounterStarted = true;
            this.acceleration = MIN_ACCELERATION;
        }
    }

    angleCounter(){
        if(!this.angleCounterStarted) return;

        if(this.angleState === "increase"){
            this.multiplierX += 5;
            this.multiplierY -= 5;
        }else{
            this.multiplierX -= 5;
            this.multiplierY += 5;
        }

        if(this.multiplierX === MAX_MULTIPLIER){
            this.angleState = "decrease";
        }else if(this.multiplierX === MIN_MULTIPLIER){
            this.angleState = "increase";
        }
        
        this.animateAngle(this.multiplierX, this.multiplierY);
        if(DEBUG) this.angleText.setText('MultiplierX: ' + this.multiplierX + "; MultiplierY:" + this.multiplierY);
    }

    triggerAngleCounter(){

        if(this.angleCounterStarted){
            this.angleCounterStarted = false;
        }else{
            this.angleCounterStarted = true;
            this.multiplierY = MAX_MULTIPLIER;
            this.multiplierX = MIN_MULTIPLIER;
        }
    }

    animateAngle(multiplierX, multiplierY){
        
        let theta = Math.atan2(multiplierX, (multiplierY * -1));
        //from 1.55 to 3.15
        var newX = Math.sin(theta) * 135;
        var newY = Math.cos(theta) * 135;
        
        this.smallBasketball.x=15 + newX;
        this.smallBasketball.y=500 + newY;
    }

    transictionToGameOver(){
        
        this.state.start('GameOver');

    }
}