import { useGameStats } from "../../lib/stores/useGameStats";
import { useAudio } from "../../lib/stores/useAudio";

export default function GameUI() {
  const { score, lives } = useGameStats();
  const { toggleMute, isMuted } = useAudio();

  return (
    <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
      {/* Top HUD */}
      <div className="flex justify-between items-start p-4">
        {/* Score Display */}
        <div className="bg-black bg-opacity-70 rounded-lg p-3 border-2 border-yellow-400">
          <div className="text-center">
            <p className="text-yellow-300 font-bold text-sm">SCORE</p>
            <p className="text-white font-bold text-2xl">{score.toLocaleString()}</p>
          </div>
        </div>

        {/* Controls reminder */}
        <div className="bg-black bg-opacity-70 rounded-lg p-3 border-2 border-blue-400 hidden md:block">
          <div className="text-center text-white text-sm">
            <p>← → <span className="text-blue-300">MOVE</span></p>
            <p>SPACE <span className="text-red-300">FIRE</span></p>
          </div>
        </div>

        {/* Lives Display */}
        <div className="bg-black bg-opacity-70 rounded-lg p-3 border-2 border-red-400">
          <div className="text-center">
            <p className="text-red-300 font-bold text-sm">LIVES</p>
            <div className="flex justify-center space-x-1">
              {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
                <span key={i} className="text-red-500 text-xl">❤️</span>
              ))}
              {Array.from({ length: Math.max(0, 3 - lives) }).map((_, i) => (
                <span key={`empty-${i}`} className="text-gray-600 text-xl">💔</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <button
          onClick={toggleMute}
          className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white font-bold 
                   px-4 py-2 rounded-lg border border-gray-400 hover:border-white
                   transition-all duration-200"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* Mobile controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4 pointer-events-auto md:hidden">
        <button
          className="bg-black bg-opacity-80 text-white font-bold px-8 py-4 rounded-lg 
                   border-2 border-blue-400 active:bg-blue-600 active:scale-95
                   transition-all duration-100 text-2xl shadow-lg"
          onMouseDown={(e) => {
            e.preventDefault();
            const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
            document.dispatchEvent(event);
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            const event = new KeyboardEvent('keyup', { key: 'ArrowLeft', bubbles: true });
            document.dispatchEvent(event);
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
            document.dispatchEvent(event);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            const event = new KeyboardEvent('keyup', { key: 'ArrowLeft', bubbles: true });
            document.dispatchEvent(event);
          }}
        >
          ←
        </button>
        
        <button
          className="bg-black bg-opacity-80 text-white font-bold px-8 py-4 rounded-lg 
                   border-2 border-red-400 active:bg-red-600 active:scale-95
                   transition-all duration-100 text-2xl shadow-lg"
          onMouseDown={(e) => {
            e.preventDefault();
            const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
            document.dispatchEvent(event);
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            const event = new KeyboardEvent('keyup', { key: ' ', bubbles: true });
            document.dispatchEvent(event);
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
            document.dispatchEvent(event);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            const event = new KeyboardEvent('keyup', { key: ' ', bubbles: true });
            document.dispatchEvent(event);
          }}
        >
          🔥
        </button>
        
        <button
          className="bg-black bg-opacity-80 text-white font-bold px-8 py-4 rounded-lg 
                   border-2 border-blue-400 active:bg-blue-600 active:scale-95
                   transition-all duration-100 text-2xl shadow-lg"
          onMouseDown={(e) => {
            e.preventDefault();
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            document.dispatchEvent(event);
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            const event = new KeyboardEvent('keyup', { key: 'ArrowRight', bubbles: true });
            document.dispatchEvent(event);
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            document.dispatchEvent(event);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            const event = new KeyboardEvent('keyup', { key: 'ArrowRight', bubbles: true });
            document.dispatchEvent(event);
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
