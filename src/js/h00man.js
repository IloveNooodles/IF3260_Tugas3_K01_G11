var torso = new ObjectNode();
torso.name = "torso";
torso.model = generateCuboid(1, 0.8, 0.6, [0, 0, 0]);
torso.transform = {
  translate: [0, 0, -5],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
(torso.pickedColor = [1, 0, 0]),
  (torso.viewMatrix = {
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
  });
torso.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

var leftHand = new ObjectNode();
leftHand.name = "leftHand";
leftHand.model = generateCuboid(0.9, 0.3, 0.3, [0, 0, 0]);
leftHand.transform = {
  translate: [0.7, 0.15, 0],
  rotate: [0, 0, 0.4],
  scale: [1, 1, 1],
};
leftHand.pickedColor = [1, 0, 0];
leftHand.viewMatrix = {
  camera: [0, 0, 1],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
leftHand.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

var rightHand = new ObjectNode();
rightHand.name = "rightHand";
rightHand.model = generateCuboid(0.9, 0.3, 0.3, [0, 0, 0]);
rightHand.transform = {
  translate: [-0.7, 0.15, 0],
  rotate: [0, 0, -0.4],
  scale: [1, 1, 1],
};
rightHand.pickedColor = [1, 0, 0];
rightHand.viewMatrix = {
  camera: [0, 0, 1],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
rightHand.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

var leftLeg = new ObjectNode();
leftLeg.name = "leftLeg";
leftLeg.model = generateCuboid(0.9, 0.3, 0.3, [0, 0, 0]);
leftLeg.transform = {
  translate: [0.3, -0.9, 0],
  rotate: [0, 0, 0.2],
  scale: [1, 1, 1],
};
leftLeg.pickedColor = [1, 0, 0];
leftLeg.viewMatrix = {
  camera: [0, 0, 1],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
leftLeg.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

var rightLeg = new ObjectNode();
rightLeg.name = "leftLeg";
rightLeg.model = generateCuboid(0.9, 0.3, 0.3, [0, 0, 0]);
rightLeg.transform = {
  translate: [-0.3, -0.9, 0],
  rotate: [0, 0, -0.2],
  scale: [1, 1, 1],
};
rightLeg.pickedColor = [1, 0, 0];
rightLeg.viewMatrix = {
  camera: [0, 0, 1],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
rightLeg.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

var head = new ObjectNode();
head.name = "head";
head.model = generateCuboid(0.6, 0.5, 0.5, [0, 0, 0]);
head.transform = {
  translate: [0, 0.8, 0],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};
head.pickedColor = [1, 0, 0];
head.viewMatrix = {
  camera: [0, 0, 1],
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  near: 0.1,
  far: 50,
};
head.animation = {
  isAnimate: false,
  degAnimate: 0.1,
};

leftHand.setParent(torso);
rightHand.setParent(torso);
leftLeg.setParent(torso);
rightLeg.setParent(torso);
head.setParent(torso);

var endModel = [torso, leftHand, rightHand, leftLeg, rightLeg, head];
