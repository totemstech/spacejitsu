/**
 * Moon Object
 *
 * @extends planet
 * 
 * @param spec {GL}
 */
var moon = function(spec, my) {
  var my = my || {};
  var _super = {};
  
  spec.model = 'moon';
  spec.radius = config.PLANET_RADIUS['moon'];
  spec.invmass = 0.1;
  
  my.GL = spec.GL;

  my.sphere = sphere({GL: my.GL,
                      radius: spec.radius,
                      textureLink: '/img/moon.gif'});
  
  // public
  var init;    /* init(scene); */
  var render;  /* render() */
  
  var that = planet(spec, my);
  
  /**
   * renders the object (step)
   */
  render = function() {
    my.sphere.draw();
  };
  
  method(that, 'render', render);
  method(that, 'init', init);
  
  return that;
};
