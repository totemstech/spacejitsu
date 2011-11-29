/**
 * Space Grid Object
 *
 * @extends obj
 * 
 * @param spec {}
 */
var spacegrid = function(spec, my) {
    var my = my || {};
    var _super = {};
    
    spec.invmass = 0;    // does not move
    spec.invinertia = 0; // does not move   

    // public
    var init;      /* init(scene); */

    var that = obj(spec, my);

    init = function(scene) {
	// x-lines
	var xgeom = new THREE.Geometry();
	xgeom.vertices.push( new THREE.Vertex( new THREE.Vector3(-1500, 0, 0)));
	xgeom.vertices.push( new THREE.Vertex( new THREE.Vector3(1500, 0, 0)));	    
	for ( var i = 0; i <= 20; i ++ ) {
	    var line = new THREE.Line( xgeom, new THREE.LineBasicMaterial( { color: 0x444444, opacity: 0.4 } ) );
	    line.position.y = ( i * 100 ) - 1000;
	    scene.add(line);
	}
	// y-lines
	var ygeom = new THREE.Geometry();
	ygeom.vertices.push( new THREE.Vertex( new THREE.Vector3(0, -1000, 0)));
	ygeom.vertices.push( new THREE.Vertex( new THREE.Vector3(0, 1000, 0)));	    
	for ( var i = 0; i <= 30; i ++ ) {
	    var line = new THREE.Line( ygeom, new THREE.LineBasicMaterial( { color: 0x444444, opacity: 0.4 } ) );
	    line.position.x = ( i * 100 ) - 1500;
	    scene.add(line);
	}
    };
    
    method(that, 'init', init, _super);

    return that;
};