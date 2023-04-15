/* ======= Get Document Object Model ======= */
const canvas = document.getElementById("canvas");
const components = document.getElementById("components");

/* ======= Global object ======= */
var state;
setDefaultState();

function setDefaultState() {
  /* Setup default state for webgl canvas */
  state = {
    models: [
      {
        name: "cuboid",
        model: generateCuboid(1, 1, 1, [0, 0, 0]),
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
      },
    ],
    lighting: {
      useLighting: false,
      lightDirection: [0, 0, 1],
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

  for (var model in state.models) {
    let component = document.createElement("div");
    component.className = "component";
    component.id = "component-" + model;
    component.innerHTML = `
      <div class="component-header">
        <h3>${state.models[model].name}</h3>
      </div>`;
    //   <div class="component-body">
    //     <div class="component-body-row">
    //       <div class="component-body-col">
    //         <label for="translate-x-${model}">Translate X</label>
    //         <input type="number" class="form-control" id="translate-x-${model}" value="${
    //   state.models[model].transform.translate[0]
    // }" onchange="updateModel(${model}, 'translate', 'x', this.value)">
    //       </div>
    //       <div class="component-body-col">
    //         <label for="translate-y-${model}">Translate Y</label>
    //         <input type="number" class="form-control" id="translate-y-${model}" value="${
    //   state.models[model].transform.translate[1]
    // }" onchange="updateModel(${model}, 'translate', 'y', this.value)">
    //       </div>
    //       <div class="component-body-col">
    //         <label for="translate-z-${model}">Translate Z</label>
    //         <input type="number" class="form-control" id="translate-z-${model}" value="${
    //   state.models[model].transform.translate[2]
    // }" onchange="updateModel(${model}, 'translate', 'z', this.value)">
    //       </div>
    //     </div>
    //     <div class="component-body-row">
    //       <div class="component-body-col">
    //         <label for="rotate-x-${model}">Rotate X</label>
    //         <input type="number" class="form-control" id="rotate-x-${model}" value="${
    //   state.models[model].transform.rotate[0]
    // }" onchange="updateModel(${model}, 'rotate', 'x', this.value)">
    //       </div>
    //       <div class="component-body-col">
    //         <label for="rotate-y-${model}">Rotate Y</label>
    //         <input type="number" class="form-control" id="rotate-y-${model}" value="${
    //   state.models[model].transform.rotate[1]
    // }" onchange="updateModel(${model}, 'rotate', 'y', this.value)">
    //       </div>
    //       <div class="component-body-col">
    //         <label for="rotate-z-${model}">Rotate Z</label>
    //         <input type="number" class="form-control" id="rotate-z-${model}" value="${
    //   state.models[model].transform.rotate[2]
    // }" onchange="updateModel(${model}, 'rotate', 'z', this.value)">
    //       </div>
    //     </div>
    //     <div class="component-body-row">
    //       <div class="component-body-col">
    //         <label for="scale-x-${model}">Scale X</label>
    //         <input type="number" class="form-control" id="scale-x-${model}" value="${
    //   state.models[model].transform.scale[0]
    // }" onchange="updateModel(${model}, 'scale', 'x', this.value)">
    //       </div>
    //       <div class="component-body-col">
    //         <label for="scale-y-${model}">Scale Y</label>
    //         <input type="number" class="form-control" id="scale-y-${model}" value="${
    //   state.models[model].transform.scale[1]
    // }" onchange="updateModel(${model}, 'scale', 'y', this.value)">
    //       </div>
    //       <div class="component-body-col">
    //         <label for="scale-z-${model}">Scale Z</label>
    //         <input type="number" class="form-control" id="scale-z-${model}" value="${
    //   state.models[model].transform.scale[2]
    // }" onchange="updateModel(${model}, 'scale', 'z', this.value)">
    //       </div>
    //     </div>
    //     <div class="component-body-row">
    //       <div class="component-body-col">
    //         <label for="color-${model}">Color</label>
    //         <input type="color" class="form-control" id="color-${model}" value="#${rgbToHex(
    //   state.models[model].pickedColor[0],
    //   state.models[model].pickedColor[1],
    //   state.models[model].pickedColor[2]
    // )}" onchange="updateModel(${model}, 'color', this.value)">
    //       </div>
    //     </div>
    //   </div>
    components.appendChild(component);
  }
}

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
  state.models[0].pickedColor = [1, 0, 0];
  render();
};

function clear() {
  /* Setup white screen for webgl canvas */
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function render() {
  /* Render loop for webgl canvas */

  // precalculations
  if (!state.models[0].model.colors) {
    state.models[0].model.colors = generateRandomColors(
      state.models[0].model.vertices
    );
  }

  if (state.animation.isObjectAnimate) {
    state.models[0].transform.rotate[1] +=
      (2 * state.animation.degAnimate * Math.PI) / 100;
  }

  const transform = setTransform();
  var worldViewProjectionMatrix = setWorldViewProjectionMatrix(transform);

  var worldInverseTransposeMatrix = matrices.transpose(
    matrices.inverse(transform)
  );

  normalizeLight = matrices.normalize(state.lighting.lightDirection);

  // prepare for rendering
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  clear();
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.useProgram(program);

  var attribs = {
    aPosition: {
      buffer: new Float32Array(state.models[0].model.vertices.flat(1)),
      numComponents: 3,
    },
    aNormal: {
      buffer: new Float32Array(state.models[0].model.normals.flat(1)),
      numComponents: 3,
    },
    aColor: {
      buffer: new Float32Array(state.models[0].model.colors.flat(1)),
      numComponents: 3,
    },
  };

  var attribSetters = initAttribs(gl, program);
  setAttribs(attribSetters, attribs);

  var uniforms = {
    uWorldViewProjection: worldViewProjectionMatrix,
    uWorldInverseTranspose: worldInverseTransposeMatrix,
    uReverseLightDirection: normalizeLight,
    uColor: state.models[0].pickedColor.concat(1.0),
  };

  var uniformSetters = initUniforms(gl, program);
  setUniforms(uniformSetters, uniforms);

  // render
  gl.drawArrays(gl.TRIANGLES, 0, state.models[0].model.vertices.length);

  window.requestAnimFrame(render);
}

function setWorldViewProjectionMatrix(transform) {
  const camera = setCamera();
  const projection = setProjection();
  var view = matrices.inverse(camera);
  var viewProjectionMatrix = matrices.multiply(projection, view);
  if (state.fudgeFactor < 0.01) {
    state.fudgeFactor = 0.01;
  }
  var worldViewProjectionMatrix = matrices.makeZtoWMatrix(state.fudgeFactor);
  worldViewProjectionMatrix = matrices.multiply(
    worldViewProjectionMatrix,
    viewProjectionMatrix
  );
  worldViewProjectionMatrix = matrices.multiply(
    worldViewProjectionMatrix,
    transform
  );

  return worldViewProjectionMatrix;
}

function setCamera() {
  /* Setup view matrix */
  let deg = state.models[0].viewMatrix.lookAt.map((x) => degToRad(x));
  // console.log(deg);

  var viewMatrix = matrices.multiply(
    matrices.translate(0, 0, state.models[0].viewMatrix.camera[2]),
    matrices.rotateX(deg[0])
  );
  viewMatrix = matrices.multiply(viewMatrix, matrices.rotateY(deg[1]));
  viewMatrix = matrices.multiply(viewMatrix, matrices.rotateZ(deg[2]));

  let camPos = [viewMatrix[12], viewMatrix[13], viewMatrix[14]];

  let cameraMatrix = matrices.lookAt(
    camPos,
    state.models[0].viewMatrix.lookAt,
    state.models[0].viewMatrix.up
  );

  return cameraMatrix;
}

function setTransform() {
  /* Setup transform matrix */
  let centroid = locateCentroid(state.models[0].model.vertices);

  var transformMatrix = matrices.multiply(
    matrices.translate(
      state.models[0].transform.translate[0],
      state.models[0].transform.translate[1],
      state.models[0].transform.translate[2]
    ),
    matrices.translate(centroid[0], centroid[1], centroid[2])
  );

  transformMatrix = matrices.multiply(
    transformMatrix,
    matrices.rotateX(state.models[0].transform.rotate[0])
  );

  transformMatrix = matrices.multiply(
    transformMatrix,
    matrices.rotateY(state.models[0].transform.rotate[1])
  );

  transformMatrix = matrices.multiply(
    transformMatrix,
    matrices.rotateZ(state.models[0].transform.rotate[2])
  );

  transformMatrix = matrices.multiply(
    transformMatrix,
    matrices.scale(
      state.models[0].transform.scale[0],
      state.models[0].transform.scale[1],
      state.models[0].transform.scale[2]
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
  let farOrtho = state.models[0].viewMatrix.far * 1;
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
      state.models[0].viewMatrix.near,
      state.models[0].viewMatrix.far
    );
  }
}
