if(typeof method === 'undefined')
    var method = require('./base.js').method;
if(typeof getter === 'undefined')
    var getter = require('./base.js').getter;
if(typeof setter === 'undefined')
    var setter = require('./base.js').setter;
if(typeof config === 'undefined')
    var config = require('./config.js').config;


/**
 * Particle Object
 *
 * @extends {}
 * 
 * @param spec {id, owner, type, invmass, position, velocity, radius}
 */
var particle = function(spec, my) {
    var my = my || {};

    my.id = spec.id || 'invalid';
    my.owner = spec.owner || 'nobody';
    my.type = spec.type || config.PARTICLE_TYPE;

    my.invmass = spec.invmass || 0;    
    my.radius = spec.radius || 0;  // collision detection

    my.position = spec.position || { x: 0, y:0 };
    my.velocity = spec.velocity || { x: 0, y:0 };

    my.force = { x: 0, y: 0 };

    // public
    var apply;      /* apply({x, y}); */
    var integrate;  /* integrate(duration); */

    var desc;       /* desc() */
    var state;      /* state() */
    var update;     /* update(state) */

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
	my.velocity.x += my.force.x * my.invmass * d;
	my.velocity.y += my.force.y * my.invmass * d;	
	// TOOD: add dampling if necessary
	my.position.x += my.velocity.x * d;
	my.position.y += my.velocity.y * d;	
	
	my.force = { x: 0, y: 0 };
    };

    /**
     * returns the description of the particle
     */
    desc = function() {
	return { id: my.id,
		 owner: my.owner,
		 type: my.type,
	         invmass: my.invmass,		 
		 radius: my.radius,
		 position: my.position,
		 velocity: my.velocity };		 
    };

    /**
     * returns the state of the particle
     */
    state = function() {
	return { p: my.position,
		 v: my.velocity };		 
    };

    /**
     * updates the current object with a received state
     * @param state {p, v}
     */
    update = function(s) {
	if(typeof s.p !== 'undefined') {
	    my.position.x = 8/10 * my.position.x + 2/10 * s.p.x;
	    my.position.y = 8/10 * my.position.y + 2/10 * s.p.y;
	}
	my.velocity.x = s.v.x;
	my.velocity.y = s.v.y;
    };

    method(that, 'integrate', integrate);
    method(that, 'apply', apply);

    method(that, 'desc', desc);
    method(that, 'state', state);
    method(that, 'update', update);
    
    getter(that, 'id', my, 'id');
    getter(that, 'owner', my, 'owner');
    getter(that, 'type', my, 'type');

    getter(that, 'invmass', my, 'invmass');
    getter(that, 'radius', my, 'radius');
    getter(that, 'position', my, 'position');
    getter(that, 'velocity', my, 'velocity');
    getter(that, 'force', my, 'force');

    setter(that, 'invmass', my, 'invmass');
    setter(that, 'radius', my, 'radius');
    setter(that, 'position', my, 'position');
    setter(that, 'velocity', my, 'velocity');
    setter(that, 'force', my, 'force');

    return that;
};

exports.particle = particle;