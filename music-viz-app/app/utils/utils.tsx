export const pitchVals = [
  40, 41, 43, 45, 47, 48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71,
  72, 74, 76, 77, 79, 81,
];

export const findClosestIndex = (pitch: number) => {
  let i = pitchVals.findIndex((pitchVal) => pitchVal === pitch);
  if (i !== -1) {
    return i;
  } else {
    for (let j = 0; j < pitchVals.length; j++) {
      const existingPitch = pitchVals[j];
      if (pitch < existingPitch) {
        return j - 1; // used to be - 0.5
      }
    }
  }
};

export const getY = (pitch: number, canvas: HTMLCanvasElement) => {
  const pitchIndex = findClosestIndex(pitch);
  const staffY = canvas.height * 0.3;
  const lineSpacing = (canvas.height * 0.2) / 5;
  const noteHeight = lineSpacing;

  let y;
  if (pitchIndex) {
    const key = pitchIndex - 11;
    y = staffY + 4 * lineSpacing + ((3 - key) * lineSpacing - noteHeight) / 2;
  }
  return y;
};

export const getAlpha = (x: number, canvas: HTMLCanvasElement) => {
  const fadeWidth = 150;
  if (x <= fadeWidth) {
    return x / fadeWidth;
  } else {
    return 1.0;
  }
};
