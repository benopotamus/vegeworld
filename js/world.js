var month_names = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


/***
 * Base animal class. All animals are descended from this.
 ***/
Animal = function(type) {
	this.type = type;
	this._dob = new Date();
	
	this.dob = function(){
		return this._dob.getDay() + '/' + month_names[this._dob.getMonth()] + '/' + this._dob.getYear()
	}
	
	this.change_direction_counter = 510;
	
	
	/***
	 * Sets the animals name
	 * 
	 * If called without a name - generate a funny name
	 ***/
	this.set_name = function(name) {
		this.name = name || 'funny name here';
	}
	
	
	/***
	 * 
	 * Phaser parts
	 * 
	 ***/
	var x = game.world.randomX;
    var y = game.world.randomY;
    
    this.animal = game.add.sprite(x, y, 'chicken');
    this.animal.width = 20;
    this.animal.height = 20;
    
    game.physics.enable(this.animal, Phaser.Physics.ARCADE);
    game.physics.arcade.enableBody(this.animal);
    
    group_universe.add(this.animal);
    
}
/***
 * Custom update method
 ***/
Animal.prototype.update = function() {
	if (this.change_direction_counter > 500) {
		this.animal.body.velocity.x = (Math.round(Math.random()) * 2 - 1) * 10;
		this.animal.body.velocity.y = (Math.round(Math.random()) * 2 - 1) * 10;
		this.change_direction_counter = 0;
	} else {
		this.change_direction_counter++;
	}
	
}


/***
 * Globals
 ***/
var game;
var group_universe; // A group for scaling everything (zooming)
var game_world_bounds = {x:0,y:0, width:1200, height:1200};


window.onload = function() {

	game = new Phaser.Game(
		window.innerWidth * window.devicePixelRatio,  // width (set game to size of browser viewport)
		window.innerHeight * window.devicePixelRatio, // height  (set game to size of browser viewport)
		/*1200,
		1200,*/
		/*'100%',
		'100%',*/
		Phaser.AUTO, // WebGL with canvas fallback
		'world-canvas', // DOM id of element to contain phaser canvas
		{ preload: preload, create: create, update: update, render: render });

	function preload() {

		game.load.image('planet', 'world.png');
		
		game.load.image('chicken', 'chicken.jpg');

	}

	function create() {
		
		group_universe = game.add.group();
		
		game.stage.disableVisibilityChange = true; // Don't pause game if browser window loses focus
		
		// Game world is size of browser viewport - set the world to actually be much bigger
		// (size of animal world - plus a bit extra for some space around it)
		game.world.setBounds(0,0,1200,1200);
		

		
		
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		var planet_x_pos = game.world.centerX - (game.cache.getImage('planet').width / 2);
		var planet_y_pos = game.world.centerY - (game.cache.getImage('planet').height / 2);
		var planet = game.add.sprite(planet_x_pos, planet_y_pos, 'planet');
		//var planet = game.add.sprite(0,0,'planet');
		
		group_universe.add(planet);
		//group_universe.scale = new Phaser.Point(0.4,0.4) // The 0.4 percentage is of the original scale, not of the last scale the group had
		
		//animals = game.add.group();
		animals = []
		
		//animals.add(new Animal('chicken'));
		for (var i=0; i<1000; i++) {
			animals.push(new Animal('chicken'));
		}
		
		zoom_pan_setup();

		
	}
	
	
	function update() {
		
		for (var i = 0; i < animals.length; i++) {
			animals[i].update();
		}
		
		
		
	}
	
	function render() {
		
	}
	
};



function dets(){
	console.log('game.world.width=',game.world.width);
	console.log('game.world.scale=',game.world.scale);
	console.log('game.world.bounds=',game.world.bounds);
	console.log('game.camera.width=',game.camera.width);
	console.log('game.camera.scale=',game.camera.scale);
	console.log('game.camera.xy=',game.camera.x,',',game.camera.y);
	console.log('game.stage.width=',game.stage.width);
	console.log('game.stage.scale=',game.stage.scale);
	console.log('game.stage.getBounds()=',game.stage.getBounds());
}

