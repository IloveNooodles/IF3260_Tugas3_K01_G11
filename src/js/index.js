/* ======= Get Document Object Model ======= */
const canvas = document.getElementById("canvas");
/* ======= WebGL Functions ======= */
const gl = canvas.getContext("webgl");
const fps = 60;
var counter = 0;
var offset = 1;
var isAnimationRun = false;
/* ======= Global object ======= */
var state;
setDefaultState();

function setDefaultState() {
  /* Setup default state for webgl canvas */
  state = {
    objects: endModel,
    focus: null,
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
  setDefaultRotationToRadian(state.objects);
  initAnimation(state.objects);
  showComponents(state.objects);
}

function initAnimation(objects) {
  objects.forEach((object) => {
    if (object.animation.animate) {
      object.animation.animate = generateFrameFromKeyFrame(
        object.animation.animate[0],
        object.animation.animate[1],
        fps
      );
    }
    if (object.children.length > 0) {
      initAnimation(object.children);
    }
  });
}

function setDefaultRotationToRadian(objects) {
  objects.forEach((object) => {
    updatedRotation = object.transform.rotate.map((val) => degToRad(val));
    object.transform.rotate = updatedRotation;
    if (object.children.length > 0) {
      setDefaultRotationToRadian(object.children);
    }
  });
}

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 1);
    }
  );
})();

window.onload = function () {
  if (!gl) {
    alert("WebGL not supported");
  }
  colorPicker.value = "#FF0000";
  state.focus = state.objects[0];
  setSliderState(state.focus);
  setTransformTo(state.focus);
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
      // console.log(object.pickedColor);
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

    if (object.animation.isObjectAnimate && object.animation.animate) {
      object.transform = object.animation.animate[counter % fps];
      console.log(object.transform);
    }

    // object.transform = object.animation.animate[counter % fps];
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

    var modelMatrix = object.worldMatrix;

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
      /* TODO: calculate texture pos */
      aTexture: {
        buffer: new Float32Array(object.model.texCoord),
        numComponents: 2,
      },
      aTangent: {
        buffer: new Float32Array([
          1,
          0,
          0,
          1,
          0,
          0,
          1,
          0,
          0,
          1,
          0,
          0, // Front
          -1,
          0,
          0,
          -1,
          0,
          0,
          -1,
          0,
          0,
          -1,
          0,
          0, // Back
          0,
          0,
          -1,
          0,
          0,
          -1,
          0,
          0,
          -1,
          0,
          0,
          -1, // Right
          0,
          0,
          1,
          0,
          0,
          1,
          0,
          0,
          1,
          0,
          0,
          1, // Left
          1,
          0,
          0,
          1,
          0,
          0,
          1,
          0,
          0,
          1,
          0,
          0, // Top
          1,
          0,
          0,
          1,
          0,
          0,
          1,
          0,
          0,
          1,
          0,
          0, // Bottom
        ]),
        numComponents: 3,
      },
      aBitangent: {
        // buffer: new Float32Array(object.model.bitangents.flat(1)),
        buffer: new Float32Array([
          0,
          -1,
          0,
          0,
          -1,
          0,
          0,
          -1,
          0,
          0,
          -1,
          0, // Front
          0,
          -1,
          0,
          0,
          -1,
          0,
          0,
          -1,
          0,
          0,
          -1,
          0, // Back
          0,
          -1,
          0,
          0,
          -1,
          0,
          0,
          -1,
          0,
          0,
          -1,
          0, // Right
          0,
          -1,
          0,
          0,
          -1,
          0,
          0,
          -1,
          0,
          0,
          -1,
          0, // Left
          0,
          0,
          1,
          0,
          0,
          1,
          0,
          0,
          1,
          0,
          0,
          1, // Top
          0,
          0,
          -1,
          0,
          0,
          -1,
          0,
          0,
          -1,
          0,
          0,
          -1, // Bot
        ]),
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
      uModelMatrix: modelMatrix,
    };

    // console.log(object.name, object.pickedColor.concat(1.0));
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
  if (isAnimationRun) {
    counter += offset;
    if (counter >= fps - 1) {
      offset *= -1;
    } else if (counter <= 0) {
      offset *= -1;
    }
  }

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
  const projection = setProjection();
  var view = matrices.inverse(camera);
  var viewProjectionMatrix = matrices.multiply(projection, view);
  if (state.fudgeFactor < 0.01) {
    state.fudgeFactor = 0.01;
  }
  var worldViewProjectionMatrix = () => {
    if (state.projection === "perspective") {
      return matrices.multiply(
        matrices.makeZtoWMatrix(state.fudgeFactor),
        viewProjectionMatrix
      );
    } else {
      return viewProjectionMatrix;
    }
  };
  worldViewProjectionMatrix = matrices.multiply(
    worldViewProjectionMatrix(),
    transform
  );

  return worldViewProjectionMatrix;
}

function setCamera(object) {
  /* Setup view matrix */
  var viewMatrix = matrices.multiply(
    matrices.rotateY(object.viewMatrix.camera[1]),
    matrices.rotateX(object.viewMatrix.camera[0])
  );

  viewMatrix = matrices.multiply(
    viewMatrix,
    matrices.translate(0, 0, object.viewMatrix.camera[2])
  );

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
