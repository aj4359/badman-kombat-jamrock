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

// Sprite frame definitions (assuming 8 frames per row, 128x128 per frame)
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
      
      // Load Leroy sprite
      const leroyImg = new Image();
      leroyImg.src = leroySprite;
      await new Promise((resolve) => {
        leroyImg.onload = resolve;
      });
      sprites.leroy = leroyImg;

      // Load Jordan sprite
      const jordanImg = new Image();
      jordanImg.src = jordanSprite;
      await new Promise((resolve) => {
        jordanImg.onload = resolve;
      });
      sprites.jordan = jordanImg;

      // Load Sifu sprite
      const sifuImg = new Image();
      sifuImg.src = sifuSprite;
      await new Promise((resolve) => {
        sifuImg.onload = resolve;
      });
      sprites.sifu = sifuImg;

      // Load Razor sprite
      const razorImg = new Image();
      razorImg.src = razorSprite;
      await new Promise((resolve) => {
        razorImg.onload = resolve;
      });
      sprites.razor = razorImg;

      // Load Rootsman sprite
      const rootsmanImg = new Image();
      rootsmanImg.src = rootsmanSprite;
      await new Promise((resolve) => {
        rootsmanImg.onload = resolve;
      });
      sprites.rootsman = rootsmanImg;

      spriteImages.current = sprites;
      setIsLoaded(true);
    };

    loadSprites().catch(console.error);
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
      // Fallback to colored rectangle if sprites not loaded
      ctx.fillStyle = effects?.color || 'hsl(180, 100%, 50%)';
      ctx.fillRect(x, y, width, height);
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