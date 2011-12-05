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
 * Shoot Object
 *
 * @extends body
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
