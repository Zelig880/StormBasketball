class Preload extends Phaser.State  {
    preload(){
        
        this.load.image('sky', 'assets/sky.png');
        this.load.image('basketball', 'assets/basketball.png');
        this.load.image('smallBasketball', 'assets/smallBasketball.png');
        this.load.image('ring', 'assets/basketRing.png');
        this.load.image('ringSide', 'assets/ringSide.png');
        this.load.image('scoreBar', 'assets/scoreBar.png');
        this.load.image('backboard', 'assets/backboard.png');
        this.load.spritesheet('player', 'assets/BasktBallPlayer.gif', 80, 255);
        this.load.spritesheet('basketballSprite', 'assets/basketballSprite.png', 60, 150);
        this.load.spritesheet('progress', 'assets/progressSprite.png', 29, 250);

    }

    create(){

        this.state.start('Menu');

    }
}