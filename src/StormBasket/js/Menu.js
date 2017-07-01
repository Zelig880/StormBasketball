class Menu extends Phaser.State {

	create() {
        
         var nameLabel = this.add.text(
            100, 
            50, 
            "Storm Basket",
            {
                font: "50px Arial",
                fill: "#999999"
            }
        )

        var spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        spaceKey.onDown.addOnce(function(){
            this.state.start('Main')
        }, this);

    }
}