import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface GameStatsState {
  score: number;
  lives: number;
  level: number;
  highScore: number;
  
  // Actions
  addScore: (points: number) => void;
  loseLife: () => void;
  resetScore: () => void;
  nextLevel: () => void;
  setHighScore: (score: number) => void;
}

export const useGameStats = create<GameStatsState>()(
  subscribeWithSelector((set, get) => ({
    score: 0,
    lives: 3,
    level: 1,
    highScore: parseInt(localStorage.getItem('sergei-us-high-score') || '0'),
    
    addScore: (points) => {
      set((state) => {
        const newScore = state.score + points;
        
        // Update high score if needed
        if (newScore > state.highScore) {
          localStorage.setItem('sergei-us-high-score', newScore.toString());
          return { score: newScore, highScore: newScore };
        }
        
        return { score: newScore };
      });
    },
    
    loseLife: () => {
      set((state) => ({
        lives: Math.max(0, state.lives - 1)
      }));
    },
    
    resetScore: () => {
      set({ score: 0, lives: 3, level: 1 });
    },
    
    nextLevel: () => {
      set((state) => ({
        level: state.level + 1
      }));
    },
    
    setHighScore: (score) => {
      localStorage.setItem('sergei-us-high-score', score.toString());
      set({ highScore: score });
    }
  }))
);
