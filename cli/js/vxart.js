/**
 * Voxel Art object
 *
 * @extends {}
 * 
 * @param spec {GL, halfsize, data}
 */
var vxart = function(spec, my) {
  var my = my || {};
  var _super = {};
  
  my.GL = spec.GL;
  my.gl = spec.GL.gl();
  my.halfsize = spec.halfsize || 5.0;
  my.vx = voxel({GL: my.GL,
                 halfsize: my.halfsize});
  
  /** [{p: [x,y,z], c: [r,g,b,a]}, ...] */
  my.data = spec.data || [];
  
  // public
  var draw;  /* draw() */
  
  var that = {};

  /**
   * Draws the voxel art object using the current GL matrix context
   */
  draw = function() {
    var last = [0, 0, 0];
    for(var i = 0; i < my.data.length; i ++) {
      my.vx.setColor(my.data[i].c);
      mat4.translate(my.GL.mvMatrix(), [my.data[i].p[0] * 2.0 * my.halfsize - last[0], 
                                        my.data[i].p[1] * 2.0 * my.halfsize - last[1], 
                                        my.data[i].p[2] * 2.0 * my.halfsize - last[2]]);	
      last[0] = my.data[i].p[0] * 2.0 * my.halfsize;
      last[1] = my.data[i].p[1] * 2.0 * my.halfsize;
      last[2] = my.data[i].p[2] * 2.0 * my.halfsize;      
      my.vx.draw();
    }
  };
  
  method(that, 'draw', draw);
  
  return that;
};
