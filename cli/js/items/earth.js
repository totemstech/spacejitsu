/**
 * Earth Object
 *
 * @extends obj
 * 
 * @param spec {}
 */
var earth = function(spec, my) {
    var my = my || {};
    var _super = {};
    
    spec.invmass = 0;    // does not move
    spec.invinertia = 0; // does not move   
    spec.radius = config.EARTH_RADIUS;
    spec.orientation = 0;

    my.yor = 0;

    // public
    var init;    /* init(scene); */
    var render;  /* render() */

    var that = body(spec, my);

    /**
     * add object to the scene
     */
    init = function() {
    };

    /**
     * renders the object (step)
     */
    render = function() {
	//console.log(JSON.stringify(my.object.position));
	my.object.position.x = that.position().x;
	my.object.position.y = that.position().y;
	my.object.position.z = 0;
	my.object.rotation.z = that.orientation();
	my.yor += 0.001;
	my.object.rotation.y = my.yor;
	my.object.update();
    };

    method(that, 'render', render);
    method(that, 'init', init);

    return that;
};