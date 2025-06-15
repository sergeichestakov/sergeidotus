import { useGame } from "../../lib/stores/useGame";
import { useGameStats } from "../../lib/stores/useGameStats";

export default function GameOverScreen() {
  const { restart } = useGame();
  const { score, highScore, resetScore } = useGameStats();

  const handleRestart = () => {
    console.log("Restarting game...");
    resetScore();
    restart();
  };

  const isNewHighScore = score > 0 && score === highScore;

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Patriotic background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-red-800 via-blue-800 to-red-800" />
      </div>

      {/* Main content */}
      <div className="text-center z-10 max-w-2xl mx-auto px-8">
        {/* Game Over Title */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            {isNewHighScore ? "🏆 VICTORY! 🏆" : "💥 MISSION END 💥"}
          </h1>
          <p className="text-xl md:text-2xl text-yellow-300 font-semibold drop-shadow">
            {isNewHighScore 
              ? "NEW HIGH SCORE ACHIEVED!" 
              : "The Eagle has landed"}
          </p>
        </div>

        {/* Score Display */}
        <div className="bg-black bg-opacity-60 rounded-lg p-8 mb-8 border-2 border-yellow-400">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <h3 className="text-red-400 font-bold text-xl mb-2">FINAL SCORE</h3>
              <p className="text-4xl font-bold text-white">{score.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <h3 className="text-blue-400 font-bold text-xl mb-2">HIGH SCORE</h3>
              <p className="text-4xl font-bold text-yellow-300">{highScore.toLocaleString()}</p>
            </div>
          </div>
          
          {isNewHighScore && (
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg">
              <p className="text-2xl font-bold text-white">
                🎉 CONGRATULATIONS! NEW RECORD! 🎉
              </p>
            </div>
          )}
        </div>

        {/* Performance Message */}
        <div className="mb-8">
          <p className="text-xl text-white font-bold">
            {score >= 10000 ? "🦅 AMERICAN HERO!" :
             score >= 5000 ? "⭐ PATRIOTIC WARRIOR!" :
             score >= 2000 ? "🛡️ FREEDOM DEFENDER!" :
             score >= 1000 ? "🎯 GOOD SOLDIER!" :
             "💪 KEEP FIGHTING FOR FREEDOM!"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleRestart}
            className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 
                     text-white font-bold text-2xl px-12 py-4 rounded-lg shadow-lg 
                     transform hover:scale-105 transition-all duration-200 
                     border-2 border-yellow-400 hover:border-yellow-300"
          >
            🚀 FLY AGAIN
          </button>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8">
          <p className="text-lg text-red-300 font-bold italic">
            "Liberty and justice for all - one mission at a time!"
          </p>
        </div>
      </div>
    </div>
  );
}
