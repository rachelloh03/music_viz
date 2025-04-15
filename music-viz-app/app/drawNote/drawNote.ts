import type { Note } from "../note/note";

// doesn't have animation, just draws note rectangle based on curTime
export const drawNote = (
  canvas: HTMLCanvasElement,
  note: Note,
  curTime: number
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
  const staffY = canvas.height * 0.3;

  const speed = 0.2; // pixels/ms
  const lineSpacing = (canvas.height * 0.2) / 5;
  const curEndTime = !endTime ? curTime : endTime;
  const noteWidth = (curEndTime - startTime) * speed;
  const x = canvas.width - (curTime - startTime) * speed;
  const noteHeight = lineSpacing * 0.7;

  let y;
  const pitchVals = [
    40, 41, 43, 45, 47, 48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71,
    72, 74, 76, 77, 79, 81,
  ];

  const key = pitchVals.findIndex((pitchVal) => pitchVal === pitch) - 11;
  y = staffY + 4 * lineSpacing + ((3 - key) * lineSpacing - noteHeight) / 2;
  ctx.fillStyle = "blue";
  ctx.fillRect(x, y, noteWidth, lineSpacing * 0.7);
};
