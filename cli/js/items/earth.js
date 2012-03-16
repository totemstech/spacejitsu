/**
 * Earth Object
 *
 * @extends planet
 * 
 * @param spec {GL}
 */
var earth = function(spec, my) {
  var my = my || {};
  var _super = {};
  
  spec.model = 'earth';
  spec.radius = config.PLANET_RADIUS['earth'];
  spec.rotation = 0.0002;

  my.GL = spec.GL;

  my.sphere = sphere({GL: my.GL,
                      radius: spec.radius,
                      textureLink: '/img/earth.gif',
                      useTexture: true});                      

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