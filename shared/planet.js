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
 * Planet Object
 *
 * @extends body
 *
 * @param spec {id, owner, type, model,
 *              invmass, invinertia,
 *              position, orientation,
 *              velocity, rotation,
 *              radius}
 */
var planet = function(spec, my) {
  var my = my || {};
  var _super = {};        
    
  spec.type = spec.type || config.PLANET_TYPE;
  my.model = spec.model || config.DEFAULT_MODEL;

  my.invmass = spec.invmass || 0;
  my.invinertia = spec.invinertia || 0;

  // public
  var desc;       /* desc()  */
  var state;      /* state() */
  var update;     /* update(state) */

  var that = body(spec, my);

  /**
   * returns the description of the body
   */
  desc = function() {
    var d = _super.desc();
    d.model = my.model;
    return d;
  };

  method(that, 'desc', desc, _super);
  getter(that, 'model', my, 'model');

  return that;
};

exports.planet = planet;
