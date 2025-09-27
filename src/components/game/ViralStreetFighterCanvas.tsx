import React, { useRef, useEffect, useCallback } from 'react';
import { useEnhancedGameEngine } from '@/hooks/useEnhancedGameEngine';
import { useEnhancedAudioSystem } from '@/hooks/useEnhancedAudioSystem';
import { useVisualEffects } from '@/hooks/useVisualEffects';
import { useEnhancedSpriteSystem } from '@/hooks/useEnhancedSpriteSystem';
import { MobileControls } from '@/components/ui/MobileControls';
import { useIsMobile } from '@/hooks/use-mobile';

interface ViralStreetFighterCanvasProps {
  fighterData?: {
    player1: any;
    player2: any;
  };
}

export const ViralStreetFighterCanvas: React.FC<ViralStreetFighterCanvasProps> = ({ 
  fighterData 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  
  const { 
    gameState, 
    handleMobileInput,
    streetFighterCombat,
    initializeFighters
  } = useEnhancedGameEngine();

  // Initialize fighters on mount
  useEffect(() => {
    console.log('ViralStreetFighterCanvas: Initializing fighters on mount...');
    initializeFighters();
  }, [initializeFighters]);
  
  const { processAudioEvent } = useEnhancedAudioSystem();
  const { 
    addScreenShake, 
    addHitSpark, 
    drawHitSparks,
    getShakeOffset,
    updateEffects 
  } = useVisualEffects();
  
  const { isLoaded: spritesLoaded, drawEnhancedFighter } = useEnhancedSpriteSystem();

  // Render authentic Street Fighter characters with proper proportions
  const renderStreetFighter = useCallback((
    ctx: CanvasRenderingContext2D,
    fighter: any,
    x: number,
    y: number,
    facing: 'left' | 'right'
  ) => {
    const scale = 3; // Make fighters MASSIVE like Street Fighter
    const width = 128 * scale;
    const height = 96 * scale;
    
    // Street Fighter proportions: Big head, thick body
    ctx.save();
    
    // Apply screen shake
    const shake = getShakeOffset();
    ctx.translate(shake.x, shake.y);
    
    if (facing === 'left') {
      ctx.scale(-1, 1);
      ctx.translate(-x - width, 0);
    }
    
    // Body (thick and muscular)
    ctx.fillStyle = fighter.id === 'leroy' ? '#4A5D23' : '#8B4513';
    ctx.fillRect(x + width * 0.3, y + height * 0.25, width * 0.4, height * 0.6);
    
    // Head (oversized like SF)
    ctx.fillStyle = '#D2B48C';
    ctx.fillRect(x + width * 0.35, y, width * 0.3, height * 0.35);
    
    // Arms (thick)
    ctx.fillStyle = fighter.id === 'leroy' ? '#4A5D23' : '#8B4513';
    ctx.fillRect(x + width * 0.1, y + height * 0.3, width * 0.15, width * 0.4);
    ctx.fillRect(x + width * 0.75, y + height * 0.3, width * 0.15, width * 0.4);
    
    // Legs (powerful stance)
    ctx.fillRect(x + width * 0.32, y + height * 0.75, width * 0.15, height * 0.25);
    ctx.fillRect(x + width * 0.53, y + height * 0.75, width * 0.15, height * 0.25);
    
    // Character-specific details
    if (fighter.id === 'leroy') {
      // Dreadlocks
      ctx.fillStyle = '#2F4F2F';
      ctx.fillRect(x + width * 0.3, y - height * 0.1, width * 0.4, height * 0.15);
    } else if (fighter.id === 'razor') {
      // Mohawk
      ctx.fillStyle = '#FF4500';
      ctx.fillRect(x + width * 0.4, y - height * 0.05, width * 0.2, height * 0.1);
    }
    
    ctx.restore();
  }, [getShakeOffset]);

  // Game render loop with Street Fighter visual effects
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render stage background (Kingston arena)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f0f23');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Stadium lights
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(100, 50, 20, 0, Math.PI * 2);
    ctx.arc(canvas.width - 100, 50, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Debug: Show fighter initialization status
    if (!gameState.fighters.player1 || !gameState.fighters.player2) {
      ctx.fillStyle = '#ff0000';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('FIGHTERS INITIALIZING...', canvas.width / 2, canvas.height / 2);
      ctx.textAlign = 'start';
      console.log('ViralStreetFighterCanvas: Fighters not ready yet', gameState.fighters);
      return;
    }

    console.log('ViralStreetFighterCanvas: Rendering fighters', { 
      player1: { x: gameState.fighters.player1.x, y: gameState.fighters.player1.y, health: gameState.fighters.player1.health },
      player2: { x: gameState.fighters.player2.x, y: gameState.fighters.player2.y, health: gameState.fighters.player2.health }
    });

    // Render fighters with authentic sprites when available, fallback to stylized rendering
    if (spritesLoaded) {
      // Use enhanced sprite rendering when sprites are loaded
      drawEnhancedFighter(ctx, gameState.fighters.player1, Date.now());
      drawEnhancedFighter(ctx, gameState.fighters.player2, Date.now());
    } else {
      renderStreetFighter(
        ctx, 
        gameState.fighters.player1, 
        gameState.fighters.player1.x, 
        gameState.fighters.player1.y,
        gameState.fighters.player1.facing
      );
      renderStreetFighter(
        ctx, 
        gameState.fighters.player2, 
        gameState.fighters.player2.x, 
        gameState.fighters.player2.y,
        gameState.fighters.player2.facing
      );
    }
    
    // Render projectiles (Hadoken-style)
    streetFighterCombat.projectiles.forEach(projectile => {
      ctx.save();
      ctx.fillStyle = projectile.type === 'fireball' ? '#FF4500' : '#00BFFF';
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.width / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Energy trail effect
      ctx.fillStyle = projectile.type === 'fireball' ? '#FF6500' : '#40E0D0';
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(projectile.x - projectile.velocityX * 2, projectile.y, projectile.width * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    
    // Render hit sparks and effects
    drawHitSparks(ctx);
    
    // Health bars (clean design)
    const barWidth = 300;
    const barHeight = 20;
    
    // Player 1 health bar
    ctx.fillStyle = '#333';
    ctx.fillRect(50, 30, barWidth, barHeight);
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(50, 30, (gameState.fighters.player1?.health || 100) / 100 * barWidth, barHeight);
    
    // Player 2 health bar  
    ctx.fillStyle = '#333';
    ctx.fillRect(canvas.width - 350, 30, barWidth, barHeight);
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(canvas.width - 350, 30, (gameState.fighters.player2?.health || 100) / 100 * barWidth, barHeight);
    
    // Fighter names
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('LEROY', 50, 25);
    ctx.fillText('RAZOR', canvas.width - 120, 25);
    
    // Round timer
    ctx.fillStyle = '#FF0000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.ceil(gameState.timer / 60)}`, canvas.width / 2, 40);
    ctx.textAlign = 'start';
    
  }, [gameState, streetFighterCombat, renderStreetFighter, drawHitSparks]);

  // Animation loop
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      updateEffects(16); // 60fps
      render();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [render, updateEffects]);

  // Combat event handlers
  useEffect(() => {
    const handleCombatEvent = (event: any) => {
      switch (event.type) {
        case 'hit':
          addScreenShake(5, 200);
          addHitSpark(event.x || 400, event.y || 300, 'impact');
          processAudioEvent({ type: 'hit', intensity: event.intensity });
          break;
        case 'special':
          addScreenShake(8, 300);
          processAudioEvent({ type: 'special' });
          break;
        case 'super':
          addScreenShake(12, 500);
          processAudioEvent({ type: 'super' });
          break;
      }
    };

    // Listen for combat events (simplified for demo)
    window.addEventListener('streetfighter-event', handleCombatEvent);
    
    return () => {
      window.removeEventListener('streetfighter-event', handleCombatEvent);
    };
  }, [addScreenShake, addHitSpark, processAudioEvent]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        width={1024}
        height={576}
        className="border border-primary rounded-lg shadow-2xl max-w-full max-h-full"
        style={{ 
          imageRendering: 'pixelated',
          aspectRatio: '16/9'
        }}
      />
      
      {isMobile && (
        <MobileControls 
          onTouch={(action, pressed) => handleMobileInput(1, action, pressed)}
        />
      )}
    </div>
  );
};