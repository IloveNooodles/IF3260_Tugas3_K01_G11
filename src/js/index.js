/* ======= Get Document Object Model ======= */
const canvas = document.getElementById("canvas");
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
    texture: {
      textureType: "none",
    },
    projection: "orthographic", // orthographic, oblique, perspective
    fudgeFactor: 0.0,
    theta: 90.0,
    phi: 90.0,
  };

  showComponents(state.objects);
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

function setStateBeforeRender(objects) {
  objects.forEach((object) => {
    // precalculations
    if (!object.model.colors) {
      console.log(object.pickedColor);
      if (!object.pickedColor) {
        object.model.colors = generateColors(object.model.vertices);
      } else {
        object.model.colors = generateColors(
          object.model.vertices,
          object.pickedColor
        );
      }
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
    if (object.children.length > 0) {
      setStateBeforeRender(object.children);
    }
  });
}

function renderLoop(objects) {
  objects.forEach((object) => {
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
      aTexture: {
        buffer: new Float32Array(),
        numComponents: 2,
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
    if (object.children.length > 0) {
      renderLoop(object.children);
    }
  });
}

function render() {
  // prepare for rendering
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  clear();
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  // precalculation loop
  setStateBeforeRender(state.objects);

  state.objects[0].updateWorldMatrix();
  normalizeLight = matrices.normalize(state.lighting.lightDirection);

  renderLoop(state.objects);
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

  var transformMatrix = matrices.translate(
    object.transform.translate[0],
    object.transform.translate[1],
    object.transform.translate[2]
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
