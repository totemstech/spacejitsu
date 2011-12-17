/**
 * Voxel object
 *
 * @extends {}
 * 
 * @param spec {GL, size}
 */
var voxel = function(spec, my) {
    var my = my || {};
    var _super = {};
    
    my.GL = spec.GL;
    my.gl = spec.GL.gl();
    my.size = spec.size || 5.0;

    my.voxelVertexPositionBuffer = my.gl.createBuffer();
    my.voxelVertexColorBuffer = my.gl.createBuffer();
    my.voxelVertexIndexBuffer = my.gl.createBuffer();

    // public
    var setColor; /* setColor([1.0, 0.0, 0.0, 1.0]); */
    var draw;     /* draw() */

    // private;
    var init;

    var that = {};

    /**
     * Sets the color of the current voxel
     * @param color rgba array     
     */
    setColor = function(color) {
        my.gl.bindBuffer(my.gl.ARRAY_BUFFER, my.voxelVertexColorBuffer);
        var unpacked = [];
        for (var i = 0 ; i < 6; i ++) {
            for (var j = 0; j < 4; j++) {
                unpacked = unpacked.concat(color);
            }
        }
        my.gl.bufferData(my.gl.ARRAY_BUFFER, new Float32Array(unpacked), my.gl.STATIC_DRAW);
        my.voxelVertexColorBuffer.itemSize = 4;
        my.voxelVertexColorBuffer.numItems = 24;
    };


    /**
     * Draws the voxel using the current GL matrix context
     */
    draw = function() {
	my.gl.bindBuffer(my.gl.ARRAY_BUFFER, my.voxelVertexPositionBuffer);
        my.gl.vertexAttribPointer(my.GL.shader().vertexPositionAttribute, 
				  my.voxelVertexPositionBuffer.itemSize, my.gl.FLOAT, false, 0, 0);

        my.gl.bindBuffer(my.gl.ARRAY_BUFFER, my.voxelVertexColorBuffer);
        my.gl.vertexAttribPointer(my.GL.shader().vertexColorAttribute, 
				  my.voxelVertexColorBuffer.itemSize, my.gl.FLOAT, false, 0, 0);

        my.gl.bindBuffer(my.gl.ELEMENT_ARRAY_BUFFER, my.voxelVertexIndexBuffer);
	my.GL.setMatrixUniforms();
        my.gl.drawElements(my.gl.TRIANGLES, my.voxelVertexIndexBuffer.numItems, my.gl.UNSIGNED_SHORT, 0);	
    };


    /**
     * Buffer initialization
     */
    init = function() {
	my.gl.bindBuffer(my.gl.ARRAY_BUFFER, my.voxelVertexPositionBuffer);
	var vertices = [// Front face
			-my.size, -my.size,  my.size,
			my.size, -my.size,  my.size,
			my.size,  my.size,  my.size,
			-my.size,  my.size,  my.size,
			
			// Back face
			-my.size, -my.size, -my.size,
			-my.size,  my.size, -my.size,
			my.size,  my.size, -my.size,
			my.size, -my.size, -my.size,
			
			// Top face
			-my.size,  my.size, -my.size,
			-my.size,  my.size,  my.size,
			my.size,  my.size,  my.size,
			my.size,  my.size, -my.size,
			
			// Bottom face
			-my.size, -my.size, -my.size,
			my.size, -my.size, -my.size,
			my.size, -my.size,  my.size,
			-my.size, -my.size,  my.size,
			
			// Right face
			my.size, -my.size, -my.size,
			my.size,  my.size, -my.size,
			my.size,  my.size,  my.size,
			my.size, -my.size,  my.size,
			
			// Left face
			-my.size, -my.size, -my.size,
			-my.size, -my.size,  my.size,
			-my.size,  my.size,  my.size,
			-my.size,  my.size, -my.size];
        my.gl.bufferData(my.gl.ARRAY_BUFFER, new Float32Array(vertices), my.gl.STATIC_DRAW);
        my.voxelVertexPositionBuffer.itemSize = 3;
        my.voxelVertexPositionBuffer.numItems = 24;
	
	setColor([1.0, 1.0, 1.0, 1.0]);
	
        my.gl.bindBuffer(my.gl.ELEMENT_ARRAY_BUFFER, my.voxelVertexIndexBuffer);
        var indices = [0, 1, 2,      0, 2, 3,    // Front face
		       4, 5, 6,      4, 6, 7,    // Back face
		       8, 9, 10,     8, 10, 11,  // Top face
		       12, 13, 14,   12, 14, 15, // Bottom face
		       16, 17, 18,   16, 18, 19, // Right face
		       20, 21, 22,   20, 22, 23  // Left face
		       ];
        my.gl.bufferData(my.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), my.gl.STATIC_DRAW);
        my.voxelVertexIndexBuffer.itemSize = 1;
        my.voxelVertexIndexBuffer.numItems = 36;	
    };

    method(that, 'setColor', setColor);
    method(that, 'draw', draw);

    init();

    return that;
};