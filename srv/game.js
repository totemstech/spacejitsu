var world = require('./../shared/world.js').word;

var game = function(spec, my) {
    var my = my || {};
    var _super = {};

    my.ships = [];
    my.rockets = [];

    var that = world(spec, my);
    
    

    return that;
};

exports.game = game;