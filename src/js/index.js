/* ======= Get Document Object Model ======= */
const canvas = document.getElementById("canvas");
const components = document.getElementById("components");
/* ======= WebGL Functions ======= */
const gl = canvas.getContext("webgl");

/* ======= Global object ======= */
var state;
setDefaultState();

function setDefaultState() {
  /* Setup default state for webgl canvas */
  state = {
    objects: endModel,
    lighting: {
      useLighting: false,
      lightDirection: [0, 0, 1],
    },
    projection: "orthographic", // orthographic, oblique, perspective
    fudgeFactor: 0.0,
    theta: 90.0,
    phi: 90.0,
  };

  components.innerHTML = "";
  for (var model in state.objects) {
    let component = document.createElement("div");
    component.className = "component";
    component.id = "component-" + model;
    component.innerHTML = `
      <div class="component-header">
        <h3>${state.objects[model].name}</h3>
      </div>`;
    //   <div class="component-body">
    //     <div class="component-body-row">
    //       <div class="component-body-col">
    //         <label for="translate-x-${model}">Translate X</label>
    //         <input type="number" class="form-control" id="translate-x-${model}" value="${
    //   state.objects[model].transform.translate[0]
    // }" onchange="updateModel(${model}, 'translate', 'x', this.value)">
    //       </div>
    //       <div class="component-body-col">
    //         <label for="translate-y-${model}">Translate Y</label>
    //         <input type="number" class="form-control" id="translate-y-${model}" value="${
    //   state.objects[model].transform.translate[1]
    // }" onchange="updateModel(${model}, 'translate', 'y', this.value)">
    //       </div>
    //       <div class="component-body-col">
    //         <label for="translate-z-${model}">Translate Z</label>
    //         <input type="number" class="form-control" id="translate-z-${model}" value="${
    //   state.objects[model].transform.translate[2]
    // }" onchange="updateModel(${model}, 'translate', 'z', this.value)">
    //       </div>
    //     </div>
    //     <div class="component-body-row">
    //       <div class="component-body-col">
    //         <label for="rotate-x-${model}">Rotate X</label>
    //         <input type="number" class="form-control" id="rotate-x-${model}" value="${
    //   state.objects[model].transform.rotate[0]
    // }" onchange="updateModel(${model}, 'rotate', 'x', this.value)">
    //       </div>
    //       <div class="component-body-col">
    //         <label for="rotate-y-${model}">Rotate Y</label>
    //         <input type="number" class="form-control" id="rotate-y-${model}" value="${
    //   state.objects[model].transform.rotate[1]
    // }" onchange="updateModel(${model}, 'rotate', 'y', this.value)">
    //       </div>
    //       <div class="component-body-col">
    //         <label for="rotate-z-${model}">Rotate Z</label>
    //         <input type="number" class="form-control" id="rotate-z-${model}" value="${
    //   state.objects[model].transform.rotate[2]
    // }" onchange="updateModel(${model}, 'rotate', 'z', this.value)">
    //       </div>
    //     </div>
    //     <div class="component-body-row">
    //       <div class="component-body-col">
    //         <label for="scale-x-${model}">Scale X</label>
    //         <input type="number" class="form-control" id="scale-x-${model}" value="${
    //   state.objects[model].transform.scale[0]
    // }" onchange="updateModel(${model}, 'scale', 'x', this.value)">
    //       </div>
    //       <div class="component-body-col">
    //         <label for="scale-y-${model}">Scale Y</label>
    //         <input type="number" class="form-control" id="scale-y-${model}" value="${
    //   state.objects[model].transform.scale[1]
    // }" onchange="updateModel(${model}, 'scale', 'y', this.value)">
    //       </div>
    //       <div class="component-body-col">
    //         <label for="scale-z-${model}">Scale Z</label>
    //         <input type="number" class="form-control" id="scale-z-${model}" value="${
    //   state.objects[model].transform.scale[2]
    // }" onchange="updateModel(${model}, 'scale', 'z', this.value)">
    //       </div>
    //     </div>
    //     <div class="component-body-row">
    //       <div class="component-body-col">
    //         <label for="color-${model}">Color</label>
    //         <input type="color" class="form-control" id="color-${model}" value="#${rgbToHex(
    //   state.objects[model].pickedColor[0],
    //   state.objects[model].pickedColor[1],
    //   state.objects[model].pickedColor[2]
    // )}" onchange="updateModel(${model}, 'color', this.value)">
    //       </div>
    //     </div>
    //   </div>
    components.appendChild(component);
  }
}

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
  state.objects.forEach((object) => {
    object.pickedColor = [1, 0, 0];
  });
  render();
};

function clear() {
  /* Setup white screen for webgl canvas */
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function render() {
  // prepare for rendering
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  clear();
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  // precalculation loop
  state.objects.forEach((object) => {
    // precalculations
    if (!object.model.colors) {
      object.model.colors = generateRandomColors(object.model.vertices);
    }

    if (!object.program && !state.lighting.useLighting) {
      object.program = createShaderProgram(
        gl,
        vertex_shader_3d,
        fragment_shader_3d_no_lighting
      );
    }

    if (object.animation.isObjectAnimate) {
      object.transform.rotate[1] +=
        (object.animation.degAnimate * Math.PI) / 100;
      object.transform.rotate[2] +=
        (object.animation.degAnimate * Math.PI) / 100;
      object.transform.rotate[3] +=
        (object.animation.degAnimate * Math.PI) / 100;
    }

    object.localMatrix = setTransform(object);
  });

  state.objects[0].updateWorldMatrix();
  normalizeLight = matrices.normalize(state.lighting.lightDirection);

  state.objects.forEach((object) => {
    /* Render loop for webgl canvas */
    gl.useProgram(object.program);

    object.worldMatrix = setWorldViewProjectionMatrix(
      object.worldMatrix,
      object
    );

    var attribs = {
      aPosition: {
        buffer: new Float32Array(object.model.vertices.flat(1)),
        numComponents: 3,
      },
      aNormal: {
        buffer: new Float32Array(object.model.normals.flat(1)),
        numComponents: 3,
      },
      aColor: {
        buffer: new Float32Array(object.model.colors.flat(1)),
        numComponents: 3,
      },
    };

    var attribSetters = initAttribs(gl, object.program);
    setAttribs(attribSetters, attribs);

    var uniforms = {
      uWorldViewProjection: object.worldMatrix,
      uWorldInverseTranspose: object.worldInverseMatrix,
      uReverseLightDirection: normalizeLight,
      uColor: object.pickedColor.concat(1.0),
    };

    var uniformSetters = initUniforms(gl, object.program);
    setUniforms(uniformSetters, uniforms);

    // render
    // console.log(object.name, object.localMatrix, object.localInverseMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, object.model.vertices.length);
  });
  window.requestAnimFrame(render);
}

function setWorldViewProjectionMatrix(transform, object) {
  const camera = setCamera(object);
  const projection = setProjection(object);
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

function setCamera(object) {
  /* Setup view matrix */
  let deg = object.viewMatrix.lookAt.map((x) => degToRad(x));
  // console.log(deg);

  var viewMatrix = matrices.multiply(
    matrices.translate(0, 0, object.viewMatrix.camera[2]),
    matrices.rotateX(deg[0])
  );
  viewMatrix = matrices.multiply(viewMatrix, matrices.rotateY(deg[1]));
  viewMatrix = matrices.multiply(viewMatrix, matrices.rotateZ(deg[2]));

  let camPos = [viewMatrix[12], viewMatrix[13], viewMatrix[14]];

  let cameraMatrix = matrices.lookAt(
    camPos,
    object.viewMatrix.lookAt,
    object.viewMatrix.up
  );

  return cameraMatrix;
}

function setTransform(object) {
  /* Setup transform matrix */

  let centroid = locateCentroid(object.model.vertices);

  var transformMatrix = matrices.multiply(
    matrices.translate(
      object.transform.translate[0],
      object.transform.translate[1],
      object.transform.translate[2]
    ),
    matrices.translate(centroid[0], centroid[1], centroid[2])
  );

  transformMatrix = matrices.multiply(
    transformMatrix,
    matrices.rotateX(object.transform.rotate[0])
  );

  transformMatrix = matrices.multiply(
    transformMatrix,
    matrices.rotateY(object.transform.rotate[1])
  );

  transformMatrix = matrices.multiply(
    transformMatrix,
    matrices.rotateZ(object.transform.rotate[2])
  );

  transformMatrix = matrices.multiply(
    transformMatrix,
    matrices.scale(
      object.transform.scale[0],
      object.transform.scale[1],
      object.transform.scale[2]
    )
  );

  transformMatrix = matrices.multiply(
    transformMatrix,
    matrices.translate(-centroid[0], -centroid[1], -centroid[2])
  );

  return transformMatrix;
}

function setProjection(object) {
  /* Setup projection matrix */

  const aspect = canvas.width / canvas.height;
  const fovy = degToRad(45);
  const left = -2;
  const right = 2;
  const bottom = -2;
  const top = 2;
  let farOrtho = state.objects[0].viewMatrix.far * 1;
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
      state.objects[0].viewMatrix.near,
      state.objects[0].viewMatrix.far
    );
  }
}
