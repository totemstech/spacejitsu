
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

    my.ship = undefined;
    my.rockets = undefined;
    my.incr = 0;

    // public
    var start;       /* start(); */
    var stop;        /* stop(); */
    var keydown;     /* keydown(evt) */
    var keyup;       /* keydown(evt) */
    
    // protected
    var step;        /* step(); */

    // private
    var reset;       /* reset() */
    var init;        /* init(); */
    var render;      /* render(); */
    var push;        /* push() */
    var gid;         /* gid() */

    var that = world(spec, my);

    /**
     * pushes my.ship state
     */
    push = function() {
	if(typeof my.ship !== 'undefined') {
	    //console.log('pushing: ' + JSON.stringify(my.ship.state()));
	    my.socket.emit('push', { id: my.ship.id(), 
			             st: my.ship.state() });
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
     * inits core components
     */
    init = function() {
	//my.renderer = new THREE.CanvasRenderer();
	my.renderer = new THREE.WebGLRenderer();
	my.renderer.setSize($('#' + my.container).width(), $('#' + my.container).height());	
	$('#' + my.container).append(my.renderer.domElement);
    };

    /**
     * resets the game
     */
    reset = function() {
	// scene
	my.scene = new THREE.Scene();
	// camera
	my.camera = new THREE.PerspectiveCamera(75, config.HALFSIZE_X / config.HALFSIZE_Y, 
						1000, 1500);
	//my.camera.position.z = 1965;
	my.camera.position.z = 1305;
	my.scene.add(my.camera);
	my.camera.lookAt(my.scene.position);	
	
	// space grid
	my.spacegrid = spacegrid({});
	my.spacegrid.draw(my.scene);
	// earth
	my.earth = earth({});
	that.add(my.earth);
	my.earth.draw(my.scene);	

	that.clear();
    };
    

    /**
     * starts the game (engine, render, network)
     */
    start = function() {
	
	my.rtimer = setInterval(render, config.RENDER_TIME);
	my.gtimer = setInterval(step, config.STEP_TIME);
	my.utimer = setInterval(push, config.UPDATE_TIME);
	
	/** distributed simulation interface */
	
	my.socket = io.connect('/game');
	
	my.socket.on('init', function(data) {
		reset();
		my.id = data.id;
		// ship buildup
		my.ship = vx0( { id: gid(),
			         owner: my.id,
				 invmass: 0.2,				
				 invinertia: 2.002,
				 radius: 15,
				 position: {x: (400) * Math.cos(Math.PI/100),
					    y: (400) * Math.sin(Math.PI/100) },
				 velocity: {x: 0.3 * Math.sin(Math.PI/100),
					    y: 0.3 * Math.cos(Math.PI/100) } });
		that.add(my.ship);
		my.ship.draw(my.scene);

		my.socket.emit('create', { desc: my.ship.desc() });
	    });	

	my.socket.on('create', function(data) {
		if(data.desc.owner !== my.id) {
		    if(data.desc.type === config.SHIP_TYPE) {
			switch(data.desc.model) {
			  case 'vx0':
			    var s = vx0(data.desc);
			    that.add(s);
			    s.draw(my.scene);			    
			    break;
			default:
			}
		    }		    
		}
	    });		
	my.socket.on('push', function(data) {
		if(that.idx()[data.id] !== 'undefined' &&
		   that.idx()[data.id].owner() !== my.id) {
		    that.idx()[data.id].update(data.st);
		}
	    });	
	my.socket.on('delete', function(data) {
		// [ids]
	    });	
	my.socket.on('kill', function(data) {
		console.log('KILL');
		that.clear(data.id);	     
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
	if(typeof my.utimer !== 'undefined')
	    clearInterval(my.utimer);
	delete my.utimer;
    };


    /**
     * renders the current scene
     */
    render = function() {
	if(typeof my.ship !== 'undefined') {
	    my.ship.simulate();
	}
	for(var i = 0; i < that.all().length; i ++) {
	    that.all()[i].render();
	} 
	if(my.scene && my.camera)
	    my.renderer.render(my.scene, my.camera);
    };
    
    /**
     * steps the engine
     */
    step = function() {
	for(var i = 0; i < that.all().length; i ++) {
	    //console.log(that.all()[i].id() + ' ' + that.all()[i].type());
	    if(that.all()[i].type() === config.SHIP_TYPE) {
		//console.log(that.all()[i].id() + ' ' + that.all()[i].inputs());
		that.all()[i].thrust();
	    }
	}
	_super.step();
    }

    /**
     * returns a global id based on local id
     * and an incremented integer
     * @return gid a global id
     */
    gid = function() {
	return my.id + '-' + (++my.incr);
    };

    method(that, 'start', start, _super);
    method(that, 'stop', stop, _super);
    method(that, 'keydown', keydown, _super);
    method(that, 'keyup', keyup, _super);

    method(that, 'step', step, _super);

    init();
    
    return that;
};