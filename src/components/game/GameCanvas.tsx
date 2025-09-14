import React from 'react';
import { useGameEngine } from '@/hooks/useGameEngine';

const GameCanvas = () => {
  const { canvasRef, gameState } = useGameEngine();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-cyber p-4">
      <div className="relative">
        {/* Game HUD */}
        <div className="absolute top-4 left-0 right-0 z-10 flex justify-between items-center px-8">
          {/* Player 1 Health */}
          <div className="flex flex-col items-start">
            <div className="text-neon-cyan font-retro text-lg mb-2">
              {gameState.fighters.player1?.name || 'PLAYER 1'}
            </div>
            <div className="w-64 h-6 bg-card/50 border border-neon-cyan/50 rounded">
              <div 
                className="h-full bg-gradient-to-r from-neon-green to-neon-cyan transition-all duration-300"
                style={{ 
                  width: `${((gameState.fighters.player1?.health || 0) / (gameState.fighters.player1?.maxHealth || 100)) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Timer */}
          <div className="text-center">
            <div className="text-neon-pink font-retro text-4xl font-bold">
              {Math.ceil(gameState.timer)}
            </div>
            <div className="text-foreground/70 font-retro text-sm">
              ROUND {gameState.round}
            </div>
          </div>

          {/* Player 2 Health */}
          <div className="flex flex-col items-end">
            <div className="text-neon-pink font-retro text-lg mb-2">
              {gameState.fighters.player2?.name || 'PLAYER 2'}
            </div>
            <div className="w-64 h-6 bg-card/50 border border-neon-pink/50 rounded">
              <div 
                className="h-full bg-gradient-to-l from-neon-pink to-neon-orange transition-all duration-300 ml-auto"
                style={{ 
                  width: `${((gameState.fighters.player2?.health || 0) / (gameState.fighters.player2?.maxHealth || 100)) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <canvas 
          ref={canvasRef}
          className="border-2 border-neon-cyan/50 rounded-lg shadow-neon-cyan bg-background"
          style={{ 
            width: '1024px', 
            height: '576px',
            maxWidth: '100%'
          }}
        />

        {/* Controls Guide */}
        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-between px-8">
          <div className="bg-card/80 backdrop-blur border border-neon-cyan/30 rounded p-3">
            <div className="text-neon-cyan font-retro text-sm font-bold mb-1">PLAYER 1</div>
            <div className="text-foreground/70 text-xs font-body">
              WASD: Move • J: Attack • K: Block
            </div>
          </div>
          
          <div className="bg-card/80 backdrop-blur border border-neon-pink/30 rounded p-3">
            <div className="text-neon-pink font-retro text-sm font-bold mb-1">PLAYER 2</div>
            <div className="text-foreground/70 text-xs font-body">
              Arrows: Move • 1: Attack • 2: Block
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCanvas;