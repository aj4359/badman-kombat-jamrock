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
  const { isLoaded: spritesLoaded, getSprite } = useFighterSprites();

  // Game render loop with Street Fighter visual effects
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas and render professional arena
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderProfessionalArena(ctx, canvas.width, canvas.height);
    
    // AUTHENTIC FALLBACK - Always render something if fighters are missing
    if (!gameState.fighters.player1 || !gameState.fighters.player2) {
      console.log('🔧 AUTHENTIC FALLBACK: Missing fighters, using AuthenticFighterRenderer fallback');
      
      // Create complete temporary fighters for rendering
      const tempP1 = {
        id: 'leroy',
        name: 'Leroy',
        x: 362,
        y: 220,
        width: 150,
        height: 200,
        facing: 'right' as const,
        health: 100,
        maxHealth: 100,
        state: { current: 'idle' as const },
        meter: 0,
        velocityX: 0,
        velocityY: 0,
        grounded: true,
        hitbox: { x: 362, y: 220, width: 150, height: 200 },
        animation: { currentFrame: 0, frameTimer: 0, sequence: 'idle' },
        colors: { primary: 'hsl(180, 100%, 50%)', secondary: 'hsl(180, 100%, 30%)' }
      };
      
      const tempP2 = {
        id: 'jordan', 
        name: 'Jordan',
        x: 582,
        y: 220,
        width: 150,
        height: 200,
        facing: 'left' as const,
        health: 100,
        maxHealth: 100,
        state: { current: 'idle' as const },
        meter: 0,
        velocityX: 0,
        velocityY: 0,
        grounded: true,
        hitbox: { x: 582, y: 220, width: 150, height: 200 },
        animation: { currentFrame: 0, frameTimer: 0, sequence: 'idle' },
        colors: { primary: 'hsl(270, 100%, 60%)', secondary: 'hsl(270, 100%, 40%)' }
      };
      
      // Render using AuthenticFighterRenderer with sprites
      renderAuthenticFighter({
        ctx,
        fighter: tempP1 as any,
        effects: { alpha: 1.0, hueRotation: 0, shake: { x: 0, y: 0 }, glow: false, flash: false, special: false },
        spriteImage: getSprite('leroy')
      });
      
      renderAuthenticFighter({
        ctx,
        fighter: tempP2 as any,
        effects: { alpha: 1.0, hueRotation: 0, shake: { x: 0, y: 0 }, glow: false, flash: false, special: false },
        spriteImage: getSprite('jordan')
      });
      
      // Show debug status but don't dominate screen
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Loading fighters...', canvas.width / 2, 50);
      ctx.textAlign = 'start';
      
      console.log('✅ AUTHENTIC FALLBACK: Rendered detailed fallback fighters');
      return;
    }

    console.log('ViralStreetFighterCanvas: Rendering fighters', { 
      player1: { x: gameState.fighters.player1.x, y: gameState.fighters.player1.y, health: gameState.fighters.player1.health },
      player2: { x: gameState.fighters.player2.x, y: gameState.fighters.player2.y, health: gameState.fighters.player2.health }
    });

    // Render fighters with enhanced logging and debugging
    console.log('ViralStreetFighterCanvas: About to render fighters', { 
      player1Pos: { x: gameState.fighters.player1.x, y: gameState.fighters.player1.y },
      player2Pos: { x: gameState.fighters.player2.x, y: gameState.fighters.player2.y }
    });
    
    // PHASE 2: RENDER AUTHENTIC FIGHTERS using AuthenticFighterRenderer
    const p1 = gameState.fighters.player1;
    const p2 = gameState.fighters.player2;
    
    // Render Player 1 with sprite or fallback
    const p1Sprite = getSprite(p1.id);
    renderAuthenticFighter({
      ctx,
      fighter: p1,
      effects: {
        alpha: 1.0,
        hueRotation: 0,
        shake: getShakeOffset(),
        glow: false,
        flash: false,
        special: p1.state.current === 'special'
      },
      spriteImage: p1Sprite
    });
    
    // Render Player 2 with sprite or fallback
    const p2Sprite = getSprite(p2.id);
    renderAuthenticFighter({
      ctx,
      fighter: p2,
      effects: {
        alpha: 1.0,
        hueRotation: 0,
        shake: getShakeOffset(),
        glow: false,
        flash: false,
        special: p2.state.current === 'special'
      },
      spriteImage: p2Sprite
    });
    
    console.log('✅ PHASE 2: Rendering BRIGHT fighters:', { 
      p1: { x: p1.x, y: p1.y, health: p1.health },
      p2: { x: p2.x, y: p2.y, health: p2.health }
    });
    
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
    
    // Professional UI elements
    renderProfessionalHealthBars(ctx, canvas.width, gameState.fighters);
    renderFighterNames(ctx, canvas.width, gameState.fighters);
    
  }, [gameState, streetFighterCombat, drawHitSparks, getShakeOffset, getSprite]);

  // Animation loop - only run when sprites are loaded
  useEffect(() => {
    if (!spritesLoaded) {
      console.log('⏳ Waiting for sprites to load...');
      return;
    }

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
  }, [render, updateEffects, spritesLoaded]);

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
      {!spritesLoaded ? (
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading Sprites...
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className="border border-primary rounded-lg shadow-2xl max-w-full max-h-full"
            style={{ 
              imageRendering: 'crisp-edges',
              aspectRatio: '16/9'
            }}
          />
          
          {/* Debug Panel - Remove this once fighters are working */}
          <div className="absolute top-4 left-4 bg-black/90 text-white p-3 rounded border border-gray-600 text-sm font-mono">
            <div className="mb-2 text-yellow-400">DEBUG PANEL</div>
            <div>Fighters: {gameState.fighters?.player1 ? '✓' : '✗'} P1, {gameState.fighters?.player2 ? '✓' : '✗'} P2</div>
            <div>Sprites: ✓ Loaded ({spritesLoaded ? 'Ready' : 'Loading...'})</div>
            <div>Game State: {gameState.screen}</div>
            <div className="text-xs mt-1">
              Initialization: {initializationRef.current ? '✅ DONE' : '⏳ PENDING'}
            </div>
          </div>
          
          {isMobile && (
            <MobileControls 
              onTouch={(action, pressed) => handleMobileInput(1, action, pressed)}
            />
          )}
        </>
      )}
    </div>
  );
};