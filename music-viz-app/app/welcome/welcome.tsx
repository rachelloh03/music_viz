import { useState, useEffect, useRef } from "react";
import { drawStaff } from "../drawStaff/drawStaff";
import type { Note } from "../note/note";
import { drawNote } from "../drawNote/drawNote";
import { drawArc } from "../drawArc/drawArc";
import { popper0 } from "../fakeData/popper0";
import { popper1 } from "../fakeData/popper1";
import { popper2 } from "../fakeData/popper2";
import { popper3 } from "../fakeData/popper3";
import { popper4 } from "../fakeData/popper4";
import { popper5 } from "../fakeData/popper5";
import { popper6 } from "../fakeData/popper6";
import { popper7 } from "../fakeData/popper7";
import { popper8 } from "../fakeData/popper8";
import { popper9 } from "../fakeData/popper9";
import { popper10 } from "../fakeData/popper10";
import { popper11 } from "../fakeData/popper11";
import { playNote } from "../audio/playNote";
import * as Tone from "tone";
import bassImg from "../svg/bassclef.svg";
import trebleImg from "../svg/trebleclef.svg";
import playBttn from "../svg/play.svg";
import pauseBttn from "../svg/pause.svg";

const getTime = () => {
  return Date.now() * 0.5;
};

export const Welcome = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [curTime, setCurTime] = useState(getTime());
  const [zoom, setZoom] = useState(50);
  const [play, setPlay] = useState(true);
  const [lastPausedTime, setLastPausedTime] = useState(getTime());
  const [lastPlayedTime, setLastPlayedTime] = useState(getTime());
  const [curHeads, setCurHeads] = useState<number[]>([]);
  const [lastPlayedNoteIndex, setLastPlayedNoteIndex] = useState(-1);
  const [lastFTime, setlastFTime] = useState(0);

  // list of data files for each head; append when I get more files
  const headFiles = [
    popper0,
    popper1,
    popper2,
    popper3,
    popper4,
    popper5,
    popper6,
    popper7,
    popper8,
    popper9,
    popper10,
    popper11,
  ];

  const firstFakeStartTime = popper0[0].startTime;
  const lastFakeEndTime = popper0[popper0.length - 1].endTime;

  const [scrubPercentage, setScrubPercentage] = useState(0);
  const scrubInputRef = useRef<HTMLInputElement>(null);

  const chosenColors = [
    `hsl(353 100% 74.8%)`,
    `hsl(0 63.2% 47%)`,
    `hsl(19 100% 74.8%)`,
    `hsl(40 87.8% 57.7%)`,
    `hsl(49 100% 45%)`,
    `hsl(124 63.2% 57.2%)`,
    `hsl(162 63.2% 47%)`,
    `hsl(195 63.2% 57.2%)`,
    `hsl(231 87.8% 57.7%)`,
    `hsl(240 53.3% 48.6%)`,
    `hsl(263 44%, 60%)`,
    `hsl(357 30.5% 37.2%)`,
  ];

  const colors = [
    `hsl(353 100% 85%)`,
    `hsl(0 63.2% 60%)`,
    `hsl(19 100% 85%)`,
    `hsl(40 87.8% 73%)`,
    `hsl(49 100% 65%)`,
    `hsl(124 63.2% 73%)`,
    `hsl(162 63.2% 60%)`,
    `hsl(195 63.2% 73%)`,
    `hsl(231 87.8% 73%)`,
    `hsl(240 53.3% 70%)`,
    `hsl(263 44%, 75%)`,
    `hsl(357 30.5% 52%)`,
  ];

  const [arcThresh, setArcThresh] = useState(50);
  const threshInputRef = useRef<HTMLInputElement>(null);

  const synthRef = useRef<Tone.Synth | null>(null);
  let context: Tone.BaseContext;
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

  const [fancyMode, setFancyMode] = useState(false);

  // continuously update curTime
  useEffect(() => {
    let animId: number;
    const updateTime = () => {
      let newTime;
      if (!play) {
        // paused
        newTime = (scrubPercentage / 100) * lastFakeEndTime + lastFTime;
        setLastPausedTime(newTime);
      } else {
        newTime = getTime() - lastPlayedTime + lastPausedTime;
        // update scrub percentage automatically if playing
        if (lastFTime > 0) {
          // avoid jittering when scrub hits end of scroll bar
          setScrubPercentage(
            Math.min(((newTime - lastFTime) / lastFakeEndTime) * 100, 100)
          );
        }
      }
      setCurTime(newTime);
      animId = requestAnimationFrame(updateTime);
    };
    updateTime();
    return () => cancelAnimationFrame(animId);
  }, [
    setCurTime,
    lastPausedTime,
    play,
    lastPlayedTime,
    curTime,
    lastFTime,
    lastFakeEndTime,
    scrubPercentage,
    setScrubPercentage,
    lastFTime,
  ]);

  // play audio
  useEffect(() => {
    // start audio context if haven't yet
    if (!synthRef.current) {
      synthRef.current = new Tone.Synth().toDestination();
    }
    context = Tone.getContext();
    if (context.state !== "running" && play) {
      Tone.start();
    }
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (
        curTime >= note.startTime &&
        i > lastPlayedNoteIndex &&
        synthRef.current &&
        note.endTime &&
        note.pitch &&
        play
      ) {
        playNote(note, synthRef.current);
        setLastPlayedNoteIndex(i);
      }
    }
  }, [curTime, notes, lastPlayedNoteIndex, setLastPlayedNoteIndex, playNote]);

  // draw staff, notes, and arcs
  useEffect(() => {
    canvas = canvasRef.current;
    const animate = () => {
      if (canvas) {
        const ctx = canvas.getContext("2d");
        canvas.height = 400;
        if (!ctx || !synthRef.current) {
          return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawStaff(canvas, canvas.height * 0.3, "treble"); // treble staff
        drawStaff(canvas, canvas.height * 0.54, "bass"); // bass staff

        notes.forEach((note) => {
          let color;
          if (curHeads.length > 0) {
            color = colors[curHeads[curHeads.length - 1]];
          } else {
            color = "black";
          }
          drawNote(canvas!, note, curTime, zoom, color);
        });

        // draw the arc from the current note to any previous notes that it is referring to
        for (let k = 0; k < curHeads.length; k++) {
          const head = curHeads[k];
          const curHeadFile = headFiles[head];
          const color_split = colors[head].split(" ");
          const og_val = parseInt(color_split[2]);

          let color = colors[head];
          for (let i = 0; i < curHeadFile.length; i++) {
            const curNote = {
              pitch: curHeadFile[i].pitch,
              startTime:
                lastFTime + curHeadFile[i].startTime - firstFakeStartTime,
              endTime: lastFTime + curHeadFile[i].endTime - firstFakeStartTime,
            };

            // sort attention weights in descending order
            const indexedWeights = curHeadFile[i].attention.map(
              (weight, i) => [i, weight] as [number, number]
            );
            const sortedWeights = indexedWeights.sort((a, b) => b[1] - a[1]);

            const nonZeroWeights = sortedWeights.filter(
              ([_, weight]) => weight !== 0.0
            );
            // calculate num non-zero weights to show
            const numWeightsToShow = Math.round(
              (arcThresh / 100) * nonZeroWeights.length
            );
            // store num non-zero weights shown so far
            let weightsSoFar = 0;
            // start at j = 1 to exclude starting token
            for (let j = 1; j < nonZeroWeights.length; j++) {
              const noteIndex = nonZeroWeights[j][0];
              // exclude self-attention
              if (noteIndex !== i + 1 && weightsSoFar < numWeightsToShow) {
                const pastNote = {
                  pitch: curHeadFile[noteIndex].pitch,
                  startTime:
                    lastFTime +
                    curHeadFile[noteIndex].startTime -
                    firstFakeStartTime,
                  endTime:
                    lastFTime +
                    curHeadFile[noteIndex].endTime -
                    firstFakeStartTime,
                };
                const new_val = (
                  og_val - j * 5 > 30 ? og_val - j * 5 : 30
                ).toString();
                if (fancyMode) {
                  color =
                    color_split[0] +
                    " " +
                    color_split[1] +
                    " " +
                    new_val +
                    "%)";
                }

                drawArc(canvas!, curNote, pastNote, curTime, zoom, color);
                weightsSoFar += 1;
              }
            }

            // // calculate arc threshold value
            // const weightSum = sortedWeights.reduce(
            //   (sum, weight) => sum + weight[1],
            //   0
            // );
            // const thresh = (arcThresh / 100) * weightSum;
            // // store current sum of weights of arcs shown
            // let curSum = 0;
            // for (let j = 0; j < sortedWeights.length; j++) {
            //   const noteIndex = sortedWeights[j][0];
            //   const noteWeight = sortedWeights[j][1];
            //   if (
            //     noteIndex !== i &&
            //     curSum + noteWeight < thresh &&
            //     noteWeight !== 0.0
            //   ) {
            //     const pastNote = {
            //       pitch: curHeadFile[noteIndex].pitch,
            //       startTime:
            //         lastFTime +
            //         curHeadFile[noteIndex].startTime -
            //         firstFakeStartTime,
            //       endTime:
            //         lastFTime +
            //         curHeadFile[noteIndex].endTime -
            //         firstFakeStartTime,
            //     };
            //     const new_val = (
            //       og_val - j * 5 > 30 ? og_val - j * 5 : 30
            //     ).toString();
            //     if (fancyMode) {
            //       color =
            //         color_split[0] +
            //         " " +
            //         color_split[1] +
            //         " " +
            //         new_val +
            //         "%)";
            //     }

            //     drawArc(canvas!, curNote, pastNote, curTime, zoom, color);
            //     curSum += noteWeight;
            //   }
            // }
          }
        }
      }
    };
    animate();
  }, [
    notes,
    curTime,
    drawStaff,
    drawArc,
    drawNote,
    play,
    lastPausedTime,
    arcThresh,
    curHeads,
    lastFTime,
    zoom,
  ]);

  // detect when note is played (noteOn)
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return; // prevent key repeat

    // play/pause toggle
    if (event.key == " ") {
      event.preventDefault();
      if (play) {
        // going from play to pause
        setLastPausedTime(curTime);
        // cancel all previously scheduled notes
        Tone.Transport.cancel();
      } else {
        // going from pause to play
        setLastPlayedTime(getTime());
      }
      setPlay(!play);
    }

    // play fake notes
    if (event.key == "f") {
      // if (play) {
      const newPopper = headFiles[0].map((note) => {
        return {
          ...note,
          startTime: curTime + note.startTime - firstFakeStartTime,
          endTime: curTime + note.endTime - firstFakeStartTime,
        };
      });
      const newNotes = [...notes, ...newPopper];
      setNotes(newNotes);
      setlastFTime(curTime);
    }
    // } else {
    //   try {
    //     // append new note to notesAndTime.notes and set pitch and startTime
    //     const startTime = curTime;
    //     const newNote = {
    //       pitch: getPitch(event),
    //       startTime: startTime,
    //       endTime: null,
    //     };

    //     const newNotes = [...notes, newNote];
    //     setNotes(newNotes);
    //   } catch {
    //     console.log("key must be a number 0 through 9");
    //   }
    // }

    if (event.key == "w") {
      setFancyMode(!fancyMode);
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
    const newArcThresh = Number(event.target.value);
    setArcThresh(newArcThresh);
  };

  // scrubbing
  const handleScrubChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = Number(event.target.value);
    setScrubPercentage(percentage);

    // cancel all previously scheduled notes
    Tone.Transport.cancel();
    // update last "played" note index so we resume audio from new scrub location
    const newTime = (percentage / 100) * lastFakeEndTime + lastFTime;
    const i = notes.findIndex((n) => n.startTime > newTime);
    setLastPlayedNoteIndex(i !== -1 ? i - 1 : notes.length);
  };

  // update chosen heads
  const handleHeadChange = (head: number) => {
    if (!curHeads.includes(head)) {
      const newCurHeads = [...curHeads, head];
      setCurHeads(newCurHeads);
    } else {
      const newCurHeads = curHeads.filter((num) => num !== head);
      setCurHeads(newCurHeads);
    }
  };

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">Music Visualization App</h1>
        <h2 className="text-lg mb-1">
          Press <strong>F</strong> to play Popper Etude
        </h2>
        <h2 className="text-lg mb-1 flex items-center gap-2">
          Press <strong>Spacebar</strong> to play/pause
          {play ? (
            <img
              src={pauseBttn}
              alt="Currently playing"
              width="25"
              style={{
                position: "relative",
                left: "0px",
                top: "0px",
              }}
            />
          ) : (
            <img
              src={playBttn}
              alt="Currently Paused"
              width="25"
              style={{
                position: "relative",
                left: "0px",
                top: "0px",
              }}
            />
          )}
        </h2>
        <h2 className="text-lg mb-1">
          Press <strong>W</strong> to turn on/off fancy arcs (lightness is
          proportional to weight)
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input type="range" onChange={handleZoomChange} />
          <h2 className="text-lg"> {zoom}% zoom</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="range"
            onChange={handleThreshChange}
            ref={threshInputRef}
          />
          <h2 className="text-lg"> Attention: Top {arcThresh}%</h2>
        </div>
        <div className="grid grid-cols-6 gap-2 w-full mb-4">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((headNumber) => (
            <button
              key={headNumber}
              onClick={() => handleHeadChange(headNumber)}
              style={{
                padding: "5px 5px",
                border: "3px solid white",
                borderRadius: "10px",
                cursor: "pointer",
                backgroundColor: curHeads.includes(headNumber)
                  ? chosenColors[headNumber]
                  : colors[headNumber],
                color: curHeads.includes(headNumber) ? "black" : "white",
              }}
              className="py-2 px-4 rounded font-semibold hover:brightness-110 transition"
            >
              Head {headNumber}
            </button>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <canvas
            ref={canvasRef}
            width="800"
            style={{ border: "1px solid black" }}
          />

          <img
            src={bassImg}
            alt="error"
            width="60"
            style={{
              position: "absolute",
              left: "15px",
              top: "215px",
            }}
          />

          <img
            src={trebleImg}
            alt="error"
            width="85"
            style={{
              position: "absolute",
              left: "0px",
              top: "115px",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2 className="text-lg"> Scroll to Scrub</h2>
          <input
            type="range"
            onChange={handleScrubChange}
            ref={scrubInputRef}
            className="w-150"
            value={scrubPercentage}
          />
        </div>
      </div>
    </main>
  );
};
