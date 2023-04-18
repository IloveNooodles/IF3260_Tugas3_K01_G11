const torso = new ObjectNode();
torso.name = "torso";
torso.model = generateCuboid(0, 0, 0, [0, 0, 0]);
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

const girrafe = [torso];
