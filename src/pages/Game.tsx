import React, { useEffect } from 'react';
import { useAudioManager } from '@/hooks/useAudioManager';
import EnhancedGameCanvas from '@/components/game/EnhancedGameCanvas';

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
      <EnhancedGameCanvas />
    </div>
  );
};

export default Game;