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

    spec.type = 'vx0';

    // public
    var draw;    /* draw(scene) */
    var render;  /* render() */

    var that = ship(spec, my);

    /**
     * add object to the scene
     * @param scene the scene currently used     
     */
    draw = function(scene) {
	// default object
	var cube = new THREE.CubeGeometry(10,10,10);
	my.object = new THREE.Object3D();
	
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
	
	scene.add(my.object);	
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

    method(that, 'render', render);
    method(that, 'draw', draw);

    return that;
};
