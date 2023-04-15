var tetrahedron = {
  vertices: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [0, 0, 0],
  ],
  faces: [
    [2, 4, 3],
    [4, 2, 1],
    [3, 1, 2],
    [1, 3, 4],
  ],
  normals: [
    [-1, 0, 0],
    [0, 0, -1],
    [1, 1, 1],
    [0, -1, 0],
  ],
  colors: [
    [1, 1, 0],
    [0, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
};

var cube = {
  vertices: [
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [1, 1, 0],
    [0, 0, -1],
    [1, 0, -1],
    [0, 1, -1],
    [1, 1, -1],
  ],
  faces: [
    [1, 2, 3],
    [4, 3, 2],
    [1, 3, 5],
    [7, 5, 3],
    [1, 5, 2],
    [5, 6, 2],
    [2, 6, 4],
    [6, 8, 4],
    [4, 8, 3],
    [8, 7, 3],
    [5, 7, 6],
    [7, 8, 6],
  ],
  normals: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 1],
  ],
  colors: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 1],
  ],
};

var cubeAlt = {
  vertices: toVertices(cube.vertices, cube.faces),
  normals: generateNormals(cube.vertices, cube.faces),
  colors: null,
};

function generateCuboid(height, width, depth, offset) {
  // generate cuboid with given height, width and depth
  // height, width and depth value range is [0, 1]
  // offset is the offset of the center of the cuboid
  // offset value range is [-1, 1]

  let vertices = [
    [offset[0] - width / 2, offset[1] - height / 2, offset[2] - depth / 2],
    [offset[0] + width / 2, offset[1] - height / 2, offset[2] - depth / 2],
    [offset[0] - width / 2, offset[1] + height / 2, offset[2] - depth / 2],
    [offset[0] + width / 2, offset[1] + height / 2, offset[2] - depth / 2],
    [offset[0] - width / 2, offset[1] - height / 2, offset[2] + depth / 2],
    [offset[0] + width / 2, offset[1] - height / 2, offset[2] + depth / 2],
    [offset[0] - width / 2, offset[1] + height / 2, offset[2] + depth / 2],
    [offset[0] + width / 2, offset[1] + height / 2, offset[2] + depth / 2],
  ];

  let faces = [
    [1, 3, 2],
    [4, 2, 3],
    [1, 2, 5],
    [6, 5, 2],
    [1, 5, 3],
    [5, 7, 3],
    [2, 4, 6],
    [8, 6, 4],
    [4, 3, 8],
    [7, 8, 3],
    [5, 6, 7],
    [8, 7, 6],
  ];

  let normals = generateNormals(vertices, faces);
  vertices = toVertices(vertices, faces);

  // generate random color each vertices
  let colors = [];
  for (let i = 0; i < vertices.length; i++) {
    colors.push([Math.random(), Math.random(), Math.random()]);
  }
  return {
    vertices: vertices,
    normals: normals,
    colors: colors,
  };
}
