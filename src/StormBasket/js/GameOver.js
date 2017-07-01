class GameOver extends Phaser.State {

	create() {
        let scoreText;
        let scoreTextObj;
        let GameOverText;
        let GameOverTextObj;

        this.add.image(0, 0, 'sky');
        GameOverText = "Game Over";
        GameOverTextObj = this.add.text(150, 150, GameOverText, { fontSize: '24px', fill: 'red' });

        scoreText = String.raw `You Final Score:${_score}`;
        scoreTextObj = this.add.text(250, 250, scoreText, { fontSize: '24px', fill: 'red' });
        
	}

}