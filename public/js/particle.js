/**
 * Particle Object
 *
 * @extends {}
 * 
 * @param spec {invmass, position, velocity, radius}
 */
var particle = function(spec, my) {
    var my = my || {};

    my.invmass = spec.invmass || 0;    
    my.position = spec.position || { x: 0, y:0 };
    my.velocity = spec.velocity || { x: 0, y:0 };
    my.radius = spec.radius || 0;  // collision detection

    my.force = { x: 0, y: 0 };

    // public
    var apply;      /* apply({x, y}); */
    var integrate;  /* integrate(duration); */
    
    var that = {};

    /** 
     * applies the force f to the particle
     * @param f {x, y}
     */
    apply = function(f) {	
	if(f && typeof f.x === 'number')
	    my.force.x += f.x;
	if(f && typeof f.y === 'number')
	    my.force.y += f.y;
    };
    
    /** 
     * integrates on duration
     * @param d duration
     */
    integrate = function(d) {
	console.log(JSON.stringify(my.force));
	console.log(JSON.stringify(my.velocity));
	console.log(JSON.stringify(my.position));

	my.velocity.x += my.force.x * my.invmass * d;
	my.velocity.y += my.force.y * my.invmass * d;	
	// TOOD: add dampling if necessary
	my.position.x += my.velocity.x * d;
	my.position.y += my.velocity.y * d;	
	
	my.force = { x: 0, y: 0 };
    };

    method(that, 'integrate', integrate);
    method(that, 'apply', apply);
    
    getter(that, 'position', my, 'position');
    getter(that, 'velocity', my, 'velocity');
    getter(that, 'invmass', my, 'invmass');
    getter(that, 'radius', my, 'radius');
    getter(that, 'force', my, 'force');

    setter(that, 'position', my, 'position');
    setter(that, 'velocity', my, 'velocity');
    setter(that, 'invmass', my, 'invmass');
    setter(that, 'radius', my, 'radius');
    setter(that, 'force', my, 'force');

    return that;
};