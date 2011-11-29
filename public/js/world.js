

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
    var render; /* render(); */

    // private
    var step;  /* step() */

    var that = {};

    init = function() {
	// scene
	my.scene = new THREE.Scene();

	// camera
	my.camera = new THREE.PerspectiveCamera( 75, 3/2, 1, 10000 );
	my.camera.position.z = 1305;
	my.scene.add(my.camera);
	
	// space grid
	my.spacegrid = spacegrid({});
	my.spacegrid.init(my.scene);
	// earth
	my.earth = earth({});
	my.earth.init(my.scene);

	// small
	my.ships.push(ship({ position: {x: 200, y: 200} }));
	my.ships[0].init(my.scene);

	my.renderer = new THREE.CanvasRenderer();
	my.renderer.setSize($('#' + my.container).width(), $('#' + my.container).height());
	
	my.camera.lookAt( my.scene.position );
	
	$('#' + my.container).append(my.renderer.domElement);

	setInterval(step, 1000);
    };

    render = function() {
	my.renderer.render(my.scene, my.camera);
    }

    step = function() {
	for(var i = 0; i < my.ships.length; i ++) {
	    console.log('integrate');
	    my.ships[0].apply({x: 10, y: 10});
	    my.ships[0].integrate(1);
	    console.log(JSON.stringify(my.ships[0].position()));
	    my.ships[0].render();
	}
	render();
    };

    that.init = init;
    that.render = render;
    
    return that;
};