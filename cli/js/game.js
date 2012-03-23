
/**
 * Game object
 *
 * @extends {}
 * 
 * @param spec {canvas}
 */
var game = function(spec, my) {
  var my = my || {};
  var _super = {};

  my.canvas = spec.canvas;
  my.GL = GL({ canvas: my.canvas,
               fov: 45,
               near: 500,
               far: 4500,
               pos: [0, 0, -3525] });

  my.ship = undefined;
  my.rockets = undefined;
  my.incr = 0;
  
  // public
  var start;       /* start(); */
  var keydown;     /* keydown(evt) */
  var keyup;       /* keydown(evt) */
  
  // protected
  var step;        /* step(); */

  // private
  var render;      /* render(); */
  var push;        /* push() */
  var gid;         /* gid() */
  var mvTo;        /* mvTo(body) */
  var spone;
  var that = world(spec, my);

  /**
   * pushes my.ship state
   */
  push = function() {
    if(that.owners()[my.id]) {
      for(var i = 0; i < that.owners()[my.id].length; i ++) {
        var id = that.owners()[my.id][i];
        var p = that.idx()[id];
        if(p) {
          my.socket.emit('push', { id: p.id(), st: p.state() });
        }
      }
    }
  };
    
  /**
   * keydown handler
   * @param evt
   */
  keydown = function(evt) {	
    var input = '';
    switch(evt.keyCode) {
    case 38: input = config.INPUT_UP; break;
    case 37: input = config.INPUT_LEFT; break;
    case 39: input = config.INPUT_RIGHT; break;
    case 40: input = config.INPUT_DOWN; break;
    case 32: input = config.INPUT_SHOOT; break;	
    default: return;	
    }
    evt.preventDefault();
    if(typeof my.ship !== 'undefined') {
      if(my.ship.inputOn(input)) {
        push();
      }
    }
  };

  /**
   * keyup handler
   * @param evt
   */
  keyup = function(evt) {
    var input = '';
    switch(evt.keyCode) {
    case 38: input = config.INPUT_UP; break;
    case 37: input = config.INPUT_LEFT; break;
    case 39: input = config.INPUT_RIGHT; break;
    case 40: input = config.INPUT_DOWN; break;
    case 32: input = config.INPUT_SHOOT; break;	
    default: return;	
    }
    evt.preventDefault();
    if(typeof my.ship !== 'undefined') {
      if(my.ship.inputOff(input)) {
        push();
      }
    }
  };


  /**
   * starts the game (engine, render, network)
   */
  start = function() {				
    my.gtimer = setInterval(step, config.STEP_TIME);
    my.utimer = setInterval(push, config.UPDATE_TIME);
	
    render();		    
	
    /** distributed simulation interface */
    
    my.socket = io.connect('/game');
	
    my.socket.on('init', function(data) {
      my.id = data.id;
      spawn();
    });	
    
    my.socket.on('create', function(data) {
      if(data.desc.owner !== my.id) {
        switch(data.desc.type) {
        case config.PLANET_TYPE:
        {
          switch(data.desc.model) {
          case 'earth':
            {
              var spec = data.desc;
              spec.GL = my.GL;
              var s = earth(spec);
              that.add(s);
              break;
            }
          case 'moon':
            {
              var spec = data.desc;
              spec.GL = my.GL;
              var m = moon(spec);
              that.add(m);
              break;
            }
          }
          break;
        }            
        case config.SHIP_TYPE:
          {
            switch(data.desc.model) {
            case 'vx0':
              {
                var spec = data.desc;
                spec.GL = my.GL;
                var s = vx0(spec);
                that.add(s);
                break;
              }
            }
            break;
          }            
        case config.MISSILE_TYPE:
          {
            switch(data.desc.model) {
          case 'm0':
              {
                var spec = data.desc;
                spec.GL = my.GL;
                var m = m0(spec);
                that.add(m);
                break;
              }
            }
            break;
          }
        }
      }
    });
    
    my.socket.on('push', function(data) {
      if(typeof that.idx()[data.id] !== 'undefined' &&
         that.idx()[data.id].owner() !== my.id) {
        that.idx()[data.id].update(data.st);
      }
    });	

    my.socket.on('delete', function(data) {
      // [ids]
    });
	
    my.socket.on('kill', function(data) {
      that.clear(data.id);	     
    });
	
    my.socket.on('destroy', function(data) {
      for(var i = 0; i < data.length; i ++) {          
        if(typeof my.ship !== 'undefined' &&
           data[i] === my.ship.id()) {
          delete my.ship;
          setTimeout(spawn, 1000);
        }
        if(that.idx()[data[i]] !== 'undefined') {
          that.idx()[data[i]].destroy();
        }
      }
    });

    setInterval(function() {
      $.getJSON('/score/' + my.id, showScores);
    }, config.UPDATE_TIME);
        
  };

  showScores = function(sc) {
    $("#kill").html(sc.score);
    $("#death").html(sc.death);
  };
  
  /**
   * move the gl model view matrix to the body position
   * @param body the body the model view is going to
   */
  mvTo = function(body) {
    mat4.identity(my.GL.mvMatrix());
    mat4.translate(my.GL.mvMatrix(), [body.position().x,
                                      body.position().y,
                                      0]);	
    mat4.rotate(my.GL.mvMatrix(), body.orientation(), [0, 0, 1]);		
  };
    
  /**
   * renders the current scene
   */
  render = function() {
    my.GL.clear();

    if(typeof my.ship !== 'undefined') {
      my.GL.mvPushMatrix();
      mvTo(my.ship);
      my.ship.simulate();
      my.GL.mvPopMatrix();
    }
    for(var i = 0; i < that.all().length; i ++) {
      my.GL.mvPushMatrix();
      mvTo(that.all()[i]);
      that.all()[i].render();
      my.GL.mvPopMatrix();
    } 
    my.GL.animationFrame(render);
  };
    
  /**
   * steps the engine
   */
  step = function() {
    for(var i = 0; i < that.all().length; i ++) {
      //console.log(that.all()[i].id() + ' ' + that.all()[i].type());
      if(that.all()[i].type() === config.SHIP_TYPE) {
        //console.log(that.all()[i].id() + ' ' + that.all()[i].inputs());
        that.all()[i].thrust();
      }
    }
    _super.step();
  }

  /**
   * returns a global id based on local id
   * and an incremented integer
   * @return gid a global id
   */
  gid = function() {
    return my.id + '-' + (++my.incr);
  };
  
  spawn = function() {
   
    var r = Math.floor(Math.random() * 2 * Math.PI);
    my.ship = vx0({ id: gid(),
                    owner: my.id,
                    color: [1, 0.6, 0, 1],
                    position: {x: (800) * Math.cos(r),
                               y: (800) * Math.sin(r) },
                    velocity: {x: 0.1 * Math.cos(r),
                               y: 0.1 * Math.sin(r) },
                    missile: 'm0',
                    GL: my.GL });
    that.add(my.ship);
    my.socket.emit('create', { desc: my.ship.desc() });
    
    my.ship.on('shoot', function(d) {
      switch(d.model) {
      case 'm0':
        {
          var m = m0({ id: gid(),
                       owner: my.id,
                       position: d.position,
                       velocity: d.velocity,
                       GL: my.GL });
          that.add(m);
          my.socket.emit('create', { desc: m.desc() });
          break;
        }
      default:
      }
    });	
  }
  
  method(that, 'start', start, _super);
  method(that, 'keydown', keydown, _super);
  method(that, 'keyup', keyup, _super);

  method(that, 'step', step, _super);
    
  return that;
};