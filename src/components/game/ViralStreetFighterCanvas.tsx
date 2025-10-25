import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useEnhancedGameEngine } from '@/hooks/useEnhancedGameEngine';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useVisualEffects } from '@/hooks/useVisualEffects';
import { useFighterSprites } from '@/hooks/useFighterSprites';
import { useColorGrading } from '@/hooks/useColorGrading';
import { renderAuthenticFighter } from './ScaledAuthenticFighter';
import { MobileControls } from '@/components/ui/MobileControls';
import { useIsMobile } from '@/hooks/use-mobile';
import { KingstonStageBackground } from './KingstonStageBackground';
import { renderLate70sKingstonStage } from './Late70sKingstonStage';
import { renderProfessionalHealthBars, renderFighterNames } from './ProfessionalUIRenderer';
import { ControlDisplay } from './ControlDisplay';
import { FocusPrompt } from './FocusPrompt';
import { VoiceLineDisplay } from '@/components/ui/VoiceLineDisplay';
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
  stage?: {
    name: string;
    background: string;
    music: string;
  };
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  isRecording?: boolean;
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
  fighterData,
  stage,
  canvasRef: externalCanvasRef,
  isRecording = false
}) => {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const initializationRef = useRef(false);
  const [showPrompt, setShowPrompt] = useState(false); // Auto-start - no prompt needed
  const [activeVoiceLine, setActiveVoiceLine] = useState<{ player: 1 | 2; text: string } | null>(null);
  
  const { 
    gameState, 
    handleMobileInput,
    streetFighterCombat,
    initializeFighters
  } = useEnhancedGameEngine(fighterData);

  // Single initialization to prevent loops - FIXED DEPENDENCIES
  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = true;
      initializeFighters();
    }
  }, []); // Empty dependency array - initialize only once on mount
  
  const audioManager = useAudioManager();
  const visualEffectsHook = useVisualEffects();
  const { 
    addScreenShake, 
    addHitSpark, 
    drawHitSparks,
    getShakeOffset,
    updateEffects,
    drawProjectileTrail,
    applyCinematicEffects
  } = visualEffectsHook;
  const { applyColorGrading, grading } = useColorGrading();
  
  // Auto-play Shaw Bros intro, THEN Champion loop (no overlap)
  useEffect(() => {
    if (audioManager.isLoaded && audioManager.playIntroThenGameplay) {
      audioManager.playIntroThenGameplay();
    }
    
    // ✅ CLEANUP: Stop audio when component unmounts
    return () => {
      if (audioManager.stopAllAudio) {
        audioManager.stopAllAudio();
      }
    };
  }, [audioManager.isLoaded, audioManager.playIntroThenGameplay, audioManager.stopAllAudio]);
  
  // Sprite loading system - NOW LOADS REAL PIXEL ART
  const { isLoaded: spritesLoaded, getSpriteData, getAnimationFrame } = useFighterSprites();
  
  // Debug sprite loading
  useEffect(() => {
    console.log('🎨 Sprite System Status:', { spritesLoaded });
  }, [spritesLoaded]);

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
    
    // PHASE 3: Clear canvas and reset state between frames
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
    ctx.filter = 'none';
    
    // Marvel Rivals-style dynamic lighting during special moves
    const renderDynamicLighting = () => {
      const p1 = currentGameState.fighters.player1;
      const p2 = currentGameState.fighters.player2;
      if (p1?.state.current === 'special' || p2?.state.current === 'special') {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };
    
    // Update visual effects
    updateEffects(deltaTime);
    
    // Apply screen shake
    const shake = getShakeOffset();
    ctx.save();
    ctx.translate(shake.x, shake.y);
    
    // 1. RENDER AUTHENTIC 1970s KINGSTON STAGE BACKGROUND
    renderLate70sKingstonStage(ctx, frameCountRef.current, shake);
    
    // DYNAMIC LIGHTING LAYER
    renderDynamicLighting();
    
    // PHASE 7: Draw projectile trails
    currentGameState.projectiles.forEach((projectile: any) => {
      drawProjectileTrail(ctx, projectile);
    });
    
    // 3. DRAW FIGHTERS WITH PIXEL ART SPRITES + STREET FIGHTER EFFECTS
    const p1 = currentGameState.fighters.player1;
    const p2 = currentGameState.fighters.player2;
    
    if (p1 && p2) {
      if (frameCountRef.current % 60 === 0) {
        console.log('🖼️ RENDER:', {
          p1: { x: Math.round(p1.x), y: Math.round(p1.y), state: p1.state.current },
          p2: { x: Math.round(p2.x), y: Math.round(p2.y), state: p2.state.current }
        });
      }
      
      // Calculate speeds for effects
      const p1Speed = Math.sqrt((p1.velocityX || 0) ** 2 + (p1.velocityY || 0) ** 2);
      const p2Speed = Math.sqrt((p2.velocityX || 0) ** 2 + (p2.velocityY || 0) ** 2);
      
      // Motion blur trails for fast movement (reduced during recording)
      if (!isRecording && p1Speed > 3) {
        renderMotionBlur(ctx, {
          x: p1.x,
          y: p1.y,
          velocityX: p1.velocityX || 0,
          velocityY: p1.velocityY || 0,
          intensity: 0.6
        });
      }
      
      if (!isRecording && p2Speed > 3) {
        renderMotionBlur(ctx, {
          x: p2.x,
          y: p2.y,
          velocityX: p2.velocityX || 0,
          velocityY: p2.velocityY || 0,
          intensity: 0.6
        });
      }
      
      // Speed lines during attacks (reduced during recording)
      if (p1.state.current === 'attacking' && p1.state.timer && p1.state.timer < 10) {
        renderSpeedLines(ctx, p1.x + p1.width/2, p1.y + p1.height/2, p1.facing, 1.5);
        
        // Ghost trail for heavy attacks (only 1 ghost during recording)
        const ghostCount = isRecording ? 1 : 3;
        for (let i = 1; i <= ghostCount; i++) {
          const p1SpriteGhost = getSpriteData(fighterData?.player1?.id || '');
          renderAuthenticFighter({
            ctx,
            fighter: { ...p1, x: p1.x - (p1.facing === 'right' ? i*15 : -i*15) },
            spriteImage: p1SpriteGhost,
            effects: { alpha: 0.3 - (i * 0.08) }
          });
        }
      }
      
      if (p2.state.current === 'attacking' && p2.state.timer && p2.state.timer < 10) {
        renderSpeedLines(ctx, p2.x + p2.width/2, p2.y + p2.height/2, p2.facing, 1.5);
        
        // Ghost trail for heavy attacks (only 1 ghost during recording)
        const ghostCount = isRecording ? 1 : 3;
        for (let i = 1; i <= ghostCount; i++) {
          const p2SpriteGhost = getSpriteData(fighterData?.player2?.id || '');
          renderAuthenticFighter({
            ctx,
            fighter: { ...p2, x: p2.x - (p2.facing === 'right' ? i*15 : -i*15) },
            spriteImage: p2SpriteGhost,
            effects: { alpha: 0.3 - (i * 0.08) }
          });
        }
      }
      
      // Get animation state mapping
      const getAnimationName = (state: string, fighter: any): string => {
        const stateMap: Record<string, string> = {
          idle: 'idle',
          walking: 'walking',
          attacking: fighter.animation?.currentMove?.toLowerCase().includes('kick') ? 'heavyKick' : 'mediumPunch',
          blocking: 'blocking',
          hurt: 'hurt',
          knockdown: 'knockdown',
          special: 'special',
          victory: 'victory'
        };
        return stateMap[state] || 'idle';
      };
      
      // Calculate frame coordinates for both fighters
      const p1AnimName = getAnimationName(p1.state?.current || 'idle', p1);
      const p2AnimName = getAnimationName(p2.state?.current || 'idle', p2);
      const p1FrameIndex = Math.floor((p1.animation?.frameTimer || 0) / 5);
      const p2FrameIndex = Math.floor((p2.animation?.frameTimer || 0) / 5);
      const p1FrameCoords = getAnimationFrame(fighterData?.player1?.id || '', p1AnimName, p1FrameIndex);
      const p2FrameCoords = getAnimationFrame(fighterData?.player2?.id || '', p2AnimName, p2FrameIndex);
      
      // RENDER FIGHTERS WITH PIXEL ART SPRITES
      const p1SpriteImage = getSpriteData(fighterData?.player1?.id || '');
      const p1HasValidSprite = p1SpriteImage && p1SpriteImage.complete && p1SpriteImage.naturalWidth > 0;
      renderAuthenticFighter({
        ctx,
        fighter: p1,
        spriteImage: p1HasValidSprite ? p1SpriteImage : null,
        frameCoords: p1HasValidSprite && p1FrameCoords ? p1FrameCoords : null,
        effects: {
          alpha: p1.state.current === 'stunned' ? 0.7 : 1,
          glow: p1.state.current === 'special',
          flash: p1.state.current === 'hurt',
          special: p1.state.current === 'special'
        }
      });
      
      const p2SpriteImage = getSpriteData(fighterData?.player2?.id || '');
      const p2HasValidSprite = p2SpriteImage && p2SpriteImage.complete && p2SpriteImage.naturalWidth > 0;
      renderAuthenticFighter({
        ctx,
        fighter: p2,
        spriteImage: p2HasValidSprite ? p2SpriteImage : null,
        frameCoords: p2HasValidSprite && p2FrameCoords ? p2FrameCoords : null,
        effects: {
          alpha: p2.state.current === 'stunned' ? 0.7 : 1,
          glow: p2.state.current === 'special',
          flash: p2.state.current === 'hurt',
          special: p2.state.current === 'special'
        }
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
    
    // PHASE 7: Draw projectiles with enhanced rendering
    currentGameState.projectiles.forEach((projectile: any) => {
      const { renderStreetFighterProjectile } = require('@/components/game/StreetFighterProjectiles');
      renderStreetFighterProjectile({
        ctx,
        projectile,
        effects: { glow: true, trail: true }
      });
    });
    
    // 5. DRAW VISUAL EFFECTS
    drawHitSparks(ctx);
    
    // Apply cinematic effects for super moves
    if (p1?.state.current === 'special' && p1.state.timer && p1.state.timer < 15) {
      applyCinematicEffects(ctx, canvas.width, canvas.height, 'freeze', {
        x: p1.x + p1.width / 2,
        y: p1.y + p1.height / 2,
        scale: 1.4,
        intensity: 0.8
      });
    }
    if (p2?.state.current === 'special' && p2.state.timer && p2.state.timer < 15) {
      applyCinematicEffects(ctx, canvas.width, canvas.height, 'freeze', {
        x: p2.x + p2.width / 2,
        y: p2.y + p2.height / 2,
        scale: 1.4,
        intensity: 0.8
      });
    }
    
    // Apply color grading to entire canvas
    if (grading.intensity > 0) {
      applyColorGrading(ctx, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
    }
    
    // 6. FPS COUNTER (debug)
    ctx.fillStyle = '#00FF00';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    const fps = deltaTime > 0 ? Math.round(1000 / deltaTime) : 0;
    ctx.fillText(`FPS: ${fps}`, 10, 20);
    
  }, [getSpriteData, getAnimationFrame, getShakeOffset, updateEffects, drawHitSparks, fighterData, isRecording]);

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

  // Combat event handlers with voice line integration
  useEffect(() => {
    const handleCombatEvent = (event: any) => {
      switch (event.type) {
        case 'hit':
          addScreenShake(5, 200);
          addHitSpark(event.x || 400, event.y || 300, 'impact');
          break;
        case 'special':
          addScreenShake(8, 300);
          // Trigger voice line for special move
          if (event.player && event.voiceLine) {
            setActiveVoiceLine({ player: event.player, text: event.voiceLine });
          }
          break;
        case 'super':
          addScreenShake(12, 500);
          // Trigger voice line for super move
          if (event.player && event.voiceLine) {
            setActiveVoiceLine({ player: event.player, text: event.voiceLine });
          }
          break;
      }
    };

    window.addEventListener('streetfighter-event', handleCombatEvent);
    
    return () => {
      window.removeEventListener('streetfighter-event', handleCombatEvent);
    };
  }, [addScreenShake, addHitSpark]);

  // Setup canvas with DPI scaling and auto-focus for keyboard
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
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
    
    // IMMEDIATELY focus for keyboard input - no delay
    if (container) {
      setTimeout(() => container.focus(), 100);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-black outline-none"
      tabIndex={0}
    >
      {showPrompt && <FocusPrompt onDismiss={() => setShowPrompt(false)} />}
      
      {/* Dynamic arena background */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ width: '1024px', height: '576px' }}>
        {stage?.background ? (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${stage.background})`,
              filter: 'brightness(0.7) contrast(1.2)'
            }}
          />
        ) : (
          <KingstonStageBackground 
            variant="alley" 
            className="absolute inset-0"
          />
        )}
      </div>
      
      {/* Game canvas with transparent background */}
      <canvas
        ref={canvasRef}
        className="relative z-10 border border-yellow-400 rounded-lg shadow-2xl"
        style={{ 
          width: '1024px',
          height: '576px',
          background: 'transparent'
        }}
      />
      
      {!isMobile && <ControlDisplay />}
      
      {isMobile && gameState.fighters.player1 && gameState.fighters.player2 && (
        <MobileControls
          onTouch={(action, pressed) => {
            handleMobileInput(1, action, pressed);
          }}
        />
      )}
      
      {/* Voice Line Display */}
      {activeVoiceLine && (
        <VoiceLineDisplay
          text={activeVoiceLine.text}
          player={activeVoiceLine.player}
          onComplete={() => setActiveVoiceLine(null)}
        />
      )}
      
      {/* PHASE 3: Real-Time Debug Panel */}
      <div className="absolute top-4 right-4 bg-black/90 text-green-400 p-4 font-mono text-xs border border-yellow-400">
        <div className="font-bold mb-2">🎮 DEBUG PANEL</div>
        <div>Game Loop: {gameState.screen === 'fighting' ? '✓ RUNNING' : '✗ STOPPED'}</div>
        <div>P1: x={gameState.fighters.player1?.x.toFixed(0)} y={gameState.fighters.player1?.y.toFixed(0)}</div>
        <div>P1 State: {gameState.fighters.player1?.state.current}</div>
        <div>P1 Health: {gameState.fighters.player1?.health}</div>
        <div>P2: x={gameState.fighters.player2?.x.toFixed(0)} y={gameState.fighters.player2?.y.toFixed(0)}</div>
        <div>P2 State: {gameState.fighters.player2?.state.current}</div>
        <div>P2 Health: {gameState.fighters.player2?.health}</div>
        <div>Audio: {audioManager.isLoaded ? '✓' : '✗'}</div>
      </div>
    </div>
  );
};