class Menu extends Phaser.State {

	create() {
        
        this.add.text(
            100, 
            40, 
            "Storm Basket",
            {
                font: "36px",
                fill: "#999999"
            }
        );

        let mainMenuText = `
            Basketball game Designed by Zelig880. \n
            Score as many basket as possible to achieve the highest score.\n
            Click the LEFT ARROW to select the power of the shoot\n
            Click the RIGHT ARROW to select the angle of the shoot\n
            CLick Space to reset the ball or wait 5 seconds.\n
            Every basket will award 5 seconds\n
            The game is over when the time is UP.
        `;

        this.add.text(
            100,
            85,
            mainMenuText,
            {
                font: "16px",
                fill: "#999999"
            }
        );

        this.add.text(
            100,
            500,
            "PRESS SPACE TO BEGIN",
            {
                font: "24px",
                fill: "yellow"
            }

        );

        var spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        spaceKey.onDown.addOnce(function(){
            this.state.start('Main')
        }, this);

    }
}