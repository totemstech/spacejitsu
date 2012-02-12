/**
 * M-0 Object
 *
 * @extends missile
 * 
 * @param spec {position, orientation,
 *              velocity, rotation,
 *              lifespan, GL}
 */
var m0 = function(spec, my) {
    var my = my || {};
    var _super = {};

    spec.model = 'm0';    
    spec.invmass = 0.02;
    spec.radius = 2;
    spec.lifespan = 4000;

    my.GL = spec.GL;
    my.size = 2;
    my.vx = voxel({GL: my.GL,
                   size: my.size});

    // public
    var render;    /* render() */

    var that = missile(spec, my);    


    /**
     * renders the object (step)
     */
    render = function() {	
	my.vx.setColor([0, 1, 0, 1]);
	my.vx.draw();
    };

    method(that, 'render', render, _super);

    return that;
};
