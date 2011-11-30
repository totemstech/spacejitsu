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
    var draw;      /* draw(scene); */

    var that = obj(spec, my);

    draw = function(scene) {
	// x-lines
	var xgeom = new THREE.Geometry();
	xgeom.vertices.push( new THREE.Vertex( new THREE.Vector3(-config.HALFSIZE_X, 0, 0)));
	xgeom.vertices.push( new THREE.Vertex( new THREE.Vector3(config.HALFSIZE_X, 0, 0)));	    
	for ( var i = 0; i <= (2 * config.HALFSIZE_Y / config.GRID_SPACE); i ++ ) {
	    var line = new THREE.Line( xgeom, new THREE.LineBasicMaterial({ color: config.GRID_COLOR, 
									    opacity: config.GRID_OPACITY }));
	    line.position.y = (i * config.GRID_SPACE) - config.HALFSIZE_Y;
	    scene.add(line);
	}
	// y-lines
	var ygeom = new THREE.Geometry();
	ygeom.vertices.push( new THREE.Vertex( new THREE.Vector3(0, -config.HALFSIZE_Y, 0)));
	ygeom.vertices.push( new THREE.Vertex( new THREE.Vector3(0, config.HALFSIZE_Y, 0)));	    
	for ( var i = 0; i <= (2 * config.HALFSIZE_X / config.GRID_SPACE); i ++ ) {
	    var line = new THREE.Line( ygeom, new THREE.LineBasicMaterial({ color: config.GRID_COLOR, 
									    opacity: config.GRID_OPACITY }));
	    line.position.x = (i * config.GRID_SPACE) - config.HALFSIZE_X;
	    scene.add(line);
	}
    };
    
    method(that, 'draw', draw, _super);

    return that;
};