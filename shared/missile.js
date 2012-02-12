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
 * Missile Object
 *
 * @extends body
 *
 * @emits destroy
 * 
 * @param spec {id, owner, type, model,
 *              invmass, position, velocity,
 *              radius, lifespan}
 */
var missile = function(spec, my) {
    var my = my || {};
    var _super = {};        
    
    spec.type = spec.type || config.MISSILE_TYPE;
    my.model = spec.model || config.DEFAULT_MODEL;
    my.lifespan = spec.lifespan || config.DEFAULT_LIFESPAN;
   
    // public
    var desc; 
    var state;
    var update;

    var that = body(spec, my);

    // destruction
    setTimeout(function() {
        that.emit('destroy');
      }, my.lifespan);

    /**
     * returns the description of the body
     */
    desc = function() {
	var d = _super.desc();
	d.model = my.model;
        d.lifespan = my.lifespan;
	return d;
    };

    /**
     * returns the state of the body
     */
    state = function() {
	var s = _super.state();
	return s;
    };
        
    /**
     * updates the current object with a received state
     * @param state {p, v}
     * @param force snapping
     */
    update = function(s, force) {
	_super.update(s, force);
    };
    
    method(that, 'desc', desc, _super);
    method(that, 'state', state, _super);
    method(that, 'update', update, _super);

    getter(that, 'model', my, 'model');
    getter(that, 'death', my, 'death');
    
    return that;
};

exports.missile = missile;