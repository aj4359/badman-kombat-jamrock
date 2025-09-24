import { useRef, useCallback, useEffect, useState } from 'react';
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

export interface SpriteAnimation {
  frames: SpriteFrame[];
  duration: number;
  loop: boolean;
}

export interface FighterSprites {
  idle: SpriteAnimation;
  walking: SpriteAnimation;
  jumping: SpriteAnimation;
  attacking: SpriteAnimation;
  hurt: SpriteAnimation;
  blocking: SpriteAnimation;
  special: SpriteAnimation;
}

// Sprite frame definitions for Street Fighter style sprites (8 frames per row, 128x128 per frame)
const FRAME_WIDTH = 128;
const FRAME_HEIGHT = 128; // Proper square frames for detailed fighter sprites

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

// Define sprite animations for each character
const FIGHTER_SPRITE_DATA: Record<string, FighterSprites> = {
  leroy: {
    idle: { frames: createSpriteFrames(0, 4), duration: 150, loop: true },
    walking: { frames: createSpriteFrames(1, 6), duration: 100, loop: true },
    jumping: { frames: createSpriteFrames(2, 3), duration: 200, loop: false },
    attacking: { frames: createSpriteFrames(3, 5), duration: 80, loop: false },
    hurt: { frames: createSpriteFrames(4, 3), duration: 120, loop: false },
    blocking: { frames: createSpriteFrames(5, 2), duration: 200, loop: true },
    special: { frames: createSpriteFrames(6, 8), duration: 60, loop: false }
  },
  jordan: {
    idle: { frames: createSpriteFrames(0, 4), duration: 150, loop: true },
    walking: { frames: createSpriteFrames(1, 6), duration: 100, loop: true },
    jumping: { frames: createSpriteFrames(2, 3), duration: 200, loop: false },
    attacking: { frames: createSpriteFrames(3, 5), duration: 80, loop: false },
    hurt: { frames: createSpriteFrames(4, 3), duration: 120, loop: false },
    blocking: { frames: createSpriteFrames(5, 2), duration: 200, loop: true },
    special: { frames: createSpriteFrames(6, 8), duration: 60, loop: false }
  },
  sifu: {
    idle: { frames: createSpriteFrames(0, 4), duration: 150, loop: true },
    walking: { frames: createSpriteFrames(1, 6), duration: 100, loop: true },
    jumping: { frames: createSpriteFrames(2, 3), duration: 200, loop: false },
    attacking: { frames: createSpriteFrames(3, 5), duration: 80, loop: false },
    hurt: { frames: createSpriteFrames(4, 3), duration: 120, loop: false },
    blocking: { frames: createSpriteFrames(5, 2), duration: 200, loop: true },
    special: { frames: createSpriteFrames(6, 8), duration: 60, loop: false }
  },
  razor: {
    idle: { frames: createSpriteFrames(0, 4), duration: 150, loop: true },
    walking: { frames: createSpriteFrames(1, 6), duration: 100, loop: true },
    jumping: { frames: createSpriteFrames(2, 3), duration: 200, loop: false },
    attacking: { frames: createSpriteFrames(3, 5), duration: 80, loop: false },
    hurt: { frames: createSpriteFrames(4, 3), duration: 120, loop: false },
    blocking: { frames: createSpriteFrames(5, 2), duration: 200, loop: true },
    special: { frames: createSpriteFrames(6, 8), duration: 60, loop: false }
  },
  rootsman: {
    idle: { frames: createSpriteFrames(0, 4), duration: 150, loop: true },
    walking: { frames: createSpriteFrames(1, 6), duration: 100, loop: true },
    jumping: { frames: createSpriteFrames(2, 3), duration: 200, loop: false },
    attacking: { frames: createSpriteFrames(3, 5), duration: 80, loop: false },
    hurt: { frames: createSpriteFrames(4, 3), duration: 120, loop: false },
    blocking: { frames: createSpriteFrames(5, 2), duration: 200, loop: true },
    special: { frames: createSpriteFrames(6, 8), duration: 60, loop: false }
  }
};

export const useSpriteSystem = () => {
  const spriteImages = useRef<Record<string, HTMLImageElement>>({});
  const [isLoaded, setIsLoaded] = useState(false);

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
              resolve(null); // Continue loading other sprites
            };
            // Set a timeout to prevent hanging
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
        console.log('Sprite system loaded. Available sprites:', Object.keys(sprites));
      } catch (error) {
        console.error('Error loading sprites:', error);
        setIsLoaded(true); // Still set loaded to true to use fallback
      }
    };

    loadSprites();
  }, []);

  const getCurrentFrame = useCallback((
    fighterId: string,
    state: string,
    animationTimer: number
  ): SpriteFrame | null => {
    const spriteData = FIGHTER_SPRITE_DATA[fighterId];
    if (!spriteData) return null;

    const animation = spriteData[state as keyof FighterSprites] || spriteData.idle;
    const frameIndex = Math.floor(animationTimer / animation.duration) % animation.frames.length;
    
    return animation.frames[frameIndex];
  }, []);

  const drawFighter = useCallback((
    ctx: CanvasRenderingContext2D,
    fighterId: string,
    x: number,
    y: number,
    width: number,
    height: number,
    state: string,
    animationTimer: number,
    facing: 'left' | 'right',
    effects?: {
      hurt?: boolean;
      special?: boolean;
      color?: string;
    }
  ) => {
    // Always try to use sprites first, create better fallback if needed
    const spriteImg = spriteImages.current[fighterId];
    const frame = getCurrentFrame(fighterId, state, animationTimer);
    
    if (spriteImg && frame && spriteImg.complete && spriteImg.naturalWidth > 0) {
      // Use actual sprite rendering
      ctx.save();

      // Apply special effects
      if (effects?.special) {
        ctx.shadowColor = effects.color || 'hsl(180, 100%, 50%)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      if (effects?.hurt) {
        ctx.globalAlpha = 0.7;
        ctx.filter = 'hue-rotate(0deg) saturate(150%) brightness(120%)';
      }

      // Flip sprite if facing left
      if (facing === 'left') {
        ctx.scale(-1, 1);
        ctx.translate(-x - width, 0);
      }

      // Draw the sprite frame with proper scaling
      ctx.imageSmoothingEnabled = false; // Pixel art style
      ctx.drawImage(
        spriteImg,
        frame.x, frame.y, frame.width, frame.height, // Source rectangle
        x, y, width, height // Destination rectangle
      );

      ctx.restore();
    } else {
      // Street Fighter-style detailed fallback when sprites aren't available
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

      const profile = fighterProfiles[fighterId as keyof typeof fighterProfiles] || fighterProfiles.leroy;
      
      ctx.save();
      
      // Animation effects based on state
      let offsetY = 0;
      let scaleX = 1;
      let headTilt = 0;
      
      if (state === 'walking') {
        offsetY = Math.sin(animationTimer * 0.2) * 2;
      } else if (state === 'attacking') {
        scaleX = facing === 'right' ? 1.1 : 0.9;
      } else if (state === 'hurt') {
        headTilt = facing === 'right' ? -0.1 : 0.1;
        offsetY = 3;
      } else if (state === 'jumping') {
        offsetY = -10;
      }

      ctx.translate(x + width/2, y + height/2);
      ctx.scale(scaleX, 1);
      ctx.rotate(headTilt);
      ctx.translate(-width/2, -height/2 + offsetY);

      // Head with more detail
      ctx.fillStyle = profile.colors.skin;
      ctx.fillRect(width * 0.25, height * 0.05, width * 0.5, height * 0.3);
      
      // Eyes
      ctx.fillStyle = 'black';
      ctx.fillRect(width * 0.3, height * 0.15, width * 0.08, height * 0.05);
      ctx.fillRect(width * 0.62, height * 0.15, width * 0.08, height * 0.05);
      
      // Hair/headband based on character
      if (profile.style === 'rasta') {
        ctx.fillStyle = 'hsl(25, 60%, 20%)';
        ctx.fillRect(width * 0.2, height * 0.02, width * 0.6, height * 0.15);
      } else if (profile.style === 'ninja') {
        ctx.fillStyle = 'hsl(0, 0%, 10%)';
        ctx.fillRect(width * 0.15, height * 0.02, width * 0.7, height * 0.25);
      }

      // Torso/Gi
      ctx.fillStyle = effects?.special ? 
        `hsl(${Math.sin(animationTimer * 0.3) * 60 + 180}, 100%, 70%)` : 
        profile.colors.gi;
      ctx.fillRect(width * 0.2, height * 0.35, width * 0.6, height * 0.45);
      
      // Belt
      ctx.fillStyle = profile.colors.belt;
      ctx.fillRect(width * 0.15, height * 0.55, width * 0.7, height * 0.08);
      
      // Arms with fighting pose
      ctx.fillStyle = profile.colors.skin;
      if (state === 'attacking') {
        // Extended arm
        ctx.fillRect(width * 0.8, height * 0.4, width * 0.15, height * 0.25);
        ctx.fillRect(width * 0.05, height * 0.45, width * 0.15, height * 0.2);
      } else {
        // Guard position
        ctx.fillRect(width * 0.75, height * 0.38, width * 0.15, height * 0.3);
        ctx.fillRect(width * 0.1, height * 0.38, width * 0.15, height * 0.3);
      }
      
      // Legs in fighting stance
      ctx.fillStyle = profile.colors.gi;
      ctx.fillRect(width * 0.25, height * 0.8, width * 0.2, height * 0.2);
      ctx.fillRect(width * 0.55, height * 0.8, width * 0.2, height * 0.2);
      
      // Feet
      ctx.fillStyle = 'hsl(0, 0%, 20%)';
      ctx.fillRect(width * 0.2, height * 0.95, width * 0.25, height * 0.05);
      ctx.fillRect(width * 0.55, height * 0.95, width * 0.25, height * 0.05);

      // Character name and sprite loading status
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(fighterId.toUpperCase(), width/2, -8);
      
      // Subtle loading indicator
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '8px monospace';
      ctx.fillText('SPRITE LOADING...', width/2, height + 20);

      ctx.restore();
    }
  }, [isLoaded, getCurrentFrame]);

  const getAnimationDuration = useCallback((fighterId: string, state: string): number => {
    const spriteData = FIGHTER_SPRITE_DATA[fighterId];
    if (!spriteData) return 200;

    const animation = spriteData[state as keyof FighterSprites] || spriteData.idle;
    return animation.frames.length * animation.duration;
  }, []);

  return {
    isLoaded,
    drawFighter,
    getAnimationDuration,
    getCurrentFrame
  };
};