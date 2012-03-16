var method = require('./../shared/base.js').method;
var getter = require('./../shared/base.js').getter;
var setter = require('./../shared/base.js').setter;
var config = require('./../shared/config.js').config;

var particle = require('./../shared/particle.js').particle;
var body = require('./../shared/body.js').body;
var planet = require('./../shared/planet.js').planet;
var ship = require('./../shared/ship.js').ship;
var missile = require('./../shared/missile.js').missile;

var world = require('./../shared/world.js').world;

/**
 * Game Object
 * 
 * @extends world
 *
 * @param spec {io}
 */
var game = function(spec, my) {
  var my = my || {};
  var _super = {};
  // public
  var start;  /* start(); */
  var stop;   /* stop(); */
  var push;   /* push(owner, id, state) */    
  var create; /* create(owner, desc) */ 
  
  // protected
  var step;   /* step(); */

  var that = world(spec, my);

  my.io = spec.io;
  my.players = {};
  
  /**
   * starts the game (engine, render, network)
   */
  start = function() {
    my.gtimer = setInterval(step, config.STEP_TIME);	
    
    var earth = planet({ id: '0-0',
                         owner: '0',
                         model: 'earth',
                         radius: config.PLANET_RADIUS['earth'] });
    that.add(earth);                         

    var moon = planet({ id: '0-1',
                        owner: '0',
                        model: 'moon',
                        invmass: 0.01,
                        rotation: 0.001,
                        position: {x: (400) * Math.cos(Math.PI/100),
                                   y: (400) * Math.sin(Math.PI/100) },
                        velocity: {x: 0.3 * Math.sin(Math.PI/100),
                                   y: 0.3 * Math.cos(Math.PI/100) },
                        radius: config.PLANET_RADIUS['moon'] });
    that.add(moon);                         
    // moon update
    my.utimer = setInterval(function() {
      my.io.of('/game').volatile.emit('push', { id: moon.id(),
                                                st: moon.state() });
      }, config.UPDATE_TIME);
  };

  /**
   * stops the game (engine, render)
   */
  stop = function() {
    if(typeof my.gtimer !== 'undefined')
      clearInterval(my.gtimer);
    delete my.gtimer;
  };

  /**
   * steps the engine
   */
  step = function() {
    for(var i = 0; i < that.all().length; i ++) {
      if(that.all()[i].type() === config.SHIP_TYPE) {
        that.all()[i].thrust();
      }
      if(that.all()[i].type() === config.MISSILE_TYPE) {
      }
    }
    
    for(var j = 0; j < that.all().length; j ++) {
      if(that.all()[j].type() === config.SHIP_TYPE) {
        if(Math.sqrt((that.all()[j].velocity().x) *
                     (that.all()[j].velocity().x) +
                     (that.all()[j].velocity().y) *
                     (that.all()[j].velocity().y)) > config.MAX_VELOCITY) {
          
          that.emit('destroy', [that.all()[j].id()]);
          that.all()[j].destroy();
          that.remove(that.all()[j]);
          console.log("sooo fast");
        }
      }
    }
    
    _super.step();
  };


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
      if(that.idx()[id].type() === config.SHIP_TYPE)
        that.idx()[id].update(state, true); // force ship updates
      else
        that.idx()[id].update(state);
    }
  };
    
  /**
   * If Desc Owner Match Owner The It Creates The
   * Object And Adds It To The Simulation
   * @Param owner the owner
   * @param desc the desc generated data
   */
  create = function(owner, desc) {
    if(owner === desc.owner) {
      switch(desc.type) {
      case config.PARTICLE_TYPE:
      {
        that.add(particle(desc));
        break;
      }
      case config.BODY_TYPE: 
      {
        that.add(body(desc));
        break;
      }
      case config.SHIP_TYPE:
      {
        my.players[owner] = my.players[owner] || 
          {owner: owner, score: 0, death:0};        
        var s = ship(desc);
        that.add(s);
        s.on('collide', function(p) {
          if(p.owner() !== s.owner()) {
            my.players[s.owner()].death++;                
            if(p.type() !== config.PLANET_TYPE) {
              that.emit('destroy', [s.id(), p.id()]);
              s.destroy();
              p.destroy();              
            } else {
              that.emit('destroy', [s.id()]);
              s.destroy();
            }                
          }
        });
        break;
      }
      case config.MISSILE_TYPE:
      {
        var m = missile(desc);
        that.add(m);
        m.on('collide', function(p) {
          if(p.owner() !== m.owner()) {
            if(p.type() !== config.PLANET_TYPE) {
              that.emit('destroy', [m.id(), p.id()]);
              that.remove(p.id());
            }
            else {
              that.emit('destroy', [m.id()]);
            }                
            that.remove(m.id());
          }
        });
        break;
      }
      default:
      }
    }
  };
  
  getScore = function (id) {
    if(id) {
      return my.players[id];
    }
    return my.players;
  };


  method(that, 'start', start, _super);
  method(that, 'stop', stop, _super);
  method(that, 'push', push);
  method(that, 'create', create);    
  method(that, 'getScore', getScore, _super);
  method(that, 'step', step, _super);
    
  return that;
};

exports.game = game;