/**
 * Earth Object
 *
 * @extends obj
 * 
 * @param spec {GL}
 */
var earth = function(spec, my) {
    var my = my || {};
    var _super = {};
    
    my.GL = spec.GL;

    spec.invmass = 0;    // does not move
    spec.invinertia = 0; // does not move   
    spec.radius = config.EARTH_RADIUS;
    spec.orientation = 0;
    spec.rotation = 0.01;

    my.voxel = voxel({GL: my.GL,
		      size: config.EARTH_RADIUS});

    my.yor = 0;

    my.GL = spec.GL;

    // public
    var init;    /* init(scene); */
    var render;  /* render() */

    var that = body(spec, my);

    /**
     * renders the object (step)
     */
    render = function() {
	my.voxel.setColor([0.1, 0.1, 0.3, 1]);
	my.voxel.draw();
    };

    method(that, 'render', render);
    method(that, 'init', init);

    return that;
};