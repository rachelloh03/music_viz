import type { Note } from "../note/note";
import { getY, pitchVals } from "../utils/utils";
// import * as Tone from "tone";

// doesn't have animation, just draws note rectangle based on curTime
// const audioContext = new Tone.Context();
// const synth = new Tone.Synth().toDestination();

export const drawNote = (
  canvas: HTMLCanvasElement,
  note: Note,
  curTime: number,
  zoom: number
  // synth: Tone.Synth<Tone.SynthOptions>
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
  if (x >= canvas.width - noteWidth - 50 * speed) {
    ctx.strokeStyle = "#a399d0";
    ctx.fillStyle = "#a399d0";
  } else {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
  }

  if (y) {
    ctx.fillRect(x, y, noteWidth, lineSpacing);
    // Tone.start();
    // synth.triggerAttackRelease("C3", "8n");

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

  // play note audio
  // playNote(pitch, startTime, synth);
};

// const playNote = (
//   pitch: number,
//   startTime: number,
//   synth: Tone.Synth<Tone.SynthOptions>
// ) => {
//   const freq = Tone.Frequency(pitch, "midi").toFrequency();
//   synth.triggerAttackRelease(freq, "8n", startTime / 1000);
// };
