import type { Note } from "../note/note";
import { getY } from "../utils/utils";

export const drawArc = (
  canvas: HTMLCanvasElement,
  curNote: Note,
  pastNote: Note,
  curTime: number,
  zoom: number,
  color: string
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  const speed = zoom / 100 + 0.01; // pixels/ms
  const x1 = canvas.width - (curTime - pastNote.startTime) * speed;
  const x2 = canvas.width - (curTime - curNote.startTime) * speed;
  const y1 = getY(pastNote.pitch, canvas);
  const y2 = getY(curNote.pitch, canvas);

  const endTime = curNote.endTime;
  const curEndTime = !endTime ? curTime : endTime;
  const curNoteWidth = (curEndTime - curNote.startTime) * speed;

  const circleX = (x2 + x1) / 2;
  if (
    y1 &&
    y2 &&
    x2 >= canvas.width - curNoteWidth &&
    x2 <= canvas.width &&
    x1 >= 0
  ) {
    const radius = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) / 2;
    const circleY = (y1 + y2) / 2;
    const startAngle = Math.atan2(y1 - circleY, x1 - circleX);
    const endAngle = Math.atan2(y2 - circleY, x2 - circleX);

    ctx.beginPath();
    // curNoteWidth/2 to start arc at middle of note
    // will need to change when using realtime since don't know middle of curNote
    ctx.arc(circleX + curNoteWidth / 2, circleY, radius, startAngle, endAngle);
    ctx.stroke();
  }
};
