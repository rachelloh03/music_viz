import { useRef, useEffect } from "react";

const Staff = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      const ctx = canvas.getContext("2d");
      if (ctx !== null) {
        const staffY = canvas.height * 0.3;
        const lineSpacing = (canvas.height * 0.5) / 5;
        const lineWidth = canvas.width;

        // draw staff lines
        for (let i = 0; i < 5; i++) {
          const y = staffY + lineSpacing * i;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(lineWidth, y);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "black";
          ctx.stroke();
        }

        // draw nowbar
        ctx.beginPath();
        ctx.moveTo(lineWidth, 0);
        ctx.lineTo(lineWidth, canvas.height);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        ctx.stroke();
      }
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="lineSpacing*7"
      style={{ border: "1px solid black" }}
    ></canvas>
  );
};

export default Staff;
