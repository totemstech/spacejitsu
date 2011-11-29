/**
 * Ship Object
 *
 * @extends obj
 * 
 * @param spec {}
 */
var ship = function(spec, my) {
    var my = my || {};
    var _super = {};
    
    spec.invmass = 0;    // does not move
    spec.invinertia = 0; // does not move   
    spec.radius = 20;
    spec.orientation = 0;

    var that = obj(spec, my);

    return that;
};