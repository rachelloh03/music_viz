import { useState, useEffect, useRef } from "react";
import Staff from "../staff/staff";
import type { Note } from "../note/note";
// import NoteRect from "../noteRect/noteREct";

export function Welcome() {
  const notes: Note[] = [];
  const [notesAndTime, setNotesAndTime] = useState({
    notes,
    curTime: Date.now(),
  });
  const midiVals = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76];
  const [keysDown, setKeysDown] = useState<number[]>([]);

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

        setNotesAndTime((prevState) => ({
          ...prevState,
          notes: [...prevState.notes, newNote],
        }));
        setKeysDown((prevState) => [...prevState, key]);
      }
      console.log(notesAndTime.notes);
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
        for (let i = 0; i < notesAndTime.notes.length; i++) {
          const note: Note = notesAndTime.notes[i];
          let midi;
          if (key == 0) {
            midi = 76;
          } else {
            midi = midiVals[key - 1];
          }
          if (note.midi === midi && note.endTime === null) {
            const notesCopy: Note[] = [...notesAndTime.notes];
            note.endTime = endTime;

            setNotesAndTime((prevState) => ({
              ...prevState,
              notes: notesCopy,
            }));
          }
        }
      }
      console.log(notesAndTime.notes);
    } catch {
      console.log("key must be a number 0 through 9");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // for (let i = 0; i < notesAndTime.notes.length; i++) {
    //   const note = notesAndTime.notes[i];
    //   NoteRect(note);
    // }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [notesAndTime.notes]);

  // const drawNotes = () => {
  //   for (let i = 0; i < notesAndTime.notes.length; i++) {
  //     const note = notesAndTime.notes[i];
  //     const midi = note.midi;
  //     const startTime = note.startTime;
  //     const endTime = note.endTime;
  //     let animationID: number;

  //     const canvasRef = useRef<HTMLCanvasElement>(null);
  //     const canvas = canvasRef.current;

  //     if (canvas !== null) {
  //       const ctx = canvas.getContext("2d");
  //       if (ctx !== null) {
  //         ctx.fillStyle = "blue";
  //         let x = canvas.width;
  //         const speed = 2;
  //         const staffY = canvas.height * 0.3;
  //         const lineSpacing = (canvas.height * 0.5) / 5;
  //         let noteWidth = 0;

  //         const animate = () => {
  //           //y depends on midi value
  //           const y = staffY + (lineSpacing / 2) * (midi - 60) - lineSpacing;
  //           x = canvas.width - (Date.now() - startTime) * speed;

  //           if (endTime === null) {
  //             noteWidth = (Date.now() - startTime) * speed;
  //           } else {
  //             noteWidth = (endTime - startTime) * speed;
  //           }

  //           ctx.fillRect(x, y, noteWidth, lineSpacing);

  //           animationID = requestAnimationFrame(animate);
  //           if (x < 0) {
  //             cancelAnimationFrame(animationID);
  //           }
  //         };

  //         animate();
  //       }
  //     }
  //   }
  // };

  // if (notesAndTime) {
  //   drawNotes();
  // }

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div>
        <h1>Music Visualization App</h1>
        <div>
          <Staff />
          {/* <div>
            {notesAndTime.notes.map((note) => {
              NoteRect(note);
            })}
          </div> */}
        </div>
      </div>
    </main>
  );
}
