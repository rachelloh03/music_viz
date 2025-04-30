import { useState, useEffect, useRef } from "react";
import { drawStaff } from "../drawStaff/drawStaff";
import type { Note } from "../note/note";
import { drawNote } from "../drawNote/drawNote";
import { drawArc } from "../drawArc/drawArc";
import { popper } from "../fakeData/popper";
import * as Tone from "tone";

export const Welcome = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [curTime, setCurTime] = useState(Date.now());
  const [zoom, setZoom] = useState(50);
  const [play, setPlay] = useState(true);
  const [lastPausedTime, setLastPausedTime] = useState(Date.now());
  const [lastPlayedTime, setLastPlayedTime] = useState(Date.now());
  const [curHead, setCurHead] = useState(0);

  // list of data files for each head; append when I get more files
  const headFiles = [
    popper,
    popper,
    popper,
    popper,
    popper,
    popper,
    popper,
    popper,
    popper,
    popper,
    popper,
  ];
  const [curHeadFile, setCurHeadFile] = useState(popper);

  const [minWeight, setMinWeight] = useState(4.603590468832408e-7);
  const [maxWeight, setMaxWeight] = useState(0.000340308528393507);
  const [arcThresh, setArcThresh] = useState((minWeight + maxWeight) / 2);
  const threshInputRef = useRef<HTMLInputElement>(null);

  // const colors = [
  //   "#ffb3ba",
  //   "#ffdfba",
  //   "#ffffba",
  //   "#baffc9",
  //   "#bae1ff",
  //   "#a399d0",
  // ];

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

  // get arc threshold slider value
  const getArcSliderVal = () => {
    const val = threshInputRef.current?.value;
    if (val) {
      return val;
    }
  };

  // set attention min / max weights based on curHeadFile
  useEffect(() => {
    const weights = getMinMaxWeights(curHeadFile);
    setMinWeight(weights[0]);
    setMaxWeight(weights[1]);
    const arcSliderVal = getArcSliderVal();
    if (arcSliderVal) {
      setArcThresh(((minWeight + maxWeight) * parseInt(arcSliderVal)) / 100);
    }
  }, [curHeadFile, setMinWeight, setMaxWeight, curHead]);

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

        // notes.forEach((note) => drawNote(canvas!, note, curTime, zoom, synth));
        notes.forEach((note) => drawNote(canvas!, note, curTime, zoom));

        // draw the arc from the current note to any previous notes that it is referring to
        for (let i = 0; i < popper.length; i++) {
          const curNote = {
            pitch: popper[i].pitch,
            startTime: popper[i].startTime,
            endTime: popper[i].endTime,
          };

          // drawNote(canvas!, curNote, curTime, zoom, synth);
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

        // const context = Tone.getContext();
        // const transport = Tone.getTransport();

        // if (context.state !== "running") {
        //   Tone.start().then(()=> {
        //     const synth = new Tone.Synth().toDestination();

        //   })
        // }
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

  // start audio context
  useEffect(() => {
    const context = Tone.getContext();
    if (context.state !== "running") {
      Tone.start();
    }
  }, [handleKeyDown]);

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
  };

  // update visible attention weight arch thresh
  const handleThreshChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newArcThresh = scale(
      Number(event.target.value),
      0,
      100,
      minWeight,
      maxWeight
    );
    setArcThresh(newArcThresh);
  };

  // update chosen head
  const handleHeadChange = (head: number) => {
    setCurHead(head);
    setCurHeadFile(headFiles[head]);
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

  // get min and max weights for a single head
  const getMinMaxWeights = (
    dataFile: {
      pitch: number;
      startTime: number;
      endTime: number;
      attention: number[];
    }[]
  ) => {
    let maxWeight = 0;
    let minWeight = 1;

    for (let i = 0; i < dataFile.length; i++) {
      const noteAttentions = dataFile[i].attention;
      for (let j = 0; j < noteAttentions.length; j++) {
        const weight = noteAttentions[j];
        if (weight > maxWeight && i !== j) {
          // i !== j so we don't include self attention
          maxWeight = weight;
        } else if (weight < minWeight && weight !== 0) {
          minWeight = weight;
        }
      }
    }
    return [minWeight, maxWeight];
  };

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div>
        <h1>Music Visualization App</h1>
        {/* <h2>Press 0-9 to play notes C4-E5 respectively</h2> */}
        <h2>
          Press <strong>F</strong> to play Popper Etude
        </h2>
        <h2>Press spacebar to play/pause</h2>
        <h2>Currently {play ? "Playing" : "Paused"}</h2>
        {/* <p>{new Date(curTime).toString()}</p> */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input type="range" onChange={handleZoomChange} />
          <h2> {zoom}% zoom</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="range"
            onChange={handleThreshChange}
            ref={threshInputRef}
          />
          <h2> Attention theshold: {arcThresh}</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((headNumber) => (
            <button
              key={headNumber}
              onClick={() => handleHeadChange(headNumber)}
              style={{
                backgroundColor: "#a399d0",
                padding: "5px 5px",
                border: "3px solid white",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Head {headNumber}
            </button>
          ))}
        </div>
        <h2>Current head: {curHead}</h2>
        <canvas
          ref={canvasRef}
          width="800"
          style={{ border: "1px solid black" }}
        />
      </div>
    </main>
  );
};
