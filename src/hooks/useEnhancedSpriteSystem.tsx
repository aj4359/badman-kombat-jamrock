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
    const loadSprites = async () => {
      const sprites: Record<string, HTMLImageElement> = {};
      const spriteMap = {
        leroy: leroySprite,
        jordan: jordanSprite,
        sifu: sifuSprite,
        razor: razorSprite,
        rootsman: rootsmanSprite
      };
      
      try {
        for (const [key, src] of Object.entries(spriteMap)) {
          const img = new Image();
          img.src = src;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => {
              console.warn(`Failed to load sprite for ${key}:`, src);
              resolve(null);
            };
            setTimeout(() => {
              console.warn(`Sprite loading timeout for ${key}`);
              resolve(null);
            }, 5000);
          });
          
          if (img.complete && img.naturalWidth > 0) {
            sprites[key] = img;
            console.log(`Successfully loaded sprite for ${key}`);
          }
        }

        spriteImages.current = sprites;
        setIsLoaded(true);
        console.log('Enhanced sprite system loaded. Available sprites:', Object.keys(sprites));
      } catch (error) {
        console.error('Error loading sprites:', error);
        setIsLoaded(true);
      }
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
    const spriteImage = spriteImages.current[fighter.id];
    
    if (spriteImage && spriteImage.complete && spriteImage.naturalWidth > 0) {
      // Use sprite system
      const currentFrame = getCurrentFrame(fighter.id, fighter.state.current, fighter.animation?.frameTimer || 0);
      
      if (currentFrame.frame) {
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
        return;
      }
    }
    
    // Use authentic Street Fighter-style rendering instead of basic fallback
    const { renderAuthenticFighter } = await import('@/components/game/AuthenticFighterRenderer');
    renderAuthenticFighter({ ctx, fighter, effects });
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