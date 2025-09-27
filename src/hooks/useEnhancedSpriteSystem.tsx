import { useState, useEffect, useRef, useCallback } from 'react';
import { Fighter } from '@/types/gameTypes';

// Import sprite images
import leroySprite from '@/assets/leroy-sprite.png';
import jordanSprite from '@/assets/jordan-sprite.png';
import sifuSprite from '@/assets/sifu-sprite.png';
import razorSprite from '@/assets/razor-sprite.png';
import rootsmanSprite from '@/assets/rootsman-sprite.png';

export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EnhancedSpriteAnimation {
  frames: SpriteFrame[];
  duration: number;
  loop: boolean;
  frameEvents?: { frame: number; event: string }[];
}

export interface FighterSprites {
  idle: EnhancedSpriteAnimation;
  walking: EnhancedSpriteAnimation;
  attacking: EnhancedSpriteAnimation;
  blocking: EnhancedSpriteAnimation;
  hurt: EnhancedSpriteAnimation;
  jumping: EnhancedSpriteAnimation;
  crouching: EnhancedSpriteAnimation;
  special: EnhancedSpriteAnimation;
  victory: EnhancedSpriteAnimation;
  ko: EnhancedSpriteAnimation;
}

// Define frame dimensions - increased for Street Fighter detail
const FRAME_WIDTH = 128;
const FRAME_HEIGHT = 96;

// Helper function to create sprite frames
const createSpriteFrames = (row: number, count: number): SpriteFrame[] => {
  return Array.from({ length: count }, (_, i) => ({
    x: i * FRAME_WIDTH,
    y: row * FRAME_HEIGHT,
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT
  }));
};

// Enhanced fighter sprite data with Street Fighter-style timing
export const ENHANCED_FIGHTER_SPRITE_DATA: Record<string, FighterSprites> = {
  leroy: {
    idle: { frames: createSpriteFrames(0, 4), duration: 12, loop: true },
    walking: { frames: createSpriteFrames(1, 6), duration: 8, loop: true },
    attacking: { 
      frames: createSpriteFrames(2, 5), 
      duration: 4, 
      loop: false,
      frameEvents: [{ frame: 2, event: 'hit' }]
    },
    blocking: { frames: createSpriteFrames(3, 2), duration: 6, loop: true },
    hurt: { frames: createSpriteFrames(4, 3), duration: 8, loop: false },
    jumping: { frames: createSpriteFrames(5, 4), duration: 6, loop: false },
    crouching: { frames: createSpriteFrames(6, 2), duration: 8, loop: true },
    special: { 
      frames: createSpriteFrames(7, 8), 
      duration: 6, 
      loop: false,
      frameEvents: [
        { frame: 3, event: 'charge' },
        { frame: 5, event: 'release' }
      ]
    },
    victory: { frames: createSpriteFrames(8, 6), duration: 15, loop: false },
    ko: { frames: createSpriteFrames(9, 4), duration: 12, loop: false }
  },
  jordan: {
    idle: { frames: createSpriteFrames(0, 4), duration: 12, loop: true },
    walking: { frames: createSpriteFrames(1, 6), duration: 8, loop: true },
    attacking: { 
      frames: createSpriteFrames(2, 5), 
      duration: 4, 
      loop: false,
      frameEvents: [{ frame: 2, event: 'hit' }]
    },
    blocking: { frames: createSpriteFrames(3, 2), duration: 6, loop: true },
    hurt: { frames: createSpriteFrames(4, 3), duration: 8, loop: false },
    jumping: { frames: createSpriteFrames(5, 4), duration: 6, loop: false },
    crouching: { frames: createSpriteFrames(6, 2), duration: 8, loop: true },
    special: { 
      frames: createSpriteFrames(7, 8), 
      duration: 6, 
      loop: false,
      frameEvents: [
        { frame: 2, event: 'soundwave' },
        { frame: 4, event: 'bass_drop' }
      ]
    },
    victory: { frames: createSpriteFrames(8, 6), duration: 15, loop: false },
    ko: { frames: createSpriteFrames(9, 4), duration: 12, loop: false }
  },
  sifu: {
    idle: { frames: createSpriteFrames(0, 4), duration: 12, loop: true },
    walking: { frames: createSpriteFrames(1, 6), duration: 8, loop: true },
    attacking: { 
      frames: createSpriteFrames(2, 5), 
      duration: 4, 
      loop: false,
      frameEvents: [{ frame: 1, event: 'strike' }]
    },
    blocking: { frames: createSpriteFrames(3, 2), duration: 6, loop: true },
    hurt: { frames: createSpriteFrames(4, 3), duration: 8, loop: false },
    jumping: { frames: createSpriteFrames(5, 4), duration: 6, loop: false },
    crouching: { frames: createSpriteFrames(6, 2), duration: 8, loop: true },
    special: { 
      frames: createSpriteFrames(7, 8), 
      duration: 5, 
      loop: false,
      frameEvents: [
        { frame: 2, event: 'chi_gather' },
        { frame: 4, event: 'chi_blast' }
      ]
    },
    victory: { frames: createSpriteFrames(8, 6), duration: 15, loop: false },
    ko: { frames: createSpriteFrames(9, 4), duration: 12, loop: false }
  },
  razor: {
    idle: { frames: createSpriteFrames(0, 4), duration: 12, loop: true },
    walking: { frames: createSpriteFrames(1, 6), duration: 8, loop: true },
    attacking: { 
      frames: createSpriteFrames(2, 5), 
      duration: 3, 
      loop: false,
      frameEvents: [{ frame: 2, event: 'slash' }]
    },
    blocking: { frames: createSpriteFrames(3, 2), duration: 6, loop: true },
    hurt: { frames: createSpriteFrames(4, 3), duration: 8, loop: false },
    jumping: { frames: createSpriteFrames(5, 4), duration: 6, loop: false },
    crouching: { frames: createSpriteFrames(6, 2), duration: 8, loop: true },
    special: { 
      frames: createSpriteFrames(7, 8), 
      duration: 4, 
      loop: false,
      frameEvents: [
        { frame: 1, event: 'katana_draw' },
        { frame: 3, event: 'plasma_slash' }
      ]
    },
    victory: { frames: createSpriteFrames(8, 6), duration: 15, loop: false },
    ko: { frames: createSpriteFrames(9, 4), duration: 12, loop: false }
  },
  rootsman: {
    idle: { frames: createSpriteFrames(0, 4), duration: 12, loop: true },
    walking: { frames: createSpriteFrames(1, 6), duration: 8, loop: true },
    attacking: { 
      frames: createSpriteFrames(2, 5), 
      duration: 4, 
      loop: false,
      frameEvents: [{ frame: 2, event: 'nature_strike' }]
    },
    blocking: { frames: createSpriteFrames(3, 2), duration: 6, loop: true },
    hurt: { frames: createSpriteFrames(4, 3), duration: 8, loop: false },
    jumping: { frames: createSpriteFrames(5, 4), duration: 6, loop: false },
    crouching: { frames: createSpriteFrames(6, 2), duration: 8, loop: true },
    special: { 
      frames: createSpriteFrames(7, 8), 
      duration: 6, 
      loop: false,
      frameEvents: [
        { frame: 3, event: 'roots_emerge' },
        { frame: 5, event: 'nature_fury' }
      ]
    },
    victory: { frames: createSpriteFrames(8, 6), duration: 15, loop: false },
    ko: { frames: createSpriteFrames(9, 4), duration: 12, loop: false }
  }
};

export const useEnhancedSpriteSystem = () => {
  const spriteImages = useRef<Record<string, HTMLImageElement>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const animationCallbacks = useRef<Map<string, (event: string) => void>>(new Map());

  // Load sprite images
  useEffect(() => {
    const loadSprites = () => {
      console.log('useEnhancedSpriteSystem: Creating enhanced placeholder sprites...');
      
      // Create professional placeholder sprites for immediate visibility
      Object.keys(ENHANCED_FIGHTER_SPRITE_DATA).forEach(fighterId => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = FRAME_WIDTH;
        canvas.height = FRAME_HEIGHT;
        
        if (ctx) {
          // Fighter-specific colors for professional placeholders
          const colors = {
            leroy: { primary: '#00FFFF', secondary: '#008B8B', accent: '#FFD700', name: 'Leroy "Digital Dread"' },
            jordan: { primary: '#9966FF', secondary: '#6633CC', accent: '#FF6B35', name: 'Jordan "Bassline Warrior"' },
            sifu: { primary: '#FFD700', secondary: '#FFA500', accent: '#FF4500', name: 'Sifu "Temple Master"' },
            razor: { primary: '#FF0066', secondary: '#CC0044', accent: '#00FFFF', name: 'Razor "Cyber Samurai"' },
            rootsman: { primary: '#00FF00', secondary: '#008000', accent: '#FFFF00', name: 'Rootsman "Mystic"' }
          };
          
          const color = colors[fighterId as keyof typeof colors] || { primary: '#FFFFFF', secondary: '#CCCCCC', accent: '#999999', name: 'Unknown Fighter' };
          
          // Clear background
          ctx.clearRect(0, 0, FRAME_WIDTH, FRAME_HEIGHT);
          
          // Create professional fighter silhouette
          const centerX = FRAME_WIDTH / 2;
          const baseY = FRAME_HEIGHT - 10;
          
          // Main body with proper proportions
          ctx.fillStyle = color.primary;
          ctx.fillRect(centerX - 25, baseY - 90, 50, 65); // Torso
          
          // Head with proper size
          ctx.fillStyle = color.secondary;
          ctx.beginPath();
          ctx.arc(centerX, baseY - 105, 18, 0, Math.PI * 2);
          ctx.fill();
          
          // Arms with fighting stance
          ctx.fillStyle = color.primary;
          ctx.fillRect(centerX - 45, baseY - 85, 18, 35); // Left arm
          ctx.fillRect(centerX + 27, baseY - 85, 18, 35); // Right arm
          
          // Fighting gloves
          ctx.fillStyle = color.accent;
          ctx.beginPath();
          ctx.arc(centerX - 36, baseY - 50, 8, 0, Math.PI * 2);
          ctx.arc(centerX + 36, baseY - 50, 8, 0, Math.PI * 2);
          ctx.fill();
          
          // Strong legs with proper stance
          ctx.fillStyle = color.primary;
          ctx.fillRect(centerX - 18, baseY - 25, 15, 25); // Left leg
          ctx.fillRect(centerX + 3, baseY - 25, 15, 25); // Right leg
          
          // Character-specific details
          if (fighterId === 'leroy') {
            // Dreadlocks
            ctx.fillStyle = color.accent;
            ctx.fillRect(centerX - 25, baseY - 125, 50, 20);
            // Cyber elements
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(centerX - 27, baseY - 92, 54, 67);
          } else if (fighterId === 'jordan') {
            // Sound waves
            ctx.strokeStyle = color.accent;
            ctx.lineWidth = 3;
            for (let i = 1; i <= 3; i++) {
              ctx.beginPath();
              ctx.arc(centerX, baseY - 70, 20 * i, 0, Math.PI * 2);
              ctx.stroke();
            }
          } else if (fighterId === 'sifu') {
            // Martial arts aura
            ctx.strokeStyle = color.accent;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(centerX - 30, baseY - 95, 60, 70);
            ctx.setLineDash([]);
          }
          
          // Professional glow effect
          ctx.shadowColor = color.primary;
          ctx.shadowBlur = 15;
          ctx.strokeStyle = color.accent;
          ctx.lineWidth = 3;
          ctx.strokeRect(centerX - 27, baseY - 92, 54, 92);
          ctx.shadowBlur = 0;
        }
        
        const img = new Image();
        img.src = canvas.toDataURL();
        spriteImages.current[fighterId] = img;
        console.log(`useEnhancedSpriteSystem: Created professional placeholder for ${fighterId}`);
      });
      
      setIsLoaded(true);
      console.log('useEnhancedSpriteSystem: Professional placeholder sprites ready');
    };

    loadSprites();
  }, []);

  const getCurrentFrame = useCallback((
    fighterId: string,
    state: string,
    animationTimer: number
  ): { frame: SpriteFrame | null; frameIndex: number } => {
    const spriteData = ENHANCED_FIGHTER_SPRITE_DATA[fighterId];
    if (!spriteData) return { frame: null, frameIndex: 0 };

    const animation = spriteData[state as keyof FighterSprites] || spriteData.idle;
    const frameIndex = Math.floor(animationTimer / animation.duration) % animation.frames.length;
    
    // Trigger frame events
    if (animation.frameEvents) {
      const callback = animationCallbacks.current.get(fighterId);
      if (callback) {
        const currentFrameEvent = animation.frameEvents.find(event => event.frame === frameIndex);
        if (currentFrameEvent) {
          callback(currentFrameEvent.event);
        }
      }
    }
    
    return { frame: animation.frames[frameIndex], frameIndex };
  }, []);

  const registerAnimationCallback = useCallback((fighterId: string, callback: (event: string) => void) => {
    animationCallbacks.current.set(fighterId, callback);
  }, []);

  const drawEnhancedFighter = useCallback(async (
    ctx: CanvasRenderingContext2D,
    fighter: Fighter,
    effects: any = {}
  ) => {
    if (!fighter) {
      console.error('useEnhancedSpriteSystem: drawEnhancedFighter called with null fighter');
      return;
    }

    console.log(`useEnhancedSpriteSystem: Drawing enhanced fighter ${fighter.name}`, { 
      fighterPos: { x: fighter.x, y: fighter.y },
      state: fighter.state?.current || fighter.state,
      facing: fighter.facing,
      hasSprite: !!spriteImages.current[fighter.id]
    });

    const spriteImage = spriteImages.current[fighter.id];
    
    if (spriteImage && spriteImage.complete && spriteImage.naturalWidth > 0) {
      console.log(`useEnhancedSpriteSystem: Using sprite rendering for ${fighter.name}`);
      // Use sprite system
      const fighterState = typeof fighter.state === 'object' ? fighter.state.current : fighter.state;
      const currentFrame = getCurrentFrame(fighter.id, fighterState || 'idle', fighter.animation?.frameTimer || 0);
      
      if (currentFrame.frame) {
        try {
          ctx.save();
          
          // Apply effects
          if (effects.alpha !== undefined) {
            ctx.globalAlpha = effects.alpha;
          }
          
          if (effects.hueRotation) {
            ctx.filter = `hue-rotate(${effects.hueRotation}deg)`;
          }
          
          if (effects.shake) {
            ctx.translate(effects.shake.x, effects.shake.y);
          }
          
          // Handle sprite flipping based on facing direction
          const scaleX = fighter.facing === 'left' ? -1 : 1;
          ctx.translate(fighter.x + fighter.width / 2, fighter.y);
          ctx.scale(scaleX, 1);
          ctx.translate(-fighter.width / 2, 0);
          
          // Render sprite
          ctx.drawImage(
            spriteImage,
            currentFrame.frame.x,
            currentFrame.frame.y,
            currentFrame.frame.width,
            currentFrame.frame.height,
            0,
            0,
            fighter.width,
            fighter.height
          );
          
          ctx.restore();
          console.log(`useEnhancedSpriteSystem: Successfully rendered sprite for ${fighter.name}`);
          return;
        } catch (error) {
          console.error(`useEnhancedSpriteSystem: Error rendering sprite for ${fighter.name}:`, error);
        }
      } else {
        console.warn(`useEnhancedSpriteSystem: No current frame for ${fighter.name}, falling back`);
      }
    } else {
      console.log(`useEnhancedSpriteSystem: No sprite available for ${fighter.name}, using fallback`);
    }
    
    // Use authentic Street Fighter-style rendering instead of basic fallback
    try {
      const { renderAuthenticFighter } = await import('@/components/game/AuthenticFighterRenderer');
      console.log(`useEnhancedSpriteSystem: Using AuthenticFighterRenderer for ${fighter.name}`);
      renderAuthenticFighter({ ctx, fighter, effects });
    } catch (error) {
      console.error(`useEnhancedSpriteSystem: Failed to load AuthenticFighterRenderer, using basic fallback:`, error);
      // Ultra basic fallback - just draw a rectangle
      ctx.fillStyle = fighter.id === 'leroy' ? '#FF6B6B' : '#4ECDC4';
      ctx.fillRect(fighter.x, fighter.y - 100, 80, 100);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.fillText(fighter.name, fighter.x, fighter.y - 110);
    }
  }, [getCurrentFrame]);

  const getAnimationDuration = useCallback((fighterId: string, state: string): number => {
    const spriteData = ENHANCED_FIGHTER_SPRITE_DATA[fighterId];
    if (!spriteData) return 200;

    const animation = spriteData[state as keyof FighterSprites] || spriteData.idle;
    return animation.frames.length * animation.duration;
  }, []);

  const isAnimationComplete = useCallback((fighterId: string, state: string, animationTimer: number): boolean => {
    const spriteData = ENHANCED_FIGHTER_SPRITE_DATA[fighterId];
    if (!spriteData) return false;

    const animation = spriteData[state as keyof FighterSprites] || spriteData.idle;
    if (animation.loop) return false;
    
    return animationTimer >= (animation.frames.length * animation.duration);
  }, []);

  return {
    isLoaded,
    drawEnhancedFighter,
    getAnimationDuration,
    getCurrentFrame,
    registerAnimationCallback,
    isAnimationComplete
  };
};