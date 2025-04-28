import { useState, useEffect, useRef } from "react";
import { drawStaff } from "../drawStaff/drawStaff";
import type { Note } from "../note/note";
import { drawNote } from "../drawNote/drawNote";
import { drawArc } from "../drawArc/drawArc";
import { popper } from "../fakeData/popper";

export const Welcome = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [curTime, setCurTime] = useState(Date.now());
  const [zoom, setZoom] = useState(50);
  const [arcThresh, setArcThresh] = useState(0.00017043838); // change later with a sliding UI value
  const minWeight = 5.682434789378021e-7;
  const maxWeight = 0.000340308528393507;
  const [play, setPlay] = useState(true);
  const [lastPausedTime, setLastPausedTime] = useState(Date.now());
  const [lastPlayedTime, setLastPlayedTime] = useState(Date.now());
  // const colors = [
  //   "#ffb3ba",
  //   "#ffdfba",
  //   "#ffffba",
  //   "#baffc9",
  //   "#bae1ff",
  //   "#a399d0",
  // ];
  // let colorI = 0;

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
      if (!play) {
        setCurTime(lastPausedTime);
      } else {
        setCurTime(Date.now() - lastPlayedTime + lastPausedTime);
      }
      animId = requestAnimationFrame(updateTime);
    };
    updateTime();
    return () => cancelAnimationFrame(animId);
  }, [setCurTime, lastPausedTime, play, lastPlayedTime]);

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
        drawStaff(canvas, canvas.height * 0.3, "treble"); // treble staff
        drawStaff(canvas, canvas.height * 0.54, "bass"); // bass staff

        notes.forEach((note) => drawNote(canvas!, note, curTime, zoom));

        // draw the arc from the current note to any previous notes that it is referring to
        for (let i = 0; i < popper.length; i++) {
          const curNote = {
            pitch: popper[i].pitch,
            startTime: popper[i].startTime,
            endTime: popper[i].endTime,
          };
          // ctx.strokeStyle = colors[colorI];
          // ctx.fillStyle = colors[colorI];
          drawNote(canvas!, curNote, curTime, zoom);

          const attention = popper[i].attention;
          for (let j = 0; j < attention.length; j++) {
            if (i !== j && attention[j] >= arcThresh) {
              const pastNote = {
                pitch: popper[j].pitch,
                startTime: popper[j].startTime,
                endTime: popper[j].endTime,
              };
              drawArc(canvas!, curNote, pastNote, curTime, zoom);
            }
          }

          // colorI += 1;
          // if (colorI > colors.length - 1) {
          //   colorI = 0;
          // }
        }
      }
    };
    animate();
  }, [notes, curTime, drawStaff, play, lastPausedTime]);

  // detect when note is played (noteOn)
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return; // prevent key repeat

    // play/pause toggle
    if (event.key == " ") {
      if (play) {
        setLastPausedTime(curTime);
      } else {
        setLastPlayedTime(Date.now());
      }
      setPlay(!play);
    }

    // play fake notes
    if (event.key == "f") {
      if (play) {
        const firstFakeStartTime = popper[0].startTime;
        const newPopper = popper.map((note) => {
          note.startTime = curTime + note.startTime - firstFakeStartTime;
          note.endTime = curTime + note.endTime - firstFakeStartTime;
          return note;
        });
        const newNotes = [...notes, ...newPopper];
        setNotes(newNotes);
      }
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

        // console.log("keydown: ", newNotes);
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
      // console.log("keyup: ", notes);
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
    // console.log(zoomVal);
  };

  // update visible attention weight arch thresh
  const handleThreshChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const arcThresh = scale(
      Number(event.target.value),
      0,
      100,
      minWeight,
      maxWeight
    );
    setArcThresh(arcThresh);
    // console.log(arcThresh);
  };

  const scale = (
    input: number,
    inLow: number,
    inHigh: number,
    outLow: number,
    outHigh: number
  ) => {
    const val =
      ((input - inLow) / (inHigh - inLow)) * (outHigh - outLow) + outLow;
    return val;
  };

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div>
        <h1>Music Visualization App</h1>
        <h2>Press 0-9 to play notes C4-E5 respectively</h2>
        <h2>Press 'f' to play/pause Twinkle Twinkle Little Star</h2>
        <h2>Currently {play ? "Playing" : "Paused"}</h2>
        <h2>*Chromatic notes are in red*</h2>
        {/* <p>{new Date(curTime).toString()}</p> */}
        <h2>Slide to zoom in/out</h2>
        <input type="range" onChange={handleZoomChange} />
        <h2>{zoom}% zoom</h2>
        <h2>Slide to set visible attention weight threshold</h2>
        <input type="range" onChange={handleThreshChange} />
        <h2>Attention weight min theshold: {arcThresh}</h2>
        <canvas
          ref={canvasRef}
          width="800"
          style={{ border: "1px solid black" }}
        />
      </div>
    </main>
  );
};
