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

  // PHASE 1: ABSOLUTE MINIMUM RENDERING TEST
  const frameCountRef = useRef(0);
  
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    frameCountRef.current++;
    
    // Log canvas dimensions every 60 frames
    if (frameCountRef.current % 60 === 0) {
      console.log('🎨 PHASE 1 DEBUG:', {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        styleWidth: canvas.style.width,
        styleHeight: canvas.style.height,
        frameCount: frameCountRef.current
      });
    }
    
    // 1. SOLID BACKGROUND - Bright blue to prove something is rendering
    ctx.fillStyle = '#0066FF';
    ctx.fillRect(0, 0, 1024, 576);
    
    // 2. TEST TEXT - Center of screen
    ctx.fillStyle = '#FFFF00';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CANVAS WORKING', 512, 288);
    
    // 3. SINGLE RED RECTANGLE - Center
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(462, 238, 100, 100);
    
    // 4. FPS COUNTER - Top left
    ctx.fillStyle = '#00FF00';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`FRAME: ${frameCountRef.current}`, 20, 40);
    
    // 5. TIMESTAMP - Top left
    ctx.fillText(`TIME: ${Date.now()}`, 20, 70);
    
  }, []);

  // PHASE 1: SIMPLIFIED ANIMATION LOOP - No dependencies on sprites
  useEffect(() => {
    console.log('🚀 PHASE 1: Starting animation loop');
    let animationId: number;
    
    const animate = () => {
      render();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      console.log('🛑 PHASE 1: Stopping animation loop');
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
      
      {/* PHASE 1 DEBUG STATUS */}
      <div className="absolute top-4 right-4 bg-green-500 text-black p-4 rounded font-bold text-xl">
        PHASE 1: TESTING CANVAS
      </div>
    </div>
  );
};