function generateFrameFromKeyFrame(firstKeyFrame, secondKeyFrame, fps) {
  let endFrame = [];
  let translateDelta = [];
  let rotateDelta = [];
  let scaleDelta = [];

  for (let i = 0; i < 3; i++) {
    translateDelta.push(secondKeyFrame.translate[i] - firstKeyFrame.translate[i]);
    rotateDelta.push(secondKeyFrame.rotate[i] - firstKeyFrame.rotate[i]);
    scaleDelta.push(secondKeyFrame.scale[i] - firstKeyFrame.scale[i]);
  }

  console.log(translateDelta, rotateDelta, scaleDelta)

  for (let i = 0; i < fps; i++) {
    generatedRotate = firstKeyFrame.rotate.map(
      (val, index) => val + rotateDelta[index] * i / fps
    );
    generatedTranslate = firstKeyFrame.translate.map(
      (val, index) => val + translateDelta[index] * i / fps
    );
    generatedScale = firstKeyFrame.scale.map(
      (val, index) => val + scaleDelta[index] * i / fps
    );

    frame = {
      translate: generatedTranslate,
      rotate: generatedRotate,
      scale: generatedScale,
    };
    endFrame.push(frame);
  }

  console.log(endFrame);
  return endFrame;
}
