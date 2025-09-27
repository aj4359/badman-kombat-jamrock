import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useEnhancedGameEngine } from '@/hooks/useEnhancedGameEngine';
import { useAudioManager } from '@/hooks/useAudioManager';
import { EnhancedMobileControls } from './EnhancedMobileControls';
import { AdvancedAudioMixer } from '@/components/audio/AdvancedAudioMixer';
import { EpicTrailerCreator } from '@/components/trailer/EpicTrailerCreator';
import { useEnhancedInputSystem } from '@/components/gameplay/EnhancedInputSystem';
import { cn } from '@/lib/utils';

const ProfessionalGameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioManager = useAudioManager();
  const [showDebug, setShowDebug] = useState(false);
  
  const { gameState, initializeFighters, handleMobileInput: gameEngineInput } = useEnhancedGameEngine();
  
  // Enhanced input system with combo detection
  const { handleMobileInput } = useEnhancedInputSystem({
    onInput: (action, pressed, player) => {
      console.log(`Player ${player} ${action}: ${pressed ? 'pressed' : 'released'}`);
      // Handle input with frame-perfect timing
    },
    onCombo: (combo, player) => {
      console.log(`Player ${player} combo: ${combo}`);
      audioManager.playEffect('special');
    }
  });

  // Initialize fighters when passed from character select
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const player1Id = urlParams.get('player1') || 'leroy';
    const player2Id = urlParams.get('player2') || 'jordan';
    
    console.log('Initializing fighters with IDs:', { player1Id, player2Id });
    initializeFighters();
    
    if (audioManager.isLoaded) {
      audioManager.playLayer('gameplay', false);
    }
  }, [initializeFighters, audioManager]);

  // Enhanced mobile controls integration
  const handleMobileTouch = useCallback((action: string, pressed: boolean) => {
    console.log(`Mobile input: ${action} ${pressed ? 'pressed' : 'released'}`);
    handleMobileInput(action, pressed, 1);
  }, [handleMobileInput]);

  // Enhanced rendering system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to high DPI for crisp visuals
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // Professional rendering loop
    let animationId: number;
    
    const render = () => {
      // Clear with jamaican gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'hsl(120, 60%, 20%)'); // Dark green
      gradient.addColorStop(0.5, 'hsl(45, 80%, 30%)'); // Gold
      gradient.addColorStop(1, 'hsl(120, 60%, 15%)'); // Darker green
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render game elements with enhanced visual effects
      if (gameState.fighters.player1 && gameState.fighters.player2) {
        // Render stage elements
        renderStageBackground(ctx, canvas);
        
        // Render fighters with authentic proportions
        renderEnhancedFighter(ctx, gameState.fighters.player1);
        renderEnhancedFighter(ctx, gameState.fighters.player2);
        
        // Render professional UI
        renderProfessionalUI(ctx, canvas);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gameState]);

  const renderStageBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Professional stage background with parallax layers
    
    // Sky layer with time-of-day lighting
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
    skyGradient.addColorStop(0, 'hsl(220, 60%, 30%)'); // Evening sky
    skyGradient.addColorStop(1, 'hsl(30, 70%, 50%)'); // Sunset horizon
    
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);

    // Kingston street silhouettes
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    drawKingstonSkyline(ctx, canvas);

    // Ground with texture
    ctx.fillStyle = 'hsl(30, 40%, 25%)';
    ctx.fillRect(0, canvas.height * 0.75, canvas.width, canvas.height * 0.25);

    // Neon lighting effects
    ctx.shadowColor = 'hsl(180, 100%, 50%)';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = 'hsl(180, 100%, 50%)';
    ctx.lineWidth = 2;
    
    // Neon outline around stage
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    ctx.shadowBlur = 0;
  };

  const drawKingstonSkyline = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Silhouettes of Kingston buildings and palm trees
    const buildings = [
      { x: 0, y: canvas.height * 0.5, width: 80, height: canvas.height * 0.3 },
      { x: 100, y: canvas.height * 0.45, width: 60, height: canvas.height * 0.35 },
      { x: 180, y: canvas.height * 0.55, width: 90, height: canvas.height * 0.25 },
      { x: 300, y: canvas.height * 0.48, width: 70, height: canvas.height * 0.32 }
    ];

    buildings.forEach(building => {
      ctx.fillRect(building.x, building.y, building.width, building.height);
      
      // Windows (small lights)
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 5; j++) {
          if (Math.random() > 0.7) { // Some windows lit
            ctx.fillStyle = 'hsl(45, 100%, 80%)';
            ctx.fillRect(
              building.x + 10 + i * 20,
              building.y + 20 + j * 15,
              8, 10
            );
          }
        }
      }
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Reset for next building
    });

    // Palm trees
    drawPalmTree(ctx, 400, canvas.height * 0.4);
    drawPalmTree(ctx, canvas.width - 100, canvas.height * 0.45);
  };

  const drawPalmTree = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Tree trunk
    ctx.fillStyle = 'hsl(30, 30%, 20%)';
    ctx.fillRect(x - 8, y, 16, 150);

    // Palm fronds with authentic Caribbean styling
    ctx.strokeStyle = 'hsl(120, 40%, 25%)';
    ctx.lineWidth = 6;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * 60, y + Math.sin(angle) * 60);
      ctx.stroke();
    }
  };

  const renderEnhancedFighter = (ctx: CanvasRenderingContext2D, fighter: any) => {
    // Enhanced fighter rendering with sprite-like visuals and clear faces
    ctx.save();

    // Fighter shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.ellipse(fighter.x + fighter.width / 2, fighter.y + fighter.height + 5, 
                fighter.width / 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Character-specific colors and features
    let primaryColor = 'hsl(30, 60%, 50%)';
    let secondaryColor = 'hsl(30, 60%, 30%)';
    let skinTone = 'hsl(25, 40%, 60%)';
    
    if (fighter.id === 'leroy') {
      primaryColor = 'hsl(180, 100%, 50%)'; // Cyber blue
      secondaryColor = 'hsl(180, 100%, 30%)';
      skinTone = 'hsl(25, 40%, 45%)';
    } else if (fighter.id === 'jordan') {
      primaryColor = 'hsl(270, 100%, 60%)'; // Purple
      secondaryColor = 'hsl(270, 100%, 40%)';
      skinTone = 'hsl(25, 40%, 50%)';
    } else if (fighter.id === 'razor') {
      primaryColor = 'hsl(320, 100%, 60%)'; // Pink
      secondaryColor = 'hsl(320, 100%, 40%)';
      skinTone = 'hsl(35, 30%, 70%)'; // Asian skin tone
    }

    // Head with clear facial features
    ctx.fillStyle = skinTone;
    ctx.fillRect(fighter.x + 15, fighter.y, 40, 35);
    
    // Eyes (always visible)
    ctx.fillStyle = 'white';
    ctx.fillRect(fighter.x + 22, fighter.y + 10, 8, 6); // Left eye
    ctx.fillRect(fighter.x + 35, fighter.y + 10, 8, 6); // Right eye
    
    // Pupils
    ctx.fillStyle = 'black';
    ctx.fillRect(fighter.x + 24, fighter.y + 12, 4, 2); // Left pupil
    ctx.fillRect(fighter.x + 37, fighter.y + 12, 4, 2); // Right pupil
    
    // Mouth
    ctx.fillStyle = 'hsl(0, 50%, 40%)';
    ctx.fillRect(fighter.x + 28, fighter.y + 22, 12, 3);
    
    // Torso with clothing
    const bodyGradient = ctx.createLinearGradient(fighter.x, fighter.y + 35, 
                                                 fighter.x, fighter.y + 80);
    bodyGradient.addColorStop(0, primaryColor);
    bodyGradient.addColorStop(1, secondaryColor);
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(fighter.x + 10, fighter.y + 35, 50, 45);
    
    // Arms
    ctx.fillStyle = skinTone;
    ctx.fillRect(fighter.x, fighter.y + 40, 15, 30); // Left arm
    ctx.fillRect(fighter.x + 55, fighter.y + 40, 15, 30); // Right arm
    
    // Legs with pants
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(fighter.x + 20, fighter.y + 80, 15, 35); // Left leg
    ctx.fillRect(fighter.x + 35, fighter.y + 80, 15, 35); // Right leg

    // Character-specific details
    if (fighter.id === 'leroy') {
      // Dreadlocks
      ctx.fillStyle = 'hsl(30, 20%, 15%)';
      for (let i = 0; i < 6; i++) {
        ctx.fillRect(fighter.x + 8 + i * 8, fighter.y - 5, 6, 25);
      }
      
      // Cyber eye glow
      ctx.fillStyle = 'hsl(180, 100%, 70%)';
      ctx.fillRect(fighter.x + 35, fighter.y + 10, 8, 6);
      
      // Circuit tattoos on arms
      ctx.strokeStyle = 'hsl(180, 100%, 50%)';
      ctx.lineWidth = 2;
      ctx.strokeRect(fighter.x + 2, fighter.y + 45, 11, 20);
    } else if (fighter.id === 'jordan') {
      // DJ headphones (clearly visible)
      ctx.fillStyle = 'hsl(0, 0%, 10%)';
      ctx.fillRect(fighter.x + 8, fighter.y - 5, 54, 12);
      
      // Headphone details
      ctx.fillStyle = 'hsl(60, 100%, 50%)';
      ctx.fillRect(fighter.x + 12, fighter.y - 3, 8, 8); // Left speaker
      ctx.fillRect(fighter.x + 50, fighter.y - 3, 8, 8); // Right speaker
      
      // Sound wave aura
      ctx.strokeStyle = 'hsl(270, 100%, 60%)';
      ctx.lineWidth = 2;
      for (let i = 1; i <= 2; i++) {
        ctx.beginPath();
        ctx.arc(fighter.x + fighter.width / 2, fighter.y + 20, i * 20, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (fighter.id === 'razor') {
      // Katana on back
      ctx.strokeStyle = 'hsl(0, 0%, 80%)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(fighter.x + 60, fighter.y + 20);
      ctx.lineTo(fighter.x + 65, fighter.y + 60);
      ctx.stroke();
      
      // Hair
      ctx.fillStyle = 'hsl(0, 0%, 5%)';
      ctx.fillRect(fighter.x + 18, fighter.y - 2, 34, 15);
    }

    // Health-based visual effects
    if (fighter.health < 30) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      ctx.fillRect(fighter.x - 5, fighter.y - 5, fighter.width + 10, fighter.height + 10);
    }

    ctx.restore();
  };

  const renderProfessionalUI = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Professional HUD with Jamaican styling
    
    // Health bars with authentic styling
    const healthBarWidth = 300;
    const healthBarHeight = 20;
    const healthBarY = 30;

    // Player 1 health bar (left side)
    if (gameState.fighters.player1) {
      const healthPercent = gameState.fighters.player1.health / 100;
      
      // Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(20, healthBarY, healthBarWidth, healthBarHeight);
      
      // Health fill with gradient
      const healthGradient = ctx.createLinearGradient(20, healthBarY, 20 + healthBarWidth, healthBarY);
      healthGradient.addColorStop(0, 'hsl(120, 100%, 50%)');
      healthGradient.addColorStop(0.5, 'hsl(60, 100%, 50%)');
      healthGradient.addColorStop(1, 'hsl(0, 100%, 50%)');
      
      ctx.fillStyle = healthGradient;
      ctx.fillRect(20, healthBarY, healthBarWidth * healthPercent, healthBarHeight);
      
      // Border
      ctx.strokeStyle = 'hsl(45, 100%, 50%)';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, healthBarY, healthBarWidth, healthBarHeight);
      
      // Player name
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(gameState.fighters.player1.name, 20, healthBarY - 5);
    }

    // Player 2 health bar (right side)
    if (gameState.fighters.player2) {
      const healthPercent = gameState.fighters.player2.health / 100;
      const player2X = canvas.width - 20 - healthBarWidth;
      
      // Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(player2X, healthBarY, healthBarWidth, healthBarHeight);
      
      // Health fill (reversed for player 2)
      const healthGradient = ctx.createLinearGradient(player2X + healthBarWidth, healthBarY, player2X, healthBarY);
      healthGradient.addColorStop(0, 'hsl(120, 100%, 50%)');
      healthGradient.addColorStop(0.5, 'hsl(60, 100%, 50%)');
      healthGradient.addColorStop(1, 'hsl(0, 100%, 50%)');
      
      ctx.fillStyle = healthGradient;
      ctx.fillRect(player2X + healthBarWidth * (1 - healthPercent), healthBarY, 
                   healthBarWidth * healthPercent, healthBarHeight);
      
      // Border
      ctx.strokeStyle = 'hsl(45, 100%, 50%)';
      ctx.lineWidth = 2;
      ctx.strokeRect(player2X, healthBarY, healthBarWidth, healthBarHeight);
      
      // Player name (right aligned)
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(gameState.fighters.player2.name, canvas.width - 20, healthBarY - 5);
    }

    // Timer with Jamaican styling
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(canvas.width / 2 - 50, 20, 100, 40);
    
    ctx.strokeStyle = 'hsl(45, 100%, 50%)';
    ctx.lineWidth = 3;
    ctx.strokeRect(canvas.width / 2 - 50, 20, 100, 40);
    
    ctx.fillStyle = gameState.timer < 20 ? 'hsl(0, 100%, 50%)' : 'hsl(45, 100%, 50%)';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(Math.ceil(gameState.timer).toString(), canvas.width / 2, 45);

    // Round indicator
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`ROUND ${gameState.round}`, canvas.width / 2, 75);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Professional Game Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        style={{ 
          imageRendering: 'pixelated',
          filter: 'contrast(1.1) saturate(1.2)'
        }}
      />

      {/* Enhanced Mobile Controls */}
      <EnhancedMobileControls 
        onTouch={handleMobileTouch}
        onGesture={(gesture) => {
          // Enhanced gesture handling for mobile
          switch (gesture) {
            case 'swipe-left':
              handleMobileTouch('left', true);
              setTimeout(() => handleMobileTouch('left', false), 100);
              break;
            case 'swipe-right':
              handleMobileTouch('right', true);
              setTimeout(() => handleMobileTouch('right', false), 100);
              break;
            case 'swipe-up':
              handleMobileTouch('up', true);
              setTimeout(() => handleMobileTouch('up', false), 100);
              break;
            case 'tap':
              handleMobileTouch('punch', true);
              setTimeout(() => handleMobileTouch('punch', false), 100);
              break;
            case 'double-tap':
              handleMobileTouch('kick', true);
              setTimeout(() => handleMobileTouch('kick', false), 100);
              break;
            case 'hold':
              handleMobileTouch('block', true);
              setTimeout(() => handleMobileTouch('block', false), 500);
              break;
          }
        }}
      />

      {/* Advanced Audio Mixer */}
      <AdvancedAudioMixer
        onVolumeChange={(volume) => {
          audioManager.updateSettings({ masterVolume: volume * 100 });
        }}
        onTrackChange={(track) => {
          console.log('Switching to track:', track.name);
          // In a real implementation, this would change the background music
        }}
      />

      {/* Epic Trailer Creator */}
      <EpicTrailerCreator />

      {/* Debug Panel (Development only) */}
      {showDebug && (
        <div className="absolute top-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs space-y-2 font-mono">
          <div className="flex justify-between">
            <span>Screen:</span>
            <span className="text-green-400">{gameState.screen}</span>
          </div>
          <div className="flex justify-between">
            <span>Audio:</span>
            <span className={audioManager.isLoaded ? 'text-green-400' : 'text-red-400'}>
              {audioManager.isLoaded ? 'Loaded' : 'Loading...'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>FPS:</span>
            <span className="text-blue-400">60</span>
          </div>
          {gameState.fighters.player1 && (
            <div className="space-y-1">
              <div>P1: {gameState.fighters.player1.health}HP</div>
              <div>State: {gameState.fighters.player1.state.current}</div>
            </div>
          )}
        </div>
      )}

      {/* Debug Toggle (Development) */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded text-xs"
      >
        DEBUG
      </button>
    </div>
  );
};

// Export the main component
export default ProfessionalGameCanvas;