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

    // public
    var draw;    /* draw(scene); */
    var render;  /* render() */

    var that = body(spec, my);

    /**
     * add object to the scene
     * @param scene the scene currently used     
     */
    draw = function(scene) {
	// default object
	var geometry = new THREE.SphereGeometry(that.radius(), 20, 20);
	var material = new THREE.MeshBasicMaterial({ color: 0x222233, opacity: 1.0, overdraw: true});
	my.object = new THREE.Mesh(geometry, material );
	//my.object.scale.x = 2;
	scene.add(my.object);	
	that.render();
    };

    /**
     * renders the object (step)
     */
    render = function() {
	my.object.position.x = that.position().x;
	my.object.position.y = that.position().y;
	my.object.position.z = 0;
	my.object.rotation.z = that.orientation();
    }

    method(that, 'render', render);
    method(that, 'draw', draw);

    return that;
};