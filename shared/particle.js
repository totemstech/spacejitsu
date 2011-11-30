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
	my.position = s.p;
	my.velocity = s.v;
	// TODO: slow update
    };

    method(that, 'integrate', integrate);
    method(that, 'apply', apply);

    method(that, 'state', state);
    method(that, 'update', update);
    
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

exports.particle = particle;