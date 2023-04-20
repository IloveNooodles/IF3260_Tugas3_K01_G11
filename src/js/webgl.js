/* ======= Shader object ======= */
const vertex_shader_3d = `
attribute vec3 aPosition;
attribute vec3 aColor;
attribute vec3 aTangent;
attribute vec3 aBitangent;
attribute vec3 aNormal;
attribute vec2 aTexture;

uniform mat4 uWorldViewProjection;
uniform mat4 uWorldInverseTranspose;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec4 fragColor;
varying vec2 vTexture;
varying float colorFactor;
varying mat4 viewMatrix;
varying mat3 vTBN;
varying vec3 ts_light_pos; 
varying vec3 ts_view_pos;  
varying vec3 ts_frag_pos;

mat3 transpose(in mat3 inMatrix)
{
    vec3 i0 = inMatrix[0];
    vec3 i1 = inMatrix[1];
    vec3 i2 = inMatrix[2];

    mat3 outMatrix = mat3(
        vec3(i0.x, i1.x, i2.x),
        vec3(i0.y, i1.y, i2.y),
        vec3(i0.z, i1.z, i2.z)
    );

    return outMatrix;
}

void main(void) {
    viewMatrix = uWorldViewProjection;
    gl_Position = uWorldViewProjection * vec4(aPosition, 1.0);
  
    vPosition = (uWorldInverseTranspose * vec4(aPosition, 1.0)).xyz;
    vNormal = mat3(uWorldInverseTranspose) * aNormal;
    fragColor = vec4(aColor, 1.0);
    vTexture = aTexture;

    vec3 t = normalize(mat3(uWorldInverseTranspose) * aTangent);
    vec3 b = normalize(mat3(uWorldInverseTranspose) * aBitangent);
    vec3 n = normalize(mat3(uWorldInverseTranspose) * aNormal);
    mat3 tbn = transpose(mat3(t, b, n));

    ts_frag_pos = vec3(uWorldViewProjection * vec4(aPosition, 1.0));

    vTBN = tbn;
    vec3 light_pos = vec3(0, 0, 1);
    ts_light_pos = tbn * light_pos;
    ts_view_pos = tbn * vec3(0, 0, 0);
    ts_frag_pos = tbn * ts_frag_pos;
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

const fragment_shader_bump = `
precision mediump float;

uniform sampler2D uTexture;
uniform vec3 uReverseLightDirection;
uniform vec4 uColor;

varying mat4 viewMatrix;
varying mat3 vTBN;
varying vec3 vNormal;
varying vec2 vTexture;
varying vec3 ts_light_pos;
varying vec3 ts_view_pos;
varying vec3 ts_frag_pos;

void main(void)
{
    vec3 normal = normalize(vNormal);
    vec3 light_dir = normalize(ts_light_pos - ts_frag_pos);
    vec3 albedo = texture2D(uTexture, vTexture).rgb;
    vec3 ambient = albedo * 0.3;

    vec3 bump = normalize(texture2D(uTexture, vTexture).rgb * 2.0 - 1.0);

    float light = max(dot(light_dir, bump), 0.0);  
    
    gl_FragColor = vec4(albedo * light + ambient, 1.0);
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
    // bump_pos: gl.getAttribLocation(program, "vert_pos"),
    bump_tang: gl.getAttribLocation(program, "aTangent"),
    bump_bitang: gl.getAttribLocation(program, "aBitangent"),
    // bump_uv: gl.getAttribLocation(program, "aUpVector")
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

  const vbo_tang = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo_tang);
  gl.bufferData(gl.ARRAY_BUFFER, attribs.aTangent.buffer, gl.STATIC_DRAW);
  gl.vertexAttribPointer(attribSetters.bump_tang, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribSetters.bump_tang);

  const vbo_bitang = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo_bitang);
  gl.bufferData(gl.ARRAY_BUFFER, attribs.aBitangent.buffer, gl.STATIC_DRAW);
  gl.vertexAttribPointer(attribSetters.bump_bitang, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribSetters.bump_bitang);
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
    modelMatrix: gl.getUniformLocation(program, "uModelMatrix"),
    // normMatrix: gl.getUniformLocation(program, "norm_mtx"),
    // projMatrix: gl.getUniformLocation(program, "proj_mtx"),
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
  gl.uniformMatrix4fv(uniformSetters.modelMatrix, false, uniforms.uModelMatrix);
  // gl.uniformMatrix4fv(uniformSetters.normMatrix, false, matrices.transpose(matrices.inverse(model))); // ganti var model
}
