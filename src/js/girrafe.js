const torso = new ObjectNode();
torso.name = "torso";
torso.model = generateCuboid(1, 1, 2, [0, 0, 0]);
torso.transform = {
  translate: [0, -0.35, 0],
  rotate: [0, -37, 0],
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
  animate: [
    {
      translate: [0, -0.35, 0],
      rotate: arrDegToRad([0, -37, 0]),
      scale: [1, 1, 1],
    },
    {
      translate: [0, -1, 0],
      rotate: arrDegToRad([0, -37, 0]),
      scale: [1, 1, 1],
    },
  ],
};

const leftFrontLeg = new ObjectNode();
leftFrontLeg.name = "leftFrontLeg";
leftFrontLeg.model = generateCuboid(1, 0.2, 0.3, [0, 0, 0]);
leftFrontLeg.transform = {
  translate: [-0.4, -1, 0.85],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(leftFrontLeg.pickedColor = [1, 0, 0]),
  (leftFrontLeg.viewMatrix = {
    camera: [0, 0, 5],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
leftFrontLeg.animation = {
  isAnimate: false,
  degAnimate: 0.1,
  animate: [
    {
      translate: [-0.4, -1, 0.85],
      rotate: arrDegToRad([-19, 0, 0]),
      scale: [1, 1, 1],
    },
    {
      translate: [-0.4, -1, 0.85],
      rotate: arrDegToRad([19, 0, 0]),
      scale: [1, 1, 1],
    },
  ],
};

const rightFrontLeg = new ObjectNode();
rightFrontLeg.name = "rightFrontLeg";
rightFrontLeg.model = generateCuboid(1, 0.2, 0.3, [0, 0, 0]);
rightFrontLeg.transform = {
  translate: [0.4, -1, 0.85],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(rightFrontLeg.pickedColor = [1, 0, 0]),
  (rightFrontLeg.viewMatrix = {
    camera: [0, 0, 5],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
rightFrontLeg.animation = {
  isAnimate: false,
  degAnimate: 0.1,
  animate: [
    {
      translate: [0.4, -1, 0.85],
      rotate: arrDegToRad([-19, 0, 0]),
      scale: [1, 1, 1],
    },
    {
      translate: [0.4, -1, 0.85],
      rotate: arrDegToRad([19, 0, 0]),
      scale: [1, 1, 1],
    },
  ],
};

const leftBackLeg = new ObjectNode();
leftBackLeg.name = "leftBackLeg";
leftBackLeg.model = generateCuboid(1, 0.2, 0.3, [0, 0, 0]);
leftBackLeg.transform = {
  translate: [0.4, -1, -0.85],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(leftBackLeg.pickedColor = [1, 0, 0]),
  (leftBackLeg.viewMatrix = {
    camera: [0, 0, 5],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
leftBackLeg.animation = {
  isAnimate: false,
  degAnimate: 0.1,
  animate: [
    {
      translate: [0.4, -1, -0.85],
      rotate: arrDegToRad([-19, 0, 0]),
      scale: [1, 1, 1],
    },
    {
      translate: [0.4, -1, -0.85],
      rotate: arrDegToRad([19, 0, 0]),
      scale: [1, 1, 1],
    },
  ],
};

const rightBackLeg = new ObjectNode();
rightBackLeg.name = "rightBackLeg";
rightBackLeg.model = generateCuboid(1, 0.2, 0.3, [0, 0, 0]);
rightBackLeg.transform = {
  translate: [-0.4, -1, -0.85],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(rightBackLeg.pickedColor = [1, 0, 0]),
  (rightBackLeg.viewMatrix = {
    camera: [0, 0, 5],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
rightBackLeg.animation = {
  isAnimate: false,
  degAnimate: 0.1,
  animate: [
    {
      translate: [-0.4, -1, -0.85],
      rotate: arrDegToRad([-19, 0, 0]),
      scale: [1, 1, 1],
    },
    {
      translate: [-0.4, -1, -0.85],
      rotate: arrDegToRad([19, 0, 0]),
      scale: [1, 1, 1],
    },
  ],
};

const tail = new ObjectNode();
tail.name = "tail";
tail.model = generateCuboid(1, 0.2, 0.2, [0, 0, 0]);
tail.transform = {
  translate: [0, -0.1, -1.21],
  rotate: [197.74, 0, 0],
  scale: [1, 1, 1],
};
(tail.pickedColor = [1, 0, 0]),
  (tail.viewMatrix = {
    camera: [0, 0, 5],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
tail.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const tailBelow = new ObjectNode();
tailBelow.name = "tailBelow";
tailBelow.model = generateCuboid(0.4, 0.4, 0.4, [0, 0, 0]);
tailBelow.transform = {
  translate: [0, 0.5, 0],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(tailBelow.pickedColor = [1, 0, 0]),
  (tailBelow.viewMatrix = {
    camera: [0, 0, 5],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
tailBelow.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const neck = new ObjectNode();
neck.name = "neck";
neck.model = generateCuboid(2, 0.7, 0.5, [0, 0, 0]);
neck.transform = {
  translate: [0, 1, 1],
  rotate: [-329, 0, 0],
  scale: [1, 1, 1],
};
(neck.pickedColor = [1, 0, 0]),
  (neck.viewMatrix = {
    camera: [0, 0, 5],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
neck.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const head = new ObjectNode();
head.name = "head";
head.model = generateCuboid(0.6, 0.66, 1, [0, 0, 0]);
head.transform = {
  translate: [0, 1.2, 0.3],
  rotate: [344.78897565411626, 0, 0],
  scale: [1, 1, 1],
};
(head.pickedColor = [1, 0, 0]),
  (head.viewMatrix = {
    camera: [0, 0, 5],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
head.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const leftEye = new ObjectNode();
leftEye.name = "leftEye";
leftEye.model = generateCuboid(0.15, 0.15, 0.2, [0, 0, 0]);
leftEye.transform = {
  translate: [0.3, 0, 0],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(leftEye.pickedColor = [1, 0, 0]),
  (leftEye.viewMatrix = {
    camera: [0, 0, 5],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
leftEye.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

const rightEye = new ObjectNode();
rightEye.name = "rightEye";
rightEye.model = generateCuboid(0.15, 0.15, 0.2, [0, 0, 0]);
rightEye.transform = {
  translate: [-0.3, 0, 0],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(rightEye.pickedColor = [1, 0, 0]),
  (rightEye.viewMatrix = {
    camera: [0, 0, 5],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
rightEye.animation = {
  isAnimate: false,
  degAnimate: 0.1,
  animate: [
    {
      translate: [-0.3, 0, 0],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [-0.3, 0, 0],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [-0.3, 0, 0],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [-0.3, 0, 0],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [-0.3, 0, 0],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [-0.3, 0, 0],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [-0.3, 0, 0],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [-0.3, 0, 0],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [-0.3, 0, 0],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
  ],
};

const nose = new ObjectNode();
nose.name = "nose";
nose.model = generateCuboid(0.4, 0.4, 1, [0, 0, 0]);
nose.transform = {
  translate: [0, 0, 0.3],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(nose.pickedColor = [1, 0, 0]),
  (nose.viewMatrix = {
    camera: [0, 0, 5],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
nose.animation = {
  isAnimate: false,
  degAnimate: 0.1,
  animate: [
    {
      translate: [0, 0, 0.3],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [0, 0, 0.31],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [0, 0, 0.33],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [0, 0, 0.35],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [0, 0, 0.33],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [0, 0, 0.31],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [0, 0, 0.3],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [0, 0, 0.31],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      translate: [0, 0, 0.33],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    },
  ],
};

/* Set parent */
leftFrontLeg.setParent(torso);
rightFrontLeg.setParent(torso);
leftBackLeg.setParent(torso);
rightBackLeg.setParent(torso);
tail.setParent(torso);
tailBelow.setParent(tail);
neck.setParent(torso);
head.setParent(neck);
leftEye.setParent(head);
rightEye.setParent(head);
nose.setParent(head);

const endModel = [torso];
