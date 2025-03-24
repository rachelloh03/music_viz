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

  const key = note.key;
  //   const midi = note.midi;
  const startTime = note.startTime;
  const endTime = note.endTime;
  const staffY = canvas.height * 0.3;

  const speed = 1;
  const lineSpacing = (canvas.height * 0.5) / 5;
  let noteWidth: number;

  if (!endTime) {
    noteWidth = ((curTime - startTime) / 5000) * canvas.width * speed;
  } else {
    noteWidth = ((endTime - startTime) / 5000) * canvas.width * speed;
  }

  const x = canvas.width - noteWidth;
  console.log(x);
  let y;
  if (key == 0) {
    y =
      staffY +
      4 * lineSpacing +
      ((3 - 10) * lineSpacing) / 2 -
      (lineSpacing * 0.7) / 2;
  } else {
    y =
      staffY +
      4 * lineSpacing +
      ((3 - key) * lineSpacing) / 2 -
      (lineSpacing * 0.7) / 2;
  }
  ctx.fillStyle = "blue";
  ctx.fillRect(x, y, noteWidth, lineSpacing * 0.7);
};
