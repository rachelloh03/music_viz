import type { Note } from "../note/note";
import { getY, pitchVals } from "../utils/utils";

// doesn't have animation, just draws note rectangle based on curTime

// highlight a note that is currently playing
// add the audio
// draw the arc only when the note is active + 2 sec or something
// only use color for the active notes

// fade in and fade out for the arcs or notes
// changing transparency

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

  const speed = zoom / 1000 + 0.01; // pixels/ms
  const lineSpacing = (canvas.height * 0.2) / 5;
  const curEndTime = !endTime ? curTime : endTime;
  const noteWidth = (curEndTime - startTime) * speed * 6;
  const x = canvas.width - (curTime - startTime) * speed * 6;
  const y = getY(pitch, canvas);

  if (y) {
    ctx.fillRect(x, y, noteWidth, lineSpacing);

    // draw a sharp in front of note if necessary // fix this
    // const pitchIndex = pitchVals.findIndex((pitchVal) => pitchVal === pitch);
    // if (pitchIndex === -1) {
    //   let svg = "../svg/sharp.svg";
    //   fetch(svg)
    //     .then((res) => res.text())
    //     .then((svgText) => {
    //       const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
    //       const url = URL.createObjectURL(svgBlob);
    //       const img = new Image();

    //       img.onload = () => {
    //         ctx.drawImage(img, x - 20, y, 10, 10);
    //         URL.revokeObjectURL(url); // Clean up
    //       };

    //       img.src = url;
    //     });
    // }
  }
};
