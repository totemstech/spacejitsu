

/**
 * World object
 *
 * @extends {}
 * 
 * @param spec {container}
 */
var world = function(spec, my) {
    var my = my || {};
    
    my.container = spec.container;
    my.ships = [];
    my.shoots = {};    

    // public
    var init;   /* init(); */

    // private
    var step;  /* step() */
    var render; /* render(); */

    var that = {};

    init = function() {
	// scene
	my.scene = new THREE.Scene();

	// camera
	my.camera = new THREE.PerspectiveCamera(75, config.HALFSIZE_X / config.HALFSIZE_Y, 
						1, 10000);
	//my.camera.position.z = 1965;
	my.camera.position.z = 1305;
	my.scene.add(my.camera);
	
	// space grid
	my.spacegrid = spacegrid({});
	my.spacegrid.draw(my.scene);
	// earth
	my.earth = earth({});
	my.earth.draw(my.scene);

	// small
	for(var i = 0; i < 1; i ++) {
	    my.ships.push(ship({ invmass: 0.2,
			    invinertia: 0.001,
			    rotation: 0.001,
			    position: {x: 400, y: 400},
			    velocity: {x: 0.5, y:-1/4} }));
	    my.ships[i].draw(my.scene);
	}

	//my.renderer = new THREE.CanvasRenderer();
	my.renderer = new THREE.WebGLRenderer();
	my.renderer.setSize($('#' + my.container).width(), $('#' + my.container).height());
	
	my.camera.lookAt(my.scene.position);
	
	$('#' + my.container).append(my.renderer.domElement);

	step();
    };

    render = function() {
	my.renderer.render(my.scene, my.camera);
    }

    step = function() {
	var d = 0;
	if(typeof my.last !== 'undefined')
	    d = new Date() - my.last;
	
	for(var i = 0; i < my.ships.length; i ++) {
	    var pos = my.ships[i].position();
 	    var g =  3 / ((pos.x * pos.x) + (pos.y * pos.y));
	    var f = { x: - pos.x * g,
		      y: - pos.y * g };	    
	    
	    my.ships[i].apply(f);
	    my.ships[i].integrate(d);	    
	    my.ships[i].render();	    
	    
	    var pos = my.ships[i].position();
	    if(pos.x > config.HALFSIZE_X)
		pos.x -=  2 * config.HALFSIZE_X;
	    if(pos.x < -config.HALFSIZE_X)
		pos.x += 2 * config.HALFSIZE_X;
	    if(pos.y > config.HALFSIZE_Y)
		pos.y -=  2 * config.HALFSIZE_Y;
	    if(pos.y < -config.HALFSIZE_Y)
		pos.y += 2 * config.HALFSIZE_Y;	    
	}
		
	render();
	setTimeout(step, 16);
	my.last = new Date();
    };

    that.init = init;
    
    return that;
};