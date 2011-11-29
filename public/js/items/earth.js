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
    spec.radius = 100;
    spec.orientation = 0;

    // public
    var init;  /* init(scene); */

    var that = obj(spec, my);

    /**
     * add object to the scene
     * @param scene the scene currently used     
     */
    init = function(scene) {
	// default object
	var geometry = new THREE.SphereGeometry(that.radius(), 20, 20);
	var material = new THREE.MeshBasicMaterial({ color: 0x222233, opacity: 1.0, overdraw: true});
	my.object = new THREE.Mesh(geometry, material );
	//my.object.scale.x = 2;
	scene.add(my.object);	
	that.render();
    };

    method(that, 'init', init);

    return that;
};