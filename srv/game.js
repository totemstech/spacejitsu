var method = require('./../shared/base.js').method;
var getter = require('./../shared/base.js').getter;
var setter = require('./../shared/base.js').setter;
var config = require('./../shared/config.js').config;

var particle = require('./../shared/particle.js').particle;
var body = require('./../shared/body.js').body;
var ship = require('./../shared/ship.js').ship;

var world = require('./../shared/world.js').world;

var game = function(spec, my) {
    var my = my || {};
    var _super = {};

    // public
    var push;   /* push(owner, id, state) */    
    var create; /* create(owner, desc) */ 

    var that = world(spec, my);
    
    /**
     * if state is coming from the owner of the object
     * it updates the state of the object
     * @param owner the owner
     * @param id the object id
     * @param state the new state
     */
    push = function(owner, id, state) {
	if(typeof that.idx()[id] !== 'undefined' &&
	   that.idx()[id].owner() === owner) {
	    that.idx()[id].update(state);
	}
    };
    
    /**
     * if desc owner match owner the it creates the
     * object and adds it to the simulation
     * @param owner the owner
     * @param desc the desc generated data
     */
    create = function(owner, desc) {
	if(owner === desc.owner) {
	    switch(desc.type) {
	      case config.PARTICLE_TYPE:
	        that.add(particle(desc));
	        break;
	      case config.BODY_TYPE: 
	        that.add(body(desc));
	        break;
	      case config.SHIP_TYPE:
	        that.add(ship(desc));
	        break;
	      default:
	    }
	}
    };

    method(that, 'push', push);
    method(that, 'create', create);    
    
    return that;
};

exports.game = game;