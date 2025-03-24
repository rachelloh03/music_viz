import { useState, useEffect, useRef } from "react";
import { drawStaff } from "../drawStaff/drawStaff";
import type { Note } from "../note/note";
import { drawNote } from "../drawNote/drawNote";

export const Welcome = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [curTime, setCurTime] = useState(Date.now());

  const midiVals = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76];
  const [keysDown, setKeysDown] = useState<number[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let canvas: HTMLCanvasElement | null;

  // run once on render
  useEffect(() => {
    // create canvas object
    canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    // draw staff
    drawStaff(canvas);
  }, []);

  // continuously update curTime
  useEffect(() => {
    let animId: number;
    const updateTime = () => {
      setCurTime(Date.now());
      animId = requestAnimationFrame(updateTime);
    };

    updateTime();
    return () => cancelAnimationFrame(animId);
  }, []);

  // draw notes
  useEffect(() => {
    let animId: number;
    canvas = canvasRef.current;
    // also need to clear the note
    const animate = () => {
      if (canvas !== null) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return;
        }
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        // how to clear note without clearing entire staff?

        // canvas! instead of canvas because we know canvas is not null
        notes.forEach((note) => drawNote(canvas!, note, curTime));
        animId = requestAnimationFrame(animate);
      }
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, [notes]);

  // detect when note is played (noteOn)
  const handleKeyDown = (event: { key: string }) => {
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
        const startTime = curTime;
        const newNote = {
          key: key,
          midi: midi,
          startTime: startTime,
          endTime: null,
        };

        setNotes((prevState) => [...prevState, newNote]);
        setKeysDown((prevState) => [...prevState, key]);
      }
      console.log(notes);
    } catch {
      console.log("key must be a number 0 through 9");
    }
  };

  // detect when note ends (noteOff)
  const handleKeyUp = (event: { key: string }) => {
    let key = 0;
    try {
      key = parseInt(event.key);
      if (keysDown.indexOf(key) !== -1) {
        const keysDownCopy: number[] = [...keysDown];
        keysDownCopy.splice(keysDown.indexOf(key), 1);
        setKeysDown(keysDownCopy);

        const endTime = curTime;
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
        {/* <p>{new Date(curTime).toString()}</p> */}
        <canvas
          ref={canvasRef}
          width="800"
          style={{ border: "1px solid black" }}
        />
      </div>
    </main>
  );
};
