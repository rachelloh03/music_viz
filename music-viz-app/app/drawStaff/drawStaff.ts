// import svg file instead of fetching
// don't put svg in public

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
  let svg = "../svg/trebleclef.svg";
  let clefWidth = lineSpacing * 4;
  let clefHeight = lineSpacing * 6;
  let clefY = staffY - 0.5 * lineSpacing;
  let clefX = 0;

  if (clef === "bass") {
    svg = "../svg/bassclef.svg";
    clefWidth = lineSpacing * 3;
    clefHeight = lineSpacing * 3.5;
    clefY = staffY;
    clefX = 10;
  }

  const img = new Image();
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    console.log("draw clef");
    ctx.drawImage(img, clefX, clefY, clefWidth, clefHeight);
    URL.revokeObjectURL(url);
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
  };
  img.src = url;
};
