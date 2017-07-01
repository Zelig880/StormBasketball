//This should actually be done by using import, but browser support is low
//import Boot from 'jasdfs/Boot';
const boot = new Boot(); 
const preload = new Preload();
const menu = new Menu();
const main = new Main();

class Game extends Phaser.Game {

    constructor() {

        super(500, 500, Phaser.AUTO, 'area');
        this.state.add('Boot', boot, false);
        this.state.add('Preload', preload, false);
        this.state.add('Menu', menu, false);
        this.state.add('Main', main, false);
        //this.state.add('GameOver', gameOver, false);
        
        this.state.start('Boot');
    }

}

new Game();
    

 
