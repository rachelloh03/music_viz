export const drawStaff = (
  canvas: HTMLCanvasElement,
  staffY: number,
  clef: string
) => {
  const ctx = canvas.getContext("2d");
  const lineSpacing = (canvas.height * 0.2) / 5;
  const lineWidth = canvas.width;

  if (!ctx) {
    return;
  }

  // draw staff lines
  for (let i = 0; i < 5; i++) {
    const y = staffY + lineSpacing * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(lineWidth, y);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  // draw nowbar
  ctx.beginPath();
  ctx.moveTo(lineWidth, 0);
  ctx.lineTo(lineWidth, canvas.height);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "black";
  ctx.stroke();

  // draw clef
  // let clefWidth = lineSpacing * 4;
  // let clefHeight = lineSpacing * 6;
  // let clefY = staffY - 0.5 * lineSpacing;
  // let clefX = 0;

  // let clefImg;

  // if (clef === "bass") {
  //   clefWidth = lineSpacing * 3;
  //   clefHeight = lineSpacing * 3.5;
  //   clefY = staffY;
  //   clefX = 10;
  //   clefImg = bassImg;
  // } else {
  //   clefImg = trebleImg;
  // }
  // if (clefImg) {
  //   ctx.drawImage(clefImg, clefX, clefY, clefWidth, clefHeight);
  // }
};
