

/**
 * World object
 *
 * @extends {}
 * 
 * @param spec {container}
 */
var world = function(spec, my) {
    var my = my || {};
    
    my.container = spec.container;
    my.size = { width: 1000,
		height: 1000 };
    
    // public
    var init;   /* init(); */
    var render; /* render(); */

    // private

    var that = {};

    init = function() {

	my.camera = new THREE.PerspectiveCamera( 75, 3/2, 1, 10000 );
	my.camera.position.z = 1305;
	
	/*
	my.camera = new THREE.OrthographicCamera(-1500, 1500, 
						 -1000, 1000, 
						 -2000, 2000);
	my.camera.position.x = 1000;
	my.camera.position.y = 1000;
	my.camera.position.z = 1000;
	*/
	
	my.scene = new THREE.Scene();

	my.scene.add(my.camera);

	var buildgrid = function() {
	    var xgeom = new THREE.Geometry();
	    xgeom.vertices.push( new THREE.Vertex( new THREE.Vector3(-1500, 0, 0)));
	    xgeom.vertices.push( new THREE.Vertex( new THREE.Vector3(1500, 0, 0)));	    
	    for ( var i = 0; i <= 20; i ++ ) {
		var line = new THREE.Line( xgeom, new THREE.LineBasicMaterial( { color: 0x444444, opacity: 0.4 } ) );
		line.position.y = ( i * 100 ) - 1000;
		my.scene.add( line );
	    }
	    var ygeom = new THREE.Geometry();
	    ygeom.vertices.push( new THREE.Vertex( new THREE.Vector3(0, -1000, 0)));
	    ygeom.vertices.push( new THREE.Vertex( new THREE.Vector3(0, 1000, 0)));	    
	    for ( var i = 0; i <= 30; i ++ ) {
		var line = new THREE.Line( ygeom, new THREE.LineBasicMaterial( { color: 0x444444, opacity: 0.4 } ) );
		line.position.x = ( i * 100 ) - 1500;
		my.scene.add( line );
	    }

	}
	
	buildgrid();


	my.renderer = new THREE.CanvasRenderer();
	my.renderer.setSize($('#' + my.container).width(), $('#' + my.container).height());
	
	my.camera.lookAt( my.scene.position );
	
	$('#' + my.container).append(my.renderer.domElement);
    };

    render = function() {
	my.renderer.render(my.scene, my.camera);
    }

    that.init = init;
    that.render = render;
    
    return that;
};