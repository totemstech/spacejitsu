/**
 * VX-0 Object
 *
 * @extends ship
 * 
 * @param spec {invmass, invinertia, 
 *              position, orientation,
 *              velocity, rotation,
 *              radius, thrust, GL}
 */
var vx0 = function(spec, my) {
    var my = my || {};
    var _super = {};

    spec.model = spec.model || 'vx0';
    my.sims = [];
    
    my.GL = spec.GL;
    my.voxel = voxel({GL: my.GL});

    // public
    var render;    /* render() */
    var simulate;  /* simulate() */

    var that = ship(spec, my);    


    /**
     * renders the object (step)
     */
    render = function() {			
	my.voxel.setColor([0, 1, 0]);
	my.voxel.draw();
    };

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
	_super.clear();
    };

    method(that, 'render', render, _super);
    method(that, 'clear', clear, _super);
    method(that, 'simulate', simulate, _super);

    return that;
};
