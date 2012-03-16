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
  spec.latbands = 10;
  spec.lngbands = 10;

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
    // earth readjustment
    mat4.rotate(my.GL.mvMatrix(), Math.PI / 2.0, [1, 0, 0]);		
    my.sphere.draw();
  };


  method(that, 'render', render);
  method(that, 'init', init);
  
  return that;
};