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
    if (!isLoaded || !spriteImages.current[fighterId]) {
      // Enhanced fallback with character-specific styling and animations
      const fighterColors = {
        leroy: 'hsl(190, 100%, 50%)', // Cyan
        jordan: 'hsl(280, 100%, 60%)', // Purple/Magenta
        sifu: 'hsl(45, 100%, 50%)', // Golden
        razor: 'hsl(120, 100%, 40%)', // Green
        rootsman: 'hsl(100, 60%, 40%)' // Earth green
      };
      
      // Create more detailed fallback character representation
      ctx.save();
      
      // Body
      ctx.fillStyle = effects?.color || fighterColors[fighterId as keyof typeof fighterColors] || 'hsl(180, 100%, 50%)';
      ctx.fillRect(x + width * 0.25, y + height * 0.3, width * 0.5, height * 0.4);
      
      // Head
      ctx.fillStyle = 'hsl(30, 30%, 70%)'; // Skin color
      ctx.fillRect(x + width * 0.3, y + height * 0.1, width * 0.4, height * 0.25);
      
      // Arms
      ctx.fillStyle = effects?.color || fighterColors[fighterId as keyof typeof fighterColors] || 'hsl(180, 100%, 50%)';
      ctx.fillRect(x + width * 0.1, y + height * 0.35, width * 0.15, height * 0.3);
      ctx.fillRect(x + width * 0.75, y + height * 0.35, width * 0.15, height * 0.3);
      
      // Legs
      ctx.fillRect(x + width * 0.3, y + height * 0.7, width * 0.15, height * 0.3);
      ctx.fillRect(x + width * 0.55, y + height * 0.7, width * 0.15, height * 0.3);
      
      // Add character name and loading indicator
      ctx.fillStyle = 'white';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(fighterId.toUpperCase(), x + width/2, y - 5);
      
      // Loading indicator (pulsing dot)
      const pulse = Math.sin(animationTimer * 0.1) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
      ctx.beginPath();
      ctx.arc(x + width/2, y + height + 15, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      return;
    }

    const spriteImg = spriteImages.current[fighterId];
    const frame = getCurrentFrame(fighterId, state, animationTimer);
    
    if (!frame) return;

    ctx.save();

    // Apply special effects
    if (effects?.special) {
      ctx.shadowColor = effects.color || 'hsl(180, 100%, 50%)';
      ctx.shadowBlur = 20;
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

    // Draw the sprite frame
    ctx.drawImage(
      spriteImg,
      frame.x, frame.y, frame.width, frame.height, // Source rectangle
      x, y, width, height // Destination rectangle
    );

    ctx.restore();
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