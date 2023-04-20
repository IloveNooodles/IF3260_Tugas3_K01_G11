/* ======= Get Document Object Model ======= */
const components = document.getElementById("components");
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
const textureSelector = document.getElementById("texture-dropdown");

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

const rangeFOV = document.getElementById("fov");
const fovValue = document.getElementById("fov-value");
const theta = document.getElementById("theta");
const thetaValue = document.getElementById("theta-value");
const phi = document.getElementById("phi");
const phiValue = document.getElementById("phi-value");

/* ======= transforms container ======= */
const transformTitle = document.getElementById("transform-title");
const transformText = document.createElement("h2");
transformText.innerHTML = "Transform";
transformTitle.appendChild(transformText);
const transformFor = document.createElement("span");

/* ======= Event Listener ======= */
projectionRadio.forEach((radio) => {
  radio.addEventListener("change", () => {
    var offset = 0;
    // if (radio.value == "perspective" && state.projection != "perspective") {
    //   offset = -5;
    // } else if (
    //   state.projection === "perspective" &&
    //   radio.value !== "perspective"
    // ) {
    //   offset = 5;
    // }
    state.projection = radio.value;
    state.focus.transform.translate[2] += offset;
    rangeTranslateZ.value = state.focus.transform.translate[2];
    translateZValue.innerHTML = state.focus.transform.translate[2];
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
    const loadObj = [];
    setDefaultState();
    clear();
    parsedObject = JSON.parse(text);
    loadObject(parsedObject, loadObj);
    state.objects = loadObj;
    state.focus = state.objects[0];
    components.innerHTML = "";
    showComponents(state.objects);
    setTransformTo(state.focus);
  };
  reader.readAsText(file);
});

buttonSave.addEventListener("click", () => {
  var saveObj = [];
  saveObject(state.objects, saveObj);
  saveObj = JSON.stringify(saveObj);
  const blob = new Blob([saveObj], { type: "text/plain" });
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

reset.addEventListener("click", () => {
  program = createShaderProgram(
    gl,
    vertex_shader_3d,
    fragment_shader_3d_no_lighting
  );
  resetComponentsChild();
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
  state.focus.viewMatrix.camera = [0, 0, 1];
  state.focus.viewMatrix.lookAt = [0, 0, 0];
  state.focus.viewMatrix.up = [0, 1, 0];
  state.focus.viewMatrix.near = 0.1;
  state.focus.viewMatrix.far = 50;
  state.fudgeFactor = 0;
  state.theta = 90;
  state.phi = 90;
  rangeCameraX.value = 0;
  cameraXValue.innerHTML = 0;
  rangeCameraY.value = 0;
  cameraYValue.innerHTML = 0;
  rangeCameraZ.value = 0;
  cameraZValue.innerHTML = 1;

  rangeFOV.value = 0;
  fovValue.innerHTML = 0;
  theta.value = 90;
  thetaValue.innerHTML = 90;
  phi.value = 90;
  phiValue.innerHTML = 90;
}

function setAnimState(objects, state) {
  objects.forEach((object) => {
    object.animation.isObjectAnimate = state;
    if (object.children.length > 0) {
      setAnimState(object.children, state);
    }
  });
}

startAnim.addEventListener("click", () => {
  setAnimState(state.objects, true);
  isAnimationRun = true;
  startAnim.classList.add("hidden");
  stopAnim.classList.remove("hidden");
});

stopAnim.addEventListener("click", () => {
  setAnimState(state.objects, false);
  isAnimationRun = false;
  stopAnim.classList.add("hidden");
  startAnim.classList.remove("hidden");
});

rangeTranslateX.addEventListener("input", () => {
  state.focus.transform.translate[0] = (2 * rangeTranslateX.value) / 10;
  translateXValue.innerHTML = state.focus.transform.translate[0].toFixed(2);
});

rangeTranslateY.addEventListener("input", () => {
  state.focus.transform.translate[1] = (2 * rangeTranslateY.value) / 10;
  translateYValue.innerHTML = state.focus.transform.translate[1].toFixed(2);
});

rangeTranslateZ.addEventListener("input", () => {
  state.focus.transform.translate[2] = (2 * rangeTranslateZ.value) / 10;
  translateZValue.innerHTML = state.focus.transform.translate[2].toFixed(2);
});

/* rotate from -360 to 360 */
rangeRotateX.addEventListener("input", () => {
  // rotate -360 to 360
  state.focus.transform.rotate[0] = degToRad(rangeRotateX.value);
  rotateXValue.innerHTML = rangeRotateX.value;
});

rangeRotateY.addEventListener("input", () => {
  state.focus.transform.rotate[1] = degToRad(rangeRotateY.value);
  rotateYValue.innerHTML = rangeRotateY.value;
});

rangeRotateZ.addEventListener("input", () => {
  state.focus.transform.rotate[2] = degToRad(rangeRotateZ.value);
  rotateZValue.innerHTML = rangeRotateZ.value;
});

/* scale from -5 to 5 */
rangeScaleX.addEventListener("input", () => {
  state.focus.transform.scale[0] = rangeScaleX.value / 20;
  scaleXValue.innerHTML = (rangeScaleX.value / 20).toFixed(2);
});

rangeScaleY.addEventListener("input", () => {
  state.focus.transform.scale[1] = rangeScaleY.value / 20;
  scaleYValue.innerHTML = (rangeScaleY.value / 20).toFixed(2);
});

rangeScaleZ.addEventListener("input", () => {
  state.focus.transform.scale[2] = rangeScaleZ.value / 20;
  scaleZValue.innerHTML = (rangeScaleZ.value / 20).toFixed(2);
});

rangeCameraX.addEventListener("input", () => {
  alterViewMatrix(state.focus);
  cameraXValue.innerHTML = rangeCameraX.value;
});

rangeCameraY.addEventListener("input", () => {
  alterViewMatrix(state.focus);
  cameraYValue.innerHTML = rangeCameraY.value;
});

rangeCameraZ.addEventListener("input", () => {
  alterViewMatrix(state.focus);
  cameraZValue.innerHTML = rangeCameraZ.value / 10;
});

function alterViewMatrix(object) {
  object.viewMatrix.camera = [
    degToRad(rangeCameraX.value),
    degToRad(rangeCameraY.value),
    rangeCameraZ.value / 10 == 0 ? 0.0001 : rangeCameraZ.value / 10,
  ];
  if (object.children.length > 0) {
    object.children.forEach((child) => {
      alterViewMatrix(child);
    });
  }
}

rangeFOV.addEventListener("input", () => {
  state.fudgeFactor = rangeFOV.value / 10;
  // console.log(state.fudgeFactor);
  fovValue.innerHTML = rangeFOV.value / 10;
});

theta.addEventListener("input", () => {
  state.theta = parseInt(theta.value);
  thetaValue.innerHTML = theta.value;
});

phi.addEventListener("input", () => {
  state.phi = parseInt(phi.value);
  phiValue.innerHTML = phi.value;
});

function setSliderState(object) {
  /* setup default state for sliders */

  rangeTranslateX.value = (object.transform.translate[0] / 2) * 10;
  translateXValue.innerHTML = (object.transform.translate[0] / 2).toFixed(2);
  rangeTranslateY.value = (object.transform.translate[1] / 2) * 10;
  translateYValue.innerHTML = (object.transform.translate[1] / 2).toFixed(2);
  rangeTranslateZ.value = (object.transform.translate[2] / 2) * 10;
  translateZValue.innerHTML = (object.transform.translate[2] / 2).toFixed(2);

  rangeRotateX.value = radToDeg(object.transform.rotate[0]);
  rotateXValue.innerHTML = radToDeg(object.transform.rotate[0]).toFixed(2);
  rangeRotateY.value = radToDeg(object.transform.rotate[1]);
  rotateYValue.innerHTML = radToDeg(object.transform.rotate[1]).toFixed(2);
  rangeRotateZ.value = radToDeg(object.transform.rotate[2]);
  rotateZValue.innerHTML = radToDeg(object.transform.rotate[2]).toFixed(2);

  rangeScaleX.value = object.transform.scale[0] * 20;
  scaleXValue.innerHTML = object.transform.scale[0].toFixed(2);
  rangeScaleY.value = object.transform.scale[1] * 20;
  scaleYValue.innerHTML = object.transform.scale[1].toFixed(2);
  rangeScaleZ.value = object.transform.scale[2] * 20;
  scaleZValue.innerHTML = object.transform.scale[2].toFixed(2);

  rangeCameraX.value = object.viewMatrix.camera[0];
  cameraXValue.innerHTML = object.viewMatrix.camera[0];
  rangeCameraY.value = object.viewMatrix.camera[1];
  cameraYValue.innerHTML = object.viewMatrix.camera[1];
  rangeCameraZ.value = object.viewMatrix.camera[2] * 10;
  cameraZValue.innerHTML = object.viewMatrix.camera[2];

  rangeFOV.value = state.fudgeFactor;
  fovValue.innerHTML = state.fudgeFactor;
  theta.value = state.theta;
  thetaValue.innerHTML = state.theta;
  phi.value = state.phi;
  phiValue.innerHTML = state.phi;
}

function setTransformTo(object = null) {
  var transformTo = document.getElementById("transform-to");
  if (!transformTo) {
    transformTo = document.createElement("p");
    transformTo.id = "transform-to";
  }
  if (object) {
    transformTo.innerHTML = `Applying to: ${object.name}`;
  } else {
    transformTo.innerHTML = `Applying to: ${state.focus.name}`;
  }
  if (object.children.length > 0) {
    transformTo.innerHTML += ` and its children`;
  }
  transformTitle.appendChild(transformTo);
}

function setInitColor(objects, color) {
  objects.forEach((object) => {
    object.pickedColor = color;
    if (object.children.length > 0) {
      setInitColor(object.children, color);
    }
  });
}

function resetComponentsChild() {
  while (components.children.length > 0) {
    components.removeChild(components.firstChild);
  }
}

function showComponents(objects, level = 0) {
  const paddingString = "padding-left: " + level * 20 + "px;";
  objects.forEach((object) => {
    let component = document.createElement("div");
    component.className = "component";
    component.style = paddingString;
    // component.id = "component-" + object.name;
    component.innerHTML += `
      <p class="component-name">${object.name}</p>`;
    component.addEventListener("click", () => {
      state.focus = object;
      setTransformTo(object);
      setSliderState(object);
      // console.log(state.focus);
    });
    components.appendChild(component);
    if (object.children.length > 0) {
      showComponents(object.children, level + 1);
    }
  });
}

/* ======= rendering options ======= */
lightingCheckbox.addEventListener("change", () => {
  state.lighting.useLighting = lightingCheckbox.checked;
  setColor(state.objects);
});

function setColor(objects) {
  objects.forEach((object) => {
    if (state.lighting.useLighting) {
      object.program = createShaderProgram(
        gl,
        vertex_shader_3d,
        fragment_shader_3d
      );
    } else if (!state.lighting.useLighting) {
      object.program = createShaderProgram(
        gl,
        vertex_shader_3d,
        fragment_shader_3d_no_lighting
      );
    }
    if (object.children.length > 0) {
      setColor(object.children);
    }
  });
}

textureSelector.addEventListener("change", function (e) {
  state.texture.textureType = this.value;
  setTexture(state.objects, state.texture.textureType);
});

function setTexture(objects, textureType) {
  objects.forEach((object) => {
    if (textureType === "none") {
      object.program = createShaderProgram(
        gl,
        vertex_shader_3d,
        fragment_shader_3d
      );
    } else if (textureType === "custom") {
      createCustomTexture(gl);
      object.program = createShaderProgram(
        gl,
        vertex_shader_3d,
        fragment_shader_texture
      );
    } else if (textureType === "bump") {
      createBumpTexture(gl);
      object.program = createShaderProgram(
        gl,
        vertex_shader_bump,
        fragment_shader_bump
      )
    } else if (textureType === "environment") {
      createEnvironmentTexture(gl);
      object.program = createShaderProgram(
        gl,
        vertex_shader_3d,
        fragment_shader_environment
      );
    }
    if (object.children.length > 0) {
      setTexture(object.children, textureType);
    }
  });
}
