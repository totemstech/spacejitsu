
/**
 * GL object
 *
 * @extends {}
 * 
 * @param spec {canvas, stype}
 */
var GL = function(spec, my) {
    var my = my || {};
    var _super = {};
    
    my.stype = spec.stype || 'basic'

    my.shaders = {
    basic: { fs: 
	     'precision mediump float;

              varying vec2 vTextureCoord;
              varying vec3 vLightWeighting;

              uniform sampler2D uSampler;
              uniform bool uHasTexture;

              void main(void) {
                  if(!uHasTexture) {
                      gl_FragColor = vec4(vColor.rgb * lightWeighting, vColor.a);
                  }
                  else {
                      vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)); 
                      gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);
                  }
              }',
	     vs:
	     'attribute vec3 aVertexPosition;
              attribute vec3 aVertexNormal;
              attribute vec4 aVertexColor;
              attribute vec2 aTextureCoord;

              uniform mat4 uMVMatrix;
              uniform mat4 uPMatrix;
              uniform mat3 uNMatrix;

              uniform bool uHasTexture;
              uniform bool uUseLighting;

              uniform vec3 uAmbientColor;

              uniform vec3 uLightingDirection;
              uniform vec3 uDirectionalColor;

              varying vec2 vTextureCoord;
              varying vec3 vLightWeighting;

              void main(void) {
                  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
                  
                  if(!uUseTexture) {
                      vColor = aVertexColor;
                  }
                  else {
                      vTextureCoord = aTextureCoord;
                  }

                  if (!uUseLighting) {
                      vLightWeighting = vec3(1.0, 1.0, 1.0);
                  } 
                  else {
                      vec3 transformedNormal = uNMatrix * aVertexNormal;
                      float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);
                      vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;
                  }
              }' }
    };
    
    
    my.canvas = spec.canvas;

    my.mvMatrix = mat4.create();
    my.pMatrix = mat4.create();
    my.mvMatrixStack = [];

    // public
    var setMatrixUniforms;
    var mvPushMatrix;
    var mvPopMatrix;
    var degToRad;    

    // private
    var init;

    var that = {};

    setMatrixUniforms = function() {
	my.gl.uniformMatrix4fv(my.shader.pMatrixUniform, false, my.pMatrix);
        my.gl.uniformMatrix4fv(my.shader.mvMatrixUniform, false, my.mvMatrix);	
    };

    mvPushMatrix = function() {
	var copy = mat4.create();
        mat4.set(my.mvMatrix, copy);
        my.mvMatrixStack.push(copy);	
    };

    mvPopMatrix = function() {
	if (my.mvMatrixStack.length == 0) {
            throw new Error("Invalid popMatrix!");
        }
        my.mvMatrix = my.mvMatrixStack.pop();	
    };    

    degToRad = function(deg) {
	return deg * Math.PI / 180;
    };


    init = function() {
	try {
            my.gl = my.canvas.getContext("experimental-webgl");
        } 
	catch (e) {
	    alert('Could not initialise WebGL: ' + e);
        }
        if (!gl) {
            alert('Could not initialise WebGL');
        }	

        var fshader = my.gl.createShader(my.gl.FRAGMENT_SHADER);
	my.gl.shaderSource(fshader, my.shaders[my.stype].fs);
        my.gl.compileShader(fshader);
        if(!my.gl.getShaderParameter(fshader, my.gl.COMPILE_STATUS)) {
	    throw new Error(my.gl.getShaderInfoLog(fshader));
        }

        var vshader = my.gl.createShader(my.gl.VERTEX_SHADER);
	my.gl.shaderSource(vshader, my.shaders[my.stype].vs);
        my.gl.compileShader(vshader);
        if(!my.gl.getShaderParameter(vshader, my.gl.COMPILE_STATUS)) {
	    throw new Error(my.gl.getShaderInfoLog(vshader));
        }

        my.shader = my.gl.createProgram();
        my.gl.attachShader(my.shader, vshader);
        my.gl.attachShader(my.shader, fshader);
        my.gl.linkProgram(my.shader);

        if (!my.gl.getProgramParameter(my.shader, my.gl.LINK_STATUS)) {
	    throw new Error("Could not initialise shaders");
        }

        my.gl.useProgram(my.shader);

        my.shader.vertexPositionAttribute = my.gl.getAttribLocation(my.shader, "aVertexPosition");
        my.gl.enableVertexAttribArray(my.shader.vertexPositionAttribute);

        my.shader.vertexColorAttribute = my.gl.getAttribLocation(my.shader, "aVertexColor");
        my.gl.enableVertexAttribArray(my.shader.vertexColorAttribute);

	my.shader.textureCoordAttribute = my.gl.getAttribLocation(my.shader, "aTextureCoord");
        my.gl.enableVertexAttribArray(my.shader.textureCoordAttribute);

        my.shader.vertexNormalAttribute = my.gl.getAttribLocation(my.shader, "aVertexNormal");
        my.gl.enableVertexAttribArray(my.shader.vertexNormalAttribute);

        my.shader.pMatrixUniform = my.gl.getUniformLocation(my.shader, "uPMatrix");
        my.shader.mvMatrixUniform = my.gl.getUniformLocation(my.shader, "uMVMatrix");
        my.shader.nMatrixUniform = my.gl.getUniformLocation(my.shader, "uNMatrix");
        my.shader.samplerUniform = my.gl.getUniformLocation(my.shader, "uSampler");
        my.shader.hasTextureUniform = my.gl.getUniformLocation(my.shader, "uHasTexture");
        my.shader.useLightingUniform = my.gl.getUniformLocation(my.shader, "uUseLighting");
        my.shader.ambientColorUniform = my.gl.getUniformLocation(my.shader, "uAmbientColor");
        my.shader.lightingDirectionUniform = my.gl.getUniformLocation(my.shader, "uLightingDirection");
        my.shader.directionalColorUniform = my.gl.getUniformLocation(my.shader, "uDirectionalColor");
    };

    method(that, 'setMatrixUniforms', setMatrixUniforms);
    method(that, 'mvPushMatrix', mvPushMatrix);
    method(that, 'mvPopMatrix', mvPopMatrix);
    method(that, 'degToRad', degToRad);

    getter(that, 'mvMatrix', my, 'mvMatrix');
    getter(that, 'pMatrix', my, 'pMatrix');
    getter(that, 'shader', my, 'shader');

    init();

    return that;
};