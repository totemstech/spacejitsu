/**
 * Body Object
 *
 * @extends {}
 * 
 * @param spec {invmass, invinertia, 
 *              position, orientation,
 *              velocity, rotation,
 *              radius}
 */
var body = function(spec, my) {
    var my = my || {};
    var _super = {};
    
    my.invinertia = spec.invinertia || 0;
    my.orientation = spec.orientation || 0;
    my.rotation = spec.rotation || 0;
    
    my.torque = 0;
    
    // public
    var apply;          /* apply({x, y}, t); */
    var applyWP;        /* apply({x, y}, {x, y}); */
    var applyBP;        /* apply({x, y}, {x, y}); */
    var integrate;      /* integrate(duration); */

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
	var p = { x: pt.x * Math.cos(my.rotation) - pt.y * Math.sin(my.rotation),
		  y: pt.y * Math.sin(my.rotation) + pt.x * Math.cos(my.rotation) };
	applyWP(f, pt);
    };
    
    /** 
     * integrates on duration
     * @param d duration
     */
    integrate = function(d) {
	my.rotation += my.torque * my.invinertia * d;
	// TOOD: add dampling if necessary
	my.orientation += my.rotation * d;

	_super.integrate();
    };
    

    method(that, 'integrate', integrate, _super);
    method(that, 'apply', apply, _super);
    method(that, 'applyWP', applyWP, _super);
    method(that, 'applyBP', applyWP, _super);

    getter(that, 'invinertia', my, 'invinertia');
    getter(that, 'orientation', my, 'orientation');
    getter(that, 'rotation', my, 'rotation');

    return that;
};