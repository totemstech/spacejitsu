
/**
 * Game object
 *
 * @extends {}
 * 
 * @param spec {container}
 */
var game = function(spec, my) {
    var my = my || {};
    var _super = {};

    my.container = spec.container;

    my.all = [];

    my.ship = undefined;
    my.rockets = undefined;

    // public
    var start;       /* start(); */
    var stop;        /* stop(); */
    var keydown;     /* keydown(evt) */
    var keyup;       /* keydown(evt) */
    
    // protected
    var step;   /* step(); */

    // private
    var render; /* render(); */
    var push;   /* push() */

    var that = world(spec, my);

    /**
     * pushes my.ship state
     */
    push = function() {
	if(typeof my.ship !== 'undefined') {
	    console.log('pushing: ' + JSON.stringify(my.ship.state()));
	    my.socket.emit('push', my.ship.state());
	}	
    };
    
    /**
     * keydown handler
     * @param evt
     */
    keydown = function(evt) {	
	var input = '';
	switch(evt.keyCode) {
	  case 38: input = config.INPUT_UP; break;
	  case 37: input = config.INPUT_LEFT; break;
	  case 39: input = config.INPUT_RIGHT; break;
	  case 40: input = config.INPUT_DOWN; break;
	  case 81: input = config.INPUT_SHOOT; break;	
	  default: return;	
	}
	evt.preventDefault();
	if(typeof my.ship !== 'undefined') {
	    if(my.ship.on(input)) {
		push();
	    }
	}
    };

    /**
     * keyup handler
     * @param evt
     */
    keyup = function(evt) {
	var input = '';
	switch(evt.keyCode) {
	  case 38: input = config.INPUT_UP; break;
	  case 37: input = config.INPUT_LEFT; break;
	  case 39: input = config.INPUT_RIGHT; break;
	  case 40: input = config.INPUT_DOWN; break;
	  case 81: input = config.INPUT_SHOOT; break;	
	  default: return;	
	}
	evt.preventDefault();
	if(typeof my.ship !== 'undefined') {
	    if(my.ship.off(input)) {
		push();
	    }
	}
    };



    /**
     * starts the game (engine, render, network)
     */
    start = function() {
	// scene
	my.scene = new THREE.Scene();

	// camera
	my.camera = new THREE.PerspectiveCamera(75, config.HALFSIZE_X / config.HALFSIZE_Y, 
						1000, 1500);
	//my.camera.position.z = 1965;
	my.camera.position.z = 1305;
	my.scene.add(my.camera);
	
	// space grid
	my.spacegrid = spacegrid({});
	my.spacegrid.draw(my.scene);
	// earth
	my.earth = earth({});
	my.earth.draw(my.scene);

	my.ship = vx0( {invmass: 0.2,
			invinertia: 2.002,
			radius: 15,
			position: {x: (400) * Math.cos(Math.PI/100),
				   y: (400) * Math.sin(Math.PI/100) },
			velocity: {x: 0.3 * Math.sin(Math.PI/100),
				   y: 0.3 * Math.cos(Math.PI/100) } });
	that.add(my.ship);
	my.all.push(my.ship);
	my.ship.draw(my.scene);

	//my.renderer = new THREE.CanvasRenderer();
	my.renderer = new THREE.WebGLRenderer();
	my.renderer.setSize($('#' + my.container).width(), $('#' + my.container).height());
	
	my.camera.lookAt(my.scene.position);
	
	$('#' + my.container).append(my.renderer.domElement);
	
	my.rtimer = setInterval(render, config.RENDER_TIME);
	my.gtimer = setInterval(step, config.STEP_TIME);

	my.socket = io.connect('/game');
	
	/** distributed simulation interface */
	
	my.socket.on('init', function(data) {
		my.id = data.id;
		console.log('received id: ' + my.id);
		// data.client_id
	    });	
	my.socket.on('create', function(data) {
		// data.desc
	    });		
	my.socket.on('state', function(data) {
		// [state]
	    });	
	my.socket.on('delete', function(data) {
		// [ids]
	    });	
	my.socket.on('explode', function(data) {
		// [ids]
	    });

    };
   
    /**
     * stops the game (engine, render)
     */
    stop = function() {
	if(typeof my.gtimer !== 'undefined')
	    clearInterval(my.gtimer);
	delete my.gtimer;
	if(typeof my.rtimer !== 'undefined')
	    clearInterval(my.rtimer);
	delete my.rtimer;
    };


    /**
     * renders the current scene
     */
    render = function() {
	for(var i = 0; i < my.all.length; i ++) {
	    my.all[i].render();
	} 
	my.renderer.render(my.scene, my.camera);
    };
    
    /**
     * steps the engine
     */
    step = function() {
	my.ship.thrust();
	_super.step();
    }

    method(that, 'start', start, _super);
    method(that, 'stop', stop, _super);
    method(that, 'step', step, _super);
    method(that, 'keydown', keydown, _super);
    method(that, 'keyup', keyup, _super);
    
    return that;
};