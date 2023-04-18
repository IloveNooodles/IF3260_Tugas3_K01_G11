/* ======= Get Document Object Model ======= */
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
      state.objects[0].transform.translate[2] = -5;
    } else {
      state.objects[0].transform.translate[2] = -1;
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
    setDefaultState();
    clear();
    state.objects = loadObject(text);
  };
  reader.readAsText(file);
});

buttonSave.addEventListener("click", () => {
  const obj = saveObject(state.objects);
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
  state.objects[0].pickedColor = [
    parseInt(color.substring(1, 3), 16) / 255,
    parseInt(color.substring(3, 5), 16) / 255,
    parseInt(color.substring(5, 7), 16) / 255,
  ];
});

lightingCheckbox.addEventListener("change", () => {
  state.lighting.useLighting = lightingCheckbox.checked;
  if (state.lighting.useLighting) {
    state.objects.forEach((object) => {
      object.program = createShaderProgram(
        gl,
        vertex_shader_3d,
        fragment_shader_3d
      );
    });
  } else {
    state.objects.forEach((object) => {
      object.program = createShaderProgram(
        gl,
        vertex_shader_3d,
        fragment_shader_3d_no_lighting
      );
    });
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
  document.getElementById("orthographic").checked = true;
  lightingCheckbox.checked = false;
});

resetTransform.addEventListener("click", () => {
  resetTransf();
});

function resetTransf() {
  state.objects[0].transform.translate = [0, 0, -5];
  state.objects[0].transform.rotate = [0, 0, 0];
  state.objects[0].transform.scale = [1, 1, 1];
  rangeTranslateX.value = 0;
  translateXValue.innerHTML = 0;
  rangeTranslateY.value = 0;
  translateYValue.innerHTML = 0;
  rangeTranslateZ.value = -5;
  translateZValue.innerHTML = -5;

  rangeRotateX.value = 0;
  rotateXValue.innerHTML = 0;
  rangeRotateY.value = 0;
  rotateYValue.innerHTML = 0;
  rangeRotateZ.value = 0;
  rotateZValue.innerHTML = 0;

  rangeScaleX.value = 20;
  scaleXValue.innerHTML = 1;
  rangeScaleY.value = 20;
  scaleYValue.innerHTML = 1;
  rangeScaleZ.value = 20;
  scaleZValue.innerHTML = 1;
}

resetCamera.addEventListener("click", () => {
  resetCam();
});

function resetCam() {
  state.objects[0].viewMatrix.camera = [0, 0, 1];
  state.objects[0].viewMatrix.lookAt = [0, 0, 0];
  state.objects[0].viewMatrix.up = [0, 1, 0];
  state.objects[0].viewMatrix.near = 0.1;
  state.objects[0].viewMatrix.far = 50;
  state.fudgeFactor = 0;
  state.theta = 90;
  state.phi = 90;
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
  theta.value = 90;
  thetaValue.innerHTML = 90;
  phi.value = 90;
  phiValue.innerHTML = 90;
}

startAnim.addEventListener("click", () => {
  state.objects.forEach((object) => {
    object.animation.isObjectAnimate = true;
  });
  startAnim.classList.add("hidden");
  stopAnim.classList.remove("hidden");
});

stopAnim.addEventListener("click", () => {
  state.objects.forEach((object) => {
    object.animation.isObjectAnimate = false;
  });
  stopAnim.classList.add("hidden");
  startAnim.classList.remove("hidden");
});

rangeTranslateX.addEventListener("input", () => {
  state.objects[0].transform.translate[0] =
    -1 + (2 * rangeTranslateX.value) / 100;
  translateXValue.innerHTML = rangeTranslateX.value;
});

rangeTranslateY.addEventListener("input", () => {
  state.objects[0].transform.translate[1] =
    -1 + (2 * rangeTranslateY.value) / 100;
  translateYValue.innerHTML = rangeTranslateY.value;
});

rangeTranslateZ.addEventListener("input", () => {
  if (state.projection === "perspective") {
    state.objects[0].transform.translate[2] =
      -5 + (2 * rangeTranslateZ.value) / 100;
  } else {
    state.objects[0].transform.translate[2] =
      -1 + (2 * rangeTranslateZ.value) / 100;
  }
  translateZValue.innerHTML = rangeTranslateZ.value;
});

/* rotate from -360 to 360 */
rangeRotateX.addEventListener("input", () => {
  // rotate -360 to 360
  state.objects[0].transform.rotate[0] = degToRad(rangeRotateX.value);
  rotateXValue.innerHTML = rangeRotateX.value;
});

rangeRotateY.addEventListener("input", () => {
  state.objects[0].transform.rotate[1] = degToRad(rangeRotateY.value);
  rotateYValue.innerHTML = rangeRotateY.value;
});

rangeRotateZ.addEventListener("input", () => {
  state.objects[0].transform.rotate[2] = degToRad(rangeRotateZ.value);
  rotateZValue.innerHTML = rangeRotateZ.value;
});

/* scale from -5 to 5 */
rangeScaleX.addEventListener("input", () => {
  state.objects[0].transform.scale[0] = rangeScaleX.value / 20;
  scaleXValue.innerHTML = (rangeScaleX.value / 20).toFixed(2);
});

rangeScaleY.addEventListener("input", () => {
  state.objects[0].transform.scale[1] = rangeScaleY.value / 20;
  scaleYValue.innerHTML = (rangeScaleY.value / 20).toFixed(2);
});

rangeScaleZ.addEventListener("input", () => {
  state.objects[0].transform.scale[2] = rangeScaleZ.value / 20;
  scaleZValue.innerHTML = (rangeScaleZ.value / 20).toFixed(2);
});

rangeCameraX.addEventListener("input", () => {
  state.objects[0].viewMatrix.camera[0] = parseInt(rangeCameraX.value);
  cameraXValue.innerHTML = rangeCameraX.value;
});

rangeCameraY.addEventListener("input", () => {
  state.objects[0].viewMatrix.camera[1] = parseInt(rangeCameraY.value);
  cameraYValue.innerHTML = rangeCameraY.value;
});

rangeCameraZ.addEventListener("input", () => {
  state.objects[0].viewMatrix.camera[2] = parseInt(rangeCameraZ.value);
  cameraZValue.innerHTML = rangeCameraZ.value;
});

rangeLookAtX.addEventListener("input", () => {
  state.objects[0].viewMatrix.lookAt[0] =
    (2 * rangeLookAtX.value * 2 * Math.PI) / 100;
  lookAtXValue.innerHTML = rangeLookAtX.value;
});

rangeLookAtY.addEventListener("input", () => {
  state.objects[0].viewMatrix.lookAt[1] =
    (2 * rangeLookAtY.value * 2 * Math.PI) / 100;
  lookAtYValue.innerHTML = rangeLookAtY.value;
});

rangeLookAtZ.addEventListener("input", () => {
  state.objects[0].viewMatrix.lookAt[2] =
    (2 * rangeLookAtZ.value * 2 * Math.PI) / 100;
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

function setSliderState() {
  /* setup default state for sliders */

  rangeTranslateX.value = state.objects[0].transform.translate[0];
  translateXValue.innerHTML = state.objects[0].transform.translate[0];
  rangeTranslateY.value = state.objects[0].transform.translate[1];
  translateYValue.innerHTML = state.objects[0].transform.translate[1];
  rangeTranslateZ.value = state.objects[0].transform.translate[2];
  translateZValue.innerHTML = state.objects[0].transform.translate[2];

  rangeRotateX.value = state.objects[0].transform.rotate[0];
  rotateXValue.innerHTML = state.objects[0].transform.rotate[0];
  rangeRotateY.value = state.objects[0].transform.rotate[1];
  rotateYValue.innerHTML = state.objects[0].transform.rotate[1];
  rangeRotateZ.value = state.objects[0].transform.rotate[2];
  rotateZValue.innerHTML = state.objects[0].transform.rotate[2];

  rangeScaleX.value = state.objects[0].transform.scale[0] * 20;
  scaleXValue.innerHTML = state.objects[0].transform.scale[0];
  rangeScaleY.value = state.objects[0].transform.scale[1] * 20;
  scaleYValue.innerHTML = state.objects[0].transform.scale[1];
  rangeScaleZ.value = state.objects[0].transform.scale[2] * 20;
  scaleZValue.innerHTML = state.objects[0].transform.scale[2];

  rangeCameraX.value = state.objects[0].viewMatrix.camera[0];
  cameraXValue.innerHTML = state.objects[0].viewMatrix.camera[0];
  rangeCameraY.value = state.objects[0].viewMatrix.camera[1];
  cameraYValue.innerHTML = state.objects[0].viewMatrix.camera[1];
  rangeCameraZ.value = state.objects[0].viewMatrix.camera[2];
  cameraZValue.innerHTML = state.objects[0].viewMatrix.camera[2];

  rangeLookAtX.value = state.objects[0].viewMatrix.lookAt[0];
  lookAtXValue.innerHTML = state.objects[0].viewMatrix.lookAt[0];
  rangeLookAtY.value = state.objects[0].viewMatrix.lookAt[1];
  lookAtYValue.innerHTML = state.objects[0].viewMatrix.lookAt[1];
  rangeLookAtZ.value = state.objects[0].viewMatrix.lookAt[2];
  lookAtZValue.innerHTML = state.objects[0].viewMatrix.lookAt[2];

  rangeFOV.value = state.fudgeFactor;
  fovValue.innerHTML = state.fudgeFactor;
  theta.value = state.theta;
  thetaValue.innerHTML = state.theta;
  phi.value = state.phi;
  phiValue.innerHTML = state.phi;
}
