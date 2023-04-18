/* ======= value conversion ======= */
function radToDeg(radians) {
  return (radians * 180) / Math.PI;
}

function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

function rgbToHex(r, g, b) {
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/* ======= WebGL-related ======= */
function resizeCanvas(canvas) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    canvas.width = width;
    canvas.height = height;
  }
}

function setPrecision(number) {
  return parseFloat(number.toPrecision(12));
}

/* matrix is 3d */
function locateCentroid(matrix) {
  let x = 0;
  let y = 0;
  let z = 0;
  let vertexCount = matrix.length;
  for (let i = 0; i < vertexCount; i++) {
    x = setPrecision(matrix[i][0] + x);
    y = setPrecision(matrix[i][1] + y);
    z = setPrecision(matrix[i][2] + z);
  }

  x = x / vertexCount;
  y = y / vertexCount;
  z = z / vertexCount;

  return [x, y, z];
}

function calculateEulerDistance(cross) {
  return Math.sqrt(
    Math.pow(cross[0], 2) + Math.pow(cross[1], 2) + Math.pow(cross[2], 2)
  );
}

function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function normalize(v) {
  let length = calculateEulerDistance(v);
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}

function toVertices(vertices, faces) {
  let newVertices = [];
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    for (let j = 0; j < face.length; j++) {
      let vertex = vertices[face[j] - 1];
      newVertices.push(vertex);
    }
  }
  return newVertices;
}

function generateNormals(vertices, faces) {
  let normals = [];
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    let v1 = vertices[face[0] - 1];
    let v2 = vertices[face[1] - 1];
    let v3 = vertices[face[2] - 1];

    let v1v2 = subtractVectors(v2, v1);
    let v1v3 = subtractVectors(v3, v1);

    let crossRes = normalize(cross(v1v2, v1v3));

    // add for each 3 vertices
    normals.push(crossRes);
    normals.push(crossRes);
    normals.push(crossRes);
  }
  return normals;
}

function generateRandomColors(vertices) {
  let colors = [];
  for (let i = 0; i < vertices.length; i += 3) {
    temp = [Math.random(), Math.random(), Math.random()];
    colors.push(temp);
    colors.push(temp);
    colors.push(temp);
    colors.push(temp);
    colors.push(temp);
    colors.push(temp);
  }
  return colors;
}

/* ======= JSON Handler ======= */
function loadObject(jsonString) {
  parsedObject = JSON.parse(jsonString);
  var objects = [];
  for (var i = 0; i < parsedObject.length; i++) {
    var node = parsedObject[i];
    var nodeData = new ObjectNode();
    nodeData.name = node.name;
    nodeData.model = node.model;
    nodeData.transform = node.transform;
    nodeData.pickedColor = node.pickedColor;
    nodeData.viewMatrix = node.viewMatrix;
    nodeData.animation = node.animation;
    if (node.parent != null) {
      nodeData.parent = node.parent;
      var parentIndex = objects.findIndex((obj) => obj.name == node.parent);
      console.log(parentIndex);
      objects[parentIndex].children.push(nodeData);
    }
    objects.push(nodeData);
  }
  return objects;
}

function saveObject(objects) {
  var model = [];
  for (var i = 0; i < objects.length; i++) {
    var node = objects[i];
    var nodeData = {
      name: node.name,
      model: node.model,
      transform: node.transform,
      pickedColor: node.pickedColor,
      viewMatrix: node.viewMatrix,
      animation: node.animation,
    };
    if (node.parent != null) {
      nodeData.parent = node.parent;
    }
    model.push(nodeData);
  }
  saveObject = JSON.stringify(model);
  return saveObject;
}
