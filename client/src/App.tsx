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
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-red-800 to-blue-900">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">sergei.us 🦅</h1>
          <p className="text-xl text-yellow-300">Loading Patriotic Defense System...</p>
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
