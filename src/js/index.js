/* ======= Global object ======= */
var state;
setDefaultState();

function setDefaultState() {
  /* Setup default state for webgl canvas */
  state = {
    model: tetrahedron,
    transform: {
      translate: [0, 0, -5],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    pickedColor: [1, 1, 1],
    viewMatrix: {
      camera: [0, 0, 1],
      lookAt: [0, 0, 0],
      up: [0, 1, 0],
      near: 0.1,
      far: 50,
    },
    lighting: {
      useLighting: false,
      lightDirection: [1, 0, 1],
    },
    projection: "orthographic", // orthographic, oblique, perspective
    fudgeFactor: 0.0,
    theta: 90.0,
    phi: 90.0,
    animation: {
      isAnimate: false,
      degAnimate: 0.1,
    },
  };
}

/* ======= Get Document Object Model ======= */
const canvas = document.getElementById("canvas");

/* ======= WebGL Functions ======= */
const gl = canvas.getContext("webgl");
var program = createShaderProgram(
  gl,
  vertex_shader_3d,
  fragment_shader_3d_no_lighting
);

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

window.onload = function () {
  if (!gl) {
    alert("WebGL not supported");
  }
  setSliderState();
  colorPicker.value = "#FF0000";
  state.pickedColor = [1, 0, 0];
  render();
};

function clear() {
  /* Setup white screen for webgl canvas */
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function render() {
  /* Render loop for webgl canvas */
  /* Setup */
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  clear();
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.useProgram(program);

  /* insert render logic */
  const camera = setCamera();
  const geometry = setGeometry();
  const transform = setTransform();
  const projection = setProjection();

  if (state.animation.isObjectAnimate) {
    state.transform.rotate[1] +=
      (2 * state.animation.degAnimate * Math.PI) / 100;
  }

  var view = matrices.inverse(camera);
  var viewProjectionMatrix = matrices.multiply(projection, view);
  if (state.fudgeFactor < 0.01) {
    state.fudgeFactor = 0.01;
  }
  var endMatrix = matrices.makeZtoWMatrix(state.fudgeFactor);
  endMatrix = matrices.multiply(endMatrix, viewProjectionMatrix);
  endMatrix = matrices.multiply(endMatrix, transform);

  var uMatrix = gl.getUniformLocation(program, "uMatrix");
  gl.uniformMatrix4fv(uMatrix, false, endMatrix);

  if (state.lighting.useLighting) {
    var uNormal = gl.getUniformLocation(program, "uNormal");
    var normalMatrix = matrices.transpose(matrices.inverse(transform));

    gl.uniformMatrix4fv(uNormal, false, normalMatrix);
    var uniformColor = gl.getUniformLocation(program, "uColor");
    gl.uniform4fv(uniformColor, state.pickedColor.concat(1.0));

    var uReverseLightDirectionLocation = gl.getUniformLocation(
      program,
      "uReverseLightDirection"
    );

    normalizeLight = matrices.normalize(state.lighting.lightDirection);

    gl.uniform3fv(uReverseLightDirectionLocation, normalizeLight);
  } else {
    setColor();
    var vertexColor = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColor);
  }

  gl.drawElements(gl.TRIANGLES, geometry.numFaces, gl.UNSIGNED_SHORT, 0);

  window.requestAnimFrame(render);
}

function setCamera() {
  /* Setup view matrix */
  let deg = state.viewMatrix.lookAt.map((x) => degToRad(x));
  // console.log(deg);

  var viewMatrix = matrices.multiply(
    matrices.translate(0, 0, state.viewMatrix.camera[2]),
    matrices.rotateX(deg[0])
  );
  viewMatrix = matrices.multiply(viewMatrix, matrices.rotateY(deg[1]));
  viewMatrix = matrices.multiply(viewMatrix, matrices.rotateZ(deg[2]));

  let camPos = [viewMatrix[12], viewMatrix[13], viewMatrix[14]];

  let cameraMatrix = matrices.lookAt(
    camPos,
    state.viewMatrix.lookAt,
    state.viewMatrix.up
  );

  return cameraMatrix;
}

function setGeometry() {
  /* Setup geometry */

  const vertices = new Float32Array(state.model.vertices.flat(1));
  const faces = new Uint16Array(state.model.faces.flat(1).map((x) => x - 1));
  const normals = new Float32Array(state.model.normals.flat(1));

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var aPosition = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition);

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

  var aNormal = gl.getAttribLocation(program, "aNormal");
  gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aNormal);

  const faceBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);

  return {
    vertexBuffer,
    normalBuffer,
    faceBuffer,
    numFaces: faces.length,
  };
}

function setColor() {
  const colorBuffer = gl.createBuffer();
  const color = new Float32Array(state.model.colors.flat(1));
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, color, gl.STATIC_DRAW);
}

function setTransform() {
  /* Setup transform matrix */
  let centroid = locateCentroid(state.model.vertices);

  var transformMatrix = matrices.multiply(
    matrices.translate(
      state.transform.translate[0],
      state.transform.translate[1],
      state.transform.translate[2]
    ),
    matrices.translate(centroid[0], centroid[1], centroid[2])
  );

  transformMatrix = matrices.multiply(
    transformMatrix,
    matrices.rotateX(state.transform.rotate[0])
  );

  transformMatrix = matrices.multiply(
    transformMatrix,
    matrices.rotateY(state.transform.rotate[1])
  );

  transformMatrix = matrices.multiply(
    transformMatrix,
    matrices.rotateZ(state.transform.rotate[2])
  );

  transformMatrix = matrices.multiply(
    transformMatrix,
    matrices.scale(
      state.transform.scale[0],
      state.transform.scale[1],
      state.transform.scale[2]
    )
  );

  transformMatrix = matrices.multiply(
    transformMatrix,
    matrices.translate(-centroid[0], -centroid[1], -centroid[2])
  );

  return transformMatrix;
}

function setProjection() {
  /* Setup projection matrix */

  const aspect = canvas.width / canvas.height;
  const fovy = degToRad(45);
  const left = -2;
  const right = 2;
  const bottom = -2;
  const top = 2;
  let farOrtho = state.viewMatrix.far * 1;
  let nearOrtho = -farOrtho;

  if (state.projection === "orthographic") {
    return matrices.orthographic(left, right, bottom, top, nearOrtho, farOrtho);
  } else if (state.projection === "oblique") {
    return matrices.multiply(
      matrices.oblique(state.theta, state.phi),
      matrices.orthographic(left, right, bottom, top, nearOrtho, farOrtho)
    );
  } else if (state.projection === "perspective") {
    return matrices.perspective(
      fovy,
      aspect,
      state.viewMatrix.near,
      state.viewMatrix.far
    );
  }
}
