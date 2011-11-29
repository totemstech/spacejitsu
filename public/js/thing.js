/**
 * Thing Object
 *
 * @extends particle
 * 
 * @param spec {position, velocity, invmass, radius}
 */
var thing = function(spec, my) {
    var my = my || {};
    
    // public
    var render; /* render(scene); */

    var that = particle({spec, my});
  
    /**
     * default renderer
     * @param scene the scene to render
     */
    render = function(scene) {
	var geometry = new THREE.SphereGeometry( 200, 30, 30 );
	var material = new THREE.MeshLambertMaterial( { color: 0x222230, shading: THREE.FlatShading, overdraw: true } );
	var sphere = new THREE.Mesh( geometry, material );
	
	sphere.position.x = that.position().x;
	sphere.position.y = that.position().y;
	sphere.position.z = that.position().z;
	
	my.scene.add(sphere);
    };

    that.render = render;

    return that;
};