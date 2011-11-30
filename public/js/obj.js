/**
 * Obj Object
 *
 * @extends body
 * 
 * @param spec {invmass, invinertia, 
 *              position, orientation,
 *              velocity, rotation,
 *              radius}
 */
var obj = function(spec, my) {
    var my = my || {};
    var _super = {};

    my.object = null;

    // public
    var draw;   /* draw(scene); */
    var render; /* render(); */
    
    var that = body(spec, my);
    
    /**
     * add object to the scene
     * @param scene the scene currently used     
     */
    draw = function(scene) {
	// default object
	var geometry = new THREE.CubeGeometry(that.radius(), that.radius(), that.radius());
	var material = new THREE.MeshDepthMaterial( { near: 1, far: 2000, overdraw: true } );
	my.object = new THREE.Mesh(geometry, material );
	my.object.scale.x = 2;
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

    method(that, 'draw', draw);
    method(that, 'render', render);

    return that;
};
