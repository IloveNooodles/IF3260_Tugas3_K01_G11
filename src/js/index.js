/* ======= Global object ======= */
var state;
setDefaultState();

function setDefaultState() {
  /* Setup default state for webgl canvas */
  state = {
    model: cube,
    transform: {
      translate: [0, 0, 0],
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
      lightDirection: [0.5, 0.7, 1],
    },
    projection: "orthographic", // orthographic, oblique, perspective
    fudgeFactor: 0.0,
    theta: 15.0,
    phi: 75.0,
    animation: {
      isAnimate: false,
      degAnimate: 0.1,
    },
  };
  if (state.projection === "perspective") {
    state.transform.translate[2] = -5;
  } else {
    state.transform.translate[2] = 0;
  }
}

function setSliderState() {
  /* setup default state for sliders */

  rangeTranslateX.value = state.transform.translate[0];
  translateXValue.innerHTML = state.transform.translate[0];
  rangeTranslateY.value = state.transform.translate[1];
  translateYValue.innerHTML = state.transform.translate[1];
  rangeTranslateZ.value = state.transform.translate[2];
  translateZValue.innerHTML = state.transform.translate[2];

  rangeRotateX.value = state.transform.rotate[0];
  rotateXValue.innerHTML = state.transform.rotate[0];
  rangeRotateY.value = state.transform.rotate[1];
  rotateYValue.innerHTML = state.transform.rotate[1];
  rangeRotateZ.value = state.transform.rotate[2];
  rotateZValue.innerHTML = state.transform.rotate[2];

  rangeScaleX.value = state.transform.scale[0] * 20;
  scaleXValue.innerHTML = state.transform.scale[0];
  rangeScaleY.value = state.transform.scale[1] * 20;
  scaleYValue.innerHTML = state.transform.scale[1];
  rangeScaleZ.value = state.transform.scale[2] * 20;
  scaleZValue.innerHTML = state.transform.scale[2];

  rangeCameraX.value = state.viewMatrix.camera[0];
  cameraXValue.innerHTML = state.viewMatrix.camera[0];
  rangeCameraY.value = state.viewMatrix.camera[1];
  cameraYValue.innerHTML = state.viewMatrix.camera[1];
  rangeCameraZ.value = state.viewMatrix.camera[2];
  cameraZValue.innerHTML = state.viewMatrix.camera[2];

  rangeLookAtX.value = state.viewMatrix.lookAt[0];
  lookAtXValue.innerHTML = state.viewMatrix.lookAt[0];
  rangeLookAtY.value = state.viewMatrix.lookAt[1];
  lookAtYValue.innerHTML = state.viewMatrix.lookAt[1];
  rangeLookAtZ.value = state.viewMatrix.lookAt[2];
  lookAtZValue.innerHTML = state.viewMatrix.lookAt[2];

  rangeFOV.value = state.fudgeFactor;
  fovValue.innerHTML = state.fudgeFactor;
  theta.value = state.theta;
  thetaValue.innerHTML = state.theta;
  phi.value = state.phi;
  phiValue.innerHTML = state.phi;
}

/* ======= Get Document Object Model ======= */
const canvas = document.getElementById("canvas");
const projectionRadio = document.getElementsByName("projection");
const modelInput = document.getElementById("objFile");
const buttonSave = document.getElementById("save");
const colorPicker = document.getElementById("color-picker");
const lightingCheckbox = document.getElementById("lighting");
const reset = document.getElementById("reset");
const resetTransform = document.getElementById("reset-transform");
const resetCamera = document.getElementById("reset-camera");
const startAnim = document.getElementById("animation");
const stopAnim = document.getElementById("stop-anim");

/* ======= Transform Sliders ======= */
const rangeTranslateX = document.getElementById("translate-x");
const translateXValue = document.getElementById("translate-x-value");
const rangeTranslateY = document.getElementById("translate-y");
const translateYValue = document.getElementById("translate-y-value");
const rangeTranslateZ = document.getElementById("translate-z");
const translateZValue = document.getElementById("translate-z-value");

const rangeRotateX = document.getElementById("rotate-x");
const rotateXValue = document.getElementById("rotate-x-value");
const rangeRotateY = document.getElementById("rotate-y");
const rotateYValue = document.getElementById("rotate-y-value");
const rangeRotateZ = document.getElementById("rotate-z");
const rotateZValue = document.getElementById("rotate-z-value");

const rangeScaleX = document.getElementById("scale-x");
const scaleXValue = document.getElementById("scale-x-value");
const rangeScaleY = document.getElementById("scale-y");
const scaleYValue = document.getElementById("scale-y-value");
const rangeScaleZ = document.getElementById("scale-z");
const scaleZValue = document.getElementById("scale-z-value");

const rangeCameraX = document.getElementById("camera-x");
const cameraXValue = document.getElementById("camera-x-value");
const rangeCameraY = document.getElementById("camera-y");
const cameraYValue = document.getElementById("camera-y-value");
const rangeCameraZ = document.getElementById("camera-z");
const cameraZValue = document.getElementById("camera-z-value");

const rangeLookAtX = document.getElementById("look-at-x");
const lookAtXValue = document.getElementById("look-at-x-value");
const rangeLookAtY = document.getElementById("look-at-y");
const lookAtYValue = document.getElementById("look-at-y-value");
const rangeLookAtZ = document.getElementById("look-at-z");
const lookAtZValue = document.getElementById("look-at-z-value");

const rangeFOV = document.getElementById("fov");
const fovValue = document.getElementById("fov-value");
const theta = document.getElementById("theta");
const thetaValue = document.getElementById("theta-value");
const phi = document.getElementById("phi");
const phiValue = document.getElementById("phi-value");

/* ======= Event Listener ======= */
projectionRadio.forEach((radio) => {
  radio.addEventListener("change", () => {
    state.projection = radio.value;
    if (state.projection === "perspective") {
      state.transform.translate[2] = -5;
    } else {
      state.transform.translate[2] = -1;
    }
  });
});

modelInput.addEventListener("change", () => {
  const file = modelInput.files[0];
  if (file.type !== "application/json") {
    alert("Please upload correct JSON file!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const color = state.pickedColor;
    setDefaultState();
    clear();
    state.model = JSON.parse(text);
    state.pickedColor = color;
  };
  reader.readAsText(file);
});

buttonSave.addEventListener("click", () => {
  const transform = setTransform(state.model, state.transform);
  // console.table(transform[1][0]);
  // console.table(state.model.vertices);
  const appliedtransform = state.model.vertices.map((x) =>
    matrices.applyTransform(transform, x)
  );
  // console.table(appliedtransform);
  state.model.vertices = appliedtransform;
  const obj = saveObject(state.model);
  const blob = new Blob([obj], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "model.json";
  link.click();
});

colorPicker.addEventListener("change", () => {
  const color = colorPicker.value;
  /* convert hex to rgb, normalize */
  state.pickedColor = [
    parseInt(color.substring(1, 3), 16) / 255,
    parseInt(color.substring(3, 5), 16) / 255,
    parseInt(color.substring(5, 7), 16) / 255,
  ];
});

lightingCheckbox.addEventListener("change", () => {
  state.lighting.useLighting = lightingCheckbox.checked;
  if (state.lighting.useLighting) {
    program = createShaderProgram(gl, vertex_shader_3d, fragment_shader_3d);
  } else {
    program = createShaderProgram(
      gl,
      vertex_shader_3d,
      fragment_shader_3d_no_lighting
    );
  }
});

reset.addEventListener("click", () => {
  program = createShaderProgram(
    gl,
    vertex_shader_3d,
    fragment_shader_3d_no_lighting
  );
  setDefaultState();
  clear();
  resetTransf();
  resetCam();
});

resetTransform.addEventListener("click", () => {
  resetTransf();
});

function resetTransf() {
  state.transform.translate = [0, 0, -5];
  state.transform.rotate = [0, 0, 0];
  state.transform.scale = [1, 1, 1];
  rangeTranslateX.value = 0;
  translateXValue.innerHTML = 0;
  rangeTranslateY.value = 0;
  translateYValue.innerHTML = 0;
  rangeTranslateZ.value = 0;
  translateZValue.innerHTML = 0;

  rangeRotateX.value = 0;
  rotateXValue.innerHTML = 0;
  rangeRotateY.value = 0;
  rotateYValue.innerHTML = 0;
  rangeRotateZ.value = 0;
  rotateZValue.innerHTML = 0;

  rangeScaleX.value = 0;
  scaleXValue.innerHTML = 1;
  rangeScaleY.value = 0;
  scaleYValue.innerHTML = 1;
  rangeScaleZ.value = 0;
  scaleZValue.innerHTML = 1;
}

resetCamera.addEventListener("click", () => {
  resetCam();
});

function resetCam() {
  state.viewMatrix.camera = [0, 0, 1];
  state.viewMatrix.lookAt = [0, 0, 0];
  state.viewMatrix.up = [0, 1, 0];
  state.viewMatrix.near = 0.1;
  state.viewMatrix.far = 50;
  state.fudgeFactor = 0;
  state.theta = 0;
  state.phi = 0;
  rangeCameraX.value = 0;
  cameraXValue.innerHTML = 0;
  rangeCameraY.value = 0;
  cameraYValue.innerHTML = 0;
  rangeCameraZ.value = 0;
  cameraZValue.innerHTML = 1;

  rangeLookAtX.value = 0;
  lookAtXValue.innerHTML = 0;
  rangeLookAtY.value = 0;
  lookAtYValue.innerHTML = 0;
  rangeLookAtZ.value = 0;
  lookAtZValue.innerHTML = 0;

  rangeFOV.value = 0;
  fovValue.innerHTML = 0;
  theta.value = 15;
  thetaValue.innerHTML = 15;
  phi.value = 75;
  phiValue.innerHTML = 75;
}

startAnim.addEventListener("click", () => {
  state.isObjectAnimate = true;
  startAnim.classList.add("hidden");
  stopAnim.classList.remove("hidden");
});

stopAnim.addEventListener("click", () => {
  state.isObjectAnimate = false;
  stopAnim.classList.add("hidden");
  startAnim.classList.remove("hidden");
});

rangeTranslateX.addEventListener("input", () => {
  state.transform.translate[0] = -1 + (2 * rangeTranslateX.value) / 100;
  translateXValue.innerHTML = rangeTranslateX.value;
});

rangeTranslateY.addEventListener("input", () => {
  state.transform.translate[1] = -1 + (2 * rangeTranslateY.value) / 100;
  translateYValue.innerHTML = rangeTranslateY.value;
});

rangeTranslateZ.addEventListener("input", () => {
  if (state.projection === "perspective") {
    state.transform.translate[2] = -5 + (2 * rangeTranslateZ.value) / 100;
  } else {
    state.transform.translate[2] = -1 + (2 * rangeTranslateZ.value) / 100;
  }
  translateZValue.innerHTML = rangeTranslateZ.value;
});

/* rotate from -360 to 360 */
rangeRotateX.addEventListener("input", () => {
  // rotate -360 to 360
  state.transform.rotate[0] = degToRad(rangeRotateX.value);
  rotateXValue.innerHTML = rangeRotateX.value;
});

rangeRotateY.addEventListener("input", () => {
  state.transform.rotate[1] = degToRad(rangeRotateY.value);
  rotateYValue.innerHTML = rangeRotateY.value;
});

rangeRotateZ.addEventListener("input", () => {
  state.transform.rotate[2] = degToRad(rangeRotateZ.value);
  rotateZValue.innerHTML = rangeRotateZ.value;
});

/* scale from -5 to 5 */
rangeScaleX.addEventListener("input", () => {
  state.transform.scale[0] = rangeScaleX.value / 20;
  scaleXValue.innerHTML = rangeScaleX.value / 20;
});

rangeScaleY.addEventListener("input", () => {
  state.transform.scale[1] = rangeScaleY.value / 20;
  scaleYValue.innerHTML = rangeScaleY.value / 20;
});

rangeScaleZ.addEventListener("input", () => {
  state.transform.scale[2] = rangeScaleZ.value / 20;
  scaleZValue.innerHTML = rangeScaleZ.value / 20;
});

rangeCameraX.addEventListener("input", () => {
  state.viewMatrix.camera[0] = parseInt(rangeCameraX.value);
  cameraXValue.innerHTML = rangeCameraX.value;
});

rangeCameraY.addEventListener("input", () => {
  state.viewMatrix.camera[1] = parseInt(rangeCameraY.value);
  cameraYValue.innerHTML = rangeCameraY.value;
});

rangeCameraZ.addEventListener("input", () => {
  state.viewMatrix.camera[2] = parseInt(rangeCameraZ.value);
  cameraZValue.innerHTML = rangeCameraZ.value;
});

rangeLookAtX.addEventListener("input", () => {
  state.viewMatrix.lookAt[0] = (2 * rangeLookAtX.value * 2 * Math.PI) / 100;
  lookAtXValue.innerHTML = rangeLookAtX.value;
});

rangeLookAtY.addEventListener("input", () => {
  state.viewMatrix.lookAt[1] = (2 * rangeLookAtY.value * 2 * Math.PI) / 100;
  lookAtYValue.innerHTML = rangeLookAtY.value;
});

rangeLookAtZ.addEventListener("input", () => {
  state.viewMatrix.lookAt[2] = (2 * rangeLookAtZ.value * 2 * Math.PI) / 100;
  lookAtZValue.innerHTML = rangeLookAtZ.value;
});

rangeFOV.addEventListener("input", () => {
  state.fudgeFactor = rangeFOV.value / 100;
  // console.log(state.fudgeFactor);
  fovValue.innerHTML = rangeFOV.value;
});

theta.addEventListener("input", () => {
  state.theta = parseInt(theta.value);
  thetaValue.innerHTML = theta.value;
});

phi.addEventListener("input", () => {
  state.phi = parseInt(phi.value);
  phiValue.innerHTML = phi.value;
});

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
  const view = setView();
  const geometry = setGeometry();
  const transform = setTransform();
  const projection = setProjection();

  if (state.animation.isObjectAnimate) {
    state.transform.rotate[1] +=
      (2 * state.animation.degAnimate * Math.PI) / 100;
    state.degAnimate += 0.1;
  }

  var fudgeFactor = gl.getUniformLocation(program, "fudgeFactor");
  gl.uniform1f(fudgeFactor, state.fudgeFactor);

  var transformMatrix = gl.getUniformLocation(program, "uTransform");
  gl.uniformMatrix4fv(transformMatrix, false, transform);

  var projectionMatrix = gl.getUniformLocation(program, "uProjection");
  gl.uniformMatrix4fv(
    projectionMatrix,
    false,
    matrices.multiply(projection, view)
  );

  var normalMatrix = gl.getUniformLocation(program, "uNormal");
  let modelMatrix = matrices.transpose(
    matrices.inverse(matrices.multiply(view, transform))
  );

  gl.uniformMatrix4fv(normalMatrix, false, modelMatrix);

  if (state.lighting.useLighting) {
    var uniformColor = gl.getUniformLocation(program, "uColor");
    gl.uniform3fv(uniformColor, state.pickedColor);

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

function setView() {
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

  let newCamPos = matrices.lookAt(
    camPos,
    state.viewMatrix.lookAt,
    state.viewMatrix.up
  );
  var viewMatrix = matrices.inverse(newCamPos);

  return viewMatrix;
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
