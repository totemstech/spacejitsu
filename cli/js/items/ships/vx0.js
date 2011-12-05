/**
 * VX-0 Object
 *
 * @extends ship
 * 
 * @param spec {invmass, invinertia, 
 *              position, orientation,
 *              velocity, rotation,
 *              radius, thrust}
 */
var vx0 = function(spec, my) {
    var my = my || {};
    var _super = {};

    spec.model = spec.model || 'vx0';
    my.sims = [];

    // public
    var init;      /* init(scene) */
    var render;    /* render() */
    var simulate;  /* simulate() */

    var that = ship(spec, my);


    /**
     * add object to the scene
     * @param scene the scene currently used     
     */
    init = function(scene) {
		
	// default object
	var cube = new THREE.CubeGeometry(10,10,10);
	my.object = new THREE.Object3D();
	
	my.scene = scene;
	var voxel;

	voxel = new THREE.Mesh(cube, new THREE.MeshBasicMaterial({color: 0x448844, opacity: 1.0, overdraw: true}));
	voxel.position.x = 0;
	voxel.position.y = 10;
	voxel.position.z = 0;	
	my.object.add(voxel);

	voxel = new THREE.Mesh(cube, new THREE.MeshBasicMaterial({color: 0x444444, opacity: 1.0, overdraw: true}));
	voxel.position.x = 10;
	voxel.position.y = 0;
	voxel.position.z = 0;	
	my.object.add(voxel);

	voxel = new THREE.Mesh(cube, new THREE.MeshBasicMaterial({color: 0x444444, opacity: 1.0, overdraw: true}));
	voxel.position.x = -10;
	voxel.position.y = 0;
	voxel.position.z = 0;	
	my.object.add(voxel);
	
	my.scene.add(my.object);	
	that.render();
    };

    /**
     * renders the object (step)
     */
    render = function() {	
	my.object.position.x = that.position().x + 10;
	my.object.position.y = that.position().y;
	my.object.position.z = 0;
	my.object.rotation.z = that.orientation();
    }

    /**
     * simulate and render trajectory
     */ 
    simulate = function() {
	if(my.sims.length === 0) {
	    var scube = new THREE.CubeGeometry(3,3,3);
	    for(var i = 0; i < config.SIMULATION_LEN; i++) {
		var sim = new THREE.Mesh(scube, new THREE.MeshBasicMaterial({color: 0x226688, 
									     opacity: 0.6 - 0.5 / config.SIMULATION_LEN * i, 
									     overdraw: true}));
		sim.position.x = 0;
		sim.position.y = 0;
		sim.position.z = 0;	
		my.sims.push(sim);
		my.scene.add(sim);	
	    }
	}
	
	var s = _super.simulate(config.SIMULATION_LEN, 200);
	for(var i = 0; i < config.SIMULATION_LEN; i++) {
	    my.sims[i].position.x = s[i].x;
	    my.sims[i].position.y = s[i].y;	    
	    my.sims[i].position.z = 0;
	}
    }

    clear = function() {
	my.scene.remove(my.object);
	_super.clear();
    };

    method(that, 'render', render, _super);
    method(that, 'draw', draw, _super);
    method(that, 'clear', clear, _super);
    method(that, 'simulate', simulate, _super);

    return that;
};
