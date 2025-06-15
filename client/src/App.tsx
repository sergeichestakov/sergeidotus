import { useEffect, useState } from "react";
import { useGame, GamePhase } from "./lib/stores/useGame";
import { useAudio } from "./lib/stores/useAudio";
import { useGameStats } from "./lib/stores/useGameStats";
import StartScreen from "./components/game/StartScreen";
import GameCanvas from "./components/game/GameCanvas";
import GameOverScreen from "./components/game/GameOverScreen";
import GameUI from "./components/game/GameUI";
import "@fontsource/inter";

function App() {
  const { phase } = useGame();
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  const [soundsLoaded, setSoundsLoaded] = useState(false);

  // Load audio files
  useEffect(() => {
    const loadSounds = async () => {
      try {
        // Load background music
        const bgMusic = new Audio('/sounds/background.mp3');
        bgMusic.loop = true;
        bgMusic.volume = 0.3;
        setBackgroundMusic(bgMusic);

        // Load hit sound
        const hitSound = new Audio('/sounds/hit.mp3');
        hitSound.volume = 0.5;
        setHitSound(hitSound);

        // Load success sound
        const successSound = new Audio('/sounds/success.mp3');
        successSound.volume = 0.7;
        setSuccessSound(successSound);

        setSoundsLoaded(true);
        console.log("All sounds loaded successfully");
      } catch (error) {
        console.error("Error loading sounds:", error);
        setSoundsLoaded(true); // Continue even if sounds fail to load
      }
    };

    loadSounds();
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // Don't render until sounds are loaded
  if (!soundsLoaded) {
    return (
      <div className="w-full h-screen relative overflow-hidden bg-black">
        {/* Background stars and patriotic theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-red-900 to-blue-900 opacity-20" />
        
        <div className="w-full h-full flex items-center justify-center relative">
          {/* Patriotic background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full bg-gradient-to-br from-blue-800 via-red-700 to-blue-800" />
          </div>

          {/* Main content */}
          <div className="text-center z-10 max-w-2xl mx-auto px-8">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-lg">
                <span className="text-red-500">sergei</span><span className="text-white">.us</span> 🦅
              </h1>
              <p className="text-xl md:text-2xl text-yellow-300 font-semibold drop-shadow">
                Loading Patriotic Defense System...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black">
      {/* Background stars and patriotic theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-red-900 to-blue-900 opacity-20" />
      
      {/* Game content based on phase */}
      {phase === "ready" && <StartScreen />}
      
      {phase === "playing" && (
        <>
          <GameCanvas />
          <GameUI />
        </>
      )}
      
      {phase === "ended" && <GameOverScreen />}
    </div>
  );
}

export default App;
