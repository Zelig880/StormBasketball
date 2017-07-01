class Boot extends Phaser.State {

	create() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.state.start('Preload');
	}

}
// export default Boot;