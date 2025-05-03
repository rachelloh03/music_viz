import * as Tone from "tone";
import type { Note } from "../note/note";

export const playNote = (note: Note, synth: Tone.Synth, curTime: number) => {
  const pitch = note.pitch;
  const freq = Tone.Frequency(pitch, "midi").toFrequency();
  const endTime = note.endTime;
  let dur;
  if (endTime) {
    dur = (endTime - note.startTime) * 1000;
    synth.triggerAttackRelease(freq, dur);
  } else {
    return;
  }
};
