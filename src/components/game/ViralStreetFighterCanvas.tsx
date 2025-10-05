import React, { useRef, useEffect, useCallback } from 'react';
import { useEnhancedGameEngine } from '@/hooks/useEnhancedGameEngine';
// Audio system removed to eliminate all audio/bell sounds
import { useVisualEffects } from '@/hooks/useVisualEffects';
import { useFighterSprites } from '@/hooks/useFighterSprites';
import { renderAuthenticFighter } from './ScaledAuthenticFighter';
import { MobileControls } from '@/components/ui/MobileControls';
import { useIsMobile } from '@/hooks/use-mobile';
import { renderProfessionalArena } from './ProfessionalArenaRenderer';
import { renderProfessionalHealthBars, renderFighterNames } from './ProfessionalUIRenderer';
import { 
  renderMotionBlur, 
  renderSpeedLines, 
  renderImpactWave,
  renderComboCounter 
} from '@/utils/visualEffects';

interface ViralStreetFighterCanvasProps {
  fighterData?: {
    player1: any;
    player2: any;
  };
}

// Map fighter state to sprite animation name
const mapFighterStateToAnimation = (state: string): string => {
  const stateMap: Record<string, string> = {
    idle: 'idle',
    walking: 'walking',
    running: 'walking',
    jumping: 'jumping',
    crouching: 'crouching',
    attacking: 'lightPunch',
    lightPunch: 'lightPunch',
    mediumPunch: 'mediumPunch',
    heavyPunch: 'heavyPunch',
    lightKick: 'lightKick',
    mediumKick: 'mediumKick',
    heavyKick: 'heavyKick',
    blocking: 'blocking',
    hit: 'hit',
    special: 'special',
  };
  return stateMap[state] || 'idle';
};

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
  
  // Sprite loading system - NOW LOADS REAL PIXEL ART
  const { isLoaded: spritesLoaded, getSpriteData, getAnimationController } = useFighterSprites();

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const gameStateRef = useRef(gameState);
  
  // ✅ FIXED: Update ref when gameState changes
  useEffect(() => {
    gameStateRef.current = gameState;
    
    // 🐛 DEBUG: Log render state updates every 60 frames
    if (frameCountRef.current % 60 === 0 && gameState.fighters.player1 && gameState.fighters.player2) {
      console.log(`🎨 Render sees positions:`, {
        p1_x: gameState.fighters.player1.x.toFixed(0),
        p2_x: gameState.fighters.player2.x.toFixed(0)
      });
    }
  }, [gameState]);
  
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    frameCountRef.current++;
    const now = Date.now();
    const deltaTime = now - lastTimeRef.current;
    lastTimeRef.current = now;
    
    // ✅ FIXED: Use ref to get latest state without recreating render callback
    const currentGameState = gameStateRef.current;
    
    // Update visual effects
    updateEffects(deltaTime);
    
    // Apply screen shake
    const shake = getShakeOffset();
    ctx.save();
    ctx.translate(shake.x, shake.y);
    
    // 1. DRAW ARENA BACKGROUND
    renderProfessionalArena(ctx, 1024, 576);
    
    // 2. DRAW DEBUG RECTANGLES (temporary - to verify positioning)
    if (currentGameState.fighters.player1 && currentGameState.fighters.player2) {
      // P1 debug rectangle (blue)
      ctx.fillStyle = 'rgba(0, 100, 255, 0.3)';
      ctx.fillRect(
        currentGameState.fighters.player1.x,
        currentGameState.fighters.player1.y,
        currentGameState.fighters.player1.width,
        currentGameState.fighters.player1.height
      );
      
      // P2 debug rectangle (red)
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fillRect(
        currentGameState.fighters.player2.x,
        currentGameState.fighters.player2.y,
        currentGameState.fighters.player2.width,
        currentGameState.fighters.player2.height
      );
      
      // Ground line
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 456);
      ctx.lineTo(1024, 456);
      ctx.stroke();
    }
    
    // 3. DRAW FIGHTERS WITH PROCEDURAL GEOMETRIC ANIMATION + VISUAL EFFECTS
    const p1 = currentGameState.fighters.player1;
    const p2 = currentGameState.fighters.player2;
    
    if (p1 && p2) {
      // Add motion blur for fast-moving fighters
      const p1Speed = Math.sqrt((p1.velocityX || 0) ** 2 + (p1.velocityY || 0) ** 2);
      const p2Speed = Math.sqrt((p2.velocityX || 0) ** 2 + (p2.velocityY || 0) ** 2);
      
      if (p1Speed > 3) {
        renderMotionBlur(ctx, {
          x: p1.x,
          y: p1.y,
          velocityX: p1.velocityX || 0,
          velocityY: p1.velocityY || 0,
          intensity: 0.6
        });
      }
      
      if (p2Speed > 3) {
        renderMotionBlur(ctx, {
          x: p2.x,
          y: p2.y,
          velocityX: p2.velocityX || 0,
          velocityY: p2.velocityY || 0,
          intensity: 0.6
        });
      }
      
      // Add speed lines during attacks
      if (p1.state.current === 'attacking') {
        renderSpeedLines(ctx, p1.x + p1.width/2, p1.y + p1.height/2, p1.facing, 1.2);
      }
      if (p2.state.current === 'attacking') {
        renderSpeedLines(ctx, p2.x + p2.width/2, p2.y + p2.height/2, p2.facing, 1.2);
      }
      
      // Update and render fighters with PIXEL ART SPRITES
      const p1Controller = getAnimationController?.(p1.id);
      const p2Controller = getAnimationController?.(p2.id);
      
      // Update animation controllers based on fighter state
      if (p1Controller) {
        const animState = mapFighterStateToAnimation(p1.state.current);
        p1Controller.setAnimation(animState);
        p1Controller.update();
      }
      
      if (p2Controller) {
        const animState = mapFighterStateToAnimation(p2.state.current);
        p2Controller.setAnimation(animState);
        p2Controller.update();
      }

      // Get current animation frames
      const p1Frame = p1Controller?.getCurrentFrame();
      const p2Frame = p2Controller?.getCurrentFrame();
      
      // Render fighters with sprite frames
      renderAuthenticFighter({
        ctx,
        fighter: p1,
        spriteImage: p1Frame?.image || getSpriteData?.(p1.id)
      });
      
      renderAuthenticFighter({
        ctx,
        fighter: p2,
        spriteImage: p2Frame?.image || getSpriteData?.(p2.id)
      });
      
      // Add combo counter display above fighters
      if (p1.comboCount && p1.comboCount > 1) {
        renderComboCounter(ctx, p1.x + p1.width/2, p1.y - 60, p1.comboCount, 1);
      }
      if (p2.comboCount && p2.comboCount > 1) {
        renderComboCounter(ctx, p2.x + p2.width/2, p2.y - 60, p2.comboCount, 1);
      }
    }
    
    ctx.restore();
    
    // 4. DRAW UI ELEMENTS (no screen shake)
    if (currentGameState.fighters.player1 && currentGameState.fighters.player2) {
      renderProfessionalHealthBars(ctx, 1024, currentGameState.fighters);
      renderFighterNames(ctx, 1024, currentGameState.fighters);
    }
    
    // 5. DRAW VISUAL EFFECTS
    drawHitSparks(ctx);
    
    // 6. FPS COUNTER (debug)
    ctx.fillStyle = '#00FF00';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    const fps = deltaTime > 0 ? Math.round(1000 / deltaTime) : 0;
    ctx.fillText(`FPS: ${fps}`, 10, 20);
    
  }, [getSpriteData, getShakeOffset, updateEffects, drawHitSparks]); // ✅ FIXED: Removed gameState dependency

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