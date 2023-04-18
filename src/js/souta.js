const seat = new ObjectNode();
seat.name = "seat";
seat.model = generateCuboid(0.2, 1.2, 0.9, [0, 0, 0]);
seat.transform = {
    translate: [0, 0, 0],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
};
(seat.pickedColor = [1, 0, 0]),
(seat.viewMatrix = {
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
});
seat.animation = {
    isAnimate: false,
    degAnimate: 0.1,
};

const rightFrontLeg = new ObjectNode();
rightFrontLeg.name = "rightFrontLeg";
rightFrontLeg.model = generateCuboid(0.8, 0.15, 0.15, [0, 0, 0]);
rightFrontLeg.transform = {
    translate: [-0.4, -0.5, 0.3],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
};
(rightFrontLeg.pickedColor = [1, 0, 0]),
(rightFrontLeg.viewMatrix = {
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
});
rightFrontLeg.animation = {
    isAnimate: false,
    degAnimate: 0.1,
};

const rightRearLeg = new ObjectNode();
rightRearLeg.name = "rightRearLeg";
rightRearLeg.model = generateCuboid(0.8, 0.15, 0.15, [0, 0, 0]);
rightRearLeg.transform = {
    translate: [-0.4, -0.5, -0.3],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
};
(rightRearLeg.pickedColor = [1, 0, 0]),
(rightRearLeg.viewMatrix = {
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
});
rightRearLeg.animation = {
    isAnimate: false,
    degAnimate: 0.1,
};

const leftRearLeg = new ObjectNode();
leftRearLeg.name = "leftRearLeg";
leftRearLeg.model = generateCuboid(0.8, 0.15, 0.15, [0, 0, 0]);
leftRearLeg.transform = {
    translate: [0.4, -0.5, -0.3],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
};
(leftRearLeg.pickedColor = [1, 0, 0]),
(leftRearLeg.viewMatrix = {
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
});
leftRearLeg.animation = {
    isAnimate: false,
    degAnimate: 0.1,
};

const rightStile = new ObjectNode();
rightStile.name = "rightStile";
rightStile.model = generateCuboid(0.2, 0.12, 0.12, [0, 0, 0]);
rightStile.transform = {
    translate: [-0.15, -0.45, 0],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
};
(rightStile.pickedColor = [1, 0, 0]),
(rightStile.viewMatrix = {
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
});
rightStile.animation = {
    isAnimate: false,
    degAnimate: 0.1,
};

const leftStile = new ObjectNode();
leftStile.name = "leftStile";
leftStile.model = generateCuboid(0.2, 0.12, 0.12, [0, 0, 0]);
leftStile.transform = {
    translate: [0.15, -0.45, 0],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
};
(leftStile.pickedColor = [1, 0, 0]),
(leftStile.viewMatrix = {
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
});
leftStile.animation = {
    isAnimate: false,
    degAnimate: 0.1,
};

const back = new ObjectNode();
back.name = "back";
back.model = generateCuboid(0.7, 1.2, 0.15, [0, 0, 0]);
back.transform = {
    translate: [0, 0.65, -0.35],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
};
(back.pickedColor = [1, 0, 0]),
(back.viewMatrix = {
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
});
back.animation = {
    isAnimate: false,
    degAnimate: 0.1,
};

const leftEye = new ObjectNode();
leftEye.name = "leftEye";
leftEye.model = generateCuboid(0.12, 0.05, 0.01, [0, 0, 0]);
leftEye.transform = {
    translate: [0.3, 0.1, 0.1],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
};
(leftEye.pickedColor = [1, 0, 0]),
(leftEye.viewMatrix = {
    camera: [0, 0, 1],
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
rightEye.model = generateCuboid(0.12, 0.05, 0.01, [0, 0, 0]);
rightEye.transform = {
    translate: [-0.3, 0.1, 0.1],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
};
(rightEye.pickedColor = [1, 0, 0]),
(rightEye.viewMatrix = {
    camera: [0, 0, 1],
    lookAt: [0, 0, 0],
    up: [0, 1, 0],
    near: 0.1,
    far: 50,
});
rightEye.animation = {
    isAnimate: false,
    degAnimate: 0.1,
};

rightFrontLeg.setParent(seat);
rightRearLeg.setParent(seat);
leftRearLeg.setParent(seat);
rightStile.setParent(back);
leftStile.setParent(back);
back.setParent(seat);
leftEye.setParent(back);
rightEye.setParent(back);

const endModel = [seat, rightFrontLeg, rightRearLeg, leftRearLeg, rightStile, leftStile, back, leftEye, rightEye];