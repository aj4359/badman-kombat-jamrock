import React from 'react';
import { useEnhancedGameEngine } from '@/hooks/useEnhancedGameEngine';
import { useAudioManager } from '@/hooks/useAudioManager';

const EnhancedGameCanvas = () => {
  const { canvasRef, gameState } = useEnhancedGameEngine();
  const { playEffect } = useAudioManager();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-cyber p-4">
      <div className="relative">
        {/* Enhanced Game HUD */}
        <div className="absolute top-4 left-0 right-0 z-10 flex justify-between items-center px-8">
          {/* Player 1 Health & Super Meter */}
          <div className="flex flex-col items-start">
            <div className="text-neon-cyan font-retro text-lg mb-2">
              {gameState.fighters.player1?.name || 'PLAYER 1'}
            </div>
            <div className="w-64 h-6 bg-card/50 border border-neon-cyan/50 rounded mb-2">
              <div 
                className="h-full bg-gradient-to-r from-neon-green to-neon-cyan transition-all duration-300"
                style={{ 
                  width: `${((gameState.fighters.player1?.health || 0) / (gameState.fighters.player1?.maxHealth || 100)) * 100}%` 
                }}
              />
            </div>
            {/* Super Meter */}
            <div className="w-64 h-3 bg-card/50 border border-neon-orange/50 rounded">
              <div 
                className="h-full bg-gradient-to-r from-neon-orange to-neon-pink transition-all duration-300"
                style={{ 
                  width: `${((gameState.fighters.player1?.superMeter || 0) / (gameState.fighters.player1?.maxSuperMeter || 100)) * 100}%` 
                }}
              />
            </div>
            {/* Combo Counter */}
            {(gameState.fighters.player1?.comboCount || 0) > 1 && (
              <div className="text-neon-orange font-retro text-xl mt-2 animate-pulse">
                {gameState.fighters.player1?.comboCount} HIT COMBO!
              </div>
            )}
          </div>

          {/* Timer & Round */}
          <div className="text-center">
            <div className="text-neon-pink font-retro text-4xl font-bold">
              {Math.ceil(gameState.timer)}
            </div>
            <div className="text-foreground/70 font-retro text-sm">
              ROUND {gameState.round}
            </div>
            <div className="text-neon-green font-retro text-xs mt-2">
              {gameState.stage.toUpperCase().replace('-', ' ')}
            </div>
          </div>

          {/* Player 2 Health & Super Meter */}
          <div className="flex flex-col items-end">
            <div className="text-neon-pink font-retro text-lg mb-2">
              {gameState.fighters.player2?.name || 'PLAYER 2'}
            </div>
            <div className="w-64 h-6 bg-card/50 border border-neon-pink/50 rounded mb-2">
              <div 
                className="h-full bg-gradient-to-l from-neon-pink to-neon-orange transition-all duration-300 ml-auto"
                style={{ 
                  width: `${((gameState.fighters.player2?.health || 0) / (gameState.fighters.player2?.maxHealth || 100)) * 100}%` 
                }}
              />
            </div>
            {/* Super Meter */}
            <div className="w-64 h-3 bg-card/50 border border-neon-purple/50 rounded">
              <div 
                className="h-full bg-gradient-to-l from-neon-purple to-neon-pink transition-all duration-300 ml-auto"
                style={{ 
                  width: `${((gameState.fighters.player2?.superMeter || 0) / (gameState.fighters.player2?.maxSuperMeter || 100)) * 100}%` 
                }}
              />
            </div>
            {/* Combo Counter */}
            {(gameState.fighters.player2?.comboCount || 0) > 1 && (
              <div className="text-neon-purple font-retro text-xl mt-2 animate-pulse">
                {gameState.fighters.player2?.comboCount} HIT COMBO!
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Game Canvas */}
        <canvas 
          ref={canvasRef}
          className="border-2 border-neon-cyan/50 rounded-lg shadow-neon-cyan bg-background"
          style={{ 
            width: '1024px', 
            height: '576px',
            maxWidth: '100%',
            transform: gameState.screenShake.duration > 0 
              ? `translate(${(Math.random() - 0.5) * gameState.screenShake.intensity}px, ${(Math.random() - 0.5) * gameState.screenShake.intensity}px)`
              : 'none'
          }}
        />

        {/* Enhanced Controls Guide */}
        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-between px-8">
          <div className="bg-card/80 backdrop-blur border border-neon-cyan/30 rounded p-3">
            <div className="text-neon-cyan font-retro text-sm font-bold mb-1">PLAYER 1</div>
            <div className="text-foreground/70 text-xs font-body space-y-1">
              <div>WASD: Move • J: Light • K: Heavy</div>
              <div>Special Moves: ↓↘→+J/K</div>
              <div>Super: ↓↙←→+J+K (Full Meter)</div>
            </div>
          </div>
          
          <div className="bg-card/80 backdrop-blur border border-neon-pink/30 rounded p-3">
            <div className="text-neon-pink font-retro text-sm font-bold mb-1">PLAYER 2</div>
            <div className="text-foreground/70 text-xs font-body space-y-1">
              <div>Arrows: Move • 1: Light • 2: Heavy</div>
              <div>Special Moves: ↓↘→+1/2</div>
              <div>Super: ↓↙←→+1+2 (Full Meter)</div>
            </div>
          </div>
        </div>

        {/* Special Move Indicators */}
        {gameState.fighters.player1?.state === 'special' && (
          <div className="absolute top-1/2 left-8 transform -translate-y-1/2 z-20">
            <div className="text-neon-cyan font-retro text-xl font-bold animate-pulse">
              {gameState.fighters.player1.animation.currentMove}
            </div>
          </div>
        )}
        
        {gameState.fighters.player2?.state === 'special' && (
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-20">
            <div className="text-neon-pink font-retro text-xl font-bold animate-pulse">
              {gameState.fighters.player2.animation.currentMove}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedGameCanvas;