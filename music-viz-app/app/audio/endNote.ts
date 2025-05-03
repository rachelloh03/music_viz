import * as Tone from "tone";
import type { Note } from "../note/note";

export const endNote = (note: Note, synth: Tone.Synth) => {
  const pitch = note.pitch;
  const freq = Tone.Frequency(pitch, "midi").toFrequency();
  synth.triggerRelease(freq);
};
