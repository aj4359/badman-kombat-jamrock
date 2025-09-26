import { useRef, useCallback, useEffect, useState } from 'react';
import { Fighter } from '@/types/gameTypes';
import leroySprite from '@/assets/leroy-sprite-sheet.png';
import jordanSprite from '@/assets/jordan-sprite-sheet.png';
import sifuSprite from '@/assets/sifu-sprite-sheet.png';
import razorSprite from '@/assets/razor-sprite-sheet.png';
import rootsmanSprite from '@/assets/rootsman-sprite-sheet.png';

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
  frameEvents?: { frame: number; event: string }[]; // For triggering effects
}

export interface FighterSprites {
  idle: EnhancedSpriteAnimation;
  walking: EnhancedSpriteAnimation;
  jumping: EnhancedSpriteAnimation;
  attacking: EnhancedSpriteAnimation;
  hurt: EnhancedSpriteAnimation;
  blocking: EnhancedSpriteAnimation;
  special: EnhancedSpriteAnimation;
  stunned: EnhancedSpriteAnimation;
  ko: EnhancedSpriteAnimation;
  victory: EnhancedSpriteAnimation;
}

// Enhanced sprite frame definitions for Street Fighter style sprites
const FRAME_WIDTH = 128;
const FRAME_HEIGHT = 128;

const createSpriteFrames = (row: number, count: number): SpriteFrame[] => {
  const frames: SpriteFrame[] = [];
  for (let i = 0; i < count; i++) {
    frames.push({
      x: i * FRAME_WIDTH,
      y: row * FRAME_HEIGHT,
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT
    });
  }
  return frames;
};

// Enhanced fighter sprite data with more detailed animations
const ENHANCED_FIGHTER_SPRITE_DATA: Record<string, FighterSprites> = {
  leroy: {
    idle: { 
      frames: createSpriteFrames(0, 4), 
      duration: 150, 
      loop: true 
    },
    walking: { 
      frames: createSpriteFrames(1, 6), 
      duration: 100, 
      loop: true,
      frameEvents: [
        { frame: 2, event: 'footstep' },
        { frame: 5, event: 'footstep' }
      ]
    },
    jumping: { 
      frames: createSpriteFrames(2, 4), 
      duration: 200, 
      loop: false 
    },
    attacking: { 
      frames: createSpriteFrames(3, 5), 
      duration: 80, 
      loop: false,
      frameEvents: [
        { frame: 2, event: 'impact' }
      ]
    },
    hurt: { 
      frames: createSpriteFrames(4, 3), 
      duration: 120, 
      loop: false 
    },
    blocking: { 
      frames: createSpriteFrames(5, 2), 
      duration: 200, 
      loop: true 
    },
    special: { 
      frames: createSpriteFrames(6, 8), 
      duration: 60, 
      loop: false,
      frameEvents: [
        { frame: 3, event: 'special_charge' },
        { frame: 5, event: 'special_release' }
      ]
    },
    stunned: { 
      frames: createSpriteFrames(7, 3), 
      duration: 150, 
      loop: true 
    },
    ko: { 
      frames: createSpriteFrames(8, 4), 
      duration: 300, 
      loop: false 
    },
    victory: { 
      frames: createSpriteFrames(9, 6), 
      duration: 120, 
      loop: true 
    }
  },
  jordan: {
    idle: { frames: createSpriteFrames(0, 4), duration: 150, loop: true },
    walking: { 
      frames: createSpriteFrames(1, 6), 
      duration: 90, 
      loop: true,
      frameEvents: [{ frame: 2, event: 'footstep' }, { frame: 5, event: 'footstep' }]
    },
    jumping: { frames: createSpriteFrames(2, 4), duration: 180, loop: false },
    attacking: { 
      frames: createSpriteFrames(3, 5), 
      duration: 70, 
      loop: false,
      frameEvents: [{ frame: 2, event: 'impact' }]
    },
    hurt: { frames: createSpriteFrames(4, 3), duration: 110, loop: false },
    blocking: { frames: createSpriteFrames(5, 2), duration: 200, loop: true },
    special: { 
      frames: createSpriteFrames(6, 8), 
      duration: 50, 
      loop: false,
      frameEvents: [{ frame: 3, event: 'special_charge' }, { frame: 5, event: 'special_release' }]
    },
    stunned: { frames: createSpriteFrames(7, 3), duration: 140, loop: true },
    ko: { frames: createSpriteFrames(8, 4), duration: 280, loop: false },
    victory: { frames: createSpriteFrames(9, 6), duration: 100, loop: true }
  },
  sifu: {
    idle: { frames: createSpriteFrames(0, 4), duration: 160, loop: true },
    walking: { 
      frames: createSpriteFrames(1, 6), 
      duration: 120, 
      loop: true,
      frameEvents: [{ frame: 2, event: 'footstep' }, { frame: 5, event: 'footstep' }]
    },
    jumping: { frames: createSpriteFrames(2, 4), duration: 220, loop: false },
    attacking: { 
      frames: createSpriteFrames(3, 5), 
      duration: 90, 
      loop: false,
      frameEvents: [{ frame: 2, event: 'impact' }]
    },
    hurt: { frames: createSpriteFrames(4, 3), duration: 130, loop: false },
    blocking: { frames: createSpriteFrames(5, 2), duration: 250, loop: true },
    special: { 
      frames: createSpriteFrames(6, 8), 
      duration: 70, 
      loop: false,
      frameEvents: [{ frame: 3, event: 'special_charge' }, { frame: 5, event: 'special_release' }]
    },
    stunned: { frames: createSpriteFrames(7, 3), duration: 160, loop: true },
    ko: { frames: createSpriteFrames(8, 4), duration: 320, loop: false },
    victory: { frames: createSpriteFrames(9, 6), duration: 140, loop: true }
  },
  razor: {
    idle: { frames: createSpriteFrames(0, 4), duration: 140, loop: true },
    walking: { 
      frames: createSpriteFrames(1, 6), 
      duration: 110, 
      loop: true,
      frameEvents: [{ frame: 2, event: 'footstep' }, { frame: 5, event: 'footstep' }]
    },
    jumping: { frames: createSpriteFrames(2, 4), duration: 190, loop: false },
    attacking: { 
      frames: createSpriteFrames(3, 5), 
      duration: 60, 
      loop: false,
      frameEvents: [{ frame: 2, event: 'impact' }]
    },
    hurt: { frames: createSpriteFrames(4, 3), duration: 100, loop: false },
    blocking: { frames: createSpriteFrames(5, 2), duration: 180, loop: true },
    special: { 
      frames: createSpriteFrames(6, 8), 
      duration: 40, 
      loop: false,
      frameEvents: [{ frame: 3, event: 'special_charge' }, { frame: 5, event: 'special_release' }]
    },
    stunned: { frames: createSpriteFrames(7, 3), duration: 120, loop: true },
    ko: { frames: createSpriteFrames(8, 4), duration: 260, loop: false },
    victory: { frames: createSpriteFrames(9, 6), duration: 80, loop: true }
  },
  rootsman: {
    idle: { frames: createSpriteFrames(0, 4), duration: 155, loop: true },
    walking: { 
      frames: createSpriteFrames(1, 6), 
      duration: 105, 
      loop: true,
      frameEvents: [{ frame: 2, event: 'footstep' }, { frame: 5, event: 'footstep' }]
    },
    jumping: { frames: createSpriteFrames(2, 4), duration: 200, loop: false },
    attacking: { 
      frames: createSpriteFrames(3, 5), 
      duration: 85, 
      loop: false,
      frameEvents: [{ frame: 2, event: 'impact' }]
    },
    hurt: { frames: createSpriteFrames(4, 3), duration: 125, loop: false },
    blocking: { frames: createSpriteFrames(5, 2), duration: 210, loop: true },
    special: { 
      frames: createSpriteFrames(6, 8), 
      duration: 65, 
      loop: false,
      frameEvents: [{ frame: 3, event: 'special_charge' }, { frame: 5, event: 'special_release' }]
    },
    stunned: { frames: createSpriteFrames(7, 3), duration: 145, loop: true },
    ko: { frames: createSpriteFrames(8, 4), duration: 290, loop: false },
    victory: { frames: createSpriteFrames(9, 6), duration: 110, loop: true }
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

  const drawEnhancedFighter = useCallback((
    ctx: CanvasRenderingContext2D,
    fighter: Fighter,
    animationTimer: number,
    effects?: {
      hurt?: boolean;
      special?: boolean;
      blocking?: boolean;
      screenShake?: { x: number; y: number };
      glow?: string;
      alpha?: number;
    }
  ) => {
    const { frame } = getCurrentFrame(fighter.id, fighter.state.current, animationTimer);
    const spriteImg = spriteImages.current[fighter.id];
    
    if (spriteImg && frame && spriteImg.complete && spriteImg.naturalWidth > 0) {
      ctx.save();

      // Apply screen shake
      if (effects?.screenShake) {
        ctx.translate(effects.screenShake.x, effects.screenShake.y);
      }

      // Apply special effects
      if (effects?.special) {
        ctx.shadowColor = fighter.colors.aura;
        ctx.shadowBlur = 25;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      if (effects?.glow) {
        ctx.shadowColor = effects.glow;
        ctx.shadowBlur = 30;
      }

      if (effects?.hurt) {
        ctx.globalAlpha = 0.6;
        ctx.filter = 'hue-rotate(10deg) saturate(200%) brightness(150%)';
      }

      if (effects?.blocking) {
        ctx.filter = 'brightness(80%) contrast(120%)';
      }

      if (effects?.alpha !== undefined) {
        ctx.globalAlpha = effects.alpha;
      }

      // Flip sprite based on facing direction
      if (fighter.facing === 'left') {
        ctx.scale(-1, 1);
        ctx.translate(-fighter.x - fighter.width, 0);
      }

      // Enhanced pixel art rendering
      ctx.imageSmoothingEnabled = false;
      
      // Draw the sprite frame
      ctx.drawImage(
        spriteImg,
        frame.x, frame.y, frame.width, frame.height,
        fighter.x, fighter.y, fighter.width, fighter.height
      );

      ctx.restore();
    } else {
      // Enhanced fallback with Street Fighter-style character details
      drawEnhancedFallback(ctx, fighter, animationTimer, effects);
    }
  }, [getCurrentFrame]);

  const drawEnhancedFallback = useCallback((
    ctx: CanvasRenderingContext2D,
    fighter: Fighter,
    animationTimer: number,
    effects?: any
  ) => {
    const fighterProfiles = {
      leroy: {
        colors: { gi: 'hsl(190, 80%, 45%)', skin: 'hsl(30, 40%, 60%)', belt: 'hsl(45, 100%, 50%)' },
        style: 'karate'
      },
      jordan: {
        colors: { gi: 'hsl(280, 70%, 50%)', skin: 'hsl(25, 35%, 55%)', belt: 'hsl(0, 80%, 50%)' },
        style: 'boxing'
      },
      sifu: {
        colors: { gi: 'hsl(45, 85%, 55%)', skin: 'hsl(35, 45%, 65%)', belt: 'hsl(120, 60%, 40%)' },
        style: 'kung-fu'
      },
      razor: {
        colors: { gi: 'hsl(120, 70%, 40%)', skin: 'hsl(20, 30%, 50%)', belt: 'hsl(240, 70%, 50%)' },
        style: 'ninja'
      },
      rootsman: {
        colors: { gi: 'hsl(100, 60%, 35%)', skin: 'hsl(25, 50%, 45%)', belt: 'hsl(60, 80%, 45%)' },
        style: 'rasta'
      }
    };

    const profile = fighterProfiles[fighter.id as keyof typeof fighterProfiles] || fighterProfiles.leroy;
    
    ctx.save();
    
    // Enhanced animation effects
    let offsetY = 0;
    let scaleX = 1;
    let headTilt = 0;
    let armExtension = 0;
    
    switch (fighter.state.current) {
      case 'walking':
        offsetY = Math.sin(animationTimer * 0.3) * 3;
        break;
      case 'attacking':
        scaleX = fighter.facing === 'right' ? 1.15 : 0.85;
        armExtension = 0.2;
        break;
      case 'hurt':
        headTilt = fighter.facing === 'right' ? -0.15 : 0.15;
        offsetY = 5;
        break;
      case 'jumping':
        offsetY = -15;
        break;
      case 'special':
        const pulse = Math.sin(animationTimer * 0.5) * 0.1;
        scaleX = 1 + pulse;
        break;
      case 'blocking':
        scaleX = 0.9;
        break;
    }

    // Apply screen shake
    if (effects?.screenShake) {
      ctx.translate(effects.screenShake.x, effects.screenShake.y);
    }

    ctx.translate(fighter.x + fighter.width/2, fighter.y + fighter.height/2);
    ctx.scale(scaleX, 1);
    ctx.rotate(headTilt);
    ctx.translate(-fighter.width/2, -fighter.height/2 + offsetY);

    // Enhanced character rendering with more detail
    
    // Head
    ctx.fillStyle = profile.colors.skin;
    ctx.fillRect(fighter.width * 0.25, fighter.height * 0.05, fighter.width * 0.5, fighter.height * 0.3);
    
    // Eyes with animation
    ctx.fillStyle = 'black';
    const eyeY = fighter.height * 0.15 + (fighter.state.current === 'hurt' ? 2 : 0);
    ctx.fillRect(fighter.width * 0.3, eyeY, fighter.width * 0.08, fighter.height * 0.05);
    ctx.fillRect(fighter.width * 0.62, eyeY, fighter.width * 0.08, fighter.height * 0.05);
    
    // Character-specific features
    if (profile.style === 'rasta') {
      ctx.fillStyle = 'hsl(25, 60%, 20%)';
      ctx.fillRect(fighter.width * 0.2, fighter.height * 0.02, fighter.width * 0.6, fighter.height * 0.15);
    } else if (profile.style === 'ninja') {
      ctx.fillStyle = 'hsl(0, 0%, 10%)';
      ctx.fillRect(fighter.width * 0.15, fighter.height * 0.02, fighter.width * 0.7, fighter.height * 0.25);
    }

    // Torso with special effects
    if (effects?.special) {
      ctx.fillStyle = `hsl(${Math.sin(animationTimer * 0.4) * 60 + 180}, 100%, 70%)`;
      ctx.shadowColor = fighter.colors.aura;
      ctx.shadowBlur = 20;
    } else {
      ctx.fillStyle = profile.colors.gi;
    }
    ctx.fillRect(fighter.width * 0.2, fighter.height * 0.35, fighter.width * 0.6, fighter.height * 0.45);
    
    // Belt
    ctx.fillStyle = profile.colors.belt;
    ctx.fillRect(fighter.width * 0.15, fighter.height * 0.55, fighter.width * 0.7, fighter.height * 0.08);
    
    // Enhanced arms with fighting poses
    ctx.fillStyle = profile.colors.skin;
    if (fighter.state.current === 'attacking') {
      // Attacking pose
      ctx.fillRect(fighter.width * (0.8 + armExtension), fighter.height * 0.4, fighter.width * 0.15, fighter.height * 0.25);
      ctx.fillRect(fighter.width * 0.05, fighter.height * 0.45, fighter.width * 0.15, fighter.height * 0.2);
    } else if (fighter.state.current === 'blocking') {
      // Defensive pose
      ctx.fillRect(fighter.width * 0.7, fighter.height * 0.35, fighter.width * 0.15, fighter.height * 0.3);
      ctx.fillRect(fighter.width * 0.15, fighter.height * 0.35, fighter.width * 0.15, fighter.height * 0.3);
    } else {
      // Guard position
      ctx.fillRect(fighter.width * 0.75, fighter.height * 0.38, fighter.width * 0.15, fighter.height * 0.3);
      ctx.fillRect(fighter.width * 0.1, fighter.height * 0.38, fighter.width * 0.15, fighter.height * 0.3);
    }
    
    // Legs with stance
    ctx.fillStyle = profile.colors.gi;
    ctx.fillRect(fighter.width * 0.25, fighter.height * 0.8, fighter.width * 0.2, fighter.height * 0.2);
    ctx.fillRect(fighter.width * 0.55, fighter.height * 0.8, fighter.width * 0.2, fighter.height * 0.2);
    
    // Feet
    ctx.fillStyle = 'hsl(0, 0%, 20%)';
    ctx.fillRect(fighter.width * 0.2, fighter.height * 0.95, fighter.width * 0.25, fighter.height * 0.05);
    ctx.fillRect(fighter.width * 0.55, fighter.height * 0.95, fighter.width * 0.25, fighter.height * 0.05);

    // Character name and status
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(fighter.name.split(' ')[0].toUpperCase(), fighter.width/2, -8);
    
    if (!spriteImages.current[fighter.id]) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '6px monospace';
      ctx.fillText('LOADING SPRITE...', fighter.width/2, fighter.height + 15);
    }

    ctx.restore();
  }, []);

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