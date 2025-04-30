import type { Note } from "../note/note";
import { getY, pitchVals } from "../utils/utils";
import * as Tone from "tone";

// doesn't have animation, just draws note rectangle based on curTime

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
  }

  // play note audio
  if (x === canvas.width) {
    play(pitch);
  }
};

const play = (pitch: number) => {
  const synth = new Tone.Synth().toDestination();
  const freq = Tone.Frequency(pitch, "midi").toFrequency();
  synth.triggerAttackRelease(freq, "32n");
};
