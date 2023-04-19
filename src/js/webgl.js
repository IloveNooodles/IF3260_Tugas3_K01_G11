/* ======= Shader object ======= */
const vertex_shader_3d = `
attribute vec3 aPosition;
attribute vec3 aColor;
attribute vec3 aNormal;
attribute vec2 aTexture;

uniform mat4 uWorldViewProjection;
uniform mat4 uWorldInverseTranspose;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec4 fragColor;
varying vec2 vTexture;
varying float colorFactor;

void main(void) {
    gl_Position = uWorldViewProjection * vec4(aPosition, 1.0);
  
    vPosition = (uWorldInverseTranspose * vec4(aPosition, 1.0)).xyz;
    vNormal = mat3(uWorldInverseTranspose) * aNormal;
    fragColor = vec4(aColor, 1.0);
    vTexture = aTexture;
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
    gl_FragColor.rgb *= light;
}
`;

const fragment_shader_3d_no_lighting = `
precision mediump float;
varying vec4 fragColor;

void main(void) {
    gl_FragColor = fragColor;
}
`;

const fragment_shader_texture = `
precision mediump float;

varying vec2 vTexture;

uniform sampler2D uTexture;

void main(void) {
  gl_FragColor = texture2D(uTexture, vTexture);
}
`;

const fragment_shader_environment = `
precision mediump float;

varying vec3 vPosition;
varying vec3 vNormal;

uniform samplerCube uTexture;

uniform vec3 uWorldCameraPosition;

void main(void) {
  vec3 worldNormal = normalize(vNormal);
  vec3 eyeToSurfaceDir = normalize(vPosition - uWorldCameraPosition);
  vec3 direction = reflect(eyeToSurfaceDir, worldNormal);

  gl_FragColor = textureCube(uTexture, direction);
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

function initAttribs(gl, program) {
  return {
    position: gl.getAttribLocation(program, "aPosition"),
    color: gl.getAttribLocation(program, "aColor"),
    normal: gl.getAttribLocation(program, "aNormal"),
    texture: gl.getAttribLocation(program, "aTexture"),
  };
}

function setAttribs(attribSetters, attribs) {
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, attribs.aPosition.buffer, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attribSetters.position);
  gl.vertexAttribPointer(attribSetters.position, 3, gl.FLOAT, false, 0, 0);

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, attribs.aNormal.buffer, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attribSetters.normal);
  gl.vertexAttribPointer(attribSetters.normal, 3, gl.FLOAT, false, 0, 0);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, attribs.aColor.buffer, gl.STATIC_DRAW);
  gl.vertexAttribPointer(attribSetters.color, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribSetters.color);

  const textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, attribs.aTexture.buffer, gl.STATIC_DRAW);
  gl.vertexAttribPointer(attribSetters.texture, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribSetters.texture);
}

function initUniforms(gl, program) {
  return {
    worldViewProjection: gl.getUniformLocation(program, "uWorldViewProjection"),
    worldInverseTranspose: gl.getUniformLocation(
      program,
      "uWorldInverseTranspose"
    ),
    color: gl.getUniformLocation(program, "uColor"),
    reverseLightDirection: gl.getUniformLocation(
      program,
      "uReverseLightDirection"
    ),
    texture: gl.getUniformLocation(program, "uTexture"),
    worldCameraPosition: gl.getUniformLocation(program, "uWorldCameraPosition"),
  };
}

function setUniforms(uniformSetters, uniforms) {
  gl.uniformMatrix4fv(
    uniformSetters.worldViewProjection,
    false,
    uniforms.uWorldViewProjection
  );
  gl.uniformMatrix4fv(
    uniformSetters.worldInverseTranspose,
    false,
    uniforms.uWorldInverseTranspose
  );
  gl.uniform4fv(uniformSetters.color, uniforms.uColor);
  gl.uniform3fv(
    uniformSetters.reverseLightDirection,
    uniforms.uReverseLightDirection
  );
  gl.uniform1i(uniformSetters.texture, 0);
}
