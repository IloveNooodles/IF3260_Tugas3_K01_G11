const torsoHorizontal = new ObjectNode();
torsoHorizontal.name = "torsoHorizontal";
torsoHorizontal.model = generateCuboid(0.2, 1, 0.3, [0, 0, 0]);
torsoHorizontal.transform = {
  translate: [0, 0, 0],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(torsoHorizontal.pickedColor = [1, 0, 0]),
  (torsoHorizontal.viewMatrix = { 
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
torsoHorizontal.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const headMiddle = new ObjectNode();
headMiddle.name = "headMiddle";
headMiddle.model = generateCuboid(0.45, 0.45, 0.45, [0, 0, 0]);
headMiddle.transform = {
  translate: [0, 0.32, 0],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(headMiddle.pickedColor = [1, 0, 0]),
  (headMiddle.viewMatrix = { 
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
headMiddle.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const rightEyeMiddle = new ObjectNode();
rightEyeMiddle.name = "rightEyeMiddle";
rightEyeMiddle.model = generateCuboid(0.1, 0.12, 0.1, [0, 0, 0]);
rightEyeMiddle.transform = {
  translate: [-0.1, 0.05, 0.2],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(rightEyeMiddle.pickedColor = [1, 0, 0]),
  (rightEyeMiddle.viewMatrix = { 
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
rightEyeMiddle.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const leftEyeMiddle = new ObjectNode();
leftEyeMiddle.name = "leftEyeMiddle";
leftEyeMiddle.model = generateCuboid(0.1, 0.12, 0.1, [0, 0, 0]);
leftEyeMiddle.transform = {
  translate: [0.1, 0.05, 0.2],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(leftEyeMiddle.pickedColor = [1, 0, 0]),
  (leftEyeMiddle.viewMatrix = { 
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
leftEyeMiddle.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const lipMiddle = new ObjectNode();
lipMiddle.name = "lipMiddle";
lipMiddle.model = generateCuboid(0.1, 0.2, 0.1, [0, 0, 0]);
lipMiddle.transform = {
  translate: [0, -0.1, 0.2],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(lipMiddle.pickedColor = [1, 0, 0]),
  (lipMiddle.viewMatrix = { 
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
lipMiddle.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const headRight = new ObjectNode();
headRight.name = "headRight";
headRight.model = generateCuboid(0.35, 0.35, 0.35, [0, 0, 0]);
headRight.transform = {
  translate: [-0.5, 0.2, 0],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(headRight.pickedColor = [1, 0, 0]),
  (headRight.viewMatrix = { 
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
headRight.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const rightEyeRight = new ObjectNode();
rightEyeRight.name = "rightEyeRight";
rightEyeRight.model = generateCuboid(0.07, 0.09, 0.1, [0, 0, 0]);
rightEyeRight.transform = {
  translate: [-0.08, 0.05, 0.15],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(rightEyeRight.pickedColor = [1, 0, 0]),
  (rightEyeRight.viewMatrix = { 
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
rightEyeRight.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const leftEyeRight = new ObjectNode();
leftEyeRight.name = "leftEyeRight";
leftEyeRight.model = generateCuboid(0.07, 0.09, 0.1, [0, 0, 0]);
leftEyeRight.transform = {
  translate: [0.08, 0.05, 0.15],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(leftEyeRight.pickedColor = [1, 0, 0]),
  (leftEyeRight.viewMatrix = { 
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
leftEyeRight.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const lipRight = new ObjectNode();
lipRight.name = "lipRight";
lipRight.model = generateCuboid(0.07, 0.17, 0.1, [0, 0, 0]);
lipRight.transform = {
  translate: [0, -0.08, 0.15],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(lipRight.pickedColor = [1, 0, 0]),
  (lipRight.viewMatrix = { 
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
lipRight.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const headLeft = new ObjectNode();
headLeft.name = "headLeft";
headLeft.model = generateCuboid(0.35, 0.35, 0.35, [0, 0, 0]);
headLeft.transform = {
  translate: [0.5, 0.2, 0],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(headLeft.pickedColor = [1, 0, 0]),
  (headLeft.viewMatrix = { 
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
headLeft.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const rightEyeLeft = new ObjectNode();
rightEyeLeft.name = "rightEyeLeft";
rightEyeLeft.model = generateCuboid(0.07, 0.09, 0.1, [0, 0, 0]);
rightEyeLeft.transform = {
  translate: [-0.08, 0.05, 0.15],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(rightEyeLeft.pickedColor = [1, 0, 0]),
  (rightEyeLeft.viewMatrix = { 
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
rightEyeLeft.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const leftEyeLeft = new ObjectNode();
leftEyeLeft.name = "leftEyeLeft";
leftEyeLeft.model = generateCuboid(0.07, 0.09, 0.1, [0, 0, 0]);
leftEyeLeft.transform = {
  translate: [0.08, 0.05, 0.15],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(leftEyeLeft.pickedColor = [1, 0, 0]),
  (leftEyeLeft.viewMatrix = { 
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
leftEyeLeft.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const lipLeft = new ObjectNode();
lipLeft.name = "lipLeft";
lipLeft.model = generateCuboid(0.07, 0.17, 0.1, [0, 0, 0]);
lipLeft.transform = {
  translate: [0, -0.08, 0.15],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(lipLeft.pickedColor = [1, 0, 0]),
  (lipLeft.viewMatrix = { 
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
lipLeft.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const torsoVertical = new ObjectNode();
torsoVertical.name = "torsoVertical";
torsoVertical.model = generateCuboid(0.6, 0.2, 0.3, [0, 0, 0]);
torsoVertical.transform = {
  translate: [0, -0.4, 0],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
torsoVertical.pickedColor = [1, 0, 0];
torsoVertical.viewMatrix = {
  camera: [0, 0, 1],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
torsoVertical.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const ribTop = new ObjectNode();
ribTop.name = "ribTop";
ribTop.model = generateCuboid(0.1, 0.6, 0.25, [0, 0, 0]);
ribTop.transform = {
  translate: [0, 0.15, 0],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
ribTop.pickedColor = [1, 0, 0];
ribTop.viewMatrix = {
  camera: [0, 0, 1],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
ribTop.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const ribMiddle = new ObjectNode();
ribMiddle.name = "ribMiddle";
ribMiddle.model = generateCuboid(0.1, 0.6, 0.25, [0, 0, 0]);
ribMiddle.transform = {
  translate: [0, 0, 0],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
ribMiddle.pickedColor = [1, 0, 0];
ribMiddle.viewMatrix = {
  camera: [0, 0, 1],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
ribMiddle.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const ribBottom = new ObjectNode();
ribBottom.name = "ribBottom";
ribBottom.model = generateCuboid(0.1, 0.6, 0.25, [0, 0, 0]);
ribBottom.transform = {
  translate: [0, -0.15, 0],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
ribBottom.pickedColor = [1, 0, 0];
ribBottom.viewMatrix = {
  camera: [0, 0, 1],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
ribBottom.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const tail = new ObjectNode();
tail.name = "tail";
tail.model = generateCuboid(0.4, 0.19, 0.29, [0, 0, 0]);
tail.transform = {
  translate: [0, -0.35, -0.1],
  rotate: [0.75, 0, 0],
  scale: [1, 1, 1],
};
tail.pickedColor = [1, 0, 0];
tail.viewMatrix = {
  camera: [0, 0, 1],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
tail.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

headMiddle.setParent(torsoHorizontal);
rightEyeMiddle.setParent(headMiddle);
leftEyeMiddle.setParent(headMiddle);
lipMiddle.setParent(headMiddle);

headRight.setParent(torsoHorizontal);
rightEyeRight.setParent(headRight);
leftEyeRight.setParent(headRight);
lipRight.setParent(headRight);

headLeft.setParent(torsoHorizontal);
rightEyeLeft.setParent(headLeft);
leftEyeLeft.setParent(headLeft);
lipLeft.setParent(headLeft);

torsoVertical.setParent(torsoHorizontal);
ribTop.setParent(torsoVertical);
ribMiddle.setParent(torsoVertical);
ribBottom.setParent(torsoVertical);
tail.setParent(torsoVertical);

const endModel = [
    torsoHorizontal, 
    // headMiddle, 
    // rightEyeMiddle, 
    // leftEyeMiddle, 
    // lipMiddle, 
    // headRight, 
    // rightEyeRight, 
    // leftEyeRight, 
    // lipRight, 
    // headLeft, 
    // rightEyeLeft, 
    // leftEyeLeft, 
    // lipLeft, 
    // torsoVertical, 
    // ribTop, 
    // ribMiddle, 
    // ribBottom, 
    // tail
];
