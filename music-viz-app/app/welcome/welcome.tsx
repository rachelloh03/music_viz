import { useState, useEffect, useRef } from "react";
import { drawStaff } from "../drawStaff/drawStaff";
import type { Note } from "../note/note";
import { drawNote } from "../drawNote/drawNote";
import { popper } from "../fakeData/popper";
import { parseAttention } from "../parseAttention/parseAttention";

const attentions = parseAttention(); // for batch = layer = head = 0 of popper

export const Welcome = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [curTime, setCurTime] = useState(Date.now());
  const [zoom, setZoom] = useState(50);

  const keyToPitch: { [key: string]: number } = {
    q: 40,
    w: 41,
    e: 43,
    r: 45,
    t: 47,
    y: 48,
    u: 50,
    i: 52,
    o: 53,
    p: 55,
    "[": 57,
    "]": 59,
    "1": 60,
    "2": 62,
    "3": 64,
    "4": 65,
    "5": 67,
    "6": 69,
    "7": 71,
    "8": 72,
    "9": 74,
    "0": 76,
    "-": 77,
    "=": 79,
    Backspace: 81,
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let canvas: HTMLCanvasElement | null;

  // continuously update curTime
  useEffect(() => {
    let animId: number;
    const updateTime = () => {
      setCurTime(Date.now());
      animId = requestAnimationFrame(updateTime);
    };
    updateTime();
    return () => cancelAnimationFrame(animId);
  }, [setCurTime]);

  // draw staff and notes
  useEffect(() => {
    canvas = canvasRef.current;
    const animate = () => {
      if (canvas) {
        const ctx = canvas.getContext("2d");
        canvas.height = 400;
        if (!ctx) {
          return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawStaff(canvas, canvas.height * 0.3); // treble staff
        drawStaff(canvas, canvas.height * 0.54);
        // canvas! instead of canvas because we know canvas is not null
        notes.forEach((note) => drawNote(canvas!, note, curTime, zoom));
      }
    };
    animate();
  }, [notes, curTime, drawStaff]);

  // detect when note is played (noteOn)
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return; // prevent key repeat
    // play fake notes
    if (event.key == "f") {
      const firstFakeStartTime = popper[0].startTime;
      const newPopper = popper.map((note) => {
        note.startTime = curTime + note.startTime - firstFakeStartTime;
        note.endTime = curTime + note.endTime - firstFakeStartTime;
        return note;
      });
      const newNotes = [...notes, ...newPopper];
      setNotes(newNotes);
    } else {
      try {
        // append new note to notesAndTime.notes and set pitch and startTime
        const startTime = curTime;
        const newNote = {
          pitch: getPitch(event),
          startTime: startTime,
          endTime: null,
        };

        const newNotes = [...notes, newNote];
        setNotes(newNotes);

        console.log("keydown: ", newNotes);
      } catch {
        console.log("key must be a number 0 through 9");
      }
    }
  };

  // detect when note ends (noteOff)
  const handleKeyUp = (event: KeyboardEvent) => {
    try {
      // update endTime of note to curTime
      const pitch = getPitch(event);
      const noteToChange = findNote(pitch);
      const newNotes = notes.map((note) => {
        if (note === noteToChange) {
          note.endTime = curTime;
        }
        return note;
      });
      setNotes(newNotes);
      console.log("keyup: ", notes);
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
  }, [handleKeyDown, handleKeyUp]);

  // returns the corresponding pitch, given the key pressed
  const getPitch = (event: KeyboardEvent) => {
    const key = event.key;
    return keyToPitch[key];
  };

  // returns the note corresponding to the pitch with null endTime
  const findNote = (pitch: number) => {
    for (let i = 0; i < notes.length; i++) {
      const note: Note = notes[i];
      if (note.pitch === pitch && !note.endTime) {
        return note;
      }
    }
  };

  // update zoom percentage
  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const zoomVal = Number(event.target.value);
    setZoom(zoomVal);
    console.log(zoomVal);
  };

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div>
        <h1>Music Visualization App</h1>
        <h2>Press 0-9 to play notes C4-E5 respectively</h2>
        <h2>Press 'f' to play Twinkle Twinkle Little Star</h2>
        <h2>*Chromatic notes are in red*</h2>
        {/* <p>{new Date(curTime).toString()}</p> */}
        <h2>Slide to zoom in/out</h2>
        <input type="range" onChange={handleZoomChange} />
        <h2>{zoom}% zoom</h2>
        <canvas
          ref={canvasRef}
          width="800"
          style={{ border: "1px solid black" }}
        />
      </div>
    </main>
  );
};
