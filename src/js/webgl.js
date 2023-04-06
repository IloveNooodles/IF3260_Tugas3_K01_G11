/* ======= Shader object ======= */
const vertex_shader_3d = `
attribute vec3 aPosition;
attribute vec3 aColor;
attribute vec3 aNormal;

uniform mat4 uMatrix;
uniform mat4 uNormal;

varying vec3 vNormal;
varying vec4 fragColor;
varying float colorFactor;

void main(void) {
    gl_Position = uMatrix * vec4(aPosition, 1.0);
  
    vNormal = mat3(uNormal) * aNormal;
    fragColor = vec4(aColor, 1.0);  
}
`;

const fragment_shader_3d = `
precision mediump float;

varying vec3 vNormal;

uniform vec3 uReverseLightDirection;
uniform vec4 uColor;

void main(void) {
    vec3 normal = normalize(vNormal);

    float light = dot(normal, uReverseLightDirection);
    gl_FragColor = uColor;
    //add the ambience light
    gl_FragColor.rgb *= (light + vec3(0.25, 0.25, 0.25));
}
`;

const fragment_shader_3d_no_lighting = `
precision mediump float;
varying vec4 fragColor;

void main(void) {
    gl_FragColor = fragColor;
}
`;

/* ======= WebGL Init ======= */

function loadShader(gl, type, input) {
  let shader = gl.createShader(type);

  gl.shaderSource(shader, input);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling vertex shader!",
      gl.getShaderInfoLog(shader)
    );
    return null;
  }

  return shader;
}

function createShaderProgram(gl, vertexShaderText, fragmentShaderText) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderText);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR linking program!", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return;
  }

  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error("ERROR validating program!", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return;
  }

  /* dont forget to delete shader after use it  */
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}
