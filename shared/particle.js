if(typeof method === 'undefined')
  var method = require('./base.js').method;
if(typeof getter === 'undefined')
  var getter = require('./base.js').getter;
if(typeof setter === 'undefined')
  var setter = require('./base.js').setter;
if(typeof config === 'undefined')
  var config = require('./config.js').config;

if(typeof emitter === 'undefined')
  var emitter = require('./event.js').emitter;


/**
 * Particle Object
 *
 * @extends emitter
 *
 * @emits clear 
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
    var simulate;   /* simulate(particle, step); */

    var desc;       /* desc() */
    var state;      /* state() */
    var update;     /* update(state) */

    var clear;      /* clear() */

    // protected
    var smooth;     /* smooth(a, b, force) */

    var that = emitter(spec, my);

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
     * peforms the smooth or snap of value a, b
     * @param a original value
     * @param b received value
     * @param force snapping
     */
    smooth = function(a, b, force) {
	if(force)
	    return b;
	else
	    return (a + config.SMOOTH_FACTOR * (b - a));
    };

    /**
     * updates the current object with a received state
     * @param state {p, v}
     * @param force snapping
     */
    update = function(s, force) {
	if(typeof s.p !== 'undefined') {
	    var d = Math.sqrt((my.position.x - s.p.x) * (my.position.x - s.p.x) +
			      (my.position.y - s.p.y) * (my.position.y - s.p.y));
	    if(d > config.SNAP_THRESHOLD) {
		my.position = s.p;
	    }
	    else {
		my.position.x = that.smooth(my.position.x, s.p.x, force);
		my.position.y = that.smooth(my.position.y, s.p.y, force);
	    }
	}
	if(typeof s.v !== 'undefined')
	    my.velocity = s.v;
    };

    /**
     * do anything necessary when cleared from simu
     */
    clear = function() {
      that.emit('clear');
    };

    /**
     * simulate n steps ahead of time simulation is part
     * of a particle (after all it's a simulation)
     * @param l number of steps
     * @param step length of steps
     * @return array of position
     */
    simulate = function(l, d) {
	var vel = {x: my.velocity.x, y: my.velocity.y};
	var pos = {x: my.position.x, y: my.position.y};
	var d = d || config.STEP_TIME;
	var res = [];
	
	for(var i = 0; i < l; i ++) {
	    var f = {x: 0, y: 0};
	    if(my.invmass != 0) {
		var n = (pos.x * pos.x) + (pos.y * pos.y);
		var g =  config.GM  / (my.invmass * n);
		f = { x: - pos.x * g / Math.sqrt(n),
		      y: - pos.y * g / Math.sqrt(n)};		
	    }
	    vel.x += f.x * my.invmass * d;
	    vel.y += f.y * my.invmass * d;
	    pos.x += vel.x * d;
	    pos.y += vel.y * d;	
	    
	    res.push({x: pos.x, y: pos.y});
	}
	return res;
    };


    method(that, 'integrate', integrate);
    method(that, 'apply', apply);

    method(that, 'simulate', simulate);

    method(that, 'desc', desc);
    method(that, 'state', state);
    method(that, 'update', update);

    method(that, 'clear', clear);
    
    method(that, 'smooth', smooth);

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