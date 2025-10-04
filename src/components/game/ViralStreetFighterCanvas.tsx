import React, { useRef, useEffect, useCallback } from 'react';
import { useEnhancedGameEngine } from '@/hooks/useEnhancedGameEngine';
// Audio system removed to eliminate all audio/bell sounds
import { useVisualEffects } from '@/hooks/useVisualEffects';
import { useFighterSprites } from '@/hooks/useFighterSprites';
import { renderAuthenticFighter } from './AuthenticFighterRenderer';
import { MobileControls } from '@/components/ui/MobileControls';
import { useIsMobile } from '@/hooks/use-mobile';
import { renderProfessionalArena } from './ProfessionalArenaRenderer';
import { renderProfessionalHealthBars, renderFighterNames } from './ProfessionalUIRenderer';

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
  const initializationRef = useRef(false);
  
  const { 
    gameState, 
    handleMobileInput,
    streetFighterCombat,
    initializeFighters
  } = useEnhancedGameEngine();

  // Single initialization to prevent loops - FIXED DEPENDENCIES
  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = true;
      initializeFighters();
    }
  }, []); // Empty dependency array - initialize only once on mount
  
  // Audio system removed to eliminate all audio/bell sounds
  const { 
    addScreenShake, 
    addHitSpark, 
    drawHitSparks,
    getShakeOffset,
    updateEffects 
  } = useVisualEffects();
  
  // Sprite loading system
  const { isLoaded: spritesLoaded, getSpriteData } = useFighterSprites();

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    frameCountRef.current++;
    const now = Date.now();
    const deltaTime = now - lastTimeRef.current;
    lastTimeRef.current = now;
    
    // Update visual effects
    updateEffects(deltaTime);
    
    // Apply screen shake
    const shake = getShakeOffset();
    ctx.save();
    ctx.translate(shake.x, shake.y);
    
    // 1. DRAW ARENA BACKGROUND
    renderProfessionalArena(ctx, 1024, 576);
    
    // 2. DRAW DEBUG RECTANGLES (temporary - to verify positioning)
    if (gameState.fighters.player1 && gameState.fighters.player2) {
      // P1 debug rectangle (blue)
      ctx.fillStyle = 'rgba(0, 100, 255, 0.3)';
      ctx.fillRect(
        gameState.fighters.player1.x,
        gameState.fighters.player1.y,
        gameState.fighters.player1.width,
        gameState.fighters.player1.height
      );
      
      // P2 debug rectangle (red)
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fillRect(
        gameState.fighters.player2.x,
        gameState.fighters.player2.y,
        gameState.fighters.player2.width,
        gameState.fighters.player2.height
      );
      
      // Ground line
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 456);
      ctx.lineTo(1024, 456);
      ctx.stroke();
    }
    
    // 3. DRAW FIGHTERS WITH PROCEDURAL GEOMETRIC ANIMATION
    if (gameState.fighters.player1) {
      renderAuthenticFighter({
        ctx,
        fighter: gameState.fighters.player1,
        spriteImage: null
      });
    }
    
    if (gameState.fighters.player2) {
      renderAuthenticFighter({
        ctx,
        fighter: gameState.fighters.player2,
        spriteImage: null
      });
    }
    
    ctx.restore();
    
    // 4. DRAW UI ELEMENTS (no screen shake)
    if (gameState.fighters.player1 && gameState.fighters.player2) {
      renderProfessionalHealthBars(ctx, 1024, gameState.fighters);
      renderFighterNames(ctx, 1024, gameState.fighters);
    }
    
    // 5. DRAW VISUAL EFFECTS
    drawHitSparks(ctx);
    
    // 6. FPS COUNTER (debug)
    ctx.fillStyle = '#00FF00';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    const fps = deltaTime > 0 ? Math.round(1000 / deltaTime) : 0;
    ctx.fillText(`FPS: ${fps}`, 10, 20);
    
  }, [gameState, getSpriteData, getShakeOffset, updateEffects, drawHitSparks]);

  // Animation loop
  useEffect(() => {
    console.log('🚀 Starting game rendering loop');
    let animationId: number;
    
    const animate = () => {
      render();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      console.log('🛑 Stopping game rendering loop');
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [render]);

  // Combat event handlers - BELL ELIMINATION: Audio disabled
  useEffect(() => {
    const handleCombatEvent = (event: any) => {
      switch (event.type) {
        case 'hit':
          addScreenShake(5, 200);
          addHitSpark(event.x || 400, event.y || 300, 'impact');
          // BELL ELIMINATION: processAudioEvent disabled
          console.log('Combat audio disabled to prevent bell sounds');
          break;
        case 'special':
          addScreenShake(8, 300);
          // BELL ELIMINATION: processAudioEvent disabled
          break;
        case 'super':
          addScreenShake(12, 500);
          // BELL ELIMINATION: processAudioEvent disabled
          break;
      }
    };

    // Listen for combat events (simplified for demo)
    window.addEventListener('streetfighter-event', handleCombatEvent);
    
    return () => {
      window.removeEventListener('streetfighter-event', handleCombatEvent);
    };
  }, [addScreenShake, addHitSpark]);

  // Setup canvas with DPI scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.width = 1024 * dpr;
    canvas.height = 576 * dpr;
    
    // Scale all drawing operations by dpr
    ctx.scale(dpr, dpr);
    
    // Set display size (CSS pixels)
    canvas.style.width = '1024px';
    canvas.style.height = '576px';
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        className="border border-yellow-400 rounded-lg shadow-2xl"
        style={{ 
          width: '1024px',
          height: '576px'
        }}
      />
      
      {isMobile && gameState.fighters.player1 && gameState.fighters.player2 && (
        <MobileControls
          onTouch={(action, pressed) => {
            handleMobileInput(1, action, pressed);
          }}
        />
      )}
      
      {/* Debug Status */}
      <div className="absolute top-4 right-4 bg-black/70 text-green-400 px-3 py-2 rounded text-sm font-mono">
        Sprites: {spritesLoaded ? '✓' : '⏳'} | Fighters: {gameState.fighters.player1 && gameState.fighters.player2 ? '✓' : '✗'}
      </div>
    </div>
  );
};