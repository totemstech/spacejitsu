if(typeof method === 'undefined')
    var method = require('./base.js').method;
if(typeof getter === 'undefined')
    var getter = require('./base.js').getter;
if(typeof setter === 'undefined')
    var setter = require('./base.js').setter;

if(typeof config === 'undefined')
    var config = require('./config.js').config;

if(typeof particle === 'undefined')
    var particle = require('./particle.js').particle;
if(typeof body === 'undefined')
    var body = require('./body.js').body;


/**
 * World object
 *
 * @extends {}
 * 
 * @param spec {}
 */
var world = function(spec, my) {
    var my = my || {};
    
    my.all = [];    
    my.idx = {};

    // public
    var add;     /* add(particle); */
    var remove;  /* add(particle); */

    // protected
    var step;    /* step() */
    
    var that = {};

    add = function(b) {
	my.idx[b.id()] = b;
	my.all.push(b);
    };

    remove = function(b) {
	delete my.idx[b.id()];
	for(var i = 0; i < my.all.length; i++) {
	    if(my.all[i].id() === b.id()) {
		my.all.splice(i, 1);
		return;
	    }
	}
    };

    step = function() {
	var d = 0;
	if(typeof my.last !== 'undefined')
	    d = new Date() - my.last;

	// client side interruption
	if(d > 2 * config.STEP_TIME) 
	    d = config.STEP_TIME;

	var process = function(a) {
	    // gravity
	    if(a.invmass() != 0) {
		var pos = a.position();
		var n = (pos.x * pos.x) + (pos.y * pos.y);
		var g =  config.GM  / (a.invmass() * n);
		var f = { x: - pos.x * g / Math.sqrt(n),
			  y: - pos.y * g / Math.sqrt(n)};		
		a.apply(f);
	    }	    

	    a.integrate(d);
	    
	    // wrap
	    var pos = a.position();
	    if(pos.x > config.HALFSIZE_X)
		pos.x -=  2 * config.HALFSIZE_X;
	    if(pos.x < -config.HALFSIZE_X)
		pos.x += 2 * config.HALFSIZE_X;
	    if(pos.y > config.HALFSIZE_Y)
		pos.y -=  2 * config.HALFSIZE_Y;
	    if(pos.y < -config.HALFSIZE_Y)
		pos.y += 2 * config.HALFSIZE_Y;	    
	};

	for(var i = 0; i < my.all.length; i ++) {
	    process(my.all[i]);
	}
	
	my.last = new Date();	
    };

    method(that, 'step', step);

    method(that, 'add', add);
    method(that, 'remove', remove);

    getter(that, 'idx', my, 'idx');
    getter(that, 'all', my, 'all');

    return that;
};

exports.world = world;