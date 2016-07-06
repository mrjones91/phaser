var face;

var game = Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload () {
	//game.load.image('face', 'tm.jpg');
	//game.load.image('logo', 'https://avatars3.githubusercontent.com/u/3495681?v=3&s=230');
}

function create () {
	face = game.add.sprite(game.world.centerX, 0, 'face');
	// var logo = game.add.sprite(game.world.centerX - 200, 150, 'logo');
}

function update() {

}