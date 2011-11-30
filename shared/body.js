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

/**
 * Body Object
 *
 * @extends {}
 * 
 * @param spec {id, owner, invmass, invinertia, 
 *              position, orientation,
 *              velocity, rotation,
 *              radius}
 */
var body = function(spec, my) {
    var my = my || {};
    var _super = {};
    
    spec.type = spec.type || config.BODY_TYPE;

    my.invinertia = spec.invinertia || 0;
    my.orientation = spec.orientation || 0;
    my.rotation = spec.rotation || 0;
    
    my.torque = 0;
    
    // public
    var apply;          /* apply({x, y}, t); */
    var applyWP;        /* apply({x, y}, {x, y}); */
    var applyBP;        /* apply({x, y}, {x, y}); */
    var integrate;      /* integrate(duration); */

    var desc;       /* desc() */
    var state;      /* state() */
    var update;     /* update(state) */

    var that = particle(spec, my);
    
    /** 
     * applies the force f and torque t to the obj
     * @param f {x, y} force
     * @param t torque 
     */
    apply = function(f, t) {		
	_super.apply(f);
	if(typeof t === 'number')
	    my.torque += t;
    };
    
    /**
     * applies the force f at world point pt
     * @param f {x, y} force
     * @param pt {x,y} world point
     */
    applyWP = function(f, pt) {
	var p = { x: pt.x - my.position.x,
		  y: pt.y - my.position.y };
	var t = p.x*f.y - p.y*f.x;
	apply(f, t);
    };
    
    /**
     * applies the force f at body point pt
     * @param f {x, y} force
     * @param pt {x,y} world point
     */
    applyBP = function(f, pt) {	
	var p = { x: my.position.x + pt.x * Math.cos(my.rotation) - pt.y * Math.sin(my.orientation),
		  y: my.position.y + pt.x * Math.sin(my.rotation) + pt.y * Math.cos(my.orientation) };
	var ft = { x: f.x * Math.cos(my.orientation) - f.y * Math.sin(my.orientation),
		   y: f.x * Math.sin(my.orientation) + f.y * Math.cos(my.orientation) };
	applyWP(ft, p);
    };
    
    /** 
     * integrates on duration
     * @param d duration
     */
    integrate = function(d) {
	my.rotation += my.torque * my.invinertia * d;
	// TOOD: add dampling if necessary
	my.orientation += my.rotation * d;

	my.torque = 0;
	_super.integrate(d);
    };

    /**
     * returns the description of the body
     */
    desc = function() {
	var d = _super.desc();
	d.invinertia = my.invinertia;
	d.orientation = my.orientation;
	d.rotation = my.rotation;
	return d;
    };

    /**
     * returns the state of the body
     */
    state = function() {
	var s = _super.state();
	s.o = my.orientation;
	s.r = my.rotation;
	return s;
    };

    /**
     * updates the current object with a received state
     * @param state {p, v}
     */
    update = function(s) {
	_super.update(s);
	if(typeof s.o !== 'undefined') my.orientation = s.o;
	if(typeof s.r !== 'undefined') my.rotation = s.r;
	// TODO: slow update
    };
    

    method(that, 'integrate', integrate, _super);
    method(that, 'apply', apply, _super);
    method(that, 'applyWP', applyWP, _super);
    method(that, 'applyBP', applyBP, _super);

    method(that, 'desc', desc, _super);
    method(that, 'state', state, _super);
    method(that, 'update', update, _super);

    getter(that, 'invinertia', my, 'invinertia');
    getter(that, 'orientation', my, 'orientation');
    getter(that, 'rotation', my, 'rotation');

    return that;
};

exports.body = body;