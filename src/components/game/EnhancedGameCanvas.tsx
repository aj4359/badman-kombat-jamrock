import React, { useEffect, useState, useCallback } from 'react';
import { useEnhancedGameEngine } from '@/hooks/useEnhancedGameEngine';
import { useEnhancedSpriteSystem } from '@/hooks/useEnhancedSpriteSystem';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useFightCommentary } from '@/hooks/useFightCommentary';
import { useCrowdAudio } from '@/hooks/useCrowdAudio';
import { AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedMobileControls } from '@/components/game/EnhancedMobileControls';
import { EnhancedComboDisplay } from '@/components/game/EnhancedComboSystem';
import { FightCommentary } from '@/components/FightCommentary';
import FightingStage from '@/components/game/FightingStage';

const EnhancedGameCanvas = () => {
  const { canvasRef, gameState, handleMobileInput, initializeFighters } = useEnhancedGameEngine();
  const { drawEnhancedFighter, isLoaded: spritesLoaded } = useEnhancedSpriteSystem();
  const { playEffect, isLoaded, audioErrors, toggleMute, settings, initializeAudioContext } = useAudioManager();
  const { commentary, triggerCommentary, hideCommentary } = useFightCommentary();
  const { playCheer, playBoo, playGasp } = useCrowdAudio();
  const [gameInitialized, setGameInitialized] = useState(false);

  // Enhanced game rendering
  const renderGame = useCallback(() => {
    if (!canvasRef.current || !spritesLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'hsl(210, 30%, 15%)');
    gradient.addColorStop(0.6, 'hsl(200, 25%, 10%)');
    gradient.addColorStop(1, 'hsl(30, 20%, 20%)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw crowd in background
    renderCrowdBackground(ctx, canvas.width, canvas.height);
    
    // Draw fighting arena ground
    ctx.fillStyle = 'hsl(30, 15%, 25%)';
    ctx.fillRect(0, canvas.height - 120, canvas.width, 120);

    // Draw center line
    ctx.strokeStyle = 'hsl(60, 100%, 50%, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height - 120);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw fighters with enhanced Street Fighter styling
    if (gameState.fighters.player1) {
      const effects = {
        special: gameState.fighters.player1.state.current === 'special',
        hurt: gameState.fighters.player1.state.current === 'hurt',
        alpha: gameState.fighters.player1.state.current === 'hurt' ? 0.7 : 1.0
      };
      drawEnhancedFighter(ctx, gameState.fighters.player1, effects);
    }
    
    if (gameState.fighters.player2) {
      const effects = {
        special: gameState.fighters.player2.state.current === 'special',
        hurt: gameState.fighters.player2.state.current === 'hurt',
        alpha: gameState.fighters.player2.state.current === 'hurt' ? 0.7 : 1.0
      };
      drawEnhancedFighter(ctx, gameState.fighters.player2, effects);
    }
  }, [canvasRef, spritesLoaded, drawEnhancedFighter, gameState]);

  // Render crowd background
  const renderCrowdBackground = useCallback((ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    // Stadium background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight * 0.6);
    gradient.addColorStop(0, 'hsl(240, 30%, 8%)');
    gradient.addColorStop(1, 'hsl(200, 25%, 12%)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight * 0.6);
    
    // Crowd silhouettes
    ctx.fillStyle = 'hsl(0, 0%, 5%)';
    for (let i = 0; i < 20; i++) {
      const x = (canvasWidth / 20) * i;
      const height = 40 + Math.random() * 20;
      // Left side crowd
      ctx.fillRect(x, canvasHeight * 0.3, canvasWidth / 20, height);
      // Right side crowd
      ctx.fillRect(x, canvasHeight * 0.35, canvasWidth / 20, height);
    }
    
    // Stadium lights
    ctx.fillStyle = 'hsl(60, 100%, 80%)';
    ctx.shadowColor = 'hsl(60, 100%, 50%)';
    ctx.shadowBlur = 20;
    for (let i = 0; i < 4; i++) {
      const x = (canvasWidth / 4) * i + canvasWidth / 8;
      ctx.beginPath();
      ctx.arc(x, canvasHeight * 0.15, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }, []);

  useEffect(() => {
    console.log('Game Canvas mounted');
    console.log('Audio loaded:', isLoaded);
    console.log('Sprites loaded:', spritesLoaded);
    console.log('Game state:', gameState);
    
    // Initialize fighters when both audio and sprites are loaded
    if (isLoaded && spritesLoaded) {
      initializeFighters();
      
      // Mark game as initialized after a brief delay
      const initTimer = setTimeout(() => {
        setGameInitialized(true);
        console.log('Game canvas fully initialized');
      }, 500);

      return () => clearTimeout(initTimer);
    }
  }, [isLoaded, spritesLoaded, initializeFighters]);

  // Game loop for rendering
  useEffect(() => {
    if (!gameInitialized) return;
    
    const gameLoop = () => {
      renderGame();
      requestAnimationFrame(gameLoop);
    };
    
    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [gameInitialized, renderGame]);

  // iOS audio initialization
  useEffect(() => {
    const handleFirstTouch = () => {
      initializeAudioContext();
      document.removeEventListener('touchstart', handleFirstTouch);
    };
    document.addEventListener('touchstart', handleFirstTouch, { once: true });
    return () => document.removeEventListener('touchstart', handleFirstTouch);
  }, [initializeAudioContext]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-cyber p-4">
      <div className="relative">
        {/* Audio Status Indicator */}
        <div className="absolute top-2 right-2 z-20 flex items-center gap-2">
          <Button
            variant="cyber"
            size="icon"
            onClick={toggleMute}
            className="opacity-80 hover:opacity-100"
          >
            {settings.isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          {audioErrors.length > 0 && (
            <div className="bg-destructive/20 border border-destructive/50 rounded px-2 py-1">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-xs text-destructive ml-1">{audioErrors.length} audio files missing</span>
            </div>
          )}
        </div>

        {/* Game Initialization Status */}
        {!gameInitialized && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-2xl font-retro text-neon-cyan mb-2">INITIALIZING KOMBAT</div>
              <div className="text-sm text-muted-foreground">Loading fighters and arena...</div>
            </div>
          </div>
        )}

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
            {/* Enhanced Combo Display */}
            <EnhancedComboDisplay
              comboCount={gameState.fighters.player1?.comboCount || 0}
              comboDamage={gameState.fighters.player1?.comboDamage || 0}
              comboDecay={gameState.fighters.player1?.comboDecay || 0}
              playerSide="left"
              isActive={gameState.fighters.player1?.comboCount > 0}
            />
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
            {/* Enhanced Combo Display */}
            <EnhancedComboDisplay
              comboCount={gameState.fighters.player2?.comboCount || 0}
              comboDamage={gameState.fighters.player2?.comboDamage || 0}
              comboDecay={gameState.fighters.player2?.comboDecay || 0}
              playerSide="right"
              isActive={gameState.fighters.player2?.comboCount > 0}
            />
          </div>
        </div>

        {/* Game Canvas */}
        <div className="relative border-2 border-neon-cyan/30 rounded-lg shadow-2xl shadow-neon-cyan/20">
          <canvas
            ref={canvasRef}
            width={1024}
            height={576}
            className="w-full h-full rounded-lg"
            style={{
              imageRendering: 'pixelated',
              filter: 'contrast(1.1) saturate(1.2)',
            }}
            tabIndex={0}
          />
        </div>

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
        {gameState.fighters.player1?.state.current === 'special' && (
          <div className="absolute top-1/2 left-8 transform -translate-y-1/2 z-20">
            <div className="text-neon-cyan font-retro text-xl font-bold animate-pulse">
              {gameState.fighters.player1.animation?.currentMove || 'SPECIAL MOVE'}
            </div>
          </div>
        )}
        
        {gameState.fighters.player2?.state.current === 'special' && (
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-20">
            <div className="text-neon-pink font-retro text-xl font-bold animate-pulse">
              {gameState.fighters.player2.animation?.currentMove || 'SPECIAL MOVE'}
            </div>
          </div>
        )}

        {/* Fight Commentary */}
        <FightCommentary 
          isVisible={commentary.isVisible}
          onComplete={hideCommentary}
        />

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-20 left-4 bg-black/80 text-green-400 font-mono text-xs p-2 rounded">
            <div>Audio: {isLoaded ? 'LOADED' : 'LOADING'}</div>
            <div>Game: {gameInitialized ? 'READY' : 'INIT'}</div>
            <div>Errors: {audioErrors.length}</div>
          </div>
        )}

        {/* Mobile Controls */}
      <EnhancedMobileControls 
        onTouch={(action, pressed) => handleMobileInput(1, action, pressed)}
        onGesture={(gesture) => {
          // Map gestures to actions
          switch (gesture) {
            case 'swipe-left': handleMobileInput(1, 'left', true); break;
            case 'swipe-right': handleMobileInput(1, 'right', true); break;
            case 'swipe-up': handleMobileInput(1, 'up', true); break;
            case 'swipe-down': handleMobileInput(1, 'down', true); break;
            case 'tap': handleMobileInput(1, 'punch', true); break;
            case 'double-tap': handleMobileInput(1, 'kick', true); break;
            case 'hold': handleMobileInput(1, 'block', true); break;
          }
        }}
      />
      </div>
    </div>
  );
};

export default EnhancedGameCanvas;