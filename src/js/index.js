/* ======= Global object ======= */
var state;
setDefaultState();

function setDefaultState() {
  /* Setup default state for webgl canvas */
  state = {};
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
const rangeTranslateY = document.getElementById("translate-y");
const rangeTranslateZ = document.getElementById("translate-z");

const rangeRotateX = document.getElementById("rotate-x");
const rangeRotateY = document.getElementById("rotate-y");
const rangeRotateZ = document.getElementById("rotate-z");

const scaleX = document.getElementById("scale-x");
const scaleY = document.getElementById("scale-y");
const scaleZ = document.getElementById("scale-z");

const rangeFOV = document.getElementById("fov");

const rangeCameraX = document.getElementById("rangeCameraX");
const rangeCameraY = document.getElementById("rangeCameraY");
const rangeCameraZ = document.getElementById("rangeCameraZ");

const rangeLookAtX = document.getElementById("look-at-x");
const rangeLookAtY = document.getElementById("look-at-y");
const rangeLookAtZ = document.getElementById("look-at-z");

const theta = document.getElementById("theta");
const phi = document.getElementById("phi");

/* ======= Event Listener ======= */
projectionRadio.forEach((radio) => {
  radio.addEventListener("change", () => {
    state.projection = radio.value;
    if (state.projection === "perspective") {
      state.transform.translate[2] = -5;
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
    state.model = loadObject(text);
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
  state.lighting = lightingCheckbox.checked;
  if (state.lighting) {
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
});

resetTransform.addEventListener("click", () => {
  resetTransf();
});

function resetTransf() {}

resetCamera.addEventListener("click", () => {
  resetCam();
});

function resetCam() {}

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
});

rangeTranslateY.addEventListener("input", () => {
  state.transform.translate[1] = -1 + (2 * rangeTranslateY.value) / 100;
});

rangeTranslateZ.addEventListener("input", () => {
  if (state.projection === "perspective") {
    state.transform.translate[2] = -5 + (2 * rangeTranslateZ.value) / 100;
  } else {
    state.transform.translate[2] = -1 + (2 * rangeTranslateZ.value) / 100;
  }
});

/* rotate from -360 to 360 */
rangeRotateX.addEventListener("input", () => {
  // rotate -360 to 360
  state.transform.rotate[0] = (2 * rangeRotateX.value * 2 * Math.PI) / 100;
});

rangeRotateY.addEventListener("input", () => {
  state.transform.rotate[1] = (2 * rangeRotateY.value * 2 * Math.PI) / 100;
});

rangeRotateZ.addEventListener("input", () => {
  state.transform.rotate[2] = (2 * rangeRotateZ.value * 2 * Math.PI) / 100;
});

/* scale from -5 to 5 */
scaleX.addEventListener("input", () => {
  state.transform.scale[0] = scaleX.value / 20;
});

scaleY.addEventListener("input", () => {
  state.transform.scale[1] = scaleY.value / 20;
});

scaleZ.addEventListener("input", () => {
  state.transform.scale[2] = scaleZ.value / 20;
});

rangeFOV.addEventListener("input", () => {
  state.fudgeFactor = rangeFOV.value / 100;
  // console.log(state.fudgeFactor);
});

rangeCameraX.addEventListener("input", () => {
  console.log(rangeCameraX.value);
  state.viewMatrix.camera[0] = parseInt(rangeCameraX.value);
});
rangeCameraY.addEventListener("input", () => {
  state.viewMatrix.camera[1] = parseInt(rangeCameraY.value);
});
rangeCameraZ.addEventListener("input", () => {
  state.viewMatrix.camera[2] = parseInt(rangeCameraZ.value);
});

rangeLookAtX.addEventListener("input", () => {
  state.viewMatrix.lookAt[0] = (2 * rangeLookAtX.value * 2 * Math.PI) / 100;
});

rangeLookAtY.addEventListener("input", () => {
  state.viewMatrix.lookAt[1] = (2 * rangeLookAtY.value * 2 * Math.PI) / 100;
});

rangeLookAtZ.addEventListener("input", () => {
  state.viewMatrix.lookAt[2] = (2 * rangeLookAtZ.value * 2 * Math.PI) / 100;
});

theta.addEventListener("input", () => {
  state.theta = parseInt(theta.value);
});

phi.addEventListener("input", () => {
  state.phi = parseInt(phi.value);
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
  rangeFOV.value = 0;
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

  window.requestAnimFrame(render);
}
