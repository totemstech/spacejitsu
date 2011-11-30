/**
 * Ship Object
 *
 * @extends obj
 * 
 * @param spec {}
 */
var ship = function(spec, my) {
    var my = my || {};
    var _super = {};
    
    spec.radius = 15;

    // public
    var draw; /* draw(scene) */

    var that = obj(spec, my);

    /**
     * add object to the scene
     * @param scene the scene currently used     
     */
    draw = function(scene) {
	// default object
	var geometry = new THREE.SphereGeometry(that.radius(), 20, 20);
	var material = new THREE.MeshBasicMaterial( { color: 0x886644, overdraw: true } );
	my.object = new THREE.Mesh(geometry, material );
	my.object.scale.x = 1;
	scene.add(my.object);	
	that.render();
    };

    method(that, 'draw', draw);

    return that;
};