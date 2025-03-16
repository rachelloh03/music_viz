import { useRef } from "react";
import type { Note } from "../note/note";

// test github commits again

const NoteRect = (note: Note) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const midi = note.midi;
  const startTime = note.startTime;
  const endTime = note.endTime;
  let animationID: number;

  const canvas = canvasRef.current;

  if (canvas !== null) {
    const ctx = canvas.getContext("2d");
    if (ctx !== null) {
      ctx.fillStyle = "blue";
      let x = canvas.width;
      const speed = 2;
      const staffY = canvas.height * 0.3;
      const lineSpacing = (canvas.height * 0.5) / 5;
      let noteWidth = 0;

      const animate = () => {
        //y depends on midi value
        const y = staffY + (lineSpacing / 2) * (midi - 60) - lineSpacing;
        x = canvas.width - (Date.now() - startTime) * speed;

        if (endTime === null) {
          noteWidth = (Date.now() - startTime) * speed;
        } else {
          noteWidth = (endTime - startTime) * speed;
        }

        ctx.fillRect(x, y, noteWidth, lineSpacing);

        animationID = requestAnimationFrame(animate);
        if (x < 0) {
          cancelAnimationFrame(animationID);
        }
      };

      animate();

      return (
        <canvas
          ref={canvasRef}
          width={500}
          height={300}
          style={{ border: "1px solid black" }}
        />
      );
    }
  }
};

export default NoteRect;
