import { useGame } from "../../lib/stores/useGame";
import { useGameStats } from "../../lib/stores/useGameStats";
import { useAudio } from "../../lib/stores/useAudio";
import { useMemo } from "react";

export default function StartScreen() {
  const { start } = useGame();
  const { highScore } = useGameStats();
  const { toggleMute, isMuted } = useAudio();

  // Pre-calculate star positions to prevent layout shifts
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      fontSize: Math.random() * 10 + 5,
      animationDuration: Math.random() * 3 + 2
    }));
  }, []);

  const handleStart = () => {
    console.log("Starting game...");
    start();
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Patriotic background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-gradient-to-br from-blue-800 via-red-700 to-blue-800" />
        {/* Stars pattern */}
        <div className="absolute inset-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute text-white opacity-60"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                fontSize: `${star.fontSize}px`,
                animation: `twinkle ${star.animationDuration}s infinite`,
              }}
            >
              ⭐
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="text-center z-10 max-w-2xl mx-auto px-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-lg">
            <span className="text-red-500">sergei</span><span className="text-white">.us</span> 🦅
          </h1>
          <p className="text-xl md:text-2xl text-yellow-300 font-semibold drop-shadow">
            DEFEND AMERICA IN THE STARS
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-black bg-opacity-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-yellow-400">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300 mb-3 sm:mb-4">🎯 MISSION BRIEFING</h2>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 text-left">
            <div>
              <h3 className="text-red-400 font-bold mb-2 text-sm sm:text-base">CONTROLS:</h3>
              <ul className="text-white space-y-1 text-sm sm:text-base">
                <li>← → Arrow Keys: Move</li>
                <li>SPACEBAR: Fire</li>
                <li>M: Mute/Unmute</li>
              </ul>
            </div>
            <div>
              <h3 className="text-blue-400 font-bold mb-2 text-sm sm:text-base">OBJECTIVE:</h3>
              <ul className="text-white space-y-1 text-sm sm:text-base">
                <li>Eliminate all threats</li>
                <li>Protect American skies</li>
                <li>Achieve freedom victory!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* High Score */}
        {highScore > 0 && (
          <div className="mb-6">
            <p className="text-2xl text-yellow-300 font-bold">
              🏆 HIGH SCORE: {highScore.toLocaleString()}
            </p>
          </div>
        )}

        {/* Start Button */}
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 
                     text-white font-bold text-lg sm:text-xl md:text-2xl px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-lg shadow-lg 
                     transform hover:scale-105 transition-all duration-200 
                     border-2 border-yellow-400 hover:border-yellow-300"
          >
            🚀 LAUNCH MISSION
          </button>
          
          <div>
            <button
              onClick={toggleMute}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 sm:px-6 py-2 rounded 
                       transition-colors duration-200 border border-gray-500 text-sm sm:text-base"
            >
              {isMuted ? "🔇 UNMUTE" : "🔊 MUTE"}
            </button>
          </div>
        </div>

        {/* Patriotic tagline */}
        <div className="mt-8">
          <p className="text-lg text-red-300 font-bold italic">
            "Freedom isn't free - defend it with honor!"
          </p>
        </div>
      </div>


    </div>
  );
}
