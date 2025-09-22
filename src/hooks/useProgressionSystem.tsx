import { useState, useEffect } from 'react';

export interface FighterProgress {
  id: string;
  unlocked: boolean;
  wins: number;
  bestTime: number | null;
  battlesWon: number;
  specialMovesUsed: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  requirements?: string;
}

export interface UnlockCondition {
  type: 'wins' | 'time' | 'moves' | 'battles' | 'story';
  value: number;
  description: string;
}

const DEFAULT_FIGHTERS: FighterProgress[] = [
  { id: 'leroy', unlocked: true, wins: 0, bestTime: null, battlesWon: 0, specialMovesUsed: 0, difficulty: 'easy' },
  { id: 'jordan', unlocked: true, wins: 0, bestTime: null, battlesWon: 0, specialMovesUsed: 0, difficulty: 'easy' },
  { id: 'razor', unlocked: false, wins: 0, bestTime: null, battlesWon: 0, specialMovesUsed: 0, difficulty: 'medium' },
  { id: 'voltage', unlocked: false, wins: 0, bestTime: null, battlesWon: 0, specialMovesUsed: 0, difficulty: 'medium' },
  { id: 'blaze', unlocked: false, wins: 0, bestTime: null, battlesWon: 0, specialMovesUsed: 0, difficulty: 'hard' },
  { id: 'sifu', unlocked: false, wins: 0, bestTime: null, battlesWon: 0, specialMovesUsed: 0, difficulty: 'hard' },
  { id: 'rootsman', unlocked: false, wins: 0, bestTime: null, battlesWon: 0, specialMovesUsed: 0, difficulty: 'expert' }
];

const DEFAULT_MODES: GameMode[] = [
  { id: 'training', name: 'Training Mode', description: 'Practice your moves', unlocked: true },
  { id: 'versus', name: 'Versus Mode', description: 'Fight against another player', unlocked: true },
  { id: 'arcade', name: 'Arcade Mode', description: 'Fight through Kingston\'s underground', unlocked: true },
  { id: 'story', name: 'Story Mode', description: 'Experience each fighter\'s journey', unlocked: false, requirements: 'Win 3 arcade battles' },
  { id: 'tournament', name: 'Tournament', description: 'Compete in organized brackets', unlocked: false, requirements: 'Unlock 4 fighters' },
  { id: 'survival', name: 'Survival Mode', description: 'How long can you last?', unlocked: false, requirements: 'Win arcade mode with any fighter' }
];

export const useProgressionSystem = () => {
  const [fighters, setFighters] = useState<FighterProgress[]>([]);
  const [gameModes, setGameModes] = useState<GameMode[]>([]);
  const [totalBattles, setTotalBattles] = useState(0);
  const [totalWins, setTotalWins] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const savedFighters = localStorage.getItem('bmk-fighter-progress');
    const savedModes = localStorage.getItem('bmk-game-modes');
    const savedStats = localStorage.getItem('bmk-game-stats');

    if (savedFighters) {
      setFighters(JSON.parse(savedFighters));
    } else {
      setFighters(DEFAULT_FIGHTERS);
    }

    if (savedModes) {
      setGameModes(JSON.parse(savedModes));
    } else {
      setGameModes(DEFAULT_MODES);
    }

    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setTotalBattles(stats.totalBattles || 0);
      setTotalWins(stats.totalWins || 0);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('bmk-fighter-progress', JSON.stringify(fighters));
  }, [fighters]);

  useEffect(() => {
    localStorage.setItem('bmk-game-modes', JSON.stringify(gameModes));
  }, [gameModes]);

  useEffect(() => {
    localStorage.setItem('bmk-game-stats', JSON.stringify({ totalBattles, totalWins }));
  }, [totalBattles, totalWins]);

  const unlockFighter = (fighterId: string) => {
    setFighters(prev => prev.map(f => 
      f.id === fighterId ? { ...f, unlocked: true } : f
    ));
  };

  const recordWin = (fighterId: string, time?: number) => {
    setFighters(prev => prev.map(f => 
      f.id === fighterId ? {
        ...f,
        wins: f.wins + 1,
        battlesWon: f.battlesWon + 1,
        bestTime: time && (!f.bestTime || time < f.bestTime) ? time : f.bestTime
      } : f
    ));
    setTotalWins(prev => prev + 1);
    setTotalBattles(prev => prev + 1);
  };

  const recordLoss = (fighterId: string) => {
    setTotalBattles(prev => prev + 1);
  };

  const recordSpecialMove = (fighterId: string) => {
    setFighters(prev => prev.map(f => 
      f.id === fighterId ? { ...f, specialMovesUsed: f.specialMovesUsed + 1 } : f
    ));
  };

  const checkUnlocks = () => {
    const unlockedCount = fighters.filter(f => f.unlocked).length;
    
    // Check fighter unlocks
    if (totalWins >= 3 && !fighters.find(f => f.id === 'razor')?.unlocked) {
      unlockFighter('razor');
    }
    if (totalWins >= 5 && !fighters.find(f => f.id === 'voltage')?.unlocked) {
      unlockFighter('voltage');
    }
    if (totalWins >= 8 && !fighters.find(f => f.id === 'blaze')?.unlocked) {
      unlockFighter('blaze');
    }
    if (totalWins >= 12 && !fighters.find(f => f.id === 'sifu')?.unlocked) {
      unlockFighter('sifu');
    }
    if (totalWins >= 20 && !fighters.find(f => f.id === 'rootsman')?.unlocked) {
      unlockFighter('rootsman');
    }

    // Check mode unlocks
    setGameModes(prev => prev.map(mode => {
      if (mode.id === 'story' && totalBattles >= 3) {
        return { ...mode, unlocked: true };
      }
      if (mode.id === 'tournament' && unlockedCount >= 4) {
        return { ...mode, unlocked: true };
      }
      if (mode.id === 'survival' && totalWins >= 5) {
        return { ...mode, unlocked: true };
      }
      return mode;
    }));
  };

  // Check unlocks whenever stats change
  useEffect(() => {
    checkUnlocks();
  }, [totalWins, totalBattles, fighters]);

  const getUnlockConditions = (fighterId: string): UnlockCondition | null => {
    switch (fighterId) {
      case 'razor': return { type: 'wins', value: 3, description: 'Win 3 battles' };
      case 'voltage': return { type: 'wins', value: 5, description: 'Win 5 battles' };
      case 'blaze': return { type: 'wins', value: 8, description: 'Win 8 battles' };
      case 'sifu': return { type: 'wins', value: 12, description: 'Win 12 battles' };
      case 'rootsman': return { type: 'wins', value: 20, description: 'Win 20 battles' };
      default: return null;
    }
  };

  const resetProgress = () => {
    setFighters(DEFAULT_FIGHTERS);
    setGameModes(DEFAULT_MODES);
    setTotalBattles(0);
    setTotalWins(0);
    localStorage.removeItem('bmk-fighter-progress');
    localStorage.removeItem('bmk-game-modes');
    localStorage.removeItem('bmk-game-stats');
  };

  return {
    fighters,
    gameModes,
    totalBattles,
    totalWins,
    unlockFighter,
    recordWin,
    recordLoss,
    recordSpecialMove,
    getUnlockConditions,
    resetProgress
  };
};