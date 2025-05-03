import * as Tone from "tone";
import type { Note } from "../note/note";

export const playNote = (note: Note, synth: Tone.Synth) => {
  const pitch = note.pitch;
  const freq = Tone.Frequency(pitch, "midi").toFrequency();
  const endTime = note.endTime;
  if (endTime) {
    const dur = (endTime - note.startTime) / 1000;
    synth.triggerAttackRelease(freq, dur);
  }
};
