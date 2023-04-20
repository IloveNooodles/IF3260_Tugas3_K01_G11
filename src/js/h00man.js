const torso = new ObjectNode();
torso.name = "torso";
torso.model = generateCuboid(0.75, 0.5, 0.25, [0, 0, 0]);
torso.transform = {
  anchorOffset: [0, 0, 0],
  translate: [0, 0, 0],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(torso.pickedColor = [1, 0, 0]),
  (torso.viewMatrix = {
    camera: [0, 0, 5],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
torso.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const head = new ObjectNode();
head.name = "head";
head.model = generateCuboid(0.5, 0.5, 0.5, [0, 0.25, 0]);
head.transform = {
  // anchorOffset: [0, 0.25, 0],
  translate: [0, 0.375, 0],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
head.pickedColor = [1, 0, 0];
head.viewMatrix = {
  camera: [0, 0, 5],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
head.animation = {
  isAnimate: false,
  degAnimate: 0.1,
  animate: [
    { rotate: [0.125, 0, 0], translate: [0, 0.375, 0], scale: [1, 1, 1] },
    { rotate: [-0.125, 0, 0], translate: [0, 0.375, 0], scale: [1, 1, 1] },
  ],
};

const leftUpperArm = new ObjectNode();
leftUpperArm.name = "leftUpperArm";
leftUpperArm.model = generateCuboid(0.375, 0.25, 0.25, [0.125, -0.0625, 0]);
leftUpperArm.transform = {
  // anchorOffset: [0.125, -0.0625, 0],
  rotate: [0, 0, 0],
  translate: [0.25, 0.25, 0],
  scale: [1, 1, 1],
};
leftUpperArm.pickedColor = [1, 0, 0];
leftUpperArm.viewMatrix = {
  camera: [0, 0, 5],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
leftUpperArm.animation = {
  isAnimate: false,
  degAnimate: 0.1,
  animate: [
    { rotate: [0.125, 0, 0], translate: [0.25, 0.25, 0], scale: [1, 1, 1] },
    { rotate: [-0.125, 0, 0], translate: [0.25, 0.25, 0], scale: [1, 1, 1] },
  ],
};

const leftLowerArm = new ObjectNode();
leftLowerArm.name = "leftLowerArm";
leftLowerArm.model = generateCuboid(0.375, 0.25, 0.25, [0, -0.1875, 0.125]);
leftLowerArm.transform = {
  // anchorOffset: [0, -0.1875, 0.125],
  rotate: [0, 0, 0],
  translate: [0.125, -0.25, -0.125],
  scale: [1, 1, 1],
};
leftLowerArm.pickedColor = [1, 0, 0];
leftLowerArm.viewMatrix = {
  camera: [0, 0, 5],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
leftLowerArm.animation = {
  isAnimate: false,
  degAnimate: 0.1,
  animate: [
    {
      rotate: [0.125, 0, 0],
      translate: [0.125, -0.25, -0.125],
      scale: [1, 1, 1],
    },
    {
      rotate: [-0.125, 0, 0],
      translate: [0.125, -0.25, -0.125],
      scale: [1, 1, 1],
    },
  ],
};

const rightUpperArm = new ObjectNode();
rightUpperArm.name = "rightUpperArm";
rightUpperArm.model = generateCuboid(0.375, 0.25, 0.25, [-0.125, -0.0625, 0]);
rightUpperArm.transform = {
  // anchorOffset: [-0.125, -0.0625, 0],
  rotate: [0, 0, 0],
  translate: [-0.25, 0.25, 0],
  scale: [1, 1, 1],
};
rightUpperArm.pickedColor = [1, 0, 0];
rightUpperArm.viewMatrix = {
  camera: [0, 0, 5],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
rightUpperArm.animation = {
  isAnimate: false,
  degAnimate: 0.1,
  animate: [
    { rotate: [-0.125, 0, 0], translate: [-0.25, 0.25, 0], scale: [1, 1, 1] },
    { rotate: [0.125, 0, 0], translate: [-0.25, 0.25, 0], scale: [1, 1, 1] },
  ],
};

const rightLowerArm = new ObjectNode();
rightLowerArm.name = "rightLowerArm";
rightLowerArm.model = generateCuboid(0.375, 0.25, 0.25, [0, -0.1875, 0.125]);
rightLowerArm.transform = {
  // anchorOffset: [0, -0.1875, 0.125],
  rotate: [0, 0, 0],
  translate: [-0.125, -0.25, -0.125],
  scale: [1, 1, 1],
};
rightLowerArm.pickedColor = [1, 0, 0];
rightLowerArm.viewMatrix = {
  camera: [0, 0, 5],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
rightLowerArm.animation = {
  isAnimate: false,
  degAnimate: 0.1,
  animate: [
    {
      rotate: [-0.125, 0, 0],
      translate: [-0.125, -0.25, -0.125],
      scale: [1, 1, 1],
    },
    {
      rotate: [0.125, 0, 0],
      translate: [-0.125, -0.25, -0.125],
      scale: [1, 1, 1],
    },
  ],
};

const leftUpperLeg = new ObjectNode();
leftUpperLeg.name = "leftUpperLeg";
leftUpperLeg.model = generateCuboid(0.375, 0.25, 0.25, [0, -0.1875, 0]);
leftUpperLeg.transform = {
  // anchorOffset: [0, -0.1875, 0],
  rotate: [0, 0, 0],
  translate: [0.125, -0.375, 0],
  scale: [1, 1, 1],
};
leftUpperLeg.pickedColor = [1, 0, 0];
leftUpperLeg.viewMatrix = {
  camera: [0, 0, 5],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
leftUpperLeg.animation = {
  isAnimate: false,
  degAnimate: 0.1,
  animate: [
    { rotate: [0.125, 0, 0], translate: [0.125, -0.375, 0], scale: [1, 1, 1] },
    { rotate: [-0.125, 0, 0], translate: [0.125, -0.375, 0], scale: [1, 1, 1] },
  ],
};

const leftLowerLeg = new ObjectNode();
leftLowerLeg.name = "leftLowerLeg";
leftLowerLeg.model = generateCuboid(0.375, 0.25, 0.25, [0, -0.1875, -0.125]);
leftLowerLeg.transform = {
  // anchorOffset: [0, -0.1875, -0.125],
  rotate: [0, 0, 0],
  translate: [0, -0.375, 0.125],
  scale: [1, 1, 1],
};
leftLowerLeg.pickedColor = [1, 0, 0];
leftLowerLeg.viewMatrix = {
  camera: [0, 0, 5],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
leftLowerLeg.animation = {
  isAnimate: false,
  degAnimate: 0.1,
  animate: [
    { rotate: [-0.125, 0, 0], translate: [0, -0.375, 0.125], scale: [1, 1, 1] },
    // { rotate: [0, 0, 0] },
    { rotate: [0.125, 0, 0], translate: [0, -0.375, 0.125], scale: [1, 1, 1] },
  ],
};

const rightUpperLeg = new ObjectNode();
rightUpperLeg.name = "rightUpperLeg";
rightUpperLeg.model = generateCuboid(0.375, 0.25, 0.25, [0, -0.1875, 0]);
rightUpperLeg.transform = {
  // anchorOffset: [0, -0.1875, 0],
  rotate: [0, 0, 0],
  translate: [-0.125, -0.375, 0],
  scale: [1, 1, 1],
};
rightUpperLeg.pickedColor = [1, 0, 0];
rightUpperLeg.viewMatrix = {
  camera: [0, 0, 5],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
rightUpperLeg.animation = {
  isAnimate: false,
  degAnimate: 0.1,
  animate: [
    {
      rotate: [-0.125, 0, 0],
      translate: [-0.125, -0.375, 0],
      scale: [1, 1, 1],
    },
    // { rotate: [0, 0, 0] },
    { rotate: [0.125, 0, 0], translate: [-0.125, -0.375, 0], scale: [1, 1, 1] },
  ],
};

const rightLowerLeg = new ObjectNode();
rightLowerLeg.name = "rightLowerLeg";
rightLowerLeg.model = generateCuboid(0.375, 0.25, 0.25, [0, -0.1875, -0.125]);
rightLowerLeg.transform = {
  // anchorOffset: [0, -0.1875, -0.125],
  translate: [0, -0.375, 0.125],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
rightLowerLeg.pickedColor = [1, 0, 0];
rightLowerLeg.viewMatrix = {
  camera: [0, 0, 5],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
rightLowerLeg.animation = {
  isAnimate: false,
  degAnimate: 0.1,
  animate: [
    { rotate: [0.125, 0, 0], translate: [0, -0.375, 0.125], scale: [1, 1, 1] },
    // { rotate: [0, 0, 0] },
    { rotate: [-0.125, 0, 0], translate: [0, -0.375, 0.125], scale: [1, 1, 1] },
  ],
};

head.setParent(torso);
leftUpperArm.setParent(torso);
leftLowerArm.setParent(leftUpperArm);
rightUpperArm.setParent(torso);
rightLowerArm.setParent(rightUpperArm);
leftUpperLeg.setParent(torso);
leftLowerLeg.setParent(leftUpperLeg);
rightUpperLeg.setParent(torso);
rightLowerLeg.setParent(rightUpperLeg);

const endModel = [torso];
