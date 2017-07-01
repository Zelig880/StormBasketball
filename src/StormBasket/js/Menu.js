class Menu extends Phaser.State {

	create() {
        
        this.add.text(
            100, 
            50, 
            "Storm Basket",
            {
                font: "50px",
                fill: "#999999"
            }
        );

        this.add.text(
            100,
            150,
            "Indie game about basketball. \nScore as many basket as possible to achieve the highest score.",
            {
                font: "24px",
                fill: "#999999"
            }
        );

        this.add.text(
            100,
            250,
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