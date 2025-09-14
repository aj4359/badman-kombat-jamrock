import React from 'react';
import GameCanvas from '@/components/game/GameCanvas';

const Game = () => {
  return (
    <div className="min-h-screen bg-background">
      <GameCanvas />
    </div>
  );
};

export default Game;