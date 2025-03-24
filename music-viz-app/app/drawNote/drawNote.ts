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

  const midi = note.midi;
  const startTime = note.startTime;
  const endTime = note.endTime;
  const staffY = canvas.height * 0.3;

  const speed = 2;
  const lineSpacing = (canvas.height * 0.5) / 5;
  let noteWidth: number;

  if (!endTime) {
    console.log("heyoooo");
    noteWidth = (curTime - startTime) * speed;
  } else {
    console.log("should be false: ", endTime < startTime);
    noteWidth = (endTime - startTime) * speed;
  }

  console.log(noteWidth);

  const x = canvas.width - noteWidth;
  const y = staffY + (lineSpacing / 4) * (midi - 60) - lineSpacing;
  console.log("x, y:", x, ",", y);

  ctx.fillStyle = "blue";
  ctx.fillRect(x, y, noteWidth, lineSpacing);
};
