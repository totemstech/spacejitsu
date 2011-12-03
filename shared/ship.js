if(typeof method === 'undefined')
    var method = require('./base.js').method;
if(typeof getter === 'undefined')
    var getter = require('./base.js').getter;
if(typeof setter === 'undefined')
    var setter = require('./base.js').setter;

if(typeof config === 'undefined')
    var config = require('./config.js').config;

if(typeof body === 'undefined')
    var body = require('./body.js').body;

/**
 * Ship Object
 *
 * @extends obj
 * 
 * @param spec {id, owner, type, model,
 *              invmass, invinertia, 
 *              position, orientation,
 *              velocity, rotation,
 *              radius, thrust}
 */
var ship = function(spec, my) {
    var my = my || {};
    var _super = {};        
    
    spec.type = spec.type || config.SHIP_TYPE;
    my.thrust = spec.thrust || config.DEFAULT_THRUST;
    my.model = spec.model || config.DEFAULT_MODEL;

    my.inputs = [];    

    // public
    var desc;       /* desc()  */
    var state;      /* state() */
    var update;     /* update(state) */

    var on;    /* on(input) */
    var off;   /* off(input) */
    var thrust; /* thrust() */

    var that = body(spec, my);

    /**
     * adds an input to the input set
     * @param input
     */
    on = function(input) {
	for(var i = 0; i < my.inputs.length; i++) {
	    if(my.inputs[i] === input)
		return false;
	}
	my.inputs.push(input);
	return true;
    };

    /**
     * remove an input from the input set
     * @param input
     */
    off = function(input) {
	for(var i = 0; i < my.inputs.length; i++) {
	    if(my.inputs[i] === input) {
		my.inputs.splice(i, 1);
		return true;
	    }
	}
	return false;
    };

    /**
     * applies the forces from inputs
     */
    thrust = function() {
	my.rotation = 0;
	for(var i = 0; i < my.inputs.length; i ++) {
	    switch(my.inputs[i]) {
	      case config.INPUT_UP: 
		  that.applyBP({x: 0, y: my.thrust.push}, {x: 0, y: 0});
		  break;
	      case config.INPUT_LEFT: 
	          my.rotation += my.thrust.rot;
		  break;
	      case config.INPUT_RIGHT: 
	          my.rotation -= my.thrust.rot;
		  break;
	    }
	}
    };

    /**
     * returns the description of the body
     */
    desc = function() {
	var d = _super.desc();
	d.thrust = my.thrust;
	d.model = my.model;
	return d;
    };

    /**
     * returns the state of the body
     */
    state = function() {
	var s = _super.state();
	s.i = my.inputs;
	return s;
    };
        
    /**
     * updates the current object with a received state
     * @param state {p, v}
     * @param force snapping
     */
    update = function(s, force) {
	_super.update(s, force);
	if(typeof s.i !== 'undefined') my.inputs = s.i;
    };


    method(that, 'desc', desc, _super);
    method(that, 'state', state, _super);
    method(that, 'update', update, _super);

    method(that, 'on', on);
    method(that, 'off', off);
    method(that, 'thrust', thrust);

    getter(that, 'inputs', my, 'inputs');
    getter(that, 'model', my, 'model');

    return that;
};

exports.ship = ship;