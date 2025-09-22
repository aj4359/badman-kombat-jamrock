import React, { useEffect } from 'react';
import { useAudioManager } from '@/hooks/useAudioManager';
import GameCanvas from '@/components/game/GameCanvas';

const Game = () => {
  const { isLoaded, playLayer, currentLayer } = useAudioManager();

  useEffect(() => {
    // Ensure gameplay music is playing
    if (isLoaded && currentLayer !== 'gameplay') {
      playLayer('gameplay');
    }
  }, [isLoaded, currentLayer, playLayer]);

  return (
    <div className="min-h-screen bg-background">
      <GameCanvas />
    </div>
  );
};

export default Game;