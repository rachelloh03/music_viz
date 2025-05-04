import type { Note } from "../note/note";
import { getY, pitchVals } from "../utils/utils";

// doesn't have animation, just draws note rectangle based on curTime

export const drawNote = (
  canvas: HTMLCanvasElement,
  note: Note,
  curTime: number,
  zoom: number
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const pitch = note.pitch;
  if (!pitch) {
    return;
  }

  const startTime = note.startTime;
  const endTime = note.endTime;

  const speed = zoom / 100 + 0.01; // pixels/ms
  const lineSpacing = (canvas.height * 0.2) / 5;
  const curEndTime = !endTime ? curTime : endTime;
  const noteWidth = (curEndTime - startTime) * speed;
  const x = canvas.width - (curTime - startTime) * speed;
  const y = getY(pitch, canvas);

  // active notes are colored
  if (x >= canvas.width - noteWidth) {
    ctx.strokeStyle = "#a399d0";
    ctx.fillStyle = "#a399d0";
  } else {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
  }

  if (y && x + noteWidth > 0) {
    ctx.fillRect(x, y, noteWidth, lineSpacing);
  }
};
