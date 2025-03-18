import { useState, useEffect, useRef } from "react";
import Staff from "../staff/staff";
import type { Note } from "../note/note";
// import NoteRect from "../noteRect/noteRect";

export const Welcome = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [curTime, setCurTime] = useState(Date.now());

  const midiVals = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76];
  const [keysDown, setKeysDown] = useState<number[]>([]);

  // create a global canvas associated with a single staff and its notes
  // make it its own folder
  // draw staff object onto the canvas that's passed in
  // draw noteRects onto the canvas
  // Date.now() only gets called once at the top
  // useEffect to call requestAnimationFrame and setCurTime
  // display the time on the app

  const handleKeyDown = (event: { key: string }) => {
    // noteOn
    let key = 0;
    try {
      key = parseInt(event.key);
      let midi;
      if (key == 0) {
        midi = 76;
      } else {
        midi = midiVals[key - 1];
      }

      // append new note to notesAndTime.notes and set midi and startTime
      if (keysDown.indexOf(key) === -1) {
        const startTime = Date.now();
        const newNote = { midi: midi, startTime: startTime, endTime: null };

        setNotes((prevState) => [...prevState, newNote]);
        setKeysDown((prevState) => [...prevState, key]);
      }
      console.log(notes);
    } catch {
      console.log("key must be a number 0 through 9");
    }
  };

  const handleKeyUp = (event: { key: string }) => {
    // noteOff
    let key = 0;
    try {
      key = parseInt(event.key);
      if (keysDown.indexOf(key) !== -1) {
        const keysDownCopy: number[] = [...keysDown];
        keysDownCopy.splice(keysDown.indexOf(key), 1);
        setKeysDown(keysDownCopy);

        const endTime = Date.now();
        // for note in notes, if the midi value equals midi, then update its endTime
        for (let i = 0; i < notes.length; i++) {
          const note: Note = notes[i];
          let midi;
          if (key == 0) {
            midi = 76;
          } else {
            midi = midiVals[key - 1];
          }
          if (note.midi === midi && note.endTime === null) {
            const notesCopy: Note[] = [...notes];
            note.endTime = endTime;

            setNotes(notesCopy);
          }
        }
      }
      console.log(notes);
    } catch {
      console.log("key must be a number 0 through 9");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [notes]);

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div>
        <h1>Music Visualization App</h1>
        <div>
          <Staff />
        </div>
      </div>
    </main>
  );
};
