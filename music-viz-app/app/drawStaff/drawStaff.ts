export const drawStaff = (canvas: HTMLCanvasElement, staffY: number) => {
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
};
