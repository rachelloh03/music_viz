import type { Note } from "../note/note";
import { getY } from "../utils/utils";

export const drawArc = (
  canvas: HTMLCanvasElement,
  curNote: Note,
  pastNote: Note,
  curTime: number,
  zoom: number
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  ctx.strokeStyle = "#a399d0";
  ctx.fillStyle = "#a399d0";

  const speed = zoom / 100 + 0.01; // pixels/ms
  const x1 = canvas.width - (curTime - pastNote.startTime) * speed;
  const x2 = canvas.width - (curTime - curNote.startTime) * speed;
  const y1 = getY(pastNote.pitch, canvas);
  const y2 = getY(curNote.pitch, canvas);

  //   const circleX = (x2 + x1) / 2;
  if (y1 && y2 && x2 > 0 && x2 <= canvas.width) {
    // const radius = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) / 2;
    // const circleY = (y1 + y2) / 2;
    // const startAngle =
    //   Math.tan(Math.abs(y1 - circleY) / Math.abs(x1 - circleX)) *
    //   getSign(x1, y1, circleX, circleY);
    // const endAngle =
    //   Math.tan(Math.abs(y2 - circleY) / Math.abs(x2 - circleX)) *
    //     getSign(x2, y2, circleX, circleY) +
    //   Math.PI;

    // ctx.beginPath();
    // ctx.arc(circleX, circleY, radius, startAngle, endAngle);
    // ctx.fillStyle = "green";
    // ctx.stroke();

    const endTime = curNote.endTime;
    const curEndTime = !endTime ? curTime : endTime;
    const curNoteWidth = (curEndTime - curNote.startTime) * speed * 6;

    // if (x2 > canvas.width - curNoteWidth) {

    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // }
  }
};

// returns the sign of the tangent value
const getSign = (x: number, y: number, xbar: number, ybar: number) => {
  if ((x > xbar && y < ybar) || (x < xbar && y > ybar)) {
    return -1;
  } else {
    return 1;
  }
};
