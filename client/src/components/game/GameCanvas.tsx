import { useEffect, useRef } from "react";
import { GameEngine } from "../../lib/game/GameEngine";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize game engine
    gameEngineRef.current = new GameEngine(canvas);
    gameEngineRef.current.start();

    console.log("Game engine started");

    // Cleanup on unmount
    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.stop();
        console.log("Game engine stopped");
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-black cursor-crosshair"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
